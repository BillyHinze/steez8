// Traceable patch for the recovered course module. Existing parks are unchanged.
export function ridgelineCourse(source) {
  if (source.includes('const isRidgeline')) return source;
  const patch = (from, to) => { if (!source.includes(from)) throw Error('Ridgeline anchor missing: ' + from.slice(0, 60)); source = source.replace(from, to); };
  patch('var v = n(window.location?.search ?? ``)', 'const isRidgeline = new URLSearchParams(window.location?.search ?? ``).get("park") === "ridgeline";\nvar v = n(window.location?.search ?? ``)');
  patch('b = y.id === `apex`', 'b = y.id === `apex` || isRidgeline');
  patch('for (let e of og) {', `if (isRidgeline) og = [
    ag(590, 8, 'FIRST TRACKS', { width: 24, lipAngle: 24, run: 30, table: 10, landing: 95 }),
    ag(760, 10, 'BLUEBIRD', { width: 24, lipAngle: 28, run: 34, table: 12, landing: 105 }),
    ag(940, 12, 'RIDGE RUNNER', { width: 22, lipAngle: 30, run: 38, table: 14, landing: 110 }),
    ag(1130, 14, 'SKYLINE', { width: 22, lipAngle: 32, run: 42, table: 12, landing: 120 }),
    ag(1350, 10, 'HOME STRETCH', { width: 24, lipAngle: 27, run: 34, table: 10, landing: 125 }),
    ag(940, 7, 'SIDE QUEST', { offset: -34, width: 12, lipAngle: 26, run: 28, table: 12, landing: 90, kind: 'hip', transfer: 3, main: false })
  ];\nfor (let e of og) {`);
  patch('  , yg = e({', `  , ridgelineZones = isRidgeline && (vg = [[0, 'RIDGELINE / DROP IN'], [166, 'WARMUP RAILS'], [346, 'SWITCH YARD'], [530, 'FIRST TRACKS'], [700, 'BLUEBIRD'], [880, 'RIDGE RUNNER / SIDE QUEST'], [1070, 'SKYLINE'], [1290, 'HOME STRETCH'], [1500, 'RUNOUT / FINISH']])\n  , yg = e({`);
  patch('Ax = S ? `ASPEN PIPE`', 'Ax = isRidgeline ? `RIDGELINE` : S ? `ASPEN PIPE`');
  return source;
}
