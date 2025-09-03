
let s = GP.load();
const root = GP.$('#page-root');

// Cards
root.appendChild(GP.kpiCards(s));

// Charts container
const grid = GP.el('div',{class:'grid'});
const c1 = GP.el('canvas',{width:520,height:260});
const c2 = GP.el('canvas',{width:520,height:260});
grid.append(GP.el('div',{class:'card'},[GP.el('h3',{text:'Completions by Class'}), c1]));
grid.append(GP.el('div',{class:'card'},[GP.el('h3',{text:'Completions Last 7 Days'}), c2]));
root.append(grid);

// Bar chart
function bar(ctx, data, labels){
  const w=ctx.canvas.width-40, h=ctx.canvas.height-40, x0=20, y0=20;
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  const max = Math.max(1, ...data);
  const bw = w/(data.length*1.5);
  data.forEach((v,i)=>{
    const x = x0 + i*(bw*1.5);
    const bh = (v/max)*h;
    ctx.fillStyle = '#5b6bff';
    ctx.fillRect(x, y0 + (h-bh), bw, bh);
    ctx.fillStyle = '#a9add6'; ctx.font='12px system-ui'; ctx.textAlign='center';
    ctx.fillText(labels[i], x+bw/2, y0+h+14);
    ctx.fillStyle = '#fff'; ctx.fillText(v, x+bw/2, y0 + (h-bh) - 6);
  });
}

// Build datasets
const byClass = {};
s.completions.forEach(c=> byClass[c.class] = (byClass[c.class]||0)+1);
const clsLabels = Object.keys(byClass).length? Object.keys(byClass): ['None'];
const clsData = clsLabels.map(k=>byClass[k]||0);
bar(c1.getContext('2d'), clsData, clsLabels);

// Last 7 days
const days=[6,5,4,3,2,1,0].map(d=>{
  const dt=new Date(Date.now()-86400000*d);
  return dt.toLocaleDateString(undefined,{month:'short',day:'numeric'});
}).reverse();
const counts = new Array(7).fill(0);
s.completions.forEach(c=>{
  const diff = Math.floor((Date.now()-c.when)/86400000);
  if(diff>=0 && diff<7){ counts[6-diff]++; }
});
bar(c2.getContext('2d'), counts, days);
