import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.runnables import Runnable

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")
print(gemini_api_key)

model = init_chat_model("google_genai:gemini-2.5-flash-lite")