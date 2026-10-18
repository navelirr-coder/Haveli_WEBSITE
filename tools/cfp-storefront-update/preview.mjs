// Read-only storefront QA. No backend startup, migrations or external services.
import http from 'node:http';
import path from 'node:path';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const stage=path.dirname(fileURLToPath(import.meta.url));
const {target}=JSON.parse(await readFile(path.join(stage,'patch-manifest.json'),'utf8'));
const servedRoot=process.argv.includes('--applied') ? target : stage;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.pdf':'application/pdf','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{
  try {
    const relative=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname).replace(/^\//,'') || 'index.html';
    if(relative.split(/[\\/]/).some(p=>p==='..'||p.startsWith('.')) || !types[path.extname(relative).toLowerCase()]) {res.writeHead(404).end();return;}
    let file=path.resolve(servedRoot,relative);
    if(!file.startsWith(servedRoot+path.sep)) {res.writeHead(404).end();return;}
    try{await stat(file);}catch{file=path.resolve(target,relative);}
    if(!file.startsWith(stage+path.sep)&&!file.startsWith(target+path.sep)) {res.writeHead(404).end();return;}
    const body=await readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file).toLowerCase()],'Cache-Control':'no-store'}).end(body);
  }catch{res.writeHead(404).end();}
}).listen(3012,'127.0.0.1',()=>console.log('CFP staged storefront preview: http://127.0.0.1:3012/index.html'));
