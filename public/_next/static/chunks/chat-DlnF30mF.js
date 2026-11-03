var e = new Map(`аa вb еe ѐe ёe һh іi їi јj кk мm нh оo рp сc тt уy хx ѕs ԁd ԛq ԝw ӏl ɡg ɢg ɪi ɴn ᴀa ʙb ᴄc ᴅd ᴇe ғf ʜh ᴊj ᴋk ʟl ᴍm ᴏo ᴘp ʀr ᴛt ᴜu ᴠv ᴡw ʏy ᴢz αa βb εe ηn ιi κk νv οo ρp τt υu χx ϲc ϳj ıi ɩi ǀl ոn ռn սu օo ցg հh զq քp աw ɑa`.split(` `).filter(Boolean).map(e => [e[0], e.slice(1).trim()]));
function t(t) {
    let n = ``;
    for (let r of t.normalize(`NFKC`))
        n += e.get(r) ?? e.get(r.toLowerCase()) ?? r;
    return n.normalize(`NFD`).replace(/\p{M}/gu, ``).toLowerCase()
}
var n = `013456789`
  , r = `oieasgtbg`
  , i = e => {
    let t = ``;
    for (let i of e) {
        let e = n.indexOf(i);
        t += e >= 0 ? r[e] : i
    }
    return t
}
  , a = `n[ijl][gq](a|er|u[hr]|ha|let|nog)|(^|[^aeiouy])n[ijl][gq]r[ae]|n[ijl][gq]r[ae]s?$|n[ijl]h[gq](a|er|uh)|n[ijl]c[gq]er|negro|neger|ne[jy]ger|ni[gq][ht]ers?$|nit[gq]ers?$`
  , o = [`nigeria`, `niqab`, `montenegro`, `negroni`, `nonigamer`, `schwarzeneger`, `honeger`]
  , s = `n[aeiouy]+g{2,}([aeiouy]*r|a|uh)|n[ijl][iyjl]*[gq]{2,}|n[ijl][iyjl]*h{2,}([aeiouy]*r|a|uh)|n[ijl]y{2,}([aeiouy]*r|a|uh)|n[ijl]c+[gq]{2,}([aeiouy]*r|a|uh)|reg{2,}[iy]+n|n[ijl]b{2,}(a|er)|v[ijl][gq]{2,}er`
  , c = [`snygg`, `schwarzenegger`, `honegger`, `reggina`, `aggress`, `aggrav`, `aggreg`]
  , l = `^(nig|nige|nigs|nigz|nigr|negr)$`
  , u = `^(ngg|nger|ngr|nga|nigr)`
  , d = `[^aeioun]nga+$`
  , f = new RegExp(a)
  , p = new RegExp(o.join(`|`),`g`)
  , m = new RegExp(s)
  , h = new RegExp(c.join(`|`),`g`)
  , ee = new RegExp(l)
  , te = new RegExp(u)
  , ne = new RegExp(d)
  , re = RegExp(`^(?:${a})`)
  , ie = RegExp(`^(?:${s})`);
function g(e, t=!1) {
    let n = e.replace(/[^a-z]/g, ``).replace(/(.)\1+/g, `$1`).replace(p, ``);
    return (t ? re : f).test(n)
}
function ae(e, t=!1) {
    let n = e.replace(/[^a-z]/g, ``).replace(h, ``);
    return (t ? ie : m).test(n)
}
function _(e, t=!1) {
    return g(e, t) || ae(e, t)
}
function v(e, t) {
    let n = e.replace(/1/g, ``);
    return {
        spelled: [i(e), i(n.replace(/8/g, `9`))],
        safe: [t(e), i(n), e.replace(/[0-9]/g, ``)]
    }
}
function y(e) {
    let t = e.replace(/[^a-z]/g, ``);
    return te.test(t) || ne.test(t) || ee.test(t.replace(/(.)\1+/g, `$1`))
}
var b = `nigg.niger.nigar.niga.nigah.nibba.neger.faggot.fag.tranny.kike.spic.chink.coon.gook.svarting.pakkis.neegy.neggy.nigy.migga.migger.higger.miger.nihaga.jigaboo.jiggabo.jigabo.fagot.fagots.faggit.fagit.nijja.faggy.nigea`.split(`.`)
  , x = `àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþßÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ`
  , S = `aaaaaaaceeeeiiiidnoooooouuuuytsyaaaaaaaceeeeiiiidnoooooouuuuyt`
  , C = `0134578`
  , oe = `oieastb`
  , se = `Letters, numbers, spaces, - and _ · 3–20 characters · one rider per name`;
function ce(e, t=Date.now()) {
    let n = e ? Date.parse(e) : NaN;
    if (!Number.isFinite(n))
        return null;
    let r = n + 14 * 864e5;
    return r > t ? r : null
}
var le = e => new Date(e).toLocaleDateString(`en-GB`, {
    day: `numeric`,
    month: `short`
});
function ue(e, t=Date.now()) {
    let n = e ? Date.parse(e) : NaN;
    return Number.isFinite(n) && n > t ? n : null
}
var de = e => new Date(e).toLocaleTimeString(`en-GB`, {
    hour: `2-digit`,
    minute: `2-digit`
})
  , fe = /^rider_[0-9a-f]{12}$/
  , pe = e => `rider_${e.replaceAll(`-`, ``).slice(0, 12)}`;
