
from pathlib import Path
from uuid import uuid4
import traceback
import aiofiles

from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException, UploadFile, File, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.responses import FileResponse

from core.services.cv.bgremover import remove_background
from core.services.cv.faceswaper import faceswap

# Directory setup
ASSETS_DIR = Path("core/assets/uploads")
ASSETS_DIR.mkdir(parents=True, exist_ok=True)
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# FastAPI App Setup
def setup_app():
    app = FastAPI()

    # Mount the assets directory for serving files
    app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Adjust origins as needed for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/assets/{file_name}")
    async def stream_video(file_name: str, request: Request):
        file_path = ASSETS_DIR / file_name

        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")

        file_size = file_path.stat().st_size
        range_header = request.headers.get("range")

        if not range_header:
            # Return the full file with proper headers
            return Response(
                content=file_path.read_bytes(),
                media_type="video/mp4",
                headers={
                    "Accept-Ranges": "bytes",
                    "Content-Length": str(file_size),
                    "Cache-Control": "public, max-age=3600",
                },
            )

        try:
            # Parse range header
            start_str, end_str = range_header.replace("bytes=", "").split("-")
            start = int(start_str) if start_str else 0
            end = int(end_str) if end_str else file_size - 1

            # Validate range
            if start >= file_size:
                raise HTTPException(
                    status_code=status.HTTP_416_REQUESTED_RANGE_NOT_SATISFIABLE,
                    detail=f"Start byte {start} exceeds file size {file_size}",
                )

            end = min(end, file_size - 1)
            chunk_size = end - start + 1

            # Read and return the requested chunk
            async with await aiofiles.open(file_path, mode="rb") as video:
                await video.seek(start)
                chunk = await video.read(chunk_size)

            return Response(
                content=chunk,
                status_code=status.HTTP_206_PARTIAL_CONTENT,
                headers={
                    "Content-Range": f"bytes {start}-{end}/{file_size}",
                    "Accept-Ranges": "bytes",
                    "Content-Length": str(chunk_size),
                    "Content-Type": "video/mp4",
                    "Cache-Control": "public, max-age=3600",
                },
            )

        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_416_REQUESTED_RANGE_NOT_SATISFIABLE,
                detail="Invalid range header format",
            )


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
            removal_success = remove_background(input_path, output_path)

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
            is_success, output_filename_with_ext = faceswap(session_id, ASSETS_DIR, source, target, output_filename)
            
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

                    

    return app


# Run the application
if __name__ == "__main__":
    import uvicorn

    app = setup_app()
    uvicorn.run(app, host="0.0.0.0", port=8765)
