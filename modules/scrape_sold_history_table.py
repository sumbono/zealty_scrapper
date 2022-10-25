import datetime
import re
import pandas as pd
from bs4 import BeautifulSoup

from core.config import BaseConfig

url_detail = "https://www.zealty.ca/mls-R2720295/4838-BELMONT-AVENUE-Vancouver-BC/"

def scrape_sold_history(table_html_string,mls_code):
    soup = BeautifulSoup(table_html_string,'html.parser')
    th = soup.find_all("th")
    td = soup.find_all("td")
    # Header/Column list
    thlist =[th_item.get_text() for th_item in th]
    # Dict formatting for pandas dataframe
    format_dict = {}
    # List that contain format_dict(s) for pandas dataframe
    list_of_dict_table = []
    for index_cell_content,cell_content in enumerate(td):
        if cell_content.get_text() != "":
            try : 
                date_format = datetime.datetime.strptime(cell_content.get_text(), '%Y-%b-%d')
                try :
                    # Validate If there's value in Date key
                    if format_dict[thlist[0]] and datetime.datetime.strptime(format_dict[thlist[0]], '%Y-%b-%d'):
                        format_dict[thlist[0]] += "|"+cell_content.get_text()
                except KeyError :
                    if date_format:
                        format_dict[thlist[0]] = cell_content.get_text()

            except:
                # Validate If there's value in Comments key and not (Date and MLS® Number key)
                try : 
                    if format_dict[thlist[1]] and not (re.search(mls_code, cell_content.get_text())) :
                        format_dict[thlist[1]] += "|"+cell_content.get_text()
                except KeyError :
                    if not re.search(mls_code,cell_content.get_text()):
                        format_dict[thlist[1]] = cell_content.get_text()

                # Validate If there's value in MLS® Number key
                try :
                    if re.match(mls_code, format_dict[thlist[2]]):
                        if cell_content.get_text() == format_dict[thlist[2]] :
                            format_dict[thlist[2]] += "|" + cell_content.get_text()
                except KeyError :
                    if re.search(mls_code, cell_content.get_text()):
                        format_dict[thlist[2]] = cell_content.get_text()
            
        if cell_content.get_text() == '' and index_cell_content != 0 :
            print("Appending format_dict")
            list_of_dict_table.append(format_dict)
            print("Getting back format_dict as zero value")
            format_dict = {}  

    df = pd.DataFrame(list_of_dict_table)
    print("Exporting sold history table to csv output..")
    df.to_csv("{}/temp/sold_history.csv".format(BaseConfig.BASE_DIR),index=False)

if __name__ == "__main__" :
    print(BaseConfig.BASE_DIR)