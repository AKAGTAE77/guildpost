
let s = GP.load();
const root = GP.$('#page-root');
const card = GP.el('div',{class:'card'});
card.append(GP.el('h3',{text:'Leaderboard'}));
const list = GP.el('div',{class:'list'}); card.append(list); root.append(card);

function render(){
  s = GP.load(); list.innerHTML='';
  const tally = {};
  s.completions.forEach(c=>{ tally[c.by] = (tally[c.by]||0)+c.reward; });
  const rows = Object.entries(tally).sort((a,b)=>b[1]-a[1]).slice(0,50);
  rows.forEach(([name,score],i)=>{
    const item=GP.el('div',{class:'item'});
    item.append(GP.el('div',{class:'badge'}, `#${i+1}`), GP.el('strong',{text:name}), GP.el('div',{class:'muted',text:`${score} GPT`}));
    list.append(item);
  });
}
render();
