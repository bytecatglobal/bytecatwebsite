const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
const group=document.querySelector('.months');
for(const [i,month] of months.entries()){
 const button=document.createElement('button');button.type='button';button.textContent=month.slice(0,3);button.setAttribute('aria-label',`Preview ${month} 2027`);button.setAttribute('aria-pressed',String(i===0));
 button.addEventListener('click',()=>{for(const other of group.children)other.setAttribute('aria-pressed','false');button.setAttribute('aria-pressed','true');const img=document.querySelector('#calendar');img.src=`/previews/${month}%202027.png`;img.alt=`${month} 2027 cat calendar preview`;document.querySelector('#month-label').textContent=`${month.toUpperCase()} / 2027`;});group.append(button);
}
const form=document.querySelector('#calendar-form'),email=document.querySelector('#email'),message=document.querySelector('#form-message'),submit=form.querySelector('button[type=submit]'),success=document.querySelector('#download-success');
form.addEventListener('submit',async(event)=>{
 event.preventDefault();if(submit.disabled)return;email.value=email.value.trim();email.removeAttribute('aria-invalid');message.textContent='';
 if(!email.validity.valid){email.setAttribute('aria-invalid','true');message.textContent='Enter a valid email address, like you@example.com.';email.focus();return;}
 const api=window.BYTECAT_CONFIG?.signupUrl;if(!api){message.textContent='Downloads are being prepared. Please try again shortly.';return;}
 submit.disabled=true;submit.textContent='Saving your email…';
 try{
  const response=await fetch(`${api}/subscribe`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.value,marketing:document.querySelector('#marketing').checked,website:document.querySelector('#website').value}),signal:AbortSignal.timeout(20000)});
  const result=await response.json();if(!response.ok)throw new Error(result.error||'Your request could not be saved. Please try again.');
  const download=new URL(result.downloadUrl),base=new URL(api);if(download.origin!==base.origin||download.pathname!=='/download')throw new Error('Your download link could not be created. Please try again.');
  document.querySelector('#calendar-download').href=download.href;document.querySelector('#consent-result').textContent=document.querySelector('#marketing').checked?'You also opted in to studio emails. You can unsubscribe anytime.':'You have not signed up for promotional emails with this request.';
  form.hidden=true;success.hidden=false;success.focus();
 }catch(error){message.textContent=error.name==='TimeoutError'?'The request took too long. Please try again.':error instanceof TypeError?'We could not connect. Check your connection and try again.':error.message;}
 finally{submit.disabled=false;submit.textContent='Get my free calendars ↗';}
});
document.querySelector('#start-again').addEventListener('click',()=>{success.hidden=true;form.hidden=false;form.reset();message.textContent='';email.focus();});
