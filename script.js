// Daftar 4 Link TikTok Utama Milik Anda
const links = [
  { id: 1, title: 'Video TikTok 1', url: 'https://vt.tiktok.com/ZS9AdUEBn2xqj-WhAzd/' },
  { id: 2, title: 'Video TikTok 2', url: 'https://vt.tiktok.com/ZS9Adaspjy7MW-zHVoM/' },
  { id: 3, title: 'Video TikTok 3', url: 'https://vt.tiktok.com/ZS9AdvMmS4BjS-L337z/' },
  { id: 4, title: 'Video TikTok 4', url: 'https://vt.tiktok.com/ZS9AdcMaRGaAL-TBsVX/' }
];

// DOM Elements
const linkList = document.getElementById('linkList');
const emptyState = document.getElementById('emptyState');
const linkCount = document.getElementById('linkCount');
const searchInput = document.getElementById('searchInput');
const btnExport = document.getElementById('btnExport');
const toast = document.getElementById('toast');
const tiktokBanner = document.getElementById('tiktokBanner');

// === Helper Functions ===

// Deteksi jika website dibuka dari dalam aplikasi TikTok (In-App Browser)
function checkInAppBrowser() {
  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const isTikTok = /musical_ly|ByteDance|TikTok/i.test(ua);
  if (isTikTok && tiktokBanner) {
    tiktokBanner.classList.add('show');
  }
}

// Buka link langsung (Universal Android Intent & Auto-copy)
function openDirectLink(url) {
  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const isAndroid = /android/i.test(ua);

  // Otomatis salin link ke clipboard untuk kenyamanan pengguna
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('Membuka TikTok... (Link disalin)');
    }).catch(() => {});
  }

  if (isAndroid) {
    const cleanPath = url.replace(/^https?:\/\//, '');
    // Gunakan intent universal tanpa mengunci package khusus agar tidak error "Tindakan tidak dapat diselesaikan"
    const intentUrl = `intent://${cleanPath}#Intent;scheme=https;end;`;
    window.location.href = intentUrl;
  } else {
    // Di iOS atau desktop, arahkan langsung
    window.location.href = url;
  }
}

// Tampilkan Toast Notifikasi
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Render daftar link ke layar
function renderLinks(filteredList = null) {
  const listToRender = filteredList !== null ? filteredList : links;
  linkList.innerHTML = '';

  // Update total badge
  linkCount.textContent = listToRender.length;

  // Toggle empty state saat pencarian tidak menemukan hasil
  if (listToRender.length === 0) {
    emptyState.classList.add('active');
    return;
  } else {
    emptyState.classList.remove('active');
  }

  // Generate item berurutan (1. link, 2. link, ...)
  listToRender.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'link-item';
    li.style.cursor = 'pointer';

    // Nomor urut dinamis (1, 2, 3...)
    const numberBadge = document.createElement('div');
    numberBadge.className = 'link-number';
    numberBadge.textContent = `${index + 1}.`;

    // Konten (Judul & URL)
    const content = document.createElement('div');
    content.className = 'link-content';

    const titleEl = document.createElement('div');
    titleEl.className = 'link-title';
    titleEl.textContent = item.title || item.url;

    const urlEl = document.createElement('a');
    urlEl.className = 'link-url';
    urlEl.href = item.url;
    urlEl.textContent = item.url;
    // Hindari target="_blank" agar tidak diblokir oleh in-app browser TikTok
    urlEl.addEventListener('click', (e) => {
      e.preventDefault();
      openDirectLink(item.url);
    });

    content.appendChild(titleEl);
    content.appendChild(urlEl);

    // Tombol Aksi (Hanya Buka & Salin)
    const actions = document.createElement('div');
    actions.className = 'link-actions';

    // Tombol Buka (Memanggil openDirectLink)
    const btnOpen = document.createElement('button');
    btnOpen.className = 'action-btn btn-open';
    btnOpen.title = 'Buka di TikTok';
    btnOpen.innerHTML = '↗';
    btnOpen.addEventListener('click', (e) => {
      e.stopPropagation();
      openDirectLink(item.url);
    });

    // Tombol Salin
    const btnCopy = document.createElement('button');
    btnCopy.className = 'action-btn btn-copy';
    btnCopy.title = 'Salin link';
    btnCopy.innerHTML = '📋';
    btnCopy.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(item.url).then(() => {
        showToast('Link berhasil disalin ke clipboard!');
      }).catch(() => {
        showToast('Gagal menyalin link.');
      });
    });

    actions.appendChild(btnOpen);
    actions.appendChild(btnCopy);

    li.appendChild(numberBadge);
    li.appendChild(content);
    li.appendChild(actions);

    // Klik seluruh kartu untuk langsung membuka link
    li.addEventListener('click', (e) => {
      if (!e.target.closest('.btn-copy')) {
        openDirectLink(item.url);
      }
    });

    linkList.appendChild(li);
  });
}

// Filter / Cari link
function filterLinks() {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) {
    renderLinks();
    return;
  }

  const filtered = links.filter(item => 
    (item.title && item.title.toLowerCase().includes(query)) ||
    (item.url && item.url.toLowerCase().includes(query))
  );

  renderLinks(filtered);
}

// Salin semua link dalam format teks (1. url \n 2. url)
function exportLinksAsText() {
  if (links.length === 0) {
    showToast('Belum ada link untuk disalin.');
    return;
  }

  const textData = links.map((item, index) => {
    return `${index + 1}. ${item.title !== item.url ? item.title + ' - ' : ''}${item.url}`;
  }).join('\n');

  navigator.clipboard.writeText(textData).then(() => {
    showToast('Semua 4 link disalin sebagai daftar teks!');
  }).catch(() => {
    showToast('Gagal menyalin data.');
  });
}

// === Event Listeners ===
if (searchInput) {
  searchInput.addEventListener('input', filterLinks);
}
if (btnExport) {
  btnExport.addEventListener('click', exportLinksAsText);
}

// Inisialisasi saat web dimuat
document.addEventListener('DOMContentLoaded', () => {
  checkInAppBrowser();
  renderLinks();
});
