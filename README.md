# 🌐 Link Keeper (Penyimpan Link Tanpa Database)

Aplikasi web sederhana dan elegan untuk menyimpan daftar link berurutan (1. link, 2. link, ...) tanpa database. Menggunakan `localStorage` bawaan browser sehingga data link otomatis tersimpan di perangkat pengguna secara instan dan aman.

## 🚀 Cara Menjalankan di Komputer Lokal

Cukup buka file `index.html` langsung di browser Anda (klik ganda file `index.html` atau klik kanan > *Open with Google Chrome / Edge / Firefox*).

---

## ☁️ Cara Hosting ke Vercel (Gratis & Mudah)

Aplikasi ini adalah **web statis (HTML/CSS/JS murni)**, sehingga sangat mudah dan cepat di-hosting di Vercel:

### Opsi 1: Lewat Dashboard Vercel (Paling Mudah)
1. Buka [vercel.com](https://vercel.com) dan login (bisa pakai akun GitHub/Google).
2. Upload folder ini ke repository GitHub Anda (atau gunakan fitur *Add New...* -> *Project* di Vercel).
3. Pilih repository Anda di Vercel.
4. Pada bagian **Framework Preset**, biarkan **Other** (karena murni HTML/CSS/JS).
5. Klik **Deploy**! Web langsung aktif dengan URL gratis seperti `https://nama-project.vercel.app`.

### Opsi 2: Menggunakan Terminal / Vercel CLI
Jalankan perintah berikut di folder proyek ini (`d:\link`):
```bash
npx vercel
```
Ikuti instruksi singkat di layar (cukup tekan `Enter` untuk pilihan default). Web Anda akan langsung aktif dalam hitungan detik!

---

## 🌟 Fitur Utama
- **Tanpa Database**: Menggunakan browser `localStorage`.
- **Penomoran Otomatis**: Tampilan nomor rapi `1. link`, `2. link`, `3. link`, dst.
- **Otomatis https://**: Jika memasukkan `detik.com`, sistem otomatis mengubahnya menjadi `https://detik.com`.
- **Aksi Cepat**:
  - ↗ Buka link langsung di tab baru.
  - 📋 Salin (copy) link ke clipboard dalam 1 klik.
  - ✕ Hapus link individual.
  - 🗑️ Bersihkan semua link sekaligus.
- **Pencarian / Filter**: Memudahkan mencari link ketika daftar sudah banyak.
- **Salin Semua Link (Teks)**: Fitur untuk menyalin semua link dalam format teks bernomor.
- **Desain Modern & Responsif**: Tampilan rapi dan nyaman dilihat di HP maupun komputer/laptop.
