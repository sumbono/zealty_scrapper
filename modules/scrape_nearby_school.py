import datetime
import re
import pandas as pd
from bs4 import BeautifulSoup

from core.config import BaseConfig

url_detail = "https://www.zealty.ca/mls-R2720295/4838-BELMONT-AVENUE-Vancouver-BC/"

def scrape_nearby_school(table_html_string):
    soup = BeautifulSoup(table_html_string, "html.parser")
    td = soup.find_all("td")

    # Dict formatting for pandas dataframe
    format_dict = {}
    # List that contain format_dict(s) for pandas dataframe
    list_of_dict_table = []
    for index_cell_content,cell_content in enumerate(td):
        if len(cell_content.get_text()) > 1:
            if index_cell_content % 2 == 0:
                format_dict["Address"] = cell_content.get_text()
                print("Appending format_dict")
                list_of_dict_table.append(format_dict)
                print("Getting back format_dict as zero value")
                format_dict = {}  
            else:
                format_dict["School"] = "|".join(str(cell_content).replace("<td>","").\
                    replace("</td>","").split("<br/>"))
                    
    df = pd.DataFrame(list_of_dict_table)
    print("Exporting nearby school table to csv output..")
    df.to_csv("{}/temp/nearby_school.csv".format(BaseConfig.BASE_DIR),index=False)