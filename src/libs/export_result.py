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

def listing_status(x: str) -> str:
  if x=='A':
    return 'For Sale'
  elif x=='S':
    return 'Sold'
  else:
    return str(x).title()
  
def export_svcFetchDB(resp_body: dict, filename: str='', is_first_page: bool=False, is_search: bool=False, df: pd.DataFrame=None) -> pd.DataFrame:
  df = pd.DataFrame(resp_body["rows"])
  mapping = {
    df.columns[0]: 'MLS', 
    df.columns[1]: 'Latitude', 
    df.columns[2]: 'Longitude', 
    df.columns[3]: "Listing Entered Date",
    df.columns[4]: "Complex Name",
    df.columns[5]: 'Building Street Address', 
    df.columns[6]: 'Community',
    df.columns[7]: 'Final Asking Price',
    df.columns[8]: 'Description',
    df.columns[9]: 'Property Type',
    df.columns[10]: "Style of Building",
    df.columns[11]: "Age of Building (years)",
    df.columns[12]: "Bedrooms",
    df.columns[13]: "Bathrooms",
    df.columns[14]: "Size of Building (sqft)",
    df.columns[15]: "Frontage (ft)",
    df.columns[16]: "Depth (ft)",
    # df.columns[17]: "",
    df.columns[18]: "Buyer Agency",
    df.columns[19]: "Unit Number",
    df.columns[20]: "Seller Agency's Name",
    df.columns[21]: "Seller Agent's Name",
    df.columns[22]: "Seller Agent's Phone",
    df.columns[23]: "Seller Agent's Email",
    df.columns[24]: "Seller Agency's Website",
    df.columns[25]: "Previous Asking Price",
    df.columns[26]: "Price Change Date",
    df.columns[27]: "Property Taxes (USD)",
    df.columns[28]: "Original Asking Price",
    df.columns[29]: "Lot Size (sqft)",
    df.columns[30]: "Features & Amenities",
    df.columns[31]: "Basement",
    df.columns[32]: "Sale Price",
    df.columns[33]: "Sale Date",
    df.columns[34]: "On/Off Market Date", #"Off Market Date",
    df.columns[35]: "Postcode",
    df.columns[36]: "City",
    df.columns[37]: "Number of Photos",
    df.columns[38]: "Property Taxes's Year",
    df.columns[40]: "Video's URL",
    df.columns[43]: "Price Assessment Ratio",
    df.columns[44]: "Roof",
    df.columns[45]: "Heating",
    df.columns[46]: "Water",
    df.columns[47]: "Zoning",
    df.columns[48]: "Room Info1",
    df.columns[49]: "Room Info2",
    df.columns[50]: "Room Info3",
    df.columns[51]: "Room Info4",
    df.columns[52]: "Room Info5",
    df.columns[53]: "Room Info6",
    df.columns[54]: "Room Info7",
    df.columns[55]: "Room Info8",
    df.columns[56]: "Room Info9",
    df.columns[57]: "Room Info10",
    df.columns[58]: "Room Info11",
    df.columns[59]: "Room Info12",
    df.columns[60]: "Room Info13",
    df.columns[61]: "Room Info14",
    df.columns[62]: "Room Info15",
    df.columns[63]: "Room Info16",
    df.columns[64]: "Room Info17",
    df.columns[65]: "Room Info18",
    df.columns[66]: "Room Info19",
    df.columns[67]: "Room Info20",
    df.columns[68]: "Room Info21",
    df.columns[69]: "Room Info22",
    df.columns[70]: "Room Info23",
    df.columns[71]: "Room Info24",
    df.columns[72]: "Room Info25",
    df.columns[73]: "Room Info26",
    df.columns[74]: "Room Info27",
    df.columns[75]: "Room Info28",
    df.columns[76]: "Firplaces",
    df.columns[77]: "Outdoor",
    df.columns[78]: "Parking",
    df.columns[79]: "Suite",
    df.columns[80]: "Rear Yark Exposure",
    df.columns[81]: "Rules",
    df.columns[82]: "Maintenance Fee (USD)",
    df.columns[83]: "Pad Fee (USD)",
    df.columns[84]: "Construction",
    df.columns[85]: "Foundation",
    df.columns[86]: "Floor",
    df.columns[87]: "Exterior Finish",
    df.columns[88]: "Above (sqft)",
    df.columns[89]: "Main (sqft)",
    df.columns[90]: "Below (sqft)",
    df.columns[91]: "Basement (sqft)",
    df.columns[92]: "Total",
    df.columns[93]: "Floor Unfinished",
    df.columns[94]: "Storeys",
    df.columns[95]: "Renovations",
    df.columns[96]: "Parking Access",
    df.columns[97]: "Bathroom1",
    df.columns[98]: "Bathroom2",
    df.columns[99]: "Bathroom3",
    df.columns[100]: "Bathroom4",
    df.columns[101]: "Bathroom5",
    df.columns[102]: "Bathroom6",
    df.columns[103]: "Bathroom7",
    df.columns[104]: "Bathroom8",
    df.columns[105]: "Sewer",
    df.columns[106]: "PID",
    # df.columns[107]: "",
    # df.columns[108]: "",
    df.columns[109]: "Assessment Land",
    df.columns[110]: "Assessment Building",
    df.columns[111]: "Telephone Cable1",
    df.columns[112]: "Gas1",
    df.columns[113]: "Gas2",
    df.columns[114]: "Telephone Cable2",
    df.columns[115]: "Storm Sewer",
    df.columns[116]: "Fence",
    df.columns[117]: "Access",
    df.columns[118]: "Open House",
    df.columns[119]: "Flood Plain",
    df.columns[120]: "Restrictions",
    # df.columns[121]: "",
    df.columns[122]: "Strata Plan",
    df.columns[123]: "Commission",
    df.columns[126]: "2nd Seller Agent's Name",
    df.columns[127]: "2nd Seller Agency's Name",
    df.columns[128]: "3rd Seller Agent's Name",
    df.columns[129]: "3rd Seller Agency's Name",
    df.columns[130]: "4th Seller Agent's Name",
    df.columns[131]: "4th Seller Agency's Name",
    df.columns[132]: "5th Seller Agent's Name",
    df.columns[133]: "5th Seller Agency's Name",
    df.columns[134]: "District",
    df.columns[136]: "Ownership Interest",
    df.columns[138]: "Image URL(s)",
    df.columns[139]: "Listing Status",
    df.columns[140]: "Property's website1",
    df.columns[141]: "Province",
    df.columns[142]: "Property's website2",
    df.columns[146]: "For Rental",
    df.columns[147]: "Minimum Rental Duration",
    df.columns[148]: "Manufactured Home Type",
    df.columns[149]: "Listing Entered Date",
  }
  
  su = df.rename(columns=mapping)
  su['URL_PATH1'] = su['MLS'].apply(lambda x: f"mls-{x}")
  su["URL_PATH2"] = su['Building Street Address'].str.replace('#','').str.strip().str.split(' ') +su['City'].str.split(' ') + su['Province'].str.split(' ')
  su["URL_PATH2"] = su["URL_PATH2"].str.join('-')
  # su["URL"] = su["URL_PATH1"] + "/" + su["URL_PATH2"]
  su.insert(1, "URL", su["URL_PATH1"] + "/" + su["URL_PATH2"])
  su["URL"] = su["URL"].apply(lambda x: f"https://www.zealty.ca/{x}/")
  
  su["Video Tour"] = np.where(su["Video's URL"]!= '', "Yes", "No")
  su["Image URL(s)"] = su["Image URL(s)"].apply(lambda x: img_url_process(x) if x else '')
  su['Final Asking Price'] = su['Final Asking Price'].apply(lambda x: float(x.replace('.','').strip()) if x else '')
  su['Original Asking Price'] = su['Original Asking Price'].apply(lambda x: '' if x=='0.000' else float(x.replace('.','').strip()))
  su['Previous Asking Price'] = su['Previous Asking Price'].apply(lambda x: '' if x=='0.000' else float(x.replace('.','').strip()))
  su['Sale Price'] = su['Sale Price'].apply(lambda x: '' if x=='0.000' else float(x.replace('.','').strip()) if x else '')
  su['Listing Status'] = su['Listing Status'].apply(lambda x: listing_status(x) if x else '')
  su['Age of Building (years)'] = su['Age of Building (years)'].apply(lambda x: '' if x=='-1' else x)
  su["Open House"] = su["Open House"].apply(lambda x: x.split('|') if x else '')

  su.drop(['URL_PATH1', 'URL_PATH2'], axis=1, inplace=True)

  su = su.replace(float('nan'), '', regex=True)

  if is_first_page:
    write_mode = 'w'
    header = True
  else:
    write_mode = 'a'
    header = False
  
  if is_search:
    # su.to_csv(f"{BaseConfig.BASE_DIR}/temp/{filename}.csv", index=False, mode=write_mode, header=header)
    su.to_csv(filename, index=False, mode=write_mode, header=header)

  return su
  
  
