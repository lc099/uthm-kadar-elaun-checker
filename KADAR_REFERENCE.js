// ============================================================
// KADAR_REFERENCE.js — UTHM Allowance Rate Reference Data
// Source: Pekeliling Bendahari Bil 1/2023 (Tugas Rasmi)
//         Pekeliling Bendahari Bil 1/2024 (Berkursus)
//         Kadar Dan Syarat Tuntutan Elaun Bekerja Rasmi
// ============================================================

const KADAR_REFERENCE = (() => {

  // ─── GRED BANDS ──────────────────────────────────────────
  // Maps individual gred numbers to the rate-band used in Pekeliling tables
  // Returns: { band, label }
  function getGredBand(gred) {
    const g = parseInt(String(gred).replace(/\D/g, ''), 10); // strip "DS45" → 45
    if (isNaN(g)) {
      // Check for special Utama/Khas/VK grades
      const upper = String(gred).toUpperCase();
      if (upper.includes('UTAMA') || upper.includes('KHAS A') || upper.includes('TURUS'))
        return { band: 'UTAMA_KHAS_A', label: 'Utama/Khas A dan ke atas' };
      if (upper.includes('KHAS B') || upper.includes('KHAS C'))
        return { band: 'UTAMA_KHAS_BC', label: 'Utama/Khas B dan C' };
      if (upper.match(/VK\s*[5-7]/i))
        return { band: 'UTAMA_KHAS_A', label: 'VK (Profesor) — setaraf Utama/Khas A' };
      return null;
    }
    if (g >= 55)              return { band: 'UTAMA_KHAS_A', label: 'Gred 55/56 (Utama/Khas A)' };
    if (g >= 53 && g <= 54)   return { band: 'G53_54',       label: 'Gred 53–54' };
    if (g >= 45 && g <= 52)   return { band: 'G45_52',       label: 'Gred 45–52' };
    if (g >= 41 && g <= 44)   return { band: 'G41_44',       label: 'Gred 41–44' };
    if (g >= 29 && g <= 40)   return { band: 'G29_40',       label: 'Gred 29–40' };  // used in hotel (27-40)
    if (g >= 17 && g <= 28)   return { band: 'G17_28',       label: 'Gred 17–28' };  // used in hotel (17-26)
    if (g <= 16)              return { band: 'G16_BAWAH',    label: 'Gred 16 dan ke bawah' };
    return null;
  }

  // Finer hotel band (dalam negeri hotel uses different breakpoints)
  function getHotelBandDN(gred) {
    const g = parseInt(String(gred).replace(/\D/g, ''), 10);
    if (isNaN(g)) return getGredBand(gred)?.band;
    if (g >= 55)              return 'UTAMA_KHAS_A';
    if (g >= 53 && g <= 54)   return 'G53_54';
    if (g >= 45 && g <= 52)   return 'G45_52';
    if (g >= 41 && g <= 44)   return 'G41_44';
    if (g >= 27 && g <= 40)   return 'G27_40';
    if (g >= 17 && g <= 26)   return 'G17_26';
    if (g <= 16)              return 'G16_BAWAH';
    return null;
  }


  // ─── 1. TUGAS RASMI DALAM NEGERI (Pekeliling 1/2023 §6) ─
  const RASMI_DN = {
    elaunMakan: {
      // §6.1 — Elaun Makan (RM sehari, ≥24 jam)
      semenanjung: {
        'UTAMA_KHAS_A': 115, 'UTAMA_KHAS_BC': 100,
        'G53_54': 85,  'G45_52': 60,  'G41_44': 45,
        'G29_40': 40,  'G17_28': 40,  'G16_BAWAH': 35
      },
      sabah_sarawak: {
        'UTAMA_KHAS_A': 165, 'UTAMA_KHAS_BC': 130,
        'G53_54': 115, 'G45_52': 80,  'G41_44': 65,
        'G29_40': 55,  'G17_28': 55,  'G16_BAWAH': 50
      }
    },
    sewaHotel: {
      // §6.3 — Bayaran Sewa Hotel (maksimum RM) & Elaun Lojing
      semenanjung: {
        //               hotel_max,  lojing
        'UTAMA_KHAS_A': { hotel: 'Sebenar (Standard Suite)', lojing: 100 },
        'UTAMA_KHAS_BC': { hotel: 'Sebenar (Bilik Superior)', lojing: 100 },
        'G53_54':       { hotel: 'Sebenar (Bilik Biasa)',     lojing: 100 },
        'G45_52':       { hotel: 240,                         lojing: 60 },
        'G41_44':       { hotel: 220,                         lojing: 60 },
        'G27_40':       { hotel: 200,                         lojing: 50 },
        'G17_26':       { hotel: 180,                         lojing: 50 },
        'G16_BAWAH':    { hotel: 160,                         lojing: 50 }
      },
      sabah_sarawak: {
        'UTAMA_KHAS_A': { hotel: 'Sebenar (Standard Suite)', lojing: 110 },
        'UTAMA_KHAS_BC': { hotel: 'Sebenar (Bilik Superior)', lojing: 110 },
        'G53_54':       { hotel: 'Sebenar (Bilik Biasa)',     lojing: 110 },
        'G45_52':       { hotel: 270,                         lojing: 70 },
        'G41_44':       { hotel: 250,                         lojing: 70 },
        'G27_40':       { hotel: 230,                         lojing: 60 },
        'G17_26':       { hotel: 210,                         lojing: 60 },
        'G16_BAWAH':    { hotel: 190,                         lojing: 60 }
      }
    },
    perbatuan: {
      // §6.7 — Elaun Perjalanan Kenderaan (sen/km)
      kereta:    { first500: 85, after500: 75 },
      motosikal: { first500: 55, after500: 45 }
    },
    saguhati: {
      // §10 — Bayaran Sagu Hati Persidangan (RM/sehari)
      'G41_ATAS': 50, 'G17_40': 30, 'G16_BAWAH': 20
    }
  };


  // ─── 2. TUGAS RASMI LUAR NEGERI (Pekeliling 1/2023 §7) ──
  const RASMI_LN = {
    elaunMakan: {
      // §7.1 — Elaun Makan Luar Negeri by Gred (RM sehari)
      // Gred 45 & above have fixed rates; Gred 44 & below use Lampiran B (by country kategori)
      byGred: {
        'UTAMA_KHAS_A': 370,
        'UTAMA_KHAS_BC': 340,
        'G53_54': 320,
        'G45_52': 270
        // G44 dan ke bawah: use byKategori below
      },
      // Lampiran B — for Gred 44 dan ke bawah (also used as Pendahuluan Diri reference)
      byKategori: {
        I:   { elaunMakan: 175, sewaHotel: 400, lojing: 100 },
        II:  { elaunMakan: 195, sewaHotel: 440, lojing: 120 },
        III: { elaunMakan: 215, sewaHotel: 480, lojing: 140 },
        IV:  { elaunMakan: 235, sewaHotel: 520, lojing: 160 },
        V:   { elaunMakan: 255, sewaHotel: 560, lojing: 180 }
      }
    },
    sewaHotel: {
      // §7.2 — Bayaran Sewa Hotel Luar Negeri
      // Utama/Khas A: Standard Suite (sebenar)
      // Others: Bilik Biasa (sebenar) — use Lampiran B as guide for Pendahuluan Diri
      jenisbilik: {
        'UTAMA_KHAS_A': 'Standard Suite',
        'DEFAULT': 'Bilik Biasa'
      }
    },
    elaunPakaianPanas: 1500, // RM, sekali dalam 3 tahun
    belanjaPelbagai: {
      matawangAsingGantirugi: 0.03, // 3% of total tuntutan
      tips: 0.15 // 15% of elaun makan
    }
  };


  // ─── 3. BERKURSUS LUAR NEGERI (Pekeliling 1/2024 §8) ─────
  const BERKURSUS_LN = {
    elaunMakan: {
      // §8.1 — Elaun Makan Berkursus LN by Gred (RM sehari)
      byGred: {
        'UTAMA_KHAS_A': 300,
        'UTAMA_KHAS_BC': 270,
        'G53_54': 240,
        'G45_52': 200
        // Others: use Lampiran C byKategori
      },
      // Lampiran C — for Gred 44 dan ke bawah
      byKategori: {
        I:   { elaunMakan: 100, sewaHotel: 200, lojing: 100 },
        II:  { elaunMakan: 120, sewaHotel: 300, lojing: 120 },
        III: { elaunMakan: 140, sewaHotel: 400, lojing: 140 },
        IV:  { elaunMakan: 160, sewaHotel: 500, lojing: 160 },
        V:   { elaunMakan: 180, sewaHotel: 600, lojing: 180 }
      }
    },
    sewaHotel: {
      // §8.2 — Bayaran Sewa Hotel
      byGred: {
        'KUMPULAN_PENGURUSAN_TERTINGGI': 'Bilik Biasa',
        'DEFAULT': 'Lampiran C by kategori'
      }
    }
  };


  // ─── 4. BERKURSUS DALAM NEGERI (Pekeliling 1/2024 §5) ────
  const BERKURSUS_DN = {
    // Lampiran B of Pekeliling 1/2024
    semenanjung: {
      'UTAMA_KHAS_A': { makan: 90,  hotel: 'Sebenar (Standard Suite)', lojing: 100 },
      'UTAMA_KHAS_BC': { makan: 90,  hotel: 'Sebenar (Bilik Superior)', lojing: 100 },
      'G53_54':       { makan: 70,  hotel: 'Sebenar (Bilik Biasa)',     lojing: 100 },
      'G45_52':       { makan: 60,  hotel: 240,                         lojing: 60 },
      'G41_44':       { makan: 45,  hotel: 220,                         lojing: 60 },
      'G29_40':       { makan: 40,  hotel: 200,                         lojing: 50 },
      'G17_28':       { makan: 40,  hotel: 180,                         lojing: 50 },
      'G16_BAWAH':    { makan: 35,  hotel: 160,                         lojing: 50 }
    },
    sabah_sarawak: {
      'UTAMA_KHAS_A': { makan: 120, hotel: 'Sebenar (Standard Suite)', lojing: 110 },
      'UTAMA_KHAS_BC': { makan: 120, hotel: 'Sebenar (Bilik Superior)', lojing: 110 },
      'G53_54':       { makan: 90,  hotel: 'Sebenar (Bilik Biasa)',     lojing: 110 },
      'G45_52':       { makan: 80,  hotel: 270,                         lojing: 70 },
      'G41_44':       { makan: 65,  hotel: 250,                         lojing: 70 },
      'G27_40':       { makan: 55,  hotel: 230,                         lojing: 60 },
      'G17_26':       { makan: 55,  hotel: 210,                         lojing: 60 },
      'G16_BAWAH':    { makan: 50,  hotel: 190,                         lojing: 60 }
    },
    elaunSaraHidup: {
      luarKawasan: 25,  // RM sehari — kursus panjang di luar kawasan Ibu Pejabat
      dalamKawasan: 15  // RM sehari — kursus panjang di dalam kawasan
    },
    kursusSambilan: {
      luarKawasan: 10,  // RM sehari (RM5 makan + RM5 perjalanan)
      dalamKawasan: 8   // RM sehari (RM5 makan + RM3 perjalanan)
    }
  };


  // ─── 5. COUNTRY → KATEGORI MAPPING ──────────────────────
  // Unified mapping used for BOTH Lampiran B (Rasmi) and Lampiran C (Berkursus)
  // Same country→kategori applies to both pekeliling
  const COUNTRY_KATEGORI = {
    // KATEGORI I
    'Afghanistan': 'I', 'Aruba': 'I', 'Azerbaijan': 'I', 'Egypt': 'I',
    'Georgia': 'I', 'India': 'I', 'Kosovo': 'I', 'Kyrgyzstan': 'I',
    'Libya': 'I', 'Maldives': 'I', 'Nepal': 'I', 'Pakistan': 'I',
    'Syria': 'I', 'Tajikistan': 'I', 'Tunisia': 'I', 'Turkmenistan': 'I',
    'Uzbekistan': 'I',

    // KATEGORI II
    'Albania': 'II', 'Algeria': 'II', 'Angola': 'II', 'Argentina': 'II',
    'Armenia': 'II', 'Bangladesh': 'II', 'Belarus': 'II', 'Benin': 'II',
    'Bhutan': 'II', 'Bolivia': 'II', 'Bosnia And Herzegovina': 'II',
    'Botswana': 'II', 'Bulgaria': 'II', 'Burkina Faso': 'II', 'Burundi': 'II',
    'Cameroon': 'II', 'Cape Verde': 'II', 'Central African Republic': 'II',
    'Chad': 'II', 'Colombia': 'II', 'Comoros': 'II',
    'Democratic Republic of Congo': 'II', 'Equatorial Guinea': 'II',
    'Eswatini': 'II', 'Gabon': 'II', 'Gambia': 'II', 'Ghana': 'II',
    'Guinea': 'II', 'Guinea-Bissau': 'II', 'Indonesia': 'II', 'Iran': 'II',
    'Iraq': 'II', 'Ivory Coast': 'II', 'Kazakhstan': 'II', 'Laos': 'II',
    'Liberia': 'II', 'Malaysia': 'II', 'Malawi': 'II', 'Mali': 'II',
    'Mauritania': 'II', 'Mexico': 'II', 'Moldova': 'II', 'Mongolia': 'II',
    'Montenegro': 'II', 'Morocco': 'II', 'Niger': 'II', 'Nigeria': 'II',
    'North Macedonia': 'II', 'Palau': 'II', 'Paraguay': 'II', 'Peru': 'II',
    'Philippines': 'II', 'Republic of Congo': 'II', 'Romania': 'II',
    'Russia': 'II', 'Rwanda': 'II', 'Sao Tome and Principe': 'II',
    'Senegal': 'II', 'Serbia': 'II', 'Sierra Leone': 'II', 'Somalia': 'II',
    'Sri Lanka': 'II', 'Tanzania': 'II', 'Timor Leste': 'II', 'Togo': 'II',
    'Turkey': 'II', 'Uganda': 'II', 'Ukraine': 'II', 'Vietnam': 'II',
    'Western Sahara': 'II', 'Zambia': 'II',

    // KATEGORI III
    'Belize': 'III', 'Brazil': 'III', 'Brunei': 'III', 'Cambodia': 'III',
    'Cayman Island': 'III', 'Chile': 'III', 'China': 'III', 'Croatia': 'III',
    'Cuba': 'III', 'Czech Republic': 'III', 'Djibouti': 'III',
    'Ecuador': 'III', 'El Salvador': 'III', 'Fiji': 'III',
    'French Guiana': 'III', 'Grenada': 'III', 'Guatemala': 'III',
    'Honduras': 'III', 'Hungary': 'III', 'Kenya': 'III', 'Latvia': 'III',
    'Lesotho': 'III', 'Lithuania': 'III', 'Madagascar': 'III',
    'Mayotte': 'III', 'Mozambique': 'III', 'Myanmar': 'III',
    'Namibia': 'III', 'Nicaragua': 'III', 'Palestine': 'III',
    'Poland': 'III', 'Portugal': 'III', 'Saudi Arabia': 'III',
    'Slovakia': 'III', 'South Africa': 'III', 'Sudan': 'III',
    'Suriname': 'III', 'Thailand': 'III', 'Tokelau': 'III',
    'Tonga': 'III', 'Tuvalu': 'III', 'Vanuatu': 'III',
    'Wallis and Fatuna': 'III',

    // KATEGORI IV
    'Bahrain': 'IV', 'Costa Rica': 'IV', 'Cyprus': 'IV', 'Eritrea': 'IV',
    'Estonia': 'IV', 'Ethiopia': 'IV', 'Gilbratar': 'IV', 'Greece': 'IV',
    'Guyana': 'IV', 'Haiti': 'IV', 'Jamaica': 'IV', 'Jordan': 'IV',
    'Kuwait': 'IV', 'Mauritius': 'IV', 'North Korea': 'IV', 'Oman': 'IV',
    'Panama': 'IV', 'Papua New Guinea': 'IV', 'Slovenia': 'IV',
    'Solomon Islands': 'IV', 'Spain': 'IV', 'Trinidad And Tobago': 'IV',
    'Turks and Caicos Islands': 'IV', 'Uruguay': 'IV', 'Yemen': 'IV',
    'Zimbabwe': 'IV',

    // KATEGORI V
    'Andorra': 'V', 'Anguilla': 'V', 'Antigua and Barbuda': 'V',
    'Australia': 'V', 'Austria': 'V', 'Bahamas': 'V', 'Barbados': 'V',
    'Belgium': 'V', 'Bermuda': 'V', 'British States Virgins Islands': 'V',
    'Canada': 'V', 'Cook Islands': 'V', 'Denmark': 'V', 'Dominica': 'V',
    'Dominican Republic': 'V', 'Faroe Island': 'V', 'Finland': 'V',
    'France': 'V', 'Germany': 'V', 'Greenland': 'V', 'Guernsey': 'V',
    'Hong Kong': 'V', 'Iceland': 'V', 'Ireland': 'V', 'Isle of Man': 'V',
    'Israel': 'V', 'Italy': 'V', 'Japan': 'V', 'Jersey': 'V',
    'Kiribati': 'V', 'Lebanon': 'V', 'Liechtenstein': 'V',
    'Luxembourg': 'V', 'Macau': 'V', 'Malta': 'V',
    'Marshall Island': 'V', 'Micronesia': 'V', 'Monaco': 'V',
    'Montserrat': 'V', 'Nauru': 'V', 'Netherlands': 'V',
    'New Zealand': 'V', 'Niue': 'V', 'Norway': 'V', 'Qatar': 'V',
    'Puerto Rico': 'V', 'Saint Helena': 'V', 'Saint Kits and Nevis': 'V',
    'Saint Lucia': 'V', 'Saint Vincent and Grenadines': 'V', 'Samoa': 'V',
    'San Marino': 'V', 'Seychelles': 'V', 'Singapore': 'V',
    'South Korea': 'V', 'South Sudan': 'V', 'Sweden': 'V',
    'Switzerland': 'V', 'Taiwan': 'V', 'United Arab Emirates': 'V',
    'United Kingdom': 'V', 'United States': 'V',
    'United States Virgins Islands': 'V'
  };


  // ─── 6. GRED → JAWATAN MAPPING (from Gred_name file) ────
  const GRED_JAWATAN = [
    { scheme: 'N',  jawatan: 'Pembantu Tadbir',         gred: 'N19',  num: 19 },
    { scheme: 'N',  jawatan: 'Pembantu Tadbir',         gred: 'N22',  num: 22 },
    { scheme: 'N',  jawatan: 'Pembantu Tadbir',         gred: 'N26',  num: 26 },
    { scheme: 'N',  jawatan: 'Penolong Pegawai Tadbir', gred: 'N29',  num: 29 },
    { scheme: 'N',  jawatan: 'Penolong Pegawai Tadbir', gred: 'N32',  num: 32 },
    { scheme: 'N',  jawatan: 'Penolong Pegawai Tadbir', gred: 'N36',  num: 36 },
    { scheme: 'N',  jawatan: 'Pegawai Tadbir',          gred: 'N41',  num: 41 },
    { scheme: 'N',  jawatan: 'Pegawai Tadbir Kanan',    gred: 'N44',  num: 44 },
    { scheme: 'N',  jawatan: 'Pegawai Tadbir',          gred: 'N48',  num: 48 },
    { scheme: 'N',  jawatan: 'Pegawai Tadbir',          gred: 'N52',  num: 52 },
    { scheme: 'N',  jawatan: 'Pegawai Tadbir',          gred: 'N54',  num: 54 },
    { scheme: 'DG', jawatan: 'Guru Bahasa',             gred: 'DG41', num: 41 },
    { scheme: 'DG', jawatan: 'Guru Bahasa',             gred: 'DG44', num: 44 },
    { scheme: 'DG', jawatan: 'Guru Bahasa',             gred: 'DG48', num: 48 },
    { scheme: 'DG', jawatan: 'Guru Bahasa',             gred: 'DG52', num: 52 },
    { scheme: 'DG', jawatan: 'Guru Bahasa',             gred: 'DG54', num: 54 },
    { scheme: 'DS', jawatan: 'Pensyarah',               gred: 'DS45', num: 45 },
    { scheme: 'DS', jawatan: 'Pensyarah Kanan',         gred: 'DS51', num: 51 },
    { scheme: 'DS', jawatan: 'Pensyarah Kanan',         gred: 'DS53', num: 53 },
    { scheme: 'DS', jawatan: 'Pensyarah Kanan',         gred: 'DS54', num: 54 },
    { scheme: 'VK', jawatan: 'Profesor Madya/Profesor',  gred: 'VK7',  num: 55 },
    { scheme: 'VK', jawatan: 'Profesor Madya/Profesor',  gred: 'VK6',  num: 55 },
    { scheme: 'VK', jawatan: 'Profesor Madya/Profesor',  gred: 'VK5',  num: 55 }
  ];


  // ─── 7. MAIN LOOKUP FUNCTION ─────────────────────────────
  /**
   * getKadar(options) — Main entry point
   *
   * @param {string}  options.gred      — e.g. "DS45", "N41", "VK7", "52"
   * @param {string}  options.country   — e.g. "Indonesia", "Japan", "Turkey"
   * @param {string}  options.jenis     — "rasmi" | "berkursus"
   * @param {string}  options.lokasi    — "luar_negara" | "dalam_negara"
   * @param {string}  options.kawasan   — "semenanjung" | "sabah_sarawak"  (for DN only)
   *
   * @returns {object} {
   *   elaunMakan, elaunHarian, sewaHotel, lojing, kategoriNegara,
   *   gredBand, gredLabel, perbatuan, tips, matawang, pakaianPanas
   * }
   */
  function getKadar({
    gred,
    country = '',
    jenis = 'rasmi',        // rasmi | berkursus
    lokasi = 'luar_negara', // luar_negara | dalam_negara
    kawasan = 'semenanjung' // semenanjung | sabah_sarawak
  } = {}) {
    const band = getGredBand(gred);
    if (!band) return { error: `Gred "${gred}" tidak dikenalpasti` };

    const result = {
      gredBand: band.band,
      gredLabel: band.label,
      kategoriNegara: null,
      elaunMakan: null,
      elaunHarian: null,   // = separuh elaun makan
      sewaHotel: null,
      lojing: null,
      perbatuan: null,
      tips: null,
      matawangGantirugi: null,
      pakaianPanas: null,
      spiSource: null      // pekeliling reference
    };

    // ── LUAR NEGARA ──
    if (lokasi === 'luar_negara') {
      // Determine country kategori
      const kat = getCountryKategori(country);
      result.kategoriNegara = kat;

      if (jenis === 'rasmi') {
        result.spiSource = 'Pekeliling Bendahari Bil 1/2023 §7 (Rasmi Luar Negeri)';
        // Elaun Makan
        const fixedRate = RASMI_LN.elaunMakan.byGred[band.band];
        if (fixedRate) {
          result.elaunMakan = fixedRate;
        } else if (kat) {
          result.elaunMakan = RASMI_LN.elaunMakan.byKategori[kat]?.elaunMakan || null;
        }
        // Hotel & Lojing — from Lampiran B (all gred use kategori for pendahuluan diri)
        if (kat) {
          result.sewaHotel = RASMI_LN.elaunMakan.byKategori[kat]?.sewaHotel || null;
          result.lojing = RASMI_LN.elaunMakan.byKategori[kat]?.lojing || null;
        }
        // Extras
        result.tips = result.elaunMakan ? Math.round(result.elaunMakan * 0.15) : null;
        result.matawangGantirugi = '3% daripada jumlah tuntutan';
        result.pakaianPanas = RASMI_LN.elaunPakaianPanas;

      } else {
        // berkursus
        result.spiSource = 'Pekeliling Bendahari Bil 1/2024 §8 (Berkursus Luar Negeri)';
        const fixedRate = BERKURSUS_LN.elaunMakan.byGred[band.band];
        if (fixedRate) {
          result.elaunMakan = fixedRate;
        } else if (kat) {
          result.elaunMakan = BERKURSUS_LN.elaunMakan.byKategori[kat]?.elaunMakan || null;
        }
        if (kat) {
          result.sewaHotel = BERKURSUS_LN.elaunMakan.byKategori[kat]?.sewaHotel || null;
          result.lojing = BERKURSUS_LN.elaunMakan.byKategori[kat]?.lojing || null;
        }
      }
      // Elaun Harian = separuh elaun makan
      result.elaunHarian = result.elaunMakan ? result.elaunMakan / 2 : null;

    // ── DALAM NEGERI ──
    } else {
      const kw = kawasan === 'sabah_sarawak' ? 'sabah_sarawak' : 'semenanjung';

      if (jenis === 'rasmi') {
        result.spiSource = 'Pekeliling Bendahari Bil 1/2023 §6 (Rasmi Dalam Negeri)';
        const mkBand = band.band;
        // For makan, G29_40 and G17_28 share same rate in semenanjung
        result.elaunMakan = RASMI_DN.elaunMakan[kw][mkBand] || RASMI_DN.elaunMakan[kw]['G29_40'] || null;
        result.elaunHarian = result.elaunMakan ? result.elaunMakan / 2 : null;

        // Hotel uses different band breakpoints
        const hBand = getHotelBandDN(gred);
        const hotelData = RASMI_DN.sewaHotel[kw][hBand];
        if (hotelData) {
          result.sewaHotel = hotelData.hotel;
          result.lojing = hotelData.lojing;
        }
        result.perbatuan = RASMI_DN.perbatuan;

      } else {
        // berkursus DN
        result.spiSource = 'Pekeliling Bendahari Bil 1/2024 §5 (Berkursus Dalam Negeri)';
        const bkData = BERKURSUS_DN[kw][band.band];
        if (bkData) {
          result.elaunMakan = bkData.makan;
          result.sewaHotel = bkData.hotel;
          result.lojing = bkData.lojing;
        }
        result.elaunHarian = result.elaunMakan ? result.elaunMakan / 2 : null;
      }
    }

    return result;
  }


  // ─── HELPER: Country → Kategori ──────────────────────────
  function getCountryKategori(country) {
    if (!country) return null;
    // Try exact match first
    if (COUNTRY_KATEGORI[country]) return COUNTRY_KATEGORI[country];
    // Case-insensitive search
    const lower = country.toLowerCase().trim();
    for (const [name, kat] of Object.entries(COUNTRY_KATEGORI)) {
      if (name.toLowerCase() === lower) return kat;
    }
    // Partial match
    for (const [name, kat] of Object.entries(COUNTRY_KATEGORI)) {
      if (name.toLowerCase().includes(lower) || lower.includes(name.toLowerCase())) return kat;
    }
    return null;
  }


  // ─── PECAHAN ELAUN MAKAN ─────────────────────────────────
  // If meal is provided, deduct from elaun makan
  function pecahanMakan(elaunMakan, { sarapan = false, tengahhari = false, malam = false } = {}) {
    let pct = 100;
    if (sarapan)    pct -= 20;
    if (tengahhari) pct -= 40;
    if (malam)      pct -= 40;
    return Math.round(elaunMakan * pct / 100);
  }


  // ─── PUBLIC API ──────────────────────────────────────────
  return {
    getKadar,
    getGredBand,
    getCountryKategori,
    pecahanMakan,
    COUNTRY_KATEGORI,
    RASMI_DN,
    RASMI_LN,
    BERKURSUS_DN,
    BERKURSUS_LN,
    GRED_JAWATAN
  };

})();


