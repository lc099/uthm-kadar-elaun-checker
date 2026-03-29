# UTHM Allowance Checker

Semakan pantas kadar elaun makan, sewa hotel dan lojing untuk staf Universiti Tun Hussein Onn Malaysia (UTHM) — tugas rasmi dan berkursus, dalam dan luar negara.

🌐 **Live:** [https://YOUR_USERNAME.github.io/uthm-kadar-elaun/](https://YOUR_USERNAME.github.io/uthm-kadar-elaun/)

---

## Ciri-ciri

- **Tugas Rasmi / Berkursus** — toggle antara dua pekeliling
- **Dalam Negeri / Luar Negara** — kadar berbeza mengikut lokasi
- **Gred SSM & SSPA** — dropdown papar kedua-dua sistem gred
- **222 Negara** — pemetaan lengkap Kategori I–V (Lampiran B/C)
- **Auto-fill** — pilih gred + negara, kadar terus terpapar
- **Semenanjung vs Sabah/Sarawak** — jadual perbandingan DN

## Sumber Pekeliling

| Rujukan | Tajuk | Tarikh |
|---|---|---|
| PB 1/2023 | Tugas Rasmi Di Dalam Dan Luar Negara | Berkuat kuasa Dis 2022 |
| PB 1/2024 | Berkursus Kecuali Kursus Pra Perkhidmatan | Berkuat kuasa Feb 2024 |

## Fail

```
uthm-kadar-elaun/
├── index.html                              ← Webapp (GitHub Pages)
├── KADAR_REFERENCE.js                      ← JS module (untuk integrasi Portal)
├── Kadar_Rujukan_Pekeliling_UTHM_v2.xlsx   ← Excel rujukan (5 sheets)
└── README.md
```

## Deploy

1. Buat repo baru di GitHub: `uthm-kadar-elaun`
2. Upload semua 4 fail
3. **Settings → Pages → Source:** `main` branch, `/ (root)` → Save
4. Tunggu 1–2 minit — webapp live di URL atas

## Kadar Ringkas

### Luar Negara — Elaun Makan

| Gred | Rasmi (RM/hari) | Berkursus (RM/hari) |
|---|---|---|
| Utama/Khas A (VK) | 370 | 300 |
| Gred 53–54 | 320 | 240 |
| Gred 45–52 | 270 | 200 |
| Gred ≤44 | Ikut Kategori Negara | Ikut Kategori Negara |

### Kategori Negara (Gred ≤44, Rasmi)

| Kat | Makan | Hotel | Lojing | Contoh |
|---|---|---|---|---|
| I | RM 175 | RM 400 | RM 100 | India, Pakistan, Nepal |
| II | RM 195 | RM 440 | RM 120 | Indonesia, Turkey, Vietnam |
| III | RM 215 | RM 480 | RM 140 | Thailand, China, Brunei |
| IV | RM 235 | RM 520 | RM 160 | Spain, Greece, Jordan |
| V | RM 255 | RM 560 | RM 180 | Japan, South Korea, UK, US |

---

Pejabat Antarabangsa, UTHM · 2026
