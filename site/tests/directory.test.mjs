import test from 'node:test';
import assert from 'node:assert/strict';
import {matches,statusOf} from '../dist/logic.js';
import {programs} from '../dist/programs.js';
const f={query:'',area:'',start:'',country:'',degree:'',type:'',status:'active',includeUnknown:true};
const now=new Date('2026-09-24T12:00:00Z');
test('closed openings leave every result view exactly 14 days after closure',()=>{
 const p={...programs[0],closedAt:'2026-09-10T12:00:00Z'};
 assert.equal(statusOf(p,new Date(now.getTime()-1)).archived,false);
 assert.equal(statusOf(p,now).archived,true);
 assert.equal(matches(p,{...f,status:'all'},now),false);
});
test('deadline automatically closes opening, with a visible grace period',()=>{
 const p={...programs[0],deadline:'2026-09-24T11:00:00Z'};
 assert.equal(matches(p,f,now),false);
 assert.equal(matches(p,{...f,status:'all'},now),true);
 assert.equal(statusOf(p,now).status,'closed');
});
test('master filter includes explicitly higher-degree eligible postings',()=>{
 assert.equal(matches(programs[0],{...f,degree:'master'},now),true);
 assert.equal(matches(programs.find(p=>p.id==='bell-hr'),{...f,degree:'master'},now),false);
});
test('start quarter and unknown-date opt-in combine correctly',()=>{
 assert.equal(matches(programs[0],{...f,start:'2027-Q1'},now),true);
 assert.equal(matches(programs[0],{...f,start:'2027-Q3'},now),false);
 const p={...programs[0],start:null};
 assert.equal(matches(p,{...f,start:'2027-Q3'},now),true);
 assert.equal(matches(p,{...f,start:'2027-Q3',includeUnknown:false},now),false);
 assert.equal(matches(p,{...f,includeUnknown:false},now),false);
});
test('business area, country and search are intersected',()=>{
 const p=programs.find(p=>p.id==='bell-finance');
 assert.equal(matches(p,{...f,query:'bell',country:'Canada',area:'Finance & Accounting'},now),true);
 assert.equal(matches(p,{...f,country:'United States'},now),false);
});
test('stale undated openings lose confirmed-open status',()=>{
 assert.equal(statusOf(programs[0],new Date('2026-10-09T00:00:00Z')).status,'unknown');
});
test('curated records have unique IDs, official HTTPS sources and valid dates',()=>{
 assert.equal(new Set(programs.map(p=>p.id)).size,programs.length);
 assert.ok(programs.length>=20);
 for(const p of programs){
  assert.ok(['United States','Canada'].includes(p.country));
  assert.equal(new URL(p.source).protocol,'https:');
  assert.ok(p.start===null || /^\d{4}-(0[1-9]|1[0-2])$/.test(p.start));
  assert.ok(Number.isFinite(Date.parse(p.checked)));
  assert.ok(p.types.length && p.areas.length && p.eligibility && p.structure);
  if(p.status==='closed')assert.ok(p.closedAt || p.deadline);
 }
});
