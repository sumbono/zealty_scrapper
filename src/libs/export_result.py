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
    df.columns[3]: 'Listing Date',
    df.columns[4]: 'Complex Name',
    df.columns[5]: 'Building Street Address', 
    df.columns[6]: 'Community',
    df.columns[7]: 'Final Asking Price',
    df.columns[8]: 'Description',
    df.columns[9]: 'Property Type',
    df.columns[10]: "Style of Building",
    df.columns[11]: "Year Built",
    df.columns[12]: "Bedrooms",
    df.columns[13]: "Bathrooms",
    df.columns[14]: "Floor sqft",
    df.columns[15]: 'Frontage',
    df.columns[16]: 'Depth',
    df.columns[17]: 'Buyer Agent',
    df.columns[18]: 'Buyer Agency',
    df.columns[19]: 'Unit Number',
    df.columns[20]: "Seller Agency",
    df.columns[21]: "Seller Agent",
    df.columns[22]: "Agent's Phone Number",
    df.columns[23]: "Agent's Email",
    df.columns[24]: "Agency's Website",
    df.columns[25]: "Previous Asking Price",
    df.columns[26]: "Price Change Date",
    df.columns[27]: "Property Taxes",
    df.columns[28]: "Original Ask Price",
    df.columns[29]: "Lot Size",
    df.columns[30]: "Features & Amenities",
    df.columns[31]: 'Basement',
    df.columns[32]: 'Sold Price',
    df.columns[33]: 'Sold Date',
    df.columns[34]: "Listing Updated Date",
    df.columns[35]: "Postcode",
    df.columns[36]: "City",
    df.columns[37]: "Number of Photos",
    df.columns[38]: "Property Taxes's Year",
    df.columns[39]: 'NA2',
    df.columns[40]: "Video's URL",
    df.columns[41]: 'NA3',
    df.columns[42]: 'NA4',
    df.columns[43]: 'Price Assessment Ratio',
    df.columns[44]: 'Roof',
    df.columns[45]: 'Heating',
    df.columns[46]: 'Water',
    df.columns[47]: 'Zoning',
    df.columns[48]: 'Room1',
    df.columns[49]: 'Room2',
    df.columns[50]: 'Room3',
    df.columns[51]: 'Room4',
    df.columns[52]: 'Room5',
    df.columns[53]: 'Room6',
    df.columns[54]: 'Room7',
    df.columns[55]: 'Room8',
    df.columns[56]: 'Room9',
    df.columns[57]: 'Room10',
    df.columns[58]: 'Room11',
    df.columns[59]: 'Room12',
    df.columns[60]: 'Room13',
    df.columns[61]: 'Room14',
    df.columns[62]: 'Room15',
    df.columns[63]: 'Room16',
    df.columns[64]: 'Room17',
    df.columns[65]: 'Room18',
    df.columns[66]: 'Room19',
    df.columns[67]: 'Room20',
    df.columns[68]: 'Room21',
    df.columns[69]: 'Room22',
    df.columns[70]: 'Room23',
    df.columns[71]: 'Room24',
    df.columns[72]: 'Room25',
    df.columns[73]: 'Room26',
    df.columns[74]: 'Room27',
    df.columns[75]: 'Room28',
    df.columns[76]: 'Fireplace',
    df.columns[77]: 'Outdoor',
    df.columns[78]: 'Parking',
    df.columns[79]: 'Suite',
    df.columns[80]: 'Rear Yard Exposure',
    df.columns[81]: 'Rules',
    df.columns[82]: 'Maintainence Fee',
    df.columns[83]: 'Pad Fee',
    df.columns[84]: 'Construction',
    df.columns[85]: 'Foundation',
    df.columns[86]: 'Floor Material',
    df.columns[87]: 'Exterior Finish',
    df.columns[88]: 'Above',
    df.columns[89]: 'Main',
    df.columns[90]: 'Below',
    df.columns[91]: 'Bsmt',
    df.columns[92]: 'Total',
    df.columns[93]: 'Unfinished Floor',
    df.columns[94]: 'Storeys',
    df.columns[95]: 'Renovations',
    df.columns[96]: 'Parking Access',
    df.columns[97]: 'Bath1',
    df.columns[98]: 'Bath2',
    df.columns[99]: 'Bath3',
    df.columns[100]: 'Bath4',
    df.columns[101]: 'Bath5',
    df.columns[102]: 'Bath6',
    df.columns[103]: 'Bath7',
    df.columns[104]: 'Bath8',
    df.columns[105]: 'Sewer',
    df.columns[106]: "PID",
    df.columns[107]: 'NA13',
    df.columns[108]: 'NA14',
    df.columns[109]: 'Assessment Land',
    df.columns[110]: 'Assessment Building',
    df.columns[111]: 'Telephone or cable',
    df.columns[112]: 'Gas1',
    df.columns[113]: 'Gas2',
    df.columns[114]: 'Telephone or cable2',
    df.columns[115]: 'Storm Sewer',
    df.columns[116]: 'Fence',
    df.columns[117]: 'Access',
    df.columns[118]: 'Open House',
    df.columns[119]: 'Flood Plain',
    df.columns[120]: 'Restrictions',
    df.columns[121]: 'NA15',
    df.columns[122]: 'Strata Plan',
    df.columns[123]: 'Commission',
    df.columns[124]: 'NA16',
    df.columns[125]: 'NA17',
    df.columns[126]: "2nd Agent's Name",
    df.columns[127]: "2nd Agency's Name",
    df.columns[128]: "3rd Agent's Name",
    df.columns[129]: "3rd Agency's Name",
    df.columns[130]: 'Agent4',
    df.columns[131]: 'Agency4',
    df.columns[132]: 'Agent5',
    df.columns[133]: 'Agency5',
    df.columns[134]: "District",
    df.columns[135]: 'NA22',
    df.columns[136]: "Ownership Interest",
    df.columns[137]: 'NA23',
    df.columns[138]: "Image URL(s)",
    df.columns[139]: 'Status',
    df.columns[140]: 'Video2',
    df.columns[141]: "Province",
    df.columns[142]: 'Video3',
    df.columns[143]: 'NA26',
    df.columns[144]: 'NA27',
    df.columns[145]: 'NA28',
    df.columns[146]: 'NA29',
    df.columns[147]: 'Renting',
    df.columns[148]: 'Manufactured Type',
    df.columns[149]: 'Listing First Entered Date'
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
    'MLS', 
    "PID",
    'Status',
    'Property Type',
    "City",
    'Building Street Address', 

    'Listing Date',
    'Sold Date',
    'Price Change Date',
    "Listing Updated Date",
    'Listing First Entered Date',

    'Sold Price',
    'Final Asking Price',
    "Previous Asking Price",
    "Original Ask Price",
    'Price Assessment Ratio',
    'Assessment Land',
    'Assessment Building',

    "Property Taxes",
    "Property Taxes's Year",
    'Maintainence Fee',
    'Pad Fee',
  
    'Unit Number',
    'Complex Name',
    'Community',
    "District",
    "Province",
    "Postcode",
    'Latitude', 
    'Longitude', 

 
    "Style of Building",
    "Bedrooms",
    "Bathrooms",
    "Year Built",
    "Floor sqft",
    "Lot Size",
    'Storeys',
    'Renovations',
    'Parking',
    'Frontage',
    'Depth',

    'Zoning',

    'Description',
    "Features & Amenities",
    'Strata Plan',
    "Ownership Interest",

    'URL',
    'Video Tour',
    "Video's URL",
    'Video2',
    'Video3',
    "Number of Photos",
    "Image URL(s)",
    'Open House',

    'Buyer Agent',
    'Buyer Agency',
    "Seller Agency",
    "Seller Agent",
    'Commission',
    "Agent's Phone Number",
    "Agent's Email",
    "Agency's Website",
    "2nd Agent's Name",
    "2nd Agency's Name",
    "3rd Agent's Name",
    "3rd Agency's Name",
    'Agent4',
    'Agency4',
    'Agent5',
    'Agency5',

    'Above',
    'Main',
    'Below',
    'Bsmt',
    'Total',
    'Unfinished Floor',

    'Room1',
    'Room2',
    'Room3',
    'Room4',
    'Room5',
    'Room6',
    'Room7',
    'Room8',
    'Room9',
    'Room10',
    'Room11',
    'Room12',
    'Room13',
    'Room14',
    'Room15',
    'Room16',
    'Room17',
    'Room18',
    'Room19',
    'Room20',
    'Room21',
    'Room22',
    'Room23',
    'Room24',
    'Room25',
    'Room26',
    'Room27',
    'Room28',
    'Bath1',
    'Bath2',
    'Bath3',
    'Bath4',
    'Bath5',
    'Bath6',
    'Bath7',
    'Bath8',

    'Basement',
    'Roof',
    'Heating',
    'Water',
    'Sewer',
    'Storm Sewer',
    'Fireplace',
    'Outdoor',
    'Suite',
    'Rear Yard Exposure',
    'Rules',
    'Renting',
    'Construction',
    'Foundation',
    'Floor Material',
    'Exterior Finish',
    'Parking Access',
    'Telephone or cable',
    'Telephone or cable2',
    'Gas1',
    'Gas2',
    'Fence',
    'Access',
    'Flood Plain',
    'Restrictions',
    'Manufactured Type',

    'NA2',
    'NA3',
    'NA4',
    'NA13',
    'NA14',
    'NA15',
    'NA16',
    'NA17',
    'NA22',
    'NA23',
    'NA26',
    'NA27',
    'NA28',
    'NA29',
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