# IWA Rich U D — Company Website

เว็บไซต์บริษัท ไอว่า ริช ยู ดี จำกัด (ICT Solutions & สื่อการเรียนรู้ดิจิทัล)

Static single-page site — no build step required. Open `index.html` directly, or serve locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

- `index.html` — all page views (home, about, services, store, training, contact, cart)
- `assets/css/style.css` — design system + animations
- `assets/js/app.js` — rendering, navigation, cart, checkout, forms
- `assets/js/promptpay.js` — EMV/PromptPay QR payload builder (demo mode — not linked to a live merchant account)
- `assets/js/qrcode.min.js` — vendored QR rendering library ([qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) by Kazuhiko Arase, MIT)
- `assets/img/` — photos sourced from the company's own Company Profile PDF

## Notes

- Cart and orders persist in `localStorage`; nothing is sent to a server.
- The checkout PromptPay QR is explicitly labeled as a demo and does not route to a real bank account. To go live, wire `assets/js/app.js` (`renderCheckoutStep`, step 3) to a real PromptPay ID and a backend/payment gateway.
- Contact and checkout forms use `mailto:` to hand off to the visitor's email client — replace with a real backend endpoint for production use.
