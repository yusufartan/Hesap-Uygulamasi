# Currency sayfası hatası – başka bir AI için dosya listesi

## Hata
- **Tarayıcı:** `Failed to fetch dynamically imported module: http://localhost:5173/src/pages/CurrencyPage.jsx?t=...`
- **Bağlam:** Currency sayfası `React.lazy()` ile yükleniyor; sayfa açılınca bu dynamic import başarısız oluyor (muhtemelen Vite dev server ilgili chunk’a 500 dönüyor).

## Bu hatayı çözmek için paylaşılması gereken dosyalar

Aşağıdaki dosyaları **tam yolu ve içeriğiyle** kopyalayıp yapay zekâya verin.

### 1. Routing ve lazy load
- `src/routes/AppRoutes.jsx`

### 2. Currency sayfası ve feature
- `src/pages/CurrencyPage.jsx`
- `src/features/currency-converter/CurrencyCalc.jsx`
- `src/features/currency-converter/currencyUtils.js`
- `src/features/currency-converter/currencyNames.js`
- `src/features/currency-converter/CurrencyChart.jsx`

### 3. CurrencyCalc’in import ettiği diğerleri
- `src/config/similarToolsConfig.js`
- `src/config/toolsConfig.jsx` (veya .js – projede hangisi varsa)
- `src/hooks/useTranslation.js`
- `src/utils/i18nHelpers.js`
- `src/components/common/SimilarToolsCard.jsx`

### 4. Build / dev server
- `vite.config.js`
- `package.json` (dependency’ler için)

### 5. Opsiyonel (hata sınırı / genel yapı)
- `src/components/ErrorBoundary.jsx`
- `src/App.jsx`

---

## Kopyalanacak dosya yolları (tek liste)

```
src/routes/AppRoutes.jsx
src/pages/CurrencyPage.jsx
src/features/currency-converter/CurrencyCalc.jsx
src/features/currency-converter/currencyUtils.js
src/features/currency-converter/currencyNames.js
src/features/currency-converter/CurrencyChart.jsx
src/config/similarToolsConfig.js
src/config/toolsConfig.jsx
src/hooks/useTranslation.js
src/utils/i18nHelpers.js
src/components/common/SimilarToolsCard.jsx
vite.config.js
package.json
src/components/ErrorBoundary.jsx
src/App.jsx
```

---

## Denenen çözümler (işe yaramadı)
- `currencyUtils.js` içinden `apiConfig` import’u kaldırıldı; API URL sabit yazıldı.
- Top-level `await import()` kaldırıldı.
- Hata devam ediyor; muhtemel neden: lazy chunk içinde başka bir modül (örn. `similarToolsConfig` → `toolsConfig`, veya `useTranslation` → `i18nHelpers`) Vite tarafından işlenirken 500’e yol açıyor.

## İstenen çözüm
- Currency sayfası lazy yüklendiğinde “Failed to fetch dynamically imported module” hatası alınmamalı.
- Vite dev server’da (terminal) Currency sayfasına tıklanınca çıkan hata mesajı varsa onu da paylaşmak faydalı olur.
