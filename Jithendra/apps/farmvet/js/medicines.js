crud({store:'treatments',title:'Medicines & Treatments',add:'Add Treatment',
 cols:[['animal','Animal'],['medicine','Medicine'],['dosage','Dosage'],['frequency','Frequency'],['start','Start'],['end','End'],['vet','Veterinarian'],['status','Status'],['notes','Notes']],
 fields:[['animal','Animal','select',names],['medicine','Medicine name','text',0,1],['dosage','Dosage (as per vet)','text',0,1],['frequency','Frequency','text'],['start','Start date','date',0,1],['end','End date','date',0,1],['vet','Veterinarian','text',0,1],['status','Status','select',['Active','Completed']],['notes','Notes','textarea']],
 filters:[['status','Statuses',['Active','Completed']]],
 check:v=>v.end<v.start?'End date cannot be before start date':'',
 extra:[{l:'✔ Complete',show:r=>r.status=='Active',fn:(r,u)=>{u(r._id,{status:'Completed'});toast('Treatment completed ✅')}}]});
