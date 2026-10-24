'use strict';
const KEY='hotel-transylvania:mission04:frank:v1';
const QUESTIONS=[
{id:1,text:'Stingy Jack invited the Devil to dinner.',answer:true,feedback:"Yes! Jack didn't want to pay for dinner."},
{id:2,text:'The Devil turned into a pumpkin to pay for dinner.',answer:false,feedback:'He turned into a coin.'},
{id:3,text:'Jack put the coin next to a silver cross.',answer:true,feedback:'The silver cross stopped the Devil from changing back.'},
{id:4,text:'The Devil promised to leave Jack alone for ten years.',answer:false,feedback:'He promised to leave Jack alone for one year.'},
{id:5,text:'Jack put a burning coal inside a carved turnip.',answer:true,feedback:'Yes! His first lantern was a turnip.'},
{id:6,text:'In the video, people wore costumes because they wanted ghosts to recognise them.',answer:false,feedback:'They hoped ghosts would mistake them for other ghosts and stay away.'}
];
const STYLES={eyes:['Mischievous gaze','Surprised eyes','Sleepy eyes','Fierce eyes','Playful wink'],nose:['Irregular triangle nose','Crooked witch nose','Wide rounded nose','Whimsical heart nose'],mouth:['Crooked toothy grin','Single-fang smirk','Laughing mouth','Zigzag monster mouth','Sweet friendly smile']};
function fresh(){const order=QUESTIONS.map(q=>q.id);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}return {stage:'intro',order,solved:[],face:{eyes:null,nose:null,mouth:null},layout:{},lit:false,complete:false,name:'',sound:false};}
let storageOK=true,state;try{state=JSON.parse(localStorage.getItem(KEY));}catch{storageOK=false;}if(!state||!Array.isArray(state.order)||state.order.length!==6||new Set(state.order).size!==6||!state.order.every(id=>QUESTIONS.some(q=>q.id===id)))state=fresh();
state.solved=Array.isArray(state.solved)?[...new Set(state.solved.filter(id=>state.order.includes(id)))]:[];state.face=state.face||{};for(const k of Object.keys(STYLES))if(!Number.isInteger(state.face[k])||state.face[k]<0||state.face[k]>=STYLES[k].length)state.face[k]=null;
if(!['intro','video','quiz','builder','presentation','reward','map'].includes(state.stage))state.stage='intro';if(!state.freeNavigation&&['builder','presentation','reward','map'].includes(state.stage)&&state.solved.length<6)state.stage='quiz';if(!state.freeNavigation&&['presentation','reward','map'].includes(state.stage)&&!Object.keys(STYLES).every(k=>state.face[k]!==null))state.stage='builder';
const main=document.querySelector('#main');let videoReturn=null,feedback='',answered=false,frame=0,audio,assetReady=false,assetFailed=false;
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{storageOK=false;notify('Progress cannot be saved in this browser. Keep this tab open.');}}
function notify(text){document.querySelector('#notice').textContent=text;clearTimeout(notify.timer);notify.timer=setTimeout(()=>document.querySelector('#notice').textContent='',5000);}
function sound(kind='select'){if(!state.sound)return;try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.type='sine';o.frequency.setValueAtTime(kind==='win'?523:380,audio.currentTime);o.frequency.exponentialRampToValueAtTime(kind==='win'?1046:760,audio.currentTime+.17);g.gain.setValueAtTime(.065,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.35);o.start();o.stop(audio.currentTime+.4);}catch{notify('Sound is unavailable in this browser.');}}
function syncSound(){const b=document.querySelector('#sound');b.textContent=state.sound?'Sound on':'Sound off';b.setAttribute('aria-pressed',String(state.sound));}
document.querySelector('#sound').onclick=()=>{state.sound=!state.sound;syncSound();persist();sound();};syncSound();
document.querySelector('.brand').onclick=e=>{e.preventDefault();videoReturn=null;go('intro');};
function restartMission(){if(!confirm('Start this mission again? Your current lantern and memory lights will be reset.'))return;const completed=state.complete;state=fresh();state.complete=completed;videoReturn=null;syncSound();go('intro');}
document.querySelector('#restart').onclick=restartMission;
document.querySelector('#restart-top').onclick=restartMission;
const PAGE_ORDER=['intro','video','quiz','builder','presentation','reward','map'];
function syncPageNavigation(){const i=PAGE_ORDER.indexOf(state.stage);document.querySelector('#page-back').disabled=i<=0;document.querySelector('#page-next').disabled=i===PAGE_ORDER.length-1;}
function changePage(direction){
 const i=PAGE_ORDER.indexOf(state.stage),stage=PAGE_ORDER[i+direction];if(!stage)return;
 state.freeNavigation=true;videoReturn=null;
 if(stage==='presentation')state.lit=readyFace();
 if(stage==='builder')state.lit=false;
 go(stage);
}
document.querySelector('#page-back').onclick=()=>changePage(-1);
document.querySelector('#page-next').onclick=()=>changePage(1);
function go(stage){state.stage=stage;feedback='';answered=false;persist();render();requestAnimationFrame(()=>{const h=main.querySelector('h1,h2');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}});}
function button(id,fn){const el=document.getElementById(id);if(el)el.onclick=fn;}
function storyPlayer(){
 if(typeof location!=='undefined'&&!/^https?:$/.test(location.protocol))return `<a class="story-external" href="https://www.youtube.com/watch?v=StBd35QCq4A" target="_blank" rel="noopener"><span aria-hidden="true">▶</span><strong>Watch the story</strong><small>Open on YouTube</small></a>`;
 return `<iframe src="https://www.youtube.com/embed/StBd35QCq4A?rel=0&playsinline=1" title="THE STORY OF THE JACK-O'-LANTERN" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
}
const videoLink='<a class="video-link" href="https://www.youtube.com/watch?v=StBd35QCq4A" target="_blank" rel="noopener noreferrer">OPEN VIDEO ON YOUTUBE ↗</a>';
function render(){cancelAnimationFrame(frame);carvingReveal=null;document.body.classList.toggle('lit',state.lit&&['presentation','reward','map'].includes(state.stage));const s=state.stage;document.body.classList.toggle('is-intro',s==='intro');document.body.classList.toggle('is-quiz',s==='quiz');document.body.classList.toggle('is-builder',s==='builder');syncPageNavigation();
if(s==='intro'){main.innerHTML=`<section class="intro" aria-labelledby="workshop-title"><h1 id="workshop-title">Frank's<span>Jack-o'-Lantern</span>Workshop</h1><button class="primary" id="watch">ENTER WORKSHOP <span aria-hidden="true">→</span></button></section>`;button('watch',()=>go('video'));}
if(s==='video'){main.innerHTML=`<section class="watch"><div class="stage-top"><div class="eyebrow">STORY TIME</div><h2>The story of the Jack-o'-Lantern</h2><p>What did Jack use as his first lantern?</p></div><div class="tv">${storyPlayer()}</div><div class="actions">${videoLink}<button id="watched" class="primary">${videoReturn?'BACK TO MEMORY CHALLENGE':'I WATCHED THE STORY →'}</button></div><p class="small" style="text-align:center">Video not playing? Open it on YouTube, then come back here.<br>Continue when you finish the story. You can skip the promotion.</p></section>`;button('watched',()=>{videoReturn=null;go('quiz');});}
if(s==='quiz')renderQuiz();
if(s==='builder'){main.innerHTML=`<section><div class="builder-head"><div class="eyebrow">MAKE A LITTLE HALLOWEEN MAGIC</div><h2>Make your lantern</h2><p><span class="speaker">FRANK</span> “Help me make my own Halloween lantern!”</p></div><div class="studio"><div class="pumpkin-wrap"><canvas class="hero" width="1200" height="1200" role="img" aria-label="Your unlit pumpkin. Choose eyes, a nose and a mouth."></canvas></div><div class="trays"><div class="station-label"><span aria-hidden="true">✦</span> FRANK’S CARVING PATTERNS</div>${Object.entries(STYLES).map(([key,labels])=>`<fieldset class="tray tray-${key}"><legend>${key.toUpperCase()}</legend><div class="options" data-group="${key}">${labels.map((label,i)=>`<button class="option" data-kind="${key}" data-index="${i}" aria-label="${label}" title="${label}" aria-pressed="${state.face[key]===i}"><canvas width="240" height="160" aria-hidden="true"></canvas><span class="stencil-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span></button>`).join('')}</div></fieldset>`).join('')}<p class="small" style="text-align:center">Drag a pattern onto the pumpkin. Pull its handles to change its shape.</p></div></div><div class="actions builder-actions"><button id="random">RANDOMIZE FACE</button><button id="reset">RESET PUMPKIN</button><button id="light" class="primary">LIGHT IT UP! ✦</button></div></section>`;
for(const b of main.querySelectorAll('.option')){const k=b.dataset.kind,i=Number(b.dataset.index);preview(b.querySelector('canvas'),k,i);b.onclick=()=>{if(b.dataset.dragged){delete b.dataset.dragged;return;}select(k,i);};wireStencilDrag(b,k,i);b.onkeydown=e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const opts=[...b.parentElement.children];let next=e.key==='Home'?0:e.key==='End'?opts.length-1:(i+(e.key==='ArrowRight'?1:-1)+opts.length)%opts.length;opts[next].focus();opts[next].click();}};}
button('random',()=>{for(const k of Object.keys(STYLES))state.face[k]=Math.floor(Math.random()*STYLES[k].length);state.lit=false;persist();render();sound();});button('reset',()=>{state.face={eyes:null,nose:null,mouth:null};state.layout={};state.lit=false;persist();render();});button('light',()=>{if(!readyFace())return notify('Choose eyes, a nose and a mouth first.');if(!assetReady||!carvingAssetsReady())return notify('The carving artwork is still loading. Please try again.');state.lit=true;sound('win');go('presentation');});updateLight();startDrawing();setupFreeCarving();}
if(s==='presentation'){main.innerHTML=`<section class="presentation"><div class="pumpkin-wrap"><canvas class="hero" width="1200" height="1200" role="img" aria-label="Your glowing jack-o'-lantern"></canvas><div class="sparkles" aria-hidden="true"></div></div><div class="speaking"><div class="eyebrow">LOOK WHAT YOU CREATED</div><h2>A little glow.<br>A lot of personality.</h2><p><span class="speaker">FRANK</span> “It's amazing! Tell me about your pumpkin!”</p><p class="starter">My jack-o'-lantern is called <input id="lantern-name" class="name-input" maxlength="40" aria-label="Your lantern's name" placeholder="give it a name…">.</p><p class="starter">It has got … eyes and a … mouth.</p><p class="starter">It looks funny / scary / happy / silly.</p><div class="actions"><button id="save">SAVE MY LANTERN ↓</button><button id="finish" class="primary">I'M READY! →</button><button id="edit" class="text-button">Change my pumpkin</button></div><p class="small">Say it aloud to Frank or a friend. No recording needed.<br>Your lantern uses a magical LED glow.</p></div></section>`;const inp=document.querySelector('#lantern-name');inp.value=state.name||'';inp.oninput=()=>{state.name=inp.value;persist();};button('save',saveLantern);button('edit',()=>{state.lit=false;go('builder');});button('finish',()=>{state.complete=true;persist();go('reward');});startDrawing();}
if(s==='reward'){main.innerHTML=`<section class="reward"><div class="eyebrow">MISSION 04 COMPLETE</div><canvas class="hero" width="1000" height="1000" style="margin:auto" role="img" aria-label="Magic Pumpkin Lantern collectible"></canvas><h2>Magic Pumpkin Lantern<br>unlocked</h2><p><span class="speaker">FRANK</span> “You've made the perfect lantern for Dracula's Halloween party!”</p><p class="small">Your lantern has been added to your adventure collection.</p><div class="actions"><button id="continue" class="primary">CONTINUE ADVENTURE →</button><button id="save">SAVE MY LANTERN ↓</button></div></section>`;button('continue',()=>{window.dispatchEvent(new CustomEvent('hotel:mission-complete',{detail:{mission:'04',collectible:'magic-pumpkin-lantern'}}));go('map');});button('save',saveLantern);startDrawing();}
if(s==='map'){main.innerHTML=`<section class="reward"><div class="eyebrow">YOUR ADVENTURE COLLECTION</div><h2>A light for the hotel.</h2><canvas class="hero" width="1000" height="1000" style="margin:auto" role="img" aria-label="Collected magic pumpkin lantern"></canvas><p>MAGIC PUMPKIN LANTERN · COLLECTED</p><p class="small">Mission complete. Return to the hotel map in your adventure.</p><div class="actions"><button id="return" class="primary">SEE MY LANTERN</button></div></section>`;button('return',()=>go('presentation'));startDrawing();}
}
function readyFace(){return Object.keys(STYLES).every(k=>state.face[k]!==null);}
function updateLight(){const b=document.querySelector('#light');if(b)b.disabled=!readyFace()||!assetReady||!carvingAssetsReady();}
function select(k,i,animate=true){
 state.face[k]=i;activeFeature=k;state.lit=false;persist();
 let chosen;
 for(const b of main.querySelectorAll(`[data-kind="${k}"]`)){b.setAttribute('aria-pressed',String(Number(b.dataset.index)===i));if(Number(b.dataset.index)===i)chosen=b;}
 sound();updateLight();
 const hero=main.querySelector('canvas.hero');
 if(hero)hero.setAttribute('aria-label',`Your pumpkin: ${Object.entries(state.face).filter(([,v])=>v!==null).map(([kind,v])=>STYLES[kind][v]).join(', ')}. Unlit.`);
 syncFeatureHandles();
 if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){carvingReveal=null;drawAll();return;}
 const start=performance.now();carvingReveal={kind:k,start};
 if(chosen&&hero){
  const from=chosen.querySelector('canvas').getBoundingClientRect(),to=hero.getBoundingClientRect(),bounds=CARVING_SPECS[k].bounds;
  const flying=document.createElement('canvas');flying.width=240;flying.height=160;preview(flying,k,i);
  flying.className='flying-stencil';flying.setAttribute('aria-hidden','true');
  Object.assign(flying.style,{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px'});document.body.appendChild(flying);
  const dx=to.left+(bounds[0]+bounds[2]/2)/1000*to.width-from.left-from.width/2;
  const dy=to.top+(bounds[1]+bounds[3]/2)/1000*to.height-from.top-from.height/2;
  const flight=flying.animate([{transform:'translate(0,0) rotate(-4deg)',opacity:1},{transform:`translate(${dx}px,${dy}px) scale(1.5) rotate(3deg)`,opacity:0}],{duration:520,easing:'cubic-bezier(.2,.7,.2,1)',fill:'forwards'});
  flight.finished.then(()=>flying.remove(),()=>flying.remove());
 }
 cancelAnimationFrame(frame);
 function reveal(now){if(state.stage!=='builder')return;drawAll(now);if(now-start<900)frame=requestAnimationFrame(reveal);else{carvingReveal=null;drawAll();}}
 frame=requestAnimationFrame(reveal);
}
let quizFitObserver=null;
function fitQuizToViewport(){
 if(state.stage!=='quiz')return;
 const sheet=main.querySelector('.memory-workshop');if(!sheet)return;
 const style=getComputedStyle(main),available=main.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom);
 const scale=Math.min(1,available/(sheet.offsetHeight+12));
 sheet.style.transform=`scale(${Math.max(.1,scale)})`;
}
function observeQuizFit(){
 if(quizFitObserver)quizFitObserver.disconnect();
 if(typeof ResizeObserver==='undefined')return;
 const sheet=main.querySelector('.memory-workshop');
 quizFitObserver=new ResizeObserver(fitQuizToViewport);quizFitObserver.observe(main);if(sheet)quizFitObserver.observe(sheet);
 requestAnimationFrame(fitQuizToViewport);
}
function renderQuiz(){
 cancelAnimationFrame(frame);
 const id=state.order.find(x=>!state.solved.includes(x));
 const q=QUESTIONS.find(q=>q.id===id);
 answered=false;
 memoryExpression=Math.min(5,state.solved.length);
 main.innerHTML=`<section class="memory-workshop" aria-label="Bring the pumpkin to life"><div class="memory-pumpkin"><div class="pumpkin-aura" aria-hidden="true"></div><canvas id="memory-lantern" width="1200" height="1200" role="img" aria-label="Pumpkin light: ${state.solved.length} of 6 memories"></canvas><div class="memory-magic" aria-hidden="true">${Array.from({length:12},(_,i)=>`<i style="--i:${i};--x:${12+(i*23)%76}%;--y:${24+(i*17)%65}%"></i>`).join('')}</div><p class="pumpkin-caption" id="pumpkin-progress">${state.solved.length===6?'Your lantern is alive!':'Light this pumpkin with your answer.'}</p></div><div class="memory-card"><span class="notebook-clip" aria-hidden="true"></span><div class="memory-heading"><span class="notebook-owner">Frank’s workshop notes</span><span id="memory-count">MEMORY ${Math.min(6,state.solved.length+1)} OF 6</span></div><h2>${q?'True or false?':'You made it glow!'}</h2>${q?`<div class="memory-question"><p class="statement" tabindex="-1">${q.text}</p></div><div class="answers"><button id="true"><span aria-hidden="true">✓</span> TRUE</button><button id="false"><span aria-hidden="true">×</span> FALSE</button></div><div id="feedback" class="feedback" role="status" aria-live="polite"></div><button id="next" class="primary memory-next" hidden>Next</button><button id="rewatch" class="text-button">↻ Watch again</button>`:`<p class="memory-finished">Six memories. One magical lantern.<br>Now let’s make one of your own.</p><button id="build" class="primary">MAKE MY PUMPKIN →</button>`}</div></section>`;
 startMemoryDrawing(q?0:1);observeQuizFit();
 button('build',()=>go('builder'));
 if(!q)return;
 for(const v of [true,false])button(String(v),()=>{
  if(answered)return;
  const box=document.querySelector('#feedback'),card=main.querySelector('.memory-card'),chosen=document.getElementById(String(v));
  if(v===q.answer){
   answered=true;state.solved.push(q.id);persist();sound('win');
   box.className='feedback good';box.textContent=state.solved.length===6?'Beautiful! You brought the lantern to life.':'That’s right! '+q.feedback;
   chosen.classList.add('answer-correct');
   document.querySelector('#true').disabled=true;document.querySelector('#false').disabled=true;
   document.querySelector('#memory-count').textContent='MEMORY '+(memoryExpression+1)+' OF 6';
   const next=document.querySelector('#next');next.hidden=false;next.textContent='Next';
   document.querySelector('#memory-lantern').setAttribute('aria-label',`Pumpkin light: ${state.solved.length} of 6 memories; ${MEMORY_EXPRESSIONS[memoryExpression]} face`);
   if(state.solved.length===6)document.querySelector('#pumpkin-progress').textContent='Your lantern is alive!';
   main.querySelector('.memory-pumpkin').classList.remove('magic-burst');void card.offsetWidth;main.querySelector('.memory-pumpkin').classList.add('magic-burst');
   startMemoryDrawing(1,0);next.focus({preventScroll:true});
  }else{
   box.className='feedback';box.textContent='Not quite. Give it another try!';
   chosen.classList.remove('answer-wrong');void chosen.offsetWidth;chosen.classList.add('answer-wrong');
  }
 });
 button('next',()=>{if(state.solved.length===6){go('builder');return;}answered=false;renderQuiz();main.querySelector('.statement').focus({preventScroll:true});});
 button('rewatch',()=>{videoReturn='quiz';go('video');});
}
let memoryLevel=0,memoryExpression=0,memoryFlame=0;
function startMemoryDrawing(target,from=target){
 cancelAnimationFrame(frame);const started=performance.now();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function tick(now){
  const c=document.querySelector('#memory-lantern');if(!c||state.stage!=='quiz')return;
  const elapsed=now-started,duration=target===1?2200:1100;
  const t=reduced?1:Math.min(1,Math.max(0,(elapsed-(target===1?350:0))/duration));
  memoryLevel=from+(target-from)*(1-Math.pow(1-t,3));
  const flame=target>0?(from>0||reduced?1:Math.min(1,elapsed/700)):0;
  memoryFlame=flame;
  drawMemoryPumpkin(c,memoryLevel,now,flame);
  main.querySelector('.memory-pumpkin').style.setProperty('--glow',memoryLevel);
  if(!reduced&&(t<1||target>0))frame=requestAnimationFrame(tick);
 }
 tick(started);
}
// Rendered carvings retain their flesh thickness, fibers and interior shadows.
// Matching lighting plates replace the old geometric face overlays in the quiz.
let carvedDarkReady=false,carvedLitReady=false,carvedPatchDark,carvedPatchLit;
let expressionAtlasReady=false;
const expressionAtlas=new Image();
const MEMORY_EXPRESSIONS=['cheerful','surprised','winking','laughing','playfully spooky','starry-eyed'];
// Wick tips measured in each 362×362 source cell, not in screen pixels.
const MEMORY_WICKS=[{x:187,y:278},{x:178,y:280},{x:175,y:281},{x:188,y:267},{x:180,y:278},{x:175,y:284}];
function memoryWick(index){const p=MEMORY_WICKS[index];return {x:35+p.x/362*930,y:p.y/362*930};}

