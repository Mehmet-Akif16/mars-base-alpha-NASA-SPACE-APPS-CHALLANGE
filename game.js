/* =====================================================================
   MARS BASE ALPHA — oyun motoru
   ===================================================================== */

(function () {
  'use strict';

  var G = window.GAME, INFO = window.INFO_CARDS, SW = window.SPACE_WEATHER;

  /* ---------------- diller ---------------- */

  var T = {
    tr: {
      kicker: 'NASA SPACE APPS CHALLENGE 2026',
      title1: 'MARS BASE ', title2: 'ALPHA',
      sub: '14 sol boyunca Mars’taki üssün komutanı sensin. Enerji, oksijen, su, gıda, kalkan ve ekibin morali senin kararlarına bağlı. Barlardan biri biterse görev biter.',
      start: 'GÖREVE BAŞLA',
      credits: 'Kaynaklar ve künye',
      back: 'GERİ',
      siteTitle: 'İNİŞ BÖLGESİNİ SEÇ',
      siteSub: 'Üç bölge, üç farklı zorluk. Komutan, seçimin tüm görevi değiştirir. Haritaların üçü de NASA Mars Trek’ten gelen gerçek Mars yüzeyi.',
      sol: 'SOL', of: '/ 14',
      weather: 'UZAY HAVASI · GERÇEK NASA VERİSİ',
      wsrc: 'Kaynak: NASA DONKI · Moon to Mars Space Weather Analysis Office',
      optA: 'SEÇENEK A', optB: 'SEÇENEK B',
      info: 'BİLGİ KÖŞESİ',
      srcLabel: 'Kaynak',
      next: 'DEVAM',
      nextSol: 'SONRAKİ SOL',
      winTitle: 'GÖREV BAŞARIYLA TAMAMLANDI',
      winSub: '14 sol bitti ve üs ayakta. Mars Base Alpha artık kalıcı.',
      loseTitle: 'GÖREV BAŞARISIZ',
      loseSub: 'bitti ve üs yaşayamadı.',
      loseAt: 'Görev SOL {n}’de sona erdi.',
      again: 'TEKRAR OYNA',
      finalScore: 'Görev puanı',
      stars: 'yıldız',
      bars: 'Üssün son durumu',
      why: 'Neden kaybettin?',
      whyText: '{bar} barı sıfıra indi. Bu barı besleyen kararları atlamış olabilirsin.'
    },
    en: {
      kicker: 'NASA SPACE APPS CHALLENGE 2026',
      title1: 'MARS BASE ', title2: 'ALPHA',
      sub: 'For 14 sols you command the outpost on Mars. Power, oxygen, water, food, shielding and your crew’s morale all depend on your calls. If any bar empties, the mission ends.',
      start: 'BEGIN THE MISSION',
      credits: 'Sources and credits',
      back: 'BACK',
      siteTitle: 'CHOOSE YOUR LANDING SITE',
      siteSub: 'Three regions, three kinds of trouble. Commander, your choice changes the whole mission. All three maps are real Martian ground from NASA Mars Trek.',
      sol: 'SOL', of: '/ 14',
      weather: 'SPACE WEATHER · REAL NASA DATA',
      wsrc: 'Source: NASA DONKI · Moon to Mars Space Weather Analysis Office',
      optA: 'OPTION A', optB: 'OPTION B',
      info: 'DID YOU KNOW',
      srcLabel: 'Source',
      next: 'CONTINUE',
      nextSol: 'NEXT SOL',
      winTitle: 'MISSION ACCOMPLISHED',
      winSub: 'Fourteen sols done and the outpost still stands. Mars Base Alpha is here to stay.',
      loseTitle: 'MISSION LOST',
      loseSub: 'ran out and the outpost could not survive.',
      loseAt: 'The mission ended on SOL {n}.',
      again: 'PLAY AGAIN',
      finalScore: 'Mission score',
      stars: 'stars',
      bars: 'Final state of the base',
      why: 'What went wrong?',
      whyText: 'Your {bar} bar hit zero. You may have skipped the decisions that feed it.'
    }
  };

  var S = {
    lang: 'tr',
    region: null,
    sol: 1,
    queue: [],
    bars: {},
    dead: null,
    deadSol: 0
  };

  function t(k) { return T[S.lang][k]; }
  function L(o) { return o ? (S.lang === 'tr' ? o.tr : o.en) : ''; }
  /* Bilgi kartı kaynağı: Türkçe 'source', İngilizce 'sourceEn' (yoksa aynı metin). */
  function srcOf(c) { return S.lang === 'tr' ? c.source : (c.sourceEn || c.source); }
  function $(id) { return document.getElementById(id); }

  /* ---------------- göstergeler ---------------- */

  function barMeta(key) {
    for (var i = 0; i < G.bars.length; i++) if (G.bars[i].key === key) return G.bars[i];
    return null;
  }
  function barName(key) {
    var b = barMeta(key);
    return S.lang === 'tr' ? b.tr : b.en;
  }

  function buildHud() {
    var h = $('hud');
    h.innerHTML = '';
    G.bars.forEach(function (b) {
      var row = document.createElement('div');
      row.className = 'bar-row';
      row.innerHTML =
        '<span class="ico">' + b.icon + '</span>' +
        '<span class="track"><span class="fill" id="fill-' + b.key + '"></span>' +
        '<span class="name" id="nm-' + b.key + '"></span></span>' +
        '<span class="pct"><span class="st" id="st-' + b.key + '"></span>' +
        '<span id="pct-' + b.key + '">0</span>' +
        '<span class="delta" id="dl-' + b.key + '"></span></span>';
      row.title = S.lang === 'tr' ? b.nasaTr : b.nasaEn;
      h.appendChild(row);
    });
  }

  function paintHud(deltas) {
    G.bars.forEach(function (b) {
      var v = Math.max(0, Math.min(100, S.bars[b.key]));
      var fill = $('fill-' + b.key);
      fill.style.width = v + '%';
      fill.className = 'fill' + (v <= 20 ? ' bad' : v <= 40 ? ' warn' : '');
      /* kids-ui-gamification: durum sadece renkle değil şekille de anlatılır,
         böylece renk körü oyuncular da tehlikeyi görür. */
      var st = $('st-' + b.key);
      st.textContent = v <= 20 ? '✕' : v <= 40 ? '!' : '✓';
      st.className = 'st ' + (v <= 20 ? 'bad' : v <= 40 ? 'warn' : 'ok');
      st.setAttribute('aria-label', S.lang === 'tr'
        ? (v <= 20 ? 'kritik' : v <= 40 ? 'dikkat' : 'iyi')
        : (v <= 20 ? 'critical' : v <= 40 ? 'warning' : 'good'));
      $('pct-' + b.key).textContent = v;
      $('nm-' + b.key).textContent = barName(b.key);
      var d = $('dl-' + b.key);
      if (deltas && deltas[b.key]) {
        d.textContent = (deltas[b.key] > 0 ? '+' : '') + deltas[b.key];
        d.className = 'delta show ' + (deltas[b.key] > 0 ? 'up' : 'down');
        setTimeout(function () { d.className = 'delta'; }, 1600);
      } else {
        d.className = 'delta';
      }
    });
  }

  function paintSol() {
    $('sol-num').textContent = S.sol + ' ' + t('of');
    $('sol-lbl').textContent = t('sol');

    var w = SW[S.sol - 1];
    $('w-lbl').textContent = t('weather');
    $('w-evt').innerHTML = '<b>' + w.date + '</b> · ' + (S.lang === 'tr' ? w.tr : w.en);
    $('w-src').textContent = t('wsrc');

    var atm = { 2: 'night', 4: 'flare', 8: 'dust', 11: 'flare' }[S.sol] || (w.sev >= 3 ? 'flare' : '');
    $('weather').className = atm;
  }

  /* ---------------- ekranlar ---------------- */

  function show(html) { $('bottom').innerHTML = ''; $('mid').innerHTML = html; }
  function showCard(html) { $('mid').innerHTML = ''; $('bottom').innerHTML = html; }
  function chrome(on) { $('top').style.visibility = on ? 'visible' : 'hidden'; }

  function screenIntro() {
    chrome(false);
    $('scene').style.backgroundImage = 'url("assets/scene-plain.jpg")';
    $('weather').className = '';
    show(
      '<div class="sheet glass notch">' +
      '<p class="kicker">' + t('kicker') + '</p>' +
      '<h1>' + t('title1') + '<span>' + t('title2') + '</span></h1>' +
      '<p class="sub">' + t('sub') + '</p>' +
      '<button class="go" id="btn-start">' + t('start') + '</button>' +
      '<p class="fine">' + (S.lang === 'tr'
        ? 'Oyundaki uzay havası olayları 3–16 Mayıs 2024 tarihlerinde gerçekten yaşandı. Veriler NASA DONKI’den alınmıştır.'
        : 'The space-weather events in this game really happened between 3 and 16 May 2024. Data from NASA DONKI.') + '</p>' +
      '<button class="chip" id="btn-credits">' + t('credits') + '</button>' +
      '</div>'
    );
    $('btn-start').onclick = screenRegion;
    $('btn-credits').onclick = screenCredits;
  }

  function screenRegion() {
    chrome(false);
    var cards = G.regions.map(function (r) {
      var pros = L(r.pros).map(function (x) { return '<li class="p"><i>+</i><span>' + x + '</span></li>'; }).join('');
      var cons = L(r.cons).map(function (x) { return '<li class="c"><i>−</i><span>' + x + '</span></li>'; }).join('');
      return '<button class="site" data-id="' + r.id + '">' +
        '<img src="' + r.map + '" alt="' + L(r.name) + '">' +
        '<span class="meat">' +
        '<span class="tagline">' + L(r.tagline) + '</span>' +
        '<h3>' + L(r.name) + '</h3>' +
        '<span class="coord">' + L(r.coords) + '</span>' +
        '<ul>' + pros + cons + '</ul>' +
        '</span></button>';
    }).join('');

    show(
      '<div class="sheet glass notch">' +
      '<p class="kicker">' + t('siteTitle') + '</p>' +
      '<p class="sub">' + t('siteSub') + '</p>' +
      '<div class="sites">' + cards + '</div>' +
      '<p class="fine">NASA Mars Trek · Viking MDIM2.1</p>' +
      '</div>'
    );
    Array.prototype.forEach.call(document.querySelectorAll('.site'), function (el) {
      el.onclick = function () { startMission(el.getAttribute('data-id')); };
    });
  }

  function screenCredits() {
    chrome(false);
    var srcs = {};
    Object.keys(INFO).forEach(function (k) { srcs[srcOf(INFO[k])] = 1; });
    var tr = S.lang === 'tr';
    var list = Object.keys(srcs).map(function (s) { return '<li>' + s + '</li>'; }).join('');
    show(
      '<div class="sheet glass notch">' +
      '<p class="kicker">' + (S.lang === 'tr' ? 'KAYNAKLAR VE KÜNYE' : 'SOURCES AND CREDITS') + '</p>' +
      '<p class="sub">' + (S.lang === 'tr'
        ? 'Oyundaki her gösterge ve her bilgi kartı gerçek bir NASA kaynağına dayanır.'
        : 'Every gauge and every fact card in this game is grounded in a real NASA source.') + '</p>' +
      '<div style="text-align:left;max-width:70ch">' +
      '<p class="fine" style="text-align:left"><b>' + (S.lang === 'tr' ? 'Veri kaynakları' : 'Data sources') + ':</b></p>' +
      '<ul class="fine" style="text-align:left;line-height:1.8">' +
      (tr
        ? '<li>NASA DONKI — CCMC / Moon to Mars Space Weather Analysis Office (güneş patlamaları, SEP, jeomanyetik fırtınalar, 3–16 Mayıs 2024)</li>' +
          '<li>NASA Mars Trek — Viking MDIM2.1 küresel renkli mozaik (iniş bölgesi haritaları)</li>' +
          '<li>NASA OSDR — OSD-895 (EDEN ISS serası), OSD-984 (kas ve kozmik ışın), OSD-1018 (izolasyon ve radyasyon)</li>' +
          '<li>NASA RadLab (OSDR) — ISS radyasyon doz ölçümleri</li>' +
          '<li>NASA Image and Video Library — PIA26680, PIA24264 (Mars yüzey fotoğrafları)</li>'
        : '<li>NASA DONKI — CCMC / Moon to Mars Space Weather Analysis Office (solar flares, SEP, geomagnetic storms, 3–16 May 2024)</li>' +
          '<li>NASA Mars Trek — Viking MDIM2.1 global color mosaic (landing site maps)</li>' +
          '<li>NASA OSDR — OSD-895 (EDEN ISS greenhouse), OSD-984 (muscle and cosmic radiation), OSD-1018 (isolation and radiation)</li>' +
          '<li>NASA RadLab (OSDR) — ISS radiation dose measurements</li>' +
          '<li>NASA Image and Video Library — PIA26680, PIA24264 (Mars surface photos)</li>') +
      list +
      '</ul>' +
      '<p class="fine" style="text-align:left"><b>' + (S.lang === 'tr' ? 'Yapay zekâ kullanımı' : 'Use of AI') + ':</b> ' +
      (S.lang === 'tr'
        ? 'Oyun kodu, arayüz tasarımı ve bilgi kartı metinleri Claude (Anthropic) yardımıyla yazılmıştır. Senaryo ve hikâye takım tarafından yazılmıştır. Her bilgi kartı, ayrı bir doğrulama adımından geçirilerek NASA kaynaklarıyla karşılaştırılmıştır.'
        : 'Game code, interface design and fact-card text were written with the help of Claude (Anthropic). The scenario and story were written by the team. Every fact card was run through a separate verification step against NASA sources.') + '</p>' +
      '<p class="fine" style="text-align:left">' + (tr
        ? 'NASA, ABD Hükümeti dışındaki hiçbir kuruluşu desteklemez ve bu kuruluşların web sitelerindeki bilgilerden sorumlu değildir.'
        : 'NASA does not endorse any non-U.S. Government entity and is not responsible for information contained on non-U.S. Government websites.') + '</p>' +
      '</div>' +
      '<button class="go" id="btn-back">' + t('back') + '</button>' +
      '</div>'
    );
    $('btn-back').onclick = screenIntro;
  }

  /* ---------------- görev ---------------- */

  function startMission(regionId) {
    var r = null;
    for (var i = 0; i < G.regions.length; i++) if (G.regions[i].id === regionId) r = G.regions[i];
    S.region = r;
    S.sol = 1;
    S.dead = null;
    S.busy = false;
    S.bars = {};
    Object.keys(r.start).forEach(function (k) { S.bars[k] = r.start[k]; });
    $('scene').style.backgroundImage = 'url("' + r.scene + '")';
    chrome(true);
    buildHud();
    paintHud();
    loadSol();
  }

  function loadSol() {
    S.busy = false;
    S.queue = G.scenarios.filter(function (s) { return s.day === S.sol; });
    paintSol();
    paintHud();
    if (S.queue.length === 0) endOfSol();
    else nextScenario();
  }

  /* kids-ui-gamification: her seçeneğin bedeli butonun üstünde okunur.
     Simge + ▲/▼ + sayı — renkten bağımsız olarak da anlaşılır. */
  function fxChips(fx) {
    return '<span class="fxrow">' + G.bars.filter(function (b) { return fx[b.key]; })
      .map(function (b) {
        var v = fx[b.key];
        return '<span class="fx ' + (v > 0 ? 'up' : 'down') + '">' +
          b.icon + (v > 0 ? '▲' : '▼') + Math.abs(v) + '</span>';
      }).join('') + '</span>';
  }

  function nextScenario() {
    /* Sol geçişi sürerken gelen tıklamaları yut. Olmazsa hızlı tıklayan
       oyuncu bir sol'ü atlayabiliyor ve göstergeler görüntüyle uyuşmuyor. */
    if (S.busy) return;
    if (S.queue.length === 0) { endOfSol(); return; }
    var sc = S.queue.shift();
    var alarm = L(sc.title).indexOf('⚠') === 0;
    showCard(
      '<div class="card glass notch' + (alarm ? ' crisis' : '') + '">' +
      '<h2' + (alarm ? ' class="alarm"' : '') + '>' + L(sc.title) + '</h2>' +
      '<p class="body">' + L(sc.text) + '</p>' +
      '<div class="choices">' +
      '<button class="choice" data-k="a"><span class="tag">' + t('optA') + '</span>' +
      '<span class="txt">' + L(sc.a.label) + '</span>' + fxChips(sc.a.fx) + '</button>' +
      '<button class="choice gold" data-k="b"><span class="tag">' + t('optB') + '</span>' +
      '<span class="txt">' + L(sc.b.label) + '</span>' + fxChips(sc.b.fx) + '</button>' +
      '</div></div>'
    );
    Array.prototype.forEach.call(document.querySelectorAll('.choice'), function (el) {
      el.onclick = function () { choose(sc, el.getAttribute('data-k')); };
    });
  }

  function choose(sc, key) {
    var fx = (key === 'a' ? sc.a : sc.b).fx;
    var applied = {};
    Object.keys(fx).forEach(function (k) {
      var before = S.bars[k];
      S.bars[k] = Math.max(0, Math.min(100, S.bars[k] + fx[k]));
      applied[k] = S.bars[k] - before;
    });
    paintHud(applied);
    showInfo(sc, applied);
  }

  function showInfo(sc, applied) {
    var card = INFO[sc.id] || { titleTr: '', titleEn: '', textTr: '', textEn: '', source: '' };
    var chips = Object.keys(applied).filter(function (k) { return applied[k] !== 0; }).map(function (k) {
      var v = applied[k];
      return '<span class="chip ' + (v > 0 ? 'up' : 'down') + '">' + barMeta(k).icon + ' ' +
        barName(k) + ' ' + (v > 0 ? '+' : '') + v + '</span>';
    }).join('');

    showCard(
      '<div class="card glass notch info">' +
      '<span class="ribbon">' + t('info') + '</span>' +
      '<h3>' + (S.lang === 'tr' ? card.titleTr : card.titleEn) + '</h3>' +
      '<p class="body">' + (S.lang === 'tr' ? card.textTr : card.textEn) + '</p>' +
      '<div class="changes">' + chips + '</div>' +
      '<p class="src">' + t('srcLabel') + ': ' + srcOf(card) + '</p>' +
      '<button class="go gold" id="btn-next">' + (S.queue.length ? t('next') : t('nextSol')) + '</button>' +
      '</div>'
    );
    $('btn-next').onclick = nextScenario;
  }

  function endOfSol() {
    if (S.busy) return;
    S.busy = true;
    var applied = {};
    Object.keys(G.dailyDrain).forEach(function (k) {
      var before = S.bars[k];
      S.bars[k] = Math.max(0, Math.min(100, S.bars[k] + G.dailyDrain[k]));
      applied[k] = S.bars[k] - before;
    });
    paintHud(applied);

    var dead = null;
    G.bars.forEach(function (b) { if (!dead && S.bars[b.key] <= 0) dead = b.key; });
    if (dead) { S.dead = dead; S.deadSol = S.sol; setTimeout(screenEnd, 700); return; }

    if (S.sol >= G.totalSols) { setTimeout(screenEnd, 700); return; }
    S.sol++;
    setTimeout(loadSol, 650);
  }

  /* ---------------- bitiş ---------------- */

  function screenEnd() {
    chrome(true);
    var won = !S.dead;
    var total = 0;
    G.bars.forEach(function (b) { total += S.bars[b.key]; });
    var avg = Math.round(total / G.bars.length);
    var bonus = (S.region && S.region.scienceGoal === 'high') ? 10 : 0;
    var score = won ? Math.min(100, avg + bonus) : avg;
    /* 14 sol hayatta kalmak zaten zor; kazanan asla 1 yıldız almasın. */
    var stars = score >= 48 ? 3 : score >= 30 ? 2 : 1;
    if (won && stars < 2) stars = 2;

    var chips = G.bars.map(function (b) {
      var v = S.bars[b.key];
      return '<span class="chip ' + (v <= 20 ? 'down' : v >= 50 ? 'up' : '') + '">' +
        b.icon + ' ' + barName(b.key) + ' ' + v + '</span>';
    }).join('');

    var body;
    if (won) {
      body =
        '<div class="end-icon">🏆</div>' +
        '<h1 style="font-size:clamp(26px,4.4vw,40px)">' + t('winTitle') + '</h1>' +
        '<p class="sub">' + t('winSub') + '</p>';
    } else {
      body =
        '<div class="end-icon">🛑</div>' +
        '<h1 style="font-size:clamp(26px,4.4vw,40px);color:var(--bad)">' + t('loseTitle') + '</h1>' +
        '<p class="sub">' + barMeta(S.dead).icon + ' <b>' + barName(S.dead) + '</b> ' + t('loseSub') + '<br>' +
        t('loseAt').replace('{n}', S.deadSol) + '</p>' +
        '<p class="fine">' + t('whyText').replace('{bar}', barName(S.dead)) + '</p>';
    }

    $('weather').className = won ? '' : 'dust';
    show(
      '<div class="sheet glass notch">' + body +
      '<p class="kicker">' + t('bars') + '</p>' +
      '<div class="scoreline">' + chips + '</div>' +
      '<p class="sub" style="margin-top:4px">' + t('finalScore') + ': <b style="color:var(--edge);font-size:22px">' +
      score + '</b> · ' + '⭐'.repeat(stars) + '</p>' +
      '<button class="go" id="btn-again">' + t('again') + '</button>' +
      '</div>'
    );
    $('btn-again').onclick = screenIntro;
  }

  /* ---------------- dil ---------------- */

  function setLang(l) {
    S.lang = l;
    $('lang-tr').setAttribute('aria-pressed', String(l === 'tr'));
    $('lang-en').setAttribute('aria-pressed', String(l === 'en'));
    document.documentElement.lang = l;
    screenIntro();
  }

  /* ---------------- başlat ---------------- */

  window.addEventListener('DOMContentLoaded', function () {
    $('lang-tr').onclick = function () { setLang('tr'); };
    $('lang-en').onclick = function () { setLang('en'); };
    setLang('tr');
  });

})();
