const PS=['Not Pregnant','Monitoring','Pregnant','Expected Soon'];
crud({store:'breeding',title:'Pregnancy & Breeding',add:'Add Breeding Record',
 cols:[['animal','Animal'],['breed','Breed'],['date','Breeding date'],['male','Male animal'],['status','Pregnancy status'],['expected','Expected delivery'],['notes','Notes']],
 fields:[['animal','Animal','select',names],['breed','Breed','text'],['date','Breeding date','date',0,1],['male','Male animal','text'],['status','Pregnancy status','select',PS],['expected','Expected delivery date','date'],['notes','Notes','textarea']],
 filters:[['status','Statuses',PS]],
 top:()=>{const p=DB.all('breeding').filter(b=>['Pregnant','Expected Soon'].includes(b.status)&&b.expected);
  return `<div class="card" style="margin-bottom:16px"><h3>🤰 Pregnancy timeline</h3>${bars(p.map(b=>{const s=new Date(b.date),e=new Date(b.expected);return [b.animal+' → '+b.expected,Math.max(0,Math.min(100,Math.round((Date.now()-s)/(e-s)*100))),'%']}),100)||'No pregnant animals'}</div>`}});
