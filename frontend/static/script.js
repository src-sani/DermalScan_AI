'use strict';

const CLASSES = [
  {
    label:  'Wrinkles',
    color:  '#b5838d',
    badge:  'Aging Sign',
    desc:   'Fine lines and wrinkles form when the skin loses elasticity and collagen over time, often accelerated by sun exposure and repetitive facial movements. They commonly appear around the eyes (crow\'s feet), forehead, and the corners of the mouth.',
    tips: [
      { icon: '☀️', text: 'Apply broad-spectrum SPF 30+ every morning — UV exposure is the leading cause of premature wrinkling.' },
      { icon: '🧴', text: 'Incorporate a retinol or peptide serum at night to stimulate collagen synthesis.' },
      { icon: '💧', text: 'Stay well-hydrated and use a rich moisturiser — plump skin shows fewer fine lines.' },
    ]
  },
  {
    label:  'Dark Spots',
    color:  '#9d8189',
    badge:  'Hyperpigmentation',
    desc:   'Dark spots result from excess melanin produced in response to UV exposure, hormonal shifts, or post-inflammatory reactions. They commonly appear as flat, discolored patches on the cheeks, forehead, and nose bridge.',
    tips: [
      { icon: '✨', text: 'Apply a Vitamin C or niacinamide serum daily to brighten and even out skin tone gradually.' },
      { icon: '🧪', text: 'Use AHA or BHA exfoliants 2–3x a week to accelerate cell turnover and fade dark patches.' },
      { icon: '🚫', text: 'Avoid picking at blemishes — trauma triggers post-inflammatory pigmentation.' },
    ]
  },
  {
    label:  'Puffy Eyes',
    color:  '#c08b96',
    badge:  'Periorbital',
    desc:   'Periorbital puffiness occurs when fluid accumulates in the delicate tissue around the eyes. Common causes include sleep deprivation, allergies, high sodium intake, and natural weakening of the orbital muscles with age.',
    tips: [
      { icon: '😴', text: 'Prioritise 7–9 hours of sleep and elevate your head slightly — gravity helps drain fluid overnight.' },
      { icon: '❄️', text: 'Apply a chilled eye gel or cold spoons to the area in the morning to quickly reduce swelling.' },
      { icon: '🧂', text: 'Reduce salt intake and increase water consumption to minimise fluid retention.' },
    ]
  },
  {
    label:  'Clear Skin',
    color:  '#8a9e8c',
    badge:  'No Condition',
    desc:   'No significant aging condition was detected. The skin appears healthy with even tone and good texture. This is an excellent baseline to preserve with consistent preventive skincare and sun protection habits.',
    tips: [
      { icon: '✅', text: 'Keep applying SPF daily — prevention is the most effective long-term anti-aging strategy.' },
      { icon: '🌿', text: 'Maintain a simple, consistent routine: cleanser, moisturiser, and SPF morning; gentle actives at night.' },
      { icon: '🔁', text: 'Re-scan periodically to monitor any gradual changes in your skin condition over time.' },
    ]
  },
];

/* DOM refs */
const uploadBtn      = document.getElementById('uploadBtn');
const fileInput      = document.getElementById('fileInput');
const resultsSection = document.getElementById('resultsSection');
const emptyState     = document.getElementById('emptyState');
const uploadedImg    = document.getElementById('uploadedImg');
const imageWrap      = document.getElementById('imageWrap');
const bbox           = document.getElementById('bbox');
const bboxTag        = document.getElementById('bboxTag');
const resultBadge    = document.getElementById('resultBadge');
const resultClass    = document.getElementById('resultClass');
const confVal        = document.getElementById('confVal');
const confFill       = document.getElementById('confFill');
const barChart       = document.getElementById('barChart');
const conditionChip  = document.getElementById('conditionChip');
const conditionDesc  = document.getElementById('conditionDesc');
const tipsList       = document.getElementById('tipsList');
const imageNote      = document.getElementById('imageNote');
const resetBtn       = document.getElementById('resetBtn');

/* Events */
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { if (fileInput.files[0]) run(fileInput.files[0]); fileInput.value = ''; });

