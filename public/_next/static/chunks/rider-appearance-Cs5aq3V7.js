var e = [{
    id: `oxblood`,
    name: `Oxblood`,
    jacket: `#eeeada`,
    panel: `#872d40`,
    pants: `#872d40`,
    pantsPanel: `#eeeada`,
    lining: `#68645c`
}, {
    id: `rose`,
    name: `Dusty Rose`,
    jacket: `#ca6d91`,
    panel: `#ca6d91`,
    pants: `#f1ece3`,
    pantsPanel: `#b55379`,
    lining: `#795763`
}, {
    id: `blush`,
    name: `Blush / Rose`,
    jacket: `#e8bccb`,
    panel: `#a04466`,
    pants: `#f1ece3`,
    pantsPanel: `#a04466`,
    lining: `#795763`
}, {
    id: `ink`,
    name: `Black / White`,
    jacket: `#202326`,
    panel: `#ecebe5`,
    pants: `#202326`,
    pantsPanel: `#ecebe5`,
    lining: `#45474a`
}, {
    id: `navy`,
    name: `Midnight`,
    jacket: `#263b50`,
    panel: `#abb7c1`,
    pants: `#657484`,
    pantsPanel: `#dce3e7`,
    lining: `#414e59`
}, {
    id: `moss`,
    name: `Olive / Stone`,
    jacket: `#525e4d`,
    panel: `#d9d5c4`,
    pants: `#c3bda7`,
    pantsPanel: `#525e4d`,
    lining: `#535548`
}, {
    id: `glacier`,
    name: `Glacier / Navy`,
    jacket: `#b9d8df`,
    panel: `#233e53`,
    pants: `#233e53`,
    pantsPanel: `#b9d8df`,
    lining: `#718994`
}, {
    id: `plum`,
    name: `Plum / Sand`,
    jacket: `#604453`,
    panel: `#e2ccb0`,
    pants: `#d3bfa3`,
    pantsPanel: `#604453`,
    lining: `#77616b`
}, {
    id: `forest`,
    name: `Forest / Cream`,
    jacket: `#233f39`,
    panel: `#eee4cc`,
    pants: `#eee4cc`,
    pantsPanel: `#233f39`,
    lining: `#526c62`
}, {
    id: `night-shift`,
    name: `Night Shift`,
    jacket: `#282a2c`,
    panel: `#d57837`,
    pants: `#282a2c`,
    pantsPanel: `#d57837`,
    lining: `#54453f`,
    graphic: `night-shift`
}, {
    id: `cc-black`,
    name: `CC Black`,
    jacket: `#18191c`,
    panel: `#f2f1e9`,
    pants: `#18191c`,
    pantsPanel: `#63cbd9`,
    lining: `#3c4652`,
    graphic: `creator`
}, {
    id: `cc-blue`,
    name: `CC Blue`,
    jacket: `#1759c4`,
    panel: `#f2f1e9`,
    pants: `#142c50`,
    pantsPanel: `#63cbd9`,
    lining: `#183861`,
    graphic: `creator`
}]
  , t = [`alpine-arc`, `alpine-arc-up`, `alpine-arc-collar`]
  , n = (e, t) => e === `oxblood` ? t : `${t}-${e}`
  , r = e => e === `oxblood` ? `alpine-drift` : `alpine-drift-${e}`
  , i = e.flatMap(e => t.map( (t, r) => ({
    name: `Arc ${e.name}${[``, ` · Hood Up`, ` · No Hood`][r]}`,
    value: n(e.id, t),
    cut: t,
    color: e.jacket,
    rarity: `legendary`,
    unlock: {
        granted: !0
    }
})))
  , a = e.map(e => ({
    name: `Drift ${e.name}`,
    value: r(e.id),
    cut: `alpine-drift`,
    color: e.pants,
    rarity: `legendary`,
    unlock: {
        granted: !0
    }
}))
  , ee = [...i, ...a].map(e => e.value)
  , te = new Map(e.flatMap(e => [...t.map(t => [n(e.id, t), e]), [r(e.id), e]]))
  , o = e => te.get(e)
  , ne = e => {
    let t = o(e);
    return t ? e.startsWith(`alpine-drift`) ? r(t.id) : n(t.id, `alpine-arc`) : e
}
  , re = [{
    name: `Man`,
    value: `classic`
}, {
    name: `Woman`,
    value: `feminine`
}]
  , s = [{
    name: `Original`,
    value: `original`,
    color: `#9e6f57`
}, {
    name: `Porcelain`,
    value: `porcelain`,
    color: `#e6bda6`
}, {
    name: `Sand`,
    value: `sand`,
    color: `#ce9d7e`
}, {
    name: `Olive`,
    value: `olive`,
    color: `#b88b66`
}, {
    name: `Amber`,
    value: `amber`,
    color: `#a56f48`
}, {
    name: `Umber`,
    value: `umber`,
    color: `#785039`
}, {
    name: `Deep`,
    value: `deep`,
    color: `#503629`
}]
  , ie = [{
    name: `Short hair`,
    value: `crop`
}, {
    name: `Front strands`,
    value: `strands`
}, {
    name: `Braid`,
    value: `braid-only`
}, {
    name: `Braid + strands`,
    value: `braid`
}]
  , ae = [{
    name: `Brown`,
    value: `brown`,
    color: `#4d3b2e`
}, {
    name: `Espresso`,
    value: `espresso`,
    color: `#211b18`
}, {
    name: `Chestnut`,
    value: `chestnut`,
    color: `#764b32`
}, {
    name: `Copper`,
    value: `copper`,
    color: `#a65a31`
}, {
    name: `Honey blonde`,
    value: `blonde`,
    color: `#b79a60`
}, {
    name: `Platinum`,
    value: `platinum`,
    color: `#d8ccb0`
}]
  , oe = {
    riderStyle: `classic`,
    skinTone: `original`,
    hairStyle: `crop`,
    hairTone: `brown`
}
  , c = [{
    rank: `contender`,
    name: `Contender`,
    ground: `#19282e`,
    accent: `#c88c55`,
    paper: `#ffd09b`,
    trim: `#70848b`,
    shadow: `#895733`,
    badge: `contender-1`,
    rarity: `rare`
}, {
    rank: `challenger`,
    name: `Challenger`,
    ground: `#142b3d`,
    accent: `#a2c7d8`,
    paper: `#ecf9ff`,
    trim: `#bddce8`,
    shadow: `#537c93`,
    badge: `challenger-1`,
    rarity: `rare`
}, {
    rank: `pro`,
    name: `Pro`,
    ground: `#242925`,
    accent: `#f2b720`,
    paper: `#fff1a7`,
    trim: `#e9ddba`,
    shadow: `#a66a0a`,
    badge: `pro-1`,
    rarity: `epic`
}, {
    rank: `elite`,
    name: `Elite`,
    ground: `#102b43`,
    accent: `#20c9ed`,
    paper: `#bcf8ff`,
    trim: `#d2f4fc`,
    shadow: `#127cae`,
    badge: `elite-1`,
    rarity: `epic`
}, {
    rank: `master`,
    name: `Master`,
    ground: `#201b34`,
    accent: `#9670d8`,
    paper: `#ddc8ff`,
    trim: `#aca6c5`,
    shadow: `#513281`,
    badge: `master-1`,
    rarity: `legendary`
}, {
    rank: `champion`,
    name: `Champion`,
    ground: `#301b27`,
    accent: `#e74452`,
    paper: `#ffa7a6`,
    trim: `#edf0f0`,
    shadow: `#7b263a`,
    badge: `champion`,
    rarity: `legendary`
}, {
    rank: `legend`,
    name: `Legend`,
    ground: `#232b39`,
    accent: `#f0ecde`,
    paper: `#fffdf2`,
    trim: `#cbd1d8`,
    shadow: `#a6acb9`,
    badge: `legend`,
    rarity: `mythic`
}]
  , l = c.map(e => ({
    name: `${e.name} S01`,
    value: `ranked-s01-${e.rank}-skis`,
    rarity: e.rarity,
    unlock: {
        granted: !0
    },
    color: e.ground
}))
  , u = c.map(e => ({
    name: `${e.name} S01`,
    value: `ranked-s01-${e.rank}-board`,
    rarity: e.rarity,
    unlock: {
        granted: !0
    },
    color: e.ground,
    print: !0
}))
  , se = [...l, ...u].map(e => e.value)
  , d = [{
    id: `80k-redline`,
    name: `80K Redline`,
    shell: `#c4c6c9`,
    ink: `#17171c`,
    accent: `#fa1919`,
    light: `#f4f4ed`,
    pants: `#26262c`,
    shirt: `#c4c6c9`,
    cut: `spartan-shell`,
    lens: `#b73545`,
    roughness: .19,
    coat: .8,
    rarity: `mythic`,
    word: `80K`,
    accessory: `#c72d32`,
    description: `Scarlet brush paint, powder-silver and a crown. Limited commemorative 80K edition.`,
    finish: `gloss`,
    limited: !0
}, {
    id: `acid-line`,
    name: `Acid Line`,
    shell: `#c2e63b`,
    ink: `#173e37`,
    accent: `#afa4d1`,
    light: `#e8ebca`,
    pants: `#214f46`,
    shirt: `#bddd45`,
    cut: `spartan-shell`,
    lens: `#96c658`,
    roughness: .69,
    coat: .12,
    rarity: `legendary`,
    word: `ACID`,
    accessory: `#88a342`,
    description: `Electric topographic ink, petrol green and acid-lime technical panels.`,
    finish: `matte`,
    limited: !1
}, {
    id: `blue-static`,
    name: `Blue Static`,
    shell: `#4264a3`,
    ink: `#182b50`,
    accent: `#b7bedb`,
    light: `#e7e1d2`,
    pants: `#2b4277`,
    shirt: `#5877ae`,
    cut: `baggy-long`,
    lens: `#6097d2`,
    roughness: .77,
    coat: .05,
    rarity: `epic`,
    word: `STATIC`,
    accessory: `#5575a7`,
    description: `Washed indigo, bleach clouds and oversized chalk marks. Loose denim energy.`,
    finish: `matte`,
    limited: !1
}, {
    id: `switch-lane`,
    name: `Switch Lane`,
    shell: `#88516e`,
    ink: `#3c1734`,
    accent: `#bb91d2`,
    light: `#f2e9da`,
    pants: `#402b4c`,
    shirt: `#9a6996`,
    cut: `baggy-long`,
    lens: `#ab74ca`,
    roughness: .35,
    coat: .55,
    rarity: `legendary`,
    word: `SWITCH`,
    accessory: `#86516e`,
    description: `Burgundy racing curves and lilac ribbons. Technical park jersey proportions.`,
    finish: `gloss`,
    limited: !1
}, {
    id: `hot-lap`,
    name: `Hot Lap`,
    shell: `#c95f33`,
    ink: `#24272d`,
    accent: `#d1944c`,
    light: `#e8dfc8`,
    pants: `#30353b`,
    shirt: `#cd673c`,
    cut: `baggy-tee`,
    lens: `#ce935c`,
    roughness: .53,
    coat: .2,
    rarity: `epic`,
    word: `LAP`,
    accessory: `#a85c37`,
    description: `Burnt-orange broken circles and hand-rolled halftone. Underground ski-film print.`,
    finish: `matte`,
    limited: !1
}, {
    id: `off-script`,
    name: `Off Script`,
    shell: `#e2decf`,
    ink: `#25242b`,
    accent: `#305bba`,
    light: `#f6f0de`,
    pants: `#45454b`,
    shirt: `#dedbcb`,
    cut: `white-tee`,
    lens: `#b5c3cf`,
    roughness: .76,
    coat: .03,
    rarity: `epic`,
    word: `SCRAWL`,
    accessory: `#777974`,
    description: `Bone-white zine drawing, black looping brush and restrained cobalt scrawl.`,
    finish: `matte`,
    limited: !1
}, {
    id: `blue-noise`,
    name: `Blue Noise`,
    shell: `#3056c9`,
    ink: `#121f48`,
    accent: `#eb7b38`,
    light: `#ece5d9`,
    pants: `#263c83`,
    shirt: `#3a63d2`,
    cut: `spartan-shell`,
    lens: `#4576d8`,
    roughness: .3,
    coat: .5,
    rarity: `legendary`,
    word: `NOISE`,
    accessory: `#d66a36`,
    description: `Cobalt optical ribbons and orange halftone. Broadcast graphics turned outerwear.`,
    finish: `gloss`,
    limited: !1
}, {
    id: `brush-country`,
    name: `Brush Country`,
    shell: `#889781`,
    ink: `#202c27`,
    accent: `#d4ce82`,
    light: `#dedcc7`,
    pants: `#68735b`,
    shirt: `#8d9c84`,
    cut: `baggy-long`,
    lens: `#a7b889`,
    roughness: .82,
    coat: .04,
    rarity: `epic`,
    word: `BRUSH`,
    accessory: `#879771`,
    description: `Sumi-e brush camouflage. Sage, bone and charcoal with quiet sulphur accents.`,
    finish: `matte`,
    limited: !1
}, {
    id: `after-hours`,
    name: `After Hours`,
    shell: `#a8698d`,
    ink: `#2a202b`,
    accent: `#ed6fa9`,
    light: `#d4c8d0`,
    pants: `#473449`,
    shirt: `#966184`,
    cut: `baggy-tee`,
    lens: `#c771ae`,
    roughness: .25,
    coat: .7,
    rarity: `legendary`,
    word: `AFTERS`,
    accessory: `#a06591`,
    description: `Smoky mauve and pink airbrush flows, cut by sharp wine-red shards.`,
    finish: `gloss`,
    limited: !1
}, {
    id: `cold-front`,
    name: `Cold Front`,
    shell: `#91cfda`,
    ink: `#183a47`,
    accent: `#3b91af`,
    light: `#e0f1e9`,
    pants: `#284c5d`,
    shirt: `#84c2cf`,
    cut: `spartan-shell`,
    lens: `#6fc2d9`,
    roughness: .27,
    coat: .6,
    rarity: `legendary`,
    word: `FRONT`,
    accessory: `#448fa6`,
    description: `Glacier-white channels in turquoise mineral ink. Fluid technical shell print.`,
    finish: `gloss`,
    limited: !1
}, {
    id: `side-country`,
    name: `Side Country`,
    shell: `#b4a07b`,
    ink: `#292b28`,
    accent: `#b49c48`,
    light: `#e6dcc7`,
    pants: `#706553`,
    shirt: `#b4a07b`,
    cut: `baggy-long`,
    lens: `#b2a27b`,
    roughness: .8,
    coat: .03,
    rarity: `epic`,
    word: `SIDES`,
    accessory: `#9c8a62`,
    description: `Khaki utility canvas and oversized torn charcoal stencil. Clay and mustard detail.`,
    finish: `matte`,
    limited: !1
}]
  , f = (e, t) => `sd-${e}-${t}`
  , p = {
    granted: !0
}
  , m = e => e.rarity === `mythic` ? `legendary` : e.rarity
  , h = d.map(e => ({
    name: e.limited ? `${e.name} · Limited` : e.name,
    value: f(e.id, `helmet`),
    rarity: e.rarity,
    unlock: p,
    color: e.shell
}))
  , g = d.map(e => ({
    name: `${e.name} Baggy${e.limited ? ` · Limited` : ``}`,
    value: f(e.id, `pants`),
    rarity: e.rarity,
    unlock: p,
    color: e.pants,
    cut: `park-baggy`
}))
  , _ = d.map(e => ({
    name: `${e.name} ${e.cut === `spartan-shell` ? `Shell` : e.cut === `baggy-long` ? `Long` : `Tee`}${e.limited ? ` · Limited` : ``}`,
    value: f(e.id, `top`),
    rarity: e.rarity,
    unlock: p,
    color: e.shirt,
    band: e.ink,
    cut: e.cut
}))
  , v = d.map(e => ({
    name: `${e.name} Twin`,
    value: f(e.id, `skis`),
    rarity: m(e),
    unlock: p,
    color: e.shell
}))
  , ce = d.map(e => ({
    name: `${e.name} Board`,
    value: f(e.id, `board`),
    rarity: m(e),
    unlock: p,
    color: e.shell,
    print: !0
}))
  , le = d.map(e => ({
    name: `${e.name} Poles`,
    value: f(e.id, `poles`),
    rarity: `rare`,
    unlock: p
}))
  , ue = d.map(e => ({
    name: `${e.name} Mitt`,
    value: f(e.id, `gloves`),
    rarity: `epic`,
    unlock: p
}));
Object.fromEntries(d.map(e => [e.id, e.accessory]));
var de = d.flatMap(e => [{
    name: `${e.name} Cabrio`,
    value: f(e.id, `boots`),
    rarity: `epic`,
    unlock: p,
    color: e.shell,
    board: !1
}, {
    name: `${e.name} Snow Boot`,
    value: f(e.id, `snowboots`),
    rarity: `epic`,
    unlock: p,
    color: e.accessory,
    board: !0
}])
  , fe = d.map(e => ({
    name: `${e.name} Prism`,
    value: f(e.id, `goggles`),
    rarity: `epic`,
    unlock: p,
    lens: e.lens,
    gradient: `sd-${e.id}`,
    legacyLens: `#c4d0d8`,
    frame: e.ink,
    cut: `prism`
}));
[...h, ...g, ..._, ...v, ...ce, ...le, ...ue, ...de, ...fe];
var pe = new Map(d.flatMap(e => [`helmet`, `pants`, `top`, `skis`, `board`, `poles`, `gloves`, `boots`, `snowboots`, `goggles`].map(t => [f(e.id, t), e])))
  , me = e => pe.get(e)
  , he = Object.fromEntries(d.map(e => [e.id, [e.ink, e.lens, e.light, e.accent]]))
  , y = [{
    id: `harvest`,
    name: `Harvest`,
    motif: `botanical`,
    finish: `matte`,
    shell: `#5a6050`,
    ink: `#252c26`,
    accent: `#b38a5b`,
    light: `#d7cbb2`,
    pants: `#4a4c3d`,
    shirt: `#535847`,
    cut: `baggy-long`,
    lens: `#d89a4c`,
    roughness: .84,
    coat: .04,
    description: `Botanisk workwear i vasket oliven og lin. Graverte kornaks, kontrast-yoke og en liten gotisk signatur. Ingen gresskar.`
}, {
    id: `jack-o`,
    name: `Jack O`,
    motif: `pumpkin-gloss`,
    finish: `gloss`,
    shell: `#ed751d`,
    ink: `#1b1412`,
    accent: `#ffbf50`,
    light: `#efe5cc`,
    pants: `#39251c`,
    shirt: `#de6d24`,
    cut: `spartan-shell`,
    lens: `#f0a04d`,
    roughness: .17,
    coat: 1,
    description: `Blank gresskarlakk med mørke ribber. Kobber, kull og gyllenoransje på teknisk shell.`
}, {
    id: `witching`,
    name: `Witching Hour`,
    motif: `moth`,
    finish: `satin`,
    shell: `#322e45`,
    ink: `#211f29`,
    accent: `#9a8fa9`,
    light: `#d4cbd5`,
    pants: `#34303e`,
    shirt: `#5a526c`,
    cut: `baggy-tee`,
    lens: `#b695e0`,
    roughness: .57,
    coat: .18,
    description: `Nattfiolett, røyklinjer og en gravert nattsvermer. Gotisk typografi med stor ryggillustrasjon og rolig front.`
}, {
    id: `ossuary`,
    name: `Ossuary`,
    motif: `bones`,
    finish: `matte`,
    shell: `#d7c8a8`,
    ink: `#242723`,
    accent: `#996c52`,
    light: `#e8ddc3`,
    pants: `#353630`,
    shirt: `#c6bda7`,
    cut: `white-tee`,
    lens: `#bfc8c3`,
    roughness: .78,
    coat: .06,
    description: `Patinert benhvitt og kull. Anatomisk ribbegravering, smale sidestriper og subtil boktypografi.`
}, {
    id: `hex`,
    name: `Hex`,
    motif: `contour`,
    finish: `gloss`,
    shell: `#252b29`,
    ink: `#252c32`,
    accent: `#c2cf62`,
    light: `#e5e4c6`,
    pants: `#889648`,
    shirt: `#262d29`,
    cut: `spartan-shell`,
    lens: `#b1cf61`,
    roughness: .24,
    coat: .85,
    description: `Teknisk acid-print. Skjeve konturlinjer og svovelgule felt med stor negativ HEX-type og et kantet symbol.`
}, {
    id: `bloodmoon`,
    name: `Blood Moon`,
    motif: `eclipse`,
    finish: `satin`,
    shell: `#5c1828`,
    ink: `#241d27`,
    accent: `#b74740`,
    light: `#d9baa4`,
    pants: `#5b2530`,
    shirt: `#791f35`,
    cut: `baggy-long`,
    lens: `#c66f73`,
    roughness: .38,
    coat: .4,
    description: `Oksblod og kull med elfenbensstriper. Nattlig team-jersey, formørkelse og store startnummer.`
}, {
    id: `phantom`,
    name: `Phantom`,
    motif: `speed`,
    finish: `satin`,
    shell: `#b5bdc6`,
    ink: `#3d4657`,
    accent: `#889ba6`,
    light: `#e1e4df`,
    pants: `#59616b`,
    shirt: `#ccd1d2`,
    cut: `white-tee`,
    lens: `#91d3df`,
    roughness: .46,
    coat: .25,
    description: `Røykgrått og frost. Forskjøvne hastighetslinjer, presis type og lange sølvfargede paneler uten figurer.`
}, {
    id: `wildcard`,
    name: `Wild Card`,
    motif: `spade`,
    finish: `gloss`,
    shell: `#402a45`,
    ink: `#211c2a`,
    accent: `#bb8e4f`,
    light: `#d6c2a0`,
    pants: `#403145`,
    shirt: `#543a54`,
    cut: `baggy-tee`,
    lens: `#9e7ecb`,
    roughness: .21,
    coat: .9,
    description: `Aubergine, antikk messing og blekk. Dekonstruerte kortruter, gravert spar og OFF AXIS i gotisk lettering.`
}, {
    id: `last-laugh`,
    name: `Last Laugh`,
    motif: `grin`,
    finish: `gloss`,
    shell: `#d9cfc0`,
    ink: `#22252b`,
    accent: `#a3353e`,
    light: `#e9deca`,
    pants: `#252528`,
    shirt: `#cfc4b2`,
    cut: `spartan-shell`,
    lens: `#ba6377`,
    roughness: .27,
    coat: .72,
    description: `Benhvit halvdeling mot kull, tørre karminstrøk og et abstrakt skåret glis. Rå typografi, ingen klovnefigur.`
}, {
    id: `dead-press`,
    name: `Dead Press`,
    motif: `press`,
    finish: `matte`,
    shell: `#c2b394`,
    ink: `#222c2c`,
    accent: `#a75736`,
    light: `#d8cdb4`,
    pants: `#383b37`,
    shirt: `#b4ac99`,
    cut: `baggy-long`,
    lens: `#c08c73`,
    roughness: .82,
    coat: .04,
    description: `Falmet avispapir, ekte spalterytme og trykksverte. Ulik forside og bakside, med mørk benpanel og gotisk masthead.`
}, {
    id: `grave-shift`,
    name: `Grave Shift`,
    motif: `raven`,
    finish: `satin`,
    shell: `#353b38`,
    ink: `#252b2a`,
    accent: `#a87948`,
    light: `#c2bca7`,
    pants: `#454d46`,
    shirt: `#60695f`,
    cut: `spartan-shell`,
    lens: `#7a8b9c`,
    roughness: .54,
    coat: .22,
    description: `Nattarbeid i skifer, støvet salvie og kobber. Smale service-striper, liten brystsignatur og en gravert ravn.`
}, {
    id: `ghost-lap`,
    name: `Ghost Lap`,
    motif: `orbit`,
    finish: `matte`,
    shell: `#b6c9c8`,
    ink: `#293c42`,
    accent: `#c48551`,
    light: `#e1dfcc`,
    pants: `#7c9d9d`,
    shirt: `#a4c0bd`,
    cut: `baggy-tee`,
    lens: `#87a6a5`,
    roughness: .76,
    coat: .08,
    description: `Petroleum og blek is med kobberpanel. Orbitale linjer og grafiske løypespor, uten spøkelser.`
}, {
    id: `bail-notice`,
    name: `Bail Notice`,
    motif: `notice`,
    finish: `satin`,
    shell: `#bca15d`,
    ink: `#30372f`,
    accent: `#c6aa56`,
    light: `#dcd0a5`,
    pants: `#4e503d`,
    shirt: `#a9965d`,
    cut: `white-tee`,
    lens: `#b8956b`,
    roughness: .6,
    coat: .14,
    description: `Falmet sennep og militærgrønt. Verkstedmerking, varselfelt og stor funksjonell stensiltype.`
}, {
    id: `afterburn`,
    name: `Afterburn`,
    motif: `slash`,
    finish: `matte`,
    shell: `#b2472c`,
    ink: `#262a2b`,
    accent: `#c0a66f`,
    light: `#e1d1ad`,
    pants: `#38332c`,
    shirt: `#a8492f`,
    cut: `spartan-shell`,
    lens: `#c46a30`,
    roughness: .78,
    coat: .08,
    description: `Brent rust, sand og kull. Motorsport-striper, skarpe flammelinjer og asymmetrisk racing-grafikk.`
}, {
    id: `toxic-tape`,
    name: `Toxic Tape`,
    motif: `contact`,
    finish: `gloss`,
    shell: `#28615a`,
    ink: `#222e32`,
    accent: `#c8bc70`,
    light: `#d7d6b7`,
    pants: `#2e5c56`,
    shirt: `#326d63`,
    cut: `baggy-long`,
    lens: `#99ad56`,
    roughness: .24,
    coat: .78,
    description: `Dyp flaskegrønn og kjemisk gul. Forvrengt kontaktprint og store typografiske felt med organisk linjerytme.`
}, {
    id: `dead-air`,
    name: `Dead Air`,
    motif: `frequency`,
    finish: `satin`,
    shell: `#38586e`,
    ink: `#222e3a`,
    accent: `#ac6c48`,
    light: `#d1cdbd`,
    pants: `#394e5e`,
    shirt: `#4e6c7b`,
    cut: `baggy-tee`,
    lens: `#4b86bb`,
    roughness: .52,
    coat: .22,
    description: `Petrolblått og gråhvit. Analog lydgrafikk, signalstriper og teknisk typografi med rust som aksent.`
}, {
    id: `sugar-rush`,
    name: `Night Bloom`,
    motif: `floral`,
    finish: `gloss`,
    shell: `#754653`,
    ink: `#292930`,
    accent: `#a88085`,
    light: `#c2b6a4`,
    pants: `#533844`,
    shirt: `#845563`,
    cut: `white-tee`,
    lens: `#b1829d`,
    roughness: .29,
    coat: .65,
    description: `Night Bloom: falmede botaniske graveringer i vinrød, støvet rose og svart. Stor gotisk signatur, ingen godterifigur.`
}, {
    id: `nightfang`,
    name: `Nightfang`,
    motif: `vampire`,
    finish: `satin`,
    shell: `#231b28`,
    ink: `#15151e`,
    accent: `#a12c42`,
    light: `#e7dcc4`,
    pants: `#271f2d`,
    shirt: `#6f1d35`,
    cut: `spartan-shell`,
    lens: `#aa5162`,
    roughness: .41,
    coat: .36,
    description: `Dracula-tailoring på park-shell: blodrød silkebrokade, skarpe kappeformede slag, benhvit skjortefront og mørke bukser med rød sidesøm. Ansiktet sitter på hjelmen.`
}, {
    id: `joker-cut`,
    name: `Joker's Cut`,
    motif: `joker-engraving`,
    finish: `gloss`,
    shell: `#dfd6c7`,
    ink: `#242035`,
    accent: `#79964e`,
    light: `#e7dbc7`,
    pants: `#50345d`,
    shirt: `#674174`,
    cut: `baggy-tee`,
    lens: `#8fba69`,
    roughness: .24,
    coat: .82,
    description: `Skjev skreddersøm i plomme, mossegul og falmet krem. Organiske pinstriper og et grønt vestfelt, med håndmalt smil på hjelmen.`
}, {
    id: `ghosted`,
    name: `Ghosted`,
    motif: `wraith`,
    finish: `matte`,
    shell: `#dae0d9`,
    ink: `#344751`,
    accent: `#91adb1`,
    light: `#f0eadc`,
    pants: `#bacacc`,
    shirt: `#d9e1d9`,
    cut: `white-tee`,
    lens: `#9dc6c5`,
    roughness: .74,
    coat: .09,
    description: `Tåke og drapert lin i frost, blekkblått og krem. Lange silhuetter flyter rundt torso og ben. Et mørkt åndeansikt er integrert i hjelmens skall.`
}, {
    id: `bone-yard`,
    name: `Bone Yard`,
    motif: `skeleton`,
    finish: `matte`,
    shell: `#d7d3c7`,
    ink: `#202327`,
    accent: `#7e8984`,
    light: `#dedcd0`,
    pants: `#303435`,
    shirt: `#303436`,
    cut: `baggy-long`,
    lens: `#b7c6ae`,
    roughness: .79,
    coat: .06,
    description: `Kullvasket denim med tørrpenslede knokler i benhvitt. Ribbein, skulderblad, ryggvirvler og ben følger kroppen; anatomisk skalle over hjelmen.`
}, {
    id: `grave-form`,
    name: `Grave Form`,
    motif: `pinstripe`,
    finish: `satin`,
    shell: `#e0dccf`,
    ink: `#1d2026`,
    accent: `#8a938c`,
    light: `#e9e5d9`,
    pants: `#24262c`,
    shirt: `#25272e`,
    cut: `baggy-long`,
    lens: `#a6b0ba`,
    roughness: .43,
    coat: .26,
    description: `Benhvit skalle og kullsort pinstripe-antrekk. Trykte slag, en smal skjortefront og håndtegnede linjer går rundt hele kroppen.`
}, {
    id: `blue-hour`,
    name: `Blue Hour`,
    motif: `hound`,
    finish: `gloss`,
    shell: `#2045a3`,
    ink: `#101e4a`,
    accent: `#6583bf`,
    light: `#e8e1d0`,
    pants: `#ded7c5`,
    shirt: `#234b9f`,
    cut: `spartan-shell`,
    lens: `#4b83d2`,
    roughness: .22,
    coat: .84,
    description: `Koboltblå natthund på hjelmen, kremfargede spirit-flammer over en blå shell og varme benhvite baggybukser. Store organiske strøk og lavmælt lettering.`
}, {
    id: `moth-eaten`,
    name: `Moth Eaten`,
    motif: `wing`,
    finish: `matte`,
    shell: `#49383b`,
    ink: `#25242e`,
    accent: `#af8550`,
    light: `#d7c7a8`,
    pants: `#55434a`,
    shirt: `#715257`,
    cut: `baggy-tee`,
    lens: `#c29267`,
    roughness: .78,
    coat: .07,
    description: `Nattmøll i støvet vin, tobakk og lin. Store vinger, øyeflekker og bølgende årringer vokser over skuldre, ermer og ben.`
}, {
    id: `wrap-sheet`,
    name: `Wrap Sheet`,
    motif: `linen`,
    finish: `matte`,
    shell: `#b8b09a`,
    ink: `#39413d`,
    accent: `#788268`,
    light: `#e4dac0`,
    pants: `#8e9480`,
    shirt: `#c8bda2`,
    cut: `white-tee`,
    lens: `#a4b99b`,
    roughness: .85,
    coat: .04,
    description: `Mumielin i varm kalk, støvet salvie og mørk torv. Bøyde bandasjer med frynsete kanter følger hele antrekket, med gravmaske på hjelmen.`
}]
  , b = (e, t) => `hw-${e}-${t}`
  , x = {
    granted: !0
}
  , S = {
    harvest: `epic`,
    "jack-o": `legendary`,
    witching: `epic`,
    ossuary: `rare`,
    hex: `legendary`,
    bloodmoon: `epic`,
    phantom: `rare`,
    wildcard: `legendary`,
    "last-laugh": `legendary`,
    "dead-press": `legendary`,
    "grave-shift": `epic`,
    "ghost-lap": `epic`,
    "bail-notice": `rare`,
    afterburn: `legendary`,
    "toxic-tape": `epic`,
    "dead-air": `epic`,
    "sugar-rush": `epic`,
    nightfang: `legendary`,
    "joker-cut": `legendary`,
    ghosted: `epic`,
    "bone-yard": `legendary`,
    "grave-form": `legendary`,
    "blue-hour": `legendary`,
    "moth-eaten": `epic`,
    "wrap-sheet": `epic`
}
  , ge = {
    ...S,
    bloodmoon: `legendary`
}
  , C = e => S[e] === `legendary` ? `epic` : `rare`
  , w = y.map(e => ({
    name: `${e.name}${e.id === `harvest` ? ` Matte` : e.id === `jack-o` ? ` Gloss` : ``}`,
    value: b(e.id, `helmet`),
    rarity: ge[e.id],
    unlock: x,
    color: e.shell
}))
  , T = y.map(e => ({
    name: `${e.name} Baggy`,
    value: b(e.id, `pants`),
    rarity: S[e.id],
    unlock: x,
    color: e.pants,
    cut: `park-baggy`
}))
  , E = y.map(e => ({
    name: `${e.name} ${e.cut === `baggy-long` ? `Long` : e.cut === `spartan-shell` ? `Spartan` : e.cut === `baggy-tee` ? `Baggy Tee` : `Tee`}`,
    value: b(e.id, `top`),
    rarity: S[e.id],
    unlock: x,
    color: e.shirt,
    band: e.ink,
    cut: e.cut
}))
  , D = y.map(e => ({
    name: `${e.name} Twin`,
    value: b(e.id, `skis`),
    rarity: S[e.id],
    unlock: x,
    color: e.shell
}))
  , O = y.map(e => ({
    name: `${e.name} Board`,
    value: b(e.id, `board`),
    rarity: S[e.id],
    unlock: x,
    color: e.shell,
    print: !0
}))
  , k = y.map(e => ({
    name: `${e.name} Poles`,
    value: b(e.id, `poles`),
    rarity: `rare`,
    unlock: x
}))
  , A = y.map(e => ({
    name: `${e.name} Mitt`,
    value: b(e.id, `gloves`),
    rarity: C(e.id),
    unlock: x
}))
  , _e = {
    harvest: `#797650`,
    "jack-o": `#c96934`,
    witching: `#76647e`,
    ossuary: `#b3a37e`,
    hex: `#a3ad58`,
    bloodmoon: `#934650`,
    phantom: `#7d95aa`,
    wildcard: `#7e5679`,
    "last-laugh": `#9e4f4c`,
    "dead-press": `#a49569`,
    "grave-shift": `#688675`,
    "ghost-lap": `#5f9290`,
    "bail-notice": `#aa934e`,
    afterburn: `#a75c3c`,
    "toxic-tape": `#468d7e`,
    "dead-air": `#517792`,
    "sugar-rush": `#9e697d`,
    nightfang: `#9c3e50`,
    "joker-cut": `#75984d`,
    ghosted: `#74a4b0`,
    "bone-yard": `#b8b4a0`,
    "grave-form": `#969b85`,
    "blue-hour": `#3763b0`,
    "moth-eaten": `#af8063`,
    "wrap-sheet": `#909a73`
}
  , j = y.flatMap(e => [{
    name: `${e.name} Cabrio`,
    value: b(e.id, `boots`),
    rarity: C(e.id),
    unlock: x,
    color: e.shell,
    board: !1
}, {
    name: `${e.name} Snow Boot`,
    value: b(e.id, `snowboots`),
    rarity: C(e.id),
    unlock: x,
    color: _e[e.id],
    board: !0
}])
  , M = y.map(e => ({
    name: `${e.name} Prism`,
    value: b(e.id, `goggles`),
    rarity: C(e.id),
    unlock: x,
    lens: e.lens,
    gradient: `hw-${e.id}`,
    legacyLens: {
        harvest: `#e19859`,
        "jack-o": `#e4bf5c`,
        witching: `#9e72d8`,
        ossuary: `#c4d0d8`,
        hex: `#e4bf5c`,
        bloodmoon: `#cc89ae`,
        phantom: `#75c4e2`,
        wildcard: `#9e72d8`,
        "last-laugh": `#cc89ae`,
        "dead-press": `#e19859`,
        "grave-shift": `#9e72d8`,
        "ghost-lap": `#75c4e2`,
        "bail-notice": `#e4bf5c`,
        afterburn: `#e19859`,
        "toxic-tape": `#9e72d8`,
        "dead-air": `#75c4e2`,
        "sugar-rush": `#cc89ae`,
        nightfang: `#cc89ae`,
        "joker-cut": `#9e72d8`,
        ghosted: `#75c4e2`,
        "bone-yard": `#c4d0d8`,
        "grave-form": `#c4d0d8`,
        "blue-hour": `#75c4e2`,
        "moth-eaten": `#e19859`,
        "wrap-sheet": `#e4bf5c`
    }[e.id],
    frame: e.ink,
    cut: `prism`
}));
[...w, ...T, ...E, ...D, ...O, ...k, ...A, ...j, ...M];
var ve = new Map(y.flatMap(e => [`helmet`, `pants`, `top`, `skis`, `board`, `poles`, `gloves`, `boots`, `snowboots`, `goggles`].map(t => [b(e.id, t), e])))
  , ye = e => ve.get(e)
  , be = {
    harvest: [`#344953`, `#976039`, `#efb769`, `#d8c6a3`],
    "jack-o": [`#402c3b`, `#c95125`, `#ffc55b`, `#8b613c`],
    witching: [`#263a50`, `#776d9d`, `#bd9fbc`, `#aaac95`],
    ossuary: [`#333b42`, `#a1aba2`, `#e1dbc6`, `#697a83`],
    hex: [`#283747`, `#436e56`, `#b6bf58`, `#d5d391`],
    bloodmoon: [`#29384a`, `#6b354f`, `#d67c69`, `#b49283`],
    phantom: [`#344851`, `#6b9d9b`, `#c3d9cc`, `#aa9fb7`],
    wildcard: [`#40304d`, `#8065a0`, `#b5b57a`, `#d4cba3`],
    "last-laugh": [`#292c3b`, `#9e485e`, `#d4968c`, `#c7c2ac`],
    "dead-press": [`#273b46`, `#8f7564`, `#cdb799`, `#dba36f`],
    "grave-shift": [`#262c45`, `#5e6c92`, `#b4a2c1`, `#719a9e`],
    "ghost-lap": [`#29464a`, `#62a5ab`, `#c1d6c2`, `#d6b08a`],
    "bail-notice": [`#3b3343`, `#b5816a`, `#d1bb72`, `#99937c`],
    afterburn: [`#49304a`, `#b55d30`, `#ebc76f`, `#8e5d48`],
    "toxic-tape": [`#534070`, `#8270b3`, `#bdd06b`, `#658d7b`],
    "dead-air": [`#26436e`, `#397fa9`, `#add4d6`, `#8995b9`],
    "sugar-rush": [`#463954`, `#a8789f`, `#c6afad`, `#87c5b0`],
    nightfang: [`#251e36`, `#632b44`, `#cb6873`, `#cbaa90`],
    "joker-cut": [`#352947`, `#684c91`, `#99bb61`, `#d4d69b`],
    ghosted: [`#294154`, `#588f9e`, `#b4d9cf`, `#dce5cd`],
    "bone-yard": [`#273b3d`, `#6e9287`, `#d3d5b6`, `#8babb5`],
    "grave-form": [`#272a34`, `#727c8e`, `#d3d9ce`, `#a59b89`],
    "blue-hour": [`#122b6b`, `#255eaf`, `#88cae2`, `#c6d6d5`],
    "moth-eaten": [`#443547`, `#9b6667`, `#d3b274`, `#b0afa0`],
    "wrap-sheet": [`#37493e`, `#80916f`, `#d7d1ae`, `#9da997`]
}
  , N = [{
    name: `Petrol`,
    color: `#286d70`
}, {
    name: `Ember`,
    color: `#be5937`
}, {
    name: `Bone`,
    color: `#d5d1bd`
}, {
    name: `Ink`,
    color: `#303946`
}, {
    name: `Moss`,
    color: `#76836b`
}, {
    name: `Glacier`,
    color: `#819fac`
}, {
    name: `Carbon`,
    color: `#14181d`
}, {
    name: `Signal red`,
    color: `#d43b42`
}]
  , xe = [{
    name: `Copper`,
    color: `#e19859`
}, {
    name: `Ice mirror`,
    color: `#75c4e2`
}, {
    name: `Rose mirror`,
    color: `#cc89ae`
}, {
    name: `Silver`,
    color: `#c4d0d8`
}, {
    name: `Violet mirror`,
    color: `#9e72d8`
}, {
    name: `Smoke`,
    color: `#445363`
}, {
    name: `Gold`,
    color: `#e4bf5c`
}]
  , P = [{
    name: `Race red`,
    color: `#ea1018`
}, ...N.filter(e => e.name !== `Ember`)]
  , F = {
    jacket: N,
    pants: N,
    helmet: N,
    goggles: xe,
    boots: [{
        name: `Grey`,
        color: `#70767c`
    }, ...N],
    skis: P,
    board: P
}
  , Se = Object.keys(F)
  , Ce = [{
    name: `STEEZ8 logo`,
    value: `logo`
}, {
    name: `Plain`,
    value: `plain`
}]
  , we = [{
    name: `Over the helmet`,
    value: `over`
}, {
    name: `Under the helmet`,
    value: `under`
}]
  , I = [{
    name: `Park`,
    value: `park`,
    rarity: `standard`,
    unlock: {
        score: 0
    }
}, {
    name: `No Helmet`,
    value: `none`,
    rarity: `standard`,
    unlock: {
        score: 0
    }
}, {
    name: `Bubble`,
    value: `bubble`,
    rarity: `rare`,
    unlock: {
        granted: !0,
        season01: 75e3
    }
}, {
    name: `Pro Model`,
    value: `pro-model`,
    rarity: `epic`,
    unlock: {
        granted: !0,
        season01: 1e5
    }
}, {
    name: `Chrome`,
    value: `chrome`,
    rarity: `legendary`,
    unlock: {
        granted: !0,
        season01: 15e4
    }
}, {
    name: `Ink Melt · Top 1 The Yard S01`,
    value: `ink-melt`,
    rarity: `mythic`,
    unlock: {
        prize: 1
    }
}, {
    name: `Sticker Club · Top 2 The Yard S01`,
    value: `sticker-club`,
    rarity: `mythic`,
    unlock: {
        prize: 2
    }
}, {
    name: `Sticker Bomb · Top 3 The Yard S01`,
    value: `sticker-bomb`,
    rarity: `mythic`,
    unlock: {
        prize: 3
    }
}, {
    name: `Team STEEZ8`,
    value: `team`,
    rarity: `mythic`,
    unlock: {
        granted: !0
    }
}, {
    name: `Jerry Black`,
    value: `jerry-black`,
    rarity: `rare`,
    unlock: {
        granted: !0
    },
    color: `#16181b`
}, {
    name: `Jerry White`,
    value: `jerry-white`,
    rarity: `rare`,
    unlock: {
        granted: !0
    },
    color: `#e6e6e2`
}, {
    name: `Silver Pro`,
    value: `silver-pro`,
    rarity: `mythic`,
    unlock: {
        granted: !0
    }
}, {
    name: `Blue Fork`,
    value: `blue-fork`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    }
}, {
    name: `CC REC`,
    value: `cc-rec`,
    rarity: `mythic`,
    unlock: {
        granted: !0
    }
}, {
    name: `CC REC White`,
    value: `cc-rec-white`,
    rarity: `mythic`,
    unlock: {
        granted: !0
    }
}, {
    name: `CC REC Blue`,
    value: `cc-rec-blue`,
    rarity: `mythic`,
    unlock: {
        granted: !0
    }
}, {
    name: `CC REC Red`,
    value: `cc-rec-red`,
    rarity: `mythic`,
    unlock: {
        granted: !0
    }
}, {
    name: `Street Static`,
    value: `starline`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    }
}, {
    name: `Hot Head`,
    value: `slow-burn`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    }
}, {
    name: `Deck Tape`,
    value: `pit-lane`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    }
}, {
    name: `Hot Head Cobalt`,
    value: `hot-head-cobalt`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    }
}, {
    name: `Deck Tape Violet`,
    value: `deck-tape-violet`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    }
}, {
    name: `Haze Lid`,
    value: `haze-lid`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    }
}, {
    name: `STEEZ8 Cup Winner`,
    value: `cork7-cup-winner`,
    rarity: `mythic`,
    unlock: {
        granted: !0
    }
}, ...w, ...h]
  , L = [{
    name: `Ripstop`,
    value: `ripstop`,
    rarity: `standard`,
    unlock: {
        score: 0
    }
}, {
    name: `Blackout Cargo`,
    value: `blackout-cargo`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    color: `#16181b`
}, {
    name: `Freeride Shell`,
    value: `freeride-shell`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#8e2a2a`
}, {
    name: `Double Knee`,
    value: `double-knee`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#eeeeeb`
}, {
    name: `Double Knee Sand`,
    value: `double-knee-sand`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `double-knee`,
    color: `#d5d1bd`
}, {
    name: `Nordic Box`,
    value: `nordic-box`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#5a4535`
}, {
    name: `Big Boxers`,
    value: `boxers`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    color: `#6f9ad0`
}, {
    name: `Park Baggy`,
    value: `park-baggy`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    color: `#16181b`
}, {
    name: `Night Shift Baggy`,
    value: `after-hours-pants`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `park-baggy`,
    color: `#16181b`
}, {
    name: `Bone Yard Baggy`,
    value: `slow-burn-pants`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `park-baggy`,
    color: `#16181b`
}, {
    name: `Night Shift Cobalt`,
    value: `night-shift-cobalt`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `park-baggy`,
    color: `#203a68`
}, {
    name: `Bone Yard Violet`,
    value: `bone-yard-violet`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `park-baggy`,
    color: `#51446c`
}, {
    name: `Haze Baggy`,
    value: `haze-pants`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `park-baggy`,
    color: `#191d28`
}, {
    name: `Broadcast Baggy`,
    value: `broadcast-pants`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `park-baggy`,
    color: `#232b39`
}, {
    name: `Tartan 06 Baggy`,
    value: `tartan-06-pants`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `park-baggy`,
    color: `#9d3b49`
}, {
    name: `Whiteout 09 Baggy`,
    value: `whiteout-09-pants`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `park-baggy`,
    color: `#e1e1d8`
}, {
    name: `Smoke 08 Baggy`,
    value: `smoke-08-pants`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `park-baggy`,
    color: `#91816a`
}, {
    name: `Park Baggy Sand`,
    value: `park-baggy-sand`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `park-baggy`,
    color: `#d8c29a`
}, {
    name: `Drift Denim`,
    value: `drift-denim`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#52616e`
}, {
    name: `Orbit Nylon`,
    value: `orbit-nylon`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#687264`
}, {
    name: `Transit Wide`,
    value: `transit-wide`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    color: `#363e49`
}, ...a, ...T, ...g]
  , Te = e => {
    let t = L.find(t => t.value === e);
    return t && `cut` in t ? t.cut : e
}
  , R = [{
    name: `BMX Grip`,
    value: `bmx-grip`,
    rarity: `standard`,
    unlock: {
        score: 0
    }
}, {
    name: `No Poles`,
    value: `no-poles`,
    rarity: `standard`,
    unlock: {
        score: 0
    }
}, {
    name: `Onyx Mag`,
    value: `onyx-mag`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    }
}, {
    name: `Flip Lock`,
    value: `flip-lock`,
    rarity: `epic`,
    unlock: {
        granted: !0
    }
}, {
    name: `Honeycomb`,
    value: `honeycomb`,
    rarity: `epic`,
    unlock: {
        granted: !0
    }
}, {
    name: `Grab Tab`,
    value: `grab-tab`,
    rarity: `rare`,
    unlock: {
        granted: !0
    }
}, {
    name: `Olive Groove`,
    value: `olive-groove`,
    rarity: `rare`,
    unlock: {
        granted: !0
    }
}, ...k, ...le]
  , z = [{
    name: `Park Shell`,
    value: `park-shell`,
    rarity: `standard`,
    unlock: {
        score: 0
    }
}, {
    name: `Hooded Powder`,
    value: `hooded-powder`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `hooded-shell`,
    color: `#eeeeeb`,
    band: `#dfe0de`
}, {
    name: `Hooded Olive`,
    value: `hooded-olive`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `hooded-shell`,
    color: `#434a31`,
    band: `#9c9f84`
}, {
    name: `Hooded Blackout`,
    value: `hooded-blackout`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `hooded-shell`,
    color: `#16181b`,
    band: `#0b0c0e`
}, {
    name: `Hooded Race Red`,
    value: `hooded-race-red`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `hooded-shell`,
    color: `#bf0f28`,
    band: `#0a0b0d`
}, {
    name: `Spartan Red`,
    value: `spartan-red`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `spartan-shell`,
    color: `#c4122d`,
    band: `#111214`
}, {
    name: `Spartan White`,
    value: `spartan-white`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `spartan-shell`,
    color: `#e9e6dc`,
    band: `#e2dfd4`
}, {
    name: `Storm Shell`,
    value: `storm-shell`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `storm-shell`,
    color: `#466d76`
}, {
    name: `Spartan Olive`,
    value: `spartan-olive`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `spartan-block`,
    color: `#3f4430`,
    band: `#e8e7df`,
    lower: `#8e957c`
}, {
    name: `Easter Bare`,
    value: `bare-body`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `bare-body`,
    color: `#9e6f57`
}, {
    name: `White Tee`,
    value: `white-tee`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `white-tee`,
    color: `#e5e5e2`
}, {
    name: `Black Tee`,
    value: `black-tee`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `white-tee`,
    color: `#16181b`
}, {
    name: `Grey Tee`,
    value: `grey-tee`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `white-tee`,
    color: `#6f7174`
}, {
    name: `White Baggy Tee`,
    value: `white-baggy-tee`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    cut: `baggy-tee`,
    color: `#e5e5e2`
}, {
    name: `Black Baggy Tee`,
    value: `black-baggy-tee`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `baggy-tee`,
    color: `#16181b`
}, {
    name: `Dead Air Tee`,
    value: `after-hours-tee`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `baggy-tee`,
    color: `#16181b`
}, {
    name: `Off Axis Tee`,
    value: `slow-burn-tee`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `baggy-tee`,
    color: `#16181b`
}, {
    name: `Dead Air Cobalt`,
    value: `dead-air-cobalt`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `baggy-tee`,
    color: `#284c86`
}, {
    name: `Off Axis Violet`,
    value: `off-axis-violet`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `baggy-tee`,
    color: `#665185`
}, {
    name: `Haze Tee`,
    value: `haze-tee`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `baggy-tee`,
    color: `#9483ac`
}, {
    name: `Broadcast Tee`,
    value: `broadcast-tee`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `baggy-tee`,
    color: `#559daf`
}, {
    name: `Static 09 Long`,
    value: `static-09-long`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `baggy-long`,
    color: `#31373b`
}, {
    name: `Ridge 08 Long`,
    value: `ridge-08-long`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `baggy-long`,
    color: `#b18b43`
}, {
    name: `Grey Baggy Tee`,
    value: `grey-baggy-tee`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `baggy-tee`,
    color: `#6f7174`
}, {
    name: `White Baggy Long Sleeve`,
    value: `white-baggy-long`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `baggy-long`,
    color: `#e5e5e2`
}, {
    name: `Black Baggy Long Sleeve`,
    value: `black-baggy-long`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `baggy-long`,
    color: `#16181b`
}, {
    name: `Grey Baggy Long Sleeve`,
    value: `grey-baggy-long`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    cut: `baggy-long`,
    color: `#6f7174`
}, ...i, ...E, ..._]
  , B = [{
    name: `Park Twin`,
    value: `park-twin`,
    rarity: `standard`,
    unlock: {
        score: 0
    }
}, {
    name: `Fingerprint`,
    value: `fingerprint`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#f2f3f0`
}, {
    name: `Pro Red`,
    value: `pro-red`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    color: `#d4152b`
}, {
    name: `Teal Crackle`,
    value: `teal-crackle`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#141619`
}, {
    name: `Steezy`,
    value: `tiles`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#ff5a4e`
}, {
    name: `Butter`,
    value: `outline-art`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#fbe7cf`
}, {
    name: `Gradient 7`,
    value: `gradient-seven`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    color: `#d7266e`
}, {
    name: `Shred`,
    value: `wavelength`,
    rarity: `rare`,
    unlock: {
        granted: !0
    },
    color: `#f1b52a`
}, {
    name: `Send It`,
    value: `paint-splash`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    color: `#f7f7f4`
}, {
    name: `Lime Pipe`,
    value: `lime-pipe`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#111214`
}, {
    name: `Park Rat`,
    value: `park-camo`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#6b7a3a`
}, {
    name: `Tweak`,
    value: `psyche`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    color: `#ff2e88`
}, {
    name: `Stomped`,
    value: `spray`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#15161a`
}, {
    name: `Nordlys`,
    value: `nordlys`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#0d3b4c`
}, {
    name: `Woodie`,
    value: `woodie`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#d8b98a`
}, ...D, ...v, ...l]
  , V = [{
    name: `Park Binding`,
    value: `park-binding`,
    rarity: `standard`,
    unlock: {
        score: 0
    }
}, {
    name: `Jester`,
    value: `jester`,
    rarity: `epic`,
    unlock: {
        granted: !0
    }
}, {
    name: `Attack`,
    value: `attack`,
    rarity: `epic`,
    unlock: {
        granted: !0
    }
}, {
    name: `Turntable`,
    value: `turntable`,
    rarity: `epic`,
    unlock: {
        granted: !0
    }
}, {
    name: `High Back`,
    value: `high-back`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    }
}, {
    name: `High Back Red`,
    value: `high-back-red`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    }
}, {
    name: `High Back White`,
    value: `high-back-white`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    }
}, {
    name: `High Back Army`,
    value: `high-back-army`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    }
}, {
    name: `High Back Teal`,
    value: `high-back-teal`,
    rarity: `epic`,
    unlock: {
        granted: !0
    }
}, {
    name: `High Back Orange`,
    value: `high-back-orange`,
    rarity: `epic`,
    unlock: {
        granted: !0
    }
}, {
    name: `High Back Blackout`,
    value: `high-back-black`,
    rarity: `epic`,
    unlock: {
        granted: !0
    }
}, {
    name: `High Back Sand`,
    value: `high-back-sand`,
    rarity: `epic`,
    unlock: {
        granted: !0
    }
}, {
    name: `High Back Blue`,
    value: `high-back-blue`,
    rarity: `epic`,
    unlock: {
        granted: !0
    }
}]
  , H = [{
    name: `Park Boot`,
    value: `park-boot`,
    rarity: `standard`,
    unlock: {
        score: 0
    }
}, {
    name: `Park Cabrio Aqua`,
    value: `park-aqua`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#27b7c4`
}, {
    name: `Park Cabrio Fluo`,
    value: `park-fluo`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#e3ec27`
}, {
    name: `Park Cabrio Mocha`,
    value: `park-mocha`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#16181b`
}, {
    name: `Park Cabrio Pink`,
    value: `park-pink`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#f2509b`
}, {
    name: `Mismatch`,
    value: `mismatch`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    color: `#f1f1ee`
}, {
    name: `Mismatch White`,
    value: `mismatch-white`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    color: `#f1f1ee`
}, {
    name: `Camo Classic`,
    value: `camo-classic`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#4f5a32`
}, {
    name: `Two-Buckle Gold`,
    value: `two-buckle-gold`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    color: `#16181b`
}, {
    name: `Four-Buckle Race`,
    value: `four-buckle-race`,
    rarity: `rare`,
    unlock: {
        granted: !0
    },
    color: `#7c8287`
}, {
    name: `Board Boot`,
    value: `board-boot`,
    rarity: `standard`,
    unlock: {
        score: 0
    },
    color: `#16181b`,
    board: !0
}, ...j, ...de]
  , U = [{
    name: `Grey Beanie`,
    value: `grey-beanie`,
    rarity: `standard`,
    unlock: {
        score: 0
    },
    under: `beanie`,
    color: `#6f7174`
}, {
    name: `No Headwear`,
    value: `short-hair`,
    rarity: `standard`,
    unlock: {
        score: 0
    },
    under: `hair`,
    color: `#4d3b2e`
}, {
    name: `Cream Beanie`,
    value: `cream-beanie`,
    rarity: `legendary`,
    unlock: {
        granted: !0,
        season01: 2e5
    },
    under: `beanie`,
    color: `#bcb19c`
}, {
    name: `Black Balaclava`,
    value: `balaclava-black`,
    rarity: `standard`,
    unlock: {
        granted: !0
    },
    under: `balaclava`,
    color: `#16181b`
}, {
    name: `White Balaclava`,
    value: `balaclava-white`,
    rarity: `standard`,
    unlock: {
        granted: !0
    },
    under: `balaclava`,
    color: `#e5e5e2`
}, {
    name: `Grey Balaclava`,
    value: `balaclava-grey`,
    rarity: `standard`,
    unlock: {
        granted: !0
    },
    under: `balaclava`,
    color: `#6f7174`
}, {
    name: `Soft Neck`,
    value: `soft-neck`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    under: `hair`,
    color: `#4d3b2e`,
    cut: `soft-neck`,
    clothColor: `#30363a`
}, {
    name: `Bald`,
    value: `bald`,
    rarity: `mythic`,
    unlock: {
        granted: !0
    },
    under: `bald`,
    color: `#9e6f57`
}]
  , W = [{
    name: `Park Mitten`,
    value: `park-mitten`,
    rarity: `standard`,
    unlock: {
        score: 0
    }
}, {
    name: `Heli Grey`,
    value: `heli-grey`,
    rarity: `epic`,
    unlock: {
        granted: !0
    }
}, {
    name: `Heli Black`,
    value: `heli-black`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    }
}, {
    name: `Bare Hands`,
    value: `bare-hands`,
    rarity: `standard`,
    unlock: {
        granted: !0
    }
}, ...A, ...ue]
  , G = [{
    name: `Park Board`,
    value: `park-board`,
    rarity: `standard`,
    unlock: {
        score: 0
    }
}, {
    name: `Team Issue 03`,
    value: `team-issue-03`,
    rarity: `rare`,
    unlock: {
        granted: !0
    },
    color: `#d6532b`,
    print: !0
}, {
    name: `Lift Rats 06`,
    value: `lift-rats-06`,
    rarity: `rare`,
    unlock: {
        granted: !0
    },
    color: `#bdca52`,
    print: !0
}, {
    name: `Afterimage 08`,
    value: `afterimage-08`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#8c73bd`,
    print: !0
}, {
    name: `Bad Reception 10`,
    value: `bad-reception-10`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#296fce`,
    print: !0
}, {
    name: `Hot Lap 12`,
    value: `hot-lap-12`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#ee6584`,
    print: !0
}, {
    name: `Moon Ritual 14`,
    value: `moon-ritual-14`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    color: `#232b45`,
    print: !0
}, {
    name: `Bonk`,
    value: `bonk`,
    rarity: `rare`,
    unlock: {
        granted: !0
    },
    color: `#7ec4e7`,
    print: !0
}, {
    name: `Slush`,
    value: `slush`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#a9dac5`,
    print: !0
}, {
    name: `Stomp`,
    value: `stomp`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#646a53`,
    print: !0
}, {
    name: `Tweaked`,
    value: `tweaked`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    color: `#352a4e`,
    print: !0
}, {
    name: `Knuckle`,
    value: `knuckle`,
    rarity: `rare`,
    unlock: {
        granted: !0
    },
    color: `#b85b3c`,
    print: !0
}, {
    name: `Send It`,
    value: `send-it`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#f3c83f`,
    print: !0
}, {
    name: `White Room`,
    value: `white-room`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    color: `#a8bfd1`,
    print: !0
}, {
    name: `Yard Sale`,
    value: `yard-sale`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    color: `#48352c`,
    print: !0
}, ...O, ...ce, ...u]
  , Ee = [{
    name: `Skis`,
    value: `skis`
}, {
    name: `Snowboard`,
    value: `board`
}]
  , K = [{
    name: `Park Silver`,
    value: `goggle-park-silver`,
    rarity: `standard`,
    unlock: {
        score: 0
    },
    lens: `#c4d0d8`,
    frame: `#f3f3f1`,
    cut: `park`
}, {
    name: `No Goggles`,
    value: `goggle-none`,
    rarity: `standard`,
    unlock: {
        score: 0
    },
    lens: `#c4d0d8`,
    frame: `#f3f3f1`,
    cut: `park`
}, {
    name: `Park Blue`,
    value: `goggle-park-blue`,
    rarity: `standard`,
    unlock: {
        score: 0
    },
    lens: `#75c4e2`,
    frame: `#f3f3f1`,
    cut: `park`
}, {
    name: `Park Violet`,
    value: `goggle-park-violet`,
    rarity: `standard`,
    unlock: {
        granted: !0
    },
    lens: `#9e72d8`,
    frame: `#f3f3f1`,
    cut: `park`
}, {
    name: `Park Yellow`,
    value: `goggle-park-yellow`,
    rarity: `standard`,
    unlock: {
        score: 0
    },
    lens: `#e4bf5c`,
    frame: `#f3f3f1`,
    cut: `park`
}, {
    name: `Park Black`,
    value: `goggle-park-black`,
    rarity: `standard`,
    unlock: {
        granted: !0
    },
    lens: `#445363`,
    frame: `#f3f3f1`,
    cut: `park`
}, {
    name: `Park Pink`,
    value: `goggle-park-pink`,
    rarity: `standard`,
    unlock: {
        granted: !0
    },
    lens: `#cc89ae`,
    frame: `#f3f3f1`,
    cut: `park`
}, {
    name: `Park Copper`,
    value: `goggle-park-copper`,
    rarity: `standard`,
    unlock: {
        granted: !0
    },
    lens: `#e19859`,
    frame: `#f3f3f1`,
    cut: `park`
}, {
    name: `Prism Aurora`,
    value: `goggle-prism-aurora`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    lens: `#75c4e2`,
    frame: `#16181b`,
    cut: `prism`,
    gradient: `aurora`
}, {
    name: `Prism Sunset`,
    value: `goggle-prism-sunset`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    lens: `#e4bf5c`,
    frame: `#16181b`,
    cut: `prism`,
    gradient: `sunset`
}, {
    name: `Prism Blackout`,
    value: `goggle-prism-black`,
    rarity: `legendary`,
    unlock: {
        granted: !0
    },
    lens: `#303943`,
    legacyLens: `#445363`,
    frame: `#101114`,
    cut: `prism`,
    finish: `black`
}, {
    name: `Prism Silver`,
    value: `goggle-prism-silver`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    lens: `#e7ecf0`,
    legacyLens: `#c4d0d8`,
    frame: `#16181b`,
    cut: `prism`,
    finish: `silver`
}, {
    name: `Prism Clear`,
    value: `goggle-prism-clear`,
    rarity: `epic`,
    unlock: {
        granted: !0
    },
    lens: `#e4eff4`,
    legacyLens: `#c4d0d8`,
    frame: `#16181b`,
    cut: `prism`,
    finish: `clear`
}, ...M, ...fe]
  , q = {
    riderStyle: re,
    skinTone: s,
    hairStyle: ie,
    hairTone: ae,
    goggleItem: K,
    strapPrint: Ce,
    strapStyle: we,
    helmetItem: I,
    pantsItem: L,
    polesItem: R,
    jacketItem: z,
    skiItem: B,
    bindingItem: V,
    headItem: U,
    bootItem: H,
    gloveItem: W,
    ride: Ee,
    boardItem: G
}
  , De = Object.keys(q)
  , J = {
    ...oe,
    goggleItem: `goggle-park-silver`,
    jacket: `#286d70`,
    pants: `#303946`,
    helmet: `#14181d`,
    goggles: `#c4d0d8`,
    boots: `#70767c`,
    skis: `#ea1018`,
    board: `#d43b42`,
    strapPrint: `logo`,
    strapStyle: `over`,
    helmetItem: `park`,
    pantsItem: `ripstop`,
    polesItem: `bmx-grip`,
    jacketItem: `park-shell`,
    skiItem: `park-twin`,
    bindingItem: `park-binding`,
    headItem: `grey-beanie`,
    bootItem: `park-boot`,
    gloveItem: `park-mitten`,
    ride: `skis`,
    boardItem: `park-board`
}
  , Oe = new Set([`magnet-pro`, `agent-tour`, `paintbrush`, `leopard`, `bamboo`, `street-tape`])
  , ke = new Set([`coach-jacket`, `dayoff-pullover`, `loft-puffer`]);
