# הקסם של לבנה – תבנית Shopify

תבנית Shopify (Online Store 2.0) לאתר תצוגה ומכירה של עבודות קרמיקה. עברית מימין לשמאל כברירת מחדל, ואנגלית כשפה נוספת.

## איך זה מתחבר לתוכנית העבודה (אוקטובר 2026)

| דרישה בתוכנית | איך זה מכוסה |
|---|---|
| שלב ד': מסד נתונים משותף, מלאי, הזמנות | Shopify (מנוהל בשרת, לא ב-localStorage) |
| שלב ד': סליקה אמיתית | Shopify Payments / ספק סליקה ישראלי מתוך Shopify |
| שלב ד': אימיילים ללקוח וללבנה | התראות מובנות של Shopify (Settings > Notifications) |
| שלב ד': פאנל ניהול עם אימות אמיתי | ממשק הניהול של Shopify, עם אימות דו-שלבי (2FA) |
| שלב א': אחסון, HTTPS, CDN | Shopify (כלול, HTTPS אוטומטי) |
| שלב א': דומיין | Settings > Domains – חיבור דומיין ‎.co.il / ‎.com |
| שלב ב': כותרות אבטחה, WAF, DDoS | מנוהל על ידי Shopify (כולל Cloudflare בתשתית) |
| שלב ב': git כגיבוי והיסטוריה | ה-repo הזה, מחובר ל-Shopify דרך GitHub |
| שלב ג': פרטי עוסק באתר | הגדרות התבנית > "פרטי עוסק", מוצג בתחתית כל עמוד |
| שלב ג': תיבות הסכמה נפרדות, לא מסומנות | ניוזלטר וטופס יצירת קשר, כל אחד עם תיבה ונוסח משלו |
| שלב ג': מנגנון בקשת עיון/מחיקת מידע | תבנית עמוד `page.privacy-request` |
| שלב ג': מחיר כולל מע״מ, זמן אספקה, זכות ביטול | מוצג בעמוד המוצר |
| שלב ג': מדיניות פרטיות, תנאי שימוש, החזרות | Settings > Policies – מוצגים אוטומטית בתחתית |

## מבנה התיקיות

```
layout/      theme.liquid (מסגרת), password.liquid
templates/   index, product, collection, cart, page, page.contact, page.privacy-request ...
sections/    hero, featured-collection, collection-list, features, image-with-text, rich-text,
             main-product, main-collection, main-cart, contact-form, header, footer ...
snippets/    product-card, price, icon, business-details, consent-checkbox, pagination, meta-tags
assets/      base.css, theme.js
config/      settings_schema.json (הגדרות שמופיעות בעורך), settings_data.json
locales/     he.default.json, en.json
```

## העלאה ל-GitHub (פעם ראשונה)

1. מתקינים Git: https://git-scm.com/download/win
2. בתיקייה הזו מריצים:
   ```
   git init
   git add .
   git commit -m "Initial Levana Ceramic theme"
   git branch -M main
   git remote add origin https://github.com/mgmsb2v9dd-web/Levana_Ceramic.git
   git push -u origin main
   ```

## חיבור ל-Shopify

1. ב-Shopify Admin: **Online Store > Themes > Add theme > Connect from GitHub**.
2. מאשרים גישה ל-GitHub, בוחרים את `Levana_Ceramic` ואת הענף `main`.
3. התבנית תופיע ב-Theme library. לוחצים **Customize** כדי לערוך, ו-**Publish** כשמוכן.
4. מעכשיו כל `git push` מעדכן את התבנית בחנות, וכל שינוי בעורך של Shopify נשמר כ-commit ב-GitHub.

## אחרי החיבור – הגדרות ב-Shopify

- **Theme settings > פרטי עוסק**: שם, מספר עוסק, כתובת, טלפון, אימייל, זמן אספקה.
- **Settings > Policies**: מדיניות פרטיות, החזרות, משלוחים, תנאי שימוש. כדאי לבדוק עם עו״ד את זכות הביטול לפריטים ייחודיים.
- **Online Store > Pages**: ליצור עמוד "בקשת פרטיות" עם התבנית `page.privacy-request` ולבחור אותו ב-Theme settings > פרטיות. ליצור עמוד "צור קשר" עם התבנית `page.contact`.
- **Navigation**: תפריט `main-menu` (חנות, קולקציות, אודות, צור קשר) ותפריט `footer`.
- **Products / Collections**: קולקציות לדוגמה: ספלים, קערות, אגרטלים. פריט יחיד במינו: לסמן מעקב מלאי, כמות 1, ולהוסיף תגית `יחיד` (מציג תווית "יחיד במינו").
- **Settings > Payments**: הפעלת סליקה (דורש רישום עוסק – ראו שלב ג').
- **Settings > Languages**: עברית כשפה ראשית.

## פיתוח מקומי (אופציונלי)

```
npx @shopify/cli@3 theme dev --store <your-store>.myshopify.com
npx @shopify/cli@3 theme check
```