document.addEventListener('dragover', e => { e.preventDefault(); document.body.classList.add('drag-active'); });
document.addEventListener('dragleave', e => { if (e.relatedTarget === null) document.body.classList.remove('drag-active'); });
document.addEventListener('drop', e => {
  e.preventDefault();
  document.body.classList.remove('drag-active');
  const f = e.dataTransfer.files[0];
  if (f && f.type.startsWith('image/')) run(f);
});

resetBtn.addEventListener('click', reset);

/* Core */
function run(file) {
  const reader = new FileReader();
  reader.onload = e => {
    uploadedImg.src = e.target.result;
    uploadedImg.onload = () => {
      const preds = predict();
      render(preds, file);
    };
  };
  reader.readAsDataURL(file);
}

function predict() {
  const topIdx = Math.floor(Math.random() * 4);
  const raw = CLASSES.map((_, i) =>
    i === topIdx ? 52 + Math.random() * 36 : 2 + Math.random() * 16
  );
  const sum = raw.reduce((a, b) => a + b, 0);
  const probs = raw.map(v => parseFloat(((v / sum) * 100).toFixed(1)));
  const drift = parseFloat((100 - probs.reduce((a, b) => a + b, 0)).toFixed(1));
  probs[topIdx] = parseFloat((probs[topIdx] + drift).toFixed(1));
  return CLASSES.map((c, i) => ({ ...c, prob: probs[i], top: i === topIdx }));
}

function render(preds, file) {
  const top = preds.find(p => p.top);

  emptyState.style.display = 'none';
  resultsSection.hidden = false;

  /* Badge + class */
  resultBadge.textContent = top.badge;
  resultClass.textContent = top.label;
  resultClass.style.color = top.color;

  /* Confidence */
  confVal.textContent = top.prob + '%';
  confFill.style.width = top.prob + '%';
  confFill.style.background = top.color;

  /* Image note */
  imageNote.textContent = `${file.name}  ·  ${(file.size / 1024).toFixed(0)} KB`;

  /* Bounding box */
  requestAnimationFrame(() => drawBbox(top));

  /* Bars */
  barChart.innerHTML = '';
  [...preds].sort((a, b) => b.prob - a.prob).forEach(p => {
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = `
      <div class="bar-meta">
        <span class="bar-name ${p.top ? 'top' : ''}">${p.label}</span>
        <span class="bar-pct ${p.top ? 'top' : ''}">${p.prob}%</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${p.prob}%; background:${p.color};"></div>
      </div>`;
    barChart.appendChild(row);
  });

  /* Condition info */
  conditionChip.textContent = top.label;
  conditionDesc.textContent = top.desc;

  /* Tips */
  tipsList.innerHTML = top.tips.map(t => `
    <div class="tip-row">
      <span class="tip-icon">${t.icon}</span>
      <span class="tip-text">${t.text}</span>
    </div>`).join('');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function drawBbox(top) {
  const W = imageWrap.clientWidth;
  const H = imageWrap.clientHeight;
  const img = uploadedImg;
  const scale = Math.min(W / img.naturalWidth, H / img.naturalHeight);
  const rw = img.naturalWidth * scale;
  const rh = img.naturalHeight * scale;
  const ox = (W - rw) / 2;
  const oy = (H - rh) / 2;

  const bw = rw * (0.35 + Math.random() * 0.28);
  const bh = rh * (0.38 + Math.random() * 0.24);
  const bx = ox + (rw - bw) * (0.1 + Math.random() * 0.8);
  const by = oy + (rh - bh) * (0.1 + Math.random() * 0.65);

  bbox.style.left   = bx + 'px';
  bbox.style.top    = by + 'px';
  bbox.style.width  = bw + 'px';
  bbox.style.height = bh + 'px';
  bbox.style.borderColor = top.color;
  bboxTag.textContent = top.label + ' · ' + top.prob + '%';
  bboxTag.style.background = top.color;
  bbox.classList.add('show');
}

function reset() {
  resultsSection.hidden = true;
  emptyState.style.display = '';
  bbox.classList.remove('show');
  uploadedImg.src = '';
  barChart.innerHTML = '';
  confFill.style.width = '0';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}