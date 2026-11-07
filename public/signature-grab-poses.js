/**
 * Original STEEZ8 signature ski-grab choreography.
 *
 * Screenshot references: Blunt (cross-body crouch), Rocket Air (long forward
 * extension), True Nose (one ski drawn almost upright beside the chest),
 * Back Scratcher (both tails pulled high behind the rider).
 *
 * All joint rotations are radians in the existing rig's YXZ overlay order.
 * These are authored poses, not aliases of Mute/Tail/Japan animation clips.
 * Existing physics, score IDs, replay packet formats and keyboard binds remain
 * unchanged. The final reach constraint targets actual Ski_L/Ski_R meshes.
 */
const pose = (id, name, skeleton, skis, grips) =>
  Object.freeze({
    id, name,
    skeleton: Object.freeze(skeleton),
    skis: Object.freeze(skis),
    grips: Object.freeze(grips),
  });

const freezeBones = bones =>
  Object.freeze(Object.fromEntries(Object.entries(bones).map(([name, values]) =>
    [name, Object.freeze(values)])));

export const SIGNATURE_GRAB_POSES = Object.freeze({
  4: pose(4, "Blunt",
    freezeBones({
      // Low one-sided crouch; the cross-body hand reaches across the front ski.
      Torso: [.38, -.22, .22], Spine: [.22, -.19, .08],
      Neck: [-.10, .16, -.10], Head: [-.12, .19, -.08],
      Leg_L: [.48, -.09, -.20], Knee_L: [-.68, 0, .10],
      Leg_R: [.82, .10, .25], Knee_R: [-1.03, -.12, -.13],
      Foot_L: [.18, -.06, -.14], Foot_R: [.25, .10, .20],
      Arm_L: [.36, -.28, .53], Elbow_L: [-.72, -.05, .16],
      Hand_L: [-.20, 0, -.06],
      Arm_R: [-.23, .20, -.52], Elbow_R: [.30, .02, -.14],
      Hand_R: [.12, .08, 0],
    }),
    Object.freeze({ L: [.16, -.13, -.12], R: [-.34, .18, .24] }),
    Object.freeze({
      L: Object.freeze({ ski: "opposite", socket: Object.freeze([-.08, .10, .70]), reach: .94 }),
    })
  ),
  5: pose(5, "Rocket Air",
    freezeBones({
      // Project both skis forward with hips lifted and knees almost straight.
      Torso: [.64, 0, -.04], Spine: [.26, 0, 0],
      Neck: [-.18, 0, 0], Head: [-.12, .06, 0],
      Leg_L: [.68, -.06, -.06], Knee_L: [-.22, .02, 0],
      Leg_R: [.72, .06, .06], Knee_R: [-.25, -.02, 0],
      Foot_L: [-.66, -.04, -.04], Foot_R: [-.68, .04, .04],
      Arm_L: [.65, -.15, .22], Elbow_L: [-.64, .03, .10],
      Hand_L: [-.10, -.03, 0],
      Arm_R: [.66, .12, -.22], Elbow_R: [-.62, -.03, -.10],
      Hand_R: [-.09, .03, 0],
    }),
    Object.freeze({ L: [-.64, -.05, -.10], R: [-.62, .05, .10] }),
    Object.freeze({
      L: Object.freeze({ ski: "same", socket: Object.freeze([-.035, .07, .92]), reach: .98 }),
      R: Object.freeze({ ski: "same", socket: Object.freeze([.035, .07, .92]), reach: .98 }),
    })
  ),
  6: pose(6, "True Nose",
    freezeBones({
      // Bring one leading ski upright beside the chest in a tight forward tuck.
      Torso: [.42, -.31, .20], Spine: [.26, -.15, .07],
      Neck: [-.18, .12, -.07], Head: [-.15, .22, .05],
      Leg_L: [1.08, -.19, -.13], Knee_L: [-1.24, -.06, .05],
      Leg_R: [.54, .05, .14], Knee_R: [-.78, 0, -.08],
      Foot_L: [.65, -.16, -.08], Foot_R: [.10, .06, .12],
      Arm_L: [.48, -.29, .32], Elbow_L: [-.70, .05, .06],
      Hand_L: [-.11, 0, 0],
      Arm_R: [-.11, .13, -.50], Elbow_R: [.31, 0, -.10],
      Hand_R: [.12, 0, 0],
    }),
    Object.freeze({ L: [.94, -.16, .12], R: [-.12, .10, -.13] }),
    Object.freeze({
      L: Object.freeze({ ski: "same", socket: Object.freeze([-.05, .08, 1.04]), reach: 1 }),
    })
  ),
  7: pose(7, "Back Scratcher",
    freezeBones({
      // Reversed tucked hips and knees lift BOTH ski tails behind the helmet.
      Torso: [-.30, .13, -.12], Spine: [-.38, .06, -.06],
      Neck: [.17, -.11, .05], Head: [.18, -.09, .05],
      Leg_L: [1.12, -.09, -.14], Knee_L: [-1.47, -.07, -.08],
      Leg_R: [1.08, .09, .14], Knee_R: [-1.42, .07, .08],
      Foot_L: [.93, -.08, -.12], Foot_R: [.96, .08, .12],
      Arm_L: [-.40, -.18, .68], Elbow_L: [-1.04, -.10, .18],
      Hand_L: [-.12, 0, 0],
      Arm_R: [-.47, .18, -.70], Elbow_R: [-1.01, .12, -.20],
      Hand_R: [-.13, 0, 0],
    }),
    Object.freeze({ L: [.88, -.12, -.10], R: [.86, .12, .10] }),
    Object.freeze({
      L: Object.freeze({ ski: "same", socket: Object.freeze([-.07, .08, -.89]), reach: .98 }),
      R: Object.freeze({ ski: "same", socket: Object.freeze([.07, .08, -.89]), reach: .98 }),
    })
  ),
});

