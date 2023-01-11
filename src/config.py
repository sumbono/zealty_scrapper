from pathlib import Path

class BaseConfig:
    BASE_DIR = Path(__file__).resolve().parent.parent

SEARCH_URL = "https://zealty.ca/search.html"
# SEARCH_URL = "https://www.zealty.ca/imap.html"