// A small website concept model. This is independent of the Unity implementation.
(() => {
  "use strict";
  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const copy = (point) => [...point];
  class MindcrowdSimulation {
    constructor(mode = "resources") { this.reset(mode); }
    reset(mode = this.mode) {
      this.mode = mode;
      this.time = 0;
      this.alarm = false;
      this.alarmTime = 0;
      this.completed = 0;
      this.rerouted = 0;
      this.formation = "block";
      this.message = "";
      this.blocks = mode === "medieval"
        ? [{ x: 145, y: 125, w: 75, h: 100, z: 22, kind: "ruin" }, { x: 170, y: 28, w: 36, h: 28, z: 11, kind: "rock" }, { x: 166, y: 300, w: 42, h: 24, z: 10, kind: "rock" }]
        : [{ x: 135, y: 125, w: 90, h: 100, z: 26, kind: "core" }];
      this.resources = [
        { id: 0, name: "KIOSK", position: [286, 95], queue: [], busy: null, duration: 4, enabled: true },
        { id: 1, name: "REST AREA", position: [286, 260], queue: [], busy: null, duration: 8, enabled: true }
      ];
      this.groups = [];
      if (mode === "medieval") {
        this.groups = [
          { id: 0, position: [55, 175], path: [[110, 85], [260, 85], [305, 175]], heading: [1, 0], narrow: false },
          { id: 1, position: [305, 175], path: [[255, 270], [105, 270], [55, 175]], heading: [-1, 0], narrow: false }
        ];
        this.agents = Array.from({ length: 32 }, (_, id) => ({ id, group: Math.floor(id / 16), position: [id < 16 ? 55 : 305, 175], state: "formation", path: [], alerted: false }));
        this.updateFormations(0, true);
      } else if (mode === "evacuation") {
        this.agents = Array.from({ length: 30 }, (_, id) => {
          const side = id < 15 ? 0 : 1;
          const position = [side ? 263 + (id % 3) * 23 : 30 + (id % 3) * 28, 130 + Math.floor((id % 15) / 3) * 35];
          return { id, position, origin: copy(position), state: "calm", alerted: false, path: this.patrol(position), speed: 18 + id % 5 };
        });
      } else {
        this.agents = Array.from({ length: 24 }, (_, id) => {
          const origin = [25 + id % 4 * 15, 180 + Math.floor(id / 4) * 20];
          return { id, origin, position: copy(origin), state: "choosing", resourceId: null, path: [], retry: id * .08, speed: 35 + id % 6 * 2, remaining: 0 };
        });
      }
    }
    patrol(position) {
      const x = position[0];
      return [[x, 80], [x < 135 ? 45 : 315, 80], [x < 135 ? 45 : 315, 285], [x, 285]];
    }
    resolve(position) {
      const point = [Math.max(12, Math.min(348, position[0])), Math.max(12, Math.min(338, position[1]))];
      for (const block of this.blocks) {
        const left = block.x - 3, right = block.x + block.w + 3, top = block.y - 3, bottom = block.y + block.h + 3;
        if (point[0] > left && point[0] < right && point[1] > top && point[1] < bottom) {
          const sides = [[point[0] - left, 0, left], [right - point[0], 0, right], [point[1] - top, 1, top], [bottom - point[1], 1, bottom]].sort((a, b) => a[0] - b[0]);
          point[sides[0][1]] = sides[0][2];
        }
      }
      return point;
    }
    move(agent, dt, speed = agent.speed || 30) {
      let remaining = speed * dt;
      while (agent.path.length && remaining > 0) {
        const target = agent.path[0], length = distance(agent.position, target);
        if (length <= remaining) { agent.position = copy(target); agent.path.shift(); remaining -= length; }
        else { agent.position = agent.position.map((value, i) => value + (target[i] - value) * remaining / length); remaining = 0; }
      }
      agent.position = this.resolve(agent.position);
      return agent.path.length === 0;
    }
    queuePoint(resource, index) { return [270 - index * 15, resource.position[1]]; }
    chooseResource(agent) {
      const options = this.resources.filter(resource => resource.enabled && resource.queue.length < 4);
      options.sort((a, b) => (distance(agent.position, a.position) + a.queue.length * 50 + (a.busy === null ? 0 : 25)) - (distance(agent.position, b.position) + b.queue.length * 50 + (b.busy === null ? 0 : 25)));
      if (!options.length) { agent.state = "choosing"; agent.retry = .5; return; }
      const resource = options[0];
      agent.resourceId = resource.id;
      const index = resource.queue.push(agent.id) - 1;
      const rightSide = agent.position[0] > 125;
      agent.path = resource.id === 0
        ? [...(rightSide ? [[315, agent.position[1]], [315, 80]] : [[95, agent.position[1]], [95, 80]]), [200, 80], this.queuePoint(resource, index)]
        : [...(rightSide ? [[315, agent.position[1]], [315, 285]] : [[95, agent.position[1]], [95, 285]]), [200, 285], this.queuePoint(resource, index)];
      agent.state = "approaching";
    }
    stepResources(dt) {
      for (const agent of this.agents) {
        if (agent.state === "spawning") {
          agent.remaining -= dt;
          if (agent.remaining <= 0) { agent.position = copy(agent.origin); agent.state = "choosing"; agent.retry = 0; }
        } else if (agent.state === "choosing") {
          agent.retry -= dt;
          if (agent.retry <= 0) this.chooseResource(agent);
        } else if (agent.state === "approaching" || agent.state === "waiting") {
          const resource = this.resources[agent.resourceId];
          const index = resource.queue.indexOf(agent.id);
          if (index < 0) continue;
          const target = this.queuePoint(resource, index);
          if (agent.state === "approaching" && agent.path.length > 1) agent.path[agent.path.length - 1] = target;
          else agent.path = [target];
          if (this.move(agent, dt)) {
            agent.state = "waiting";
            if (index === 0 && resource.busy === null && resource.enabled) {
              resource.queue.shift(); resource.busy = agent.id;
              agent.state = "using"; agent.position = copy(resource.position); agent.remaining = resource.duration;
            }
          }
        } else if (agent.state === "using") {
          agent.remaining -= dt;
          if (agent.remaining <= 0) {
            this.resources[agent.resourceId].busy = null;
            agent.resourceId = null; agent.state = "leaving";
            agent.path = [[330, agent.position[1]], [330, 35]];
            this.completed++;
          }
        } else if (agent.state === "leaving" && this.move(agent, dt)) {
          agent.state = "spawning"; agent.remaining = 1;
        }
      }
    }
    evacuate(agent) {
      agent.alerted = true; agent.state = "evacuating";
      agent.path = agent.position[0] < 135 ? [[95, 80], [305, 80], [330, 35]] : [[315, agent.position[1]], [315, 70], [330, 35]];
    }
    stepEvacuation(dt) {
      for (const agent of this.agents) {
        if (agent.state === "evacuated") continue;
        if (this.alarm && !agent.alerted && (distance(agent.position, [70, 260]) < 110 || this.time - this.alarmTime > 5 || this.agents.some(other => other.alerted && other.state !== "evacuated" && distance(agent.position, other.position) < 65))) this.evacuate(agent);
        if (agent.alerted) {
          if (this.move(agent, dt, 39 + agent.id % 6)) { agent.state = "evacuated"; this.completed++; }
        } else if (this.move(agent, dt)) agent.path = this.patrol(agent.origin);
      }
    }
    updateFormations(dt, snap = false) {
      for (const group of this.groups) {
        if (group.path.length) {
          const target = group.path[0], length = distance(group.position, target);
          if (length > .01) group.heading = target.map((value, i) => (value - group.position[i]) / length);
          this.move(group, dt, 24);
        }
        group.narrow = group.path.length > 0 && group.position[0] > 112 && group.position[0] < 255;
        for (const agent of this.agents.filter(item => item.group === group.id)) {
          const index = agent.id % 16;
          let row, across, along;
          if (group.narrow) { row = Math.floor(index / 2); across = (index % 2 - .5) * 8; along = 24 - row * 8; }
          else if (this.formation === "wedge") { row = Math.floor((Math.sqrt(8 * index + 1) - 1) / 2); across = (index - row * (row + 1) / 2 - row / 2) * 12; along = 15 - row * 10; }
          else { row = Math.floor(index / 4); across = (index % 4 - 1.5) * 10; along = 12 - row * 9; }
          const target = [group.position[0] + group.heading[0] * along - group.heading[1] * across, group.position[1] + group.heading[1] * along + group.heading[0] * across];
          agent.position = this.resolve(agent.position.map((value, i) => value + (target[i] - value) * (snap ? 1 : Math.min(1, dt * 5))));
        }
      }
    }
    action() {
      if (this.mode === "evacuation") {
        if (!this.alarm) { this.alarm = true; this.alarmTime = this.time; this.message = "Alarm raised. Exit A is blocked; agents share the alert and reroute to Exit B."; }
      } else if (this.mode === "medieval") {
        this.formation = this.formation === "block" ? "wedge" : "block";
        this.message = `${this.formation === "wedge" ? "Wedge" : "Block"} formation selected. Squads still narrow into columns through the passages.`;
      } else {
        const kiosk = this.resources[0]; kiosk.enabled = !kiosk.enabled;
        if (!kiosk.enabled) for (const id of kiosk.queue.splice(0)) {
          const agent = this.agents[id]; agent.resourceId = null; agent.state = "choosing"; agent.path = []; agent.retry = 0; this.rerouted++;
        }
        this.message = kiosk.enabled ? "The kiosk is open again. New visitors can reserve a place in its queue." : "The kiosk is closed. Waiting visitors reconsider their destination; active service finishes first.";
      }
    }
    step(dt) {
      dt = Math.max(0, Math.min(.1, dt)); this.time += dt;
      if (this.mode === "evacuation") this.stepEvacuation(dt);
      else if (this.mode === "medieval") this.updateFormations(dt);
      else this.stepResources(dt);
    }
    get stats() {
      if (this.mode === "evacuation") return [["In the hall", this.agents.length - this.completed], ["At safe exit", this.completed], ["Alerted", this.agents.filter(agent => agent.alerted).length]];
      if (this.mode === "medieval") return [["Orange squad", 16], ["Blue squad", 16], ["Formation", this.groups.some(group => group.narrow) ? "Column" : this.formation === "wedge" ? "Wedge" : "Block"]];
      return [["In queues", this.agents.filter(agent => agent.state === "waiting").length], ["Using resources", this.resources.filter(resource => resource.busy !== null).length], ["Visits finished", this.completed]];
    }
  }
  window.MindcrowdSimulation = MindcrowdSimulation;
})();
