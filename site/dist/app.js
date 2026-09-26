import {programs} from './programs.js';
import {matches,statusOf,startLabel} from './logic.js';
const $=id=>document.getElementById(id);
const themeToggle=$('theme-toggle');
const syncThemeSwitch=()=>themeToggle.setAttribute('aria-checked',document.documentElement.dataset.theme==='dark');
syncThemeSwitch();
themeToggle.addEventListener('click',()=>{
 const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';
 document.documentElement.dataset.theme=theme;
 try{localStorage.setItem('firstrung-theme',theme);}catch{}
 syncThemeSwitch();
});
for(const id of ['why-button','footer-why'])$(id).addEventListener('click',()=>$('why').showModal());
$('close-why').addEventListener('click',()=>$('why').close());
$('why').addEventListener('click',e=>{if(e.target===$('why')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let selected=programs[0]?.id;
const companyLogos={
 'Capital One':'capital-one.svg',
 'GE Appliances':'ge-appliances.svg',
 'Bell':'bell.png',
 'Siemens':'siemens.svg',
 'Shell':'shell.svg'
};
const companyLogo=p=>companyLogos[p.company]?`<span class="company-logo" aria-hidden="true"><img src="logos/${companyLogos[p.company]}" alt="" width="38" height="38"></span>`:'';
document.addEventListener('error',event=>{
 if(event.target instanceof HTMLImageElement && event.target.parentElement?.classList.contains('company-logo'))event.target.parentElement.hidden=true;
},true);
let visible=[];
const statusNames={open:'Applications open',unknown:'Check availability',closed:'Applications closed',upcoming:'Upcoming'};
const dateLabel=s=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(s.length===10?s+'T00:00:00Z':s));
const badge=p=>{const s=statusOf(p).status;return `<span class="status-badge ${s}">${statusNames[s]}</span>`;};
const tags=p=>p.types.map(t=>`<span class="tag">${escape(t)}</span>`).join('');
const degrees=p=>p.degrees.length?p.degrees.map(d=>d==='bachelor'?'Bachelor’s':'Master’s').join(' / '):'See employer requirements';
const filters=()=>({query:$('query').value,area:$('area').value,start:$('start').value,country:$('country').value,degree:$('degree').value,type:$('type').value,status:$('status').value,includeUnknown:$('include-unknown').checked});
function detail(p){
 if(!p){$('detail').innerHTML='<div class="empty"><h2>Your next step is out there.</h2><p>Adjust your filters to explore more programs.</p></div>';return;}
 const state=statusOf(p);
 $('detail').innerHTML=`<button class="mobile-back" id="back"><span aria-hidden="true">←</span> Back to programs</button><div class="detail-top"><div class="detail-company">${companyLogo(p)}<div><div class="company">${escape(p.company)}</div><div class="row-country">${escape(p.country)}</div></div>${badge(p)}</div><h2>${escape(p.title)}</h2><div class="detail-location">${escape(p.location)}</div><div class="detail-tags">${tags(p)}${p.areas.map(a=>`<span class="tag">${escape(a)}</span>`).join('')}</div><a class="apply" href="${escape(p.source)}" target="_blank" rel="noopener noreferrer">${state.status==='open'?'Apply on employer website':'View official program'}<span aria-hidden="true">↗</span></a><p class="source-caption">${state.status==='open'?'Opens the official job posting in a new tab':'Check current openings and full requirements with the employer'}</p></div><div class="detail-body"><p class="ai-summary-note">Details are summarized by AI. <a href="${escape(p.source)}" target="_blank" rel="noopener noreferrer">Refer to the company job site for the full description.</a></p><dl class="facts"><div><dt>Employment starts</dt><dd>${startLabel(p)}</dd></div><div><dt>Program length</dt><dd>${escape(p.duration||'Not announced')}</dd></div><div><dt>Degree eligibility</dt><dd>${degrees(p)}</dd></div><div><dt>${state.status==='closed'?'Applications closed':'Application deadline'}</dt><dd>${state.closure?dateLabel(state.closure):p.deadline?dateLabel(p.deadline):'Not announced'}</dd></div></dl><h3>About the program</h3><p>${escape(p.summary)}</p><h3>What to expect</h3><p>${escape(p.structure)}</p><h3>Who can apply</h3><p>${escape(p.eligibility)}</p>${p.notes?`<h3>Before you apply</h3><p>${escape(p.notes)}</p>`:''}${state.status==='closed'?'<p class="muted">This opening has closed. It will leave the directory 14 days after its recorded closing date.</p>':''}<div class="verification">✓ Official source reviewed · ${dateLabel(p.checked)}<a href="${escape(p.source)}" target="_blank" rel="noopener noreferrer">${escape(new URL(p.source).hostname)} ↗</a></div></div>`;
 $('back').addEventListener('click',closeDetail);
}
function closeDetail(){const wasOpen=document.body.classList.contains('detail-open');document.body.classList.remove('detail-open');if(wasOpen)document.querySelector(`[data-id="${selected}"]`)?.focus({preventScroll:true});}
function render(){
 const f=filters();visible=programs.filter(p=>matches(p,f));
 const sort=$('sort').value;
 visible.sort((a,b)=>sort==='company'?a.company.localeCompare(b.company)||a.title.localeCompare(b.title):sort==='start'?(a.start||'9999').localeCompare(b.start||'9999'):(statusOf(a).status==='open'?0:1)-(statusOf(b).status==='open'?0:1));
 if(!visible.some(p=>p.id===selected))selected=visible[0]?.id;
 $('result-count').textContent=`${visible.length} program${visible.length===1?'':'s'}`;
 $('reset').hidden=!(f.query||f.area||f.start||f.country||f.degree||f.type||f.status!=='active'||!f.includeUnknown);
 $('program-list').innerHTML=visible.length?visible.map(p=>`<button class="program-row ${p.id===selected?'selected':''}" data-id="${p.id}" aria-pressed="${p.id===selected}" aria-controls="detail"><div class="row-top">${companyLogo(p)}<div><div class="company">${escape(p.company)}</div><div class="row-country">${escape(p.country)}</div></div>${badge(p)}</div><h2>${escape(p.title)}</h2><div class="row-meta">${escape(p.areas.join(' · '))}</div><div class="row-bottom"><span>${tags(p)}</span><span class="row-start">Starts ${startLabel(p)}</span></div><span class="row-arrow" aria-hidden="true">›</span></button>`).join(''):'<div class="empty"><h2>No programs match just yet.</h2><p>Try another business area or include programs<br>whose start date hasn’t been announced.</p><button id="empty-reset">Clear all filters</button></div>';
 $('empty-reset')?.addEventListener('click',reset);
 detail(visible.find(p=>p.id===selected));
}
function reset(){$('filters').reset();render();}
for(const area of [...new Set(programs.flatMap(p=>p.areas))].sort())$('area').add(new Option(area,area));
$('program-list').addEventListener('click',e=>{const row=e.target.closest('[data-id]');if(!row)return;selected=row.dataset.id;document.querySelectorAll('.program-row').forEach(r=>{const chosen=r.dataset.id===selected;r.classList.toggle('selected',chosen);r.setAttribute('aria-pressed',chosen);});detail(visible.find(p=>p.id===selected));$('detail').scrollTop=0;if(matchMedia('(max-width:760px)').matches){document.body.classList.add('detail-open');$('back').focus();}});
$('filters').addEventListener('submit',e=>e.preventDefault());
$('filters').addEventListener('input',render);$('sort').addEventListener('change',render);$('reset').addEventListener('click',reset);
$('more-button').addEventListener('click',()=>{const open=$('more-filters').hidden;$('more-filters').hidden=!open;$('more-button').setAttribute('aria-expanded',open);$('more-button').innerHTML=`${open?'Fewer':'More'} filters <span aria-hidden="true">${open?'−':'+'}</span>`;});
for(const id of ['about-button','footer-criteria'])$(id).addEventListener('click',()=>$('criteria').showModal());
$('close-criteria').addEventListener('click',()=>$('criteria').close());
$('criteria').addEventListener('click',e=>{if(e.target===$('criteria')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('criteria').open)closeDetail();if(e.key==='Tab'&&document.body.classList.contains('detail-open')){const controls=[...$('detail').querySelectorAll('button,a[href]')];const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
render();
let lifecycleSignature=JSON.stringify(programs.map(p=>statusOf(p)));
setInterval(()=>{const next=JSON.stringify(programs.map(p=>statusOf(p)));if(next!==lifecycleSignature){lifecycleSignature=next;const scroll=$('detail').scrollTop;render();$('detail').scrollTop=scroll;}},60000);

if(document.modelContext?.registerTool){
 const lifecycle=new AbortController();
 const tool={name:'filter_graduate_programs',description:'Set the visible directory filters and return matching graduate programs. Does not apply for jobs.',inputSchema:{type:'object',properties:{query:{type:'string'},country:{type:'string',enum:['','United States','Canada']},degree:{type:'string',enum:['','bachelor','master']},area:{type:'string'},status:{type:'string',enum:['active','open','all','closed']}},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){
  if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Expected a filter object.');
  for(const [key,value] of Object.entries(input)){if(!['query','country','degree','area','status'].includes(key)||typeof value!=='string')throw new Error('Invalid filter.');if(key!=='query'&&![...$(key).options].some(o=>o.value===value))throw new Error('Unsupported filter value.');}
  // Validate every input before changing any visible state.
  for(const [key,value] of Object.entries(input))$(key).value=value;
  render();return {count:visible.length,programs:visible.map(p=>({id:p.id,company:p.company,title:p.title,start:startLabel(p),status:statusOf(p).status}))};
 }};
 try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}
 window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
