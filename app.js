(()=>{const C=window.NVGP,$=(s,r=document)=>r.querySelector(s),app=$('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=u=>/^https?:\/\//i.test(u||'')?esc(u):'';
const sb=C.SUPABASE_URL&&C.SUPABASE_ANON_KEY&&window.supabase?supabase.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY):null;
let user=null,isAdmin=false;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),3000)};
const fmt=d=>d?new Date(d+'T00:00').toLocaleDateString('it-IT',{day:'2-digit',month:'short',year:'numeric'}):'Da definire';
if(C.UMAMI_WEBSITE_ID){const s=document.createElement('script');s.defer=true;s.src='https://cloud.umami.is/script.js';s.dataset.websiteId=C.UMAMI_WEBSITE_ID;document.head.append(s)}
const gate=el=>{if(!sb){el.innerHTML='<p class="warn">Backend non configurato (vedi README).</p>';return false}
 if(!user){el.innerHTML='<p>Accedi per usare quest\'area.</p><a class="btn" href="#/auth">Accedi</a>';return false}el.innerHTML='';return true};
const myProfile=async()=>(await sb.from('profiles').select('*').eq('id',user.id).maybeSingle()).data||{};

const V={
home(){const p=$('#pl');if(p&&C.SPOTIFY_PLAYLIST_ID)p.innerHTML=`<iframe title="Playlist Spotify" loading="lazy" style="border:0;width:100%;height:352px" src="https://open.spotify.com/embed/playlist/${encodeURIComponent(C.SPOTIFY_PLAYLIST_ID)}" allow="encrypted-media"></iframe>`},
auth(){$('#cfgWarn').hidden=!!sb;let m='in';
 document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>m=b.dataset.m);
 $('#authForm').onsubmit=async e=>{e.preventDefault();if(!sb)return toast('Configura Supabase');const f=new FormData(e.target),c={email:f.get('email'),password:f.get('password')};
  const r=m==='up'?await sb.auth.signUp({...c,options:{emailRedirectTo:location.href.split('#')[0]}}):await sb.auth.signInWithPassword(c);
  if(r.error)return toast(r.error.message);if(m==='up'&&!r.data.session)return toast('Controlla la mail per confermare');location.hash='#/dashboard'};
 $('#reset').onclick=async()=>{const em=$('[name=email]').value;if(!sb||!em)return toast('Inserisci la email');const r=await sb.auth.resetPasswordForEmail(em,{redirectTo:location.href.split('#')[0]});toast(r.error?r.error.message:'Mail di recupero inviata')}},
async dashboard(){const g=$('#gate');if(!gate(g))return;const f=$('#profForm');f.hidden=false;const p=await myProfile();
 [...f.elements].forEach(el=>{if(el.name&&p[el.name]!=null)el.value=p[el.name]});
 const st=()=>$('#pubState').textContent=p.is_public?'Profilo pubblico in Directory.':p.publish_requested?'Richiesta inviata: in attesa di approvazione.':'Profilo privato.';st();
 const data=()=>Object.fromEntries([...new FormData(f)].map(([k,v])=>[k,v.trim()]));
 f.onsubmit=async e=>{e.preventDefault();const r=await sb.from('profiles').upsert({id:user.id,...data(),updated_at:new Date().toISOString()});toast(r.error?r.error.message:'Salvato')};
 $('#pub').onclick=async()=>{if(!f.stage_name.value)return toast('Inserisci il nome artistico');const r=await sb.from('profiles').upsert({id:user.id,...data(),publish_requested:true});if(!r.error){p.publish_requested=true;st()}toast(r.error?r.error.message:'Richiesta inviata')};
 const {data:rl}=await sb.from('releases').select('title,release_date,status').eq('user_id',user.id).gte('release_date',new Date().toISOString().slice(0,10)).order('release_date').limit(5);
 $('#recent').innerHTML='<h3 style="margin-top:40px">Prossime uscite</h3><div class="list">'+((rl||[]).map(r=>`<div><b>${fmt(r.release_date)}</b><span>${esc(r.title)}</span><i>${esc(r.status)}</i></div>`).join('')||'<p class="small">Nessuna uscita in programma.</p>')+'</div>';
 if(isAdmin)$('#recent').innerHTML+='<a class="btn o" href="#/admin" style="margin-top:20px">Area amministratore</a>'},
async planner(){if(!gate($('#gate')))return;const f=$('#relForm');f.hidden=false;
 const load=async()=>{const {data}=await sb.from('releases').select('*').eq('user_id',user.id).order('release_date');
  $('#rels').innerHTML=(data||[]).map(r=>`<div><b>${fmt(r.release_date)}</b><span>${esc(r.title)} · ${esc(r.type)} · ${esc(r.status)}</span><button data-d="${r.id}" aria-label="Elimina ${esc(r.title)}">Elimina</button></div>`).join('')||'<p class="small">Nessuna release: aggiungi la prima.</p>';
  document.querySelectorAll('[data-d]').forEach(b=>b.onclick=async()=>{await sb.from('releases').delete().eq('id',b.dataset.d);load()})};
 f.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f));d.is_public=f.is_public.checked;d.user_id=user.id;const r=await sb.from('releases').insert(d);if(r.error)return toast(r.error.message);f.reset();toast('Release aggiunta');load()};load()},
