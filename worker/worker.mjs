const ORIGINS = new Set(['https://bytecatstudio.com', 'https://www.bytecatstudio.com', 'https://bytecatwebsite.vercel.app']);
const ZIP = 'https://raw.githubusercontent.com/bytecatglobal/bytecatwebsite/e9854368be4449b8a883844666a97585fc98787a/launch/Byte-Cat-Studio-Free-Calendars-2027.zip';
const VERSION = '2026-10-26';
const common = {'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'no-referrer'};
function json(data, status = 200, origin = '') {
 return Response.json(data, {status, headers:{...common, ...(ORIGINS.has(origin) ? {'Access-Control-Allow-Origin':origin, 'Vary':'Origin'} : {})}});
}
async function limitedJSON(request) {
 const reader = request.body?.getReader();
 if (!reader) throw new Error('body');
 let size = 0; const chunks = [];
 while (true) { const {done,value} = await reader.read(); if(done)break; size += value.length; if(size > 2048){await reader.cancel();throw new Error('body');} chunks.push(value); }
 const bytes = new Uint8Array(size); let offset = 0;
 for (const chunk of chunks) {bytes.set(chunk,offset);offset += chunk.length;}
 return JSON.parse(new TextDecoder().decode(bytes));
}
export async function handle(request, env, fetchFile = fetch) {
 const url = new URL(request.url), origin = request.headers.get('Origin') || '';
 if (url.pathname === '/subscribe') {
  if (!ORIGINS.has(origin)) return json({error:'This form is available at bytecatstudio.com.'},403);
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:{...common,'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'}});
  if (request.method !== 'POST') return json({error:'Use the website signup form.'},405,origin);
  if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) return json({error:'Invalid request.'},415,origin);
  let data;
  try {data = await limitedJSON(request);} catch {return json({error:'Invalid request. Please try again.'},400,origin);}
  const email = typeof data?.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (data?.website || typeof data?.marketing !== 'boolean' || email.length > 254 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:[.][a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(email)) return json({error:'Enter a valid email address and try again.'},400,origin);
  try {
   const now = Math.floor(Date.now()/1000), db = env.DB;
   const salt = await db.prepare("SELECT value FROM settings WHERE key='rate_salt'").first('value');
   if (!salt) throw new Error('Storage unavailable');
   const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
   const hash = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${salt}:${ip}:${Math.floor(now/3600)}`));
   const key = Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');
   const rate = await db.prepare('INSERT INTO rate_limits(key,requests,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET requests=requests+1 RETURNING requests').bind(key,now+3600).first('requests');
   if (rate > 10) return json({error:'Too many requests. Please try again in an hour.'},429,origin);
   const token = crypto.randomUUID(), marketing = data.marketing ? 1 : 0;
   // D1 batch is atomic: no download is issued if saving either email or consent fails.
   await db.batch([
    db.prepare('INSERT INTO subscribers(email,marketing_opt_in,created_at,updated_at) VALUES(?,?,?,?) ON CONFLICT(email) DO UPDATE SET marketing_opt_in=excluded.marketing_opt_in,updated_at=excluded.updated_at').bind(email,marketing,now,now),
    db.prepare('INSERT INTO consent_events VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),email,marketing,VERSION,now),
    db.prepare('INSERT INTO download_tokens VALUES(?,?)').bind(token,now+1800),
    db.prepare('DELETE FROM download_tokens WHERE expires_at < ?').bind(now),
    db.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(now)
   ]);
   return json({downloadUrl:`${url.origin}/download?token=${token}`},200,origin);
  } catch {return json({error:'We could not save your request. Please try again shortly.'},503,origin);}
 }
 if (url.pathname === '/download' && request.method === 'GET') {
  const token = url.searchParams.get('token') || '';
  if (!/^[0-9a-f-]{36}$/.test(token)) return new Response('Invalid link. Get a fresh link at https://bytecatstudio.com/#get',{status:400,headers:common});
  try {
   const row = await env.DB.prepare('SELECT expires_at FROM download_tokens WHERE token=?').bind(token).first();
   if (!row || row.expires_at <= Math.floor(Date.now()/1000)) return new Response('This link has expired. Enter your email again at https://bytecatstudio.com/#get',{status:410,headers:common});
   const file = await fetchFile(ZIP);
   if (!file.ok) throw new Error('File unavailable');
   return new Response(file.body,{headers:{...common,'Content-Type':'application/zip','Content-Disposition':'attachment; filename="Byte-Cat-Studio-Free-Calendars-2027.zip"'}});
  } catch {return new Response('Your download is temporarily unavailable. Please try this link again shortly.',{status:503,headers:common});}
 }
 return json({service:'Byte Cat Studio calendar downloads'},url.pathname === '/' ? 200 : 404);
}
export default {fetch(request, env) { return handle(request, env); }};