expressionAtlas.onload=()=>{expressionAtlasReady=true;drawAll();};
expressionAtlas.onerror=()=>notify('Some pumpkin faces could not load. Please reload.');
expressionAtlas.src='assets/pumpkin/faces-atlas.png';
function drawExpressionPlate(ctx,index,lit){
 const w=expressionAtlas.naturalWidth/3,h=expressionAtlas.naturalHeight/4;
 ctx.drawImage(expressionAtlas,(index%3)*w,(Math.floor(index/3)+(lit?2:0))*h,w,h,35,0,930,930);
}
const carvedDark=new Image(),carvedLit=new Image();
function prepareFlamePatch(image){
 const patch=document.createElement('canvas');patch.width=1000;patch.height=1000;
 const p=patch.getContext('2d');p.drawImage(image,0,0,1000,1000);
 p.globalCompositeOperation='destination-in';
 const mask=p.createRadialGradient(485,652,17,485,652,52);
 mask.addColorStop(0,'#fff');mask.addColorStop(.55,'#fff');mask.addColorStop(1,'#fff0');
 p.fillStyle=mask;p.fillRect(0,0,1000,1000);return patch;
}
carvedDark.onload=()=>{carvedDarkReady=true;carvedPatchDark=prepareFlamePatch(carvedDark);drawAll();};
carvedLit.onload=()=>{carvedLitReady=true;carvedPatchLit=prepareFlamePatch(carvedLit);drawAll();};
carvedDark.onerror=carvedLit.onerror=()=>notify('The lantern artwork could not load. Please reload.');
carvedDark.src='assets/pumpkin/carved-dark.png';carvedLit.src='assets/pumpkin/carved-lit.png';
const memoryUnlitLayers=new Map();
function drawUnlitExpression(ctx,index){
 if(!memoryUnlitLayers.has(index)){
  const base=document.createElement('canvas');base.width=1000;base.height=1000;
  const p=base.getContext('2d');drawExpressionPlate(p,index,false);
  // Hide tiny flames baked into the last two source cells without reading
  // canvas pixels (pixel reads are blocked when opened directly as file://).
  if(index>=4){
   const wick=memoryWick(index);
   const cover=p.createRadialGradient(wick.x,wick.y-14,5,wick.x,wick.y-14,23);
   cover.addColorStop(0,'#3c1808');cover.addColorStop(.6,'#3c1808');cover.addColorStop(1,'#3c180800');
   p.fillStyle=cover;p.fillRect(wick.x-27,wick.y-42,54,37);
  }
  memoryUnlitLayers.set(index,base);
 }
 ctx.drawImage(memoryUnlitLayers.get(index),0,0);
}
const memoryLightLayers=new Map();
function memoryLightLayer(index){
 if(memoryLightLayers.has(index))return memoryLightLayers.get(index);
 const layer=document.createElement('canvas');layer.width=1000;layer.height=1000;
 const p=layer.getContext('2d');drawUnlitExpression(p,index);
 // Apply a soft lighting wash to this same raster; never read pixels.
 p.globalCompositeOperation='source-atop';
 const amber=p.createRadialGradient(510,650,15,510,590,340);
 amber.addColorStop(0,'#ffa52d');amber.addColorStop(.45,'#e8781444');amber.addColorStop(1,'#ff8a0000');
 p.fillStyle=amber;p.fillRect(100,290,800,570);
 p.globalCompositeOperation='destination-in';
 const mask=p.createRadialGradient(510,600,40,510,600,290);
 mask.addColorStop(0,'#ffffffa0');mask.addColorStop(.65,'#ffffff60');mask.addColorStop(1,'#fff0');
 p.fillStyle=mask;p.fillRect(0,0,1000,1000);
 memoryLightLayers.set(index,layer);return layer;
}
function drawMemoryPumpkin(c,level,time,flame){
 const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
 if(!expressionAtlasReady){ctx.fillStyle='#ffdb9c';ctx.font='24px Georgia';ctx.textAlign='center';ctx.fillText('Preparing a little magic…',c.width/2,c.height/2);return;}
 ctx.save();ctx.scale(c.width/1000,c.height/1000);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const flicker=reduced?1:.98+.015*Math.sin(time/270)+.005*Math.sin(time/117);
 const glow=Math.max(0,Math.min(1,level))*flicker;
 drawUnlitExpression(ctx,memoryExpression);
 // Restore the exact source pixels as its already-rendered flame ignites.
 if(memoryExpression>=4&&flame>0){ctx.globalAlpha=Math.min(1,flame);drawExpressionPlate(ctx,memoryExpression,false);ctx.globalAlpha=1;}
 if(glow>0){
  ctx.globalCompositeOperation='screen';ctx.globalAlpha=glow;
  ctx.drawImage(memoryLightLayer(memoryExpression),0,0);
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
 }
 if(flame>0&&memoryExpression<4){
  // Anchor the flame to this expression’s own wick and canvas transform.
  const {x,y}=memoryWick(memoryExpression);
  const scale=(.55+.45*glow)*Math.min(1,flame);
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  const sway=reduced?0:Math.sin(time/210)*2;
  const fire=ctx.createRadialGradient(0,-10,1,0,-22,35);
  fire.addColorStop(0,'#fffef2');fire.addColorStop(.35,'#fff5b9');fire.addColorStop(.7,'#ffc248');fire.addColorStop(1,'#f18a16');
  ctx.fillStyle=fire;ctx.shadowColor='#ffb53e';ctx.shadowBlur=20+glow*12;
  ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-18,-8,-12,-28,sway,-47);ctx.bezierCurveTo(5,-31,19,-9,0,0);ctx.fill();ctx.restore();
 }
 ctx.restore();
}
// Authored raster carving atlases: columns are unlit / candlelit, rows are designs.
const CARVING_SPECS={
 eyes:{rows:5,cuts:[0,.197,.403,.579,.776,1],bounds:[250,365,500,230]},
 nose:{rows:4,cuts:[0,.25,.5,.73,1],bounds:[445,530,110,112]},
 mouth:{rows:5,cuts:[0,.205,.37,.583,.79,1],bounds:[292,635,416,205]}
};
const carvingAssets={};let carvingReveal=null;
// Positions and independent width/height live in the same logical coordinates
// as the pumpkin, so dragging survives resize, edit, lighting and PNG export.
let activeFeature=null,carvingResizeObserver=null;
function featureBounds(kind){
 const saved=state.layout?.[kind];
 return Array.isArray(saved)&&saved.length===4&&saved.every(Number.isFinite)?saved.slice():CARVING_SPECS[kind].bounds.slice();
}
function setFeatureBounds(kind,bounds){
 state.layout=state.layout||{};
 let [x,y,w,h]=bounds;w=Math.max(45,Math.min(820,w));h=Math.max(40,Math.min(610,h));
 x=Math.max(70,Math.min(930-w,x));y=Math.max(300,Math.min(910-h,y));
 state.layout[kind]=[x,y,w,h];carvingReveal=null;drawAll();syncFeatureHandles();
}
function setupFreeCarving(){
 const hero=main.querySelector('.studio canvas.hero');if(!hero?.parentElement)return;
 hero.parentElement.classList.add('free-carving');
 const layer=document.createElement('div');layer.className='feature-handles';layer.setAttribute('aria-label','Move and reshape your carvings');
 hero.parentElement.appendChild(layer);syncFeatureHandles();
 if(carvingResizeObserver)carvingResizeObserver.disconnect();
 if(typeof ResizeObserver!=='undefined'){carvingResizeObserver=new ResizeObserver(()=>syncFeatureHandles());carvingResizeObserver.observe(hero);}
}
function removeFeature(kind){
 if(state.stage!=='builder'||!Object.hasOwn(STYLES,kind))return;
 cancelAnimationFrame(frame);carvingReveal=null;state.face[kind]=null;
 if(state.layout)delete state.layout[kind];state.lit=false;activeFeature=null;
 for(const option of main.querySelectorAll(`[data-kind="${kind}"]`))option.setAttribute('aria-pressed','false');
 persist();drawAll();syncFeatureHandles();updateLight();
 const next=main.querySelector(`[data-kind="${kind}"]`);if(next)next.focus({preventScroll:true});
}
function syncFeatureHandles(){
 if(state.stage!=='builder')return;
 const layer=main.querySelector('.feature-handles'),hero=main.querySelector('.studio canvas.hero');if(!layer||!hero?.parentElement)return;
 const imageBox=hero.getBoundingClientRect(),parentBox=hero.parentElement.getBoundingClientRect();
 Object.assign(layer.style,{left:imageBox.left-parentBox.left+'px',top:imageBox.top-parentBox.top+'px',width:imageBox.width+'px',height:imageBox.height+'px'});
 for(const kind of Object.keys(CARVING_SPECS)){
  let item=layer.querySelector(`[data-feature="${kind}"]`);
  if(state.face[kind]===null){if(item)item.remove();continue;}
  if(!item){
   item=document.createElement('div');item.className='feature-handle';item.dataset.feature=kind;item.tabIndex=0;item.setAttribute('role','group');
   item.setAttribute('aria-label',`${kind}: drag to move. Arrow keys move; Alt and arrow keys resize. Shift makes larger steps. Delete removes this carving.`);
   item.innerHTML='<span class="feature-size feature-width" data-resize="width" aria-hidden="true"></span><span class="feature-size feature-height" data-resize="height" aria-hidden="true"></span><span class="feature-size feature-corner" data-resize="both" aria-hidden="true"></span>';
   const remove=document.createElement('button');remove.type='button';remove.className='feature-remove';remove.textContent='×';remove.title='Remove '+kind;remove.setAttribute('aria-label','Remove '+kind);remove.onpointerdown=e=>e.stopPropagation();remove.onclick=e=>{e.stopPropagation();removeFeature(kind);};remove.onkeydown=e=>e.stopPropagation();item.appendChild(remove);
   item.onpointerdown=e=>beginFeatureDrag(e,kind,item);
   item.onfocus=()=>{activeFeature=kind;syncFeatureHandles();};
   item.onkeydown=e=>{
    if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();removeFeature(kind);return;}
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();
    const b=featureBounds(kind),step=e.shiftKey?20:5,dx=e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0,dy=e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0;
    if(e.altKey){b[2]+=dx;b[3]+=dy;}else{b[0]+=dx;b[1]+=dy;}
    setFeatureBounds(kind,b);persist();
   };
   layer.appendChild(item);
  }
  const b=featureBounds(kind);Object.assign(item.style,{left:b[0]/10+'%',top:b[1]/10+'%',width:b[2]/10+'%',height:b[3]/10+'%'});
  item.classList.toggle('active',activeFeature===kind);item.style.zIndex=activeFeature===kind?'3':'1';
 }
}
function logicalPointer(e){
 const box=main.querySelector('.studio canvas.hero').getBoundingClientRect();
 return {x:(e.clientX-box.left)/box.width*1000,y:(e.clientY-box.top)/box.height*1000,inside:e.clientX>=box.left&&e.clientX<=box.right&&e.clientY>=box.top&&e.clientY<=box.bottom};
}
function beginFeatureDrag(e,kind,item){
 if(e.button!==0)return;e.preventDefault();e.stopPropagation();activeFeature=kind;item.focus({preventScroll:true});
 const start=logicalPointer(e),base=featureBounds(kind),mode=e.target.dataset.resize;item.setPointerCapture(e.pointerId);
 item.onpointermove=event=>{const p=logicalPointer(event),b=base.slice(),dx=p.x-start.x,dy=p.y-start.y;if(mode){if(mode!=='height')b[2]+=dx;if(mode!=='width')b[3]+=dy;}else{b[0]+=dx;b[1]+=dy;}setFeatureBounds(kind,b);};
 const end=()=>{item.onpointermove=null;item.onpointerup=null;item.onpointercancel=null;persist();};item.onpointerup=end;item.onpointercancel=end;
}
function wireStencilDrag(button,kind,index){
 button.onpointerdown=e=>{
  if(e.button!==0)return;
  const start={x:e.clientX,y:e.clientY},oldFace=state.face[kind],oldBounds=featureBounds(kind);let dragging=false;
  button.setPointerCapture(e.pointerId);
  button.onpointermove=event=>{
   if(!dragging&&Math.hypot(event.clientX-start.x,event.clientY-start.y)<8)return;
   if(!dragging){dragging=true;button.dataset.dragged='true';activeFeature=kind;select(kind,index,false);}
   event.preventDefault();const p=logicalPointer(event),b=featureBounds(kind);setFeatureBounds(kind,[p.x-b[2]/2,p.y-b[3]/2,b[2],b[3]]);
  };
  const end=event=>{
   if(dragging&&(!logicalPointer(event).inside||event.type==='pointercancel')){state.face[kind]=oldFace;state.layout=state.layout||{};state.layout[kind]=oldBounds;for(const b of main.querySelectorAll(`[data-kind="${kind}"]`))b.setAttribute('aria-pressed',String(Number(b.dataset.index)===oldFace));drawAll();syncFeatureHandles();updateLight();}
   button.onpointermove=null;button.onpointerup=null;button.onpointercancel=null;persist();setTimeout(()=>{delete button.dataset.dragged;},0);
  };
  button.onpointerup=end;button.onpointercancel=end;
 };
}
function carvingAssetsReady(){return Object.keys(CARVING_SPECS).every(k=>carvingAssets[k]?.ready);}
function refreshStencils(){for(const b of main.querySelectorAll('.option'))preview(b.querySelector('canvas'),b.dataset.kind,Number(b.dataset.index));}
for(const [kind,spec] of Object.entries(CARVING_SPECS)){
 const image=new Image();carvingAssets[kind]={image,ready:false,failed:false};
 image.onload=()=>{carvingAssets[kind].ready=true;refreshStencils();updateLight();drawAll();};
 image.onerror=()=>{carvingAssets[kind].failed=true;updateLight();notify('A carving sheet could not load. Reload to restore the workshop patterns.');};
 image.src=`assets/carvings/${kind}.png`;
}
const pumpkin=new Image();pumpkin.onload=()=>{assetReady=true;updateLight();drawAll();refreshStencils();};pumpkin.onerror=()=>{assetFailed=true;notify('Pumpkin artwork could not load. Check the assets folder and reload.');main.insertAdjacentHTML('afterbegin','<p class="asset-error" role="alert">Pumpkin artwork unavailable. <button onclick="location.reload()">Reload artwork</button></p>');};pumpkin.src='assets/pumpkin/base.png';
// Silhouette masks discard the nose sheet's surrounding matte, retaining
// the authored flesh walls, cavity texture and transmitted lighting pixels.
const NOSE_SILHOUETTES=[
 'M .547 .113 C .48 .20 .30 .54 .218 .78 C .20 .84 .35 .91 .52 .94 C .68 .94 .88 .88 .887 .80 C .80 .58 .68 .22 .547 .113 Z',
 'M .574 .055 C .45 .07 .30 .30 .25 .61 C .21 .79 .30 .76 .38 .70 C .64 .54 .78 .81 .79 .97 C .97 .79 .97 .60 .86 .46 C .74 .29 .72 .06 .574 .055 Z',
 'M .52 .015 C .31 .02 .13 .35 .15 .63 C .13 .88 .38 .95 .57 .85 C .77 .99 .98 .89 .96 .62 C .95 .37 .75 .02 .52 .015 Z',
 'M .54 .14 C .31 -.02 .16 .13 .19 .43 C .23 .65 .45 .80 .55 .87 C .72 .73 .94 .50 .92 .29 C .89 .02 .67 -.01 .54 .14 Z'
];
function rasterCarving(ctx,kind,index,lit,bounds){
 const asset=carvingAssets[kind];if(!asset?.ready||index===null)return;
 const spec=CARVING_SPECS[kind],image=asset.image,cw=image.naturalWidth/2,sy=spec.cuts[index]*image.naturalHeight,sh=(spec.cuts[index+1]-spec.cuts[index])*image.naturalHeight;
 // Draw ONE lighting plate. No misregistered dark/lit crossfade or vector overlay.
 ctx.save();
 if(kind==='nose'){
  ctx.translate(bounds[0],bounds[1]);ctx.scale(bounds[2],bounds[3]);
  ctx.clip(new Path2D(NOSE_SILHOUETTES[index]));
  ctx.drawImage(image,lit?cw:0,sy,cw,sh,0,0,1,1);
 }else ctx.drawImage(image,lit?cw:0,sy,cw,sh,...bounds);
 ctx.restore();
}
function drawPumpkin(canvas,face=state.face,lit=state.lit,time=0){
 const ctx=canvas.getContext('2d'),w=canvas.width;ctx.clearRect(0,0,w,canvas.height);ctx.save();ctx.scale(w/1000,w/1000);
 if(!assetReady){ctx.fillStyle='#ffcf83';ctx.font='20px sans-serif';ctx.textAlign='center';ctx.fillText(assetFailed?'Artwork unavailable':'Preparing your pumpkin…',500,500);ctx.restore();return;}
 if(lit){const glow=ctx.createRadialGradient(500,680,20,500,680,440);glow.addColorStop(0,'#ffb53f25');glow.addColorStop(1,'#ffb53f00');ctx.fillStyle=glow;ctx.fillRect(0,0,1000,1000);}
 ctx.drawImage(pumpkin,55,35,890,890);
 for(const [kind,spec] of Object.entries(CARVING_SPECS)){
  const bounds=featureBounds(kind);
  if(face[kind]===null||!carvingAssets[kind].ready)continue;
  ctx.save();
  if(carvingReveal?.kind===kind&&state.stage==='builder'){
   const t=Math.max(0,Math.min(1,(time-carvingReveal.start-220)/600));
   ctx.beginPath();ctx.rect(bounds[0],bounds[1],bounds[2]*t,bounds[3]);ctx.clip();
  }
  // Flicker modulates the rendered emission plate, preserving its physical shading.
  if(lit&&!matchMedia('(prefers-reduced-motion: reduce)').matches)ctx.filter=`brightness(${1+.025*Math.sin(time/290)+.01*Math.sin(time/117)})`;
  rasterCarving(ctx,kind,face[kind],lit,bounds);ctx.restore();
 }
 ctx.restore();
}
function preview(c,kind,index){
 const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
 const spec=CARVING_SPECS[kind];
 const width=kind==='nose'?82:216,height=kind==='nose'?96:Math.min(120,216*spec.bounds[3]/spec.bounds[2]);
 rasterCarving(ctx,kind,index,false,[(c.width-width)/2,(c.height-height)/2,width,height]);
}
function drawAll(time=0){const memory=document.querySelector('#memory-lantern');if(memory)drawMemoryPumpkin(memory,memoryLevel,time,memoryFlame);for(const c of main.querySelectorAll('canvas.hero'))drawPumpkin(c,state.face,state.lit,time);}
function startDrawing(){cancelAnimationFrame(frame);function tick(t){drawAll(t);if(state.lit&&!matchMedia('(prefers-reduced-motion: reduce)').matches)frame=requestAnimationFrame(tick);}tick(0);}
async function saveLantern(){if(!assetReady||!carvingAssetsReady())return notify('Wait for the pumpkin and carving artwork to load.');try{const c=document.createElement('canvas');c.width=1800;c.height=1980;const ctx=c.getContext('2d');const g=ctx.createRadialGradient(900,900,30,900,900,1250);g.addColorStop(0,'#473044');g.addColorStop(1,'#160e21');ctx.fillStyle=g;ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle='#c7a365';ctx.lineWidth=3;ctx.strokeRect(45,45,1710,1890);const art=document.createElement('canvas');art.width=1600;art.height=1600;drawPumpkin(art,state.face,true);ctx.drawImage(art,100,100);ctx.fillStyle='#ffdb93';ctx.textAlign='center';ctx.font='60px Georgia';ctx.fillText(state.name||'My Magic Pumpkin Lantern',900,1760,1500);ctx.font='23px sans-serif';ctx.fillStyle='#c7b1c5';ctx.fillText("FRANK'S JACK-O'-LANTERN WORKSHOP",900,1840);const data=c.toDataURL('image/png');const a=document.createElement('a');a.href=data;a.download='my-magic-pumpkin-lantern.png';document.body.appendChild(a);a.click();a.remove();notify('Your lantern is ready to save!');}catch{notify('Export is unavailable here. Open the game directly in your browser and try again.');}}
render();if(!storageOK)notify('Progress cannot be saved in this browser. Keep this tab open.');
