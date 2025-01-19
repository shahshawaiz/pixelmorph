import os
from dotenv import load_dotenv

class Config:

    def __init__(self):
        # load environment variables
        self.load_env()

        """Configuration settings for the application."""
        self.ENV = os.getenv("ENV", "DEV")
        self.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")    
        self.HF_TOKEN = os.getenv("HF_TOKEN")    

    def load_env(self):
        load_dotenv(override=True)