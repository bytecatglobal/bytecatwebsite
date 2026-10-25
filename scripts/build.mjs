import {cp,mkdir,writeFile} from 'node:fs/promises';
import {buildPages} from './pages.mjs';
const raw=process.env.SIGNUP_API_URL ?? 'https://api.bytecatstudio.com';
if(raw){const u=new URL(raw);if(u.origin!=='https://api.bytecatstudio.com'||u.pathname!=='/'||u.search||u.hash||u.username||u.password)throw Error('Use the Byte Cat calendar API origin');}
await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true});
await buildPages();
await writeFile('dist/config.js',`window.BYTECAT_CONFIG=${JSON.stringify({signupUrl:raw.replace(/\/$/,'')}).replaceAll('<','\\u003c')};\n`);
console.log('Built website. Calendar signup '+(raw?'configured.':'disabled.'));
