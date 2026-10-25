import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('../public/analytics.js',import.meta.url),'utf8');
function browser(saved=null){
 const scripts=[],events={},cookies=[],nodes=[];let reloads=0;
 const button=value=>({dataset:{choice:value},addEventListener(type,fn){this[type]=fn;},focus(){}});
 const yes=button('yes'),no=button('no');
 const document={title:'Byte Cat Studio',referrer:'https://www.pinterest.com/private?email=private@example.com',head:{append(node){scripts.push(node);}},body:{append(){}},querySelector(){return {append(){}};},createElement(tag){const node={tag,setAttribute(){},addEventListener(type,fn){this[type]=fn;},querySelectorAll(){return [yes,no];},querySelector(){return yes;}};nodes.push(node);return node;}};
 Object.defineProperty(document,'cookie',{get:()=>'',set:value=>cookies.push(value)});
 const window={addEventListener(name,fn){events[name]=fn;}};
 const store=new Map(saved?[['bytecat.analytics.v1',JSON.stringify(saved)]]:[]);
 const location={hostname:'bytecatstudio.com',origin:'https://bytecatstudio.com',pathname:'/freebies/2027-cat-calendar/',search:'?utm_source=pinterest&utm_medium=organic&utm_campaign=calendars2027&utm_content=january&email=private@example.com&token=secret',reload(){reloads++;}};
 runInNewContext(source,{window,document,location,localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},URL,URLSearchParams,Date});
 return {scripts,events,window,yes,no,store,nodes,get reloads(){return reloads;}};
}
test('analytics makes no Google requests before consent or after rejection',()=>{
 const page=browser();assert.equal(page.scripts.length,0);page.events['bytecat:freebie-request']();assert.equal(page.window.dataLayer,undefined);
 page.no.click();assert.equal(page.scripts.length,0);assert.equal(JSON.parse(page.store.get('bytecat.analytics.v1')).value,'no');
 const remembered=browser({value:'no',expires:Date.now()+10000});assert.equal(remembered.scripts.length,0);
});
test('accepted analytics strips sensitive URLs and sends only the freebie identifier',()=>{
 const page=browser();page.yes.click();assert.equal(page.scripts.length,1);
 const config=Array.from(page.window.dataLayer).find(x=>x[0]==='config')[2];
 assert.equal(config.page_referrer,'https://www.pinterest.com/');assert.ok(config.page_location.includes('utm_content=january'));assert.ok(!/private|secret|email=|token=/.test(config.page_location));
 assert.equal(config.allow_google_signals,false);assert.equal(config.allow_ad_personalization_signals,false);
 page.events['bytecat:freebie-request']();const last=page.window.dataLayer.at(-1);assert.equal(last[1],'freebie_request');assert.deepEqual(Object.keys(last[2]),['freebie_id']);
 const before=page.window.dataLayer.length;page.no.click();page.events['bytecat:freebie-request']();assert.equal(page.window.dataLayer.length,before);assert.equal(page.reloads,1);assert.equal(page.window['ga-disable-G-2BG0D8CY1C'],true);
});
test('expired analytics consent does not load Google',()=>{assert.equal(browser({value:'yes',expires:0}).scripts.length,0);});
