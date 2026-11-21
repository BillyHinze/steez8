import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parse } from "acorn";
import {
  SIGNATURE_GRAB_IDS, SIGNATURE_GRAB_POSES, BOARD_SIGNATURE_POSES,
  applySignatureGrabPose, isSignatureGrab, signatureGrip, boardGrabBase,
} from "../public/signature-grab-poses.js";
import { GRAB_CATALOG } from "../public/grab-presets.js";

const expectedNames = ["Blunt", "Rocket Air", "True Nose", "Back Scratcher"];

test("the four signature grabs have authored, independent 3D rig profiles", () => {
  assert.deepEqual([...SIGNATURE_GRAB_IDS], [4, 5, 6, 7]);
  assert.deepEqual(SIGNATURE_GRAB_IDS.map(id => SIGNATURE_GRAB_POSES[id]?.name), expectedNames);
  const poses = new Set();
  for (const id of SIGNATURE_GRAB_IDS) {
    const profile = SIGNATURE_GRAB_POSES[id];
    assert(isSignatureGrab(id));
    assert.equal(profile.id, id);
    for (const bone of ["Torso", "Spine", "Leg_L", "Leg_R", "Knee_L", "Knee_R",
                        "Foot_L", "Foot_R", "Arm_L", "Elbow_L", "Arm_R", "Elbow_R"]) {
      assert(Array.isArray(profile.skeleton[bone]), id + " missing " + bone);
      assert.equal(profile.skeleton[bone].length, 3);
      assert(profile.skeleton[bone].every(x => Number.isFinite(x) && Math.abs(x) <= 2.1));
    }
    assert(profile.skis.L && profile.skis.R, id + " requires authored ski rotations");
    assert(profile.grips.L, id + " needs a real hand-to-ski grip target");
    for (const grip of Object.values(profile.grips)) {
      assert(["same", "opposite"].includes(grip.ski));
      assert.equal(grip.socket.length, 3);
      assert(grip.socket.every(x => Number.isFinite(x) && Math.abs(x) <= 1.3));
      assert(grip.reach > 0 && grip.reach <= 1);
    }
    const silhouette = JSON.stringify({bones:profile.skeleton,skis:profile.skis,grips:profile.grips});
    assert(!poses.has(silhouette), id + " reuses another signature pose");
    poses.add(silhouette);
  }
  assert(!isSignatureGrab(0));
  assert(!isSignatureGrab(3));
  assert(!isSignatureGrab(8));
  assert.equal(signatureGrip(7,"R")?.ski,"same");
  assert.equal(signatureGrip(4,"R"),null);
});

test("all four 3D poses animate hips, knees, both skis and arms separately", () => {
  const outputs = new Set();
  for(const id of SIGNATURE_GRAB_IDS) {
    const overlays = {}, skis = {};
    const mock = {
      board:false,
      overlay(name,x,y,z){ overlays[name] ??= [0,0,0]; overlays[name] = [
        overlays[name][0]+x, overlays[name][1]+y, overlays[name][2]+z
      ]},
      skiRotation(side,x,y,z){skis[side]=[x,y,z]},
    };
    assert.equal(applySignatureGrabPose(mock,id,1,0.5),true);
    assert(overlays.Torso?.some(x=>Math.abs(x)>.05));
    assert(overlays.Leg_L?.some(x=>Math.abs(x)>.1));
    assert(overlays.Leg_R?.some(x=>Math.abs(x)>.1));
    assert(overlays.Arm_L?.some(x=>Math.abs(x)>.1));
    assert(overlays.Arm_R?.some(x=>Math.abs(x)>.1));
    assert(skis.L.some(x=>Math.abs(x)>.08));
    assert(skis.R.some(x=>Math.abs(x)>.08));
    outputs.add(JSON.stringify([overlays.Leg_L,overlays.Knee_R,skis.L,skis.R]));
    const quiet={...mock, overlay(){throw Error("No changes when grab released")} ,
      skiRotation(){throw Error("No changes when grab released")}};
    assert.equal(applySignatureGrabPose(quiet,id,0),false);
    // Snowboard: the board profile moves only the upper body; legs, knees,
    // feet and ski rotations stay untouched so the board stays on the boots.
    const boardBones = new Set();
    const boardMock = { board:true, overlay(name){ boardBones.add(name); },
      skiRotation(){ throw Error("No ski rotation on a snowboard"); } };
    assert.equal(applySignatureGrabPose(boardMock,id,1,0.5,1/60),true);
    assert([...boardBones].every(name => !/^(Leg_|Knee_|Foot_)/.test(name)), [...boardBones].join());
  }
  assert.equal(outputs.size,4);
});

