
let s = GP.load();
const root = GP.$('#page-root');
const panel = GP.el('div',{class:'card'});
panel.append(GP.el('h3',{text:'Post Idle Ticket'}));
const form = GP.el('form',{},[
  GP.el('div',{class:'row'},[
    (()=>{ const l=GP.el('label'); l.innerHTML='Name<input name="name" required>'; return l; })(),
    (()=>{ const l=GP.el('label'); const sel=GP.el('select',{name:'class'});
      sel.innerHTML='<option>Scout</option><option>Tank</option><option>General</option><option>Mage</option><option>Merchant</option><option>Mercenary</option>';
      l.textContent='Class '; l.append(sel); return l; })()
  ]),
  (()=>{ const l=GP.el('label'); l.innerHTML='Note<input name="note" placeholder="Availability, skills, time window">'; return l; })(),
  GP.el('button',{text:'Post Idle Ticket'})
]);
form.onsubmit=(e)=>{ e.preventDefault(); const f=new FormData(form);
  const id = Math.max(0,...s.idle.map(i=>i.id))+1;
  s.idle.unshift({id,name:f.get('name'),class:f.get('class'),note:f.get('note')||''});
  GP.save(s); form.reset(); renderList();
};
panel.append(form);
root.append(panel);

const list = GP.el('div',{class:'list'}); root.append(list);

function renderList(){
  s = GP.load(); list.innerHTML='';
  s.idle.forEach(i=>{
    const item=GP.el('div',{class:'item'});
    item.append(GP.el('div',{class:'tag '+i.class}, `${GP.emoji(i.class)} ${i.class}`),
                GP.el('strong',{text:i.name}),
                GP.el('div',{class:'muted',text:i.note||''}));
    const rm=GP.el('button',{class:'small ghost',text:'Remove'});
    rm.onclick=()=>{ s.idle = s.idle.filter(x=>x.id!==i.id); GP.save(s); renderList(); };
    item.append(rm);
    list.append(item);
  });
}
renderList();
