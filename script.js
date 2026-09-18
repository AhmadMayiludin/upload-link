// Key penyimpanan di LocalStorage
const STORAGE_KEY = 'user_saved_links';

// State aplikasi
let links = [];

// DOM Elements
const linkForm = document.getElementById('linkForm');
const linkUrlInput = document.getElementById('linkUrl');
const linkTitleInput = document.getElementById('linkTitle');
const linkList = document.getElementById('linkList');
const emptyState = document.getElementById('emptyState');
const linkCount = document.getElementById('linkCount');
const searchInput = document.getElementById('searchInput');
const btnClearAll = document.getElementById('btnClearAll');
const btnExport = document.getElementById('btnExport');
const toast = document.getElementById('toast');

// === Helper Functions ===

// Normalisasi URL (menambahkan https:// jika tidak ada protokol)
function normalizeUrl(url) {
  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }
  return cleanUrl;
}

// Tampilkan Toast Notifikasi
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Mengambil data dari LocalStorage
function loadLinks() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      links = JSON.parse(data);
    } catch (e) {
      console.error('Gagal membaca data dari localStorage:', e);
      links = [];
    }
  } else {
    // Contoh data bawaan awal jika baru pertama kali buka
    links = [
      { id: Date.now() - 2000, title: 'Google', url: 'https://google.com' },
      { id: Date.now() - 1000, title: 'YouTube', url: 'https://youtube.com' }
    ];
    saveLinks();
  }
  renderLinks();
}

// Menyimpan data ke LocalStorage
function saveLinks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  renderLinks();
}

// Render daftar link ke layar
function renderLinks(filteredList = null) {
  const listToRender = filteredList !== null ? filteredList : links;
  linkList.innerHTML = '';

  // Update total badge
  linkCount.textContent = links.length;

  // Toggle empty state
  if (listToRender.length === 0) {
    emptyState.classList.add('active');
    if (links.length > 0 && filteredList !== null) {
      emptyState.querySelector('h3').textContent = 'Tidak Ditemukan';
      emptyState.querySelector('p').textContent = 'Tidak ada link yang sesuai dengan pencarian Anda.';
    } else {
      emptyState.querySelector('h3').textContent = 'Belum Ada Link yang Tersimpan';
      emptyState.querySelector('p').textContent = 'Masukkan link pertama Anda melalui formulir di atas!';
    }
    return;
  } else {
    emptyState.classList.remove('active');
  }

  // Generate item berurutan (1. link, 2. link, ...)
  listToRender.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'link-item';

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
    urlEl.target = '_blank';
    urlEl.rel = 'noopener noreferrer';
    urlEl.textContent = item.url;

    content.appendChild(titleEl);
    content.appendChild(urlEl);

    // Tombol Aksi (Buka, Salin, Hapus)
    const actions = document.createElement('div');
    actions.className = 'link-actions';

    // Tombol Buka
    const btnOpen = document.createElement('a');
    btnOpen.className = 'action-btn btn-open';
    btnOpen.href = item.url;
    btnOpen.target = '_blank';
    btnOpen.rel = 'noopener noreferrer';
    btnOpen.title = 'Buka di tab baru';
    btnOpen.innerHTML = '↗';

    // Tombol Salin
    const btnCopy = document.createElement('button');
    btnCopy.className = 'action-btn btn-copy';
    btnCopy.title = 'Salin link';
    btnCopy.innerHTML = '📋';
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(item.url).then(() => {
        showToast('Link berhasil disalin ke clipboard!');
      }).catch(() => {
        showToast('Gagal menyalin link.');
      });
    });

    // Tombol Hapus
    const btnDelete = document.createElement('button');
    btnDelete.className = 'action-btn btn-delete';
    btnDelete.title = 'Hapus link';
    btnDelete.innerHTML = '✕';
    btnDelete.addEventListener('click', () => {
      deleteLink(item.id);
    });

    actions.appendChild(btnOpen);
    actions.appendChild(btnCopy);
    actions.appendChild(btnDelete);

    li.appendChild(numberBadge);
    li.appendChild(content);
    li.appendChild(actions);

    linkList.appendChild(li);
  });
}

// Tambah Link baru
function addLink(e) {
  e.preventDefault();

  const rawUrl = linkUrlInput.value.trim();
  const rawTitle = linkTitleInput.value.trim();

  if (!rawUrl) return;

  const validUrl = normalizeUrl(rawUrl);

  // Jika judul kosong, gunakan nama domain atau URL singkat
  let displayTitle = rawTitle;
  if (!displayTitle) {
    try {
      const urlObj = new URL(validUrl);
      displayTitle = urlObj.hostname.replace('www.', '');
    } catch {
      displayTitle = rawUrl;
    }
  }

  const newLink = {
    id: Date.now(),
    title: displayTitle,
    url: validUrl
  };

  // Tambahkan ke awal atau akhir list (kita tambahkan ke akhir agar urutan 1, 2, 3 konsisten)
  links.push(newLink);
  saveLinks();

  // Reset form
  linkUrlInput.value = '';
  linkTitleInput.value = '';
  linkUrlInput.focus();

  showToast('Link berhasil ditambahkan!');
}

// Hapus satu link
function deleteLink(id) {
  links = links.filter(item => item.id !== id);
  saveLinks();
  showToast('Link dihapus.');
}

// Hapus semua link
function clearAllLinks() {
  if (links.length === 0) {
    showToast('Tidak ada link untuk dihapus.');
    return;
  }

  const confirmClear = confirm('Apakah Anda yakin ingin menghapus SEMUA link yang tersimpan?');
  if (confirmClear) {
    links = [];
    saveLinks();
    showToast('Semua link telah dihapus.');
  }
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
    showToast('Semua link disalin sebagai format daftar teks!');
  }).catch(() => {
    showToast('Gagal menyalin data.');
  });
}

// === Event Listeners ===
linkForm.addEventListener('submit', addLink);
searchInput.addEventListener('input', filterLinks);
btnClearAll.addEventListener('click', clearAllLinks);
btnExport.addEventListener('click', exportLinksAsText);

// Inisialisasi saat web dimuat
document.addEventListener('DOMContentLoaded', loadLinks);
