import shutil
from pathlib import Path
from uuid import uuid4
from time import time
import os
import requests

import cv2
from insightface.app import FaceAnalysis
import insightface
import numpy as np

# Define model variables
MODEL_URL = "https://huggingface.co/ezioruan/inswapper_128.onnx/resolve/main/inswapper_128.onnx"
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

# Assuming APP_INSIGHTFACE and SWAPPER are pre-configured instances of face detection and swapping utilities.
def process_video(source_img, target_video_path, output_video_path, time_limit=10, frame_skip=0):
    """
    Processes a video to perform face swapping for the first `time_limit` seconds.
    Skips every `frame_skip` frames to optimize processing.

    Parameters:
        source_img (ndarray): The source image containing the face to swap.
        target_video_path (str): Path to the target video file.
        output_video_path (str): Path to save the output video with swapped faces.
        time_limit (int, optional): Maximum processing time in seconds. Defaults to 60.
        frame_skip (int, optional): Number of frames to skip between processing. Defaults to 2.

    Raises:
        Exception: If no faces are detected in the source image or the video cannot be opened.
    """
    try:
        # Detect faces in the source image
        source_faces = APP_INSIGHTFACE.get(source_img)
        if not source_faces:
            raise Exception("No faces detected in the source image.")

        source_face = source_faces[0]

        # Open the target video
        cap = cv2.VideoCapture(target_video_path)
        if not cap.isOpened():
            raise Exception(f"Failed to open video: {target_video_path}")

        # Get video properties
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')


        # Create a video writer for the output
        out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

        frame_count = 0
        max_frames = int(fps * time_limit)  # Limit processing to `time_limit` seconds
        start_time = time()

        while frame_count < max_frames:
            ret, frame = cap.read()
            if not ret:
                print("End of video or error reading frame.")
                break

            # Skip frames to optimize processing
            # if frame_count % frame_skip != 0:
            #     frame_count += 1
            #     continue

            # Detect faces in the current frame
            target_faces = APP_INSIGHTFACE.get(frame)

            if target_faces:
                # Perform face swapping on the first detected face
                target_face = target_faces[0]
                swapped_frame = SWAPPER.get(frame, target_face, source_face, paste_back=True)
            else:
                # No faces detected; use the original frame
                swapped_frame = frame

            # Write the processed frame to the output video
            out.write(swapped_frame)

            frame_count += 1

            # Stop processing if it exceeds `time_limit` seconds
            if time() - start_time > time_limit:
                print(f"Time limit of {time_limit} seconds reached. Stopping early.")
                break

        print("Video processing completed successfully.")

    except Exception as e:
        print(f"Error during video processing: {e}")

    finally:
        # Release resources
        if 'cap' in locals() and cap.isOpened():
            cap.release()
        if 'out' in locals():
            out.release()

def faceswap(session_id, assets_dir, source, target, output_filename):
    # Extract extensions
    source_extension = Path(source.filename).suffix.lower()
    target_extension = Path(target.filename).suffix.lower()

    # Generate unique file paths
    source_path = assets_dir / f"{session_id}_input_source{source_extension}"
    target_path = assets_dir / f"{session_id}_input_target{target_extension}"
    output_path = assets_dir / output_filename

    # add extension to output path
    output_path = output_path.with_suffix(target_extension)

    # Save uploaded files to temporary paths
    try:
        with source.file as src_file, open(source_path, "wb") as temp_src:
            shutil.copyfileobj(src_file, temp_src)
        with target.file as tgt_file, open(target_path, "wb") as temp_tgt:
            shutil.copyfileobj(tgt_file, temp_tgt)
    except Exception as e:
        raise Exception(f"Failed to save the uploaded files: {e}")

    # Process video or image
    if target_extension in [".mp4", ".mov", ".avi"]:
        print("Processing video...")
        source_img = cv2.imread(str(source_path))
        if source_img is None:
            raise Exception(f"Source image could not be read: {source_path}")

        output_video_path = output_path
        process_video(source_img, target_path, output_video_path)
    else:
        print("Processing image...")
        source_img = cv2.imread(str(source_path))
        target_img = cv2.imread(str(target_path))

        if source_img is None or target_img is None:
            raise Exception("One or both images could not be read.")

        # Detect faces
        source_faces = APP_INSIGHTFACE.get(source_img)
        target_faces = APP_INSIGHTFACE.get(target_img)

        if len(source_faces) == 0 or len(target_faces) == 0:
            raise Exception("No faces detected in one or both images.")

        # Assuming one face per image for simplicity
        source_face = source_faces[0]
        target_face = target_faces[0]

        # Perform face swapping
        result_img = target_img.copy()
        result_img = SWAPPER.get(result_img, target_face, source_face, paste_back=True)

        # Save the result
        output_path = output_path.with_suffix(".png")
        try:
            cv2.imwrite(str(output_path), result_img)
        except Exception as e:
            raise Exception(f"Failed to save the output image: {e}")

    return True, output_path
