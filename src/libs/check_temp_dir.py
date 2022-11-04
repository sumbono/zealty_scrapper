import os
from config import BaseConfig

def check_temp_dir():
    if os.path.exists(os.path.join(BaseConfig.BASE_DIR,"temp")):
        print("temp folder is available")
    else: 
        print("Creating temp folder...")
        os.mkdir(os.path.join(BaseConfig.BASE_DIR,"temp"))
        print("/temp folder created!!")
