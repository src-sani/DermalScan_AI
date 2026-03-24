from fastapi import FastAPI
from fastapi import UploadFile, File
import os

app = FastAPI()

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    
    # create uploads folder if not exists
    os.makedirs("../uploads", exist_ok=True)

    file_path = f"../uploads/{file.filename}"

    # save file
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return {
        "message": "File saved successfully",
        "filename": file.filename
    }