const VS=['Upcoming','Completed','Overdue'];
crud({store:'vaccinations',title:'Vaccinations',add:'Add Vaccination',
 cols:[['animal','Animal'],['vaccine','Vaccine'],['date','Date'],['next','Next due'],['vet','Veterinarian'],['status','Status']],
 fields:[['animal','Animal','select',names],['vaccine','Vaccine name','text',0,1],['date','Date','date',0,1],['next','Next due date','date',0,1],['vet','Veterinarian','text',0,1],['status','Status','select',VS]],
 filters:[['status','Statuses',VS]],
 extra:[{l:'✔ Mark Completed',show:r=>r.status!='Completed',fn:(r,u)=>{u(r._id,{status:'Completed',date:new Date().toISOString().slice(0,10)});toast('Marked as completed ✅')}},
        {l:'📆 Reschedule',fn:(r,u)=>askDate('Reschedule vaccination',d=>{u(r._id,{next:d,status:'Upcoming'});toast('Rescheduled ✅')})}],
 top:()=>{const n=DB.all('vaccinations').filter(v=>v.status!='Completed').length;return `<div class="warn" style="margin:0 0 14px">💉 Reminder: ${n} vaccination(s) pending or overdue.</div>`}});
