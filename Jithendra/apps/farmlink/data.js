const NAMES=['Ravi Kumar','Murugan S','Lakshmi D','Selvam P','Kavitha R','Anbu Raj','Perumal K','Saraswathi M','Gopal N','Velu T'];
const LOC=['Chengalpattu','Kanchipuram','Tiruvallur','Villupuram','Vellore','Thiruvannamalai','Salem','Coimbatore','Madurai'];
const CATS=[['🚜','Tractors'],['🌾','Harvesters'],['🌱','Farming Tools'],['💧','Irrigation'],['🚚','Transport'],['📦','Storage'],['👨‍🔧','Operators']];
const COL=['#cfe3b8','#f1e0a6','#d6c7ad','#bcdcd9'];
const raw=[['Mahindra 575 Tractor','Tractors','🚜',900,'hour',4.8,4.2,'Excellent',1,1,2019,'Mahindra'],['John Deere 5050D','Tractors','🚜',1000,'hour',4.7,6.5,'Good',1,0,2018,'John Deere'],['Swaraj 744 FE','Tractors','🚜',800,'hour',4.5,9.1,'Good',0,1,2017,'Swaraj'],
['Kubota Combine Harvester','Harvesters','🌾',2500,'acre',4.9,6,'Excellent',1,1,2021,'Kubota'],['Preet 987 Harvester','Harvesters','🌾',2200,'acre',4.4,14,'Fair',1,0,2015,'Preet'],
['Rotavator 6ft','Farming Tools','🌱',500,'hour',4.6,3.3,'Good',0,1,2020,'Shaktiman'],['Seed Drill 9-row','Farming Tools','🌱',400,'hour',4.3,7.8,'Good',0,0,2019,'Fieldking'],['Power Sprayer 400L','Farming Tools','🌱',350,'hour',4.7,2.4,'Excellent',0,1,2022,'Neptune'],['Power Tiller','Farming Tools','🌱',450,'hour',4.2,11,'Fair',0,0,2016,'Kirloskar'],
['5HP Water Pump','Irrigation','💧',150,'hour',4.8,3.1,'Excellent',0,1,2021,'Crompton'],['Solar Water Pump','Irrigation','💧',300,'day',4.6,8.4,'Excellent',0,0,2023,'Shakti'],['Sprinkler Set (2 acre)','Irrigation','💧',600,'day',4.5,5.2,'Good',0,1,2020,'Jain'],
['Tractor Trailer','Transport','🚚',600,'day',4.4,4.9,'Good',1,1,2018,'Tafe'],['Mini Truck (Ace)','Transport','🚚',1800,'day',4.7,10.3,'Good',1,1,2019,'Tata'],
['Grain Storage (50 qtl)','Storage','📦',40,'day',4.6,5.5,'Excellent',0,0,2020,'Co-op'],['Cold Storage Unit','Storage','📦',120,'day',4.8,12,'Excellent',0,1,2022,'KoolFarm'],
['Muthu – Tractor Operator','Operators','👨‍🔧',1000,'day',4.9,3.8,'Excellent',1,0,2012,'12 yrs exp'],['Harvest Team (5 workers)','Operators','👨‍🔧',3000,'day',4.5,6.9,'Good',1,0,2015,'Local crew']];
const RES=raw.map((r,i)=>({id:i+1,name:r[0],cat:r[1],emoji:r[2],price:r[3],unit:r[4],rating:r[5],dist:r[6],cond:r[7],op:!!r[8],del:!!r[9],year:r[10],brand:r[11],owner:NAMES[i%10],loc:LOC[i%9],bg:COL[i%4],hours:200+i*137,booked:[3+i%5,4+i%5,12+i%7,20+i%4],pending:[8+i%6],pop:(i*7)%11}));
const REVIEWS=[['Murugan S',5,'Tractor was spotless and the owner was on time.'],['Lakshmi D',5,'Fair price and smooth return. Will rent again.'],['Selvam P',4,'Good machine, slight delay at pickup.']];
let S={fav:new Set([1,4]),bookings:[
{id:1,rid:1,status:'Upcoming',date:'12 Oct 2026',time:'8 AM – 4 PM',amt:7200},{id:2,rid:4,status:'Active',date:'04 Oct 2026',time:'All day',amt:12500},
{id:3,rid:10,status:'Completed',date:'21 Sep 2026',time:'9 AM – 1 PM',amt:600},{id:4,rid:6,status:'Cancelled',date:'15 Sep 2026',time:'10 AM – 2 PM',amt:2000}],
notes:['New booking request from Ravi Kumar.','Booking accepted: Kubota Harvester','⚠️ Rain expected tomorrow – tractor booking 10 AM','Return reminder: Rotavator due 5 PM','Payment confirmed ₹7,200','Nearby: Sprayer 2.4 km away'],
chats:NAMES.slice(0,5).map((n,i)=>({n,m:[['them','Is the tractor available tomorrow?'],['me','Yes, from 8 AM.'],['them','Can you provide an operator?'],['me','Yes.']].slice(0,2+i%3)})),
comm:LOC.map((l,i)=>({n:l+' Farmers',members:245-i*17,joined:i==0,t:12-i,h:4-i%3,p:15-i}))};
