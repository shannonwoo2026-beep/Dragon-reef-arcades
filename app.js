const games=[
{id:"dragon",name:"Dragon Reef",type:"fish",icon:"🐉",desc:"Reef hunter"},
{id:"mermaid",name:"Mermaid Bay",type:"fish",icon:"🧜‍♀️",desc:"Fantasy ocean hunt"},
{id:"ocean",name:"Ocean Hunter",type:"fish",icon:"🦈",desc:"Deep-sea hunter"},
{id:"buffaloDeep",name:"Buffalo Deep",type:"fish",icon:"🐃",desc:"Wild reef hunt"},
{id:"fire",name:"Fire Vault",type:"slots",icon:"🔥",desc:"3-reel fire game"},
{id:"buffalo",name:"Golden Buffalo",type:"slots",icon:"🦬",desc:"Buffalo reels"},
{id:"fortune",name:"Dragon Fortune",type:"slots",icon:"🐲",desc:"Dragon reels"},
{id:"seven",name:"Neon 7s",type:"slots",icon:"7️⃣",desc:"Classic neon reels"}];
let credits=Number(localStorage.drCredits||5000);
let history=JSON.parse(localStorage.drHistory||"[]");
const $=s=>document.querySelector(s), grid=$("#grid");
function save(){localStorage.drCredits=credits;localStorage.drHistory=JSON.stringify(history);$("#credits").textContent=credits.toLocaleString();$("#gameCredits").textContent=credits.toLocaleString()}
function tx(n,label){credits+=n;history.unshift({n,label,t:new Date().toLocaleString()});history=history.slice(0,50);save()}
function render(filter="all"){grid.innerHTML="";games.filter(g=>filter==="all"||g.type===filter).forEach(g=>{let d=document.createElement("div");d.className="card";d.dataset.type=g.type;d.innerHTML=`<span class="badge">${g.type==="fish"?"FISH":"SLOTS"}</span><div class="art">${g.icon}</div><div class="info"><b>${g.name}</b><small>${g.desc}</small></div>`;d.onclick=()=>openGame(g);grid.appendChild(d)})}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.filter)});
$("#back").onclick=()=>$("#modal").classList.add("hidden");
$("#historyBtn").onclick=()=>{drawHistory();$("#history").classList.remove("hidden")};$("#closeHistory").onclick=()=>$("#history").classList.add("hidden");
$("#reset").onclick=()=>{credits=5000;history=[];save();drawHistory()};
function drawHistory(){let e=$("#historyRows");e.innerHTML=history.length?history.map(x=>`<div class="row"><span>${x.label}<small><br>${x.t}</small></span><b class="${x.n>=0?"plus":"minus"}">${x.n>=0?"+":""}${x.n}</b></div>`).join(""):"No plays yet."}
function openGame(g){$("#gameTitle").textContent=g.name;$("#modal").classList.remove("hidden");$("#gameArea").innerHTML="";g.type==="fish"?fishGame(g):slotGame(g);save()}
function fishGame(g){
 const area=$("#gameArea");area.innerHTML=`<div class="fishWrap"><canvas class="fishCanvas" width="1000" height="540"></canvas><div class="controls"><button id="down">−</button><span class="bet">Shot: <b id="shot">10</b></span><button id="up">+</button><span>Tap/click a target to fire</span></div><div class="message" id="msg"></div></div>`;
 let bet=10,canvas=area.querySelector("canvas"),ctx=canvas.getContext("2d");
 let targets=Array.from({length:12},(_,i)=>({x:80+Math.random()*820,y:70+Math.random()*380,vx:(Math.random()*.9+.35)*(Math.random()<.5?-1:1),r:24+Math.random()*24,e:["🐠","🐟","🦀","🦈","🐡"][i%5]}));
 function loop(){ctx.clearRect(0,0,1000,540);ctx.fillStyle="#ffffff18";for(let i=0;i<30;i++)ctx.fillRect((i*83)%1000,(i*47)%540,3,3);targets.forEach(t=>{t.x+=t.vx;if(t.x<t.r||t.x>1000-t.r)t.vx*=-1;ctx.font=`${t.r*1.55}px serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(t.e,t.x,t.y)});requestAnimationFrame(loop)}loop();
 $("#down").onclick=()=>{bet=Math.max(5,bet-5);$("#shot").textContent=bet};$("#up").onclick=()=>{bet=Math.min(100,bet+5);$("#shot").textContent=bet};
 canvas.onclick=e=>{if(credits<bet){$("#msg").textContent="Not enough demo credits.";return}let r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*1000/r.width,y=(e.clientY-r.top)*540/r.height;tx(-bet,`${g.name} shot`);let hit=targets.find(t=>Math.hypot(t.x-x,t.y-y)<t.r*1.5);if(hit){let award=bet*[1,2,3,5][Math.floor(Math.random()*4)];tx(award,`${g.name} target award`);$("#msg").textContent=`Target hit: +${award} credits`;hit.x=60+Math.random()*880;hit.y=60+Math.random()*400}else $("#msg").textContent="Miss"}}
function slotGame(g){
 const icons=g.id==="fire"?["🔥","💎","7️⃣","⭐","🍒"]:g.id==="buffalo"?["🦬","🌄","🦅","💰","A"]:g.id==="fortune"?["🐲","🪙","🏮","💎","A"]:["7️⃣","🍒","🔔","⭐","💎"];
 const area=$("#gameArea");area.innerHTML=`<div class="slotWrap"><div class="reels"><div class="reel">?</div><div class="reel">?</div><div class="reel">?</div></div><div class="controls"><button id="minus">−</button><span class="bet">Spin: <b id="stake">25</b></span><button id="plus">+</button></div><button class="spin" id="spin">SPIN</button><div class="message" id="slotMsg"></div><p>Three matching symbols award 10× the selected entertainment-credit spin amount; two matching symbols award 2×.</p></div>`;
 let stake=25;$("#minus").onclick=()=>{stake=Math.max(5,stake-5);$("#stake").textContent=stake};$("#plus").onclick=()=>{stake=Math.min(100,stake+5);$("#stake").textContent=stake};
 $("#spin").onclick=()=>{if(credits<stake){$("#slotMsg").textContent="Not enough demo credits.";return}tx(-stake,`${g.name} spin`);let a=[0,0,0].map(()=>icons[Math.floor(Math.random()*icons.length)]);area.querySelectorAll(".reel").forEach((r,i)=>r.textContent=a[i]);let award=0;if(a[0]===a[1]&&a[1]===a[2])award=stake*10;else if(a[0]===a[1]||a[1]===a[2]||a[0]===a[2])award=stake*2;if(award)tx(award,`${g.name} award`);$("#slotMsg").textContent=award?`Award: +${award} credits`:"No match"}}
render();save();