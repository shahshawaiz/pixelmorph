
from pathlib import Path
from uuid import uuid4
import traceback
import cv2

from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from core.services.cv.bgremover import remove_background
from core.services.cv.faceswaper import faceswap, detect_faces_from_image, multifaceswap
from core.services.cv.faceshapedetector import detect_faceshape

# Directory setup
ASSETS_DIR = Path("core/assets/uploads")
ASSETS_DIR.mkdir(parents=True, exist_ok=True)
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# FastAPI App Setup
def setup_app():
    app = FastAPI()

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Adjust origins as needed for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Mount the assets directory for serving files
    app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")

    @app.post("/background-remover")
    async def run_background_remover(file: UploadFile = File(...)):
        """
        Endpoint for removing background from an image.
        """
        try:
            # Validate file extension
            if not file.filename.lower().endswith((".jpg", ".jpeg", ".png")):
                raise HTTPException(
                    status_code=400, detail="Invalid file format. Please upload a JPG or PNG image."
                )

            # Read file content
            content = await file.read()

            # Validate file size
            if len(content) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400, detail="File size exceeds the maximum limit of 10MB."
                )

            # Generate a unique file path
            session_id = str(uuid4())
            input_path = ASSETS_DIR / f"{session_id}_input.png"
            output_filename = f"{session_id}_output.png"
            output_path = ASSETS_DIR / output_filename
            
            # Save the uploaded file
            with open(input_path, "wb") as f:
                f.write(content)

            # rmeove bg
            removal_success = await remove_background(input_path, output_path)

            if removal_success:
                return {
                    "message": "Background removed successfully.",
                    "output_file": f"{output_filename}",
                }
            else:
                raise HTTPException(
                    status_code=500, detail="Error removing background. Please try again."
                )

        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Error removing background: {str(e)}")

        
    @app.post("/faceswap")
    async def run_faceswap(
        source: UploadFile = File(...),
        target: UploadFile = File(...),
        video: bool = False
    ):
        """
        Endpoint for swapping faces between two images or a video.
        """
        try:
            source_extension = Path(source.filename).suffix.lower()
            target_extension = Path(target.filename).suffix.lower()
            source_path = ASSETS_DIR / source.filename
            target_path = ASSETS_DIR / target.filename

            # Generate unique file paths
            session_id = str(uuid4())
            source_path = ASSETS_DIR / f"{session_id}_input_source{source_extension}"
            target_path = ASSETS_DIR / f"{session_id}_input_target{target_extension}"
            output_filename = f"{session_id}_output"

            # run faceswap
            is_success, output_filename_with_ext = await faceswap(session_id, ASSETS_DIR, source, target, output_filename)
            
            if is_success:
                return JSONResponse(
                    content={
                        "message": "Face swap completed successfully",
                        "output_file": str(output_filename_with_ext.name),
                    },
                    status_code=200,
                )
            else:
                raise HTTPException(
                    status_code=500, detail="Error processing face swap. Please try again."
                )

        except ValueError as ve:
            raise HTTPException(status_code=400, detail=str(ve))
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Face swap processing error: {str(e)}")
        finally:
            # Clean up temporary files
            for path in [source_path, target_path]:
                if path.exists():
                    path.unlink()

    @app.post("/multifaceswap")
    async def run_multifaceswap(
        source: UploadFile = File(...),
        target: UploadFile = File(...),
        face_index: int = Form(...),
        video: bool = Form(False)
    ):
        try:
            session_id = str(uuid4())
            output_filename = f"{session_id}_output"
            source_extension = Path(source.filename).suffix.lower()
            target_extension = Path(target.filename).suffix.lower()
            source_path = ASSETS_DIR / f"{session_id}_input_source{source_extension}"
            target_path = ASSETS_DIR / f"{session_id}_input_target{target_extension}"

            is_success, output_path = await multifaceswap(session_id, ASSETS_DIR, source, target, face_index, output_filename)
            return JSONResponse(
                content={
                    "message": "Multi-face swap completed successfully",
                    "output_file": str(output_path.name)
                },
                status_code=200,
            )
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Multi-face swap processing error: {str(e)}")
        finally:
            # Cleanup temporary source and target files.
            for path in [source_path, target_path]:
                if path.exists():
                    path.unlink()


    @app.post("/facedetect")
    async def face_detect(file: UploadFile = File(...)):
        """
        Endpoint for face detection that draws boxes on the image.
        The endpoint returns the filename of the annotated image.
        """
        try:
            session_id = str(uuid4())
            input_path = ASSETS_DIR / f"{session_id}_input.png"
            content = await file.read()
            with open(input_path, "wb") as f:
                f.write(content)
            img = cv2.imread(str(input_path))
            if img is None:
                raise HTTPException(status_code=400, detail="Invalid image file")
            # Run face detection.
            _, face_boxes = await detect_faces_from_image(img, input_path)
            # Draw boxes and face numbers on a copy of the image.
            annotated_img = img.copy()
            for i, box in enumerate(face_boxes):
                x = int(box["x"])
                y = int(box["y"])
                w = int(box["width"])
                h = int(box["height"])
                cv2.rectangle(annotated_img, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.putText(annotated_img, str(i + 1), (x, y - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
            annotated_filename = f"{session_id}_annotated.png"
            annotated_path = ASSETS_DIR / annotated_filename
            cv2.imwrite(str(annotated_path), annotated_img)
            return {"annotated_image": annotated_filename}
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail="Face detection error: " + str(e))
        
    @app.post("/faceshape-detector")
    async def faceshape_detector(file: UploadFile = File(...)):
        """
        Proxy API for detecting face shape.
        """
        try:
            # Validate file extension
            if not file.filename.lower().endswith((".jpg", ".jpeg", ".png")):
                raise HTTPException(
                    status_code=400, detail="Invalid file format. Please upload a JPG or PNG image."
                )

            # Read file content
            content = await file.read()

            # Validate file size
            if len(content) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400, detail="File size exceeds the maximum limit of 10MB."
                )

            # Generate a unique file path
            session_id = str(uuid4())
            input_path = ASSETS_DIR / f"{session_id}_input.png"
            output_filename = f"{session_id}_output.png"
            output_path = ASSETS_DIR / output_filename

            # Save the uploaded file
            with open(input_path, "wb") as f:
                f.write(content)

            # Perform face shape detection (assuming detect_faceshape is defined elsewhere)
            detected_shape = await detect_faceshape(input_path, output_path)

            if detected_shape:
                return {
                    "message": f"{detected_shape['shape']}",
                    "shape": detected_shape["shape"],
                    "output_file": f"{output_filename}"
                }
            else:
                raise HTTPException(
                    status_code=500, detail="Error detecting face shape. Please try again."
                )
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Error detecting face shape: {str(e)}")


    return app


# Run the application
if __name__ == "__main__":
    import uvicorn

    app = setup_app()
    uvicorn.run(app, host="0.0.0.0", port=8765)