async presskit(){if(!gate($('#gate')))return;$('#kit').hidden=false;const p=await myProfile();
 const {data:rl}=await sb.from('releases').select('title,type,release_date').eq('user_id',user.id).eq('status','Pubblicata').order('release_date',{ascending:false});
 const L=[['Instagram',p.instagram],['Spotify',p.spotify],['YouTube',p.youtube]].filter(x=>url(x[1])).map(x=>`<a href="${url(x[1])}">${x[0]}</a>`).join(' · ');
 $('#kitDoc').innerHTML=`<h2>${esc(p.stage_name||'Nome artista')}</h2><strong>${esc(p.genre)}</strong>${url(p.photo_url)?`<img src="${url(p.photo_url)}" alt="">`:''}
 <h4>Biografia</h4><p>${esc(p.bio||'Completa la biografia nella dashboard.').replace(/\n/g,'<br>')}</p>
 <h4>Discografia</h4>${(rl||[]).map(r=>`<p>${esc(r.title)} — ${esc(r.type)} (${fmt(r.release_date)})</p>`).join('')||'<p>—</p>'}
 <h4>Streaming e social</h4><p>${L||'—'}</p><h4>Contatti</h4><p>${esc(p.contact||'—')}</p>`;
 $('#print').onclick=()=>print()},
async directory(){const el=$('#dir');if(!sb)return el.innerHTML='<p class="warn">Backend non configurato.</p>';
 const {data}=await sb.from('public_artists').select('*');
 el.innerHTML=(data||[]).map(a=>`<div class="card">${url(a.photo_url)?`<img src="${url(a.photo_url)}" alt="${esc(a.stage_name)}" loading="lazy">`:''}<h3>${esc(a.stage_name)}</h3><em style="position:static">${esc(a.genre)}</em><p>${esc(a.bio_short)}</p><p>${[['Spotify',a.spotify],['Instagram',a.instagram],['YouTube',a.youtube]].filter(x=>url(x[1])).map(x=>`<a href="${url(x[1])}" rel="noopener" target="_blank">${x[0]}</a>`).join(' · ')}</p></div>`).join('')||'<p>Nessun artista pubblico ancora. <a class="g" href="#/dashboard">Richiedi la pubblicazione</a>.</p>'},
async radar(){const el=$('#rad');if(!sb)return el.innerHTML='<p class="warn">Backend non configurato.</p>';
 const {data}=await sb.from('public_releases').select('*').gte('release_date',new Date().toISOString().slice(0,10)).order('release_date');
 el.innerHTML=(data||[]).map(r=>`<div><b>${fmt(r.release_date)}</b><span>${esc(r.stage_name)} — ${esc(r.title)} (${esc(r.type)})</span><i>${esc(r.status)}</i></div>`).join('')||'<p>Nessuna uscita annunciata.</p>'},
promotion(){const w=$('#w3k');w.value=C.WEB3FORMS_KEY||'';
 if(C.TALLY_FORM_ID){$('#tally').innerHTML=`<iframe title="Candidatura" loading="lazy" src="https://tally.so/embed/${encodeURIComponent(C.TALLY_FORM_ID)}?hideTitle=1&transparentBackground=1" style="border:0;width:100%;min-height:520px"></iframe>`}else $('#tally').innerHTML='<p class="warn">Form Tally non configurato.</p>';
 if(C.TURNSTILE_SITEKEY){const s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js';s.async=true;s.onload=()=>turnstile.render('#ts',{sitekey:C.TURNSTILE_SITEKEY});document.head.append(s)}
 $('#infoForm').onsubmit=async e=>{e.preventDefault();if(!C.WEB3FORMS_KEY)return toast('Web3Forms non configurato');
  const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(e.target)))}).then(r=>r.json()).catch(()=>({success:false}));
  toast(r.success?'Richiesta inviata':'Invio non riuscito: riprova o scrivici su Instagram');if(r.success)e.target.reset()}},
async admin(){if(!isAdmin){location.hash='#/';return}
 app.innerHTML='<section><h2>Admin</h2><div class="list" id="adm"></div></section>';
 const load=async()=>{const {data}=await sb.from('profiles').select('id,stage_name,is_public,publish_requested').order('publish_requested',{ascending:false});
  $('#adm').innerHTML=(data||[]).map(p=>`<div><b>${p.is_public?'PUBBLICO':p.publish_requested?'RICHIESTA':'PRIVATO'}</b><span>${esc(p.stage_name||p.id)}</span><button data-t="${p.id}" data-v="${!p.is_public}">${p.is_public?'Rimuovi':'Approva'}</button></div>`).join('');
  document.querySelectorAll('[data-t]').forEach(b=>b.onclick=async()=>{await sb.from('profiles').update({is_public:b.dataset.v==='true'}).eq('id',b.dataset.t);load()})};load()}};

const render=async()=>{const r=(location.hash.replace('#/','')||'home').split('?')[0];const t=$('#v-'+r);
 $('#nav').classList.remove('open');$('.burger').setAttribute('aria-expanded','false');
 if(t){app.replaceChildren(t.content.cloneNode(true))}else if(r!=='admin'){location.hash='#/';return}
 document.title='NVGP STUDIO — '+(r==='home'?'The Artist District':r);window.scrollTo(0,0);await V[r]?.()};
$('.burger').onclick=e=>{const o=$('#nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)};
const setUser=async s=>{user=s?.user||null;isAdmin=false;if(user&&sb){isAdmin=!!(await sb.from('admins').select('user_id').maybeSingle()).data}
 const a=$('#authLink');a.textContent=user?'Esci':'Accedi';a.href=user?'#/':'#/auth';a.onclick=user?async e=>{e.preventDefault();await sb.auth.signOut();location.hash='#/'}:null};
addEventListener('hashchange',render);
(async()=>{if(sb){await setUser((await sb.auth.getSession()).data.session);sb.auth.onAuthStateChange((ev,s)=>setUser(s))}render()})();
})();
