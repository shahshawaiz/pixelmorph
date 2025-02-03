import os

from PIL import Image
from rembg import remove
import traceback
from typing import Optional


async def remove_background(input_path: str, output_path: str) -> Optional[bool]:
    """
    Removes the background from an image file.

    Args:
        input_path (str): Path to the input image file.
        output_path (str): Path to save the output image file.

    Returns:
        bool: True if successful, False otherwise.
    """
    try:
        # Read the raw image bytes
        with open(input_path, "rb") as f:
            input_bytes = f.read()

        # Use rembg to remove the background
        output_bytes = remove(input_bytes)

        # Write the processed image bytes to the output path
        with open(output_path, "wb") as f:
            f.write(output_bytes)

        return True

    except Exception as e:
        traceback.print_exc()
        return False
