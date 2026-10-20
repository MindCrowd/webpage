import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const context = { window: {} };
vm.runInNewContext(await readFile(new URL("../dist/simulation-model.js", import.meta.url), "utf8"), context);
const Simulation = context.window.MindcrowdSimulation;
const checkPositions = model => {
  for (const agent of model.agents) {
    assert(agent.position.every(Number.isFinite), "Agent positions must remain finite");
    assert(agent.position[0] >= 12 && agent.position[0] <= 348 && agent.position[1] >= 12 && agent.position[1] <= 338, "Agents must stay on the map");
    assert(!model.blocks.some(block => agent.position[0] > block.x && agent.position[0] < block.x + block.w && agent.position[1] > block.y && agent.position[1] < block.y + block.h), "Agents must not enter obstacles");
  }
};
const hall = new Simulation("resources");
for (let frame = 0; frame < 3600; frame++) {
  if (frame === 900) hall.action();
  if (frame === 1800) hall.action();
  hall.step(1/30);
  checkPositions(hall);
  for (const resource of hall.resources) {
    assert(resource.queue.length <= 4, "Queue capacity must be respected");
    assert.equal(new Set(resource.queue).size, resource.queue.length, "Queue slots must be unique");
    assert.equal(hall.agents.filter(agent => agent.state === "using" && agent.resourceId === resource.id).length, resource.busy === null ? 0 : 1, "Resource reservations must agree with service state");
    if (!resource.enabled) assert.equal(resource.queue.length, 0, "Closed resources must release waiting agents");
  }
}
assert(hall.completed > 0, "Visitors must finish resource visits");
assert(hall.rerouted > 0, "Closing a resource must release and reroute its queue");
const evacuation = new Simulation("evacuation");
for (let frame=0;frame<150;frame++) evacuation.step(1/30);
assert.equal(evacuation.completed,0,"Agents must not evacuate before the alarm");
evacuation.action();
for(let frame=0;frame<1800;frame++){evacuation.step(1/30);checkPositions(evacuation);}
assert.equal(evacuation.completed,evacuation.agents.length,"All alerted agents must reach the safe exit");
const battle = new Simulation("medieval");
let enteredPassage = false;
for(let frame=0;frame<1200;frame++){
  if(frame===300)battle.action();
  battle.step(1/30);checkPositions(battle);
  enteredPassage ||= battle.groups.some(group=>group.narrow);
}
assert(enteredPassage,"Squads must adapt through a narrow passage");
assert(battle.groups.every(group=>group.path.length===0),"Both squads must finish their maneuver");
assert.equal(battle.formation,"wedge");
battle.reset();assert.equal(battle.formation,"block");assert.equal(battle.time,0);
console.log("Simulation checks passed: resource capacity and rerouting, alarm evacuation, formations, obstacle clearance, and reset.");
