import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parse } from "acorn";
import {
  SIGNATURE_GRAB_IDS, SIGNATURE_GRAB_POSES,
  applySignatureGrabPose, isSignatureGrab, signatureGrip,
} from "../public/signature-grab-poses.js";

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
    assert.equal(applySignatureGrabPose({...mock,board:true},id,1),false);
  }
  assert.equal(outputs.size,4);
});

test("the game plays genuine poses after foot IK and anchors wrists with the new IK", () => {
  const script = fs.readFileSync(new URL(
    "../public/_next/static/chunks/rider-animation-1mQglCn7.js", import.meta.url), "utf8");
  const rig = fs.readFileSync(new URL("../public/signature-grab-poses.js",import.meta.url),"utf8");
  assert.doesNotThrow(()=>parse(script,{ecmaVersion:"latest",sourceType:"module"}));
  assert.doesNotThrow(()=>parse(rig,{ecmaVersion:"latest",sourceType:"module"}));
  assert(script.includes('from "../../../signature-grab-poses.js"'));
  assert(script.includes("sigGrab(this,this.grabStyle,this.grab,n.airTime)"));
  assert(script.includes("sigReach(this.grabContact,this.grabStyle,this.grab,e)"));
  assert(!script.includes("`TailGrab`,`TailGrab`,`JapanGrab`,`JapanGrab`"),
    "The four signature styles still alias old Tail/Japan clips");
  const foot = script.indexOf("this.fine&&this.footContact.update(.2+A*.14");
  const pose = script.indexOf("sigGrab(this,this.grabStyle,this.grab,n.airTime)");
  const hand = script.indexOf("sigReach(this.grabContact,this.grabStyle,this.grab,e)");
  assert(foot >= 0 && foot < pose && pose < hand,
    "Foot IK must run before authored knee/hip pose, then new hand-to-ski IK");
  assert(script.includes("this.weights.Air+=t*this.grab"),
    "Signature grabs must use neutral Air, not another old grab clip");
});
