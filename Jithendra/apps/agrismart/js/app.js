const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const seed={
crops:[{name:'Paddy',field:'North Field',stage:'Growing',area:4,harvest:'2026-12-10'},{name:'Sugarcane',field:'River Plot',stage:'Sowing',area:3,harvest:'2027-03-15'},{name:'Groundnut',field:'East Field',stage:'Harvest Ready',area:2,harvest:'2026-10-12'},{name:'Tomato',field:'Green Patch',stage:'Flowering',area:1,harvest:'2026-11-05'}],
fields:[{name:'North Field',size:4,soil:'Clay',moisture:62,pump:false},{name:'River Plot',size:3,soil:'Loam',moisture:48,pump:true},{name:'East Field',size:2,soil:'Sandy',moisture:25,pump:false},{name:'Green Patch',size:1,soil:'Loam',moisture:71,pump:false}],
tasks:[{title:'Apply urea fertilizer',field:'North Field',due:'2026-10-06',priority:'High',status:'Pending'},{title:'Repair drip line',field:'East Field',due:'2026-10-08',priority:'Medium',status:'Pending'},{title:'Harvest groundnut',field:'East Field',due:'2026-10-12',priority:'High',status:'Pending'},{title:'Buy seeds',field:'All',due:'2026-10-02',priority:'Low',status:'Done'}],
finance:[{desc:'Paddy sale',type:'Income',cat:'Sales',amt:85000,date:'2026-06-10'},{desc:'Seeds',type:'Expense',cat:'Seeds',amt:12000,date:'2026-06-18'},{desc:'Labour wages',type:'Expense',cat:'Labour',amt:18000,date:'2026-07-05'},{desc:'Milk sales',type:'Income',cat:'Sales',amt:24000,date:'2026-08-01'},{desc:'Diesel',type:'Expense',cat:'Fuel',amt:6500,date:'2026-08-12'},{desc:'Fertilizer',type:'Expense',cat:'Fertilizer',amt:14000,date:'2026-09-02'},{desc:'Vegetable sale',type:'Income',cat:'Sales',amt:31000,date:'2026-09-20'}],
livestock:[{name:'Lakshmi',type:'Cow',age:4,health:'Healthy',vaccine:'2026-12-01'},{name:'Nandi',type:'Bull',age:6,health:'Healthy',vaccine:'2026-11-15'},{name:'Goat herd',type:'Goat',age:2,health:'Check-up',vaccine:'2026-10-10'},{name:'Poultry',type:'Hen',age:1,health:'Healthy',vaccine:'2027-01-05'}],
inventory:[{item:'Urea',cat:'Fertilizer',qty:40,unit:'kg',min:50},{item:'Paddy seeds',cat:'Seeds',qty:120,unit:'kg',min:50},{item:'Pesticide',cat:'Chemical',qty:8,unit:'L',min:10},{item:'Diesel',cat:'Fuel',qty:60,unit:'L',min:30}],
profile:{name:'Ravi Kumar',farm:'Green Valley Farm',phone:'9876543210',location:'Chengalpattu, Tamil Nadu'}};
let D;try{D=JSON.parse(localStorage.getItem('agrismart'))}catch(e){}D=D||structuredClone(seed);
const save=()=>{try{localStorage.setItem('agrismart',JSON.stringify(D))}catch(e){}};
const pr=['Low','Medium','High'];
const cfg={
crops:{t:'Crops',i:'🌱',c:[['name','Crop'],['field','Field'],['stage','Stage','select',['Sowing','Growing','Flowering','Harvest Ready']],['area','Area (acres)','number'],['harvest','Harvest date','date']]},
fields:{t:'Fields',i:'🗺️',c:[['name','Field name'],['size','Size (acres)','number'],['soil','Soil','select',['Clay','Loam','Sandy','Black']],['moisture','Moisture %','number']]},
tasks:{t:'Tasks',i:'✅',c:[['title','Task'],['field','Field'],['due','Due','date'],['priority','Priority','select',pr],['status','Status','select',['Pending','Done']]]},
finance:{t:'Finance',i:'💰',c:[['desc','Description'],['type','Type','select',['Income','Expense']],['cat','Category','select',['Sales','Seeds','Labour','Fuel','Fertilizer','Other']],['amt','Amount (₹)','number'],['date','Date','date']]},
livestock:{t:'Livestock',i:'🐄',c:[['name','Name'],['type','Type'],['age','Age (yrs)','number'],['health','Health','select',['Healthy','Check-up','Sick']],['vaccine','Next vaccine','date']]},
inventory:{t:'Inventory',i:'📦',c:[['item','Item'],['cat','Category'],['qty','Quantity','number'],['unit','Unit'],['min','Min stock','number']]}};
const pages=[['dashboard','Dashboard','🏠'],['crops'],['fields'],['irrigation','Irrigation','💧'],['weather','Weather','⛅'],['tasks'],['finance'],['livestock'],['inventory'],['reports','Reports','📊'],['profile','Profile','👤']];
const inr=n=>'₹'+Number(n).toLocaleString('en-IN');let charts=[],page='dashboard',q='';
const toast=m=>{const t=$('#toast');t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',2200)};
const sum=(t)=>D.finance.filter(f=>f.type==t).reduce((a,f)=>a+ +f.amt,0);
function alerts(){const a=[];D.inventory.filter(i=>i.qty<i.min).forEach(i=>a.push(['w',`Low stock: ${i.item} (${i.qty}${i.unit})`]));
D.fields.filter(f=>f.moisture<30).forEach(f=>a.push(['r',`${f.name} soil moisture is low (${f.moisture}%)`]));
D.tasks.filter(t=>t.status=='Pending'&&t.due<'2026-10-05').forEach(t=>a.push(['r',`Overdue: ${t.title}`]));
D.crops.filter(c=>c.stage=='Harvest Ready').forEach(c=>a.push(['b',`${c.name} is ready for harvest`]));
a.push(['b','Rain expected on Tuesday – plan spraying accordingly']);return a}
function nav(){$('#nav').innerHTML=pages.map(p=>{const c=cfg[p[0]];return`<a data-p="${p[0]}" class="${p[0]==page?'on':''}">${c?c.i:p[2]} ${c?c.t:p[1]}</a>`}).join('');$('#bc').textContent=alerts().length}
function chart(id,type,data,opt={}){charts.push(new Chart($(id),{type,data,options:{responsive:true,maintainAspectRatio:false,...opt}}))}
function table(k){const c=cfg[k],rows=D[k].map((r,i)=>({r,i})).filter(({r})=>JSON.stringify(r).toLowerCase().includes(q));
return`<div class="card"><div class="tools"><input id="q" placeholder="Search ${c.t.toLowerCase()}…" value="${esc(q)}"><button class="btn" data-add="${k}">+ Add</button></div><div class="wrap"><table><tr>${c.c.map(x=>`<th>${x[1]}</th>`).join('')}<th></th></tr>${rows.map(({r,i})=>`<tr>${c.c.map(x=>{let v=r[x[0]];
if(x[0]=='status'||x[0]=='health'||x[0]=='stage'||x[0]=='priority'||x[0]=='type'&&k=='finance'){const cl=/Done|Healthy|Income|Low|Growing/.test(v)?'':/Sick|High|Expense/.test(v)?'r':/Harvest/.test(v)?'b':'w';return`<td><button class="badge ${cl}" ${k=='tasks'&&x[0]=='status'?`data-tog="${i}" style="cursor:pointer"`:''}>${esc(v)}</button></td>`}
if(x[0]=='amt')v=inr(v);return`<td>${esc(v)}</td>`}).join('')}<td><button class="btn d" data-del="${k}:${i}">✕</button></td></tr>`).join('')||`<tr><td colspan="9">No records found.</td></tr>`}</table></div></div>`}
const views={
dashboard(){const open=D.tasks.filter(t=>t.status=='Pending').length;
return`<div class="grid"><div class="card stat"><i>🌾</i><b>${D.fields.reduce((a,f)=>a+ +f.size,0)} ac</b><span>Total farm area</span></div><div class="card stat"><i>🌱</i><b>${D.crops.length}</b><span>Active crops</span></div><div class="card stat"><i>💰</i><b>${inr(sum('Income')-sum('Expense'))}</b><span>Net profit</span></div><div class="card stat"><i>📋</i><b>${open}</b><span>Pending tasks</span></div></div>
<div class="grid g2"><div class="card"><h3>Income vs Expense</h3><div style="height:240px"><canvas id="c1"></canvas></div></div><div class="card"><h3>Crop area</h3><div style="height:240px"><canvas id="c2"></canvas></div></div></div>
<div class="card"><h3>Alerts</h3>${alerts().map(a=>`<div class="alert ${a[0]=='w'?'':a[0]}">${esc(a[1])}</div>`).join('')}</div>`},
irrigation(){return`<div class="grid">${D.fields.map((f,i)=>`<div class="card"><label class="sw"><input type="checkbox" data-pump="${i}" ${f.pump?'checked':''} style="width:auto"> Pump</label><h3>${esc(f.name)}</h3><span class="badge ${f.moisture<30?'r':''}">${f.moisture<30?'Needs water':'Optimal'}</span><div class="bar"><div style="width:${f.moisture}%"></div></div>Soil moisture: <b>${f.moisture}%</b><br><small style="color:var(--muted)">${f.pump?'💧 Irrigating now':'Pump is off'}</small></div>`).join('')}</div>`},
weather(){const d=[['Today','☀️',32,24],['Mon','⛅',31,24],['Tue','🌧️',28,23],['Wed','⛈️',27,23],['Thu','🌤️',30,24]];
return`<div class="card" style="background:var(--primary);color:#fff;margin-bottom:16px"><h3>${esc(D.profile.location)}</h3><div style="font-size:48px">☀️ 32°C</div>Humidity 68% · Wind 12 km/h · Rain chance 20%</div><div class="grid">${d.map(x=>`<div class="card wx"><b>${x[0]}</b><div>${x[1]}</div>${x[2]}° / ${x[3]}°</div>`).join('')}</div><div class="alert b">Farming tip: heavy rain on Tuesday – delay fertilizer and pesticide application.</div>`},
reports(){return`<div class="grid g2"><div class="card"><h3>Expenses by category</h3><div style="height:260px"><canvas id="c3"></canvas></div></div><div class="card"><h3>Summary</h3><p>Total income: <b>${inr(sum('Income'))}</b></p><p>Total expenses: <b>${inr(sum('Expense'))}</b></p><p>Net profit: <b>${inr(sum('Income')-sum('Expense'))}</b></p><p>Livestock: <b>${D.livestock.length}</b> groups · Crops: <b>${D.crops.length}</b></p><button class="btn" onclick="window.print()">🖨️ Print report</button></div></div>`},
profile(){const p=D.profile;return`<div class="card" style="max-width:480px"><form id="pf">${Object.keys(p).map(k=>`<label>${k[0].toUpperCase()+k.slice(1)}</label><input name="${k}" value="${esc(p[k])}">`).join('')}<br><button class="btn">Save profile</button></form></div>`}};
function render(){charts.forEach(c=>c.destroy());charts=[];const c=cfg[page];$('#title').textContent=c?c.t:pages.find(p=>p[0]==page)[1];
$('#view').innerHTML=c?table(page):views[page]();nav();
if(page=='dashboard'){const m={};D.finance.forEach(f=>{const k=f.date.slice(0,7);m[k]=m[k]||{Income:0,Expense:0};m[k][f.type]+= +f.amt});const ks=Object.keys(m).sort();
chart('#c1','bar',{labels:ks,datasets:[{label:'Income',data:ks.map(k=>m[k].Income),backgroundColor:'#2e7d32'},{label:'Expense',data:ks.map(k=>m[k].Expense),backgroundColor:'#f9a825'}]});
chart('#c2','doughnut',{labels:D.crops.map(c=>c.name),datasets:[{data:D.crops.map(c=>c.area),backgroundColor:['#2e7d32','#66bb6a','#f9a825','#1e88e5','#fb8c00']}]})}
if(page=='reports'){const m={};D.finance.filter(f=>f.type=='Expense').forEach(f=>m[f.cat]=(m[f.cat]||0)+ +f.amt);
chart('#c3','pie',{labels:Object.keys(m),datasets:[{data:Object.values(m),backgroundColor:['#2e7d32','#66bb6a','#f9a825','#1e88e5','#fb8c00','#e53935']}]})}
const qi=$('#q');if(qi)qi.oninput=e=>{q=e.target.value.toLowerCase();const p=e.target.selectionStart;render();const n=$('#q');n.focus();n.setSelectionRange(p,p)}}
function openForm(k){const c=cfg[k];$('#form').innerHTML=`<h3>Add ${c.t.replace(/s$/,'')}</h3>${c.c.map(x=>`<label>${x[1]}</label>${x[2]=='select'?`<select name="${x[0]}">${x[3].map(o=>`<option>${o}</option>`).join('')}</select>`:`<input name="${x[0]}" type="${x[2]||'text'}" required>`}`).join('')}<br><div style="display:flex;gap:8px"><button class="btn">Save</button><button type="button" class="btn alt" id="cx">Cancel</button></div>`;
$('#form').dataset.k=k;$('#modal').classList.add('show');$('#cx').onclick=()=>$('#modal').classList.remove('show')}
$('#form').onsubmit=e=>{e.preventDefault();const k=e.target.dataset.k,o=Object.fromEntries(new FormData(e.target));if(k=='fields')o.pump=false;D[k].push(o);save();$('#modal').classList.remove('show');render();toast('Saved ✔')};
document.addEventListener('click',e=>{const t=e.target,g=a=>t.closest(`[${a}]`);let el;
if(el=g('data-p')){page=el.dataset.p;q='';$('#side').classList.remove('open');render()}
else if(el=g('data-add'))openForm(el.dataset.add);
else if(el=g('data-del')){const[k,i]=el.dataset.del.split(':');if(confirm('Delete this record?')){D[k].splice(i,1);save();render();toast('Deleted')}}
else if(el=g('data-tog')){const r=D.tasks[el.dataset.tog];r.status=r.status=='Done'?'Pending':'Done';save();render()}
else if(t.id=='bell')alert(alerts().map(a=>'• '+a[1]).join('\n'));
else if(t.id=='menu')$('#side').classList.toggle('open');
else if(t.id=='theme'){const r=document.documentElement;r.dataset.theme=r.dataset.theme=='light'?'dark':'light'; if(r.dataset.theme=='dark'){r.style.cssText='--background:#121a14;--card:#1c2620;--text:#e8efe9;--muted:#9bb0a0;--line:#2c3a30'}else r.style.cssText=''}});
document.addEventListener('change',e=>{if(e.target.dataset.pump!=null){const f=D.fields[e.target.dataset.pump];f.pump=e.target.checked;save();render();toast(f.name+(f.pump?' irrigation started':' irrigation stopped'))}});
document.addEventListener('submit',e=>{if(e.target.id=='pf'){e.preventDefault();D.profile=Object.fromEntries(new FormData(e.target));save();toast('Profile updated ✔')}});
render();