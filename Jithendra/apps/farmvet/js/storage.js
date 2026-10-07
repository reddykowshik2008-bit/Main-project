// FarmVet storage layer: LocalStorage + demo seed data
const T=(keys,rows)=>rows.map(r=>Object.assign({_id:Math.random().toString(36).slice(2,9)},Object.fromEntries(keys.map((k,i)=>[k,r[i]]))));
const SEED={
animals:T(['id','name','type','breed','gender','dob','weight','status','color','location','tag','conditions','notes'],[
['A001','Lakshmi','Cow','Gir','Female','2019-03-12',420,'Healthy','Brown','Shed A','TN-1001','None',''],
['A002','Ganga','Cow','Jersey','Female','2020-06-20',380,'Under Treatment','Light brown','Shed A','TN-1002','Mastitis (mild)','On antibiotics per vet'],
['A003','Nandi','Cow','Sahiwal','Male','2018-01-05',560,'Healthy','Red','Shed B','TN-1003','None','Breeding bull'],
['A004','Meena','Goat','Tellicherry','Female','2022-02-14',38,'Healthy','White','Goat pen','TN-1004','None',''],
['A005','Rani','Buffalo','Murrah','Female','2019-09-09',510,'Monitoring','Black','Shed C','TN-1005','Reduced appetite','Watch feed intake'],
['A006','Kaveri','Cow','HF Cross','Female','2021-04-01',400,'Healthy','Black & white','Shed A','TN-1006','None','Pregnant'],
['A007','Balu','Sheep','Mecheri','Male','2023-01-10',34,'Sick','Grey','Sheep pen','TN-1007','Lameness','Vet visit booked'],
['A008','Radha','Cow','Gir','Female','2020-11-23',395,'Healthy','Spotted','Shed B','TN-1008','None',''],
['A009','Mani','Goat','Salem Black','Male','2022-08-30',42,'Monitoring','Black','Goat pen','TN-1009','Cough','Isolated for observation'],
['A010','Devi','Buffalo','Murrah','Female','2018-07-17',530,'Healthy','Black','Shed C','TN-1010','None','Expected to calve soon']]),
vaccinations:T(['animal','vaccine','date','next','vet','status'],[
['Lakshmi','FMD','2026-04-10','2026-10-10','Dr. Senthil','Upcoming'],['Ganga','Brucellosis','2026-05-02','2027-05-02','Dr. Priya','Completed'],
['Nandi','HS (Haemorrhagic Septicaemia)','2026-03-15','2026-09-15','Dr. Senthil','Overdue'],['Meena','PPR','2026-06-01','2027-06-01','Dr. Priya','Completed'],
['Rani','FMD','2026-04-12','2026-10-12','Dr. Senthil','Upcoming'],['Kaveri','BQ (Black Quarter)','2026-02-20','2026-08-20','Dr. Priya','Overdue'],
['Balu','Sheep Pox','2026-07-05','2027-07-05','Dr. Priya','Completed'],['Radha','Anthrax','2026-10-20','2027-10-20','Dr. Senthil','Upcoming']]),
treatments:T(['animal','medicine','dosage','frequency','start','end','vet','status','notes'],[
['Ganga','Antibiotic course (as prescribed)','Per vet label','Twice daily','2026-09-28','2026-10-08','Dr. Priya','Active','Mastitis'],
['Balu','Anti-inflammatory (as prescribed)','Per vet label','Once daily','2026-10-01','2026-10-07','Dr. Priya','Active','Lameness'],
['Rani','Appetite tonic','Per vet label','Once daily','2026-10-02','2026-10-12','Dr. Senthil','Active','Monitor feed'],
['Lakshmi','Dewormer','Per vet label','Single dose','2026-08-10','2026-08-10','Dr. Senthil','Completed',''],
['Mani','Cough syrup (vet advised)','Per vet label','Twice daily','2026-09-10','2026-09-17','Dr. Priya','Completed',''],
['Meena','Vitamin supplement','Per vet label','Daily','2026-09-01','2026-09-30','Dr. Priya','Completed','']]),
appointments:T(['vet','animal','date','time','reason','status','notes'],[
['Dr. Priya','Balu','2026-10-06','10:30','Lameness check','Upcoming',''],['Dr. Senthil','Devi','2026-10-12','09:00','Pre-calving checkup','Upcoming',''],
['Dr. Priya','Ganga','2026-10-08','15:00','Treatment follow-up','Upcoming',''],['Dr. Senthil','Nandi','2026-09-20','11:00','Annual checkup','Completed',''],
['Dr. Priya','Mani','2026-09-25','14:00','Cough','Cancelled','']]),
breeding:T(['animal','breed','date','male','status','expected','notes'],[
['Kaveri','HF Cross','2026-02-10','Nandi','Pregnant','2026-11-20','Scan confirmed'],['Devi','Murrah','2026-01-05','Murrah bull (AI)','Expected Soon','2026-10-12','Prepare calving pen'],
['Radha','Gir','2026-09-15','Nandi','Monitoring','2027-06-25','Awaiting scan'],['Lakshmi','Gir','2026-03-01','Nandi','Not Pregnant','','Repeat in next cycle'],
['Meena','Tellicherry','2026-08-01','Mani','Pregnant','2026-12-28','']]),
feed:T(['animal','type','qty','time','water','supplements','notes'],[
['Lakshmi','Hay','8','06:00','55','Mineral mix',''],['Ganga','Concentrate','4','07:00','45','Calcium',''],['Nandi','Grass','15','06:30','60','',''],
['Meena','Grain','0.5','08:00','4','',''],['Rani','Silage','10','06:00','12','Appetite tonic','Low water intake'],['Kaveri','Concentrate','5','07:00','50','Mineral mix',''],
['Balu','Hay','1','08:00','3','',''],['Devi','Grass','14','06:30','58','Calcium','']]),
health:T(['animal','symptoms','disease','date','severity','temp','status','notes'],[
['Ganga','Swelling, Fever','Mastitis (vet diagnosed)','2026-09-27','Moderate','39.8','Under Treatment',''],['Balu','Lameness','Hoof problem','2026-10-01','Mild','38.9','Monitoring',''],
['Mani','Cough','Respiratory','2026-09-09','Mild','39.1','Completed','']]),
notifications:T(['icon','text','read'],[
['💉','Lakshmi FMD vaccination due 10 Oct',false],['💉','Nandi HS vaccination is overdue',false],['💉','Kaveri BQ vaccination is overdue',false],
['📅','Vet visit for Balu on 6 Oct, 10:30',false],['💊','Ganga treatment ends 8 Oct',false],['🤰','Devi expected delivery around 12 Oct',false],
['⚠️','Rani has reduced appetite – monitor',false],['🌾','Rani water intake is low today',true],['📅','Ganga follow-up on 8 Oct, 3 PM',true],['🌾','Restock mineral mix',true]])};
const DB={get(k){try{return JSON.parse(localStorage.getItem('fv_'+k))}catch(e){return null}},
set(k,v){localStorage.setItem('fv_'+k,JSON.stringify(v))},
all(k){let d=this.get(k);if(!d){d=SEED[k]||[];this.set(k,d)}return d}};
