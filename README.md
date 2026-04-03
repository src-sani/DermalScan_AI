# 🌐 Skin Condition Classification Web Application

## 📌 Overview

This project is a full-stack machine learning web application developed as part of an academic internship project. The system performs image classification on skin images and predicts one of four skin conditions using a deep learning model.

The application provides real-time predictions along with confidence scores, making the results interpretable, transparent, and user-friendly.

---

## 🎯 Objective

The main objective of this project is to design and implement an end-to-end deployable machine learning system that:

- Classifies skin images into predefined categories  
- Provides prediction confidence scores  
- Offers an interactive web interface for users  
- Demonstrates real-world deployment of a deep learning model using modern web technologies  

---

## 🏷️ Classes Predicted

The model classifies input images into the following four categories:

- Clear Skin  
- Dark Spots  
- Puffy Eyes  
- Wrinkles  

---

## 📊 Dataset Description

- Total images: ~1200  
- Type: Labeled image dataset  
- Number of classes: 4  
- Preprocessing techniques: resizing, normalization, and augmentation  

---

## 🧠 Machine Learning Model

- Architecture: EfficientNetB0  
- Type: Transfer Learning Convolutional Neural Network (CNN)  
- Framework: TensorFlow / Keras  
- Output:
  - Predicted class label  
  - Confidence score  
  - Probability distribution across all classes  

---

## 🏗️ System Architecture

The system consists of three main components:

### 1. Frontend
- Built using HTML, CSS, and JavaScript  
- Handles user interaction and image upload  
- Displays prediction results and visualization  

### 2. Backend
- Built using FastAPI  
- Handles image upload, preprocessing, and inference  
- Returns prediction results as JSON response  

### 3. Machine Learning Model
- Trained EfficientNetB0 model  
- Loaded during runtime for inference  
- Performs classification on preprocessed images  

---

## 🔄 Workflow

1. User uploads an image through the web interface  
2. Frontend sends the image to the backend API  
3. Backend preprocesses the image  
4. Model performs inference on the image  
5. Class probabilities are computed  
6. Highest probability class is selected as prediction  
7. Result and confidence score are sent back to frontend  
8. UI displays prediction with visual indicators  

---

## ⚡ Key Features

- Real-time image classification  
- Confidence score visualization  
- Probability distribution display  
- Interactive drag-and-drop UI  
- Lightweight and fast inference system  