test("the game plays authored grab arms without unstable wrist IK", () => {
  const script = fs.readFileSync(new URL(
    "../public/_next/static/chunks/rider-animation-1mQglCn7.js", import.meta.url), "utf8");
  const rig = fs.readFileSync(new URL("../public/signature-grab-poses.js",import.meta.url),"utf8");
  assert.doesNotThrow(()=>parse(script,{ecmaVersion:"latest",sourceType:"module"}));
  assert.doesNotThrow(()=>parse(rig,{ecmaVersion:"latest",sourceType:"module"}));
  assert(script.includes('from "../../../signature-grab-poses.js"'));
  assert(script.includes("sigGrab(this,this.grabStyle,this.grab,signatureAirTime)"));
  assert(!script.includes("sigReach(this.grabContact,this.grabStyle,this.grab,e)"),
    "The unstable two-bone wrist attachment must not be active");
  assert(script.includes("sigPoles(this,this.grabStyle,n.airborne?this.grab:0,e)"),
    "Signature grabs must keep attached ski poles aligned while grabbing");
  assert(script.includes("this.fine&&!(n.airborne&&this.grabStyle>=4&&this.grabStyle<=7&&this.grab>.001)&&this.poleGrip.update"),
    "The stock skiing PoleGrip must not overwrite signature-grab pole orientation");
  assert(rig.includes("pole.parent.getWorldQuaternion(controller.swapParent).invert()"),
    "Signature poles must solve a stable parent-local orientation");
  assert(script.includes("if(this.grabStyle>=4&&this.grabStyle<=7){"),
    "Signature grabs must bypass the classic hand solver");
  assert(script.includes("if(!this.fine||E&&!r.grab||this.grab<=.001)this.grabContact.reset()"),
    "Signature styles must isolate the original hand contact solver");
  assert(!script.includes("`TailGrab`,`TailGrab`,`JapanGrab`,`JapanGrab`"),
    "The four signature styles still alias old Tail/Japan clips");
  const foot = script.indexOf("this.fine&&this.footContact.update(.2+A*.14");
  const pose = script.indexOf("sigGrab(this,this.grabStyle,this.grab,signatureAirTime)");
  assert(foot >= 0 && foot < pose,
    "Foot IK must run before authored knee/hip pose");
  // The baseline quaternion history must never contain the procedural
  // signature pose itself: otherwise each subsequent frame re-adds the
  // authored rotation and the legs/arms eventually spin uncontrollably.
  const legHistory = script.indexOf("for(let[e,t]of this.lastJoints)/^(Leg_|Knee_|Foot_)/.test(e.name)&&t.copy(e.quaternion)", foot);
  const armHistory = script.indexOf("if(sigHistory)for(let[e,t]of this.lastJoints)/^(Arm_|Elbow_|Hand_)/.test(e.name)&&t.copy(e.quaternion)", foot);
  const classicArmHistory = script.indexOf("if(!sigHistory)for(let[e,t]of this.lastJoints)/^(Arm_|Elbow_|Hand_)/.test(e.name)&&t.copy(e.quaternion)", pose);
  assert(foot < legHistory && legHistory < pose,
    "The leg smoothing baseline must be saved BEFORE procedural grab rotation");
  assert(legHistory < armHistory && armHistory < pose,
    "Signature arms must save their baseline BEFORE applying authored arm rotations");
  assert(pose < classicArmHistory,
    "Original grabs must preserve their normal post-contact arm baseline");
  assert(script.includes("this.weights.Air+=t*this.grab"),
    "Signature grabs must use neutral Air, not another old grab clip");
});

