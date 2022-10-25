import os
from core.config import BaseConfig

def check_temp():
    if os.path.exists(os.path.join(BaseConfig.BASE_DIR,"temp")):
        print("temp folder is available")
    else: 
        print("Creating temp folder...")
        os.mkdir(os.path.join(BaseConfig.BASE_DIR,"temp"))
        print("/temp folder created!!")
