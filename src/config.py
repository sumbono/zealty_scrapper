from pathlib import Path

class BaseConfig:
    BASE_DIR = Path(__file__).resolve().parent.parent

SEARCH_URL = "https://zealty.ca/search.html"