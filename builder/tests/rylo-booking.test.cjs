const assert=require('node:assert/strict'),crypto=require('node:crypto'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
process.env.BLOB_READ_WRITE_TOKEN='test';process.env.BUILDER_API_KEY='test-encryption-key';process.env.BUILDER_AI_PASSCODE='test-pass';
const handler=require('../../api/rylo-booking'),schedule=require('../rylo-schedule');const stored=new Map();const nativeFetch=global.fetch;
global.fetch=async(url,init={})=>{const u=new URL(url);if(u.hostname==='blob.vercel-storage.com'){
if(init.method==='PUT'){const p=u.pathname.slice(1);if(stored.has(p)&&init.headers['x-allow-overwrite']!=='1')return Response.json({error:'exists'},{status:409});stored.set(p,JSON.parse(init.body));return Response.json({url:'https://test-store.test/'+p});}
if(init.method==='POST'){JSON.parse(init.body).urls.forEach(s=>stored.delete(new URL(s).pathname.slice(1)));return Response.json({});}
return Response.json({blobs:[...stored.keys()].filter(p=>p.startsWith(u.searchParams.get('prefix'))).map(p=>({pathname:p,url:'https://test-store.test/'+p}))});}
if(u.hostname==='test-store.test')return Response.json(stored.get(u.pathname.slice(1)));return nativeFetch(url,init);};
async function request(method,body,auth=false,url='/api/rylo-booking'){let result;const res={statusCode:200,setHeader(){},end(raw){result={code:this.statusCode,data:JSON.parse(raw)}}};await handler({method,body,url,headers:{host:'localhost',...(auth?{'x-rylo-passcode':'test-pass'}:{})}},res);return result;}
const date=schedule.days().find((d,i)=>i>0&&!d.closed).date;const time=schedule.slots(date,'Haircut','kai').find(s=>s.available).time;
const body={requestId:crypto.randomUUID(),demo:true,service:'Haircut',barberId:'kai',date,time,name:'Demo Customer',phone:'+1 202 555 0100',notes:'Test',offset:-120,website:''};
(async()=>{
assert.equal((await request('GET')).code,401);assert.equal((await request('GET',null,false,'/api/rylo-booking?action=availability')).data.barbers.length,3);
const pair=await Promise.all([request('POST',body),request('POST',{...body,requestId:crypto.randomUUID(),service:'Haircut and beard'})]);assert.deepEqual(pair.map(x=>x.code).sort(),[201,409]);assert.equal((await request('POST',body)).code,200);
const publicData=await request('GET',null,false,'/api/rylo-booking?action=availability&date='+date+'&service=Haircut');assert.ok(!JSON.stringify(publicData).includes('Demo Customer'));assert.equal(publicData.data.availability.find(b=>b.id==='kai').slots.find(s=>s.time===time).available,false);
assert.equal((await request('POST',{...body,requestId:crypto.randomUUID(),time:'13:00'})).code,409);assert.equal((await request('POST',{...body,requestId:crypto.randomUUID(),barberId:'unknown'})).code,422);
assert.equal((await request('PATCH',{id:body.requestId,status:'cancelled'},true)).code,200);const replacement={...body,requestId:crypto.randomUUID()};assert.equal((await request('POST',replacement)).code,201);assert.equal((await request('PATCH',{id:body.requestId,status:'confirmed'},true)).code,409);assert.equal((await request('GET',null,true)).data.bookings.length,2);assert.equal((await request('DELETE',{id:replacement.requestId},true)).code,200);assert.equal((await request('DELETE',{id:body.requestId},true)).code,200);console.log('PASS API: race protection, retry, private data, unavailable times, cancel/rebook, restore conflict, delete');
})().catch(e=>{console.error(e);process.exitCode=1});
