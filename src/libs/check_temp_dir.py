import os
from config import BaseConfig

def check_temp_dir():
    if os.path.exists(os.path.join(BaseConfig.BASE_DIR,"temp")):
        print("temp folder is available")
        
        for status in ['active','sold','expired']:
            try:
                os.mkdir(os.path.join(BaseConfig.BASE_DIR,f"temp/{status}"))
            except Exception as err:
                (f"Error while creating temp sub-dir - {err}")
            try:
                os.mkdir(os.path.join(BaseConfig.BASE_DIR,f"temp/{status}/csv"))
            except Exception as err:
                (f"Error while creating temp sub-dir - {err}")
            try:
                os.mkdir(os.path.join(BaseConfig.BASE_DIR,f"temp/{status}/img"))
            except Exception as err:
                (f"Error while creating temp sub-dir - {err}")
            
    else:
        print("Creating temp folder...")
        
        os.mkdir(os.path.join(BaseConfig.BASE_DIR,"temp"))
        
        for status in ['active','sold','expired']:
            os.mkdir(os.path.join(BaseConfig.BASE_DIR,f"temp/{status}"))
            os.mkdir(os.path.join(BaseConfig.BASE_DIR,f"temp/{status}/csv"))
            os.mkdir(os.path.join(BaseConfig.BASE_DIR,f"temp/{status}/img"))
        
        print("/temp folder created!!")
        
def check_mls_img_dir(mls :str, property_status: str='active'):
    mls_dir = os.path.join(BaseConfig.BASE_DIR,f"temp/{property_status}/img/{mls}")
    if not os.path.exists(mls_dir):
        
        try:
            os.mkdir(os.path.join(BaseConfig.BASE_DIR,f"temp/{property_status}"))
        except Exception as err:
            (f"Error while creating temp sub-dir - {err}")
        
        try:
            os.mkdir(os.path.join(BaseConfig.BASE_DIR,f"temp/{property_status}/img"))
        except Exception as err:
            (f"Error while creating temp sub-dir - {err}")
        
        os.mkdir(mls_dir)

    return mls_dir
    
def check_result_file(property_status: str='active', page: str='search', start: int=1, end: int=10) -> bool:
    return os.path.isfile(os.path.join(BaseConfig.BASE_DIR, f"temp/{property_status}/csv/{page}_{property_status}_{start}_{end}.csv"))
    
def check_custom_file(csv_file_loc: str) -> bool:
    return os.path.isfile(os.path.join(BaseConfig.BASE_DIR, csv_file_loc))