// ─── USAGE EXAMPLES ──────────────────────────────────────
/*
// Example 1: Pensyarah DS45 going to Indonesia for rasmi
const r1 = KADAR_REFERENCE.getKadar({
  gred: 'DS45', country: 'Indonesia', jenis: 'rasmi', lokasi: 'luar_negara'
});
// → { elaunMakan: 270, sewaHotel: 440, lojing: 120, kategoriNegara: 'II', ... }

// Example 2: Staff N41 berkursus in Japan
const r2 = KADAR_REFERENCE.getKadar({
  gred: 'N41', country: 'Japan', jenis: 'berkursus', lokasi: 'luar_negara'
});
// → { elaunMakan: 180, sewaHotel: 600, lojing: 180, kategoriNegara: 'V', ... }

// Example 3: Staff N29 tugas rasmi dalam negeri (Semenanjung)
const r3 = KADAR_REFERENCE.getKadar({
  gred: 'N29', jenis: 'rasmi', lokasi: 'dalam_negara', kawasan: 'semenanjung'
});
// → { elaunMakan: 40, sewaHotel: 200, lojing: 50, ... }

// Example 4: Pecahan makan — tengahhari disediakan
const netMakan = KADAR_REFERENCE.pecahanMakan(270, { tengahhari: true });
// → 270 × 60% = 162

// Example 5: Get country kategori
KADAR_REFERENCE.getCountryKategori('Turkey');  // → 'II'
KADAR_REFERENCE.getCountryKategori('Japan');   // → 'V'
*/
