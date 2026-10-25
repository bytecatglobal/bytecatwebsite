import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile,readdir} from 'node:fs/promises';

test('public build excludes customer downloads and activates only the approved API',async()=>{
 const build=(url)=>execFileSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,SIGNUP_API_URL:url},stdio:'pipe'});
 try{
 build('');assert.match(await readFile('dist/config.js','utf8'),/"signupUrl":""/);
 assert.equal((await readdir('dist/previews')).length,12);
 const home=await readFile('dist/index.html','utf8'),calendar=await readFile('dist/freebies/2027-cat-calendar/index.html','utf8');
 assert.ok(home.includes('ABOUT BYTE CAT STUDIO'));assert.ok(!home.includes('id="calendar-form"'));
 assert.ok(calendar.includes('id="calendar-form"'));assert.ok(calendar.includes('id="email-success"'));
 assert.ok(calendar.includes('rel="canonical" href="https://bytecatstudio.com/freebies/2027-cat-calendar/"'));
 for(const document of [home,calendar,await readFile('dist/freebies/index.html','utf8')]){for(const block of document.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))assert.ok(JSON.parse(block[1])['@graph'].length>=2);assert.ok(document.includes('twitter:card'));}
 assert.ok((await readFile('dist/sitemap.xml','utf8')).includes('https://bytecatstudio.com/freebies/2027-cat-calendar/'));
 assert.ok((await readFile('dist/legacy-links.js','utf8')).includes("'#get'"));
 assert.ok(!(await readdir('dist')).some(x=>x==='launch'||x.endsWith('.zip')));
 build('https://api.bytecatstudio.com');assert.match(await readFile('dist/config.js','utf8'),/api.bytecatstudio.com/);
 assert.throws(()=>build('https://api.bytecatstudio.com.attacker.example'));
 assert.throws(()=>build('javascript:alert(1)'));
 }finally{build('');}
});