export const SIGNATURE_GRAB_IDS = Object.freeze([4, 5, 6, 7]);

export function isSignatureGrab(style) {
  return Number.isInteger(style) && Object.hasOwn(SIGNATURE_GRAB_POSES, style);
}
export function signatureGrip(style, side) {
  if (side !== "L" && side !== "R") return null;
  return SIGNATURE_GRAB_POSES[style]?.grips[side] ?? null;
}
function clamp01(value) {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}
function smooth(value) {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
}

/**
 * The body pose is applied after the normal foot-contact IK and before arm
 * IK. The animation controller stores its smoothed leg and arm baselines
 * before adding the procedural signature poses. Otherwise those extra joint
 * rotations leak into the next frame's baseline and compound endlessly.
 */
export function applySignatureGrabPose(controller, style, strength, airTime = 0) {
  const profile = SIGNATURE_GRAB_POSES[style];
  if (!profile || controller?.board) return false;
  const weight = smooth(strength);
  if (weight < .0001) return false;
  const settle = Math.sin((Number.isFinite(airTime) ? airTime : 0) * 2.15) * .010 * weight;
  for (const [bone, angle] of Object.entries(profile.skeleton)) {
    // Motion is centred on the held silhouette; no abrupt new spin/flip input.
    const breath = bone === "Spine" || bone === "Torso" ? settle : 0;
    controller.overlay(bone,
      angle[0] * weight + breath, angle[1] * weight, angle[2] * weight);
  }
  for (const [side, angles] of Object.entries(profile.skis)) {
    controller.skiRotation(side,
      angles[0] * weight, angles[1] * weight, angles[2] * weight);
  }
  if (typeof window !== "undefined" &&
      (window.__steez8GrabDebugEnabled || new URLSearchParams(window.location.search).has("grabDebug"))) {
    const names = ["Torso", "Leg_L", "Leg_R", "Knee_L", "Knee_R", "Foot_L", "Foot_R", "Arm_L", "Arm_R"];
    window.__steez8SignaturePose = {
      id: style, name: profile.name, activeGrips: 0, stage: "body", strength: +weight.toFixed(3),
      joints: Object.fromEntries(names.map(name =>
        [name, controller.bones?.[name]?.quaternion?.toArray().map(v => +v.toFixed(4)) ?? null])),
    };
  }
  return true;
}

