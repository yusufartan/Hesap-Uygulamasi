# Locales (react-i18next)

- **tr** – Turkish (fallback)
- **en** – English

Translation keys are in `tr/translation.json` and `en/translation.json`.

## Profesyonel i18n — Yeni araç ekleme

Kurumsal sitelerdeki gibi: **toolsConfig** sadece yapı tutar (id, path, icon). Tüm metinler translation JSON'dan gelir.

### Yeni araç eklerken

1. **toolsConfig.jsx** — Sadece `{ id, path, icon }` ekle:
   ```js
   { id: 'percent-calc', path: '/percent', icon: <PercentIcon /> }
   ```

2. **tr/translation.json** — Araç metinlerini ekle (mevcut flat format):
   ```json
   "percent-calc": "Yüzde Hesaplama",
   "percent-calcDesc": "İndirim, vergi veya kâr marjı hesaplayın."
   ```

3. **en/translation.json** — Aynı anahtarlarla İngilizce:
   ```json
   "percent-calc": "Percentage Calculator",
   "percent-calcDesc": "Calculate discounts, tax, or profit margin."
   ```

4. **AppRoutes.jsx** — Component mapping'e ekle, sayfa bileşenini oluştur.

Çeviri eksikse `formatIdAsTitle(id)` fallback kullanılır (örn. "percent-calc" → "Percent Calc").

## Number formatting (calculator site)

TR uses comma as decimal separator (1.234,56); EN uses dot (1,234.56). Use the helper from `src/i18n.js`:

```js
import { useTranslation } from 'react-i18next'
import { formatNumber } from '../i18n'

function CalculatorResult({ value }) {
  const { t } = useTranslation()
  return (
    <span>
      {t('result')}: {formatNumber(value)}
    </span>
  )
}
```

**With translation interpolation** (in `translation.json`):

```json
{ "resultLabel": "Sonuç: {{value, number}}" }
```

```js
t('resultLabel', { value: 1234.56 })  // TR: "Sonuç: 1.234,56" — EN: "Result: 1,234.56"
```

**Options** (e.g. decimals):

```js
formatNumber(1234.5, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
```

`formatNumber` uses `Intl.NumberFormat` with `tr-TR` or `en-US` based on current i18n language.
