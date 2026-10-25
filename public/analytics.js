(()=>{
 'use strict';
 const ID='G-2BG0D8CY1C',KEY='bytecat.analytics.v1',DAYS=180;
 if(location.hostname!=='bytecatstudio.com'&&location.hostname!=='www.bytecatstudio.com')return;
 let allowed=false,loaded=false,choice=null;
 try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&saved.expires>Date.now()&&['yes','no'].includes(saved.value))choice=saved.value;}catch{}
 function safeLocation(){
  const url=new URL(location.origin+location.pathname);
  const input=new URLSearchParams(location.search);
  // Only campaigns issued by this studio are accepted; never forward arbitrary queries.
  if(input.get('utm_source')==='pinterest'){
   url.searchParams.set('utm_source','pinterest');
   if(input.get('utm_medium')==='organic')url.searchParams.set('utm_medium','organic');
   if(input.get('utm_campaign')==='calendars2027')url.searchParams.set('utm_campaign','calendars2027');
   const content=input.get('utm_content');
   if(['january','february','march','april','may','june','july','august','september','october','november','december','print','bundle','notes','png','sunday','desk','cozy','all12'].includes(content))url.searchParams.set('utm_content',content);
  }
  return url.href;
 }
 function enable(){
  allowed=true;window['ga-disable-'+ID]=false;if(loaded)return;loaded=true;
  window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('js',new Date());
  let referrer='';try{referrer=new URL(document.referrer).origin+'/';}catch{}
  window.gtag('config',ID,{page_location:safeLocation(),page_referrer:referrer,page_title:document.title,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:60*60*24*DAYS,cookie_update:false});
  const tag=document.createElement('script');tag.async=true;tag.src='https://www.googletagmanager.com/gtag/js?id='+ID;tag.referrerPolicy='no-referrer';document.head.append(tag);
 }
 function clearCookies(){
  for(const cookie of document.cookie.split(';')){
   const name=cookie.trim().split('=')[0];if(!/^_ga(?:_|$)/.test(name))continue;
   for(const domain of ['',location.hostname,'.bytecatstudio.com'])document.cookie=name+'=; Max-Age=0; path=/'+(domain?'; domain='+domain:'')+'; SameSite=Lax; Secure';
  }
 }
 const box=document.createElement('section');box.id='analytics-choice';box.className='analytics-choice';box.setAttribute('aria-label','Optional website analytics');
 box.innerHTML='<div><strong>A little insight, if you like.</strong><p>Allow Google Analytics cookies to help us understand visits and freebie requests? Your email is never sent to Analytics. Downloads work either way. <a href="/privacy.html">Privacy notice</a></p></div><div class="analytics-actions"><button type="button" data-choice="yes">Allow analytics</button><button type="button" data-choice="no">No thanks</button></div>';
 box.hidden=choice!==null;document.body.append(box);
 const status=document.createElement('span');status.className='analytics-status';status.setAttribute('role','status');
 const settings=document.createElement('button');settings.type='button';settings.className='text-button';settings.textContent='Cookie settings';
 settings.addEventListener('click',()=>{box.hidden=false;box.querySelector('button').focus();});
 const footer=document.querySelector('.footer-inner');if(footer){footer.append(settings,status);}
 box.querySelectorAll('[data-choice]').forEach(button=>button.addEventListener('click',()=>{
  choice=button.dataset.choice;try{localStorage.setItem(KEY,JSON.stringify({value:choice,expires:Date.now()+DAYS*86400000}));}catch{}
  box.hidden=true;status.textContent=choice==='yes'?'Analytics allowed.':'Analytics off.';
  if(choice==='yes')enable();else{allowed=false;window['ga-disable-'+ID]=true;clearCookies();if(loaded)location.reload();}
 }));
 window.addEventListener('bytecat:freebie-request',()=>{if(allowed&&loaded)window.gtag('event','freebie_request',{freebie_id:'2027-cat-calendar'});});
 if(choice==='yes')enable();else{window['ga-disable-'+ID]=true;clearCookies();}
})();