/**
 * Two-bone IK attachment: wrists actually reach the correct ski mesh.
 * On original grabs, the existing solver remains unchanged.
 * This uses the controller's existing GrabContact arm solver to avoid
 * allocating per-frame Three.js objects and to preserve pole/hand rigging.
 */
export function reachSignatureGrab(contact, style, strength, step = 1 / 60) {
  const profile = SIGNATURE_GRAB_POSES[style];
  if (!profile) return false;
  const weight = smooth(strength);
  if (weight < .001) return false;
  contact.root.updateWorldMatrix(true, true);
  let applied = 0;
  for (const chain of contact.chains) {
    const grip = profile.grips[chain.side];
    if (!grip) continue;
    const ski = grip.ski === "opposite" ? chain.ski : chain.tailSki;
    if (!ski) continue;
    // Reach only part-way toward a long ski tip. A fully constrained two-bone
    // arm cannot physically reach some signature targets; forcing it there
    // folds the elbows across the chest and sends the poles through the body.
    const blend = Math.min(.72, weight * grip.reach * .72);
    chain.arm.getWorldPosition(contact.start);
    chain.elbow.getWorldPosition(contact.elbow);
    chain.hand.getWorldPosition(contact.hand);
    chain.hand.getWorldQuaternion(contact.wrist);
    contact.socket.set(...grip.socket);
    ski.localToWorld(contact.socket);
    contact.target.lerpVectors(contact.hand, contact.socket, blend);
    // Limit wrist-target travel when changing grabs, similar to the original
    // GrabContact solver. A single bad frame must not whip the entire arm.
    if (chain.valid && Number.isFinite(step) && step > 0) {
      contact.previous.copy(chain.previous);
      contact.root.localToWorld(contact.previous);
      const jump = contact.previous.distanceTo(contact.target);
      const allowed = 2.7 * Math.min(step, .05);
      if (jump > allowed) contact.target.lerpVectors(
        contact.previous, contact.target, allowed / jump);
    }

    // A physical two-link arm cannot extend farther than upper + forearm.
    const upper = contact.start.distanceTo(contact.elbow);
    const forearm = contact.elbow.distanceTo(contact.hand);
    contact.axis.subVectors(contact.target, contact.start);
    const length = contact.axis.length();
    if (length < .00001) continue;
    const distance = Math.max(Math.abs(upper - forearm) + .0005,
      Math.min((upper + forearm) * .985, length));
    contact.axis.multiplyScalar(1 / length);
    contact.target.copy(contact.start).addScaledVector(contact.axis, distance);
    contact.bend.subVectors(contact.elbow, contact.start);
    contact.bend.addScaledVector(contact.axis, -contact.bend.dot(contact.axis));
    if (contact.bend.lengthSq() < 1e-7) {
      contact.bend.set(chain.side === "L" ? -1 : 1, 0, .25)
        .transformDirection(contact.root.matrixWorld);
      contact.bend.addScaledVector(contact.axis, -contact.bend.dot(contact.axis));
    }
    const along = (upper * upper - forearm * forearm + distance * distance) / (2 * distance);
    const height = Math.sqrt(Math.max(0, upper * upper - along * along));
    contact.middle.copy(contact.start)
      .addScaledVector(contact.axis, along)
      .addScaledVector(contact.bend.normalize(), height);

    // The regular grab solver is disabled for signature grabs; save the
    // unmodified bone rotations for GrabContact.restore() on the next frame.
    // Otherwise this IK would accumulate its own changes frame after frame.
    for (const joint of [chain.arm, chain.elbow, chain.hand]) {
      if (!contact.saved.has(joint)) contact.saved.set(joint, joint.quaternion.clone());
    }
    contact.aim(chain.arm, contact.start, contact.elbow, contact.middle);
    chain.elbow.getWorldPosition(contact.elbow);
    chain.hand.getWorldPosition(contact.hand);
    contact.aim(chain.elbow, contact.elbow, contact.hand, contact.target);
    // The pose profile already authors Hand_L/Hand_R. Only solve arm and
    // elbow positions; never apply a second world-space wrist correction.
    // A child hand follows its articulated elbow naturally, and its own
    // local rotation stays stable instead of flipping under two competing
    // orientation constraints.
    chain.hand.updateWorldMatrix(false, true);
    chain.hand.getWorldPosition(chain.previous);
    contact.root.worldToLocal(chain.previous);
    chain.valid = true;
    applied++;
  }
  if (applied && typeof window !== "undefined" &&
      (window.__steez8GrabDebugEnabled || new URLSearchParams(window.location.search).has("grabDebug"))) {
    const names = ["Torso", "Leg_L", "Leg_R", "Knee_L", "Knee_R", "Foot_L", "Foot_R", "Arm_L", "Arm_R"];
    window.__steez8SignaturePose = {
      id: style, name: profile.name, activeGrips: applied, stage: "wrist-IK",
      joints: Object.fromEntries(names.map(name =>
        [name, contact.root.getObjectByName(name)?.quaternion.toArray().map(v => +v.toFixed(4)) ?? null])),
    };
  }
  return applied > 0;
}

