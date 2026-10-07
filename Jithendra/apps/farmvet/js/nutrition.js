const FT=['Grass','Hay','Silage','Grain','Concentrate','Supplements'];
crud({store:'feed',title:'Feed & Nutrition',add:'Add Feed Record',
 cols:[['animal','Animal'],['type','Feed type'],['qty','Qty (kg)'],['time','Time'],['water','Water (L)'],['supplements','Supplements'],['notes','Notes']],
 fields:[['animal','Animal','select',names],['type','Feed type','select',FT],['qty','Quantity (kg)','number',0,1],['time','Feeding time','time'],['water','Water intake (L)','number'],['supplements','Supplements','text'],['notes','Notes','textarea']],
 filters:[['type','Feed types',FT]],
 top:()=>{const F=DB.all('feed'),A=DB.all('animals'),s=k=>F.reduce((t,f)=>t+(+f[k]||0),0),big=n=>['Cow','Buffalo','Calf'].includes((A.find(a=>a.name==n)||{}).type);
  const al=F.filter(f=>big(f.animal)&&f.water&&+f.water<20).map(f=>`⚠️ ${esc(f.animal)}: low water intake (${f.water} L)`);
  const avg=A.length?Math.round(A.reduce((t,a)=>t+(+a.weight||0),0)/A.length):0;
  return `<div class="grid" style="margin-bottom:16px"><div class="card stat"><div class="e">🌾</div><div class="n">${s('qty')} kg</div>Daily feed</div><div class="card stat"><div class="e">💧</div><div class="n">${s('water')} L</div>Water intake</div><div class="card stat"><div class="e">⚖️</div><div class="n">${avg} kg</div>Avg. herd weight</div><div class="card"><b>Nutrition alerts</b><br>${al.join('<br>')||'No alerts ✅'}</div></div>`}});