function me(e, t) {
    let n = typeof t == `string` ? t.trim() : ``;
    return n && !He(n) && !fe.test(n) ? [n, pe(e)] : [pe(e)]
}
var w = `fuck.cunt.nigg.faggot.retard.whore.slut.bitch.shit.pussy.twat.wank.jizz.dickhead.asshole.arsehole.motherf.rapist.pedophil.paedophil.hitler.porn.molest.incest.vagina.blowjob.handjob.cocksuck.dildo.tranny.milf.faen.fittetryne.fittekuk.kuksuger.morrapuler.drittsekk.rasshol.raevhol.ravhol.knull.ludder.svarting.pakkis.neger.jaevla.javla.jaevel.puler.xvideo.xvidoe.xnxx.xhamster.redtube.brazzers.jigaboo.jiggabo.jigabo.creampie.masterbat.masturbat.masterdebat.masterbait.sodomy.jerkoff.jackoff.sendnudes.gangbang.gngbang.fvck.fxck`.split(`.`)
  , T = `ass.arse.dick.cock.cum.sex.tit.tits.boob.boobs.anal.penis.fag.kike.spic.chink.coon.gook.rape.nazi.pedo.hoe.thot.kys.raper.rapers.rapes.raped.raping.niger.nigar.niga.nigah.nibba.kkk.heil.fitte.fitta.kuk.kukk.pikk.hore.homo.mongo.tispe.pule.dritt.javel.jevel.kms.fags.faggs.tards.bbc.semen.titts.titties.fck.fcking.fckin.fcken.fuk.fuks.fuking.fukin.fukking.fuvk.fukchu.fking.fkin.fkn.bich.biatch.bieatch.beatch.bitkh.bih.pussi.pusys.pussies.dih.nude.nudes.horny.sybau.fagot.fagots.faggit.fagit.pedow.neegy.neggy.nigy.migga.migger.higger.miger.nihaga.fcker.fckr.fcked.shyt.vitch.dik.fap.faps.fapping.gooning.nijja.nijjas.dck.dcks.pssy.btch.btchs.btches.fckn.cck.faggy.nigea`.split(`.`)
  , E = `epstein.diddy.hitle.nazi.pedo.penis.sexy.buttsex.butsex.cumshot.cuminmy.cumdump.cumslut.dickeat.eatdick.dickrid.dicksuck.suckdick.mydick.bigdick.sdick.dongdick.donkydick.donkeydick.ondick.torape.marape.gonnarape.rapeu.rapeyou.rapeme.rapeher.rapehim.isgay.runk.kuken.kukost.kokain.cocain.hatejew.jewexterm.killjew.jewkill.jodedrep.heilhilt.isajew.israeljew.isrealjew.neegy.neggy.neggey.nigy.nayguh.naygah.ngrboy.nigball.hitla.fagg.fagsfor.tard.ishomo.erhomo.chink.blatte.kanker.africanmonkey.blackmonkey.chinesemonkey.chinamonkey.asianmonkey.sgay.istgay.jegay.argay.mightbegay.gayhoe.hugecock.bigcock.blackcock.thundercock.steezycock.mycock.cockrider.coxuck.coxuk.coksuk.rapestein.ballsdeep.ballsack.ballsac.ballzsak.ballzac.ballsuck.hairyball.bigballs.myballs.themballs.sweatyball.ballsitch.ballsare.likesballs.ballsmack.ballsick.horny.sperm.semenking.semenator.titty.oxlong.hughjass.hughjas.hughjanus.fingermyass.toesuck.lesbiantoe.knobjock.peen.sexo.sextrem.sexz.suicid.killmyself.killyourself.osamabin.binlad.binlag.taliban.twotower.bushdid.nigwork.naygig.nihboy.nihdig.bignih.blacknih.adolf.jewhunt.jewhater.blackhater.epstien.epsteez.diddler.edp445.likeyear.lovekids.likekids.likeskids.lilkekid.luvkids.cominmy.inmyass.inmybut.butthol.buttplug.queef.jerkmate.johnnysins.jonnysins.pusy.puzzy.wallowcum.mrcock.gooning.itchyball.stickyball.styckyball.bigballed.suckadic.suckakdic.itchbay.horunge.dih.philmcrack.sisterfist.bootybandit.mommysmilk.stiffylong.foreskin.4skin.nikkaball.skigga.greasyhole.scatlord.knobhead.poepchin.netanyahu.bigyahu.charliekirk.chairlekirk.gayjew.jewonetwo.higger.migger.migga.nigear.nigorkil.nigz.nikgg.jiggerkil.nlackbigger.nuppidstigger.kiljew.klljew.kilijew.jewgas.jwegas.gasjew.jewanyahu.genocid.sodom.pairyhubes.hairypube.pubes.pubic.cokrider.sucksdik.suckdik.mydik.bigdik.smalldik.elusivedik.daddysgood.mommysgood.ilikechild.likechildren.likeschildren.lovechildren.touchkids.touchskids.kidtouch.jigger.breivik.cokane.cokesnif.bigcok.blackcok.longcok.mycok.thatcok.juicycok.piniscok.coksuck.cokcsuck.dikrid.diksuc.diknba.suhdik.takedik.grinddik.dikchee.dikkchee.bigusdik.dikmunk.nibba.hitlr`.split(`.`)
  , he = `diddykong.torpedo.speedo.pedometer.nazir.nazim.nazia.nazif.therapeu.drunk.trunk.crunk.shrunk.frunk.grunk.dickens.dickinson.dickerson.dickey.dickie.whitle.jewel.ashkenazi.hitless.runkeep.stard.leotard.petard.tardy.tardi.margay.thorny.speen.asperm.blatter.adolfo.puller.millf.trappist.shiite.shiitake.schwarzenegger.honegger.davidih.wadih.4skiing.4sking.chigger.miggan.breiviks.cook.minigear.omnigear.raccoon.racoon.tycoon.cocoon.coonhound.coonskin.mainecoon.jewett.jewitt.jewkes`.split(`.`)
  , ge = [`dih`, `bich`, `bih7`, `nicok`, `mike-cok`, `beacok`, `chronicok`, `jiggernews`, `dik-mo`]
  , _e = [`fag`, `cok`]
  , D = e => e.replace(/(.)\1+/g, `$1`)
  , O = e => `(${[...new Set(e.map(D))].join(`|`)})`
  , ve = `^coon($|[^aeiouy])|coon$|^koon$|[ck]oon(boy|boi|man|men|king|lord|kid|life|gang|hunter|killer|lover|hater|jew|monkey|nig|black)`
  , ye = `(big|lil|little|the|da|dirty|filthy|stupid|ugly|fat|black|my|ur|your|jew|monkey|nig)[ck]oon`
  , k = [`jew`, `jode`, `joder`, `jodene`]
  , A = [`blacks`, `blackpeople`, `blackppl`, `blackguys`, `blackkids`, `blacklives`, `africans`, `muslims`, `muslimpeople`, `arabs`, `gays`, `gaypeople`, `homos`, `asians`, `chinese`, `mexicans`, `immigrants`, `gypsies`]
  , j = `hate.hating.h8.kill.slay.murder.gas.burn.oven.incinerat.cremat.destr.annihil.extermin.eradicat.decimat.desimat.genocid.lynch.shoot.stab.nuke.bomb.hunt.bash.maul.despise.dislike.deathto.shoulddie.mustdie`.split(`.`)
  , M = [`dirty`, `filthy`, `greedy`, `stinky`, `smelly`, `ugly`, `rat`, `pig`, `swine`, `vermin`, `roach`, `scum`, `trash`, `monkey`, `ape`, `slave`, `nig`, `kike`, `fag`, `raper`]
  , be = [`${O([...j, ...M])}${O([`s`, `z`, `ed`, `er`, `ers`, `r`, `a`, `ing`, `in`])}?${O([`the`, `all`, `da`, `dem`, `them`, `em`, `those`, `these`, `every`, `some`, `my`, `ur`, `your`, `on`, `to`, `a`])}?${O([...k, ...A])}`, `${O(k)}${O([`s`, `z`, `ish`, `ishpeople`, `people`, `ppl`])}?${O([...j, ...M])}`, `${O(A)}${O([`hate`, `h8`])}`, `black${O([`monkey`, `slave`, `hater`, `h8`])}|${O([`monkey`, `slave`, `hater`, `h8`])}black`].join(`|`)
  , xe = x.slice(0, x.indexOf(`À`))
  , Se = x.slice(x.indexOf(`À`))
  , N = `a-z${xe}`
  , P = `A-Z${Se}`
  , Ce = `admin.administrator.moderator.mod.staff.support.official.system.server.steez8.steez-8.steez.cork7.cork-7.cork.nordryggen.whiteout.rider.guest.anonymous.bot.you.me.developer.developers.dev-team.devteam.game-dev.gamedev.game-developer.tester.testers.beta-tester.owner`.split(`.`)
  , we = [`devtest`, `devtesert`]
  , F = [`dev`, `devs`, `developer`, `developers`, `staff`, `admin`, `administrator`, `mod`, `moderator`, `official`, `team`, `support`, `tester`, `testers`, `owner`]
  , Te = `^(steez8|steez|cork7|cork)(${F.join(`|`)})[0-9]*$|^(${F.join(`|`)})(steez8|steez|cork7|cork)[0-9]*$`
  , I = `A-Za-z${x}`
  , Ee = RegExp(`^[0-9${I}]([0-9${I} _-]*[0-9${I}])?$`)
  , L = RegExp(`[^0-9${I} _-]`);
