# payment-paybo

Repository ini berisi automasi pengujian end‑to‑end (E2E) untuk system **Back Office - Payment System**, menggunakan **Cypress** 

---

## Instalasi & Setup

1. Clone repo ini ke lokal:

    ```bash
    git clone https://github.com/prastowoardi/payment-paybo.git
    cd payment-paybo
    ```

2. Install dependensi:

    ```bash
    npm install
    ```

3. Tambahkan file `.env` di root project dengan konten seperti:

    ```env
    BASEURL=http://localhost:3000
    EMAIL=your.email@example.com
    PASSWORD=secret123
    ```

    → Pastikan `BASEURL` menggunakan format URL valid (dengan `http://` atau `https://`).

---

## Menjalankan Cypress

- Buka UI Cypress secara interaktif:

    ```bash
    npx cypress open
    ```

- Atau jalankan headless mode (CLI):

    ```bash
    npx cypress run
    ```

---

## Struktur dan Konfigurasi

payment-paybo/
├── cypress/
│ └── e2e/
│ └── *.js ← file-file test
├── .env
└── cypress.config.js

