import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile,readdir} from 'node:fs/promises';

test('public build excludes customer downloads and activates only the approved API',async()=>{
 const build=(url)=>execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,SIGNUP_API_URL:url},stdio:'pipe'});
 try{
 build('');assert.match(await readFile('dist/config.js','utf8'),/"signupUrl":""/);
 assert.equal((await readdir('dist/previews')).length,12);
 assert.ok(!(await readdir('dist')).some(x=>x==='launch'||x.endsWith('.zip')));
 build('https://api.bytecatstudio.com');assert.match(await readFile('dist/config.js','utf8'),/api.bytecatstudio.com/);
 assert.throws(()=>build('https://api.bytecatstudio.com.attacker.example'));
 assert.throws(()=>build('javascript:alert(1)'));
 }finally{build('');}
});
