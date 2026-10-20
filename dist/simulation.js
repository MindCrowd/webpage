(() => {
  "use strict";
  const canvas = document.querySelector("#crowd-canvas");
  const ctx = canvas?.getContext("2d");
  if (!ctx || !window.MindcrowdSimulation) return;
  const model = new window.MindcrowdSimulation("resources");
  const descriptions = {
    resources: "Visitors reserve a place, queue, use a kiosk or rest point, and leave. Close the kiosk to change their destination choices.",
    evacuation: "An alarm spreads through nearby agents. A blocked exit makes them choose an alternative route to safety.",
    medieval: "Two squads preserve their formations, narrow through passages, and regroup around battlefield obstacles."
  };
  const labels = { resources: "RESOURCE HALL", evacuation: "EVACUATION", medieval: "MEDIEVAL WAR FIELD" };
  const motion = document.querySelector("#motion-toggle");
  const action = document.querySelector("#scenario-action");
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let paused = preference.matches, visible = true, frame = null, last = null;
  let width = 500, height = 337, lastUI = -1;
  const iso = (x, y, z = 0) => [250 + (x - y) * .65, 24 + (x + y) * .39 - z];
  const polygon = (points, fill, stroke) => {
    ctx.beginPath(); points.forEach((point, i) => i ? ctx.lineTo(...point) : ctx.moveTo(...point)); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
  };
  const tile = (x, y, w, h, fill, stroke) => polygon([iso(x,y),iso(x+w,y),iso(x+w,y+h),iso(x,y+h)],fill,stroke);
  const block = (x, y, w, h, z, top = "#566157") => {
    polygon([iso(x,y+h),iso(x+w,y+h),iso(x+w,y+h,z),iso(x,y+h,z)],"#455149","#68766b");
    polygon([iso(x+w,y),iso(x+w,y+h),iso(x+w,y+h,z),iso(x+w,y,z)],"#354139","#68766b");
    polygon([iso(x,y,z),iso(x+w,y,z),iso(x+w,y+h,z),iso(x,y+h,z)],top,"#829078");
  };
  const route = (points, color = "#adbf94", dashed = true) => {
    ctx.beginPath(); points.forEach((point,i) => i ? ctx.lineTo(...iso(...point)) : ctx.moveTo(...iso(...point)));
    ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.setLineDash(dashed ? [3,5] : []); ctx.stroke(); ctx.setLineDash([]);
  };
  const text = (label, x, y, z = 0, color = "#d4debf") => {
    const point = iso(x,y,z); ctx.font = "7px Consolas,monospace"; ctx.textAlign = "center"; ctx.fillStyle = color; ctx.fillText(label,...point);
  };
  const ring = (x,y,radius,color) => {
    ctx.beginPath(); for(let i=0;i<=40;i++){const angle=i/40*Math.PI*2;const point=iso(x+Math.cos(angle)*radius,y+Math.sin(angle)*radius);i?ctx.lineTo(...point):ctx.moveTo(...point);}
    ctx.strokeStyle=color;ctx.lineWidth=1;ctx.stroke();
  };
  const drawAgent = (agent) => {
    const [x,y] = iso(...agent.position);
    let color = "#f58d5b", head = "#ffc192";
    if (model.mode === "evacuation" && !agent.alerted) { color = "#c4d7ac"; head = "#e8efd2"; }
    if (model.mode === "medieval" && agent.group === 1) { color = "#8fb9c8"; head = "#cee4e7"; }
    ctx.fillStyle = "#14271d77";ctx.beginPath();ctx.ellipse(x+2,y+1,4.5,2,0,0,Math.PI*2);ctx.fill();
    if (agent.state === "using" && agent.resourceId === 1) {
      ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y-4);ctx.lineTo(x+3,y-2);ctx.lineTo(x+5,y+1);ctx.stroke();
    } else {
      ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y-3,2.4,3.5,0,0,Math.PI*2);ctx.fill();
      if (agent.state !== "waiting" && agent.state !== "choosing" && agent.state !== "using") {
        const stride=Math.sin(model.time*9+agent.id)*1.7;ctx.strokeStyle=color;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x,y-2);ctx.lineTo(x-stride,y+2);ctx.moveTo(x,y-2);ctx.lineTo(x+stride,y+2);ctx.stroke();
      }
    }
    ctx.fillStyle=head;ctx.beginPath();ctx.arc(x,y-7,1.8,0,Math.PI*2);ctx.fill();
    if (model.mode === "medieval") { ctx.strokeStyle="#c5cbb9";ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(x+3,y-4);ctx.lineTo(x+5,y-11);ctx.stroke(); }
  };
  const draw = () => {
    const ratio=Math.min(window.devicePixelRatio||1,2);ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);
    const scale=Math.min(width/500,height/337);ctx.translate((width-500*scale)/2,(height-337*scale)/2);ctx.scale(scale,scale);ctx.lineWidth=.6;
    for(let x=10;x<500;x+=18)for(let y=10;y<330;y+=18){ctx.fillStyle="#435147";ctx.fillRect(x,y,.7,.7);}
    tile(0,0,360,350,model.mode==="medieval"?"#394432":"#303e35","#76816b");
    for(let i=25;i<350;i+=25){route([[i,0],[i,350]],"#43523f",false);route([[0,i],[360,i]],"#43523f",false);}
    if(model.mode==="resources") {
      tile(15,165,70,125,"#42513d","#778565");tile(305,16,45,45,"#5c7048","#b5c98a");
      route([[60,240],[95,80],[260,80],[270,95]]);route([[60,260],[95,285],[260,285],[270,260]]);route([[330,270],[330,35]]);
      text("ARRIVALS",42,310);text("EXIT",328,15,8);
      for(const resource of model.resources) {
        for(let i=0;i<4;i++)tile(263-i*15,resource.position[1]-5,9,10,resource.enabled?"#536342":"#5e5142");
        if(resource.id===0){block(294,85,17,22,23,resource.enabled?"#80926b":"#755343");polygon([iso(293,91,17),iso(293,104,17),iso(293,104,10),iso(293,91,10)],resource.enabled?"#bdd4b7":"#c17a59");}
        else {block(292,240,12,41,8,"#8d8261");block(300,240,4,41,17,"#786f55");}
        text(resource.id===0?(resource.enabled?"KIOSK / OPEN":"KIOSK / CLOSED"):"REST POINT",288,resource.position[1]-22,28,resource.enabled?"#d6dfbd":"#ffb48c");
        if(resource.busy!==null)ring(...resource.position,10,"#dfbe78");
      }
    } else if(model.mode==="evacuation") {
      tile(12,12,42,42,model.alarm?"#76503e":"#577247",model.alarm?"#ec9870":"#b4ca8f");tile(308,12,40,42,"#577247","#b4ca8f");
      route([[60,260],[95,80],[330,35]],model.alarm?"#e5bd83":"#a4b790");
      if(!model.alarm)route([[60,260],[30,35]]);
      text(model.alarm?"EXIT A / BLOCKED":"EXIT A",30,10,13,model.alarm?"#ffb48c":"#d4debf");text("EXIT B / SAFE",330,10,13);
      if(model.alarm){tile(43,235,50,45,"#6d4b3877","#dc956b");ring(70,260,24+(model.time-model.alarmTime)*12%65,"#e9a37566");text("ALARM",70,266,16,"#ffba8d");route([[17,18],[47,48]],"#ffba8d",false);route([[47,18],[17,48]],"#ffba8d",false);}
      else {ring(70,260,32,"#92a98766");text("ALARM POINT",63,300,6);}
    } else {
      tile(20,128,70,100,"#6d513b55","#ac8355");tile(270,128,70,100,"#425d6555","#729fa9");
      route([[55,175],[110,85],[260,85],[305,175]],"#db9f6a");route([[305,175],[255,270],[105,270],[55,175]],"#91bdce");
      text("ORANGE SQUAD",48,112,5,"#f6b27e");text("BLUE SQUAD",310,298,7,"#bfdee5");
      text("NARROW PASSAGE",185,82,4);text("REGROUP",278,214,2,"#b7c3a6");
    }
    if(model.mode!=="medieval") {block(0,0,12,5,16);block(55,0,250,5,16);block(348,0,12,5,16);block(355,5,5,345,16);}
    const objects=[...model.blocks.map(item=>({depth:item.x+item.y+item.w+item.h,block:item})),...model.agents.filter(agent=>!["spawning","evacuated"].includes(agent.state)).map(agent=>({depth:agent.position[0]+agent.position[1],agent}))].sort((a,b)=>a.depth-b.depth);
    for(const object of objects) {
      if(object.block){const b=object.block;block(b.x,b.y,b.w,b.h,b.z,b.kind==="ruin"?"#726f58":b.kind==="rock"?"#747965":"#566157");if(b.kind==="core")text("SERVICE CORE",180,175,b.z+2);}
      else drawAgent(object.agent);
    }
    if(model.mode==="medieval")for(const group of model.groups){const [x,y]=iso(...group.position,12);ctx.strokeStyle=group.id?"#b9d9e1":"#ffd2a4";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-18);ctx.stroke();ctx.fillStyle=group.id?"#8ebdcb":"#ee9e66";ctx.fillRect(x,y-18,8,5);}
    ctx.textAlign="left";ctx.fillStyle="#a9b99e";ctx.font="7px Consolas,monospace";ctx.fillText(labels[model.mode],16,328);ctx.textAlign="right";ctx.fillText("INTERACTIVE CONCEPT",480,328);
  };
  const updateUI = () => {
    model.stats.forEach(([label,value],index)=>{document.querySelector(`#preview-label-${index}`).textContent=label;document.querySelector(`#preview-value-${index}`).textContent=value;});
    action.disabled=model.mode==="evacuation"&&model.alarm;
    action.textContent=model.mode==="evacuation"?(model.alarm?"Alarm raised":"Trigger alarm"):model.mode==="medieval"?(model.formation==="block"?"Use wedge formation":"Use block formation"):(model.resources[0].enabled?"Close kiosk":"Reopen kiosk");
  };
  const tick = time => {
    frame=null;if(last!==null)model.step(Math.min((time-last)/1000,.05)*1.35);last=time;draw();
    if(model.time-lastUI>.2){updateUI();lastUI=model.time;}
    if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick);
  };
  const sync = () => {
    if(frame!==null)cancelAnimationFrame(frame);frame=null;last=null;
    motion.textContent=paused?"Play ▷":"Pause Ⅱ";motion.setAttribute("aria-pressed",String(paused));motion.setAttribute("aria-label",paused?"Play simulation preview":"Pause simulation preview");
    updateUI();draw();if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick);
  };
  const select = mode => {
    model.reset(mode);lastUI=-1;
    document.querySelectorAll("[data-scenario]").forEach(button=>{const active=button.dataset.scenario===mode;button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active));});
    document.querySelector("#scenario-description").textContent=descriptions[mode];
    document.querySelector("#scenario-code").textContent=mode==="resources"?"01 / 03":mode==="evacuation"?"02 / 03":"03 / 03";
    canvas.setAttribute("aria-label",`${labels[mode]}. ${descriptions[mode]} Interactive website concept, independent of the Unity implementation.`);
    const legend=document.querySelector("#scenario-legend");legend.textContent=mode==="evacuation"?"Calm → alerted → safe exit":mode==="medieval"?"Formation → passage → regroup":"Approach → queue → use → leave";
    document.querySelector("#scenario-message").textContent=`${labels[mode]} preview selected. ${descriptions[mode]}`;sync();
  };
  document.querySelectorAll("[data-scenario]").forEach(button=>button.addEventListener("click",()=>select(button.dataset.scenario)));
  action.addEventListener("click",()=>{model.action();document.querySelector("#scenario-message").textContent=model.message;sync();});
  document.querySelector("#scenario-reset").addEventListener("click",()=>select(model.mode));
  motion.addEventListener("click",()=>{paused=!paused;sync();});
  preference.addEventListener("change",event=>{paused=event.matches;sync();});document.addEventListener("visibilitychange",sync);
  new ResizeObserver(()=>{const box=canvas.getBoundingClientRect();width=box.width;height=box.height;const ratio=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);draw();}).observe(canvas);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();}).observe(canvas);
  select("resources");
})();
