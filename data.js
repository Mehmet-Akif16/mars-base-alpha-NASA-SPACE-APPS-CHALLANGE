/* =====================================================================
   MARS BASE ALPHA — Oyun verisi
   NASA Space Apps Challenge 2026 · Junior Astronaut Mission Trainer

   Uygulanan kurallar:
   · mars-pedagogy-and-tone   — oyuncuya "Komutan" diye hitap; her terim
                                 hemen ardından somut bir benzetmeyle açıklanır;
                                 metinler en fazla 3 cümle.
   · space-sim-balancer       — her seçenek en az 2 kaynağı artırır, en az 1
                                 kaynağı azaltır. İstisnalar aşağıda işaretli.
   · nasa-fact-checker        — her bilgi kartı ayrı bir doğrulama adımından geçti.
   · kids-ui-gamification     — simgeler ve ▲▼ yönleri butonlarda otomatik üretilir.

   Denge, tüm olası oynanışlar simüle edilerek ayarlanmıştır.
   ===================================================================== */

window.GAME = {

  /* Her sol sonunda otomatik düşen miktarlar — oyunun zaman baskısı. */
  /* Süpürme testi sonucu: rastgele oynayan %43,8 kazanır ve altı barın
     altısı da görevi bitirebilir. En sık biten: su, kalkan, enerji. */
  dailyDrain: { E: -3, O: -5, W: -6, F: -7, S: -5, M: -6 },

  totalSols: 14,

  bars: [
    { key: 'E', icon: '⚡',  tr: 'ENERJİ',  en: 'POWER',
      nasaTr: 'Mars Yüzey Enerji Sistemleri — güneş panelleri ve MMRTG nükleer pil',
      nasaEn: 'Mars Surface Power Systems — solar arrays and the MMRTG nuclear battery' },
    { key: 'O', icon: '🫧',  tr: 'OKSİJEN', en: 'OXYGEN',
      nasaTr: 'ECLSS yaşam desteği ve MOXIE oksijen üreteci (Perseverance)',
      nasaEn: 'ECLSS life support and the MOXIE oxygen generator (Perseverance)' },
    { key: 'W', icon: '💧',  tr: 'SU',      en: 'WATER',
      nasaTr: 'Water Recovery System — ISS’te suyun %98’i geri kazanılıyor',
      nasaEn: 'Water Recovery System — 98% of water recovered on the ISS' },
    { key: 'F', icon: '🌱',  tr: 'GIDA',    en: 'FOOD',
      nasaTr: 'Advanced Life Support — NASA Veggie bitki üretim deneyleri',
      nasaEn: 'Advanced Life Support — NASA Veggie crop production experiments' },
    { key: 'S', icon: '🛡️', tr: 'KALKAN',  en: 'SHIELD',
      nasaTr: 'Curiosity RAD — Mars yüzeyindeki radyasyon ölçümleri',
      nasaEn: 'Curiosity RAD — radiation measurements on the Martian surface' },
    { key: 'M', icon: '💚',  tr: 'MORAL',   en: 'MORALE',
      nasaTr: 'Human Factors & Behavioral Health — NASA HERA izolasyon çalışmaları',
      nasaEn: 'Human Factors & Behavioral Health — NASA HERA isolation studies' }
  ],

  /* ---------------------------------------------------------------
     İNİŞ BÖLGELERİ — zorluk katsayıları
     Haritalar: NASA Mars Trek, Viking MDIM2.1 küresel renkli mozaik.
     --------------------------------------------------------------- */
  regions: [
    {
      id: 'elysium',
      map: 'assets/map-elysium-viking.jpg',
      scene: 'assets/scene-plain.jpg',
      name:   { tr: 'Elysium Planitia', en: 'Elysium Planitia' },
      tagline:{ tr: 'STANDART ZORLUK',  en: 'STANDARD DIFFICULTY' },
      coords: { tr: '4,5° K · 135,9° D · InSight’ın indiği yer',
                en: '4.5° N · 135.9° E · InSight landing site' },
      pros: {
        tr: ['Dümdüz ova, iniş güvenli', 'Ekvata yakın: bol güneş, bol enerji'],
        en: ['A flat plain, a safe landing', 'Near the equator: lots of sun, lots of power']
      },
      cons: {
        tr: ['Jeolojik olarak sakin, bilim ödülü düşük', 'Yakında buz yok'],
        en: ['Geologically quiet, low science reward', 'No ice nearby']
      },
      start: { E: 100, O: 100, W: 100, F: 100, S: 100, M: 100 },
      science: 0
    },
    {
      id: 'jezero',
      map: 'assets/map-jezero-viking.jpg',
      scene: 'assets/scene-jezero.jpg',
      name:   { tr: 'Jezero Krateri', en: 'Jezero Crater' },
      tagline:{ tr: 'SU AVANTAJI · TOZ RİSKİ', en: 'WATER BONUS · DUST RISK' },
      coords: { tr: '18,4° K · 77,5° D · Perseverance’ın indiği yer',
                en: '18.4° N · 77.5° E · Perseverance landing site' },
      pros: {
        tr: ['Eski bir nehir deltası: suyla değişmiş kayaçlar', 'Bilim ödülü en yüksek bölge'],
        en: ['An ancient river delta: water-altered rocks', 'The highest science reward']
      },
      cons: {
        tr: ['Krater duvarları gölge yapıyor, enerji düşük başlar', 'Toz fırtınaları burada daha sert'],
        en: ['Crater walls cast shade, power starts low', 'Dust storms hit harder here']
      },
      start: { E: 84, O: 100, W: 100, F: 100, S: 96, M: 100 },
      science: 12
    },
    {
      id: 'arsia',
      map: 'assets/map-arsia-viking.jpg',
      scene: 'assets/scene-valley.jpg',
      name:   { tr: 'Arsia Mons', en: 'Arsia Mons' },
      tagline:{ tr: 'YÜKSEK RİSK · YÜKSEK GÜÇ', en: 'HIGH RISK · HIGH POWER' },
      coords: { tr: '9° G · 121° B · 20 km yüksekliğinde sönmüş yanardağ',
                en: '9° S · 121° W · an extinct volcano 20 km high' },
      pros: {
        tr: ['Yanardağ sıcaklığı: enerji en yüksek başlar', 'Lav tüpleri hazır sığınak sunuyor'],
        en: ['Volcanic heat: power starts highest', 'Lava tubes make ready-made shelters']
      },
      cons: {
        tr: ['Çok yüksekte: hava ince, radyasyon sert', 'Kalkan en düşük seviyeden başlar'],
        en: ['Very high up: thin air, harsh radiation', 'Shielding starts at its lowest']
      },
      start: { E: 100, O: 94, W: 92, F: 100, S: 72, M: 100 },
      science: 8
    }
  ],

  /* ---------------------------------------------------------------
     14 SOL · 19 KARAR
     İSTİSNA NOTU: 11.1 (oksijen kaçağı) bilerek "her seçenek bedelli"
     tasarlandı. Gerçek bir acil durumda bedava çıkış yoktur; bu da
     öğretilmesi gereken bir mühendislik gerçeği.
     --------------------------------------------------------------- */
  scenarios: [
    { id: '1.1', day: 1,
      title: { tr: 'Üssü nereye kuralım?', en: 'Where do we build the base?' },
      text: {
        tr: 'Komutan, gemimiz indi ve üssü kuracak yeri sen seçeceksin. Derin bir kanyonun dibi bizi radyasyondan korur (kalın duvarlar, kalın bir battaniye gibi iş görür) ama güneş geç ulaşır. Açık tepede ise güneş bol, koruma yok.',
        en: 'Commander, we have landed and you choose where the base goes. The floor of a deep canyon shields us from radiation — thick walls work like a thick blanket — but sunlight arrives late. The open hilltop has plenty of sun and no cover.' },
      a: { label: { tr: 'Kanyona kuralım', en: 'Build in the canyon' },  fx: { S: 16, W: 4, E: -8 } },
      b: { label: { tr: 'Tepeye kuralım',  en: 'Build on the hilltop' }, fx: { E: 15, M: 4, S: -12 } } },

    { id: '1.2', day: 1,
      title: { tr: 'Hava üretme makinesi', en: 'The air-making machine' },
      text: {
        tr: 'Komutan, oksijen üretecini çalıştırma vakti. Makine Mars’ın havasındaki karbondioksiti parçalayıp oksijen çıkarıyor (bir limonu sıkıp suyunu almak gibi). Hızlı çalıştırmak elektriği yutar.',
        en: 'Commander, time to start the oxygen generator. It splits the carbon dioxide in the Martian air to pull out oxygen — like squeezing a lemon for its juice. Running it fast will drink our electricity.' },
      a: { label: { tr: 'Tam gaz çalıştır', en: 'Run it at full power' }, fx: { O: 22, M: 3, E: -14 } },
      b: { label: { tr: 'Yavaş çalıştır',   en: 'Run it slowly' },       fx: { O: 10, E: 2, W: -4 } } },

    { id: '2.1', day: 2,
      title: { tr: 'Gece soğuğu', en: 'The cold night' },
      text: {
        tr: 'Komutan, Mars gecesi çöktü ve dışarısı eksi 60 derece. Isıtıcıları açmak üssü ve serayı sıcak tutar ama enerji deposunu hızla boşaltır. Takas senin elinde.',
        en: 'Commander, Martian night has fallen and it is −60 °C outside. Turning the heaters up keeps the base and greenhouse warm but drains the power store fast. The trade-off is yours.' },
      a: { label: { tr: 'Isıtıcıları aç',      en: 'Turn the heaters up' },   fx: { M: 8, F: 4, E: -10 } },
      b: { label: { tr: 'Battaniyelere sarıl', en: 'Bundle up in blankets' }, fx: { E: 4, W: 2, M: -9 } } },

    { id: '3.1', day: 3,
      title: { tr: 'Serada marul', en: 'Lettuce in the greenhouse' },
      text: {
        tr: 'Komutan, ilk marulumuzu yetiştiriyoruz. Toprakla büyütmek bol su ister. Topraksız yöntemde (hidroponik: kökler toprak yerine besinli yastıklarda durur) su çok az gider ama pompalar elektrik yer.',
        en: 'Commander, we are growing our first lettuce. Soil needs a lot of water. The soil-free method — hydroponics, where roots sit in nutrient pillows instead of earth — barely uses water, but the pumps eat power.' },
      a: { label: { tr: 'Toprakta yetiştir', en: 'Grow it in soil' },        fx: { F: 16, O: 5, W: -16 } },
      b: { label: { tr: 'Topraksız yetiştir', en: 'Grow it without soil' },  fx: { W: 6, F: 6, E: -5 } } },

    { id: '3.2', day: 3,
      title: { tr: 'Su arıtma filtresi', en: 'The water filter' },
      text: {
        tr: 'Komutan, kirli suyu temizleyen makine yavaşladı. Üste hiçbir damla boşa gitmez; ter bile süzülüp içme suyuna döner. Yedek filtreyi takmak elektrik ister.',
        en: 'Commander, the machine that cleans our dirty water has slowed. Not a drop is wasted here — even sweat is filtered back into drinking water. Fitting the spare filter costs power.' },
      a: { label: { tr: 'Yedek filtreyi tak', en: 'Fit the spare filter' },     fx: { W: 16, M: 3, E: -8 } },
      b: { label: { tr: 'Eskisiyle idare et', en: 'Make do with the old one' }, fx: { E: 3, F: 2, W: -9 } } },

    { id: '4.1', day: 4,
      title: { tr: '⚠️ Güneş patlaması!', en: '⚠️ Solar flare!' },
      text: {
        tr: 'Komutan, Güneş büyük bir patlama yaptı ve hızlı parçacıklar yola çıktı. Yer altı sığınağı en güvenlisi ama orada havayı daha hızlı tüketiriz. Dış kalkanı açmak da tüm enerjiyi yer.',
        en: 'Commander, the Sun has flared and fast particles are on their way. The underground shelter is safest, but down there we burn through air faster. Raising the outer shield eats all our power.' },
      a: { label: { tr: 'Sığınağa in',    en: 'Go to the shelter' },      fx: { S: 18, M: 4, O: -16 } },
      b: { label: { tr: 'Dış kalkanı aç', en: 'Raise the outer shield' }, fx: { S: 13, O: 3, E: -16 } } },

    { id: '4.2', day: 4,
      title: { tr: 'Rover dışarıda', en: 'The rover is outside' },
      text: {
        tr: 'Komutan, keşif aracımız hâlâ dışarıda çalışıyor. Eve çağırıp örtersek korunur ama o gün keşif yapamayız. Dışarıda bırakırsak örnek toplamaya devam eder, riski biz alırız.',
        en: 'Commander, our rover is still working outside. Call it home and cover it and it stays safe, but we lose a day of exploring. Leave it out and it keeps collecting samples — at our risk.' },
      a: { label: { tr: 'Eve çağır',       en: 'Call it home' },        fx: { S: 5, M: 4, E: -7 } },
      b: { label: { tr: 'Çalışmaya devam', en: 'Let it keep working' }, fx: { F: 5, E: 2, S: -9, M: -5 } } },

    { id: '5.1', day: 5,
      title: { tr: 'Paneller tozlandı', en: 'Dust on the panels' },
      text: {
        tr: 'Komutan, güneş panellerini ince bir toz tabakası kapladı ve enerji düşüyor. Temizlik robotunu yollarsak kapağı açmamız gerekir, bu da bizi kısa süre radyasyona açar. Rüzgârı beklemek bedava ama yavaş.',
        en: 'Commander, a fine dust layer has covered the solar panels and power is falling. Sending the cleaning robot means opening a hatch, exposing us briefly to radiation. Waiting for the wind is free but slow.' },
      a: { label: { tr: 'Robotu yolla',  en: 'Send the robot' },     fx: { E: 15, M: 3, S: -3 } },
      b: { label: { tr: 'Rüzgârı bekle', en: 'Wait for the wind' },  fx: { S: 3, M: 2, E: -10 } } },

    { id: '6.1', day: 6,
      title: { tr: 'Ekip sıkıldı', en: 'The crew is restless' },
      text: {
        tr: 'Komutan, ekip haftalardır aynı dört duvar arasında. Dünya’yla görüntülü konuşmak büyük anten ister, anten de enerji. Moral de en az oksijen kadar gerçek bir kaynak.',
        en: 'Commander, the crew has been inside the same four walls for weeks. A video call home needs the big antenna, and the antenna needs power. Morale is as real a resource as oxygen.' },
      a: { label: { tr: 'Ailelerle görüş', en: 'Call their families' }, fx: { M: 17, F: 2, E: -10 } },
      b: { label: { tr: 'İşe devam',       en: 'Back to work' },       fx: { E: 3, F: 3, M: -10 } } },

    { id: '6.2', day: 6,
      title: { tr: 'Spor zamanı', en: 'Exercise time' },
      text: {
        tr: 'Komutan, Mars’ın çekimi Dünya’nın üçte biri; kaslar ve kemikler kullanılmazsa eriyor. Uzun antrenman ekibi güçlü tutar ama su ve yiyecek harcar. Dinlenmiş bir ekip ertesi gün daha az hata yapar.',
        en: 'Commander, Mars pulls with a third of Earth’s gravity; muscle and bone melt away if unused. A long workout keeps the crew strong but burns water and food. A rested crew makes fewer mistakes tomorrow.' },
      a: { label: { tr: '2 saat antrenman', en: 'Two full hours' },  fx: { M: 13, E: 3, W: -10, F: -9 } },
      b: { label: { tr: '45 dakika',        en: 'Just 45 minutes' }, fx: { M: 5, E: 2, W: -4, F: -3 } } },

    { id: '7.1', day: 7,
      title: { tr: 'Robot arızalandı', en: 'The robot broke down' },
      text: {
        tr: 'Komutan, yardımcı robotumuz bozuldu ve etrafta dönüp duruyor. Dışarı çıkıp tamir etmek (buna uzay yürüyüşü deniyor) saatler sürer ve bizi radyasyona açar. Ama robot çalışırsa işimizin yarısını o yapar.',
        en: 'Commander, our helper robot has broken and is spinning in circles. Going out to fix it — that is called a spacewalk — takes hours and exposes us to radiation. But a working robot does half our chores.' },
      a: { label: { tr: 'Çıkıp tamir et',  en: 'Go out and repair it' },   fx: { M: 10, E: 3, S: -7 } },
      b: { label: { tr: 'Kapat, parçala',  en: 'Shut it down for parts' }, fx: { E: 3, W: 2, M: -10 } } },

    { id: '8.1', day: 8,
      title: { tr: '⚠️ Dev toz fırtınası!', en: '⚠️ Giant dust storm!' },
      text: {
        tr: 'Komutan, ufuktan gelen toz duvarı gökyüzünü yuttu ve paneller neredeyse hiç üretmiyor. Nükleer pilimiz tozdan etkilenmez ama kapağını açmak radyasyon demek. Ya da her gereksiz ışığı söndürürüz.',
        en: 'Commander, a wall of dust has swallowed the sky and the panels make almost nothing. Our nuclear battery does not care about dust, but opening its housing means radiation. Or we switch off every spare light.' },
      a: { label: { tr: 'Nükleer pili aç', en: 'Switch on the nuclear battery' }, fx: { E: 22, M: 3, S: -11 } },
      b: { label: { tr: 'Işıkları söndür', en: 'Turn off every light' },          fx: { E: 6, W: 3, M: -10 } } },

    { id: '8.2', day: 8,
      title: { tr: 'Hava ölçer bozuldu', en: 'The weather station failed' },
      text: {
        tr: 'Komutan, dışarıdaki hava ölçüm cihazı fırtınada bozuldu. Onsuz bir sonraki fırtınayı göremeyiz, yani her şeyi tahminle yönetiriz. Tamire çıkmak tulum giymek ve toza girmek demek.',
        en: 'Commander, the outdoor weather station broke in the storm. Without it we cannot see the next storm coming and must run everything on guesswork. Fixing it means suiting up and walking into the dust.' },
      a: { label: { tr: 'Tamire çık',     en: 'Suit up and fix it' }, fx: { M: 6, E: 3, S: -11 } },
      b: { label: { tr: 'Fırtına geçsin', en: 'Wait out the storm' }, fx: { E: 2, S: 2, M: -6 } } },

    { id: '9.1', day: 9,
      title: { tr: 'Çöpler doldu', en: 'The bins are full' },
      text: {
        tr: 'Komutan, çöp kutuları doldu. Uzayda hiçbir şey gerçekten çöp değildir; atıklardan su ve gübre geri alınabilir. Hızlı dönüştürme makinesi bunu hemen yapar ama elektrik ister.',
        en: 'Commander, the bins are full. In space nothing is really rubbish — waste gives back water and fertiliser. The fast recycler does it right away, but it wants power.' },
      a: { label: { tr: 'Makineye at',    en: 'Use the recycler' },         fx: { F: 14, W: 6, E: -9 } },
      b: { label: { tr: 'Kendi çürüsün', en: 'Let it break down slowly' }, fx: { F: 3, W: 3, M: -4 } } },

    { id: '10.1', day: 10,
      title: { tr: 'Parlayan kayaçlar', en: 'Glittering rocks' },
      text: {
        tr: 'Komutan, üssün yanındaki kayalıklarda parlayan kristaller bulduk. Jeneratöre bağlarsak enerji fışkırır ama bu taşlar hafif radyasyon yayıyor. Dokunmazsak güvendeyiz, enerjiyi başka yerden bulmamız gerekir.',
        en: 'Commander, we found glittering crystals in the rocks beside the base. Wired to the generator they would pour out power, but the stones give off a little radiation. Leave them and we stay safe — and short of power.' },
      a: { label: { tr: 'Topla ve bağla', en: 'Collect and connect them' }, fx: { E: 20, M: 3, S: -15 } },
      b: { label: { tr: 'Sakın dokunma',  en: 'Do not touch them' },        fx: { S: 6, M: 3, E: -6 } } },

    { id: '11.1', day: 11,
      title: { tr: 'Oksijen kaçağı', en: 'An oxygen leak' },
      text: {
        tr: 'Komutan, oksijen tüpünde minik bir delik var ve hava dışarı sızıyor. Odayı kapatırsak kaçak durur ama o odadaki havayı kaybederiz. Yamalamak enerji ister ve delik tam kapanmayabilir. Bu kez bedava çıkış yok.',
        en: 'Commander, a tiny hole in an oxygen tank is letting air escape. Seal the room and the leak stops, but we lose the air inside it. Patching costs power and may not fully hold. This time there is no free option.' },
      a: { label: { tr: 'Odayı kapat',   en: 'Seal off the room' }, fx: { O: -18, M: -4 } },
      b: { label: { tr: 'Yamayla kapat', en: 'Patch the hole' },    fx: { O: -6, E: -11 } } },

    { id: '12.1', day: 12,
      title: { tr: 'İlk hasat!', en: 'The first harvest!' },
      text: {
        tr: 'Komutan, seradaki ilk domatesler ve patatesler olgunlaştı. Taze yiyecek moralin en güçlü ilacıdır. Hepsini bugün yersek yarın elimiz boş kalır.',
        en: 'Commander, the first tomatoes and potatoes are ripe. Fresh food is the strongest medicine for morale. Eat it all today and tomorrow the shelves are bare.' },
      a: { label: { tr: 'Ziyafet verelim', en: 'Throw a feast' },   fx: { M: 17, O: 3, F: -14 } },
      b: { label: { tr: 'Yarısını sakla',  en: 'Save half of it' }, fx: { F: 12, M: 5, O: 3, E: -4 } } },

    { id: '13.1', day: 13,
      title: { tr: 'Son gece', en: 'The last night' },
      text: {
        tr: 'Komutan, görevin son gecesi. Makineleri sonuna kadar zorlarsak depolar dolu biter ama donanım yıpranır. Güvenli modda beklemek hiç risk almaz.',
        en: 'Commander, the final night. Pushing every machine to its limit fills our stores but wears the hardware out. Safe mode takes no risk at all.' },
      a: { label: { tr: 'Son gücü ver', en: 'Push them hard' },    fx: { F: 7, W: 7, O: 5, E: -12 } },
      b: { label: { tr: 'Güvenli mod',  en: 'Stay in safe mode' }, fx: { E: 6, M: 3, F: -4 } } },

    { id: '13.2', day: 13,
      title: { tr: 'Dünya’ya rapor', en: 'Report to Earth' },
      text: {
        tr: 'Komutan, 14 sollük raporu ve fotoğrafları göndereceğiz. Sinyal Mars’tan Dünya’ya ışık hızıyla bile dakikalarca gider; anlık konuşma yok. Büyük anten her şeyi hızlı yollar ama çok enerji çeker.',
        en: 'Commander, time to send our 14-sol report and photos. Even at light speed the signal takes minutes to reach Earth — no live chat. The big antenna sends it all fast but drinks a lot of power.' },
      a: { label: { tr: 'Büyük anten', en: 'The big antenna' },   fx: { M: 13, F: 2, E: -11 } },
      b: { label: { tr: 'Küçük anten', en: 'The small antenna' }, fx: { M: 5, W: 2, E: -4 } } }
  ]
};
