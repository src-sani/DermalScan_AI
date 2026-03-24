'use strict';

/* ─── Class Definitions ───────────────────────────────────────────────────── */
const CLASSES = [
  {
    label:  'Wrinkles',
    color:  '#b5838d',
    badge:  'Aging Sign',
    // Heatmap focus hint: wrinkles cluster around forehead, eye corners, mouth
    heatRegions: [
      { cx: 0.50, cy: 0.22, rx: 0.32, ry: 0.08, intensity: 0.85 }, // forehead
      { cx: 0.26, cy: 0.42, rx: 0.12, ry: 0.08, intensity: 0.90 }, // left eye corner
      { cx: 0.74, cy: 0.42, rx: 0.12, ry: 0.08, intensity: 0.90 }, // right eye corner
      { cx: 0.50, cy: 0.70, rx: 0.22, ry: 0.07, intensity: 0.75 }, // mouth area
      { cx: 0.50, cy: 0.50, rx: 0.40, ry: 0.40, intensity: 0.18 }, // soft ambient
    ],
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
    // Heatmap focus: cheeks, forehead, nose bridge
    heatRegions: [
      { cx: 0.30, cy: 0.52, rx: 0.14, ry: 0.12, intensity: 0.92 }, // left cheek
      { cx: 0.70, cy: 0.52, rx: 0.14, ry: 0.12, intensity: 0.88 }, // right cheek
      { cx: 0.50, cy: 0.28, rx: 0.20, ry: 0.10, intensity: 0.80 }, // forehead
      { cx: 0.50, cy: 0.45, rx: 0.07, ry: 0.12, intensity: 0.75 }, // nose bridge
      { cx: 0.50, cy: 0.50, rx: 0.40, ry: 0.40, intensity: 0.15 }, // ambient
    ],
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
    // Heatmap focus: under-eye region
    heatRegions: [
      { cx: 0.30, cy: 0.44, rx: 0.16, ry: 0.09, intensity: 0.95 }, // left under-eye
      { cx: 0.70, cy: 0.44, rx: 0.16, ry: 0.09, intensity: 0.95 }, // right under-eye
      { cx: 0.30, cy: 0.38, rx: 0.12, ry: 0.06, intensity: 0.70 }, // left eyelid
      { cx: 0.70, cy: 0.38, rx: 0.12, ry: 0.06, intensity: 0.70 }, // right eyelid
      { cx: 0.50, cy: 0.50, rx: 0.40, ry: 0.40, intensity: 0.10 }, // ambient
    ],
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
    // Heatmap: even, low-intensity spread — model is "looking everywhere"
    heatRegions: [
      { cx: 0.50, cy: 0.45, rx: 0.38, ry: 0.42, intensity: 0.40 }, // whole face
      { cx: 0.50, cy: 0.45, rx: 0.20, ry: 0.22, intensity: 0.30 }, // centre
    ],
    desc:   'No significant aging condition was detected. The skin appears healthy with even tone and good texture. This is an excellent baseline to preserve with consistent preventive skincare and sun protection habits.',
    tips: [
      { icon: '✅', text: 'Keep applying SPF daily — prevention is the most effective long-term anti-aging strategy.' },
      { icon: '🌿', text: 'Maintain a simple, consistent routine: cleanser, moisturiser, and SPF morning; gentle actives at night.' },
      { icon: '🔁', text: 'Re-scan periodically to monitor any gradual changes in your skin condition over time.' },
    ]
  },
];

/* ─── DOM References ──────────────────────────────────────────────────────── */
const uploadBtn      = document.getElementById('uploadBtn');
const fileInput      = document.getElementById('fileInput');
const resultsSection = document.getElementById('resultsSection');
const emptyState     = document.getElementById('emptyState');
const uploadedImg    = document.getElementById('uploadedImg');
const imageWrap      = document.getElementById('imageWrap');
const resultBadge    = document.getElementById('resultBadge');
const resultClass    = document.getElementById('resultClass');
const confVal        = document.getElementById('confVal');
const confFill       = document.getElementById('confFill');
const barChart       = document.getElementById('barChart');
const conditionChip  = document.getElementById('conditionChip');
const conditionDesc  = document.getElementById('conditionDesc');
const tipsList       = document.getElementById('tipsList');
const imageNote      = document.getElementById('imageNote');

/* ─── Event Listeners ─────────────────────────────────────────────────────── */
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) run(fileInput.files[0]);
  fileInput.value = '';
});

document.addEventListener('dragover', e => {
  e.preventDefault();
  document.body.classList.add('drag-active');
});
document.addEventListener('dragleave', e => {
  if (e.relatedTarget === null) document.body.classList.remove('drag-active');
});
document.addEventListener('drop', e => {
  e.preventDefault();
  document.body.classList.remove('drag-active');
  const f = e.dataTransfer.files[0];
  if (f && f.type.startsWith('image/')) run(f);
});


/* ─── Core Pipeline ───────────────────────────────────────────────────────── */

/**
 * Entry point: reads file, loads image, runs prediction, renders UI.
 * @param {File} file - Image file chosen by user.
 */
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

/**
 * Simulates EfficientNet classification output.
 * In production, replace this with a real model inference call (e.g. ONNX.js or API).
 * @returns {Array} Array of class objects with probability scores.
 */
function predict() {
  const topIdx = Math.floor(Math.random() * 4);
  const raw = CLASSES.map((_, i) =>
    i === topIdx ? 52 + Math.random() * 36 : 2 + Math.random() * 16
  );
  const sum = raw.reduce((a, b) => a + b, 0);
  const probs = raw.map(v => parseFloat(((v / sum) * 100).toFixed(1)));
  // Correct rounding drift
  const drift = parseFloat((100 - probs.reduce((a, b) => a + b, 0)).toFixed(1));
  probs[topIdx] = parseFloat((probs[topIdx] + drift).toFixed(1));
  return CLASSES.map((c, i) => ({ ...c, prob: probs[i], top: i === topIdx }));
}

/**
 * Renders all UI sections with prediction results.
 * @param {Array} preds - Output from predict().
 * @param {File}  file  - Original image file (for metadata display).
 */
function render(preds, file) {
  const top = preds.find(p => p.top);

  emptyState.style.display = 'none';
  resultsSection.hidden = false;

  // Badge + class label
  resultBadge.textContent    = top.badge;
  resultClass.textContent    = top.label;
  resultClass.style.color    = top.color;

  // Confidence bar
  confVal.textContent        = top.prob + '%';
  confFill.style.width       = top.prob + '%';
  confFill.style.background  = top.color;

  // File metadata
  imageNote.textContent = `${file.name}  ·  ${(file.size / 1024).toFixed(0)} KB`;

  // Probability bar chart (sorted descending)
  barChart.innerHTML = '';
  [...preds].sort((a, b) => b.prob - a.prob).forEach(p => {
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = `
      <div class="bar-meta">
        <span class="bar-name ${p.top ? 'top' : ''}">${p.label}</span>
        <span class="bar-pct  ${p.top ? 'top' : ''}">${p.prob}%</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${p.prob}%; background:${p.color};"></div>
      </div>`;
    barChart.appendChild(row);
  });

  // Condition description
  conditionChip.textContent = top.label;
  conditionDesc.textContent = top.desc;

  // Skincare tips
  tipsList.innerHTML = top.tips.map(t => `
    <div class="tip-row">
      <span class="tip-icon">${t.icon}</span>
      <span class="tip-text">${t.text}</span>
    </div>`).join('');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}