def export_svcGetInfoDB(resp_body: dict) -> List:
  columns = resp_body["columns"]
  rows = resp_body["rows"]
  return [dict(zip(columns,row)) for row in rows]
  
def export_svcGetPermits(resp_body: dict) -> pd.DataFrame:
  df = pd.DataFrame(resp_body["rows"])
  
def export_svcGetAssessmentHistory(resp_body: dict) -> Union[pd.DataFrame, List]:
  assessments: Dict = resp_body['assessments']
  if 'pid' in assessments:
    assessments.pop('pid')
  data = []
  for k,v in assessments.items():
    v['year'] = k
    data.append(v)
  return data

def export_svcGetHistoryMLS(resp_body: List) -> Union[pd.DataFrame, List]:
  actions: Dict = {'S': 'Sold', 'L': 'Listed', 'T': 'Terminated', 'X': 'Expired'}
  results: List = []
  for el in resp_body:
    results.append({
      "action": actions.get(el["action"],el["action"]),
      "brokerage" : el["brokerage"],
      "mlsNumber": el["mlsNumber"],
      "pid": el["pid"],
      "actionDate": el["date"],
      "actionPrice": float(el["price"])*1000
    })
  return results

def export_svcGetStatistics(resp_body: dict) -> dict:
  return resp_body

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
    # df = df.replace(float('nan'), '', regex=True)
    # df.to_csv(f"{BaseConfig.BASE_DIR}/temp/{filename}.csv", index=False, mode=write_mode, header=header)
    df.to_csv(filename, index=False, mode=write_mode, header=header)
    
  else:
    if resp_name=='svcFetchDB':
      return export_svcFetchDB(resp_body,filename,is_first_page=is_first_page,is_search=is_search,df=df)
    elif resp_name=='svcGetInfoDB':
      return export_svcGetInfoDB(resp_body)
    elif resp_name=='svcGetPermits':
      return export_svcGetPermits(resp_body)
    elif resp_name=='svcGetAssessmentHistory':
      return export_svcGetAssessmentHistory(resp_body)
    elif resp_name=='svcGetHistoryMLS':
      return export_svcGetHistoryMLS(resp_body)
    elif resp_name=='svcGetStatistics':
      return export_svcGetStatistics(resp_body)
    else:
      return None