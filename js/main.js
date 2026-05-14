let data = null;
let currentImages = [];
let currentIdx = 0;

function u(str) {
  return encodeURI(str).replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");
}

const descriptions = {
  "Electric bike": "Custom electric motorcycle conversion",
  "Dehydronator": "Commercial-grade food dehydrator fabrication",
  "Pill Machine": "Precision tooling and die components",
  "Titan Med Tool": "Titanium medical device manufacturing",
  "Stator": "Motor stator core assembly",
  "Broach Machine Weldments": "Heavy equipment weldments",
  "AutoCAD": "Technical CAD engineering drawings",
  "Gummy": "Confectionery mold production",
  "Ice Cube Mold": "Specialty ice mold tooling",
  "Misc": "Additional manufacturing projects"
};

const accentColors = {
  "Electric bike": "cyan",
  "Dehydronator": "mint",
  "Pill Machine": "blue",
  "Titan Med Tool": "violet",
  "Stator": "amber",
  "Broach Machine Weldments": "indigo",
  "AutoCAD": "cyan",
  "Gummy": "mint",
  "Ice Cube Mold": "blue",
  "Misc": "amber"
};

document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('data.json');
  data = await res.json();

  if (document.getElementById('gallery')) {
    loadGallery();
    return;
  }
  renderCards();
});

function renderCards() {
  const grid = document.getElementById('card-grid');
  if (!grid) return;
  grid.innerHTML = '';

  data.categories.forEach(cat => {
    const card = document.createElement('a');
    card.className = 'card accent-' + (accentColors[cat.name] || 'cyan');
    card.href = 'gallery.html?category=' + encodeURIComponent(cat.slug);
    card.style.setProperty('--card-accent', getComputedStyle(card).getPropertyValue('--card-accent'));

    const src = cat.cover ? u(cat.cover) : '';
    const desc = descriptions[cat.name] || '';

    card.innerHTML = [
      '<img class="card-cover" src="' + src + '" alt="' + cat.name + '" loading="lazy" onerror="this.style.display=\'none\'">',
      '<div class="card-body">',
      '  <div class="card-accent-stripe"></div>',
      '  <div class="card-title">' + cat.name + '</div>',
      desc ? '  <div class="card-desc">' + desc + '</div>' : '',
      '  <div class="card-meta">' + cat.count + ' photo' + (cat.count !== 1 ? 's' : '') + '</div>',
      cat.pdfs.length ? '<div class="card-pdf-badge">' + cat.pdfs.length + ' drawing' + (cat.pdfs.length !== 1 ? 's' : '') + '</div>' : '',
      '</div>'
    ].join('');
    grid.appendChild(card);
  });
}

function loadGallery() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('category');
  if (!slug) {
    document.getElementById('gallery').innerHTML = '<div class="loading">No category specified.</div>';
    return;
  }

  const cat = data.categories.find(c => c.slug === slug);
  if (!cat) {
    document.getElementById('gallery').innerHTML = '<div class="loading">Category not found.</div>';
    return;
  }

  document.title = cat.name + ' | Tylor Good Portfolio';
  document.getElementById('gallery-title').textContent = cat.name;
  document.getElementById('gallery-count').textContent = cat.count + ' photo' + (cat.count !== 1 ? 's' : '');

  const grid = document.getElementById('gallery-grid');
  cat.images.forEach((img, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = '<img src="' + u('images/' + cat.name + '/' + img) + '" alt="' + img + '" loading="lazy" onclick="openLightbox(' + i + ')">';
    grid.appendChild(item);
  });

  currentImages = cat.images.map(img => u('images/' + cat.name + '/' + img));

  if (cat.pdfs.length) {
    const pdfGrid = document.getElementById('pdf-grid');
    document.getElementById('pdf-title').textContent = 'Technical Drawings (' + cat.pdfs.length + ')';
    cat.pdfs.forEach(pdf => {
      const name = pdf.split('/').pop();
      const card = document.createElement('div');
      card.className = 'pdf-card';
      card.innerHTML = '<a href="' + u(pdf) + '" target="_blank" rel="noopener"><div class="pdf-icon">PDF</div><div class="pdf-name">' + name + '</div></a>';
      pdfGrid.appendChild(card);
    });
    document.getElementById('pdf-section').style.display = 'block';
  }
}

function openLightbox(idx) {
  currentIdx = idx;
  document.getElementById('lightbox-img').src = currentImages[idx];
  document.getElementById('lightbox-counter').textContent = (idx + 1) + ' / ' + currentImages.length;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function prevImage(e) {
  e.stopPropagation();
  currentIdx = (currentIdx - 1 + currentImages.length) % currentImages.length;
  openLightbox(currentIdx);
}

function nextImage(e) {
  e.stopPropagation();
  currentIdx = (currentIdx + 1) % currentImages.length;
  openLightbox(currentIdx);
}

document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') {
    currentIdx = (currentIdx - 1 + currentImages.length) % currentImages.length;
    openLightbox(currentIdx);
  }
  if (e.key === 'ArrowRight') {
    currentIdx = (currentIdx + 1) % currentImages.length;
    openLightbox(currentIdx);
  }
});
