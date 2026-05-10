import os
from dotenv import load_dotenv
load_dotenv()
from google import genai
from google.genai import types

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
client = genai.Client(api_key=GEMINI_API_KEY)

try:
    # History starts with MODEL message
    contents = [
        {"role": "model", "parts": [{"text": "Hi!"}]},
        {"role": "user", "parts": [{"text": "Hello"}]}
    ]
    response = client.models.generate_content(
        model='gemini-flash-latest',
        contents=contents
    )
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
