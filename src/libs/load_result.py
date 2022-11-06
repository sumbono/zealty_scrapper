import ast, sys, os
import numpy as np
import pandas as pd

from typing import Dict, List, Tuple

for dir_item in os.listdir(os.path.abspath(os.path.join('.'))):
    sys.path.append(dir_item)
    
from config import BaseConfig


def load_result(
        property_status: str='active', page: str='search', start: int=1, end: int=10
    ) -> pd.DataFrame:
    
    file_abspath: str = f"{BaseConfig.BASE_DIR}/temp/{property_status}/csv/{page}_{start}_{end}.csv"
    df = pd.read_csv(file_abspath)
    df = df.replace(float('nan'), '', regex=True)
    df.drop_duplicates(subset=['MLS'],keep='first')
    return df

def get_property_metadata(
        property_status: str='active', page: str='search', start: int=1, end: int=10,
    ) -> List[Dict]:
    
    df: pd.DataFrame = load_result(property_status,page,start,end)
    mls_list = [mls for mls in df['MLS']]
    
    new_df = df.set_index('MLS',inplace=False)
    new_df.index.astype('str')
    
    results: List[Dict] = []
    for mls in mls_list:
        df_det = new_df.loc[mls]
        data = {'mls': mls, 'url': df_det['URL'], 'img_urls': ast.literal_eval(df_det['Image URL(s)']), 'dataframe':df.loc[df['MLS']==mls]}
        # if with_image_urls:
        #     data['img_urls'] = ast.literal_eval(df_det['Image URL(s)'])
        results.append(data)
        
    return results
    