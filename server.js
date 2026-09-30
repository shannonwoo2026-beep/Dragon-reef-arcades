const http = require("http");
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || 3000;
const pub = path.join(__dirname, "public");
const types={".html":"text/html",".css":"text/css",".js":"text/javascript",".json":"application/json",".svg":"image/svg+xml"};
http.createServer((req,res)=>{
  let u = decodeURIComponent(req.url.split("?")[0]);
  if(u==="/") u="/index.html";
  const f=path.normalize(path.join(pub,u));
  if(!f.startsWith(pub)){res.writeHead(403);return res.end("Forbidden");}
  fs.readFile(f,(e,d)=>{
    if(e){res.writeHead(404);return res.end("Not found");}
    res.writeHead(200,{"Content-Type":types[path.extname(f)]||"application/octet-stream"});
    res.end(d);
  });
}).listen(port,()=>console.log(`Dragon Reef Arcade: http://localhost:${port}`));