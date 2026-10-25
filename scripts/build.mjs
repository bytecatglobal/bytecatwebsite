import {cp,mkdir,writeFile} from 'node:fs/promises';
const raw=process.env.GUMROAD_PRODUCT_URL||'';
if(raw){const u=new URL(raw);if(u.protocol!=='https:'||!(u.hostname==='gumroad.com'||u.hostname.endsWith('.gumroad.com')))throw Error('Use the HTTPS Gumroad product link');}
await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true});
await writeFile('dist/config.js',`window.BYTECAT_CONFIG=${JSON.stringify({gumroadUrl:raw}).replaceAll('<','\\u003c')};\n`);
console.log('Built website. Gumroad checkout '+(raw?'connected.':'pending: set GUMROAD_PRODUCT_URL before launch.'));
