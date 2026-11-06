import assert from 'node:assert/strict';
import {createCommunity} from './server/community.mjs';
import {startServer} from './server/http.mjs';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
let clock=Date.parse('2026-11-06T12:00:00Z'),work=100n,online=true;
const now=()=>clock,fetchStatus=async()=>{if(!online)throw Error('offline');return {installationId:'pi',measurement:{freshness:'online',observedAt:new Date(clock).toISOString(),staleAfterSeconds:120,counterEpoch:'a',cumulativeWorkUnits:String(work),rpmMilli:42000}}};
const dir=await mkdtemp(join(tmpdir(),'sqx-')),filename=join(dir,'db.sqlite');let service=createCommunity({filename,now,fetchStatus});
const call=(path,token,body,method=body?'POST':'GET')=>service.handle({path:'/api/community'+path,token,body,method,ip:'test'});
try{
 assert.equal((await call('/dispatch',null,{route:'clover',score:99999})).status,401);
 assert.equal((await call('/join',null,{name:'<script>'})).status,400);
 const a=await call('/join',null,{name:'Ramil'}),b=await call('/join',null,{name:'Luna'});assert.equal(a.body.player.energy,50);assert.notEqual(a.token,b.token);assert.equal(a.body.leaderboard.length,0);
 const token=a.token;assert.equal((await call('/dispatch',token,{route:'fake'})).status,400);
 let sent=await call('/dispatch',token,{route:'clover',score:99999,energy:99999,due:clock-1000});assert.equal(sent.body.player.energy,30);assert.equal(sent.body.player.score,0);assert.equal(sent.body.player.trip.due,clock+35000);
 assert.equal((await call('/dispatch',token,{route:'pine'})).status,409);clock+=34000;assert.equal((await call('/state',token)).body.player.score,0);
 clock+=1000;let board=await call('/state',b.token);assert.equal(board.body.delivered,1);assert.equal(board.body.leaderboard[0].name,'Ramil');assert.equal(board.body.leaderboard[0].score,100);
 for(let i=0;i<3;i++)assert.equal((await call('/state',token)).body.player.score,100);
 clock+=5000;work+=20n;assert.equal((await call('/state',token)).body.player.energy,40);assert.equal((await call('/state',token)).body.player.energy,40);
 service.close();service=createCommunity({filename,now,fetchStatus});assert.equal((await call('/state',token)).body.player.score,100);
 clock+=5000;online=false;assert.equal((await call('/dispatch',token,{route:'clover'})).status,503);assert.equal((await call('/state',token)).body.player.energy,40);
 clock+=5000;online=true;work+=1000n;assert.equal((await call('/state',token)).body.player.energy,40);clock+=5000;work+=2n;assert.equal((await call('/state',token)).body.player.energy,41);
 clock=Date.parse('2026-11-07T00:00:00Z');let fresh=await call('/state',token);assert.equal(fresh.body.player.energy,50);assert.equal(fresh.body.player.score,0);assert.equal(fresh.body.delivered,0);assert.equal(fresh.body.leaderboard.length,0);
 for(let i=0;i<10;i++)assert.equal((await call('/join',null,{name:'Tester'})).status,200);assert.equal((await call('/join',null,{name:'Tester'})).status,429);
 const app=await startServer({port:0,filename:':memory:',now,fetchStatus});try{const base='http://127.0.0.1:'+app.server.address().port;let r=await fetch(base+'/api/community/join',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://other.example'},body:'{"name":"Tester"}'});assert.equal(r.status,403);r=await fetch(base+'/api/community/join',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:'{"name":"Tester"}'});assert.equal(r.status,200);assert.match(r.headers.get('set-cookie'),/HttpOnly; SameSite=Strict/);let cookie=r.headers.get('set-cookie').split(';')[0];let again=await fetch(base+'/api/community/state',{headers:{Cookie:cookie}});assert.equal((await again.json()).player.name,'Tester');r=await fetch(base+'/api/community/join',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:'[]'});assert.equal(r.status,400)}finally{await app.close()}
 console.log('PASS · two independent players share rankings, server-owned timing/energy/score, no duplicate rewards, feed failure and recovery, SQLite restart persistence, UTC reset, signup limits, same-origin writes and HttpOnly sessions.');
}finally{service.close();await rm(dir,{recursive:true,force:true})}
