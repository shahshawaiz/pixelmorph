import traceback
from typing import Optional, Dict
import cv2
import mediapipe as mp
import numpy as np

def determine_face_shape(landmarks: np.ndarray) -> str:
    """
    Determines the face shape based on facial landmarks.

    Args:
        landmarks (np.ndarray): Array of facial landmarks.

    Returns:
        str: Face shape.
    """
    # Calculate distances
    face_width = np.linalg.norm(landmarks[454] - landmarks[234])  # Horizontal width
    face_height = np.linalg.norm(landmarks[10] - landmarks[152])    # Vertical height
    jaw_width = np.linalg.norm(landmarks[234] - landmarks[152])       # Jaw width
    forehead_width = np.linalg.norm(landmarks[10] - landmarks[234])   # Approximate forehead width

    # Ratios
    width_height_ratio = face_width / face_height
    jaw_forehead_ratio = jaw_width / forehead_width

    # Determine face shape based on ratios
    if width_height_ratio < 0.85:
        return "Oblong"
    elif abs(face_width - face_height) < 0.1 * face_width and jaw_forehead_ratio < 1.1:
        return "Round"
    elif jaw_forehead_ratio > 1.3 and width_height_ratio > 0.9:
        return "Square"
    elif forehead_width > jaw_width and abs(forehead_width - jaw_width) > 0.15 * face_width:
        return "Heart-shaped"
    elif jaw_width > forehead_width and jaw_forehead_ratio > 1.2:
        return "Diamond"
    else:
        return "Oval"

async def detect_faceshape(input_path: str, output_path: str) -> Optional[Dict[str, str]]:
    """
    Detects face shape based on facial landmarks and draws a bounding shape
    that roughly matches the predicted face shape.

    Args:
        input_path (str): Path to the input image file.
        output_path (str): Path to save the output image file.

    Returns:
        Dict[str, str]: Face shape and output path if successful, None otherwise.
    """
    try:
        # Initialize MediaPipe Face Mesh
        mp_face_mesh = mp.solutions.face_mesh
        face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True)

        # Read the image
        image = cv2.imread(input_path)
        if image is None:
            raise ValueError("Image file not found.")

        # Convert the image to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Process the image with MediaPipe
        results = face_mesh.process(image_rgb)
        if not results.multi_face_landmarks:
            raise ValueError("No face detected in the image.")

        # Extract landmarks of the first detected face
        landmarks = np.array([
            [lm.x * image.shape[1], lm.y * image.shape[0]]
            for lm in results.multi_face_landmarks[0].landmark
        ])

        # Determine the face shape
        face_shape = determine_face_shape(landmarks)

        # Compute the bounding box around the face
        xmin = int(np.min(landmarks[:, 0]))
        ymin = int(np.min(landmarks[:, 1]))
        xmax = int(np.max(landmarks[:, 0]))
        ymax = int(np.max(landmarks[:, 1]))
        width = xmax - xmin
        height = ymax - ymin
        cx = (xmin + xmax) // 2
        cy = (ymin + ymax) // 2

        # Draw bounding shape based on the predicted face shape
        if face_shape == "Oval":
            # Draw an ellipse that fits the bounding box
            cv2.ellipse(image, (cx, cy), (width // 2, height // 2), angle=0, startAngle=0, endAngle=360, color=(0, 255, 0), thickness=2)
        elif face_shape == "Round":
            # Draw a circle: use the smaller of width/height as the diameter
            radius = min(width, height) // 2
            cv2.circle(image, (cx, cy), radius, color=(0, 255, 0), thickness=2)
        elif face_shape == "Square":
            # Create a square bounding box (using the larger dimension)
            size = max(width, height)
            new_xmin = cx - size // 2
            new_ymin = cy - size // 2
            new_xmax = cx + size // 2
            new_ymax = cy + size // 2
            cv2.rectangle(image, (new_xmin, new_ymin), (new_xmax, new_ymax), color=(0, 255, 0), thickness=2)
        elif face_shape == "Diamond":
            # Draw a diamond (rotated square)
            points = np.array([
                [cx, ymin],    # top
                [xmax, cy],    # right
                [cx, ymax],    # bottom
                [xmin, cy]     # left
            ], np.int32)
            points = points.reshape((-1, 1, 2))
            cv2.polylines(image, [points], isClosed=True, color=(0, 255, 0), thickness=2)
        elif face_shape == "Heart-shaped":
            # Approximate a heart shape using a polygon
            # This is a rough approximation; adjust the points as needed.
            points = np.array([
                [cx - width // 4, ymin],           # left top
                [cx + width // 4, ymin],           # right top
                [xmax, cy],                        # right mid
                [cx, ymax],                        # bottom tip
                [xmin, cy]                         # left mid
            ], np.int32)
            points = points.reshape((-1, 1, 2))
            cv2.polylines(image, [points], isClosed=True, color=(0, 255, 0), thickness=2)
        else:  # "Oblong" or fallback: draw a simple rectangle
            cv2.rectangle(image, (xmin, ymin), (xmax, ymax), color=(0, 255, 0), thickness=2)

        # Prepare a prominent label
        label = f"{face_shape}"
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 1.5
        thickness = 3
        (text_width, text_height), baseline = cv2.getTextSize(label, font, font_scale, thickness)

        # Draw a filled rectangle as background for the label (above the bounding shape)
        # cv2.rectangle(image, (xmin, max(ymin - text_height - baseline, 0)),
        #               (xmin + text_width, ymin), (0, 255, 0))
        # Overlay the face shape text in contrasting color
        # cv2.putText(image, label, (xmin, ymin - baseline), font, font_scale, (0, 0, 0), thickness, cv2.LINE_AA)

        # Save the processed image
        cv2.imwrite(output_path, image)

        return {"shape": face_shape, "output_file": output_path}

    except Exception as e:
        traceback.print_exc()
        return None
