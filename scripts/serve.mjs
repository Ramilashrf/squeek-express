import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
const root=resolve('dist'),port=Number(process.env.PORT||4173);
if(!Number.isInteger(port)||port<1||port>65535)throw Error('PORT must be an integer from 1 to 65535');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost'),path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);res.end('Forbidden');return}if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return}const body=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:body)}catch{res.writeHead(404);res.end('Not found')}}).listen(port,()=>console.log(`Squeek Express: http://localhost:${port}`));
