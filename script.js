/* Wax seal edge */
(function(){let d="";for(let i=0;i<=72;i++){const a=i/72*Math.PI*2,r=52+Math.sin(a*9)*2.6+Math.sin(a*5+1)*2;d+=(i?"L":"M")+(60+Math.cos(a)*r).toFixed(1)+" "+(60+Math.sin(a)*r).toFixed(1)}document.getElementById("wp").setAttribute("d",d+"Z")})();

/* Background Audio */
const bgAudio=document.getElementById("bgAudio");
// Try to play on load, fallback to user interaction
bgAudio.play().catch(()=>console.log("Audio autoplay blocked by browser"));

/* Open envelope */
const env=document.getElementById("env"),seal=document.getElementById("seal");
seal.onclick=()=>{
  // Ensure audio plays when user interacts
  bgAudio.play().catch(e=>console.log("Audio play error:",e));
  env.classList.add("open");
  setTimeout(()=>{document.body.classList.remove("lock");document.getElementById("pg").classList.add("show")},1100)
};

/* Scroll reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.2});
document.querySelectorAll(".rv").forEach(n=>io.observe(n));

/* Scratch discs: conic cover, floating hearts, confetti when all three are revealed */
(function(){
const discs=[...document.querySelectorAll(".disc")],dpr=Math.min(window.devicePixelRatio||1,2),W=74,HC=["#172B55","#C6A45C","#DCC58F","#0B1530"];
function heart(x,y){const n=document.createElement("span");n.className="hrt";n.textContent="♥";n.style.left=x+"px";n.style.top=y+"px";n.style.color=HC[Math.random()*3|0];n.style.setProperty("--dx",(Math.random()*34-17)+"px");document.body.appendChild(n);setTimeout(()=>n.remove(),1400)}
function confetti(){
 if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
 const cv=document.createElement("canvas");cv.id="conf";cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;document.body.appendChild(cv);
 const g=cv.getContext("2d");g.scale(dpr,dpr);const C=["#101B3D","#172B55","#2B4378","#C6A45C","#DCC58F","#FFF9ED"];
 const r=discs[1].getBoundingClientRect(),ox=r.left+r.width/2,oy=r.top+r.height/2,P=[];
 const mk=(x,y,vx,vy,d)=>P.push({x,y,vx,vy,d,c:C[Math.random()*C.length|0],w:5+Math.random()*6,h:3+Math.random()*4,o:Math.random()<.3,a:Math.random()*6,va:(Math.random()-.5)*.35,s:Math.random()*6});
 for(let i=0;i<130;i++){const a=Math.random()*Math.PI*2,v=3+Math.random()*8;mk(ox,oy,Math.cos(a)*v,Math.sin(a)*v-4,0)}
 for(let i=0;i<110;i++)mk(Math.random()*innerWidth,-20,(Math.random()-.5)*1.4,1+Math.random()*2.2,Math.random()*1200);
 const t0=performance.now();
 (function f(t){const e=t-t0;g.clearRect(0,0,innerWidth,innerHeight);
  P.forEach(p=>{if(e<p.d)return;p.vy+=.12;p.vx*=.992;p.vy*=.992;p.x+=p.vx+Math.sin((e+p.s*400)/380)*.5;p.y+=p.vy;p.a+=p.va;
   g.globalAlpha=Math.max(0,Math.min(1,(5200-e)/1400));g.fillStyle=p.c;g.save();g.translate(p.x,p.y);g.rotate(p.a);
   if(p.o){g.beginPath();g.arc(0,0,p.h/1.5,0,7);g.fill()}else g.fillRect(-p.w/2,-p.h/2,p.w,p.h);g.restore()});
  if(e<5400)requestAnimationFrame(f);else cv.remove()})(t0);
}
discs.forEach(d=>{
 const c=d.querySelector("canvas");c.width=c.height=W*dpr;const x=c.getContext("2d");x.scale(dpr,dpr);
 let gr;try{gr=x.createConicGradient(0,W/2,W/2);[[0,"#101B3D"],[.1,"#172B55"],[.2,"#C6A45C"],[.3,"#F6ECD3"],[.5,"#101B3D"],[.6,"#172B55"],[.7,"#C6A45C"],[.8,"#F6ECD3"],[1,"#101B3D"]].forEach(s=>gr.addColorStop(...s))}catch(e){gr=x.createLinearGradient(0,0,W,W);gr.addColorStop(0,"#DCC58F");gr.addColorStop(1,"#101B3D")}
 x.fillStyle=gr;x.beginPath();x.arc(W/2,W/2,W/2,0,7);x.fill();
 let on=false,lx=0,ly=0,mv=0,lh=0;
 const done=()=>{if(d.classList.contains("done"))return;d.classList.add("done");if(discs.every(q=>q.classList.contains("done")))setTimeout(confetti,250)};
 const pos=e=>{const b=c.getBoundingClientRect();return[(e.clientX-b.left)*W/b.width,(e.clientY-b.top)*W/b.height]};
 const chk=()=>{const a=x.getImageData(0,0,c.width,c.height).data;let n=0,t=0;for(let i=3;i<a.length;i+=20){t++;if(a[i]<40)n++}if(n/t>.42)done()};
 c.addEventListener("pointerdown",e=>{on=true;c.setPointerCapture(e.pointerId);[lx,ly]=pos(e);x.globalCompositeOperation="destination-out";x.beginPath();x.arc(lx,ly,10,0,7);x.fill()});
 c.addEventListener("pointermove",e=>{if(!on)return;const[px,py]=pos(e);x.globalCompositeOperation="destination-out";x.lineWidth=20;x.lineCap="round";x.beginPath();x.moveTo(lx,ly);x.lineTo(px,py);x.stroke();lx=px;ly=py;
  const n=performance.now();if(n-lh>130){lh=n;heart(e.clientX,e.clientY-10)}if(++mv%12==0)chk()});
 ["pointerup","pointercancel"].forEach(t=>c.addEventListener(t,()=>{on=false;chk()}));
 d.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();done()}});
});
})();

/* Countdown to 27 Dec 2026, 5:00 PM IST */
const T=new Date("2026-12-27T17:00:00+05:30").getTime(),p2=n=>String(n).padStart(2,"0");
function tick(){let s=Math.max(0,Math.floor((T-Date.now())/1000));cd.textContent=p2(Math.floor(s/86400));ch.textContent=p2(Math.floor(s%86400/3600));cm.textContent=p2(Math.floor(s%3600/60));cs.textContent=p2(s%60)}
tick();setInterval(tick,1000);

/* RSVP (stored only in this browser) */
const msg=document.getElementById("msg"),M={yes:"Thank you! We look forward to seeing you.",no:"You will be missed. Thank you for letting us know."};
try{const v=localStorage.getItem("rsvp");if(v&&M[v])msg.textContent=M[v]}catch(e){}
document.querySelectorAll(".btn").forEach(b=>b.onclick=()=>{msg.textContent=M[b.dataset.r];try{localStorage.setItem("rsvp",b.dataset.r)}catch(e){}});
