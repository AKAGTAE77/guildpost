
// Shared state via localStorage
const KEY='guildpost-shared-v1';
function seed(){
  return {
    profile:{name:'', class:''},
    tokens: 120,
    quests:[
      {id:1,title:'Source 3 suppliers for Q4 widgets', class:'Scout', dept:'Ops', campaign:'Q4 Launch', reward:15, status:'Open', desc:'Collect quotes from at least 3 qualified suppliers.', due:null, assignee:null},
      {id:2,title:'Town hall presentation support', class:'Tank', dept:'HR', campaign:'Culture', reward:25, status:'Open', desc:'MC the monthly town hall. Coordinate with HR.', due:null, assignee:null},
      {id:3,title:'OKR orchestration for Ops', class:'General', dept:'Ops', campaign:'Q4 Ops', reward:30, status:'In Progress', desc:'Facilitate OKR planning and internal comms.', due:null, assignee:'Avery'},
      {id:4,title:'Competitor teardown deck', class:'Mage', dept:'Product', campaign:'Strategy', reward:20, status:'Open', desc:'Analyze new entrant and produce a 10-slide brief.', due:null, assignee:null},
      {id:5,title:'Renegotiate courier rates', class:'Merchant', dept:'Admin', campaign:'Cost Save', reward:40, status:'Open', desc:'Target 10% cost reduction with new SLA.', due:null, assignee:null},
    ],
    idle:[
      {id:1,name:'Jordan', class:'Mage', note:'Free this afternoon; stats & R&D.'},
      {id:2,name:'Sam', class:'Tank', note:'Available for PR / CX triage.'}
    ],
    completions:[
      {by:'Avery', class:'General', dept:'Ops', reward:30, when: Date.now()-86400000*5},
      {by:'Maya', class:'Scout', dept:'Ops', reward:15, when: Date.now()-86400000*3},
      {by:'Jordan', class:'Mage', dept:'Product', reward:20, when: Date.now()-86400000*2},
      {by:'Sam', class:'Tank', dept:'HR', reward:25, when: Date.now()-86400000*1},
      {by:'Alex', class:'Merchant', dept:'Admin', reward:40, when: Date.now()-86400000*7},
    ]
  };
}
function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || seed(); }catch(e){ return seed(); } }
function save(s){ localStorage.setItem(KEY, JSON.stringify(s)); }

// helpers
const $ = (sel,root=document)=>root.querySelector(sel);
const $$= (sel,root=document)=>Array.from(root.querySelectorAll(sel));
const el=(tag,attrs={},children=[])=>{const n=document.createElement(tag); for(const k in attrs){ if(k==='class') n.className=attrs[k]; else if(k==='text') n.textContent=attrs[k]; else n.setAttribute(k,attrs[k]); } (Array.isArray(children)?children:[children]).filter(Boolean).forEach(c=> n.appendChild(typeof c==='string'?document.createTextNode(c):c)); return n;};
const emoji = (c)=>({Scout:'🧭',Tank:'🛡️',General:'🎛️',Mage:'🪄',Merchant:'💼',Mercenary:'🗡️'})[c]||'🏷️';

function kpiCards(s){
  return el('div',{class:'grid'},[
    card('Active Quests', s.quests.filter(q=>q.status!=='Completed').length, ''),
    card('Completed (All Time)', s.completions.length, ''),
    card('Token Balance', s.tokens+' GPT', 'Simulated balance (wire up wallet later).'),
    card('My Class', (s.profile.class||'Set in Settings'), 'Profile is shared across pages.')
  ]);
}
function card(title, big, sub){ const c=el('div',{class:'card'}); c.append(el('h3',{text:title}),el('div',{class:'kpi',text:String(big)}), el('div',{class:'muted',text:sub||''})); return c; }

function layout(pageTitle, activeHref){
  // set active link after render
  $$('.nav a').forEach(a=>{ if(a.getAttribute('href')===activeHref) a.classList.add('active'); });
  $('.title').textContent = pageTitle;
  $('#year').textContent = new Date().getFullYear();
}

// Export
window.GP = { load, save, kpiCards, card, $, $$, el, emoji };
