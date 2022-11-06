import sys, os
import numpy as np
import pandas as pd

from typing import Any, Union, Dict, List
from urllib.parse import urljoin

for dir_item in os.listdir(os.path.abspath(os.path.join('.'))):
    sys.path.append(dir_item)
    
from config import BaseConfig


def img_url_process(x: str) -> list:
    y = []
    if x:
      xsplit = x.split('|')
      for el in xsplit:
        if 'http' in el:
          y.append(el)
        elif el.startswith('/') and el[1]=='/':
          y.append(f"http:{el}")
        else:
          y.append(urljoin('http://', el))
    return y
  
def export_svcFetchDB(resp_body: dict, filename: str='', is_first_page: bool=False, is_search: bool=False) -> pd.DataFrame:
  df = pd.DataFrame(resp_body["rows"])
  
  mapping = {
    df.columns[0]: 'MLS', 
    df.columns[1]: 'Latitude', 
    df.columns[2]: 'Longitude', 
    df.columns[5]: 'Building Street Address', 
    df.columns[6]: 'Community',
    df.columns[7]: 'Asking Price',
    df.columns[8]: 'Description',
    df.columns[9]: 'Property Type',
    df.columns[10]: "Style of Building",
    df.columns[11]: "Age of Building",
    df.columns[12]: "Bedrooms",
    df.columns[13]: "Bathrooms",
    df.columns[14]: "Size of Building (sqft)",
    df.columns[20]: "Agency's Name",
    df.columns[21]: "Agent's Name",
    df.columns[22]: "Agent's Phone Number",
    df.columns[23]: "Agent's Email",
    df.columns[24]: "Agency's Website",
    df.columns[26]: "Price Change Date",
    df.columns[27]: "Property Taxes",
    df.columns[28]: "Original Ask Price",
    df.columns[29]: "Lot Size (sqft)",
    df.columns[30]: "Features & Amenities",
    df.columns[34]: "Listing Entered Date",
    df.columns[35]: "Postcode",
    df.columns[36]: "City",
    df.columns[37]: "Number of Photos",
    df.columns[38]: "Property Taxes's Year",
    df.columns[40]: "Video's URL",
    df.columns[106]: "PID",
    df.columns[123]: "Buyer's agent commission",
    df.columns[126]: "2nd Agent's Name",
    df.columns[127]: "2nd Agency's Name",
    df.columns[128]: "3rd Agent's Name",
    df.columns[129]: "3rd Agency's Name",
    df.columns[134]: "District",
    df.columns[136]: "Ownership Interest",
    df.columns[138]: "Image URL(s)",
    df.columns[141]: "Province"
  }
  
  su = df.rename(columns=mapping)
  su['URL_PATH1'] = su['MLS'].apply(lambda x: f"mls-{x}")
  su["URL_PATH2"] = su['Building Street Address'].str.replace('#','').str.strip().str.split(' ') +su['City'].str.split(' ') + su['Province'].str.split(' ')
  su["URL_PATH2"] = su["URL_PATH2"].str.join('-')
  su["URL"] = su["URL_PATH1"] + "/" + su["URL_PATH2"]
  su["URL"] = su["URL"].apply(lambda x: f"https://www.zealty.ca/{x}/")
  su["Video Tour"] = np.where(su["Video's URL"]!= '', "Yes", "No")
  su["Image URL(s)"] = su["Image URL(s)"].apply(lambda x: img_url_process(x))
  

  columns = [
    "MLS", "URL", "Building Street Address", "City", "Province", "Community", "Postcode",
    "PID", "Property Type", "Style of Building", "Size of Building (sqft)", "Lot Size (sqft)", 
    "Ownership Interest", "Asking Price", "Original Ask Price", "Property Taxes", "Property Taxes's Year", 
    "Description", "Features & Amenities", "Video Tour", "Video's URL", "Number of Photos", "Image URL(s)", 
    "Agency's Name", "Agent's Name", "Agent's Phone Number", "Agent's Email", "Agency's Website", 
    "2nd Agent's Name", "2nd Agency's Name", "3rd Agent's Name", "3rd Agency's Name", 
  ]
  
  su = su[columns]
  su = su.replace(float('nan'), '', regex=True)
  
  if is_first_page:
    write_mode = 'w'
    header = True
  else:
    write_mode = 'a'
    header = False
  
  if is_search:
    su.to_csv(f"{BaseConfig.BASE_DIR}/temp/{filename}.csv", columns=columns, index=False, mode=write_mode, header=header)

  return su
    
def export_svcGetInfoDB(resp_body: dict) -> Union[pd.DataFrame, List]:
  columns = resp_body["columns"]
  rows = resp_body["rows"]
  data = []
  for row in rows:
    col_row = dict(zip(columns,row))
    data.append(col_row)
  return data
  
def export_svcGetPermits(resp_body: dict) -> Union[pd.DataFrame, List]:
  df = pd.DataFrame(resp_body["rows"])
  
def export_svcGetAssessmentHistory(resp_body: dict) -> Union[pd.DataFrame, List]:
  assessments: Dict = resp_body['assessments']
  # print(f"assessments:")
  # print(assessments)
  if 'pid' in assessments:
    assessments.pop('pid')
  data = []
  for k,v in assessments.items():
    v['year'] = k
    data.append(v)
  # print(f"assessments:")
  # print(data)
  return data



def export_result(
    resp_body: dict={}, filename: str='', resp_name: str='svcFetchDB', 
    is_first_page: bool=False, is_search: bool=False, 
    just_export: bool=False, df: pd.DataFrame=None
  ) -> Union[pd.DataFrame, List, None]:
  
  if just_export:
    if is_first_page:
      write_mode = 'w'
      header = True
    else:
      write_mode = 'a'
      header = False
    df.to_csv(f"{BaseConfig.BASE_DIR}/temp/{filename}.csv", index=False, mode=write_mode, header=header)
    
  else:
    if resp_name=='svcFetchDB':
      return export_svcFetchDB(resp_body,filename,is_first_page=is_first_page,is_search=is_search)
    elif resp_name=='svcGetInfoDB':
      return export_svcGetInfoDB(resp_body)
    elif resp_name=='svcGetPermits':
      return export_svcGetPermits(resp_body)
    elif resp_name=='svcGetAssessmentHistory':
      return export_svcGetAssessmentHistory(resp_body)
    else:
      return None