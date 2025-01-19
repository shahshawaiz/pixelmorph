import openai
import json
import pandas as pd
from core.services.config import Config

from openai import OpenAI

class LLM:
    def __init__(self, config: Config):
        openai.api_key = config.OPENAI_API_KEY
        
        self.openai_client = OpenAI()

    def completion(self, system_prompt, user_prompt, model="gpt-4o", json_output=True):
        """
        Generic method to call OpenAI's GPT model with a system and user prompt.
        """
        try:
            response_format = None
            if json_output:
                response_format = {
                    'type': 'json_object',
                }
                system_prompt += "\nThe response should be in JSON format."
            
            response = self.openai_client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format=response_format
            )
            response_str = response.choices[0].message.content
            if json_output:
                response_json = self.parse_json(response_str)
                return response_json

            return response_str            
        except Exception as e:
            print(f"Error calling GPT model: {e}")
            return None

    def parse_json(self, response):
        """
        Parse a JSON response from OpenAI.
        """
        try:
            return json.loads(response)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return {}
        
    def generate_config(self, df):
        """
        Generate a configuration dictionary based on the first three lines of the DataFrame.
        """
        columns = df.columns.tolist()
        first_three_rows = df.head(3).to_dict(orient='records')

        system_prompt = f"""
You are an expert Data Scientist. Your task is to make a perfect churn prediction model. For which you need to identify following configuration columns:"\n
- 'id_column': Unique identifier column (optional) e.g. customerId, phone, or other unique identification, .\n
- 'name_column': Label column for identifiying customer e.g. name, etc.\n
- 'target_column': Target column for the churn prediction model.\n
- 'feature_columns': List of feature columns (optional) for the churn prediction model.\n\n
Your task is to identify configuration columns from a given list of columns from csv, and return a json dict.
"""

        user_prompt = (
            f"""Below are the list of available columns in csv, and few rows of data. \n
Columns: {columns}\n
First three rows: {first_three_rows}\n"""
        )

        response = self.completion(system_prompt, user_prompt)
        try:
            return response
        except Exception as e:
            print(f"Error decoding JSON: {e}")
            return {}

    def summarize_text(self, text):
        """
        Summarize a given text using GPT.
        """
        system_prompt = "You are an assistant that summarizes texts into concise and clear summaries."
        user_prompt = f"Summarize the following text:\n{text}"

        return self.completion(system_prompt, user_prompt)

    def answer_question(self, context, question):
        """
        Answer a question based on a given context.
        """
        system_prompt = "You are an assistant that answers questions based on provided context."
        user_prompt = f"Context: {context}\nQuestion: {question}\nProvide a detailed and accurate answer."

        return self.completion(system_prompt, user_prompt)