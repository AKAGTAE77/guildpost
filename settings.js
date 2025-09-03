
let s = GP.load();
const root = GP.$('#page-root');
const card = GP.el('div',{class:'card'});
card.append(GP.el('h3',{text:'Profile'}));

const nameI = GP.el('input'); nameI.value = s.profile.name || ''; nameI.placeholder='Your name';
const classS = GP.el('select');
classS.innerHTML = '<option value="">—</option><option>Scout</option><option>Tank</option><option>General</option><option>Mage</option><option>Merchant</option><option>Mercenary</option>';
classS.value = s.profile.class || '';
const saveB = GP.el('button',{text:'Save Profile'});
saveB.onclick = ()=>{ s.profile.name=nameI.value.trim(); s.profile.class=classS.value; GP.save(s); alert('Saved!'); };

card.append(GP.el('div',{class:'row'},[
  (()=>{const w=GP.el('div'); w.append(GP.el('label',{text:'Name'}), nameI); return w;})(),
  (()=>{const w=GP.el('div'); w.append(GP.el('label',{text:'Class'}), classS); return w;})()
]));
card.append(saveB);
root.append(card);