test("snowboard signature grabs use a real board-grab clip and their own authored upper body", () => {
  assert.deepEqual(Object.keys(BOARD_SIGNATURE_POSES).map(Number), [...SIGNATURE_GRAB_IDS]);
  const silhouettes = new Set();
  for (const id of SIGNATURE_GRAB_IDS) {
    const profile = BOARD_SIGNATURE_POSES[id];
    assert.equal(profile.name, GRAB_CATALOG[id].board, "board profile name must match the catalog");
    assert(["MuteGrab", "TailGrab", "JapanGrab"].includes(profile.base), id + " needs a clip that puts a hand on the board");
    assert.equal(boardGrabBase(id), profile.base);
    assert(["L", "R"].includes(profile.grip.hand) && Number.isFinite(profile.grip.along));
    assert(profile.skeleton[`Arm_${profile.grip.hand}`] || profile.skeleton[`Elbow_${profile.grip.hand}`],
      id + " must author its grabbing arm");
    for (const [bone, angles] of Object.entries(profile.skeleton)) {
      assert(!/^(Leg_|Knee_|Foot_)/.test(bone), id + " must not move the bound legs: " + bone);
      assert(angles.length === 3 && angles.every(v => Number.isFinite(v) && Math.abs(v) <= 1.6), id + " " + bone);
    }
    silhouettes.add(profile.base + JSON.stringify(profile.skeleton));
    assert(GRAB_CATALOG[id].boardNote && GRAB_CATALOG[id].boardNote !== GRAB_CATALOG[id].note,
      id + " needs its own snowboard description");
  }
  assert.equal(silhouettes.size, 4, "each snowboard grab needs a distinct silhouette");
  assert.equal(boardGrabBase(0), "MuteGrab");
});

test("the snowboard pose cross-fades when the grab changes mid-air instead of snapping", () => {
  const applied = [];
  const rider = { board: true, overlay(name, x, y, z) { applied.push([name, Math.hypot(x, y, z)]); } };
  const torso = () => applied.filter(([n]) => n === "Torso").at(-1)?.[1] ?? 0;
  applySignatureGrabPose(rider, 4, 1, .5, 1 / 60);
  const full = torso();
  applySignatureGrabPose(rider, 7, 1, .52, 1 / 60); // switch Stalefish -> Seatbelt
  assert(torso() < full * .99 && torso() > 0, "the old pose must fade out, not vanish");
  for (let f = 0; f < 30; f++) applySignatureGrabPose(rider, 7, 1, .54 + f / 60, 1 / 60);
  const seatbelt = Math.hypot(...BOARD_SIGNATURE_POSES[7].skeleton.Torso);
  assert(Math.abs(torso() - seatbelt) < .02, "the new pose must be fully applied within half a second");
  applied.length = 0;
  applySignatureGrabPose(rider, 5, 1, .1, 1 / 60); // a new jump starts on its own style
  assert(Math.abs(torso() - Math.hypot(...BOARD_SIGNATURE_POSES[5].skeleton.Torso)) < .02);
});

test("the board animation path applies the snowboard pose after the hand-contact reset", () => {
  const script = fs.readFileSync(new URL("../public/_next/static/chunks/rider-animation-1mQglCn7.js", import.meta.url), "utf8");
  assert(script.includes("if(this.board){let e=boardGrabBase(this.grabStyle);N(e,`${e}Mirror`,t*this.grab)}"),
    "snowboard signature grabs must play a real board-grab clip");
  const reset = script.indexOf("this.pressing=0,this.grabContact.reset(),n.crashTime<=0&&this.grab>.001&&this.grabStyle>=4&&this.grabStyle<=7&&sigGrab(this,this.grabStyle,this.grab,n.airTime,e)");
  assert(reset > 0, "GrabContact.reset() restores arm joints, so the board pose must run after it and keep fading after touchdown");
});