/**
 * Keep the pole shafts pointing down and behind the rider during a signature
 * grab. The original pole grip assumes hands remain at their skiing sockets;
 * hand IK moves those sockets dramatically and otherwise swings the shafts
 * across the chest. Pole_L/R use local -Y as the shaft direction.
 *
 * This changes only the pole-bone rotation, never the rider's hand IK,
 * geometry, input log, or ski physics. Existing PoleGrip.restore() resets
 * the original pole rotations at the beginning of the next frame.
 */
export function stabilizeSignaturePoles(controller, style, strength) {
  if (!isSignatureGrab(style) || controller?.board || !(strength > .001)) return false;
  const fade = smooth(Math.min(1, strength * 2));
  const rootRotation = controller.root.getWorldQuaternion(controller.switchRoot);
  let adjusted = 0;
  for (const side of ["L", "R"]) {
    const pole = controller.bones[`Pole_${side}`];
    if (!pole?.parent) continue;
    pole.parent.getWorldQuaternion(controller.switchParent);
    pole.getWorldQuaternion(controller.swapClip);
    controller.gazeFace.set(0, -1, 0).applyQuaternion(controller.swapClip).normalize();
    controller.gazeTarget.set(side === "L" ? -.22 : .22, -1, -.38)
      .normalize().applyQuaternion(rootRotation);
    controller.delta.setFromUnitVectors(controller.gazeFace, controller.gazeTarget);
    // Identity to the original pole orientation at grab fade-in/out.
    controller.delta.slerp(controller.swapTurn.identity(), 1 - fade);
    controller.swapClip.copy(controller.switchParent).invert();
    controller.delta.premultiply(controller.swapClip).multiply(controller.switchParent);
    pole.quaternion.premultiply(controller.delta).normalize();
    adjusted++;
  }
  if (adjusted && typeof window !== "undefined" &&
      (window.__steez8GrabDebugEnabled || new URLSearchParams(window.location.search).has("grabDebug")) &&
      window.__steez8SignaturePose?.id === style) {
    const sample = window.__steez8SignaturePose;
    for (const boneName of ["Elbow_L", "Elbow_R", "Hand_L", "Hand_R", "Pole_L", "Pole_R"]) {
      sample.joints[boneName] = controller.bones[boneName]?.quaternion?.toArray()
        .map(v => +v.toFixed(4)) ?? null;
    }
    sample.poleAlignment = {};
    for (const side of ["L", "R"]) {
      const pole = controller.bones[`Pole_${side}`];
      if (!pole) continue;
      pole.getWorldQuaternion(controller.swapClip);
      controller.gazeFace.set(0, -1, 0).applyQuaternion(controller.swapClip).normalize();
      controller.gazeTarget.set(side === "L" ? -.22 : .22, -1, -.38)
        .normalize().applyQuaternion(rootRotation);
      sample.poleAlignment[side] = +controller.gazeFace.dot(controller.gazeTarget).toFixed(3);
    }
  }
  return adjusted > 0;
}
