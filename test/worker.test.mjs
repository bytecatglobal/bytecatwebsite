import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {handle} from '../worker/worker.mjs';
const sqlite = await import('node:sqlite').catch(()=>null);
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
