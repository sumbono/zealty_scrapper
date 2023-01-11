import ast, sys, os
import numpy as np
import pandas as pd

from typing import Dict, List, Tuple

for dir_item in os.listdir(os.path.abspath(os.path.join('.'))):
    sys.path.append(dir_item)
    
from config import BaseConfig


def load_result(
        property_status: str='active', page: str='search', start: int=1, end: int=10, filename: str=''
    ) -> pd.DataFrame:
    
    if filename:
        file_abspath: str = f"{BaseConfig.BASE_DIR}/temp/{filename}.csv"
    else:
        file_abspath: str = f"{BaseConfig.BASE_DIR}/temp/{property_status}/csv/{page}_{property_status}_{start}_{end}.csv"
    df = pd.read_csv(file_abspath)
    df = df.replace(float('nan'), '', regex=True)
    df.drop_duplicates(subset=['MLS'],keep='first')
    return df

def get_property_metadata(
        property_status: str='active', page: str='search', start: int=1, end: int=10, filename: str=''
    ) -> List[Dict]:
    
    df: pd.DataFrame = load_result(property_status,page,start,end,filename)
    mls_list = [mls for mls in df['MLS']]
    
    new_df = df.set_index('MLS',inplace=False)
    new_df.index.astype('str')
    
    results: List[Dict] = []
    for mls in mls_list:
        df_det = new_df.loc[mls]
        img_urls = ast.literal_eval(df_det['Image URL(s)']) if df_det['Image URL(s)'] else []
        data = {'mls': mls, 'url': df_det['URL'], 'img_urls': img_urls, 'dataframe':df.loc[df['MLS']==mls]}
        # if with_image_urls:
        #     data['img_urls'] = ast.literal_eval(df_det['Image URL(s)'])
        results.append(data)
        
    return results
    
def get_custom_property_metadata(custom_csv_file: str) -> List[Dict]:
    file_abspath: str = os.path.join(BaseConfig.BASE_DIR, custom_csv_file)
    df = pd.read_csv(file_abspath)
    df = df.replace(float('nan'), '', regex=True)
    df.drop_duplicates(subset=['MLS'],keep='first')
    
    # mls_list = [mls for mls in df['MLS']]
    # mls_list = df['MLS'].to_list()
    # print(mls_list)

    new_df = df.set_index('MLS',inplace=False)
    new_df.index.astype('str')
    
    results: List[Dict] = []
    for mls in df['MLS'].to_list():
        this_df = df[df['MLS']==mls].copy(deep=True) #df.loc[df['MLS']==mls]
        # this_df = pd.DataFrame[df[df['MLS']==mls]]
        df_det = new_df.loc[mls]
        img_urls = ast.literal_eval(df_det['Image URL(s)']) if df_det['Image URL(s)'] else []
        data = {'mls': mls, 'url': df_det['URL'], 'img_urls': img_urls, 'dataframe':this_df}
        results.append(data)
        
    return results