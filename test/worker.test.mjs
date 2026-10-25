import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {handle} from '../worker/worker.mjs';
const sqlite = await import('node:sqlite').catch(()=>null);
const emailEnv=DB=>({DB,DELIVERY_MODE:'verified_email',RESEND_API_KEY:'test-only-placeholder'});
function database() {
 const sql = new sqlite.DatabaseSync(':memory:'); sql.exec(readFileSync(new URL('../worker/schema.sql',import.meta.url),'utf8'));
 const DB = {prepare(query) { const statement = {args:[], bind(...args){this.args=args;return this;}, async first(column){const row=sql.prepare(query).get(...this.args);return column ? row?.[column] : row;}, execute(){return sql.prepare(query).run(...this.args);}};return statement;}, async batch(statements){sql.exec('BEGIN');try {for(const s of statements)s.execute();sql.exec('COMMIT');}catch(e){sql.exec('ROLLBACK');throw e;}}};
 return {sql,DB};
}
const request = (data, origin='https://bytecatstudio.com') => new Request('https://api.bytecatstudio.com/subscribe',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1'},body:JSON.stringify(data)});
test('rejects invalid origin, email, missing consent boolean, oversized and honeypot requests',async()=>{
 for(const [body,origin] of [[{email:'cat@example.com',marketing:false},'https://evil.example'],[{email:'bad',marketing:false}],[{email:'cat@localhost',marketing:false}],[{email:'cat@example.com'}],[{email:'cat@example.com',marketing:false,website:'spam'}],[{email:'x'.repeat(3000),marketing:false}]]) {
  const response=await handle(request(body,origin),{});assert.ok([400,403].includes(response.status));assert.equal((await response.json()).downloadUrl,undefined);
 }
});
test('saves consent and email before giving an expiring downloadable ZIP', {skip:!sqlite}, async()=>{
 const {sql,DB}=database();
 try {
  const response=await handle(request({email:' Cat@Example.com ',marketing:false}),{DB});assert.equal(response.status,200);
  const {downloadUrl}=await response.json();const subscriber=sql.prepare('SELECT * FROM subscribers').get();assert.equal(subscriber.email,'cat@example.com');assert.equal(subscriber.marketing_opt_in,0);
  assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM consent_events').get().n,1);
  const file=await handle(new Request(downloadUrl),{DB},async()=>new Response('ZIP fixture'));assert.equal(file.status,200);assert.match(file.headers.get('Content-Disposition'),/attachment/);assert.equal(await file.text(),'ZIP fixture');
  await handle(request({email:'cat@example.com',marketing:true}),{DB});assert.equal(sql.prepare('SELECT marketing_opt_in FROM subscribers').get().marketing_opt_in,1);
  await handle(request({email:'cat@example.com',marketing:false}),{DB});assert.equal(sql.prepare('SELECT marketing_opt_in FROM subscribers').get().marketing_opt_in,0);
  sql.exec('UPDATE download_tokens SET expires_at=0');assert.equal((await handle(new Request(downloadUrl),{DB})).status,410);
  for(let i=0;i<7;i++)assert.equal((await handle(request({email:'cat@example.com',marketing:false}),{DB})).status,200);
  assert.equal((await handle(request({email:'cat@example.com',marketing:false}),{DB})).status,429);
  const rate=sql.prepare('SELECT key FROM rate_limits').get();assert.ok(!rate.key.includes('192.0.2.1'));
 }finally{sql.close();}
});
test('database failure cannot produce a download link', {skip:!sqlite}, async()=>{
 const {sql,DB}=database();sql.exec('DROP TABLE consent_events');
 try {const response=await handle(request({email:'cat@example.com',marketing:false}),{DB});assert.equal(response.status,503);assert.equal((await response.json()).downloadUrl,undefined);assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM subscribers').get().n,0);}finally{sql.close();}
});
test('email flow requires explicit confirmation, records consent once and expires download', {skip:!sqlite}, async()=>{
 const {sql,DB}=database();let mail;
 try{
  const sent=await handle(request({email:'cat@example.com',marketing:true}),emailEnv(DB),async(url,options)=>{assert.equal(url,'https://api.resend.com/emails');mail=JSON.parse(options.body);return Response.json({id:'test'});});
  assert.equal(sent.status,202);assert.equal((await sent.json()).downloadUrl,undefined);assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM subscribers').get().n,0);
  assert.deepEqual(mail.to,['cat@example.com']);const pending=sql.prepare('SELECT * FROM verification_requests').get();assert.ok(mail.text.includes(pending.token));
  const verifyUrl='https://api.bytecatstudio.com/verify?token='+pending.token;
  const scanner=await handle(new Request(verifyUrl),emailEnv(DB));assert.equal(scanner.status,200);assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM verified_subscribers').get().n,0);assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM download_tokens').get().n,0);
  const confirmed=await handle(new Request(verifyUrl,{method:'POST'}),emailEnv(DB));assert.equal(confirmed.status,200);assert.match(await confirmed.text(),/Download the free calendars/);
  assert.equal(sql.prepare('SELECT marketing_opt_in FROM subscribers').get().marketing_opt_in,1);assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM verified_subscribers').get().n,1);
  await handle(new Request(verifyUrl,{method:'POST'}),emailEnv(DB));assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM consent_events').get().n,1);
  sql.exec('UPDATE download_tokens SET expires_at=0');assert.equal((await handle(new Request(verifyUrl,{method:'POST'}),emailEnv(DB))).status,410);
 }finally{sql.close();}
});
test('email send failures and missing secret never unlock files or subscribe the visitor', {skip:!sqlite},async()=>{
 const {sql,DB}=database();
 try{
  const absent=await handle(request({email:'cat@example.com',marketing:false}),{DB,DELIVERY_MODE:'verified_email'});assert.equal(absent.status,503);
  const failed=await handle(request({email:'cat@example.com',marketing:true}),emailEnv(DB),async()=>new Response('Provider failure',{status:503}));assert.equal(failed.status,503);
  assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM subscribers').get().n,0);assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM download_tokens').get().n,0);
 }finally{sql.close();}
});