function Y(e) {
    if (!e || typeof e != `object`)
        return null;
    let t = e
      , n = {
        ...J
    };
    for (let e of Se)
        if (!(t[e] === void 0 && [`goggles`, `boots`, `skis`, `board`].includes(e))) {
            if (!F[e].some(n => n.color === t[e]))
                return null;
            n[e] = t[e]
        }
    n.helmet = J.helmet;
    for (let e of De) {
        if (e === `hairStyle` && t[e] === `auto` || t[e] === void 0 || e === `polesItem` && Oe.has(t[e]) || e === `jacketItem` && ke.has(t[e]))
            continue;
        let r = q[e].find(n => n.value === t[e]);
        if (!r)
            return null;
        Object.assign(n, {
            [e]: r.value
        })
    }
    return t.goggleItem === void 0 && (n.goggleItem = X(n.goggles).value),
    n
}
var Ae = e => Y(e) ?? {
    ...J
};
function je(e) {
    let t = Y(e);
    if (t || !e || typeof e != `object`)
        return t ?? {
            ...J
        };
    let n = e
      , r = {
        ...J
    };
    for (let e of Object.keys(J)) {
        let t = Y({
            ...J,
            [e]: n[e]
        });
        t && Object.assign(r, {
            [e]: t[e]
        })
    }
    return n.goggleItem === void 0 && (r.goggleItem = X(r.goggles).value),
    r
}
var X = e => K.find(t => t.value !== `goggle-none` && t.cut === `park` && t.lens === e) ?? K[0]
  , Me = e => K.find(t => t.value === e.goggleItem) ?? X(e.goggles)
  , Ne = e => {
    let t = Me(e);
    return `legacyLens` in t ? t.legacyLens : t.lens
}
  , Pe = e => e.goggleItem !== `goggle-none`;
