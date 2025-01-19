from pydantic import BaseModel
from typing import Optional, List, Dict
import pandas as pd

# Request Models
class ChurnPredictionConfigueSession(BaseModel):
    session_id: Optional[str] = None
    id_column: Optional[str] = None
    name_column: Optional[str] = None
    target_column: Optional[str] = None
    feature_columns: Optional[List[str]] = None
    model_type: Optional[str] = "random_forest"

    # to dict
    def to_dict(self) -> Dict:
        return self.model_dump()

class ChurnPredictionSession(BaseModel):
    session_id: str

# CSV Validation Utility
class CSVValidator:
    @staticmethod
    def validate_file_extension(filename: str) -> bool:
        return filename.lower().endswith('.csv')

    @staticmethod
    def validate_file_size(file_size: int, max_size_mb: int = 10) -> bool:
        max_size_bytes = max_size_mb * 1024 * 1024
        return file_size <= max_size_bytes

    @staticmethod
    def validate_content(df: pd.DataFrame) -> None:
        if df.empty:
            raise ValueError("The CSV file is empty")

        # Check for minimum required columns (customize as needed)
        required_columns = []  # Add your required columns here
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")
