import shutil
from pathlib import Path
from uuid import uuid4
from time import time
from typing import Dict, List, Tuple
from fastapi import UploadFile

import numpy as np
import cv2

from core.services.cv.utils import get_faceswapper

# get faceswapper
APP_INSIGHTFACE, SWAPPER = get_faceswapper()

async def process_video(source_img, target_video_path, output_video_path, time_limit=5):
    """
    Processes a video to perform face swapping for the first `time_limit` seconds.

    Parameters:
        source_img (ndarray): The source image containing the face to swap.
        target_video_path (str): Path to the target video file.
        output_video_path (str): Path to save the output video with swapped faces.
        time_limit (int, optional): Maximum processing time in seconds. Defaults to 10.

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
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        # Calculate the maximum number of frames to process
        max_frames = min(int(fps * time_limit), total_frames)

        # Define codec and create video writer
        fourcc = cv2.VideoWriter_fourcc(*'MJPG')
        out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

        frame_count = 0

        # Process frames
        while frame_count < max_frames:
            ret, frame = cap.read()
            if not ret:
                print("End of video or error reading frame.")
                break

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

        print("Video processing completed successfully.")

    except Exception as e:
        print(f"Error during video processing: {e}")

    finally:
        # Release resources
        if 'cap' in locals() and cap.isOpened():
            cap.release()
        if 'out' in locals():
            out.release()

async def faceswap(session_id, assets_dir, source, target, output_filename):
    if APP_INSIGHTFACE is None or SWAPPER is None:
        raise Exception("Failed to load the face swapper model.")
    
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
        await process_video(source_img, target_path, output_video_path)
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

async def multifaceswap(session_id: str, assets_dir: Path, source, target, face_index: int, output_filename: str):
    """
    source: the uploaded group image (with multiple faces)
    target: the uploaded replacement face image
    face_index: 0-indexed index of the face in the group image to replace.
    output_filename: base filename for the output.
    """
    # Save the uploaded files.
    source_extension = Path(source.filename).suffix.lower()
    target_extension = Path(target.filename).suffix.lower()
    source_path = assets_dir / f"{session_id}_group{source_extension}"
    target_path = assets_dir / f"{session_id}_replacement{target_extension}"

    with open(source_path, "wb") as f:
        f.write(await source.read())
    with open(target_path, "wb") as f:
        f.write(await target.read())

    # Read images.
    group_img = cv2.imread(str(source_path))
    replacement_img = cv2.imread(str(target_path))
    if group_img is None or replacement_img is None:
        raise Exception("Invalid image file")

    # Detect faces in the group image.
    group_faces = APP_INSIGHTFACE.get(group_img)
    if len(group_faces) == 0:
        raise Exception("No faces detected in the group image")
    if face_index < 0 or face_index >= len(group_faces):
        raise Exception("Invalid face index selected")
    selected_face = group_faces[face_index]

    # Detect face in the replacement image.
    replacement_faces = APP_INSIGHTFACE.get(replacement_img)
    if not replacement_faces:
        raise Exception("No face detected in the replacement image")
    replacement_face = replacement_faces[0]

    # Swap the selected face in the group image with the replacement face.
    # IMPORTANT: The group image is updated.
    result_img = SWAPPER.get(group_img, selected_face, replacement_face, paste_back=True)

    output_path = assets_dir / f"{output_filename}.png"
    if not cv2.imwrite(str(output_path), result_img):
        raise Exception("Error writing output image")

    return True, output_path


async def detect_faces_from_image(img, input_path: Path) -> Tuple[List, List[Dict]]:
    """
    Expects 'img' to be a NumPy array (loaded via cv2.imread).
    Returns a tuple (detected_faces, face_boxes) where face_boxes is a list
    of dictionaries (each with keys: x, y, width, height) that are JSON serializable.
    """
    detected_faces = APP_INSIGHTFACE.get(img)  # Adjust as needed for your model.
    face_boxes = []
    for face in detected_faces:
        if isinstance(face, dict):
            bbox = face.get('bbox')
            if bbox is None:
                continue
            bbox_list = [float(x) for x in bbox]
        else:
            bbox_list = [float(face.x), float(face.y), float(face.width), float(face.height)]
        if len(bbox_list) >= 4:
            face_boxes.append({
                "x": bbox_list[0],
                "y": bbox_list[1],
                "width": bbox_list[2],
                "height": bbox_list[3]
            })
    # Clean up the temporary file.
    try:
        input_path.unlink()
    except Exception:
        pass
    return detected_faces, face_boxes