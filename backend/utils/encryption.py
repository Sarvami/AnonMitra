from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv

load_dotenv()

def get_key():
    key = os.getenv("ENCRYPTION_KEY")
    if not key:
        raise ValueError("ENCRYPTION_KEY not found in .env file")
    return key.encode()

def encrypt(text: str) -> str:
    f = Fernet(get_key())
    return f.encrypt(text.encode()).decode()

def decrypt(text: str) -> str:
    f = Fernet(get_key())
    return f.decrypt(text.encode()).decode()