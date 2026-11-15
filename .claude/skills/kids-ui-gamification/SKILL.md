---
name: kids-ui-gamification
description: Mars Base Alpha'nın arayüz ve oyunlaştırma standartları. Yeni ekran, gösterge, buton veya animasyon eklerken kullan. Okunabilirlik, renk körlüğü erişilebilirliği, dokunmatik hedef boyutu ve kriz geri bildirimi kurallarını tanımlar.
---

# Arayüz ve oyunlaştırma standartları

Hedef kitle 7-12 yaş. Ekran bir **kumanda merkezi** gibi görünmeli ama hiçbir şey okunamayacak kadar küçük olmamalı.

## Göstergeler

Her kaynak barı **üç kanaldan** aynı anda bilgi verir:

1. **Renk** — yeşil-turkuaz (iyi) → sarı (dikkat, ≤%40) → kırmızı (kritik, ≤%20)
2. **Şekil** — `✓` / `!` / `✕` işareti barın yanında durur
3. **Sayı** — yüzde değeri her zaman yazılı

Renk tek başına asla bilgi taşımaz. Renk körü bir çocuk şekil ve sayıdan durumu okuyabilmelidir. Her barın `aria-label`'ı da durumu söyler.

## Butonlar

Her karar seçeneğinin üstünde etkilenen kaynaklar **simge + yön + miktar** olarak görünür:

```
⚡▲15  💚▲3  🛡️▼3
```

Yön oku (▲ / ▼) rengin yedeğidir; renk görülmese de artış mı azalış mı anlaşılır.

Dokunmatik hedef en az **44×44 piksel.** Butonlar arası boşluk en az 12 piksel — yanlış tıklama hayal kırıklığı yaratır.

## Animasyon

- **Kart geçişi:** aşağıdan yukarı 0,35 saniye yumuşak giriş
- **Bar değişimi:** 0,45 saniye yumuşak geçiş + yanında kısa süre beliren `+15` / `−8` etiketi
- **Kriz anı:** kartın kenarı kırmızı nabız gibi atar; arka plana toz ya da güneş patlaması katmanı biner
- **Kazanma:** kupa ve yıldızlar

`prefers-reduced-motion` açık olan kullanıcılarda tüm animasyonlar kapanır. Bu bir tercih değil, erişilebilirlik gereğidir.

## Tipografi ve yerleşim

- Gövde metni en az **15px**, karar kartı metni ortalanmış, satır uzunluğu 60 karakteri geçmez
- Başlıklar sıkıştırılmış (condensed) ve büyük — ekrandan uzaktan okunabilir
- Göstergeler sol üstte sabit, SOL sayacı yanında, uzay havası sağ üstte
- Karar kartı ekranın altında — çocuğun gözü önce manzarayı, sonra kararı görür
- 760px altında her şey tek sütuna iner

## Kontrol listesi

Yeni arayüz parçası eklerken: Renk olmadan anlaşılıyor mu? Dokunma hedefi 44px mi? Klavyeyle odaklanınca görünür bir çerçeve var mı? Animasyon kapatılabiliyor mu?
