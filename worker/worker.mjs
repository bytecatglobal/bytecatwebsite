const ORIGINS = new Set(['https://bytecatstudio.com', 'https://www.bytecatstudio.com', 'https://bytecatwebsite.vercel.app']);
const ZIP = 'https://raw.githubusercontent.com/bytecatglobal/bytecatwebsite/e9854368be4449b8a883844666a97585fc98787a/launch/Byte-Cat-Studio-Free-Calendars-2027.zip';
const VERSION = '2026-10-26';
const common = {'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'no-referrer', 'X-Robots-Tag':'noindex, nofollow'};
const CALENDAR = 'https://bytecatstudio.com/freebies/2027-cat-calendar/';
function screen(title, body, status = 200) {
 return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title} | Byte Cat Studio</title><style>body{margin:0;background:#faf8f0;color:#30382b;font:17px/1.6 system-ui}main{max-width:560px;margin:9vh auto;padding:28px}article{padding:30px;border:2px solid #30382b;box-shadow:7px 7px #30382b;background:#fffefa}h1{font-size:34px;line-height:1.15}button,.button{display:inline-block;background:#ef865d;color:#30382b;border:2px solid;padding:14px 20px;font:700 16px system-ui;text-decoration:none;box-shadow:4px 4px #30382b;cursor:pointer}a{color:inherit}small{display:block;margin-top:24px}</style></head><body><main><p>BYTE CAT STUDIO</p><article><h1>${title}</h1>${body}</article><small><a href="${CALENDAR}">Back to the free 2027 cat calendars</a></small></main></body></html>`,{status,headers:{...common,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'"}});
}
async function verify(request, env, url) {
 const token=url.searchParams.get('token')||'';
 if(!/^[0-9a-f-]{36}$/.test(token))return screen('This link is not valid','<p>Please request a new email from the calendar page.</p>',400);
 if(!['GET','POST'].includes(request.method))return screen('Open your email link','<p>Use the link in your calendar email.</p>',405);
 try {
  const now=Math.floor(Date.now()/1000),db=env.DB;
  const row=await db.prepare('SELECT * FROM verification_requests WHERE token=?').bind(token).first();
  if(!row||row.expires_at<=now)return screen('This link has expired',`<p>Your email link was valid for 24 hours. Request a fresh email to get your free calendars.</p><a class="button" href="${CALENDAR}#get">Request a fresh email</a>`,410);
  if(request.method==='GET')return screen('Your cats are ready.',`<p>Confirm your email to unlock one PDF and all 12 monthly PNGs. This does not add you to promotional emails unless you chose that option.</p><form method="post" action="/verify?token=${token}"><button type="submit">Confirm email &amp; get calendars</button></form>`);
  // GET never confirms: mail scanners must not activate consent or download access.
  if(!row.consumed_at){
   await db.batch([
    db.prepare('INSERT INTO subscribers(email,marketing_opt_in,created_at,updated_at) SELECT email,marketing,?,? FROM verification_requests WHERE token=? AND consumed_at IS NULL ON CONFLICT(email) DO UPDATE SET marketing_opt_in=excluded.marketing_opt_in,updated_at=excluded.updated_at WHERE subscribers.updated_at <= ?').bind(now,now,token,row.created_at),
    db.prepare('INSERT INTO consent_events SELECT ?,email,marketing,?,? FROM verification_requests WHERE token=? AND consumed_at IS NULL').bind(crypto.randomUUID(),VERSION+'-verified',now,token),
    db.prepare('INSERT INTO verified_subscribers(email,verified_at) SELECT email,? FROM verification_requests WHERE token=? AND consumed_at IS NULL ON CONFLICT(email) DO UPDATE SET verified_at=excluded.verified_at').bind(now,token),
    db.prepare('INSERT OR IGNORE INTO download_tokens SELECT download_token,? FROM verification_requests WHERE token=? AND consumed_at IS NULL').bind(now+1800,token),
    db.prepare('UPDATE verification_requests SET consumed_at=? WHERE token=? AND consumed_at IS NULL').bind(now,token)
   ]);
  }
  const download=await db.prepare('SELECT expires_at FROM download_tokens WHERE token=?').bind(row.download_token).first();
  if(!download||download.expires_at<=now)return screen('Your download link has expired',`<p>Your email was confirmed successfully. The download link was valid for 30 minutes after confirmation.</p><p>You can still get your free calendars. Enter your email again, then use the newest email we send you.</p><a class="button" href="${CALENDAR}#get">Request a fresh email</a>`,410);
  return screen('Email confirmed. All yours.',`<p>Download your ZIP and unzip it to find one PDF and 12 monthly PNGs.</p><a class="button" href="/download?token=${row.download_token}">Download the free calendars</a><p><small>This download link expires 30 minutes after confirmation. Your latest confirmed promotional preference is saved separately.</small></p><aside aria-label="Optional studio support" style="border-top:2px solid #30382b;margin-top:28px;padding-top:16px"><p>Enjoy this freebie? Help us create more. Support is completely optional; your calendars stay free.</p><a href="https://buymeacoffee.com/bytecat" target="_blank" rel="noopener noreferrer">Support the studio ☕ <span style="font-size:13px">(opens in a new tab)</span></a></aside>`);
 }catch{return screen('Please try again shortly','<p>We could not complete confirmation. Keep this email and try its link again in a few minutes.</p>',503);}
}
async function sendVerification(email, marketing, db, env, now, origin, fetchEmail) {
 if(!env.RESEND_API_KEY)return json({error:'Email delivery is temporarily unavailable. Please try again shortly.'},503,origin);
 const token=crypto.randomUUID(),link=`https://api.bytecatstudio.com/verify?token=${token}`;
 await db.batch([
  db.prepare('INSERT INTO verification_requests(token,email,marketing,created_at,expires_at,download_token) VALUES(?,?,?,?,?,?)').bind(token,email,marketing,now,now+86400,crypto.randomUUID()),
  db.prepare('DELETE FROM verification_requests WHERE expires_at < ?').bind(now),
  db.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(now)
 ]);
 const response=await fetchEmail('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`calendar-${token}`},signal:AbortSignal.timeout(12000),body:JSON.stringify({from:'Byte Cat Studio <notifications@mail.bytecatstudio.com>',to:[email],reply_to:'hello@bytecatstudio.com',subject:'Confirm your email for your free 2027 cat calendars',text:`Your free 2027 cat calendars are ready.\n\nConfirm your email and download the PDF + 12 monthly PNGs:\n${link}\n\nThis link lasts 24 hours. Promotional emails are optional; your choice will be saved when you confirm. If you did not request this, ignore this email.\n\nByte Cat Studio\n${CALENDAR}`,html:`<div style="background:#faf8f0;padding:32px;font:16px/1.6 Arial,sans-serif;color:#30382b"><div style="max-width:560px;margin:auto;border:2px solid #30382b;padding:28px;background:#fffefa"><p style="font-weight:bold;letter-spacing:2px">BYTE CAT STUDIO</p><h1 style="font-size:32px;line-height:1.15">A whole year of cat company.</h1><p>Your free 2027 calendar collection is ready: one PDF and 12 monthly PNGs.</p><p><a href="${link}" style="display:inline-block;padding:14px 18px;background:#ef865d;border:2px solid #30382b;color:#30382b;font-weight:bold;text-decoration:none">Confirm email &amp; get calendars</a></p><p>This link lasts 24 hours. Promotional emails are optional; your choice is saved when you confirm.</p><p style="font-size:13px">Didn't request this? You can ignore this email. No subscription is confirmed until you use the link and confirm on the page.</p><a href="${CALENDAR}" style="color:#30382b">Visit Byte Cat Studio</a></div></div>`})});
 if(!response.ok)throw new Error('Email unavailable');
 return json({status:'check_email'},202,origin);
}
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
 if(url.pathname==='/verify')return verify(request,env,url);
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
   if(env.DELIVERY_MODE==='verified_email'){
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${salt}:email:${email}:${Math.floor(now/3600)}`));
    const emailKey='email:'+Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
    const recipientRate=await db.prepare('INSERT INTO rate_limits(key,requests,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET requests=requests+1 RETURNING requests').bind(emailKey,now+3600).first('requests');
    if(recipientRate>3)return json({error:'Please check your inbox and spam folder. You can request another email in an hour.'},429,origin);
    const daily=await db.prepare('INSERT INTO rate_limits(key,requests,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET requests=requests+1 RETURNING requests').bind('mail-day:'+Math.floor(now/86400),now+86400).first('requests');
    if(daily>90)return json({error:'Today\'s email delivery limit has been reached. Please try again tomorrow.'},429,origin);
    return await sendVerification(email,data.marketing?1:0,db,env,now,origin,fetchFile);
   }
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
   if (!row || row.expires_at <= Math.floor(Date.now()/1000)) return screen('Your download link has expired',`<p>Download links last 30 minutes. Request a fresh email, then use the newest email to get your free calendars.</p><a class="button" href="${CALENDAR}#get">Request a fresh email</a>`,410);
   const file = await fetchFile(ZIP);
   if (!file.ok) throw new Error('File unavailable');
   return new Response(file.body,{headers:{...common,'Content-Type':'application/zip','Content-Disposition':'attachment; filename="Byte-Cat-Studio-Free-Calendars-2027.zip"'}});
  } catch {return new Response('Your download is temporarily unavailable. Please try this link again shortly.',{status:503,headers:common});}
 }
 return json({service:'Byte Cat Studio calendar downloads'},url.pathname === '/' ? 200 : 404);
}
export default {fetch(request, env) { return handle(request, env); }};
