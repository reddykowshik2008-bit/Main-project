// FarmVet core: layout, helpers, generic CRUD, dashboard, notifications, reports, settings, auth
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const uid=()=>Math.random().toString(36).slice(2,9);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const badge=v=>`<span class="b b-${String(v).toLowerCase().replace(/\W+/g,'')}">${esc(v)}</span>`;
const ICON={Cow:'🐄',Buffalo:'🐃',Goat:'🐐',Sheep:'🐑',Calf:'🐮'};
const age=d=>{const y=(Date.now()-new Date(d))/31557600000;return y>=1?Math.floor(y)+' yr':Math.max(1,Math.round(y*12))+' mo'};
const names=()=>DB.all('animals').map(a=>a.name);
const NAV=[['dashboard','🏠','Dashboard'],['animals','🐄','Animals'],['vaccinations','💉','Vaccinations'],['health','🩺','Health Records'],['medicines','💊','Medicines'],['appointments','📅','Appointments'],['breeding','🤰','Pregnancy & Breeding'],['nutrition','🌾','Feed & Nutrition'],['reports','📊','Reports'],['settings','⚙️','Settings']];
function toast(m,t='ok'){const w=$('#toasts')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'toasts'}));const e=document.createElement('div');e.className='toast '+t;e.textContent=m;w.append(e);setTimeout(()=>e.remove(),3200)}
function modal(title,html,ok,okText='Save'){const o=document.createElement('div');o.className='ov';o.innerHTML=`<form class="modal"><h3>${title}</h3><div>${html}</div><div class="ma"><button type="button" class="btn ghost" data-x>Cancel</button><button class="btn">${okText}</button></div></form>`;document.body.append(o);$('[data-x]',o).onclick=()=>o.remove();$('form',o).onsubmit=async e=>{e.preventDefault();if(await ok(e.target)!==false)o.remove()};return o}
const confirmBox=(msg,cb)=>modal('Please confirm',`<p>${msg}</p>`,cb,'Yes, continue');
const mini=(rows,cols)=>rows.length?`<div class="tw"><table class="tbl"><thead><tr>${cols.map(c=>`<th>${c[1]}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(c=>`<td data-label="${c[1]}">${['status','severity'].includes(c[0])?badge(r[c[0]]):esc(r[c[0]])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'<div class="empty">🌾<p>No records yet</p></div>';
const bars=(rows,max)=>rows.map(r=>`<div class="hb"><em>${esc(r[0])}</em><div><b style="width:${Math.min(100,r[1]/(max||Math.max(...rows.map(x=>x[1]),1))*100)}%"></b></div><span>${r[1]}${r[2]||''}</span></div>`).join('');

const App={init(title,render){
 const u=DB.get('user');if(!u){location.href='login.html';return}
 if(DB.get('dark'))document.body.classList.add('dark');
 const p=document.body.dataset.page==='animal-profile'?'animals':document.body.dataset.page;
 const unread=DB.all('notifications').filter(n=>!n.read).length;
 $('#app').innerHTML=`<aside class="side" id="side"><div class="logo">🐄 FarmVet</div>${NAV.map(n=>`<a href="${n[0]}.html" class="${n[0]==p?'on':''}">${n[1]} ${n[2]}</a>`).join('')}<a href="#" id="out">🚪 Logout</a></aside>
 <div class="wrap"><header><button class="ic" id="mn" aria-label="Menu">☰</button><input id="gs" placeholder="🔍 Search animals…"><button class="ic" id="dm" title="Dark mode">🌓</button><a class="ic" href="notifications.html" title="Notifications">🔔${unread?`<i class="dot">${unread}</i>`:''}</a><a class="prof" href="settings.html">${u.photo?`<img src="${u.photo}" alt="">`:'👤'}<span>${esc(u.name)}</span></a></header><main><h1>${title}</h1><div id="main"></div></main></div>
 <nav class="bot"><a href="dashboard.html"><b>🏠</b>Home</a><a href="animals.html"><b>🐄</b>Animals</a><a href="vaccinations.html"><b>💉</b>Vaccines</a><a href="appointments.html"><b>📅</b>Visits</a><button id="mn2"><b>☰</b>Menu</button></nav>`;
 const tg=()=>$('#side').classList.toggle('open');$('#mn').onclick=tg;$('#mn2').onclick=tg;
 $('#dm').onclick=()=>{DB.set('dark',!document.body.classList.toggle('dark'))||0;DB.set('dark',document.body.classList.contains('dark'))};
 $('#gs').onkeydown=e=>{if(e.key=='Enter')location.href='animals.html?q='+encodeURIComponent(e.target.value)};
 $('#out').onclick=e=>{e.preventDefault();confirmBox('Log out of FarmVet?',()=>{localStorage.removeItem('fv_user');location.href='login.html'})};
 document.addEventListener('click',e=>{if(innerWidth<=1024&&!e.target.closest('#side,#mn,#mn2'))$('#side').classList.remove('open')});
 render($('#main'));}};

function crud(c){App.init(c.title,el=>{
 const qs=new URLSearchParams(location.search);
 el.innerHTML=`<div id="ex"></div><div class="bar"><input id="q" placeholder="🔍 Search" value="${esc(qs.get('q')||'')}">${(c.filters||[]).map(f=>`<select data-f="${f[0]}" aria-label="${f[1]}"><option value="">All ${f[1]}</option>${f[2].map(o=>`<option ${qs.get(f[0])==o?'selected':''}>${o}</option>`).join('')}</select>`).join('')}${c.sorts?`<select id="srt">${c.sorts.map((s,i)=>`<option value="${i}">Sort: ${s[0]}</option>`).join('')}</select>`:''}<button class="btn" id="add">＋ ${c.add}</button></div><div id="list"></div>`;
 const save=a=>DB.set(c.store,a),upd=(id,o)=>{const a=DB.all(c.store);Object.assign(a.find(z=>z._id==id),o);save(a);draw()};
 function draw(){let d=DB.all(c.store).slice();const q=$('#q').value.toLowerCase();
  d=d.filter(r=>JSON.stringify(Object.values(r)).toLowerCase().includes(q)&&$$('[data-f]',el).every(s=>!s.value||r[s.dataset.f]==s.value));
  if(c.sorts)d.sort(c.sorts[$('#srt').value][1]);
  $('#ex').innerHTML=c.top?c.top():'';
  $('#list').innerHTML=d.length?`<div class="tw"><table class="tbl"><thead><tr>${c.cols.map(x=>`<th>${x[1]}</th>`).join('')}<th>Actions</th></tr></thead><tbody>${d.map(r=>`<tr>${c.cols.map(x=>`<td data-label="${x[1]}">${x[2]?x[2](r):['status','severity'].includes(x[0])?badge(r[x[0]]):esc(r[x[0]])}</td>`).join('')}<td class="act">${(c.extra||[]).map((x,i)=>!x.show||x.show(r)?`<button class="sm" data-x="${i}" data-id="${r._id}">${x.l}</button>`:'').join('')}<button class="sm" data-e="${r._id}">✏️ Edit</button><button class="sm danger" data-d="${r._id}" aria-label="Delete">🗑️ Delete</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">🌾<p>No records found. Try changing filters or add a new one.</p></div>';
  c.after&&c.after(el,upd)}
 function form(r){modal(r?'Edit record':c.add,c.fields.map(x=>{const v=r?r[x[0]]??'':'',o=typeof x[3]=='function'?x[3]():x[3];
  return `<label>${x[1]}${x[4]?' *':''}${x[2]=='select'?`<select name="${x[0]}">${o.map(i=>`<option ${i==v?'selected':''}>${esc(i)}</option>`).join('')}</select>`:x[2]=='textarea'?`<textarea name="${x[0]}" rows="2">${esc(v)}</textarea>`:`<input name="${x[0]}" type="${x[2]}" value="${x[2]=='file'?'':esc(v)}" ${x[2]=='file'?'accept="image/*"':''}>`}</label>`}).join(''),async f=>{
  const v=Object.fromEntries(new FormData(f));
  for(const x of c.fields){if(x[2]=='file'){const fl=v[x[0]];v[x[0]]=fl&&fl.size?await new Promise(s=>{const fr=new FileReader();fr.onload=()=>s(fr.result);fr.readAsDataURL(fl)}):(r?.[x[0]]||'')}else if(x[4]&&!String(v[x[0]]).trim()){toast(x[1]+' is required','err');return false}}
  const m=c.check&&c.check(v,r);if(m){toast(m,'err');return false}
  const a=DB.all(c.store);if(r)Object.assign(a.find(z=>z._id==r._id),v);else a.unshift({_id:uid(),...v});save(a);
  toast(r?'Updated successfully ✅':'Saved successfully ✅');draw()})}
 el.onclick=e=>{const b=e.target.closest('button');if(!b)return;const a=DB.all(c.store);
  if(b.dataset.e)form(a.find(z=>z._id==b.dataset.e));
  if(b.dataset.d)confirmBox('Delete this record? This cannot be undone.',()=>{save(a.filter(z=>z._id!=b.dataset.d));toast('Deleted');draw()});
  if(b.dataset.x)c.extra[b.dataset.x].fn(a.find(z=>z._id==b.dataset.id),upd)};
 $('#add').onclick=()=>form();el.addEventListener('input',e=>e.target.id=='q'&&draw());el.addEventListener('change',e=>e.target.matches('[data-f],#srt')&&draw());
 draw();if(qs.get('add'))form()})}

const askDate=(title,cb)=>modal(title,'<label>New date<input type="date" name="d" required></label>',f=>{const d=f.d.value;if(!d){toast('Pick a date','err');return false}cb(d)},'Confirm');

function dashboard(el){
 const A=DB.all('animals'),V=DB.all('vaccinations'),B=DB.all('breeding'),P=DB.all('appointments');
 const c=s=>A.filter(a=>a.status==s).length,due=V.filter(v=>v.status!='Completed'),ap=P.filter(p=>p.status=='Upcoming');
 const cards=[['🐄','Total Animals',A.length,'animals'],['❤️','Healthy Animals',c('Healthy'),'animals?status=Healthy'],['🩺','Under Treatment',c('Under Treatment'),'animals?status=Under%20Treatment'],['💉','Vaccinations Due',due.length,'vaccinations?status=Upcoming'],['🤰','Pregnant Animals',B.filter(b=>b.status=='Pregnant').length,'breeding?status=Pregnant'],['📅','Upcoming Appointments',ap.length,'appointments?status=Upcoming']];
 const seg=[['Healthy','#2e7d32'],['Sick','#c62828'],['Under Treatment','#1565c0'],['Monitoring','#f9a825']];let acc=0;
 const grad=seg.map(s=>{const p=c(s[0])/(A.length||1)*100,r=`${s[1]} ${acc}% ${acc+p}%`;acc+=p;return r}).join(',');
 const alerts=[...A.filter(a=>a.status=='Sick'||a.status=='Monitoring').map(a=>`⚠️ ${esc(a.name)} is ${a.status.toLowerCase()} – ${esc(a.conditions)}`),...V.filter(v=>v.status=='Overdue').map(v=>`💉 ${esc(v.animal)}: ${esc(v.vaccine)} overdue`)];
 el.innerHTML=`<div class="grid">${cards.map(k=>`<a class="card stat" href="${k[3].replace('?','.html?').replace(/^([a-z]+)$/,'$1.html')}"><div class="e">${k[0]}</div><div class="n">${k[2]}</div>${k[1]}</a>`).join('')}</div>
 <div class="bar" style="margin-top:16px"><a class="btn" href="animals.html?add=1">＋ Add Animal</a><a class="btn" href="medicines.html?add=1">＋ Record Treatment</a><a class="btn" href="vaccinations.html?add=1">＋ Add Vaccination</a><a class="btn brown" href="appointments.html?add=1">＋ Book Vet</a></div>
 <div class="grid2"><div class="card"><h3>Herd Health Overview</h3><div class="donut" style="background:conic-gradient(${grad})"></div><div class="lg">${seg.map(s=>`<span><i style="background:${s[1]}"></i>${s[0]} (${c(s[0])})</span>`).join('')}</div></div>
 <div class="card"><h3>Health Alerts</h3>${alerts.map(a=>`<div class="li">${a}</div>`).join('')||'All good! 🎉'}</div>
 <div class="card"><h3>Upcoming Vaccinations</h3>${due.map(v=>`<div class="li"><span>💉 ${esc(v.animal)} – ${esc(v.vaccine)}<br><small>${esc(v.next)}</small></span>${badge(v.status)}</div>`).join('')||'None'}<p><a href="vaccinations.html">View all →</a></p></div>
 <div class="card"><h3>Upcoming Appointments</h3>${ap.map(p=>`<div class="li"><span>📅 ${esc(p.animal)} – ${esc(p.reason)}<br><small>${esc(p.date)} ${esc(p.time)} · ${esc(p.vet)}</small></span></div>`).join('')||'None'}<p><a href="appointments.html">View all →</a></p></div></div>`;
 const soon=due.filter(v=>(new Date(v.next)-Date.now())/864e5<=7).length;if(soon)setTimeout(()=>toast(`💉 ${soon} vaccination(s) due within 7 days or overdue`),600)}

function notifications(el){const draw=()=>{const N=DB.all('notifications');el.innerHTML=`<div class="bar"><button class="btn" id="ma">✔ Mark all as read</button></div><div class="card">${N.map(n=>`<div class="li ${n.read?'':'unread'}"><span>${n.icon} ${esc(n.text)}</span><span>${n.read?'':`<button class="sm" data-r="${n._id}">Mark read</button>`}<button class="sm danger" data-d="${n._id}">🗑️</button></span></div>`).join('')||'<div class="empty">🔔<p>No notifications</p></div>'}</div>`;
 $('#ma').onclick=()=>{DB.set('notifications',N.map(n=>({...n,read:true})));toast('All marked as read');draw()};
 el.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.r){N.find(n=>n._id==b.dataset.r).read=true;DB.set('notifications',N)}if(b.dataset.d)DB.set('notifications',N.filter(n=>n._id!=b.dataset.d));if(b.dataset.r||b.dataset.d)draw()}};draw()}

function reports(el){
 const A=DB.all('animals'),V=DB.all('vaccinations'),T=DB.all('treatments'),B=DB.all('breeding'),cnt=(a,k,v)=>a.filter(x=>x[k]==v).length;
 const pct=Math.round(cnt(V,'status','Completed')/(V.length||1)*100);
 const stat=[['Total animals',A.length],['Healthy',cnt(A,'status','Healthy')],['Sick',cnt(A,'status','Sick')],['Pregnancies',cnt(B,'status','Pregnant')]];
 el.innerHTML=`<div class="bar no-print"><button class="btn" id="gen">Generate Report</button><button class="btn ghost" id="prt">🖨 Print Report</button><button class="btn ghost" id="csv">⬇ Export CSV</button></div><p id="gt" style="color:var(--mu)"></p>
 <div class="grid">${stat.map(s=>`<div class="card stat"><div class="n">${s[1]}</div>${s[0]}</div>`).join('')}</div><br>
 <div class="grid2"><div class="card"><h3>Health status</h3>${bars(['Healthy','Sick','Monitoring','Under Treatment'].map(s=>[s,cnt(A,'status',s)]))}</div>
 <div class="card"><h3>Vaccination completion</h3><div class="hb"><div><b style="width:${pct}%"></b></div><span>${pct}%</span></div>${bars(['Completed','Upcoming','Overdue'].map(s=>[s,cnt(V,'status',s)]))}</div>
 <div class="card"><h3>Treatment records</h3>${bars([['Active',cnt(T,'status','Active')],['Completed',cnt(T,'status','Completed')]])}</div>
 <div class="card"><h3>Animal weight (kg)</h3>${bars(A.map(a=>[a.name,+a.weight,' kg']))}</div></div>`;
 const gen=()=>$('#gt').textContent='Report generated: '+new Date().toLocaleString();gen();
 $('#gen').onclick=()=>{gen();toast('Report generated ✅')};$('#prt').onclick=()=>print();
 $('#csv').onclick=()=>{const k=['id','name','type','breed','gender','dob','weight','status'],r=[k.join(','),...A.map(a=>k.map(x=>`"${a[x]}"`).join(','))].join('\n');const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([r],{type:'text/csv'}));l.download='farmvet-animals.csv';l.click();toast('CSV exported')}}

function settings(el){const u=DB.get('user'),s=DB.get('prefs')||{n:true,v:true,a:true,lang:'English'};
 el.innerHTML=`<div class="grid2"><form class="card" id="pf"><h3>Farmer profile</h3>${[['name','Farmer name'],['farm','Farm name'],['phone','Phone'],['email','Email'],['location','Location']].map(f=>`<label>${f[1]}<input name="${f[0]}" value="${esc(u[f[0]])}" required></label>`).join('')}<label>Profile photo<input type="file" name="photo" accept="image/*"></label><button class="btn">Save profile</button></form>
 <div class="card"><h3>Preferences</h3><form id="pr"><div class="chk"><label><input type="checkbox" name="n" ${s.n?'checked':''}>Notifications</label><label><input type="checkbox" name="v" ${s.v?'checked':''}>Vaccination reminders</label><label><input type="checkbox" name="a" ${s.a?'checked':''}>Appointment reminders</label><label><input type="checkbox" id="dk" ${DB.get('dark')?'checked':''}>Dark mode</label></div><label>Language<select name="lang">${['English','தமிழ் (Tamil)','हिन्दी (Hindi)','తెలుగు (Telugu)'].map(l=>`<option ${l==s.lang?'selected':''}>${l}</option>`).join('')}</select></label><button class="btn">Save preferences</button></form><h3 style="margin-top:20px">Change password</h3>
 <form id="pw"><label>New password<input type="password" name="p1" minlength="6" required></label><label>Confirm password<input type="password" name="p2" required></label><button class="btn brown">Update password</button></form></div></div>`;
 $('#pf').onsubmit=async e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.target)),fl=v.photo;v.photo=fl&&fl.size?await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(fl)}):u.photo;DB.set('user',{...u,...v});toast('Profile saved ✅');setTimeout(()=>location.reload(),600)};
 $('#pr').onsubmit=e=>{e.preventDefault();const f=e.target;DB.set('prefs',{n:f.n.checked,v:f.v.checked,a:f.a.checked,lang:f.lang.value});DB.set('dark',$('#dk').checked);document.body.classList.toggle('dark',$('#dk').checked);toast('Preferences saved ✅')};
 $('#pw').onsubmit=e=>{e.preventDefault();const f=e.target;if(f.p1.value!=f.p2.value)return toast('Passwords do not match','err');const a=DB.get('account');if(a){a.password=f.p1.value;DB.set('account',a)}f.reset();toast('Password updated ✅')}}

// Auth pages
const login=(u)=>{DB.set('user',u);location.href='dashboard.html'};
const DEMO={name:'Ramesh Kumar',farm:'Green Valley Farm',phone:'9876543210',email:'demo@farmvet.in',location:'Chengalpattu, Tamil Nadu'};
const page=document.body.dataset.page;
if($('#demo'))$('#demo').onclick=()=>login(DEMO);
if(page=='login'){if(DB.get('dark'))document.body.classList.add('dark');
 $('#lf').onsubmit=e=>{e.preventDefault();const f=e.target,id=f.id.value.trim(),a=DB.get('account');
  if(!id||f.pw.value.length<6)return toast('Enter email/phone and a password of 6+ characters','err');
  if(a&&(a.email==id||a.phone==id)&&a.password==f.pw.value)return login(a);
  if(id=='demo@farmvet.in'&&f.pw.value=='demo123')return login(DEMO);
  toast('Account not found or wrong password. Try Demo Login.','err')};
 $('#fp').onclick=e=>{e.preventDefault();modal('Reset password','<label>Email or phone<input name="e" required></label>',()=>toast('Reset instructions sent (demo) ✅'),'Send')}}
if(page=='register')$('#rf').onsubmit=e=>{e.preventDefault();const f=e.target,v=Object.fromEntries(new FormData(f));
 if(!/^\d{10}$/.test(v.phone))return toast('Enter a 10-digit phone number','err');
 if(!/^\S+@\S+\.\S+$/.test(v.email))return toast('Enter a valid email','err');
 if(v.password.length<6)return toast('Password must be 6+ characters','err');
 if(v.password!=v.confirm)return toast('Passwords do not match','err');
 delete v.confirm;DB.set('account',v);toast('Registered! Logging in…');setTimeout(()=>login(v),700)};
if(page=='dashboard')App.init('Dashboard',dashboard);
if(page=='notifications')App.init('Notifications',notifications);
if(page=='reports')App.init('Reports',reports);
if(page=='settings')App.init('Settings',settings);
