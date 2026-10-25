import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile,readdir} from 'node:fs/promises';
test('public build excludes customer downloads and activates only a valid checkout',async()=>{
 const build=(url)=>execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,GUMROAD_PRODUCT_URL:url},stdio:'pipe'});
 try{
 build('');assert.match(await readFile('dist/config.js','utf8'),/"gumroadUrl":""/);
 assert.equal((await readdir('dist/previews')).length,12);
 assert.ok(!(await readdir('dist')).some(x=>x==='launch'||x.endsWith('.zip')));
 build('https://bytecatstudio.gumroad.com/l/test');assert.match(await readFile('dist/config.js','utf8'),/bytecatstudio.gumroad.com/);
 assert.throws(()=>build('https://gumroad.com.attacker.example/l/test'));
 assert.throws(()=>build('javascript:alert(1)'));
 }finally{build('');}
});