new RegExp(L.source,`g`);
var De = new Map(Array.from(x, (e, t) => [e, S[t]]))
  , Oe = new RegExp(he.join(`|`),`g`)
  , ke = new RegExp(ve)
  , R = new RegExp(ye)
  , Ae = new RegExp(be)
  , je = RegExp(`([${N}])I`, `g`)
  , Me = RegExp(`([${N}])([${P}])`, `g`)
  , Ne = RegExp(`([${P}]{3,})([${N}])`, `g`)
  , Pe = RegExp(`([${P}]{2,})([${P}][${N}])`, `g`)
  , Fe = E.filter(e => !/(.)\1/.test(e))
  , z = w.filter(e => !/(.)\1/.test(e))
  , B = e => {
    let t = ``;
    for (let n of e) {
        let e = C.indexOf(n);
        t += e >= 0 ? oe[e] : n
    }
    return t
}
;
function V(e) {
    let t = ``;
    for (let n of e)
        t += De.get(n) ?? n.toLowerCase();
    return t.replace(/[^a-z0-9]+/g, `-`).replace(/^-+|-+$/g, ``)
}
function Ie(e) {
    let t = e.replace(Me, `$1-$2`)
      , n = new Set(V(e).split(`-`))
      , r = [t, t.replace(Ne, `$1-$2`), t.replace(Pe, `$1-$2`)].flatMap(e => V(e).split(`-`));
    return [...new Set(r)].filter(e => e && !n.has(e))
}
function Le(e) {
    let t = V(e)
      , n = t.replace(/-/g, ``)
      , r = B(n);
    if (ge.includes(t))
        return !1;
    let i = V(e.replace(je, `$1l`)).replace(/-/g, ``)
      , a = [n, r, i, B(n.replace(/1/g, `l`))];
    if (w.some(e => a.some(t => t.includes(e))))
        return !0;
    let o = e => e.replace(Oe, ``);
    if (E.some(e => a.some(t => o(t).includes(e))))
        return !0;
    let s = e => o(D(o(e)));
    if (Fe.some(e => a.some(t => s(t).includes(e))) || z.some(e => s(n).includes(e) || s(i).includes(e)) || a.some(e => Ae.test(s(e))))
        return !0;
    let c = v(n, B);
    if (c.spelled.some(e => g(e)) || c.safe.some(e => _(e)))
        return !0;
    let l = Ie(e)
      , u = [...t.split(`-`), ...l];
    if (u.some(e => {
        let t = v(e, B);
        return [...t.spelled, ...t.safe].some(e => y(e))
    }
    ))
        return !0;
    let d = u.filter(e => /[g-z]/.test(e)).map(e => e.replace(/[0-9]+/g, ``))
      , f = new Set([...t.split(`-`), ...B(t).split(`-`), ...l, ...l.map(B), ...d]);
    return [...f].some(e => _e.some(t => e.endsWith(t))) || [...f].some(e => ke.test(o(e))) || R.test(n) || R.test(r) ? !0 : T.some(e => f.has(e))
}
function Re(e) {
    let t = V(e)
      , n = t.replace(/-/g, ``)
      , r = B(n)
      , i = t.split(`-`);
    return we.some(e => n.includes(e) || r.includes(e)) || new RegExp(Te).test(n) ? !0 : i.some(e => e === `steez8` || e === `steez` || e === `cork7` || e === `cork`) && i.some(e => F.includes(e.replace(/[0-9]+$/, ``)))
}
function ze(e) {
    let t = V(e);
    return Ce.includes(t) || /^rider-[0-9]{1,3}$/.test(t) || Re(e)
}
var Be = {
    empty: `Choose a rider name.`,
    short: `At least 3 characters.`,
    long: `At most 20 characters.`,
    chars: `Only letters, numbers, spaces, - and _.`,
    shape: `Start and end with a letter or number, one space or dash at a time.`,
    blocked: `Keep it clean — pick another name.`,
    reserved: `That name is reserved.`
};
function Ve(e) {
    if (!e)
        return `empty`;
    let t = Array.from(e).length;
    return t < 3 ? `short` : t > 20 ? `long` : L.test(e) ? `chars` : !Ee.test(e) || /[ _-]{2}/.test(e) ? `shape` : Le(e) ? `blocked` : ze(e) ? `reserved` : null
}
function He(e) {
    let t = Ve(e);
    return t ? {
        issue: t,
        message: Be[t]
    } : null
}
var Ue = [`GG`, `Nice!`, `Sick line!`, `Race you?`, `Follow me`, `Wait for me`, `Haha`, `🔥`]
  , We = e => Ue[e] ?? ``
  , Ge = [`language`, `bullying`, `contact`, `cheating`, `name`, `other`]
  , H = new Map(Array.from(x, (e, t) => [e, S[t]]))
  , Ke = new Map([[`æ`, `ae`], [`ø`, `oe`], [`å`, `aa`], [`Æ`, `ae`], [`Ø`, `oe`], [`Å`, `aa`]])
  , qe = new Map([...Array.from(C, (e, t) => [e, oe[t]]), [`@`, `a`], [`$`, `s`], [`!`, `i`], [`|`, `i`], [`¡`, `i`], [`£`, `e`], [`€`, `e`]])
  , Je = [`slutt`]
  , Ye = new Set([`javel`])
  , Xe = [`shiitake`, `shiite`, `puller`, `schwarzenegger`, `honegger`, `trappist`, `whittl`, `millf`, `poorness`]
  , U = e => e.replace(/(.)\1+/g, `$1`)
  , Ze = /^[!|¡*#]+|[!|¡*#]+$/g;
function W(e, n, r=!1) {
    let a = ``
      , o = ``;
    for (let t of e.replace(Ze, ``))
        a += (n ? Ke.get(t) : void 0) ?? t;
    for (let e of t(a))
        o += H.get(e) ?? (r ? i(e) === e ? void 0 : i(e) : void 0) ?? qe.get(e) ?? e;
    return o.replace(/[^a-z]/g, ``)
}
var G = [`nigga`, `niggas`, `niggah`, `nigger`, `niggers`, `niga`, `nigas`, `niger`, `nigers`, `negro`, `neger`, `faggot`, `faggots`, `fagot`, `fag`, `fags`, `tranny`, `kike`, `chink`, `coon`, `spic`]
  , Qe = `fuck.fucks.fucker.fucked.fucking.fuckin.shit.shits.shitty.bitch.bitches.cunt.dick.dicks.cock.pussy.porn.whore.hoe.hoes.slut.retard.retards.retarded.asshole.faen.hore`.split(`.`)
  , $e = /[*#&%]/;
function et(e) {
    let n = e.replace(/^[.,!?:;'"()]+|[.,!?:;'"()]+$/g, ``);
    if (/^[*#&%].*[*#&%]$/.test(n) && (n = n.replace(/^[*#&%]+|[*#&%]+$/g, ``)),
    !$e.test(n))
        return null;
    let r = ``
      , i = 0
      , a = 0;
    for (let e of t(n)) {
        if ($e.test(e)) {
            r += `[a-z]{1,2}`,
            a++;
            continue
        }
        if (e === `'` || e === `’`)
            continue;
        let t = H.get(e) ?? qe.get(e) ?? e;
        if (!/^[a-z]$/.test(t))
            return null;
        r += t,
        i++
    }
    if (i < 2 || a > 4)
        return null;
    let o = RegExp(`^${r}$`);
    return G.some(e => o.test(e)) ? `slur` : Qe.some(e => o.test(e)) ? `crude` : null
}
var tt = [...new Set([...G, ...Qe, ...T, ...w])]
  , nt = new Set(tt)
  , rt = {
    i: `[il]`,
    l: `[il]`,
    u: `[uv]`,
    v: `[uv]`
};
function it(e) {
    let n = e.replace(/^[.,!?:;'"()]+|[.,!?:;'"()]+$/g, ``)
      , r = /\p{Lu}/u.test(n)
      , i = (n.match(/[0-9@$!|£€^~+=?]/g) ?? []).length
      , a = ``
      , o = 0
      , s = 0;
    for (let e of t(n)) {
        if (/[0-9@$!|£€^~+=?]/.test(e)) {
            a += `[a-z]`;
            continue
        }
        if (e === `'` || e === `’`)
            continue;
        let t = H.get(e) ?? e
          , n = i || r ? rt[t] : void 0;
        if (!/^[a-z]$/.test(t))
            return null;
        a += n ?? t,
        o++,
        n && s++
    }
    if (o < 2 || i > 3 || i > o || o + i < 3 || !i && !s)
        return null;
    let c = RegExp(`^${a}$`);
    return tt.find(e => c.test(e) || !e.endsWith(`s`) && c.test(`${e}s`)) ?? null
}
var at = /^f[aeiouy]+g{2,}[aeiouy]+t+s?$|^f[aeiouy]+go{2,}t+s?$/
  , ot = /^(my|ur|your|yo|ya|da|the|big|lil|suck)(.+)$/;
function st(e) {
    let t = et(e);
    if (t)
        return t;
    let n = W(e, !1)
      , r = W(e, !0)
      , i = lt(e).map(e => W(e, !1, !0))
      , a = [W(e, !1), W(e.replace(/1/g, ``), !1, !0), W(e.replace(/[0-9]/g, ``), !1, !0)];
    if (i.some(e => g(e)) || a.some(e => _(e)) || [...i, ...a].some(e => y(e)))
        return `slur`;
    if (!r || Ye.has(r))
        return null;
    let o = e => b.includes(e) ? `slur` : `crude`;
    for (let e of [n, r]) {
        let t = Je.reduce( (e, t) => e.replaceAll(t, ``), e)
          , n = w.find(e => t.includes(e));
        if (n)
            return o(n)
    }
    let s = U(Xe.reduce( (e, t) => e.replaceAll(t, ``), Je.reduce( (e, t) => e.replaceAll(t, ``), n)))
      , c = z.find(e => s.includes(e));
    if (c)
        return o(c);
    let l = e => T.find(t => e === t || !t.endsWith(`s`) && e === `${t}s`)
      , u = l(r);
    if (u)
        return o(u);
    let d = r.replace(/(.)\1{2,}/g, `$1`)
      , f = d !== r && !ct.has(r.replace(/(.)\1{2,}/g, `$1$1`)) ? l(d) : void 0;
    if (f)
        return o(f);
    if (at.test(d))
        return `slur`;
    let p = d.match(ot)?.[2]
      , m = p ? l(p) : void 0;
    if (m)
        return o(m);
    let h = it(e);
    return h ? o(h) : null
}
var ct = new Set([`kyss`])
  , lt = e => [e, e.replace(/[*#]/g, `i`), e.replace(/1/g, ``).replace(/8/g, `9`), e.replace(/@@/g, `gg`)];
function ut(e) {
    let t = lt(e).map(e => W(e, !1, !0))
      , n = [W(e, !1), W(e.replace(/1/g, ``), !1, !0), W(e.replace(/[0-9]/g, ``), !1, !0)];
    return t.some(e => g(e, !0)) || n.some(e => _(e, !0))
}
var dt = new Set(`a.i.u.im.am.is.it.in.on.at.as.an.be.by.do.go.he.hi.if.me.my.no.of.oh.ok.or.so.to.up.us.we.ya.yo.ye.ur.uh.ah.ha.eh.gg.ez.gl.wp.og.jk.ty.np.lo.en.et.er.du.de.vi.jo.ja.na.pa.sa.av.om.se.ta.fa.ga.da.ti.il.ok`.split(`.`));
function ft(e) {
    let t = W(e, !1)
      , n = [t, W(e, !0), t.replace(/(.)\1{2,}/g, `$1`), U(t)].find(e => nt.has(e));
    return n ? b.includes(n) || G.includes(n) ? `slur` : `crude` : null
}
function pt(e) {
    let t = !1
      , n = Array.from(e.matchAll(/\S+/g), e => ({
        start: e.index,
        end: e.index + e[0].length,
        raw: e[0]
    }))
      , r = e.split(``)
      , i = new Set
      , a = e => {
        for (let t of e) {
            i.add(t);
            let e = t.raw.length - t.raw.replace(/^[!|¡*#]+/, ``).length
              , n = t.raw.length - t.raw.replace(/[!|¡*#]+$/, ``).length;
            for (let i = t.start; i < t.end; i++)
                (/[\p{L}\p{N}\p{So}@$£€]/u.test(r[i]) || i >= t.start + e && i < t.end - n && /[!|¡*#&%]/.test(r[i])) && (r[i] = `#`)
        }
    }
      , o = e => Array.from(e.raw).length === 1 || W(e.raw, !1).length === 1;
    for (let e = 0; e < n.length; ) {
        let r = e;
        if (o(n[e]))
            for (; r + 1 < n.length && o(n[r + 1]); )
                r++;
        let i = n.slice(e, r + 1)
          , s = st(i.map(e => e.raw).join(``));
        if (s)
            a(i),
            t ||= s === `slur`;
        else if (i.length > 1)
            for (let e of i) {
                let n = st(e.raw);
                n && (a([e]),
                t ||= n === `slur`)
            }
        e = r + 1
    }
    let s = e => W(e.raw, !1, !0).length
      , c = (e, t) => !i.has(e) && (Array.from(e.raw).length <= 4 || s(e) <= t);
    for (let e = 0; e + 1 < n.length; e++) {
        if (!c(n[e], 4) || !s(n[e]))
            continue;
        let r = n[e].raw;
        for (let i = e + 1; i < n.length && i <= e + 5 && c(n[i], 7); i++)
            if (r += n[i].raw,
            ut(r) || W(r, !1).length <= 4 && y(W(r, !1))) {
                a(n.slice(e, i + 1)),
                t = !0;
                break
            }
    }
    let l = e => U(W(e.raw, !1)).length;
    for (let e = 0; e + 1 < n.length; e++)
        for (let r = e + 1; r < n.length && r <= e + 3; r++) {
            let o = n.slice(e, r + 1);
            if (o.some(e => i.has(e) || !l(e) || l(e) > 6))
                break;
            if (!o.some(e => l(e) <= 2 && !dt.has(W(e.raw, !1))))
                continue;
            let s = ft(o.map(e => e.raw).join(``));
            if (s) {
                a(o),
                t ||= s === `slur`;
                break
            }
        }
    return {
        text: r.join(``),
        slur: t
    }
}
var K = e => `(?:${e.map(U).join(`|`)})`
  , q = K(`jew.jews.jewish people.jode.joder.jodene.judar.juden.joden.muslims.muslim people.muslimer.blacks.black people.black ppl.black kids.gays.gay people.gay ppl.gay kids.homos.homoer.homser.bogar.trans people.trans kids.asians.asian people.arabs.mexicans.immigrants.innvandrere.invandrare.gypsies.sigoynere.zigenare`.split(`.`))
  , mt = K([`hate`, `hates`, `hated`, `hating`, `hater`, `hata`, `hatar`, `kill`, `kills`, `killing`, `murder`, `gas`, `gassing`, `burn`, `lynch`, `shoot`, `nuke`, `bomb`, `exterminate`, `drep`, `drepe`, `dreper`, `doda`, `dodar`, `death to`])
  , ht = `(?:${K([`the`, `all`, `every`, `those`, `these`, `them`, `u`, `you`, `ya`, `alle`, `alla`, `de`, `dem`, `disse`, `fucking`, `fuckin`, `fking`, `fkn`, `freaking`])} )*`
  , gt = new RegExp([`\\b${mt} ${ht}${q}\\b`, `\\b${q} ${K([`should`, `must`, `deserve to`, `need to`, `have to`, `gotta`, `skal`, `ska`, `bor`, `borde`])} ${K([`die`, `burn`, `be killed`, `be gassed`, `get gassed`])}\\b`, `\\b${q} ${K([`skal`, `ska`, `should`, `must`])} do$`, `\\b${q} ${K([`are`, `r`, `is`, `er`, `ar`])} ${K([`rats`, `rat`, `pigs`, `vermin`, `evil`, `trash`, `garbage`, `animals`, `monkeys`, `apes`, `subhuman`, `parasites`, `scum`, `disgusting`, `rotter`, `svin`])}\\b`, `\\b${K([`dirty`, `filthy`, `greedy`, `stinky`, `smelly`, `stupid`, `dumb`, `ugly`])} ${K([`jew`, `jews`, `jode`, `joder`, `judar`])}\\b`, `\\b${q} ${K([`killer`, `killers`, `hunter`, `hunters`])}\\b`, `\\b${K([`heil hitler`, `heil hitla`, `sieg heil`, `hitler was right`, `hitler did nothing wrong`, `white power`, `holohoax`])}\\b`, `\\b${K([`ya`, `you`, `u`, `yo`, `ur a`, `your a`, `youre a`, `you are a`, `u r a`, `ur such a`, `your such a`, `shut up`, `stfu`, `fckin`, `fcking`, `fucking`, `fuckin`, `fking`, `fkin`, `fkn`, `freaking`])} ${K([`jew`, `jews`, `jode`])}\\b`, `\\b${K([`you`, `yous`, `u`, `yall`, `you guys`, `u guys`, `you all`])} ${K([`are`, `r`, `ar`])} (?:${K([`all`, `such`, `a`, `just`])} )*${K([`jew`, `jews`])}\\b`].join(`|`))
  , _t = [`hatejew`, `hatejoder`, `hatarjudar`, `killjew`, `killthejew`, `killalljew`, `gasjew`, `gasthejew`, `gasalljew`, `jewkill`, `jewhunt`, `deathtojew`, `heilhitler`, `heilhitla`, `siegheil`, `holohoax`, `drepjoder`, `jodedrep`].map(U)
  , J = e => e.split(/\s+/).map(e => U(W(e, !1))).filter(Boolean);
function vt(e) {
    let t = J(e);
    if (gt.test(t.join(` `)))
        return !0;
    let n = U(t.join(``).replace(/jewel/g, ``));
    return _t.some(e => n.includes(e))
}
var Y = K([`you`, `u`, `ya`, `yu`, `yo`, `yall`, `you guys`, `u guys`, `you all`, `yous`])
  , X = K([`your`, `ur`, `yo`, `ya`, `youre`, `yor`, `yur`])
  , yt = K([`yourself`, `urself`, `ur self`, `your self`, `you self`, `yo self`, `yoself`, `u self`, `uself`, `yourselves`, `urselves`, `yaself`])
  , Z = K([`mom`, `mum`, `mother`, `momma`, `mama`, `mommy`, `mamma`, `dad`, `father`, `daddy`, `family`, `fam`, `sister`, `sis`, `brother`, `parents`, `grandma`, `grandpa`, `nan`, `nana`])
  , bt = [`die`, `kill yourself`, `kill urself`, `kill ur self`, `kill your self`, `kill you self`, `hang yourself`, `unalive yourself`, `unalive urself`, `drink bleach`]
  , Q = `balls.bals.nuts.nut.d.dick.dik.dih.dic.cock.kok.cok.puh.pus.pussy.pusy.cum.kum.wiener.weiner.willy.ass.butt.booty.tits.boobs.boob.clit.penis.pp.sack.ballsack.privates.nipples.nips.dong.schlong.knob.wang.shaft.dicknbals.dicknballs`.split(`.`)
  , xt = new RegExp([`\\b${K([`kill`, `kills`, `hang`, `neck`, `unalive`, `stab`, `drown`, `end`])} ${yt}\\b`, `\\b${K([`hope`, `hoping`, `wish`, `pray`])} (?:that )?(?:${Y}|${X} ${Z}|${Y} and ${X} ${Z}) (?:${K([`will`, `gonna`, `just`, `would`])} )?${K([`die`, `dies`, `get cancer`, `gets cancer`, `get killed`, `gets killed`, `get raped`, `gets raped`, `kill yourself`, `kill urself`, `kill ur self`, `kill your self`, `rot`, `burn`])}\\b`, `\\b${K([`go`, `pls`, `plz`, `please`, `now go`])} ${K([...bt, `jump off a bridge`, `jump off a cliff`])}\\b`, `\\b${Y} ${K([`should`, `shud`, `shld`, `need to`, `have to`, `gotta`, `must`, `deserve to`])} ${K([...bt, `unalive`])}\\b`, `\\b${K([`kill`, `killed`, `killing`, `murder`, `murdered`, `stab`, `stabbed`, `rape`, `raped`, `raping`, `torture`, `tortured`, `tortur`, `behead`, `shoot`, `strangle`, `kidnap`, `kidnapped`])} (?:${K([`you and`, `u and`, `all`, `all of`])} )?${X} (?:${K([`whole`, `entire`])} )?${Z}\\b`, `\\b${K([`rape`, `raping`, `kidnap`, `stalk`, `stalking`])} ${Y}\\b`, `\\b${K([`i know`, `i kno`, `i no`, `ik`, `we know`, `i now`])} where ${Y} ${K([`live`, `liv`, `lives`, `stay`, `sleep`])}\\b`, `\\b${K([`im`, `i am`, `coming`, `comin`, `on my way`, `omw`, `outside`, `waiting outside`])} (?:${K([`to`, `at`, `by`, `in`, `near`, `outside`])} )?${X} ${K([`house`, `home`, `window`, `door`, `address`])}\\b`, `\\b${K([`got`, `have`, `know`, `found`, `traced`, `leaked`, `leak`, `grabbed`])} ${X} ${K([`ip`, `address`, `adress`, `addy`, `location`, `home address`])}\\b`, `\\b${X} ip ${K([`has been`, `is`, `was`, `got`, `been`, `is being`, `just got`])} ${K([`traced`, `leaked`, `found`, `grabbed`, `logged`])}\\b`, `\\b${K([`dox`, `doxed`, `doxxed`, `doxing`, `doxxing`, `swatted`, `swatting`])}\\b`, `\\b${K([`suck`, `suk`, `sucking`, `suckin`, `lick`, `licking`, `lickin`, `blow`, `nibble`])} (?:on )?(?:${K([`my`, `ma`, `mah`, `deez`, `dese`, `these`, `his`, `her`])}|${X}) (?:${K([`own`, `big`, `fat`, `small`, `little`, `tiny`, `hairy`, `sweaty`, `stinky`, `juicy`, `huge`, `long`])} )?${K([...Q, `toes`, `toe`, `feet`, `tip`, `meat`, `banana`, `pickle`, `bomba clat`, `bombaclat`])}\\b`, `\\b${K([`touch`, `touching`, `grab`, `grabbing`, `rub`, `rubbing`, `eat`, `eating`, `squeeze`, `play with`])} ${K([`my`, `ma`, `deez`, `his`, `her`, `your`, `ur`, `yo`, `ya`])} ${K(Q.filter(e => ![`d`, `nut`, `pus`, `sack`].includes(e)))}\\b`, `(?<!\\b(?:a|such a|being a|be a|the|big|total) )\\b${K([`jerk`, `jerks`, `jerking`, `jerkin`, `jerked`])} ${K([`to`, `it`, `off`])}\\b`, `\\b${K([`nut`, `nutted`, `nutting`, `cum`, `cummed`, `cumming`, `jizz`, `jizzed`])} ${K([`in`, `on`, `inside`, `all over`])} (?:${Y}|${X}|${K([`her`, `him`, `his`])})\\b`, `\\b${K([`finger`, `fingered`, `fingering`, `fingerd`])} (?:${Y}|${X} ${Z}|${X} ${K(Q)}|her)\\b`, `\\bsend (?:${K([`me`, `us`, `him`, `her`, `them`])} )?(?:${K([`ur`, `your`, `yo`, `ya`, `some`, `a`, `the`, `da`, `dem`, `those`, `more`])} )?${K([`nudes`, `nude`, `nudez`, `noods`, `noodz`, `nudies`, `d pic`, `d pics`, `dick pic`, `dick pics`, `dic pic`, `dic pics`, `dickpic`, `dickpics`, `feet pics`, `feet pic`, `boob pics`, `tit pics`, `nsfw`, `dirty pics`, `sexy pics`, `naked pics`, `naked`])}\\b`, `\\b${K([`want`, `need`, `give me`, `gimme`, `trade`, `see`])} (?:${K([`ur`, `your`, `some`, `ya`, `yo`, `da`])} )?${K([`nudes`, `noods`, `nudez`, `feet pics`])}\\b`, `\\b(?:${X}|${K([`my`, `her`, `his`, `some`, `moms`, `mums`, `mom`, `mum`, `mommy`, `mommys`, `mamas`, `sisters`, `dads`, `goth`])}) (?:${K([`hairy`, `tight`, `wet`, `smelly`, `stinky`, `juicy`, `fat`, `big`])} )?${K([`puh`, `pus`, `pussy`, `pusy`, `coochie`, `cooch`, `vag`, `vagina`, `clit`, `cooter`])}\\b`, `\\b${K([`hairy`, `tight`, `wet`, `juicy`])} ${K([`puh`, `pus`, `pussy`, `pusy`, `coochie`, `vag`])}\\b`].join(`|`))
  , St = /\bkys\b|\b(?:jack|jak|jerk)(?:ing|in|s|ed)? ?(?:it )?off\b|\bgoon(?:ing|in)\b|\bgoon (?:to|in|on|over|at)\b|\bddos(?:ed|ing|d)? (?:you|u|ur|your|ya)\b|\b(?:you|u|ur|youre|your) (?:[a-z]+ )?(?:getting|get|got) ddos(?:ed|d)\b/
  , $ = K([`gay`, `gae`, `gey`, `ghey`, `gai`, `fruity`, `gaylord`])
  , Ct = new RegExp([`(?<!\\b(?:if|even if|whether|when|maybe|and if) )\\b${K(`ur.your.youre.yor.u.you.ya.yu.yo.you are.u are.u r.you r.ur are.your are.yall.yall are.you guys.u guys.you guys are.u guys are.you all.you all are.ur all.your all.youre all.you are all.you both.u both.you both are.du er.du e.du ar.ni ar`.split(`.`))} (?:${K(`so.such.actually.actualy.really.realy.literally.literaly.lowkey.lowk.deadass.kinda.very.just.a.all.too.mad.hella.super.fr.ong.sa.helt.jo.sykt.sjukt`.split(`.`))} )*${$}\\b(?! ${K([`friend`, `friends`, `cousin`, `cousins`, `uncle`, `aunt`, `auntie`, `neighbor`, `neighbour`, `teacher`, `coworker`, `son`, `daughter`, `bar`, `club`, `pride`])}\\b)`, `\\b${K([`lil`, `little`, `smal`, `small`, `stupid`, `dumb`, `fat`, `ugly`, `fucking`, `fuckin`, `fking`, `fkn`, `fckin`, `fcking`, `dirty`])} ${$}\\b`, `\\b${$} ${K([`loser`, `losers`, `boy`, `boi`, `boys`, `retard`, `idiot`, `ahh`, `ah`, `freak`, `clown`, `bitch`, `ass`])}\\b`, `\\bstop being (?:so |such a )?${$}\\b`].join(`|`))
  , wt = new Set([`urgay`, `yourgay`, `youregay`, `ugay`, `yougay`, `urallgay`, `yourallgay`, `ursogay`, `yoursogay`].map(U));
function Tt(e) {
    let t = e.replace(/[\u{1F3FB}-\u{1F3FF}]|\uFE0F/gu, ``);
    return /👉👌|👌👈/u.test(t) || /🍆|🍑/u.test(t) && /💦|👅|🥵|😩|🤤|🫦/u.test(t)
}
function Et(e) {
    let t = J(e)
      , n = t.join(` `);
    return xt.test(n) || Ct.test(n) || t.some(e => wt.has(e)) ? !0 : St.test(e.split(/\s+/).map(e => W(e, !1)).filter(Boolean).join(` `)) || Tt(e)
}
var Dt = /\b(?:https?:\/\/|www\.)\S+|\b[a-z0-9-]{2,}\s?(?:\.|\(dot\)|\[dot\]|\sdot\s)\s?(?:com|net|org|no|se|dk|fi|io|gg|me|app|xyz|tv|ly|co|uk|de|info|link|to|cc|ru|live|fun|site|online|store|shop|club|pro|dev)\b/gi
  , Ot = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i
  , kt = /(?:\+?\d[\s.-]?){8,}/
  , At = /(?:^|\s)@[a-z0-9_.]{3,}/i
  , jt = /\b(?:snap\s?chat|snap|snahp|insta\s?gram|insta|tik\s?tok|whats\s?app|telegram|kik|discord|onlyfans|add\s+me|add\s+meg|dm\s+me|legg\s+meg\s+til|my\s+number|mitt\s+nummer|call\s+me|ring\s+meg|on\s+snip)\b/i
  , Mt = new RegExp([`\\bhow old (?:${K([`are`, `r`, `ar`, `is`, `iz`, `ru`, `are u`, `r u`])} )?${K([`you`, `u`, `ya`, `yu`, `yall`, `you guys`, `u guys`, `you all`, `everyone`, `every1`, `everybody`])}\\b`, `\\b${K([`whats`, `what is`, `what`, `wats`, `wat is`, `tell me`])} ${X} age\\b`, `\\bwhere (?:${K([`do`, `d`, `did`, `does`])} )?${K([`you`, `u`, `ya`, `yu`, `yall`, `you guys`, `u guys`, `you all`])} ${K([`live`, `liv`, `lve`, `stay`, `lives`])}\\b`, `\\bwhere(?:s| is| iz)? ${X} ${K([`house`, `home`, `address`, `adress`, `school`, `location`])}\\b`, `\\b${K([`whats`, `wats`, `wuts`, `wuz`, `whts`, `what`, `wat`, `what is`, `wat is`, `tell me`, `give me`, `gimme`, `drop`, `send`, `send me`, `post`, `say`, `can i have`, `can i get`])} ${K([`your`, `ur`, `yo`, `ya`, `youre`, `you`, `u`, `his`, `her`, `their`])} ${K(`address.adress.addy.location.home address.postcode.zip code.zipcode.real name.irl name.full name.last name.surname.actual name.school.phone.phone number.digits.cell.snap.snapchat.snahp.snp.sc.insta.ig.tiktok.discord.disc.dc.whatsapp.email.mail.gmail.roblox.xbox.psn.steam.facebook.fb`.split(`.`))}\\b`, `\\b${K([`give me`, `gimme`, `send me`, `drop`, `can i have`, `can i get`, `tell me`])} ${X} (?:phone )?number\\b`, `\\b${K([`what`, `wat`, `which`, `wich`, `whats`, `what is`])} ${K([`school`, `skool`, `grade`, `year`, `class`])} (?:${K([`do`, `d`, `r`, `are`, `ar`, `is`])} )?${K([`you`, `u`, `ya`, `yall`, `you guys`, `u guys`, `you all`])}\\b`, `\\b${K([`vilken`, `hvilken`, `vilke`, `hvilke`])} ${K([`skola`, `skole`, `klass`, `klasse`])}\\b`, `\\b${K([`hvor`, `var`])} bor du\\b`, `\\b${K([`hvor`, `hur`])} ${K([`gammel`, `gammal`])} ${K([`er`, `e`, `ar`])} du\\b`, `\\bsend (?:${K([`me`, `us`, `him`, `her`])} )?(?:${K([`a`, `some`, `ur`, `your`, `yo`, `da`, `the`, `more`, `ya`])} )?${K([`pic`, `pics`, `pix`, `picture`, `pictures`, `photo`, `photos`, `selfie`, `selfies`, `face pic`, `face pics`])}\\b`, `\\b${K([`come to`, `come over to`, `visit`])} ${X} ${K([`house`, `home`, `place`, `school`])}\\b`, `\\b${K([`meet`, `meetup`])} (?:${K([`up`, `me`])} )?${K([`irl`, `in real life`, `in person`])}\\b`].join(`|`));
function Nt(e) {
    return Array.from(e.matchAll(Dt), e => e[0].toLowerCase().replace(/\s|\(dot\)|\[dot\]|dot/g, `.`)).some(e => !/^(?:https?:\/\/)?(?:www\.)?steez8\.+me\b/.test(e)) ? !0 : Ot.test(e) || kt.test(e) || At.test(e) || jt.test(e) || Mt.test(J(e).join(` `))
}
function Pt(e) {
    if (typeof e != `string`)
        return {
            ok: !1,
            reason: `empty`
        };
    let t = e.replace(/[\p{Cc}\p{Cf}]/gu, ``).replace(/(\p{M}{2})\p{M}+/gu, `$1`).replace(/\s+/g, ` `).trim();
    if (!t)
        return {
            ok: !1,
            reason: `empty`
        };
    if (Array.from(t).length > 120)
        return {
            ok: !1,
            reason: `long`
        };
    let n = pt(t)
      , r = n.slur || vt(t) || Et(t);
    return !r && Nt(t) ? {
        ok: !1,
        reason: `contact`
    } : r ? {
        ok: !0,
        text: n.text,
        slur: !0
    } : {
        ok: !0,
        text: n.text
    }
}
export {fe as a, Ve as c, de as d, ue as f, We as i, V as l, le as m, Ge as n, se as o, ce as p, Pt as r, me as s, Ue as t, He as u};