function Fe(e) {
    let t = L.find(t => t.value === e.pantsItem);
    return t && `color` in t ? t.color : e.pants
}
function Ie(e) {
    let t = z.find(t => t.value === e.jacketItem);
    return t && `color` in t ? t.color : e.jacket
}
function Le(e) {
    let t = z.find(t => t.value === e.jacketItem);
    return t && `band` in t ? t.band : null
}
function Re(e) {
    let t = z.find(t => t.value === e.jacketItem);
    return t && `lower` in t ? t.lower : null
}
var ze = (e, t=[]) => G.some(n => $(n, e, t))
  , Z = e => e?.ride === `board`
  , Be = `board-boot`
  , Ve = new Set(H.filter(e => `board` in e && e.board).map(e => e.value))
  , Q = e => Ve.has(e.value)
  , He = e => Z(e) ? Q({
    value: e.bootItem
}) ? e : {
    ...e,
    bootItem: Be
} : Q({
    value: e.bootItem
}) ? {
    ...e,
    bootItem: J.bootItem
} : e
  , Ue = e => e.helmetItem !== `none`
  , We = `no-poles`
  , Ge = e => e.polesItem !== We
  , Ke = new Set([...h.map(e => e.value), ...w.map(e => e.value), `silver-pro`, `blue-fork`, `cc-rec`, `cc-rec-white`, `cc-rec-blue`, `cc-rec-red`, `cork7-cup-winner`, `starline`, `slow-burn`, `pit-lane`, `hot-head-cobalt`, `deck-tape-violet`, `haze-lid`])
  , qe = e => Ue(e) && !Ke.has(e.helmetItem) ? e.strapStyle : `under`
  , Je = e => U.find(t => t.value === e.headItem) ?? U[0]
  , Ye = e => Je(e).under;
