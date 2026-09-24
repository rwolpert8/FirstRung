const DAY=86400000;
export function statusOf(p,now=new Date()) {
  const closure=p.closedAt || (p.deadline && now.getTime()>=Date.parse(p.deadline) ? p.deadline : null);
  if(closure)return {status:'closed',archived:now.getTime()>=Date.parse(closure)+14*DAY,closure};
  // A dated verification is not evidence that an undated opening stays open forever.
  if(p.status==='open' && now.getTime()-Date.parse(p.checked+'T00:00:00Z')>=14*DAY)return {status:'unknown',archived:false};
  return {status:p.status,archived:false};
}
export function matches(p,f,now=new Date()){
  const state=statusOf(p,now);
  if(state.archived)return false;
  if(f.status==='open' && state.status!=='open')return false;
  if(f.status==='closed' && state.status!=='closed')return false;
  if(f.status==='active' && state.status==='closed')return false;
  if(f.query && ![p.title,p.company,p.location,...p.areas,...p.types].join(' ').toLowerCase().includes(f.query.trim().toLowerCase()))return false;
  if(f.area && !p.areas.includes(f.area))return false;
  if(f.country && f.country!==p.country)return false;
  if(f.degree && !p.degrees.includes(f.degree))return false;
  if(f.type && !p.types.includes(f.type))return false;
  if(f.start==='unknown')return !p.start;
  if(!p.start)return f.includeUnknown;
  if(f.start){const [year,quarter]=f.start.split('-Q');return p.start.slice(0,4)===year && Math.ceil(Number(p.start.slice(5,7))/3)===Number(quarter);}
  return true;
}
export function startLabel(p){return p.start?new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(p.start+'-01T00:00:00Z')):'Not announced';}
