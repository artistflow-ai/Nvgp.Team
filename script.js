(() => {
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
$("#year").textContent = new Date().getFullYear();
const nav = $("#nav"), hamb = $("#hamb");
hamb?.addEventListener("click", () => { const open = nav.classList.toggle("open"); hamb.setAttribute("aria-expanded", String(open)); });
$$('#nav a').forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

$("#service-filters")?.addEventListener("click", e => {
 const b=e.target.closest("[data-filter]"); if(!b)return;
 $$("#service-filters .chip").forEach(x=>x.classList.toggle("active",x===b));
 $$(".service").forEach(card=>card.hidden=b.dataset.filter!=="all"&&card.dataset.category!==b.dataset.filter);
});
$("#news-filters")?.addEventListener("click", e => {
 const b=e.target.closest("[data-category]"); if(!b)return;
 $$("#news-filters .chip").forEach(x=>x.classList.toggle("active",x===b));
 // Static editorial placeholders remain visible; real Supabase articles are filtered below.
 $$(".news-card[data-category]").forEach(card=>card.hidden=b.dataset.category!=="all"&&card.dataset.category!==b.dataset.category);
});
$$(".service-select").forEach(b=>b.addEventListener("click",()=>{
 const form=$("#contact-form"); form.elements.service.value=b.dataset.name; $("#contact").scrollIntoView({behavior:"smooth"});
 form.elements.project.focus();
}));

const modal=$("#account-modal");
$("#account-open")?.addEventListener("click",()=>{modal.classList.add("open");modal.setAttribute("aria-hidden","false")});
$("#modal-close")?.addEventListener("click",()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true")});
modal?.addEventListener("click",e=>{if(e.target===modal){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}});
let authMode="login";
$$(".tab").forEach(b=>b.addEventListener("click",()=>{authMode=b.dataset.mode;$$(".tab").forEach(x=>x.classList.toggle("active",x===b));$("#auth-submit").textContent=authMode==="login"?"Accedi":"Crea account"}));

const cfg=window.NVGP_CONFIG||{};
const ready=window.supabase&&cfg.SUPABASE_URL&&!cfg.SUPABASE_URL.includes("YOUR-")&&cfg.SUPABASE_ANON_KEY&&!cfg.SUPABASE_ANON_KEY.includes("YOUR_");
let sb=null, currentUser=null;
if(ready){sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);}
$("#auth-form")?.addEventListener("submit",async e=>{
 e.preventDefault();const msg=$("#auth-message");
 if(!sb){msg.textContent="Supabase non configurato. Inserisci URL e chiave pubblica in config.js e applica schema.sql.";return}
 const email=$("#auth-email").value,password=$("#auth-password").value;
 const result=authMode==="signup"?await sb.auth.signUp({email,password}):await sb.auth.signInWithPassword({email,password});
 if(result.error){msg.textContent=result.error.message;return}
 currentUser=result.data.user;msg.textContent=authMode==="signup"?"Registrazione inviata. Controlla la tua email per la conferma.":"Accesso effettuato.";
 if(currentUser) await loadAdmin();
});
async function loadAdmin(){
 if(!sb||!currentUser)return;
 const {data}=await sb.from("profiles").select("role").eq("id",currentUser.id).maybeSingle();
 if(data?.role==="admin")$("#admin-panel").hidden=false;
}
$("#article-form")?.addEventListener("submit",async e=>{
 e.preventDefault();const msg=$("#auth-message");
 if(!sb||!currentUser){msg.textContent="Accedi con un account amministratore e configura Supabase.";return}
 const {error}=await sb.from("articles").insert({title:$("#article-title").value,category:$("#article-category").value,image_url:$("#article-image").value||null,description:$("#article-description").value,body:$("#article-body").value,published:true,author_id:currentUser.id});
 msg.textContent=error?error.message:"Articolo pubblicato.";if(!error)e.target.reset();if(!error)loadArticles();
});
async function loadArticles(){
 if(!sb)return;
 const {data,error}=await sb.from("articles").select("id,title,category,image_url,description,created_at").eq("published",true).order("created_at",{ascending:false}).limit(12);
 if(error||!data?.length)return;
 const grid=$("#news-grid");
 grid.innerHTML=data.map(a=>`<article class="news-card" data-category="${escapeHtml(a.category||"Rap News")}"><div class="news-art" style="${a.image_url?`background-image:linear-gradient(#0005,#0005),url('${safeUrl(a.image_url)}');background-size:cover;background-position:center`:''}"><span>NVGP<br><b>NEWS</b></span></div><div class="meta">${escapeHtml(a.category||"NEWS")} · ${new Date(a.created_at).toLocaleDateString("it-IT")}</div><h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.description||"")}</p></article>`).join("");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function safeUrl(s){try{const u=new URL(s);return ["https:","http:"].includes(u.protocol)?u.href:""}catch{return""}}
if(sb){sb.auth.getSession().then(({data})=>{currentUser=data.session?.user||null;if(currentUser)loadAdmin()});loadArticles()}

$("#contact-form")?.addEventListener("submit",e=>{
 e.preventDefault();const f=e.currentTarget,d=new FormData(f);
 const subject=encodeURIComponent(`NVGP.TEAM — ${d.get("service")||"Nuova collaborazione"} — ${d.get("project")||d.get("name")}`);
 const body=encodeURIComponent(`Nome: ${d.get("name")}\nEmail: ${d.get("email")}\nArtista/Progetto: ${d.get("project")||"-"}\nServizio: ${d.get("service")||"-"}\n\nMessaggio:\n${d.get("message")}`);
 $("#contact-status").textContent="Si sta aprendo la tua app email. Controlla il destinatario e premi invia per completare l'invio.";
 window.location.href=`mailto:INSERISCI_EMAIL_CONTATTO?subject=${subject}&body=${body}`;
});
})();