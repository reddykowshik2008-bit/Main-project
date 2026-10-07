const lastVacc=n=>{const v=DB.all('vaccinations').filter(x=>x.animal==n&&x.status=='Completed').sort((a,b)=>b.date.localeCompare(a.date))[0];return v?v.date:'—'};
const TYPES=['Cow','Buffalo','Goat','Sheep','Calf'],STAT=['Healthy','Sick','Monitoring','Under Treatment'];
if(document.body.dataset.page=='animal-profile'){
 App.init('Animal Profile',el=>{
  const a=DB.all('animals').find(x=>x._id==new URLSearchParams(location.search).get('id'));
  if(!a){el.innerHTML='<div class="empty">🐄<p>Animal not found.</p><a class="btn" href="animals.html">Back to animals</a></div>';return}
  const by=k=>DB.all(k).filter(x=>x.animal==a.name);
  const tabs={Overview:()=>`<div class="card"><div class="grid2">${[['Tag',a.tag],['Colour',a.color],['Location',a.location],['Date of birth',a.dob],['Conditions',a.conditions],['Notes',a.notes]].map(r=>`<div><small>${r[0]}</small><br><b>${esc(r[1]||'—')}</b></div>`).join('')}</div></div>`,
  'Health History':()=>mini(by('health'),[['date','Date'],['disease','Illness'],['symptoms','Symptoms'],['severity','Severity'],['status','Status']]),
  Vaccinations:()=>mini(by('vaccinations'),[['vaccine','Vaccine'],['date','Date'],['next','Next due'],['status','Status']]),
  Treatments:()=>mini(by('treatments'),[['medicine','Medicine'],['dosage','Dosage'],['vet','Vet'],['start','Start'],['end','End']]),
  Breeding:()=>mini(by('breeding'),[['date','Date'],['male','Male'],['status','Status'],['expected','Expected delivery']]),
  Nutrition:()=>mini(by('feed'),[['type','Feed'],['qty','Qty (kg)'],['time','Time'],['water','Water (L)'],['supplements','Supplements']])};
  el.innerHTML=`<div class="card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">${a.photo?`<img class="av" style="width:90px;height:90px" src="${a.photo}">`:`<span class="av" style="width:90px;height:90px;font-size:3rem">${ICON[a.type]}</span>`}<div style="flex:1"><h2 style="margin:0">${esc(a.name)} ${badge(a.status)}</h2>${esc(a.id)} · ${esc(a.type)} · ${esc(a.breed)} · ${esc(a.gender)} · ${age(a.dob)} · ${esc(a.weight)} kg</div><div><a class="btn" href="health.html?add=1">Record health</a> <a class="btn ghost" href="animals.html">← Back</a></div></div><div class="tabs">${Object.keys(tabs).map((t,i)=>`<button class="${i?'':'on'}">${t}</button>`).join('')}</div><div id="tb"></div>`;
  const show=t=>$('#tb').innerHTML=tabs[t]();show('Overview');
  $('.tabs').onclick=e=>{if(e.target.tagName!='BUTTON')return;$$('.tabs button').forEach(b=>b.classList.toggle('on',b==e.target));show(e.target.textContent)}})
}else crud({store:'animals',title:'Animals',add:'Add Animal',
 cols:[['photo','Photo',r=>r.photo?`<img class="av" src="${r.photo}" alt="">`:`<span class="av">${ICON[r.type]||'🐄'}</span>`],['id','ID'],['name','Name',r=>`<a href="animal-profile.html?id=${r._id}"><b>${esc(r.name)}</b></a>`],['type','Type'],['breed','Breed'],['gender','Gender'],['dob','Age',r=>age(r.dob)],['weight','Weight',r=>r.weight+' kg'],['status','Status'],['vac','Last vaccination',r=>lastVacc(r.name)]],
 fields:[['id','Animal ID','text',0,1],['name','Animal name','text',0,1],['type','Animal type','select',TYPES],['breed','Breed','text'],['gender','Gender','select',['Female','Male']],['dob','Date of birth','date',0,1],['weight','Weight (kg)','number'],['color','Color','text'],['location','Farm location','text'],['tag','Tag number','text'],['photo','Photo','file'],['status','Health status','select',STAT],['conditions','Existing medical conditions','text'],['notes','Notes','textarea']],
 filters:[['type','Types',TYPES],['status','Statuses',STAT]],
 sorts:[['Name',(a,b)=>a.name.localeCompare(b.name)],['Weight',(a,b)=>b.weight-a.weight],['Age (oldest)',(a,b)=>a.dob.localeCompare(b.dob)]],
 check:(v,r)=>DB.all('animals').some(a=>a.id==v.id&&(!r||a._id!=r._id))?'Animal ID already exists':''});
