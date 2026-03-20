const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const annotatedImage = document.getElementById('annotatedImage');
const predictedClass = document.getElementById('predictedClass');
const confidence = document.getElementById('confidence');

imageUpload.addEventListener('change', () => {
  const file = imageUpload.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    imagePreview.src = e.target.result;
    imagePreview.style.display = 'block';

    annotatedImage.src = e.target.result;
    annotatedImage.style.display = 'block';

    predictedClass.innerText = 'Class: Wrinkles';
    confidence.innerText = 'Confidence: 91%';
  };
  reader.readAsDataURL(file);
});