function Xe(e) {
    let t = G.find(t => t.value === e.boardItem);
    return t && `color` in t ? t.color : e.board
}
function Ze(e) {
    let t = H.find(t => t.value === He(e).bootItem);
    return t && `color` in t ? t.color : e.boots
}
var $ = (e, t, n=[]) => `score` in e.unlock && t >= e.unlock.score || n.includes(e.value);
new Set([...K, ...I, ...L, ...R, ...z, ...B, ...V, ...U, ...H, ...W, ...G].map(e => e.value));
var Qe = (e, t, n) => {
    let r = z.find(t => t.value === e.jacketItem);
    return !!r && $(r, t, n)
}
  , $e = (e, t, n=[]) => Qe(e, t, n) ? e : {
    ...e,
    jacketItem: J.jacketItem
};
export {l as $, Ae as A, Ge as B, Me as C, Le as D, $ as E, je as F, ye as G, be as H, qe as I, f as J, he as K, Ye as L, Te as M, Y as N, Ie as O, Z as P, c as Q, Pe as R, Ne as S, Q as T, y as U, $e as V, b as W, u as X, me as Y, se as Z, B as _, W as a, o as at, Ze as b, I as c, N as d, ae as et, q as f, Ee as g, R as h, J as i, a as it, Fe as j, Re as k, z as l, L as m, G as n, ee as nt, K as o, ne as ot, F as p, d as q, H as r, i as rt, U as s, V as t, s as tt, We as u, Xe as v, Je as w, He as x, ze as y, Ue as z};
