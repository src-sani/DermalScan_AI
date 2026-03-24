import numpy as np
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.preprocessing import image

IMG_SIZE = (224, 224)  # must match your training

def preprocess_image(img_path: str) -> np.ndarray:
    """
    Load an image from path and preprocess it for EfficientNetB0.
    Returns a batch of one image (shape: 1, 224, 224, 3)
    """
    img = image.load_img(img_path, target_size=IMG_SIZE)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array