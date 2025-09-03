
let s = GP.load();
const root = GP.$('#page-root');

// Filters + Create form
const panel = GP.el('div',{class:'card'});
panel.append(
  GP.el('h3',{text:'Create Quest'}),
  (()=>{
    const form = GP.el('form');
    form.innerHTML = `
      <div class="row">
        <label>Title<input name="title" required></label>
        <label>Class
          <select name="class" required>
            <option>Scout</option><option>Tank</option><option>General</option>
            <option>Mage</option><option>Merchant</option><option>Mercenary</option>
          </select>
        </label>
      </div>
      <div class="row">
        <label>Reward Tokens<input name="reward" type="number" value="10" min="0"></label>
        <label>Department
          <select name="dept">
            <option>CEO</option><option>CFO</option><option>COO</option><option>HR</option>
            <option>Legal</option><option>Admin</option><option>Ops</option><option>Sales</option>
            <option>Marketing</option><option>Product</option><option>Engineering</option>
          </select>
        </label>
      </div>
      <label>Campaign<input name="campaign" placeholder="e.g., Q4 Launch"></label>
      <label>Description<textarea name="desc" rows="3" placeholder="Requirements to fulfill this quest"></textarea></label>
      <button type="submit">Publish Quest</button>
    `;
    form.onsubmit = (e)=>{
      e.preventDefault();
      const f=new FormData(form);
      const id = Math.max(0,...s.quests.map(q=>q.id))+1;
      s.quests.unshift({
        id, title:f.get('title'), class:f.get('class'), dept:f.get('dept'),
        campaign:f.get('campaign')||'—', reward:Number(f.get('reward')||0),
        status:'Open', desc:f.get('desc')||'', due:null, assignee:null
      });
      GP.save(s);
      renderList();
      form.reset();
    };
    return form;
  })()
);
root.appendChild(panel);

// Filters
const filters = GP.el('div',{class:'row'});
filters.append(
  (()=>{
    const w=GP.el('div',{class:'card'});
    w.append(GP.el('h3',{text:'Filters'}));
    const fc = GP.el('select'); fc.innerHTML = `<option value="">All Classes</option>
      <option>Scout</option><option>Tank</option><option>General</option>
      <option>Mage</option><option>Merchant</option><option>Mercenary</option>`;
    const fs = GP.el('select'); fs.innerHTML = `<option value="">All Statuses</option>
      <option>Open</option><option>In Progress</option><option>Completed</option>`;
    fc.onchange=fs.onchange=()=>renderList(fc.value,fs.value);
    w.append(GP.el('div',{},[fc, fs]));
    return w;
  })()
);
root.appendChild(filters);

const list = GP.el('div',{class:'list'});
root.appendChild(list);

function renderList(fClass='', fStatus=''){
  s = GP.load();
  list.innerHTML='';
  s.quests
    .filter(q=>!fClass || q.class===fClass)
    .filter(q=>!fStatus || q.status===fStatus)
    .forEach(q=>{
      const item = GP.el('div',{class:'item'});
      item.append(
        GP.el('div',{class:'tag '+q.class}, `${GP.emoji(q.class)} ${q.class}`),
        GP.el('h3',{text:q.title}),
        GP.el('div',{class:'muted',text:q.desc||''}),
        GP.el('div',{class:'muted',text:`Dept: ${q.dept} • Campaign: ${q.campaign} • Reward: ${q.reward} GPT • Status: ${q.status}${q.assignee? ' • Assignee: '+q.assignee:''}`})
      );
      const actions = GP.el('div',{});
      if(q.status==='Open'){
        const btn = GP.el('button',{class:'small',text:'Accept Quest'});
        btn.onclick=()=>{
          const name = s.profile.name || prompt('Your name?');
          if(!name) return;
          s.profile.name = name;
          q.status='In Progress'; q.assignee=name; GP.save(s); renderList(fClass,fStatus);
        };
        actions.append(btn);
      }
      if(q.status==='In Progress'){
        const btn = GP.el('button',{class:'small',text:'Complete Quest'});
        btn.onclick=()=>{
          const name = s.profile.name || 'Anon';
          q.status='Completed';
          s.completions.push({by:name, class:q.class, dept:q.dept, reward:q.reward, when: Date.now()});
          s.tokens += q.reward;
          GP.save(s); renderList(fClass,fStatus);
        };
        actions.append(btn);
      }
      const del = GP.el('button',{class:'small ghost',text:'Delete'});
      del.onclick=()=>{ if(confirm('Delete this quest?')){ s.quests = s.quests.filter(x=>x.id!==q.id); GP.save(s); renderList(fClass,fStatus);} };
      actions.append(del);
      item.append(actions);
      list.append(item);
    });
}
renderList();
