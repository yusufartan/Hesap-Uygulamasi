# Benzer Araçlar Sistemi - Kurumsal Yeniden Yapılandırma

## 🎯 Genel Bakış

"Benzer Hesaplama Araçları" bileşeni artık **otomatik kategori bazlı eşleşme** sistemi ile çalışıyor. Her sayfaya manuel kod yazmaya gerek yok!

## ✨ Yeni Özellikler

### 1. **Otomatik Kategori Bazlı Eşleşme**
- Aynı kategorideki araçlar otomatik bulunur
- İlgili kategorilerden araçlar eklenir
- Popüler araçlarla tamamlanır

### 2. **Manuel Override Desteği**
- Özel eşleşmeler için manuel override eklenebilir
- Backward compatibility korunur

### 3. **Temiz Kod**
- Her sayfada tek satır: `<SimilarToolsCard />`
- Merkezi yönetim
- Kolay bakım

## 📁 Dosya Yapısı

```
src/
├── utils/
│   └── similarToolsUtils.js      # Otomatik eşleşme algoritması
├── hooks/
│   └── useSimilarTools.js        # React hook (URL'den otomatik bulma)
├── config/
│   └── similarToolsConfig.js     # Manuel override'lar (opsiyonel)
└── components/common/
    └── SimilarToolsCard.jsx      # UI bileşeni
```

## 🚀 Kullanım

### Basit Kullanım (Önerilen)
```jsx
import SimilarToolsCard from '../../components/common/SimilarToolsCard'

// Herhangi bir sayfada:
<SimilarToolsCard />
```
**Otomatik olarak URL'den mevcut sayfayı algılar ve benzer araçları gösterir.**

### Manuel Override
```jsx
// Özel bir eşleşme istiyorsanız:
<SimilarToolsCard toolIds={['finance', 'discount', 'calculator']} />
```

### Hook ile Kullanım
```jsx
import { useSimilarTools } from '../../hooks/useSimilarTools'

function MyComponent() {
  const similarToolIds = useSimilarTools({ maxResults: 5 })
  // ...
}
```

## 🔧 Nasıl Çalışıyor?

### Otomatik Eşleşme Stratejisi

1. **Aynı Kategori** (Öncelik 1)
   - Mevcut araç hangi kategorideyse, o kategorideki diğer araçlar gösterilir
   - Örnek: `currency` → `finance`, `discount` (hepsi `finance` kategorisinde)

2. **İlgili Kategoriler** (Öncelik 2)
   - İlgili kategorilerden araçlar eklenir
   - Örnek: `unit-converters` → `math-data` kategorisinden araçlar

3. **Popüler Araçlar** (Fallback)
   - Yeterli araç yoksa popüler araçlarla tamamlanır
   - Varsayılan: `calculator`, `currency`, `discount`, `finance`, `bmi`, `age`

### Manuel Override

`src/config/similarToolsConfig.js` dosyasında:

```javascript
export const similarToolsByPageId = {
  // Özel eşleşme örneği:
  currency: ['finance', 'discount', 'calculator'],
  
  // Boş bırakılanlar otomatik sistem tarafından doldurulur
}
```

## 📝 Migration Guide

### Eski Kod (Manuel)
```jsx
import SimilarToolsCard from '../../components/common/SimilarToolsCard'
import { similarToolsByPageId } from '../../config/similarToolsConfig'

<SimilarToolsCard toolIds={similarToolsByPageId.currency || []} />
```

### Yeni Kod (Otomatik)
```jsx
import SimilarToolsCard from '../../components/common/SimilarToolsCard'

<SimilarToolsCard />
```

**Import'ları kaldırın, bileşeni olduğu gibi kullanın!**

## 🎨 Özelleştirme

### Maksimum Sonuç Sayısı
```jsx
const toolIds = useSimilarTools({ maxResults: 5 })
<SimilarToolsCard toolIds={toolIds} />
```

### Stil Özelleştirme
```jsx
<SimilarToolsCard sx={{ maxWidth: 600, mt: 2 }} />
```

## 🔍 İlgili Kategoriler Mapping

Sistem şu kategori ilişkilerini kullanır:

```javascript
{
  'finance': ['genel'],
  'health': ['time'],
  'time': ['health'],
  'unit-converters': ['math-data'],
  'math-data': ['unit-converters', 'genel'],
  'genel': ['finance', 'math-data'],
}
```

Bu mapping'i `utils/similarToolsUtils.js` dosyasındaki `getRelatedCategories` fonksiyonunda özelleştirebilirsiniz.

## ✅ Avantajlar

1. **Zero Configuration**: Yeni araç eklediğinizde otomatik çalışır
2. **Maintainable**: Tek bir yerden yönetim
3. **Flexible**: Manuel override desteği
4. **Clean Code**: Her sayfada tek satır
5. **Scalable**: Yeni kategori eklemek kolay

## 🐛 Sorun Giderme

### Benzer araçlar gösterilmiyor
- URL'in doğru olduğundan emin olun
- `toolsConfig.jsx`'te araç tanımlı mı kontrol edin
- Console'da hata var mı kontrol edin

### Özel eşleşme çalışmıyor
- `similarToolsConfig.js`'te override doğru tanımlı mı kontrol edin
- Tool ID'lerin doğru olduğundan emin olun

## 📚 API Referansı

### `useSimilarTools(options)`
- `maxResults` (number, default: 3): Maksimum sonuç sayısı
- `manualToolIds` (Array<string>, optional): Manuel override

### `findSimilarTools(toolId, maxResults, manualOverrides)`
- Utility fonksiyonu, hook kullanmadan da çağrılabilir

### `getToolById(toolId)`
- Tool ID'ye göre araç bilgisini döndürür

## 🎯 Best Practices

1. **Varsayılan olarak otomatik sistemi kullanın**
2. **Sadece özel durumlarda manuel override ekleyin**
3. **Kategori ilişkilerini güncel tutun**
4. **Yeni araç eklerken kategori yapısını kontrol edin**
