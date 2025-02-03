import os
import requests

from insightface.app import FaceAnalysis
import insightface

def get_faceswapper():
    # Define model variables
    MODEL_URL = "https://huggingface.co/ezioruan/inswapper_128.onnx/resolve/main/inswapper_128.onnx"
    # MODEL_URL = "https://huggingface.co/netrunner-exe/Insight-Swap-models/resolve/main/inswapper_128.fp16.onnx"
    MODEL_LOCATION = "core/assets/models/faceswapper"
    MODEL_NAME = "inswapper_128.onnx"
    MODEL_PATH = os.path.join(MODEL_LOCATION, MODEL_NAME)

    # Your Hugging Face token
    HUGGINGFACE_TOKEN = os.getenv("HF_TOKEN")

    # Ensure the target directory exists
    os.makedirs(MODEL_LOCATION, exist_ok=True)

    # Check if the model already exists, if not, download it
    if not os.path.isfile(MODEL_PATH):
        try:
            print(f"Downloading model from {MODEL_URL}...")
            headers = {"Authorization": f"Bearer {HUGGINGFACE_TOKEN}"}
            response = requests.get(MODEL_URL, headers=headers, stream=True)
            response.raise_for_status()
            with open(MODEL_PATH, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"Model downloaded successfully to {MODEL_PATH}.")
        except Exception as e:
            print(f"Error downloading the model: {e}")
            exit(1)
    else:
        print(f"Model already exists at {MODEL_PATH}. Skipping download.")

    # Attempt to load the model
    try:
        SWAPPER = insightface.model_zoo.get_model(MODEL_PATH, download=False)
        print("Face swapper model loaded successfully.")
    except Exception as e:
        print(f"Failed to load the face swapper model: {e}")

    # Initialize FaceAnalysis and Swapper
    APP_INSIGHTFACE = FaceAnalysis(name="buffalo_l")
    APP_INSIGHTFACE.prepare(ctx_id=0, det_size=(640, 640))

    try:
        SWAPPER = insightface.model_zoo.get_model("core/assets/models/faceswapper/inswapper_128.onnx", download=False)
    except Exception as e:
        print(f"Failed to load the face swapper model: {e}")

    return APP_INSIGHTFACE, SWAPPER