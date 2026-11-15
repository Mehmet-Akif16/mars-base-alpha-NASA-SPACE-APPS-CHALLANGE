---
name: space-sim-balancer
description: Mars Base Alpha'nın 6 kaynaklı 14 sol'lük denge motorunu korur. Yeni senaryo kartı eklerken, mevcut etkileri değiştirirken veya oyun çok kolay/çok zor geldiğinde kullan. Standart JSON kart formatını ve zorunlu simülasyon testini tanımlar.
---

# 6 kaynak ve oyun dengesi

Barlar: `E` enerji · `O` oksijen · `W` su · `F` gıda · `S` kalkan · `M` moral.
Her bar 0-100. Herhangi biri 0'a inerse görev biter.

## Kart tasarım kuralı

Her seçenek **en az 2 kaynağı artırmalı, en az 1 kaynağı azaltmalı.** Sıfır toplamlı olmak zorunda değil ama **bedelsiz seçenek olamaz.**

Tek istisna: gerçek bir acil durumda her seçeneğin bedelli olması. Örnek: oksijen kaçağı (11.1). Bu istisna bilinçli olmalı ve veri dosyasında yorumla işaretlenmeli.

Tek kartın tek bir barı oynatma sınırı: **±22.** Daha fazlası tek hatayla oyunu bitirir, bu da 7-12 yaş için cezalandırıcıdır.

## Bölge zorluk katsayıları

| Bölge | Başlangıç farkı | Karakteri |
|---|---|---|
| Elysium Planitia | hepsi 100 | standart tüketim, referans zorluk |
| Jezero Krateri | E 84, S 96 | su avantajı ve en yüksek bilim ödülü, toz/gölge riski |
| Arsia Mons | S 72, O 94, W 92 | jeotermal enerji yüksek, radyasyon sert |

## Zorunlu test

Denge **tahminle ayarlanmaz.** Her değişiklikten sonra tüm olası oynanışlar (2^19 = 524.288) simüle edilir. Oyun tarayıcıda açıkken konsolda `window.GAME` üzerinden kaba kuvvet taraması çalıştırılır.

Kabul ölçütleri:

- Rastgele oynayanın kazanma oranı **%35-50** arası
- **Altı barın altısı da** kaybettirebilmeli (hiçbiri %0 olmamalı)
- Hiçbir bar tek başına kayıpların **%35'inden fazlasını** oluşturmamalı

Şu anki ayar: günlük tüketim `E-3 O-5 W-6 F-7 S-5 M-6` → kazanma %43,8; kayıp dağılımı W 19,1 · S 12,5 · E 11,7 · F 5,9 · O 5,2 · M 1,7.

## Standart JSON kart formatı

```json
{
  "sol": 8,
  "region": "any",
  "event_title": "Dev toz fırtınası!",
  "description": "Komutan, toz duvarı gökyüzünü yuttu ve paneller neredeyse hiç üretmiyor.",
  "choices": [
    {
      "text": "Nükleer pili aç",
      "effects": { "E": 22, "M": 3, "S": -11 },
      "nasa_fact": "MMRTG radyoizotop pil tozdan etkilenmez; Curiosity ve Perseverance bununla çalışır."
    },
    {
      "text": "Işıkları söndür",
      "effects": { "E": 6, "W": 3, "M": -10 },
      "nasa_fact": "2018'deki küresel toz fırtınası, güneş enerjili Opportunity'nin görevini bitirdi."
    }
  ]
}
```

Bu format doğrudan `data.js` içindeki `scenarios` dizisine dönüştürülebilir.
