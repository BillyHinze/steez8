import {n as e, r as t} from "./rolldown-runtime-C60lm6uB.js";
import {i as n, r} from "./framework-D_rUT4EX.js";
var i = t(n(), 1)
  , a = (...e) => e.filter( (e, t, n) => !!e && e.trim() !== `` && n.indexOf(e) === t).join(` `).trim()
  , o = e => e.replace(/([a-z0-9])([A-Z])/g, `$1-$2`).toLowerCase()
  , s = e => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase())
  , c = e => {
    let t = s(e);
    return t.charAt(0).toUpperCase() + t.slice(1)
}
  , l = {
    xmlns: `http://www.w3.org/2000/svg`,
    width: 24,
    height: 24,
    viewBox: `0 0 24 24`,
    fill: `none`,
    stroke: `currentColor`,
    strokeWidth: 2,
    strokeLinecap: `round`,
    strokeLinejoin: `round`
}
  , u = e => {
    for (let t in e)
        if (t.startsWith(`aria-`) || t === `role` || t === `title`)
            return !0;
    return !1
}
  , d = (0,
i.createContext)({})
  , f = () => (0,
i.useContext)(d)
  , p = (0,
i.forwardRef)( ({color: e, size: t, strokeWidth: n, absoluteStrokeWidth: r, className: o=``, children: s, iconNode: c, ...d}, p) => {
    let {size: m=24, strokeWidth: h=2, absoluteStrokeWidth: g=!1, color: _=`currentColor`, className: v=``} = f() ?? {}
      , y = r ?? g ? Number(n ?? h) * 24 / Number(t ?? m) : n ?? h;
    return (0,
    i.createElement)(`svg`, {
        ref: p,
        ...l,
        width: t ?? m ?? l.width,
        height: t ?? m ?? l.height,
        stroke: e ?? _,
        strokeWidth: y,
        className: a(`lucide`, v, o),
        ...!s && !u(d) && {
            "aria-hidden": `true`
        },
        ...d
    }, [...c.map( ([e,t]) => (0,
    i.createElement)(e, t)), ...Array.isArray(s) ? s : [s]])
}
)
  , m = (e, t) => {
    let n = (0,
    i.forwardRef)( ({className: n, ...r}, s) => (0,
    i.createElement)(p, {
        ref: s,
        iconNode: t,
        className: a(`lucide-${o(c(e))}`, `lucide-${e}`, n),
        ...r
    }));
    return n.displayName = c(e),
    n
}
  , h = m(`arrow-up-right`, [[`path`, {
    d: `M7 7h10v10`,
    key: `1tivn9`
}], [`path`, {
    d: `M7 17 17 7`,
    key: `1vkiza`
}]])
  , g = m(`film`, [[`rect`, {
    width: `18`,
    height: `18`,
    x: `3`,
    y: `3`,
    rx: `2`,
    key: `afitv7`
}], [`path`, {
    d: `M7 3v18`,
    key: `bbkbws`
}], [`path`, {
    d: `M3 7.5h4`,
    key: `zfgn84`
}], [`path`, {
    d: `M3 12h18`,
    key: `1i2n21`
}], [`path`, {
    d: `M3 16.5h4`,
    key: `1230mu`
}], [`path`, {
    d: `M17 3v18`,
    key: `in4fa5`
}], [`path`, {
    d: `M17 7.5h4`,
    key: `myr1c1`
}], [`path`, {
    d: `M17 16.5h4`,
    key: `go4c1d`
}]])
  , _ = m(`medal`, [[`path`, {
    d: `M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15`,
    key: `143lza`
}], [`path`, {
    d: `M11 12 5.12 2.2`,
    key: `qhuxz6`
}], [`path`, {
    d: `m13 12 5.88-9.8`,
    key: `hbye0f`
}], [`path`, {
    d: `M8 7h8`,
    key: `i86dvs`
}], [`circle`, {
    cx: `12`,
    cy: `17`,
    r: `5`,
    key: `qbz8iq`
}], [`path`, {
    d: `M12 18v-2h-.5`,
    key: `fawc4q`
}]])
  , v = m(`message-circle`, [[`path`, {
    d: `M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719`,
    key: `1sd12s`
}]])
  , y = m(`mountain`, [[`path`, {
    d: `m8 3 4 8 5-5 5 15H2L8 3z`,
    key: `otkl63`
}]])
  , b = m(`music`, [[`path`, {
    d: `M9 18V5l12-2v13`,
    key: `1jmyc2`
}], [`circle`, {
    cx: `6`,
    cy: `18`,
    r: `3`,
    key: `fqmcym`
}], [`circle`, {
    cx: `18`,
    cy: `16`,
    r: `3`,
    key: `1hluhg`
}]])
  , x = m(`settings`, [[`path`, {
    d: `M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,
    key: `1i5ecw`
}], [`circle`, {
    cx: `12`,
    cy: `12`,
    r: `3`,
    key: `1v7zrd`
}]])
  , S = m(`users`, [[`path`, {
    d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`,
    key: `1yyitq`
}], [`path`, {
    d: `M16 3.128a4 4 0 0 1 0 7.744`,
    key: `16gr8j`
}], [`path`, {
    d: `M22 21v-2a4 4 0 0 0-3-3.87`,
    key: `kshegd`
}], [`circle`, {
    cx: `9`,
    cy: `7`,
    r: `4`,
    key: `nufk8`
}]])
  , C = [{"id":"2026-11-03-ridgeline","label":"3 NOV · 0.5","tag":"NEW PARK","title":"Meet Ridgeline.","body":"A new progression line on the alpine ridge. Warm up in two rail zones, link five flow kickers from First Tracks to Home Stretch, then branch off to the Side Quest hip. Wider takeoffs and a smaller opening jump make room to find your rhythm. Ride solo or join a live room; complete runs count toward your goals, journal and session records.","icon":"mountain","highlights":["FIVE FLOW KICKERS + SIDE HIP","TWO WARMUP RAIL ZONES","SOLO + LIVE ROOMS","ITS OWN VERIFIED RECORDS"],"link":{"href":"/?park=ridgeline&mode=solo","label":"Ride Ridgeline"}},{"id":"2026-11-03-basecamp-connection","label":"3 NOV · 0.5","tag":"ACCOUNTS","title":"Stay connected to your mountain.","body":"Sign-in now supports a separately hosted account server. Email addresses are trimmed before sign-in and registration, connection problems have clearer explanations, and Basecamp includes a server status check with a retry button. Progress stays with your account when the permanent database is connected.","icon":"users","highlights":["CLEARER SIGN-IN ERRORS","SERVER STATUS + RETRY","HTTPS + CROSS-DOMAIN SUPPORT"]},{"id":"2026-11-03-mountain-links","label":"3 NOV · 0.5","tag":"BASECAMP POLISH","title":"Find your next session faster.","body":"Jump into Ridgeline from the park selector or the new Basecamp shortcut. The journal now has a sixth scored park stamp. Direct links to goals, sessions, updates, recovery and the journal work in the static build, so you can bookmark them and come back later.","icon":"medal","highlights":["RIDGELINE SHORTCUT","SIX SCORED PARK STAMPS","BOOKMARKABLE GAME PAGES"],"link":{"href":"/journal","label":"Open your passport"}},{"id":"2026-11-03-mountain-sessions","label":"3 NOV · 0.4","tag":"MOUNTAIN SESSIONS","title":"Eight new reasons to drop in","body":"Ranked 3v3 and 4v4 join 1v1 and 2v2 in the red ranked selector above Find Match. Riding solo? Chase Time Attack, Score Rush, Clean Line, Park Tour, Air Time and Rail Jam from Ride’s Solo Sessions button. Six solo challenges, two bigger ranked formats, one familiar Basecamp.","image":"/updates/mountain-sessions.svg","alt":"Mountain Sessions: six solo modes and ranked squads, illustrated with alpine peaks and trail lines.","highlights":["RANKED 1V1 · 2V2 · 3V3 · 4V4","SIX SOLO SESSION MODES","VERIFIED RESULTS","BUILT INTO RIDE"],"link":{"href":"/sessions","label":"Pick your session"}},{"id":"2026-11-03-ranked-squads","label":"3 NOV · 0.4","tag":"RANKED SQUADS","title":"Bring the whole crew","body":"Queue for 3v3 or 4v4 alone or with a party. Parties stay together and every rider confirms readiness before the match starts. Everyone rides one solo Apex run in the same six-minute window; verified scores combine into the team total. Each format has its own rating and leaderboard, with rating protection for a losing teammate who stayed when another rider left.","icon":"users","highlights":["SIX OR EIGHT REAL RIDERS","PARTIES STAY TOGETHER","SEPARATE RATINGS","READY CHECK + TEAM SCOREBOARD"],"link":{"href":"/squads","label":"Find your crew"}},{"id":"2026-11-03-mountain-journal","label":"3 NOV · 0.4","tag":"PROGRESSION","title":"Every lap leaves a mark","body":"Your Mountain journal remembers your verified finishes, personal bests, favourite park and days on snow. Finish a run in each of the five scored parks to stamp your passport. Six lifetime milestones award a total of 675 POW, from your first tracks to the Century Club. Previous verified runs count too.","icon":"medal","highlights":["FIVE-PARK PASSPORT","SIX LIFETIME MILESTONES","675 POW TO EARN","FILTERABLE RUN HISTORY"],"link":{"href":"/journal","label":"Open your journal"}},{"id":"2026-11-03-gear-and-goals","label":"3 NOV · 0.4","tag":"LOCKER + WEEKLY GOALS","title":"Your kit. Your week. Your mountain.","body":"Save three named outfits in the Locker and swap complete setups. Restored 180 missing equipment textures, refreshed cached rider pictures and fixed saved-outfit broadcasts to mountain riders and parties. Three weekly goals award up to 300 POW for 20 finishes, all five parks and riding on three different UTC days. Weekly goals reset Monday at 00:00 UTC.","icon":"medal","highlights":["THREE SAVED LOOKS","180 EQUIPMENT TEXTURES RESTORED","300 POW IN WEEKLY GOALS","FASTER REPEAT ASSET LOADS"],"link":{"href":"/?open=locker","label":"Open the Locker"}},{"id":"2026-11-03-session-records","label":"3 NOV · 0.4","tag":"PERSONAL BESTS","title":"Your next line has something to beat","body":"Every session saves its result. Check your best for each mode and park, browse your latest twenty attempts, or see the top twenty-five riders on the session boards. The in-game session display tracks your progress, and the Park Tour keeps your next stop ready across visits. A daily park pick gives you somewhere new to start.","icon":"mountain","highlights":["MODE AND PARK LEADERBOARDS","PERSONAL BESTS","SESSION HISTORY","DAILY PARK PICK"]},{"id":"2026-11-03-daily-goals","label":"3 NOV · 0.3","tag":"DAILY GOALS","title":"Small goals. More reasons to ride.","body":"Finish three runs, score 5,000 points and explore two parks to earn up to 100 POW a day. Claim your rewards in Menu → Daily + weekly goals. Goals reset at midnight UTC and only completed verified runs count. Cash purchases remain closed.","icon":"medal","highlights":["THREE DAILY GOALS","100 POW EACH DAY","EARNED BY RIDING"],"link":{"href":"/challenges","label":"See today’s goals"}},{
    id: `2026-11-02-party-follow`,
    label: `2 NOV`,
    tag: `PARTY`,
    title: `Your party rides with you`,
    body: `When your party leader picks a park and rides, everyone waiting in Basecamp now comes along into the same room, also right after a run, a 1v1 or a 2v2. Leaders get a PRIVATE ROOM switch in Friends: off, the party rides a public room together; on, it gets a room of its own. A ranked search no longer stops with FINISH YOUR MATCH FIRST once your match is over.`,
    icon: `mountain`,
    alt: `The park map with APEX picked for MULTIPLAYER and 2 riders live there. Under ROOMS, ROOM 1 at 2/30 is ticked and PARTY ROOM at 3/4 sits below it, over a white RIDE · PARTY FOLLOWS button. THE YARD, SHIRAKUMO, BIG AIR, FOREST LINE and ASPEN PIPE are pinned across the snowy mountain to the left.`,
    focus: `88% 55%`,
    highlights: [`THE PARTY COMES ALONG`, `PRIVATE ROOM ON OR OFF`, `RIGHT AFTER A 1V1 OR 2V2`, `NO STUCK RANKED SEARCH`]
}, {
    id: `2026-10-30-ultra-spray`,
    label: `30 OCT`,
    tag: `LOOK`,
    title: `Fine snow spray on Ultra`,
    body: `On Ultra, your skis now throw snow the way a camera films it: a sheet of tiny grains off the edge and out of the turn that stops within a metre and sinks, a few bigger grains flicked further, and a soft cloud of dust that hangs behind you and drifts on the breeze. Take-offs and landings leave a puff on the lip. Replays and other riders show it too, and riders you watch throw all their snow.`,
    icon: `mountain`,
    alt: `A skier in a black CC STEEZ8 jacket carves toward the camera on groomed corduroy in APEX, leaning into the turn, a soft white cloud of snow dust billowing off the skis and fine grains spraying out against a blue sky, kickers behind on the left.`,
    focus: `45% 40%`,
    highlights: [`TINY GRAINS OFF THE EDGE`, `DUST THAT HANGS`, `A FEW BIGGER GRAINS`, `REPLAYS AND SPECTATE TOO`]
}, {
    id: `2026-10-30-wind-up-throw`,
    label: `30 OCT`,
    tag: `TRICKS`,
    title: `Wind up and throw your spins`,
    body: `Hold SPACE on skis to load your pop: your legs spread onto their edges, your arms reach out, and A or D winds your chest up against the turn. Let go into a spin and you throw into it, arms first, your chest screwing round ahead of your hips before your legs and grab follow. Corks and bios throw the same way, and on a rail you fold over the bar as you load. Replays and other riders show it too.`,
    icon: `mountain`,
    alt: `A skier in the air off a kicker in APEX, throwing into a spin: the back of the black CC STEEZ8 jacket has turned to face the camera, arms out wide with the poles, while the skis still point across the slope below. The line of kickers and the gondola are behind under a clear blue sky.`,
    focus: `50% 40%`,
    highlights: [`HOLD SPACE TO LOAD`, `WIND UP WITH A OR D`, `THROW INTO THE SPIN`, `CORKS, BIOS AND RAILS`]
}, {
    id: `2026-10-30-forest-lines`,
    label: `30 OCT`,
    tag: `PARK`,
    title: `A rainbow gap in FOREST LINE`,
    body: `In the bend, a gap jump throws you 38 m onto a shiny rainbow rail on a tall block of snow. The cannon is gone: three blue pipes run in a row, flat and then down, on bare snow. The grove has a second bar after the bowed one, the bars by the ball stand on the snow itself, the ball and its jump sit 10 m further up, and the stair kicker is clean, with a longer flat on top.`,
    icon: `mountain`,
    alt: `Three fat blue pipes on short black legs run across a groomed slope in FOREST LINE: one level in the back, then a gap, then one bending down over the knuckle in front, tree shadows across the corduroy, a white kicker and tall pines behind.`,
    focus: `50% 45%`,
    highlights: [`GAP TO A RAINBOW RAIL`, `THREE BLUE PIPES`, `BARS ON THE SNOW`, `A NEW GROVE BAR`]
}, {
    id: `2026-10-30-live-domain`,
    label: `30 OCT`,
    tag: `MULTIPLAYER`,
    title: `Multiplayer on more networks`,
    body: `Rooms, 1v1s, 2v2s, your friends and party, the leaderboard and cup results now come from steez8-api.onrender.com, part of steez8.me. Some networks let steez8.me through but blocked the address all that came from before, so the game loaded and multiplayer never connected. If that happened to you, try again. A network that blocks steez8.me itself still blocks it: that is up to whoever runs the network.`,
    icon: `users`,
    highlights: [`LIVE.STEEZ8.COM`, `ROOMS, 1V1, 2V2, FRIENDS`, `LEADERBOARD AND CUPS`, `NOTHING TO INSTALL`]
}, {
    id: `2026-10-29-party-chat`,
    label: `29 OCT`,
    tag: `PARTY`,
    title: `Your party has a chat`,
    body: `Talk to your party wherever each of you is, in Basecamp or out riding. On a big screen the chat sits beside your party on the RIDE tab; on a phone, open it with CHAT in Friends or tap a new message. Out riding, the Pocket's chat has your party too, and party lines show over the snow. Press T to type. Same filter and reports as room chat, and only your party sees it.`,
    icon: `mountain`,
    alt: `Basecamp at night with jack-o'-lanterns in the snow. Three riders stand with their skis: OLA, KARI marked PARTY LEADER, and NORA. Beside them a Party chat panel: "party room on apex, then big air", NORA "Race you?", OLA "first to land a 1080 picks the next park" and a fire emoji, over quick chat buttons and a Message your party box.`,
    focus: `88% 50%`,
    icon: `chat`,
    highlights: [`BASECAMP AND OUT RIDING`, `PHONE TO BIG SCREEN`, `T TO TYPE`, `ONLY YOUR PARTY SEES IT`]
}, {
    id: `2026-10-27-board-butter`,
    label: `27 OCT`,
    tag: `TRICKS`,
    title: `Deep butters on a snowboard too`,
    body: `On a snowboard, tip back with S in the air, or forward with W, and land holding B: the board holds the angle you catch it at, up to 40°, and flexes evenly out to its tail or nose like a real board. Land far on your tips or tails without B, on skis or a board, and they tip onto that end and rock down instead of slapping flat. Scores are unchanged.`,
    icon: `mountain`,
    alt: `A snowboarder in a teal jacket and white goggles rides toward the camera on groomed snow, leaning back on the tail of a red board tipped up steeply, its tail curving down onto the snow, pine trees behind.`,
    focus: `45% 45%`,
    highlights: [`ON A SNOWBOARD TOO`, `HELD UP TO 40°`, `FLEXES LIKE A REAL BOARD`, `LANDINGS TIP AND ROCK`]
}, {
    id: `2026-10-27-private-2v2`,
    label: `27 OCT`,
    tag: `PARTY`,
    title: `Private 2v2 with your party`,
    body: `Got a party of four? The leader picks PRIVATE 2V2, then the map and who rides with whom, and START 2V2 takes all four in. It is not ranked. When it ends, PLAY AGAIN starts the next one, or CHANGE picks a new map and teams first. Friendly 1v1s can rematch on another map too: pick it under the result.`,
    icon: `mountain`,
    alt: `The PRIVATE 2V2 popup over a blurred Basecamp: four map tiles with FOREST LINE picked, and three team rows with the riders' faces, YOU + MAX VS ELI + IVY picked, over a DONE button.`,
    focus: `50% 45%`,
    icon: `users`,
    highlights: [`PARTY OF FOUR`, `PICK MAP AND TEAMS`, `PLAY AGAIN`, `1V1 REMATCH ON ANY MAP`]
}, {
    id: `2026-10-27-ranked-2v2`,
    label: `27 OCT`,
    tag: `RANKED`,
    title: `Ranked 2v2 is here`,
    body: `Switch RANKED to 2V2 and queue with a friend as a party of two, or alone and we find you a teammate. Everyone gets one run on APEX and the best team total wins. 2v2 has its own rating and leaderboard. If your teammate leaves, ride on: a win still counts and a loss costs nothing. Leave yourself and you lose, with a break of 5, 15, then 30 minutes. Teammates are at most 500 rating apart.`,
    icon: `mountain`,
    alt: `The 2v2 VS screen over APEX. On the left NOVA and TEO, marked YOUR TEAM, each standing with their skis; on the right JUNO and REX. RANKED 2V2 · APEX above, ONE RUN EACH · TEAM TOTAL WINS below.`,
    focus: `50% 50%`,
    highlights: [`DUO OR SOLO QUEUE`, `ITS OWN RATING`, `CLUTCH IF A TEAMMATE LEAVES`, `MAX 500 APART`]
}, {
    id: `2026-10-26-ranked-apex`,
    label: `26 OCT`,
    tag: `RANKED`,
    title: `Ranked is back on APEX`,
    body: `You told us, so FOREST LINE is out of ranked: every ranked 1v1 is on APEX again. FOREST LINE stays for 1v1s with friends. Leaving a found match before it starts still gives a short break from ranked: a minute the first time, then five, then fifteen. The rider left waiting is never punished.`,
    icon: `mountain`,
    alt: `Basecamp at night with jack-o'-lanterns in the snow. Bottom left RANKED 1V1 is picked, with a lime card below it: MATCH FOUND, GET READY, APEX · OPPONENT SHOWN AT THE START. A big cream badge on the right shows a pine tree crossed out in red.`,
    focus: `45% 65%`,
    highlights: [`RANKED ON APEX`, `FOREST LINE FOR FRIENDS`, `BREAK FOR LEAVING`]
}, {
    id: `2026-10-26-deep-butter`,
    label: `26 OCT`,
    tag: `TRICKS`,
    title: `Deep butters are back`,
    body: `Tip back with S in the air and land holding B: the tails catch at the angle you come down at, as steep as you dare, and the butter holds it there. W does the same on the tips. Sit deep into a knuckle, a bump or a roller. A butter you hop into from the side now slides down the slope instead of running dead straight. Tip too far and you still fall.`,
    icon: `mountain`,
    alt: `A skier in a teal jacket sits deep on the tails of red skis tipped almost upright at the BIG AIR start, snow spraying in front of them, under the STEEZ8 / BIG AIR banner. Cream S and B buttons sit on the right.`,
    focus: `40% 45%`,
    highlights: [`S + B IN THE AIR`, `AS STEEP AS YOU DARE`, `SLIDES DOWN THE SLOPE`]
}, {
    id: `2026-10-26-party`,
    label: `26 OCT`,
    tag: `PARTY`,
    title: `Parties of four, and a new Basecamp`,
    body: `Ride with friends as a party of up to four. INVITE a friend, or JOIN to ask into theirs. The leader picks the park and the party follows, after a heads-up to say GO or STAY, into a room of its own. Your party stands beside you in Basecamp, each holding their skis. The leader can remove someone, who then stays out for ten minutes. Basecamp is new too: your news and RIDE sit on the left.`,
    icon: `mountain`,
    alt: `Basecamp at night with jack-o'-lanterns in the snow. Four riders stand in a row in the snow, each holding their skis, with their names under their feet: KAI, MIKA, SORA and LUNA, and PARTY LEADER under MIKA.`,
    focus: `50% 60%`,
    icon: `users`,
    highlights: [`PARTIES OF FOUR`, `THE PARTY FOLLOWS ITS LEADER`, `A PARTY ROOM`, `A NEW BASECAMP`]
}, {
    id: `2026-10-26-replay-freeze`,
    label: `26 OCT`,
    tag: `REPLAYS`,
    title: `Free cam, auto edits and a freeze`,
    body: `Replays get a FREE CAM: fly anywhere with W A S D, Q and E, stop and aim it yourself, or let it track you. On a phone, drag to look and fly with two fingers. CLIP starts with AUTO EDIT: every jump and rail, cut in just before it. Cinematic freezes your best air and flies round you to your goggles, and the snow slows with the slow motion. The drone now chases you at your speed.`,
    icon: `mountain`,
    alt: `Four pictures of one Cinematic replay frozen in mid-air on APEX in falling snow: the rider seen from behind, from the side against a peak, from the front, and a close-up of their goggles.`,
    focus: `50% 50%`,
    highlights: [`FREE CAM`, `AUTO EDIT CLIPS`, `CINEMATIC FREEZE`, `CHASE DRONE`]
}, {
    id: `2026-10-25-rider-light`,
    label: `25 OCT`,
    tag: `RIDER`,
    title: `Riders in real mountain light`,
    body: `On Ultra and High, riders now mirror the mountain round them. Goggles show the sky, the horizon and the snow with a glint of the sun, as real mirror lenses do, and outfits and helmets take the light off the snow. The Locker shows it too. Performance mode now asks about a quarter less of the graphics card, for school Chromebooks, and looks the same.`,
    icon: `mountain`,
    alt: `Three STEEZ8 riders stand side by side at the top of APEX in sunshine, facing the camera. Their goggles mirror the sky and the snow: a sunset gradient lens, a blue lens and a copper one.`,
    focus: `50% 40%`,
    highlights: [`MIRROR GOGGLES`, `REAL MOUNTAIN LIGHT`, `LIGHTER PERFORMANCE MODE`]
}, {
    id: `2026-10-25-no-poles`,
    label: `25 OCT`,
    tag: `LOCKER`,
    title: `Ride without poles`,
    body: `No Poles is a new free item in the Locker, under Poles. Pick it and your rider holds no poles, just empty mittens. Everyone in your room sees it, and so do your replays, clips and the boards. Only the look changes: you ride exactly as before.`,
    icon: `mountain`,
    alt: `Three STEEZ8 riders stand at the APEX start gate in sunshine, facing the camera with empty mittens and no poles: an Ossuary tee, a Dead Press top with tartan trousers, and a black tee with sand trousers.`,
    focus: `50% 55%`,
    highlights: [`NEW FREE ITEM`, `IN ROOMS + REPLAYS`, `SAME RIDING`]
}, {
    id: `2026-10-25-full-xp`,
    label: `25 OCT`,
    tag: `FIXES`,
    title: `Full XP every day`,
    body: `Every day gives three levels of full XP again. XP earned past them was also taken off the next day, so some of you sat at 1/5 XP for days: from midnight, each day starts with 1,500 full XP. Cups now count only runs our server rode again, so a changed game can't win one. The 1v1 GoPro camera no longer jumps, and Stats shows your true ping, with LOSS.`,
    icon: `mountain`,
    alt: `The STEEZ8 Season Pass page: level 28 of 100 and a box reading 1,500 FULL XP LEFT TODAY, THEN 1/5 XP, above the free track's next rewards.`,
    focus: `50% 50%`,
    highlights: [`FULL XP EVERY DAY`, `CUP RUNS CHECKED`, `SMOOTH 1V1 GOPRO`, `TRUE PING + LOSS`]
}, {
    id: `2026-10-24-drops-grabs`,
    label: `24 OCT`,
    tag: `TRICKS`,
    title: `Drops, grabs and a smoother switch`,
    body: `SHIRAKUMO's edges and crests now throw you like real snow: a drop off a terrace's edge, a small kick off a lip. Change grabs mid-air: the last one you press wins. W or S held off a rail's kick-up flips you, as off any jump, so let go of W to ride onto the bar. And changing shoulders in switch is smooth, with no spinning wrists or poles.`,
    icon: `mountain`,
    alt: `A STEEZ8 rider in a teal jacket in the air off a terrace edge on SHIRAKUMO, over snowy spruces, with the valley and the gondola cable ahead.`,
    focus: `50% 40%`,
    highlights: [`SHIRAKUMO DROPS`, `CHANGE GRABS MID-AIR`, `FLIPS OFF RAIL KICK-UPS`, `SMOOTH SWITCH LOOK`]
}, {
    id: `2026-10-24-crowds`,
    label: `24 OCT`,
    tag: `FIXES`,
    title: `Skins show in a crowd`,
    body: `Riders right next to you could show up in plain colours, without their skins. Now the riders nearest you always show their full look: up to 8 on Performance, 12 on High and 20 on Ultra. Ultra no longer hitches every few seconds when lots of riders are out on APEX, and SHIRAKUMO rooms now take 20 riders, so the powder runs smoother.`,
    icon: `mountain`,
    alt: `A crowd of STEEZ8 riders at the start gate of APEX in sunshine, in printed outfits: a Dead Press top, plaid trousers, a skeleton jacket and a white hood.`,
    focus: `50% 55%`,
    highlights: [`SKINS IN CROWDS`, `NO ULTRA HITCH`, `POWDER ROOMS OF 20`]
}, {
    id: `2026-10-24-phone-update`,
    label: `24 OCT`,
    tag: `MOBILE`,
    title: `Better on your phone`,
    body: `More compact menus, easier typing and less graphics memory use. Phones now start in Performance mode unless you have chosen another setting. If the 3D view is interrupted, the game tries to recover with your run paused.`,
    icon: `mountain`,
    alt: `STEEZ8 PHONE UPDATE artwork with a landscape phone showing a teal-jacket skier on APEX, surrounded by snowy mountains.`,
    focus: `50% 50%`,
    highlights: [`COMPACT MENUS`, `EASIER TYPING`, `3D RECOVERY`]
}, {
    id: `2026-10-23-rider-persona`,
    label: `23 OCT`,
    tag: `LOCKER`,
    title: `Make your rider yours`,
    body: `Pick Man or Woman in the Locker, with free skin tones and hair colours. Women can choose short hair, front strands, a braid, or both. Hair fits your beanie and helmet; balaclavas can show front strands. Braids sit closer to your jacket, and head portraits match your rider. Your look stays with you in replays and multiplayer.`,
    icon: `mountain`,
    alt: `Two STEEZ8 riders: a man with dark skin and short hair in a white jacket, and a woman with blonde front strands and a braid over her teal jacket, wearing a grey beanie. YOUR RIDER lettering and skin-tone swatches sit on the left.`,
    focus: `65% 45%`,
    highlights: [`MAN OR WOMAN`, `SKIN & HAIR COLOURS`, `REPLAYS + MULTIPLAYER`]
}, {
    id: `2026-10-22-snowfall`,
    label: `22 OCT`,
    tag: `PARK`,
    title: `Snow falls on the mountain`,
    body: `It snows now. Every park gets falls that come and go at random: flurries, steady snow, heavy falls and the odd blizzard, each a few minutes long. Everyone in a park sees the same snow at the same time, solo or in a room. The fog rolls in, the light goes flat and grey, and The Yard mostly snows at night under warmer floodlights.`,
    icon: `mountain`,
    alt: `A skier in a green jacket stands in The Yard at night as snow falls, with rails and a kicker lit by warm yellow floodlights. A big cream badge with a snow cloud sits on the left.`,
    focus: `50% 55%`,
    highlights: [`SNOW THAT COMES AND GOES`, `SAME FOR EVERYONE`, `NIGHT SNOW IN THE YARD`]
}, {
    id: `2026-10-22-ranked-anonymous`,
    label: `22 OCT`,
    tag: `RANKED`,
    title: `No more dodging in ranked`,
    body: `Ranked 1v1 now starts anonymous. When a match is found you don’t see who it is or their rank until the 1v1 begins, so nobody can dodge you by reloading. No more long waits either: if your opponent leaves before the start you go straight back into the queue, and if they never come you’re searching again within 45 seconds.`,
    icon: `mountain`,
    alt: `Basecamp: a snowboarder in a lilac jacket carves through powder, and on the right RANKED 1V1 is picked with a lime MATCH FOUND card below it: GET READY · OPPONENT SHOWN AT THE START · APEX. A big cream question mark badge sits on the left.`,
    focus: `60% 70%`,
    highlights: [`NO NAMES UNTIL THE START`, `LEFT? BACK IN THE QUEUE`, `45 S WAIT AT MOST`]
}, {
    id: `2026-10-22-groomed-snow`,
    label: `22 OCT`,
    tag: `PARK`,
    title: `Fresh corduroy on Ultra`,
    body: `Ultra has new groomed snow. You ride on real corduroy: the ridges rise from the snow around you, and your skis press tracks into it that stay for up to four minutes. Other riders leave their tracks too. High and Performance keep the snow just as it was, so they run as smooth as before. Snow spray now flies from where your skis touch the snow.`,
    icon: `mountain`,
    alt: `A skier in a teal jacket carves across fresh corduroy on APEX, a smooth track curving behind the skis, with a big kicker and the lift on the right. A big cream snowflake badge sits on the left.`,
    focus: `50% 55%`,
    highlights: [`NEW SNOW ON ULTRA`, `TRACKS THAT STAY`, `HIGH AS BEFORE`]
}, {
    id: `2026-10-21-gifts`,
    label: `21 OCT`,
    tag: `SHOP`,
    title: `Gift items to your friends`,
    body: `Open anything in today’s Item Shop and tap GIFT TO A FRIEND to buy it for a friend with your POW. It goes straight to their Locker, and they see who it’s from in the lobby. 5 gifts a day, to friends you’ve had for 2 days, once your account is a week old with 20 runs. Gifts can’t be returned. Rather not get gifts? Settings → ACCOUNT → GIFTS. And the Item Shop scrolls again.`,
    icon: `mountain`,
    alt: `The GIFT card in the Item Shop: Nordlys skis for 800 POW, the friends SnowOwl, ParkRat_07 and PowderPal, who has them already, and a GIFT IT button. A big cream gift badge sits on the right.`,
    focus: `50% 50%`,
    highlights: [`GIFT TO A FRIEND`, `5 GIFTS A DAY`, `TURN GIFTS OFF IN SETTINGS`]
}, {
    id: `2026-10-21-1v1-maps`,
    label: `21 OCT`,
    tag: `1V1`,
    title: `1v1 your friends on any map`,
    body: `Challenge a friend to a 1v1 and pick the map: APEX, BIG AIR, FOREST LINE or ASPEN PIPE. FOREST LINE runs get four minutes, and a finished 1v1 run counts on that map’s leaderboard too. Watching the other rider? Press C for the new DRONE camera, which flies high behind them. You can pick Drone in replays as well.`,
    icon: `mountain`,
    alt: `A skier in a red jacket flies off a kicker in FOREST LINE, seen from a drone high behind them, with tall pines on both sides of the run. A big cream 1V1 badge sits on the right.`,
    focus: `50% 45%`,
    highlights: [`PICK THE MAP`, `RUNS COUNT ON THE BOARD`, `NEW DRONE CAMERA`]
}, {
    id: `2026-10-20-landing-butter`,
    label: `20 OCT`,
    tag: `TRICKS`,
    title: `Guess who back`,
    body: `Landing in a butter is back. Press B in the air and hold it as you land: off a bump, a roller or a small hop you land straight into a butter that keeps your spin going. Steer to spin it round. Try it off a big jump and you faceplant. Holding B on the snow still starts a butter, just like before.`,
    icon: `mountain`,
    alt: `A skier in a teal jacket flies high over the snow at the BIG AIR start, skis angled under the STEEZ8 / BIG AIR banner, with pines and a misty mountain behind. A big cream B button sits on the right.`,
    focus: `66% 40%`,
    highlights: [`B IN THE AIR`, `LAND IN A BUTTER`, `BIG JUMP = FACEPLANT`]
}, {
    id: `2026-10-20-1v1-stalls`,
    label: `20 OCT`,
    tag: `1V1`,
    icon: `users`,
    title: `1v1: no more waiting out a paused rider`,
    body: `Pausing or standing still on your run now has a limit: after 30 seconds in all, your run ends where it stands. No more stalling in the pause menu hoping the other rider leaves. Also fixed: a host on a slow connection being told YOU LEFT, and losing points when the other rider left right at the start.`,
    highlights: [`30 S TO RIDE ON`, `NO PAUSE STALLING`, `FAIRER RESULTS`]
}, {
    id: `2026-10-20-real-sounds`,
    label: `20 OCT`,
    tag: `SOUND`,
    title: `Real sounds on the mountain`,
    body: `The mountain now sounds real. Every sound is recorded in a real terrain park: the snow under your skis, the wind when you go fast, steel rails, landings, butters, crashes, the T-bar and the gondola. Rails sound faster when you are, flat landings smack, and the giant steel ball in FOREST LINE rings. Turn sounds up or down in Settings, SOUND.`,
    highlights: [`RECORDED IN A REAL PARK`, `RAILS CHANGE WITH SPEED`, `FLAT LANDINGS SMACK`],
    icon: `mountain`,
    alt: `A skier in a teal jacket slides sideways on a long blue pipe in FOREST LINE, red skis across the steel, with tall pines on both sides and white mountains ahead. A big cream speaker icon with sound waves sits on the right.`,
    focus: `62% 45%`,
    link: {
        href: `/?park=forestline`,
        label: `RIDE FOREST LINE`
    }
}, {
    id: `2026-10-20-1v1-reconnect`,
    label: `20 OCT`,
    tag: `1V1`,
    title: `Fixed: 1v1s lost to a dropped connection`,
    body: `Some of you lost 1v1s after the game said CONNECTION DROPPED, even with the higher score. That is fixed. If your connection drops, your game now gets straight back in. And if a game stops after the last run, the best run still wins.`,
    highlights: [`BACK IN AT ONCE`, `NO MORE WRONG YOU LEFT`, `BEST RUN WINS`],
    icon: `mountain`,
    alt: `The ranked 1v1 introduction over APEX: two skiers holding red STEEZ8 skis, RIDER in a teal jacket at SILVER 1,042 with 4 wins and 2 losses and SNOWBOT in a coral jacket at GOLD 1,088 with 9 wins and 3 losses, a big yellow VS between them and BEST OF 2 RUNS below, the park's kickers behind.`,
    focus: `50% 50%`
}, {
    id: `2026-10-19-1v1-counts`,
    label: `19 OCT`,
    tag: `1V1`,
    icon: `users`,
    title: `See how many ride 1v1s`,
    body: `Basecamp now counts riders in 1v1s too: Multiplayer shows how many are in friendly 1v1s, and Ranked 1v1 shows how many are playing and searching right now. 1v1s are no longer listed on the park map; watch a friend's from your friends list.`,
    highlights: [`1V1 RIDERS COUNTED`, `RANKED: PLAYING + SEARCHING`, `A CLEANER MAP`]
}, {
    id: `2026-10-19-1v1-status`,
    label: `19 OCT`,
    tag: `1V1`,
    icon: `users`,
    title: `1v1: see who has the problem`,
    body: `When something goes wrong in a 1v1, one card now says whose problem it is and when it is decided: LOST CONNECTION, GAME STOPPED or PAUSED ON YOUR RUN, with the seconds left. Clicking away from the game pauses your run, but its clock keeps running. The end screen says why the 1v1 ended.`,
    highlights: [`WHO HAS THE PROBLEM`, `WHEN IT IS DECIDED`, `WHY IT ENDED`]
}, {
    id: `2026-10-18-ranked-beta`,
    label: `18 OCT`,
    tag: `RANKED BETA`,
    title: `Ranked 1v1 is here`,
    body: `Pick RANKED 1V1 in Basecamp and press FIND MATCH to meet a rider near your level on APEX. Beating a better rider gives more points, losing to a weaker one costs more. Five ranked 1v1s place you in BRONZE, SILVER, GOLD, PLATINUM or DIAMOND. Leaving counts as a loss. Every other 1v1 is a friendly: your W/L and rank are safe. The top 25 are on the Leaderboard. The beta runs two weeks.`,
    highlights: [`FIND MATCH IN BASECAMP`, `POINTS BY OPPONENT`, `FRIENDLIES ARE SAFE`],
    icon: `mountain`,
    alt: `A snowboarder in a lilac hoodie carves through deep powder past snowy pines. On the right are the Basecamp cards: SOLO, MULTIPLAYER, and RANKED 1V1 picked at SILVER 1,042, above a white card that reads SEARCHING 0:03, 2 IN QUEUE, with a CANCEL button.`,
    focus: `82% 72%`,
    link: {
        href: `/?ranked=1`,
        label: `FIND A MATCH`
    }
}, {
    id: `2026-10-18-landings`,
    label: `18 OCT`,
    tag: `LANDINGS`,
    title: `Landings count the way they look`,
    body: `In ASPEN PIPE, skis down the wall or along the pipe now land clean, the way they look: only skis crossed against the way you go are SAVED IT. Bios and corks get the landing help spins get. A repeat only counts against your last three airs, so no more ×0.4 all the way down. Tricks keep the name they showed in the air. In every park, landing on your tails or tips stomps up to 45°.`,
    highlights: [`PIPE LANDINGS AS THEY LOOK`, `REPEATS: LAST 3 AIRS`, `TRICK NAMES STAY`],
    icon: `mountain`,
    alt: `A skier in a teal jacket comes down the wall of ASPEN PIPE just under the coping, red skis pointing down the wall and a shadow on the snow, with snowy pines and a blue sky behind.`,
    focus: `47% 40%`,
    link: {
        href: `/?park=halfpipe`,
        label: `RIDE ASPEN PIPE`
    }
}, {
    id: `2026-10-18-1v1-leavers`,
    label: `18 OCT`,
    tag: `1V1`,
    icon: `users`,
    title: `1v1: the right winner when someone drops`,
    body: `If your own connection drops in a 1v1, you now see RECONNECTING, never that the other rider left. Only the server decides who left, so a rider who comes back in time is never given the win or the loss by mistake. If the other rider's game stops, you see NOT RESPONDING and the seconds until the 1v1 is yours: stay, and it is.`,
    highlights: [`RECONNECTING, NOT "LEFT"`, `THE SERVER DECIDES WHO LEFT`, `NO FROZEN 0:00`]
}, {
    id: `2026-10-18-season-02`,
    label: `17 OCT`,
    tag: `SEASON 02`,
    pinned: !0,
    title: `Season 02 is here`,
    body: `Season 02 runs until 18 November on fresh boards for THE YARD, APEX and BIG AIR, and the top ten on each win POW: 2,500, 1,500, 750, then 250 to tenth. Points are three times bigger and rails pay more. Snowboards are for everyone: pick SNOWBOARD in your Locker. Season Pass 02 has 100 levels for 1,500 POW and gives 1,500 back.`,
    highlights: [`TOP 10 WIN POW`, `SNOWBOARDS FOR EVERYONE`, `SEASON PASS 02`],
    icon: `mountain`,
    alt: `A snowboarder in a teal jacket flies high over APEX in a method grab, the red board pulled up behind and the free arm raised, above the big kicker and the lift line, with a wide blue sky around.`,
    focus: `66% 20%`,
    link: {
        href: `/?park=nordryggen`,
        label: `RIDE SEASON 02`
    }
}, {
    id: `2026-10-18-pass-pace`,
    label: `17 OCT`,
    tag: `SEASON PASS`,
    icon: `medal`,
    title: `Season Pass: 3 levels a day`,
    body: `Season Pass 02 went too fast on its first evening, and then hit a wall. Now every day gives you 3 levels of full XP, and a day you miss waits for you. Past that, runs still give 1/5 XP, so there is no wall. Runs give half the XP they did, and the levels you have stay yours. Ride every day and you reach level 100 on the last day.`,
    highlights: [`3 LEVELS A DAY`, `MISSED DAYS WAIT`, `NO WALL`]
}, {
    id: `2026-10-18-basecamp-shop`,
    label: `17 OCT`,
    tag: `BASECAMP`,
    title: `A fresh Basecamp and Item Shop`,
    body: `Basecamp is fresh: music in the lobby (the Pocket is a button up top), friends beside POW, your pass tier above the news, a bigger rider and a winter picture, and RIDE is back on sideways phones. The Item Shop has new sets (Haze, Ridge, Cobalt), the Storm Shell and the first snowboards. Bubble, Pro Model, Chrome and the Cream Beanie stay Season 01’s: earned one? It’s yours.`,
    highlights: [`NEW SETS + SNOWBOARDS`, `MUSIC IN THE LOBBY`, `SEASON 01 HELMETS ARE YOURS`],
    icon: `mountain`,
    alt: `The new Basecamp: on the left the SEASON PASS card at tier 1 of 100, the NEW card SEASON 02 IS HERE with a snowboarder in the air, and the orange RACE FOR THE TOP 10 card; in the middle a rider in a teal jacket stands beside red STEEZ8 skis on a LIFT PASS; on the right a snowboarder in a lilac hoodie carves through a snowy forest above the SOLO, MULTIPLAYER and RIDE buttons`,
    focus: `45% 50%`
}, {
    id: `2026-10-18-aspen-pipe`,
    label: `17 OCT`,
    tag: `NEW PARK`,
    icon: `mountain`,
    title: `ASPEN PIPE: a forest superpipe`,
    body: `A new park on the map: ASPEN PIPE, a 600 m superpipe through the forest with 10.5 m walls. Ride it solo or with others in multiplayer. Go wall to wall: your landings keep their speed, so every good hit sends you higher. Hold W or S off the lip with a spin for a bio or a cork. No board yet, just the session.`,
    highlights: [`NEW 600 M SUPERPIPE`, `SOLO + MULTIPLAYER`, `BIOS AND CORKS OFF THE LIP`],
    icon: `mountain`,
    alt: `A skier in a teal jacket flies high over the coping of ASPEN PIPE in a mute grab with crossed red skis, above snowy pines, the blue fence and a lift tower on the deck, misty mountains and a hazy sun behind, and snow spraying off the pipe wall below.`,
    focus: `54% 37%`,
    link: {
        href: `/?park=halfpipe`,
        label: `RIDE ASPEN PIPE`
    }
}, {
    id: `2026-10-18-forest-line`,
    label: `17 OCT`,
    tag: `PARK UPDATE`,
    title: `FOREST LINE, twice as long`,
    body: `FOREST LINE now runs 3.84 km, more than twice as far. Below the old finish waits a new mountain: a big hit off a knoll, two gap jumps side by side, a blue cannon that points at the sky and three twin jumps to a new finish. The start drops in steps now, with the rails bending down each one. Your best starts fresh, and old replays still play.`,
    highlights: [`3.84 KM`, `BIG HIT + GAP JUMPS`, `STEPPED START`],
    icon: `mountain`,
    focus: `50% 45%`,
    alt: `A rider in a teal jacket crosses the skis in a grab high in the air off FOREST LINE’s big hit, pines on the left, and on the right the new lower mountain falls away through the forest to the valley and the snowy peaks`,
    link: {
        href: `/?park=forestline`,
        label: `RIDE FOREST LINE`
    }
}, {
    id: `2026-10-15-season-01-prizes`,
    label: `15 OCT`,
    tag: `SEASON`,
    title: `Top 10 win POW in Season 01`,
    body: `Season 01 ends on Saturday 17 October at midnight Norway time. Then the top ten on THE YARD, APEX and BIG AIR win POW: 2,500 for first, 1,500 for second, 750 for third, 250 for fourth to tenth. Top ten on two boards? You win on both. THE YARD’s top three also win mythic helmets. Season Pass 01 buyers below tier 30 get the rest of its paid track. Season 02 starts on Sunday 18 October.`,
    highlights: [`LAST DAY SAT 17 OCT`, `TOP 10 WIN POW`, `ALL THREE BOARDS`],
    icon: `mountain`,
    alt: `The SEASON 01 leaderboard, ENDS 17 OCT · TOP 10 WIN: MIKA first with 320,000 points and the Ink Melt helmet plus 2,500 POW, SORA second with Sticker Club plus 1,500 POW, KAI third with Sticker Bomb plus 750 POW; a rider flies over blue sky and snowy peaks to the right`,
    focus: `28% 50%`,
    link: {
        href: `/?park=nordryggen`,
        label: `RIDE THE YARD`
    }
}, {
    id: `2026-10-13-smooth-riders`,
    label: `13 OCT`,
    tag: `MULTIPLAYER`,
    title: `Smooth riders up close`,
    body: `Riders close to you could stutter, even when riders further away looked smooth. Found and fixed: everyone near you now moves as smoothly as the rest. Takeoffs and landings show at the exact moment they happen, live and in your replays, and a rider who pauses stops right where they are instead of sliding on.`,
    highlights: [`SMOOTH UP CLOSE`, `LANDINGS ON TIME`, `REPLAYS TOO`],
    icon: `mountain`,
    alt: `Thirteen riders carve down APEX together, each with a name above: SORA in a cream jacket carves in front, ELLI grabs a ski in the air behind him, MIKA in red sprays snow on the right, KAI and JUNO on the left; gondola cabins on their cable and a lift tower on the hill behind, white peaks and a blue sky`,
    focus: `50% 40%`,
    link: {
        href: `/?park=apex&mode=live`,
        label: `RIDE MULTIPLAYER`
    }
}, {
    id: `2026-10-12-clean-chat`,
    label: `12 OCT`,
    tag: `SAFETY`,
    title: `Hate words are out`,
    body: `You told us some riders kept slipping slurs into chat and names. The filter now reads a word the way you see it, so swapped letters, symbols, look-alike letters or a word split in two no longer get through. A line with a hate word reaches nobody, and a second one pauses that rider’s chat for 15 minutes. Names with slurs have been changed. Still see something? Report it from the chat.`,
    highlights: [`HATE WORDS BLOCKED`, `15-MIN CHAT PAUSE`, `NAMES CLEANED`],
    icon: `mountain`,
    alt: `The room chat on APEX: SORA says Sick line! and race you to the bottom, and under it the game tells the rider who tried a hate word: That word isn’t allowed here. Nobody saw that message. A rider in a teal jacket rides toward the kickers, SORA far ahead`,
    focus: `20% 30%`
}, {
    id: `2026-10-12-rooms`,
    label: `12 OCT`,
    tag: `MULTIPLAYER`,
    title: `Rooms: always a seat, invite friends`,
    body: `Multiplayer opens new rooms by itself now: when a room has 20 riders (14 on BIG AIR), the next one opens, so there is always a seat. Every room has a number. Pick one on the park map, and see which room your friends are in. Riding live, tap INVITE in Friends to bring a friend to your room. A room you pick, a friend you join or an invite still gets you in until the room is full.`,
    highlights: [`ALWAYS A SEAT`, `PICK YOUR ROOM`, `INVITE FRIENDS`],
    icon: `mountain`,
    alt: `The park map in Multiplayer: under ROOMS, ROOM 1 with 22 of 30 riders, ROOM 2 with 13 of 30 picked with a tick, and ROOM 3 with 4 of 30, above a big RIDE ROOM 2 button; snowy slopes and pine trees to the left`,
    focus: `75% 50%`,
    link: {
        href: `/?park=apex&mode=live`,
        label: `RIDE MULTIPLAYER`
    }
}, {
    id: `2026-10-11-1v1-highlights`,
    label: `11 OCT`,
    tag: `1V1`,
    title: `1v1 highlights: both runs together`,
    body: `1v1s now end with highlights: your best run with your rival’s best beside you, both leaving the gate at the same moment. Watch them on the result screen or save them; your last five wait under Replays, 1V1 HIGHLIGHTS. You can save your own runs too. Drops are quicker, with 3-2-1 on the rider card, and challenges pop up one at a time, only in the APEX and BIG AIR rooms where 1v1s are ridden.`,
    highlights: [`BOTH RUNS TOGETHER`, `SAVE YOUR RUNS`, `QUICKER DROPS`],
    icon: `mountain`,
    alt: `A 1v1’s highlights on APEX: two riders in the air side by side off the STEEZ EIGHT kicker, MIKA in a teal jacket grabbing red skis and SORA in a red jacket, the name SORA above, the gondola and its towers on the hill behind and the kicker’s landing to the right`,
    focus: `45% 40%`,
    link: {
        href: `/?park=apex&mode=live`,
        label: `CHALLENGE ON APEX`
    }
}, {
    id: `2026-10-10-shirakumo-rebuilt`,
    label: `10 OCT`,
    tag: `MAP UPDATE`,
    title: `SHIRAKUMO, rebuilt`,
    body: `SHIRAKUMO has a new shape. A groomed piste zigzags down the whole mountain, as fast as APEX, with deep powder on both sides, three steep runs off its turns and black rock walls to drop from. Between its turns, eight narrow forest trails wind through the spruces, with medium powder kickers to fly off. Your SHIRAKUMO best starts fresh, and replays from the old mountain no longer play.`,
    highlights: [`PISTE AT APEX SPEED`, `8 FOREST TRAILS`, `POWDER KICKERS`],
    icon: `mountain`,
    alt: `A rider in a teal jacket flies off a forest trail kicker in SHIRAKUMO in a Japan grab, the red skis crossed below; snow-laden spruces and the ropeway cabin on its cable to the right, white peaks and a blue sky with a few clouds behind`,
    focus: `50% 40%`,
    link: {
        href: `/?park=shirakumo`,
        label: `RIDE SHIRAKUMO`
    }
}, {
    id: `2026-10-09-clip-sizes`,
    label: `9 OCT`,
    tag: `REPLAYS`,
    title: `Forest clips shrunk to size`,
    body: `Replay clips from the forest parks came out far bigger than the size on the clip card: in the trees, a 16-second FOREST LINE clip was 30 MB. Now every clip stays at about the size on the card, on every park and graphics setting: that clip is 11 MB, and 30 seconds is around 21 MB. The open parks look exactly as before; in thick forest the finest detail is a touch softer.`,
    highlights: [`SIZE AS ON THE CARD`, `30 MB → 11 MB`, `EVERY PARK`],
    icon: `mountain`,
    alt: `One frame of a FOREST LINE replay clip split down the middle, a rider in a teal jacket standing among tall pine trunks: the left half from the old 30 MB clip, the right half from the new 11 MB clip, the picture continuing across the line`,
    focus: `50% 40%`
}, {
    id: `2026-10-09-forest-line-together`,
    label: `9 OCT`,
    tag: `MULTIPLAYER`,
    title: `Ride FOREST LINE together`,
    body: `FOREST LINE is open for multiplayer. Pick it on the park map and choose Multiplayer to ride the rail park with up to 30 riders on its own mountain. Solo is still there, and the map shows how many ride each way. It is still early access, so the line keeps changing with your feedback.`,
    highlights: [`UP TO 30 RIDERS`, `SOLO OR TOGETHER`, `EARLY ACCESS`],
    icon: `mountain`,
    alt: `Six riders ski toward the STEEZ8 / FOREST LINE start gate between pine trees, the names MIKA, KAI and SORA above the nearest three`,
    focus: `50% 40%`,
    link: {
        href: `/?park=forestline&mode=live`,
        label: `RIDE FOREST LINE`
    }
}, {
    id: `2026-10-09-forest-line`,
    label: `9 OCT`,
    tag: `NEW MAP · EARLY ACCESS`,
    title: `FOREST LINE — new map`,
    body: `A brand-new map, out now in early access: FOREST LINE, a 1.8 km rail park cut through the pines. Pop onto bars from gentle ramps, slide a snake into a double, ride the stair handrail, tap the giant black ball and send five jumps down to the STEEZ8 finish. Early access means we keep shaping the line with your feedback. Pick FOREST LINE on the park map.`,
    highlights: [`NEW MAP`, `EARLY ACCESS`, `7 RAIL ZONES · 5 JUMPS`],
    icon: `mountain`,
    alt: `A rider in a teal jacket slides the wavy snake rail sideways in a pine forest, red skis across the bar; behind, the line climbs to two rails on snow plateaus and a giant black ball on top of the hill`,
    focus: `35% 45%`,
    link: {
        href: `/?park=forestline`,
        label: `PLAY FOREST LINE`
    }
}, {
    id: `2026-10-08-smaller-clips`,
    label: `8 OCT`,
    tag: `REPLAYS`,
    title: `Replay clips a third smaller`,
    body: `Downloaded replay clips are now about a third smaller, with the same picture: a 16-second clip that was 17 MB is now around 11 MB, and a whole run shrinks the same way. That means less waiting and less space on your phone when you send them to friends. Browsers that cannot make the smaller kind keep saving clips as before.`,
    highlights: [`ABOUT 1/3 SMALLER`, `SAME PICTURE`, `EASIER TO SHARE`],
    icon: `mountain`,
    alt: `One frame of a replay clip split down the middle: the left half from the old 17 MB clip, the right half from the new 11 MB clip, a rider landing STOMPED 900 JAPAN on golden snow, the same on both sides of the line`,
    focus: `50% 40%`
}, {
    id: `2026-10-08-full-rooms`,
    label: `8 OCT`,
    tag: `PERFORMANCE`,
    title: `Less lag in full rooms`,
    body: `You told us full rooms lag, so we rebuilt how the game draws other riders. A busy room now runs up to 40% more frames per second on a school Chromebook, and long sessions no longer get heavier as riders come and go. Riders further away wear their own outfits instead of a standard look, and riders near you keep their names. Replays run smoother too.`,
    highlights: [`UP TO 40% MORE FPS`, `OWN OUTFITS FROM AFAR`, `LIGHTER LONG SESSIONS`],
    icon: `mountain`,
    alt: `Thirty riders in different jacket and pants colours stand in rows at the top of APEX below the GOOD LINES ONLY gate, each with a name above: FILIP, LIV, OSKAR, ASTRID and VILDE in front, more riders and a gondola cabin behind them`,
    focus: `50% 60%`
}, {
    id: `2026-10-08-butter`,
    label: `8 OCT`,
    tag: `NEW TRICK`,
    title: `BUTTER. Load it. Spin it. Pop out.`,
    body: `Hop in and hold B before your skis touch snow. W tips the nose down; S tips the tails down. A/D turns the loaded press, and releasing B lets the skis rebound. Carry your spin into it: the turn eases past 180 with your momentum. A press lasts up to 1.5 seconds, then needs a 1-second cooldown and a fresh B press. Snow only, not rails. Saved replays and other riders see the flex too.`,
    highlights: [`NOSE + TAIL`, `REAL SKI FLEX`, `REPLAYS + MULTIPLAYER`],
    icon: `mountain`,
    alt: `Actual STEEZ8 replay poses side by side: a rider folds over the flexed tips in a nose butter, and sits back over the flexed tails in a tail butter. Hold B before touchdown, W/S for nose/tail and A/D to turn.`
}, {
    id: `2026-10-08-restart-two-seconds`,
    label: `8 OCT`,
    tag: `RIDER`,
    title: `Restart in 2 seconds`,
    body: `Hold R (or your restart button) for 2 seconds instead of 3 to start the run again from the top. The ring counts it down.`,
    icon: `mountain`,
    alt: `A rider seen from behind at the top of The Yard holds R: the restart ring by the skis shows 2, over the words HOLD R RESTART FROM THE TOP`,
    focus: `50% 85%`
}, {
    id: `2026-10-07-big-air-board`,
    label: `7 OCT`,
    tag: `LEADERBOARD`,
    title: `BIG AIR HAS A LEADERBOARD`,
    body: `Your best Big Air run now counts on a board of its own, open until 31 October. Finish a run signed in, solo or in a 1v1, and it goes up. Every run is ridden again on our server before it counts, so no one can fake a score. Open Leaderboard and pick BIG AIR.`,
    highlights: [`OWN BOARD`, `ENDS 31 OCT`, `WATCH THE TOP 10`],
    icon: `mountain`,
    alt: `The BIG AIR leaderboard in Basecamp: MIKA first with 168,420, SORA second with 151,980 and JUNO third with 143,305 on gold, silver and bronze cards with WATCH buttons, KAI fourth, and a rider in a red jacket flying high beside it`,
    focus: `0% 50%`,
    link: {
        href: `/?park=bigair`,
        label: `PLAY BIG AIR`
    }
}, {
    id: `2026-10-07-mute-grab`,
    label: `7 OCT`,
    tag: `TRICKS`,
    title: `A new mute grab`,
    body: `The mute grab is new, the way the pros hold it: your right hand reaches across to your left ski, the skis cross in an X and your chest turns into the grab while your free arm follows. Your pole points out from your hand, and your pants keep to your legs all the way into the grab and out of it.`,
    icon: `mountain`,
    alt: `Seen from below against a cloudy sky, a rider in a teal jacket and dark pants holds the new mute grab: the right hand on the red left ski in front of the boot, both STEEZ8 skis crossed in an X, a pole pointing out to each side, a snowy slope behind`,
    focus: `47% 35%`
}, {
    id: `2026-10-07-friends-chat-fixes`,
    label: `7 OCT`,
    tag: `FIXES`,
    title: `Friends fixed. Cleaner chat.`,
    body: `Find friends as you type, send requests and see who is online without refreshing. See where your friends are and watch the same 1v1 as them. In-game chat shows recent messages, lets you scroll back and fades when quiet. Apex no longer lets you pole back uphill to repeat jumps; normal recovery pushes still work.`,
    highlights: [`LIVE FRIENDS`, `CLEANER CHAT`, `FAIRER RUNS`],
    icon: `mountain`,
    alt: `The STEEZ8 Friends panel showing online riders, friend requests, and buttons to join a mountain or watch a 1v1`
}, {
    id: `2026-10-07-jump-collision`,
    label: `7 OCT`,
    tag: `BUG FIX`,
    title: `No more ghosting through jumps`,
    body: `Popping early now makes proper contact with the ramp instead of sending you through the jump lip. Fixed in The Yard, Apex and Big Air.`,
    icon: `mountain`
}, {
    id: `2026-10-06-big-air-1v1`,
    label: `6 OCT`,
    tag: `NEW · 1V1`,
    title: `BIG AIR 1V1 IS HERE`,
    body: `One massive jump. Someone to beat. Challenge the room in Big Air Multiplayer and throw down while your rival watches live. Your wins and losses count toward the same 1v1 record as Apex. Find live battles on the map or through Friends, watch the next drop, then run it back with a rematch. Open Big Air Multiplayer and hit 1V1 to send your challenge.`,
    highlights: [`2 RIDERS`, `2 RUNS EACH`, `BEST SCORE WINS`],
    icon: `mountain`,
    alt: `Two STEEZ8 riders in teal and red face off beside a yellow VS, with the massive Big Air jump and forest behind them`,
    link: {
        href: `/?park=bigair&mode=live`,
        label: `PLAY BIG AIR`
    }
}, {
    id: `2026-10-06-big-air`,
    label: `6 OCT`,
    tag: `NEW MAP`,
    title: `BIG AIR — new map`,
    body: `One massive jump, built for distance. Tuck down the steep forest inrun, pop from the sharp lip and send it over the wide knuckle into a long landing. Tall pines, sunrise peaks and blue event fences frame the line. Brake into the finish plaza, then take the T-bar back up. Pick BIG AIR on the park map to ride solo, save replays and chase local records. No leaderboard.`,
    icon: `mountain`,
    alt: `A rider in a teal jacket stands on the snow beside the towering BIG AIR kicker, showing its scale, with tall pine trees and blue event fences around the jump`
}, {
    id: `2026-10-06-friends`,
    label: `6 OCT`,
    tag: `FRIENDS`,
    title: `Friends: see where they ride`,
    body: `Add friends from the new button at the top right of Basecamp, or tap a rider in the Pocket on a live mountain or in a 1v1. Once they say yes, you see who is online and where: in Basecamp, riding a park, live, or in a 1v1. Challenge a friend to a 1v1 straight from Basecamp, join them on their mountain, or watch their 1v1. Friends need a free account, and only your friends see where you are.`,
    icon: `mountain`,
    alt: `The FRIENDS card over Basecamp: a friend request from FRESHPOW with ACCEPT; four friends online, JUNO in Basecamp, KAI riding SHIRAKUMO, MIKA live on APEX with 1V1 and JOIN, SORA in a 1v1 against NOVA with WATCH; and TOBI offline`
}, {
    id: `2026-10-05-stiff-boots`,
    label: `5 OCT`,
    tag: `RAILS`,
    title: `Stiff boots in the press`,
    body: `Real ski boots are stiff, and now yours are too. Press on a rail and your shins tip with your boots instead of bending at the ankle: the leading leg straightens over its tail, the trailing knee bends deeper and your hips twist into the press. Your pants hang straight through every press, with no folds over the boots. Other riders and replays see it too. In The Yard and APEX.`,
    icon: `mountain`,
    alt: `Before and after: a rider in a teal jacket and red pants presses on STREETBAR in APEX, the red skis crossed in an X. Before, the body stands straight up and the pants fold over the boots; after, the hips twist into the press and the back knee bends forward`,
    focus: `75% 50%`
}, {
    id: `2026-10-05-trick-fix`,
    label: `5 OCT`,
    tag: `TRICKS`,
    title: `Every flip counts once`,
    body: `Rodeos and mistys with two or more flips counted every flip twice, so a quick tumble read 5X MISTY 3600 and beat a real triple cork. Now the number is how far you really turned, and each cork adds to it the way X Games judges see it: double, triple, quad. Runs ridden with the bug since 4 October are off the boards, and every rider who lost one got POW. Ride again!`,
    icon: `mountain`,
    alt: `A rider in a teal jacket upside down high above APEX in a cork, both red STEEZ8 skis crossed above in a tail grab, white clouds in a blue sky beside them and the snowy slope below`,
    focus: `50% 30%`
}, {
    id: `2026-10-05-rail-press`,
    label: `5 OCT`,
    tag: `RAILS`,
    title: `Cooler rails: press your skis`,
    body: `Rails look and feel more like the real thing. Hold the pop key on a rail to press: in a blink your skis tip into an X, the leading tip up and the trailing tip down, edged in on a slightly wider stance. Let go to pop off, and the press flows straight into your spin or grab. Your skis now sit right on the rail instead of floating above it. Other riders and replays see it too. In The Yard and APEX.`,
    icon: `mountain`,
    alt: `A rider in a teal jacket presses on STREETBAR in APEX, the red skis crossed in an X and resting on the black bar, with the kickers, a gondola cabin and the GOOD LINES ONLY start gate behind`
}, {
    id: `2026-10-04-faster-spins`,
    label: `4 OCT`,
    tag: `TRICKS`,
    title: `Faster spins, smoother grabs`,
    body: `Spins come round 8% faster, and a held grab speeds them up even more. Tail and Japan grabs now ride the rotation, so spins and flips stay smooth while you grab. New trick keys: hold an arrow with a spin for a flatspin, and the up arrow (no longer X) with a spin and a flip for a rodeo (S) or a misty (W). A spin with W is now called a bio.`,
    icon: `mountain`,
    alt: `A rider in a teal jacket spinning high in the air in The Yard with a tail grab, one hand holding a red ski, under a blue sky with clouds over the snowy slope`
}, {
    id: `2026-10-03-pow-packs`,
    label: `3 OCT`,
    tag: `SHOP`,
    title: `POW buys everything`,
    body: `The Item Shop has one currency now: POW. Every item costs POW, and each price shows what it is worth in money. Your POW stays as it is. Runs give XP for the Season Pass, which now costs 1,200 POW and gives more back. POW also comes in packs, paid by someone 18 or older. Bought something before today? You got POW as thanks.`,
    icon: `mountain`,
    alt: `The GET POW card over the Item Shop: three packs of POW, 600 for 29 kr, 1,200 for 59 kr and 2,600 for 119 kr, above the line that POW buys items in STEEZ8 and can’t be turned back into money`
}, {
    id: `2026-10-03-apex-duel`,
    label: `3 OCT`,
    tag: `MULTIPLAYER`,
    title: `1v1 duels on APEX`,
    body: `Press V in any multiplayer park, or tap 1V1, to challenge the room. When a rider says yes, you both go to a private APEX for a best of 2: you take turns to drop while the other watches live, and your best run counts. The final results show who won, with REMATCH, or pick your next park on the map.`,
    icon: `mountain`,
    alt: `The 1v1 start screen over APEX: MIKA in a teal jacket with red skis, a yellow VS, and SORA in a red jacket with white skis, marked CHALLENGER and ACCEPTED`
}, {
    id: `2026-10-03-apex-sunrise`,
    label: `3 OCT`,
    tag: `LOOK`,
    title: `Sunrise skies over APEX and SHIRAKUMO`,
    body: `APEX now rides in the day all the time, like SHIRAKUMO, and its big floodlight towers are gone. Both mountains wear a sunrise sky: a pink band low over the peaks ahead of you and soft peach clouds, while the snow keeps a full day’s light. The Yard still turns through its day and night, floodlights and all.`,
    icon: `mountain`,
    alt: `A rider in a teal jacket at the top of APEX in daylight, the kickers and rails ahead, under a sunrise sky with a pink band over the snowy peaks and peach clouds`,
    focus: `50% 30%`
}, {
    id: `2026-10-03-new-poles`,
    label: `3 OCT`,
    tag: `SHOP`,
    title: `Five new poles, and a grip you can see`,
    body: `Every pole now has a thicker grip that runs right through your mitten, so it shows above and below your fist. Five new pairs, after the poles top freeskiers ride: Onyx Mag, Grab Tab and Olive Groove cost POW in the Item Shop, Flip Lock is free on Season Pass tier 15 and Honeycomb waits on the pass’s tier 28. Already past tier 15? It is in your Locker.`,
    icon: `mountain`,
    alt: `Five Item Shop cards with the new poles: Onyx Mag, legendary, for 800 POW; Flip Lock, epic, free on Season Pass tier 15; Honeycomb, epic, on pass tier 28; Grab Tab and Olive Groove, rare, for 200 POW each`,
    focus: `50% 0%`
}, {
    id: `2026-10-03-camera`,
    label: `3 OCT`,
    tag: `CAMERA`,
    title: `Speed lens, trick camera, free look`,
    body: `Settings now has tabs. Under Camera the lens widens with speed (SPEED FOV), and you can set FOV, STIFFNESS, TILT and a closer distance. On big airs the trick camera pulls out so you see the whole trick and the landing. Hold the right mouse button to look around. Trees and masts between you and the camera turn see-through. In replays, GoPro follow rides close and Follow always films from behind.`,
    icon: `mountain`,
    alt: `A rider in a teal jacket high over the landing of BIG AIR in a Japan grab, one red ski pointing up, seen from the trick camera behind and above, with the park, floodlights, a gondola and snowy peaks beyond`
}, {
    id: `2026-10-03-shirakumo-together`,
    label: `3 OCT`,
    tag: `MULTIPLAYER`,
    title: `Ride SHIRAKUMO together`,
    body: `SHIRAKUMO is open for multiplayer. Pick it on the park map and choose Multiplayer to ride the powder basin with up to 30 riders on its own mountain. You see everyone sink into the deep snow as they ride and land. Landings out of a low grab also let go of the grab the moment the skis touch, so they no longer lag behind.`,
    icon: `mountain`,
    alt: `Three riders in the SHIRAKUMO powder basin, two ahead with their names Mika and Sora above them, misty mountains behind`
}, {
    id: `2026-10-02-shirakumo`,
    label: `2 OCT`,
    tag: `NEW MOUNTAIN`,
    title: `SHIRAKUMO: find your powder line`,
    body: `A new solo mountain is open on the map. Ride deep powder through gullies, snow pillows, cliff drops and a dense forest, then take the ropeway back to the summit. Your account and outfit come with you. Keep local records, race your best-run ghost and save replays alongside your park runs. This mountain has no leaderboard.`,
    icon: `mountain`
}, {
    id: `2026-10-02-rail-hops`,
    label: `2 OCT`,
    tag: `RAILS`,
    title: `Small hops on the rails`,
    body: `Pop on a rail now for a small hop: you come back down on the same rail and keep sliding. Turn in the hop for a swap, two swaps a rail, as with a press of a side. A pop from the last metres of a rail still takes you off it, into the air or onto the next feature. The hop is part of the same slide, so it adds style, not a new link. In The Yard and APEX.`,
    icon: `mountain`
}, {
    id: `2026-10-02-rail-swaps`,
    label: `2 OCT`,
    tag: `RAILS`,
    title: `Rails keep your speed, swaps lock in`,
    body: `Rails ride the way they do on the hill. A bar keeps your speed now and a down rail adds some, so you come off as fast as you went on, or faster. Press a side for a swap: your skis turn a quarter and lock there, two swaps a bar. Pop off from the end of a rail into the next feature; hopping along a rail and back onto it is gone. In The Yard and APEX.`,
    icon: `mountain`,
    alt: `A rider in a teal jacket slides the FLAT DECK rail in APEX mid-swap, skis turned across the bar, snowy mountains and the gondola behind`
}, {
    id: `2026-10-02-first-person`,
    label: `2 OCT`,
    tag: `CAMERA`,
    title: `Ride in first person`,
    body: `Open Settings and pick FIRST PERSON under Camera to ride from inside your helmet: the snow ahead, your ski tips below and your hands in every grab. Flips and spins turn the whole picture with you, and a slam keeps you in the helmet until you are up again. Replays of your first-person runs follow you from the helmet too. It is saved with your camera settings.`,
    icon: `mountain`,
    alt: `First person in the air off BIG AIR: both mittens reaching down in a grab, the red ski tips below, the landing ahead and snowy peaks and a gondola cable beyond`
}, {
    id: `2026-10-01-season-pass`,
    label: `1 OCT`,
    tag: `SHOP`,
    title: `Season Pass 01`,
    body: `Season Pass 01 runs until 31 October. Every run you finish in The Yard gives XP, and every 200 XP is a new tier. The free track is for everyone: POW on most tiers, and new bindings, skis and pants on tiers 10, 20 and 30. The paid track adds ten items, like the Spartan shells, for 59 kr. In the Item Shop, pants and bindings cost POW; jackets and skis are paid on a phone by someone 18 or older.`,
    icon: `mountain`,
    alt: `The Season Pass tab: tier 11 of 30, 100 XP to tier 12 and the end date 31 Oct, a free track of 25 POW tiles with High Back White bindings on tier 10, above the pass track with Steezy skis, High Back Teal bindings, Teal Crackle skis and the white Spartan shell`
}, {
    id: `2026-10-01-pow`,
    label: `1 OCT`,
    tag: `SHOP`,
    title: `POW: ride for it, spend it in the shop`,
    body: `Meet POW, the park’s own currency. Sign in, and every run you finish in The Yard pays POW: 10, plus 1 for every 10,000 points, up to 100 a day. Spend it on pants and bindings in the Item Shop. POW is only ever earned by riding; it can’t be bought. The shop has a new look too: every item is a tile, and a tap shows it on your rider with the rest of your outfit.`,
    icon: `mountain`,
    alt: `The new Item Shop: tiles for the Cream Beanie and three helmets with the scores that win them, a POW wallet of 1,250 in the corner and items priced in POW below, beside the blue snowflake with a P that is POW’s sign`,
    focus: `100% 50%`
}, {
    id: `2026-09-30-flat-spins`,
    label: `30 SEP`,
    tag: `TRICKS`,
    title: `Flat spins off the big kicks`,
    body: `Spins off the steep kicks no longer wobble. A 360 off BIG AIR, MOON BOOTER or LAST LIGHT used to turn round the lip’s 35-degree lean, so the rider tipped to the side halfway round. Now you stand up over your skis off the lip and spin flat, with a little lean left for the pop, and a held grab no longer keeps you crooked for the landing. Flips and corks ride as before.`,
    icon: `mountain`,
    alt: `A rider in a teal jacket halfway through a flat 360 high above The Yard, skis level and crossed in a grab, snowy peaks behind`
}, {
    id: `2026-09-30-japan-grab`,
    label: `30 SEP`,
    tag: `TRICKS`,
    title: `A relaxed Japan grab`,
    body: `The Japan grab is new and relaxed, the way the pros hold it: you stand tall in the air, your right knee bends so its ski stands up in front of you, and your right hand hangs straight down to hold your left ski behind the boot. Your free arm hangs loose at your side with its pole, and your head tips toward the grab.`,
    icon: `mountain`,
    alt: `A rider in a teal jacket high above the snow in the new Japan grab, seen from the side: chest upright, the right arm hanging straight down to the left ski behind the boot, the right knee bent with its red ski standing up in front, snowy peaks behind`
}, {
    id: `2026-09-30-smoother-yard`,
    label: `30 SEP`,
    tag: `PERFORMANCE`,
    title: `Smoother at the top of the park`,
    body: `The park now draws its signs, posts, banners, terminals and all 24 gondola cabins together instead of piece by piece. At the top of The Yard, the busiest view of the run, your computer sends the graphics card about half as much work. It looks exactly the same, but slower computers and Chromebooks keep more frames there, and APEX and night runs get lighter too.`,
    icon: `mountain`,
    alt: `The top of The Yard: a rider in a teal jacket rides down the groomed piste toward the STEEZ8 / NORDRYGGEN gate, orange nets and park signs beside it and a gondola cabin on the cable to the right`
}, {
    id: `2026-09-30-rider-look`,
    label: `30 SEP`,
    tag: `RIDER`,
    title: `A new rider look, helmet optional`,
    body: `Every rider has a new look: no face mask, bigger goggles on a wide white STEEZ8 strap and a grey knit beanie under the helmet. On the new Head page in the Locker, pick the beanie or brown short hair; a cream beanie waits in the Item Shop for a 200K run. Pick No Helmet on the Helmet page to ride in just the beanie or your hair.`,
    icon: `mountain`,
    alt: `Three riders in teal jackets: one in the black helmet with big goggles on a white STEEZ8 strap over a grey beanie, one with no helmet in the cream beanie with the strap round it, one with no helmet and short brown hair`
}, {
    id: `2026-09-30-new-look`,
    label: `30 SEP`,
    tag: `LOOK`,
    title: `A new look for the whole game`,
    body: `STEEZ8 has a new look: every title, button and number is now in one bold brush type. The trick you land shows big with its points and the bonuses behind them, then the points fly up into your score. On a computer the map sits bottom left and your speed bottom right. In Settings you now pick the graphics, High or Performance, and the frame rate: the most your screen gives, or 30.`,
    icon: `mountain`,
    alt: `A rider in a red jacket high over The Yard in a crossed-ski grab, the trick name SWITCH TRIPLE MISTY 1980 and +82,423 in white brush type beside them`,
    focus: `0% 50%`
}, {
    id: `2026-09-30-carving`,
    label: `30 SEP`,
    tag: `RIDER`,
    title: `Carving that leans into the turn`,
    body: `Carving is new. Your rider now leans into the turn from the skis’ edges, knees bent and hips low, and leans further the harder and faster you carve. Hold the tuck key through a turn for a low, compact carve with your arms tucked in front. The camera swings out to the outside of the turn so you see the carve. Replays and other riders see it just as you ride it.`,
    icon: `mountain`,
    alt: `A rider in a teal jacket carves hard to the right on groomed snow in The Yard, leaning into the turn with the knees bent, the skis on edge throwing spray, a kicker and rails behind`
}, {
    id: `2026-09-29-park-map`,
    label: `29 SEP`,
    tag: `MAP`,
    title: `A clearer park map`,
    body: `The park map now shows how many ride each park right now, live together and solo. Solo or Multiplayer is one big choice right above the ride button, the park you pick is lit and checked, and the park you are riding wears YOU ARE HERE. Change park in a run now opens the map the way you ride, APEX live included.`,
    icon: `mountain`,
    alt: `The park map: THE YARD picked with a white ring and a check, its riders live and solo on the pin and a YOU ARE HERE tag above it, beside the card where Multiplayer is chosen above KEEP RIDING THE YARD`
}, {
    id: `2026-09-29-switch-stance`,
    label: `29 SEP`,
    tag: `RIDER`,
    title: `A new switch stance`,
    body: `Riding switch now looks like it does on the hill: hips open, one foot ahead of the other, your upper body turned and your head looking back over your shoulder down the slope. Your arms hang relaxed and both poles trail behind you. Change edge and you swap shoulders. The helmet camera in replays now sees where you are going, and other riders see it all too.`,
    icon: `mountain`,
    alt: `A rider in a teal jacket rides switch toward the Nordryggen gate, seen from the follow camera: the upper body turned, the head looking back over the shoulder and both poles trailing behind`
}, {
    id: `2026-09-29-easy-corks`,
    label: `29 SEP`,
    tag: `TRICKS`,
    title: `Corks from a spin and a flip`,
    body: `Hold a spin with the back flip key into a jump for a cork, or with the front flip key for a misty: no extra key any more. Hold both from the lip, since a cork turns off axis from takeoff. The cork key now tilts a flip sideways instead, and Settings calls it Tilted flip. Replays, the leaderboard and other riders see your tricks just as you ride them.`,
    icon: `mountain`,
    alt: `A rider upside down in a cork high above the park, the red skis tipped across the sky over the snowy peaks`
}, {
    id: `2026-09-28-tail-grab`,
    label: `28 SEP`,
    tag: `TRICKS`,
    title: `A new tail grab, livelier grabs`,
    body: `The tail grab is new: your right hand holds your right ski’s tail out at your side, the knee bent, the skis crossed and your eyes on the snow. Every grab now moves with the trick: your chest and free arm follow the turn and your head looks down at the snow, not to the side. Your hand stays on the ski through spins and corks, and landing from a grab no longer jerks. In multiplayer and replays too.`,
    icon: `mountain`,
    alt: `A rider high above the snow in the new tail grab against the sky, the right hand holding the right ski’s tail behind, the skis crossed and the head bowed toward the snow`
}, {
    id: `2026-09-28-apex-stairs`,
    label: `28 SEP`,
    tag: `FIXES`,
    title: `APEX stairs ride like a slope`,
    body: `The stair set beside STAIR DOWN in APEX’s Switch Yard used to stop riders dead on its first step, or let them spin down all 72 steps as if they were still in the air. Now it rides like a slope: slide straight down it, or drop onto it and land where you drop. Runs that scored from the bug are gone from the APEX board; every other run stays.`,
    icon: `mountain`,
    alt: `A rider slides down the snowy stair line in APEX beside the black STAIR DOWN handrail, the Switch Yard’s rails behind`
}, {
    id: `2026-09-28-performance-mode`,
    label: `28 SEP`,
    tag: `PERFORMANCE`,
    title: `Smoother on slower computers`,
    body: `Performance mode is now far lighter: no shadows or reflections, nearer trees, and a resolution that drops when frames slow down. The game turns it on by itself on computers that need it and tells you, with Undo. New in Settings: a 30 fps cap for an even frame rate and a cooler laptop. If your browser draws without the graphics card, the game tells you how to fix it.`,
    icon: `settings`
}, {
    id: `2026-09-27-apex-early-access`,
    label: `27 SEP`,
    tag: `NEW PARK`,
    title: `APEX, a new park in Early Access`,
    body: `A second park is open: APEX, 1.6 km of big kickers and two rail zones. Pick it on the new park map, solo or with up to 30 riders on its own mountain. It has its own leaderboard, so APEX scores never count on Season 01. APEX is in Early Access: we are still shaping its jumps, rails and landings, and it keeps getting better with your runs. Coming soon: a slopestyle competition on APEX, with prizes.`,
    icon: `mountain`,
    alt: `A rider in a mute grab beside a big APEX kicker, the gondola line with orange cabins and a snowy peak behind`
}, {
    id: `2026-09-27-custom-controls`,
    label: `27 SEP`,
    tag: `CONTROLS`,
    title: `Your own keys and buttons`,
    body: `Open Settings and pick Controls to change any key, or any button on an Xbox or PlayStation controller: click it, then press the new one. The controller tab draws your own pad and lights each button as you press it. Signed in, your controls save to your account, so every device rides the same. Controllers can now pause, restart and skip the gondola, and Settings shows how to connect one.`,
    icon: `mountain`,
    alt: `The Controls page: a PlayStation controller with every button labelled by what it does and Cross lit, beside key and button chips for pop, tail grab, Japan grab and tuck`
}, {
    id: `2026-09-27-mac-app`,
    label: `27 SEP`,
    tag: `APP`,
    title: `Ride in your browser`,
    body: `STEEZ8 runs directly in your browser on Mac and Windows. Open steez8.me to ride; no installer is needed. Standalone STEEZ8 desktop apps have not been released.`,
    icon: `mountain`,
    alt: `The STEEZ8 app icon, a hooded rider on a white tile, above the word STEEZ8 and the Apple and Windows marks`,
    link: {
        href: `/`,
        label: `Download the app`
    }
}, {
    id: `2026-09-26-stats-overlay`,
    label: `26 SEP`,
    tag: `SETTINGS`,
    title: `Frame rate and ping on screen`,
    body: `Open Settings and pick Stats to show your frame rate and ping at the top of the screen, or a detailed panel with frame time, 1% low, network traffic, draw calls and your GPU. It is off by default and remembered on this device. On phones the panel keeps the four numbers that matter most.`,
    icon: `film`
}, {
    id: `2026-09-26-close-camera`,
    label: `26 SEP`,
    tag: `CAMERA`,
    title: `A closer camera, set your way`,
    body: `The camera now rides close and low behind you, so a kicker fills the screen and you fly against the sky. It follows you on a smooth arm through every jump and turns to the landing on the way down. Set its height, angle and distance in Settings; replays follow you the same way. On High, the snow shows its grooming lines, and the mountain no longer rises through the course’s edges.`,
    icon: `mountain`,
    alt: `The new camera close behind a rider in a teal jacket riding up to a big kicker, its lip against the sky, grooming lines down the snow`
}, {
    id: `2026-09-26-basecamp-lobby`,
    label: `26 SEP`,
    tag: `LOBBY`,
    title: `A new Basecamp lobby`,
    body: `The Ride tab is now a lobby. Your rider stands in the middle as a sticker in your own Locker outfit, with your name on a lift pass. The latest news and the season podium sit on the left; Solo, Multiplayer and RIDE wait bottom right. On big screens the Pocket moves up beside Settings, so it never covers RIDE.`,
    icon: `mountain`,
    alt: `The new Ride tab: news tiles on the left, the rider as a die-cut sticker in the middle above a lift pass, and Solo, Multiplayer and RIDE on the right`
}, {
    id: `2026-09-25-fewer-stutters`,
    label: `25 SEP`,
    tag: `FIXES`,
    title: `Fewer stutters, same looks`,
    body: `The game now prepares its graphics while it loads, so the first speed blur, the finish interview and the first rider you meet no longer freeze the screen. It skips work nobody sees, like the mountain behind the lobby. Busy multiplayer runs smoother, the Locker no longer stops the 3D view after many visits, and everything looks the same.`,
    icon: `mountain`
}, {
    id: `2026-09-25-idle-riders`,
    label: `25 SEP`,
    tag: `MULTIPLAYER`,
    title: `Room for riders who ride`,
    body: `Riders who stop playing now go back to Basecamp so their spot on the live mountain comes free: after a minute paused, two minutes without a key or button on the snow or on the results, or ten minutes in an untouched replay. A countdown warns you first. Solo is never timed, and exporting a clip is never cut short.`,
    icon: `users`
}, {
    id: `2026-09-25-settings`,
    label: `25 SEP`,
    tag: `SETTINGS`,
    title: `Settings in one place`,
    body: `The gear at the top opens Settings, in the lobby and on the mountain. Change your gamertag, see the email you signed in with, sign out, or turn on Performance mode for smoother play on slower computers (no shadows, lower resolution). The pause menu has it too. Your leaderboard and replays keep their own pages in Basecamp.`,
    icon: `settings`
}, {
    id: `2026-09-25-hold-restart`,
    label: `25 SEP`,
    tag: `RIDER`,
    title: `Hold R to start again`,
    body: `Hold R for 5 seconds on a run to start again from the top. A ring counts down; let go to cancel. The run you leave is not saved. Solo: the new run starts just like one after the gondola. Multiplayer: you stay in the room, the others see you back at the summit and your live score restarts at zero. Close the chat first, as R types there. Stuck? Reset position is in the pause menu.`,
    icon: `mountain`,
    alt: `A rider skis toward the Big Air kicker while the restart ring counts down, over the words HOLD R RESTART FROM THE TOP`
}, {
    id: `2026-09-24-season-prizes`,
    label: `24 SEP`,
    tag: `SEASON`,
    title: `Race for the podium`,
    body: `Season 01 starts with prizes. When it ends on 31 October, the top three riders win helmets: the Mythic Ink Melt for first, Sticker Club for second and Sticker Bomb for third. Only checked runs count: the server rides every run again from your inputs and scores it itself, so an edited score or a modded game cannot win. The leaderboard shows the prizes, and the scores from before live on under Beta.`,
    icon: `medal`
}, {
    id: `2026-09-24-helmet-items`,
    label: `24 SEP`,
    tag: `RIDER`,
    title: `The Item Shop is open`,
    body: `Helmets now come as items in their own colors, and the free Park helmet is matte black. One run of 75,000 points earns Bubble, 100,000 Pro Model and 150,000 mirror Chrome. Three more are only won on the season podium, with the Mythic Ink Melt for first. Try any helmet on in the new Item Shop; the Locker shows the ones you own.`,
    icon: `mountain`,
    alt: `Seven helmets side by side: Sticker Bomb, Bubble, Pro Model, Sticker Club, mirror Chrome, Ink Melt and Team STEEZ8`
}, {
    id: `2026-09-24-trick-names`,
    label: `24 SEP`,
    tag: `TRICKS`,
    title: `Tricks read what you really did`,
    body: `The trick name now counts exactly what your rider did in the air, including the last turn into the landing. A 360 is a 360 and a 720 is a 720. Flips read BACKFLIP, DOUBLE FRONTFLIP or BACKFLIP 180, even when tilted, and a flip inside a spin is a CORK 720 or MISTY 540. As at X Games, a double cork scores more than a cork, and a cork more than a flat spin.`,
    icon: `medal`
}, {
    id: `2026-09-24-connected-falls`,
    label: `24 SEP`,
    tag: `RIDER`,
    title: `A smoother fall and recovery`,
    body: `Falls keep the body together and settle into a slide: on your back after a switch landing, on your front after a forward landing. Knees, boots and trousers stay connected through the fall and a shallower get-up, with boot soles kept above the snow. Hard crashes can still release equipment. Updated in multiplayer and replays too.`,
    icon: `mountain`
}, {
    id: `2026-09-24-park-helmet`,
    label: `24 SEP`,
    tag: `RIDER`,
    title: `A new Locker and big goggles`,
    body: `Every rider wears a new park helmet with a thick moulded rim and a charcoal chin strap, plus oversized mirror goggles tucked under the brim. The new Locker opens one part at a time, shows it up close and saves with one tap. Wear the goggle strap over or under the helmet, with or without the STEEZ8 logo. In a big crash, the goggles fly off with the helmet. Updated in multiplayer and replays too.`,
    icon: `mountain`,
    alt: `Close-up of the new black park helmet with oversized silver mirror goggles and the STEEZ8 strap`,
    focus: `50% 42%`
}, {
    id: `2026-09-24-start-foundation`,
    label: `24 SEP`,
    tag: `PARK`,
    title: `A grounded park entrance`,
    body: `The start gate sits on a small, level snow platform with smooth approaches. Its banner lettering now keeps its proper proportions.`,
    icon: `mountain`
}, {
    id: `2026-09-24-rail-ski-balance`,
    label: `24 SEP`,
    tag: `RIDER`,
    title: `A little balance on rails`,
    body: `Ski tips now tilt a few degrees independently as you turn across a rail, then settle flat when pointing along it. The boots stay attached and the legs stay relaxed. The same subtle movement appears in multiplayer and replays.`,
    icon: `mountain`
}, {
    id: `2026-09-24-open-finish`,
    label: `24 SEP`,
    tag: `PARK`,
    title: `A clear finish`,
    body: `Cross the blue finish line and your run registers right away. Tall side markers replace the overhead finish gate, with a clear approach before the gondola. The park entrance has a new event gate, and an invisible terminal post that could cause a high-speed crash is gone.`,
    icon: `mountain`
}, {
    id: `2026-09-24-pole-flow`,
    label: `24 SEP`,
    tag: `RIDER`,
    title: `A smoother push`,
    body: `Poling now uses a small forward lean and a relaxed elbow curl before the arms extend through the push. Knees, trouser cuffs and boots stay quiet, including when steering. Pole grips and shafts follow the stroke smoothly. Updated in multiplayer and replays too.`,
    icon: `mountain`
}, {
    id: `2026-09-24-mountain-fixes`,
    label: `24 SEP`,
    tag: `FIXES`,
    title: `Grounded from summit to finish`,
    body: `The summit terminal sits on a flat snow pad, and black safety netting surrounds the finish. Uphill hops no longer generate landing boosts or trick points. Hard switch landings follow either shoulder with the arriving spin, including in multiplayer and replays. Interview skis face forward, sit closer to the rider and use cleaner hand and pole grips.`,
    icon: `mountain`
}, {
    id: `2026-09-23-finish-line`,
    label: `23 SEP`,
    tag: `MOUNTAIN`,
    title: `From the lift to the interview`,
    body: `New terminal buildings and turning wheels welcome you at both ends of the gondola. Ride into a fenced finish area, then face the cameras with your own skis and poles beside the run summary. GoPro follows closer at human height, looking up at jumps, drifting through turns and moving between both sides of your line.`,
    icon: `mountain`
}, {
    id: `2026-09-23-thirty-riders`,
    label: `23 SEP`,
    tag: `MULTIPLAYER`,
    title: `More friends on the mountain`,
    body: `The public mountain now welcomes 30 riders. Nearby friends keep their full look and shadows, while distant riders use a lighter model to keep busy sessions smoother. The lobby shows how many riders are online. The same detail system works in multiplayer replays.`,
    icon: `users`
}, {
    id: `2026-09-23-pocket`,
    label: `23 SEP`,
    tag: `MULTIPLAYER`,
    title: `The Pocket: music and chat`,
    body: `The music player is the Pocket now: your music, the room chat and everyone on the mountain in one device with a clean, phone-style screen. Press T to chat, send quick chats from the click wheel and tap a name to mute or report. The latest lines stay top left, and the rider list says who is on the gondola, watching a replay or between runs.`,
    icon: `chat`
}, {
    id: `2026-09-23-replay-filmer`,
    label: `23 SEP`,
    tag: `REPLAYS`,
    title: `Film your line`,
    body: `Cinematic moves closer to rails and flies smoothly between angles, with the same apex slow motion. GoPro follow adds a friend chasing your line, falling back and catching up over the terrain. Your latest five runs save automatically on this device. Supported browsers export steady 30 fps MP4 clips, starting on the first rendered frame.`,
    icon: `film`
}, {
    id: `2026-09-23-air-ready`,
    label: `23 SEP`,
    tag: `RIDER`,
    title: `Ready for the landing`,
    body: `Ski tips now sit at slightly different angles throughout a long jump and line up for touchdown. Release a spin or grab on the way down and your rider keeps the arms loosely open, ready to absorb the landing. Rails use relaxed knees and a small weight shift, keeping baggy trousers and boot cuffs clean. Updated in multiplayer and replays too.`,
    icon: `film`
}, {
    id: `2026-09-23-ski-feel`,
    label: `23 SEP`,
    tag: `RIDER`,
    title: `A little more life in the skis`,
    body: `Free skis now carry a little pitch and independent movement through the air, settling before touchdown. Landings let the skis scrub gently outward before finding their line again, with a little more give on harder hits. The same subtle motion follows you in multiplayer and replays.`,
    icon: `film`
}, {
    id: `2026-09-23-loose-spins`,
    label: `23 SEP`,
    tag: `RIDER`,
    title: `Loose spins, smoother switch landings`,
    body: `Ungrabbed spins open the arms at takeoff, then settle into a relaxed hold with steady wrists, poles trailing out to the sides and eyes toward the landing. On hard switch landings, the head follows the impact before gradually looking back over the shoulder. Updated in multiplayer and replays too.`,
    icon: `film`
}, {
    id: `2026-09-23-landing-flow`,
    label: `23 SEP`,
    tag: `RIDER`,
    title: `Carry the landing`,
    body: `Forward landings carry your arriving rotation through the chest, then the head, arms and poles. Fast spins have more follow-through, early releases settle more quietly, and tilted entries get a diagonal catch. The same motion follows your rider in multiplayer and replays.`,
    icon: `film`
}, {
    id: `2026-09-23-relaxed-carves`,
    label: `23 SEP`,
    tag: `RIDER`,
    title: `Looser turns, cleaner tuck`,
    body: `Turns now lean into the ski edges with a relaxed weight shift. Holding W while steering keeps the tuck without adding another deep squat, and the knees follow the turn so baggy trousers and boot cuffs bend more naturally.`,
    icon: `mountain`,
    alt: `The STEEZ8 rider in a baggy park jacket and trousers`
}, {
    id: `2026-09-23-rider`,
    label: `23 SEP`,
    tag: `RIDER`,
    title: `New rider, more flow`,
    body: `A fresh rider for everyone: a baggy park jacket and trousers, new helmet, goggles and mittens, plus Carbon and Signal red in the Locker. Jumps gather softly on the way up and open toward landing. Switch is looser, backflips follow through the ankles, grabs reach naturally and rail looks follow your line. Hard landings absorb quickly and recover more slowly.`,
    icon: `mountain`,
    alt: `The new STEEZ8 rider with a relaxed park jacket, black helmet, curved goggles and mittens`
}, {
    id: `2026-09-23-loading-art`,
    label: `23 SEP`,
    tag: `STYLE`,
    title: `Above the clouds`,
    body: `Four new loading scenes bring the big-air feeling before you drop in: Skybound, Party Lap, Night Flight and Cloud Nine. Baggy riders, friends sharing the sky and huge mountains, with a cleaner loading screen. Your chosen graphics setting now stays saved between visits and applies in the Locker too.`,
    image: `/onboarding/party-lap-v6-960.webp`,
    alt: `Stylized freeski riders sharing a big-air jump high above the clouds`
}, {
    id: `2026-09-23-soundtrack`,
    label: `23 SEP`,
    tag: `MUSIC`,
    title: `A new soundtrack`,
    body: `Quasarise is our main theme now, joined by eight songs picked to sit beside it: warm synthwave and chillwave from | e s c p |, KV and Lesion X. Every visit opens on a different song, and the songs are half the size they were, so they stream lightly next to a multiplayer room.`,
    icon: `music`
}, {
    id: `2026-09-23-pop-on`,
    label: `23 SEP`,
    tag: `PARK`,
    title: `Pop-on rails, easier to spot`,
    body: `Every rail stands higher, 1.7 m over the snow, and shows on the way in: flat and down bars climb up out of their lip instead of hiding behind it. Five are pop-ons now: a low kicker throws you over a gap onto a bar standing above it. The top of each lip guides you onto the bar when you are lined up. Aim away and you still ride past.`,
    icon: `mountain`,
    alt: `A low snow kicker, a gap, and a bar standing well above it on its own legs`
}, {
    id: `2026-09-23-high-rails`,
    label: `23 SEP`,
    tag: `PARK`,
    title: `Higher rails, new gondola`,
    body: `Every rail stands higher now, 1.4 m over the snow, with a longer lip to ride up onto it, and the bars are chunkier steel. The gondola has new cabins and towers. Your skis and poles are a touch wider, and you straighten up faster after a sideways landing.`,
    icon: `mountain`,
    alt: `A high twin bar and a rainbow rail standing well above the snow`
}, {
    id: `2026-09-23-rail-lips`,
    label: `23 SEP`,
    tag: `PARK`,
    title: `Rail lips you can read`,
    body: `The snow lips up to every rail are real ramps now, shaped the way you actually ride them, and painted like the big kickers: a blue line on the edge before the bar and down both sides of the ramp. The paint stays on the snow and runs through every track instead of flickering over it.`,
    icon: `mountain`,
    alt: `A snow ramp up to a rail, outlined in blue dye`
}, {
    id: `2026-09-22-crown`,
    label: `22 SEP`,
    tag: `LIVE MOUNTAIN`,
    title: `Crown, live map & scores`,
    body: `The #1 rider on the season leaderboard wears a gold crown — above their rider, in the roster and on the board. Beat their score and it moves to you. Everyone on the mountain is a dot on your map now, the roster shows each rider’s run score as it happens, and RECORD flashes when someone rides past the season best.`,
    icon: `mountain`,
    alt: `The season leader’s gold-crowned nameplate over the night park, with the live map beside it`
}, {
    id: `2026-09-21-names`,
    label: `21 SEP`,
    tag: `ACCOUNT`,
    title: `Rider names with spaces`,
    body: `Robin J. Bjørn Åsen. Names can have spaces, dashes and Nordic letters, and the name field tells you what’s wrong while you type. One rider per name: robin-j and ROBIN_J are the same person, and crude words don’t get through.`,
    image: `/onboarding/night-960.webp`,
    alt: `Nordryggen park under the lights at night`
}, {
    id: `2026-09-20-steel`,
    label: `20 SEP`,
    tag: `PARK`,
    title: `Steel rails, softer grazes`,
    body: `The rails are real steel now — slim, solid and built in Blender. Brushing a pole or a rail edge at speed no longer throws you; a fall costs what the impact was worth. Grab hands stay on the ski, and the upper body follows through spins.`,
    image: `/onboarding/air-960.webp`,
    alt: `A skier mid-air above the park`
}, {
    id: `2026-09-20-accounts`,
    label: `20 SEP`,
    tag: `MULTIPLAYER`,
    title: `Accounts on the mountain`,
    body: `Multiplayer and the Locker take a free account now, so your name and your outfit stay yours. Bails are quicker to get up from, and light falls don’t cost as much.`,
    icon: `users`
}, {
    id: `2026-09-19-tv`,
    label: `19 SEP`,
    tag: `REPLAYS`,
    title: `TV replays`,
    body: `Replays cut like a broadcast. The TV camera stands beside the gap on every big jump, so you see the whole trick against the sky instead of the side of the landing, and the edit follows the features down the park. Export the whole run or the best moment as a clip.`,
    icon: `film`
}, {
    id: `2026-09-19-judged`,
    label: `19 SEP`,
    tag: `SCORING`,
    title: `Tricks judged when they land`,
    body: `A cork is a cork and a misty is a misty: rotations count when they’re complete, and late spins score on their own. Rail-to-air chains keep their line, and rotation progression and grab variety pay visible bonuses in the readout.`,
    icon: `medal`
}, {
    id: `2026-09-16-cork7`,
    label: `16 SEP`,
    tag: `SEASON`,
    title: `Whiteout is now STEEZ8`,
    body: `New name, new season on the leaderboard, gear colors in the Locker. Powerslides steer freely, butters keep your momentum, and the hero jumps are matched to steeper terrain.`,
    image: `/onboarding/summit-960.webp`,
    alt: `The summit above the gondola`
}, {
    id: `2026-09-15-basecamp`,
    label: `15 SEP`,
    tag: `LOBBY`,
    title: `Basecamp`,
    body: `The lobby you’re standing in: pick Solo or Multiplayer, see who’s on the mountain, dress your rider in the Locker and open saved replays before you drop in.`,
    icon: `mountain`
}]
  , w = C.reduce( (e, t) => t.id.slice(0, 10) > e.id.slice(0, 10) ? t : e).id
  , T = e({
    PatchNotes: () => M
})
  , E = r()
  , D = {
    chat: v,
    film: g,
    medal: _,
    mountain: y,
    music: b,
    settings: x,
    users: S
}
  , O = 12
  , k = 24
  , A = [`JANUARY`, `FEBRUARY`, `MARCH`, `APRIL`, `MAY`, `JUNE`, `JULY`, `AUGUST`, `SEPTEMBER`, `OCTOBER`, `NOVEMBER`, `DECEMBER`]
  , j = e => {
    let t = /^(\d{4})-(\d{2})-/.exec(e.id);
    return t ? `${A[Number(t[2]) - 1]} ${t[1]}` : `EARLIER`
}
;
function M({flow: e=!1}) {
    let[t,...n] = C
      , [r,a] = (0,
    i.useState)(e ? n.length : O)
      , [o,s] = (0,
    i.useState)( () => new Set)
      , c = e => s(t => {
        let n = new Set(t);
        return n.delete(e) || n.add(e),
        n
    }
    )
      , l = [];
    for (let e of n.slice(0, r)) {
        let t = j(e)
          , n = l.at(-1);
        n?.month === t ? n.notes.push(e) : l.push({
            month: t,
            notes: [e]
        })
    }
    return (0,
    E.jsxs)(`div`, {
        className: `pn${e ? ` is-flow` : ``}`,
        children: [(0,
        E.jsxs)(`article`, {
            className: `pn-hero`,
            children: [(0,
            E.jsx)(N, {
                note: t,
                eager: !0
            }), (0,
            E.jsxs)(`div`, {
                className: `pn-copy`,
                children: [(0,
                E.jsx)(P, {
                    note: t
                }), (0,
                E.jsx)(`h2`, {
                    children: t.title
                }), (0,
                E.jsx)(F, {
                    note: t
                }), (0,
                E.jsx)(`p`, {
                    children: t.body
                }), (0,
                E.jsx)(I, {
                    note: t
                })]
            })]
        }), l.map( ({month: e, notes: t}) => (0,
        E.jsxs)(`section`, {
            className: `pn-month`,
            "aria-label": e,
            children: [(0,
            E.jsx)(`h3`, {
                children: e
            }), (0,
            E.jsx)(`div`, {
                className: `pn-grid`,
                children: t.map(e => {
                    let t = o.has(e.id)
                      , n = e.body.length > 150 || !!e.highlights?.length;
                    return (0,
                    E.jsxs)(`article`, {
                        className: `pn-card${t ? ` is-open` : ``}`,
                        children: [(0,
                        E.jsx)(N, {
                            note: e
                        }), (0,
                        E.jsxs)(`div`, {
                            className: `pn-copy`,
                            children: [(0,
                            E.jsx)(P, {
                                note: e
                            }), (0,
                            E.jsx)(`h4`, {
                                children: e.title
                            }), t && (0,
                            E.jsx)(F, {
                                note: e
                            }), (0,
                            E.jsx)(`p`, {
                                children: e.body
                            }), n && (0,
                            E.jsx)(`button`, {
                                type: `button`,
                                className: `pn-more`,
                                "aria-expanded": t,
                                onClick: () => c(e.id),
                                children: t ? `LESS` : `READ MORE`
                            }), (0,
                            E.jsx)(I, {
                                note: e
                            })]
                        })]
                    }, e.id)
                }
                )
            })]
        }, e)), r < n.length && (0,
        E.jsxs)(`button`, {
            type: `button`,
            className: `pn-older`,
            onClick: () => a(e => e + k),
            children: [`SHOW OLDER UPDATES`, (0,
            E.jsxs)(`small`, {
                children: [n.length - r, ` MORE`]
            })]
        })]
    })
}
function N({note: e, eager: t=!1}) {
    let n = D[e.icon ?? `mountain`];
    return (0,
    E.jsx)(`div`, {
        className: `pn-media`,
        children: e.image ? (0,
        E.jsx)(`img`, {
            src: e.image,
            alt: e.alt ?? ``,
            loading: t ? `eager` : `lazy`,
            decoding: `async`,
            style: e.focus ? {
                objectPosition: e.focus
            } : void 0
        }) : (0,
        E.jsx)(n, {
            size: 34,
            "aria-hidden": `true`
        })
    })
}
var P = ({note: e}) => (0,
E.jsxs)(`span`, {
    className: `pn-kicker`,
    children: [e.label, ` · `, e.tag]
})
  , F = ({note: e}) => e.highlights ? (0,
E.jsx)(`ul`, {
    className: `pn-highlights`,
    "aria-label": `At a glance`,
    children: e.highlights.map(e => (0,
    E.jsx)(`li`, {
        children: e
    }, e))
}) : null;
function I({note: e}) {
    return e.link ? (0,
    E.jsxs)(`a`, {
        className: `pn-link`,
        href: e.link.href,
        children: [e.link.label, (0,
        E.jsx)(h, {
            size: 15,
            "aria-hidden": `true`
        })]
    }) : null
}
export {S as a, v as c, h as d, m as f, C as i, _ as l, T as n, x as o, w as r, y as s, M as t, g as u};
