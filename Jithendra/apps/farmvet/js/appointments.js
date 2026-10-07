const AS=['Upcoming','Completed','Cancelled'];
crud({store:'appointments',title:'Appointments',add:'Book Appointment',
 cols:[['vet','Veterinarian'],['animal','Animal'],['date','Date'],['time','Time'],['reason','Reason'],['status','Status']],
 fields:[['animal','Select animal','select',names],['vet','Select veterinarian','select',['Dr. Priya','Dr. Senthil','Dr. Anand','Dr. Lakshmi']],['date','Date','date',0,1],['time','Time','time',0,1],['reason','Reason','text',0,1],['status','Status','select',AS],['notes','Additional notes','textarea']],
 filters:[['status','Statuses',AS]],
 check:(v,r)=>!r&&v.status=='Upcoming'&&v.date<new Date().toISOString().slice(0,10)?'Choose today or a future date':'',
 extra:[{l:'✔ Complete',show:r=>r.status=='Upcoming',fn:(r,u)=>{u(r._id,{status:'Completed'});toast('Appointment completed')}},
  {l:'📆 Reschedule',show:r=>r.status!='Completed',fn:(r,u)=>askDate('Reschedule appointment',d=>{u(r._id,{date:d,status:'Upcoming'});toast('Rescheduled ✅')})},
  {l:'✖ Cancel',show:r=>r.status=='Upcoming',fn:(r,u)=>confirmBox('Cancel this appointment?',()=>{u(r._id,{status:'Cancelled'});toast('Appointment cancelled')})}]});
