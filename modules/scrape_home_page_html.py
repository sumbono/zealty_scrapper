import pandas as pd
from bs4 import BeautifulSoup
from core.config import BASE_DIR

def scrape_home_html(table_html_string):
    soup = BeautifulSoup(table_html_string, "html.parser")
    tr = soup.find_all("tr")
    thlist = [th_item.get_text() for th_item in tr[0] if th_item.get_text() != "" and th_item.get_text() != "\n" ]
    thlist.insert(0, "Image's Count")    
    # List that contain format_dict(s) for pandas dataframe
    list_of_dict_table = []
    for index_tr_item,tr_item in enumerate(tr[1:]):
        # Dict formatting for pandas dataframe
        format_dict = {}
        # Column data Extraction
        td_find = tr_item.find_all("td", {"class": "table-cell"})
        # If row is not ads
        if len(td_find) > 1:
            # Extract column count image data
            find_image_count = str(td_find[0].find("div")).split('<div id=')[1].split("\n")[0]
            image_count = BeautifulSoup("<div id="+find_image_count,"html.parser").text.strip()
            
            format_dict[thlist[0]] = image_count

            # Extract MLS Number data
            mls_number = td_find[1].find("button",{"class": "tall linkMLS"}).get_text()
            
            format_dict[thlist[1]] = mls_number

            # Extract Address data
            find_address = td_find[2].find_all("div")
            address = ""

            for address_data_item in find_address:
                # If not "" as value
                if len(address_data_item.get_text())>1: 
                    # Separate child and parent element
                    if address_data_item.findChild("div",{"style": "font-size: smaller;"}) :
                        child_element = address_data_item.findChild("div",{"style": "font-size: smaller;"}).get_text()
                        parent_element = str(address_data_item).split('<div style="font-size: smaller;">')[0].replace("<div>","")
                        address += "|"+parent_element+"|"+child_element
                    else :
                        # If data is empty string initiate without "|"
                        if address == "":
                            address += address_data_item.get_text()
                        # If there's data in address string add "|" and next value
                        else :
                            address += "|"+address_data_item.get_text()

            format_dict[thlist[2]] = address

            # Extract Property Info data
            find_property_info = td_find[3].find_all("div")
            property_info = "|".join([fp_item.get_text() for fp_item in find_property_info])
            format_dict[thlist[3]] = property_info

            # Extract Size data
            find_size_filter_first = td_find[4].findChildren("div")[0]
            find_size_first = str(td_find[4]).split(str(find_size_filter_first))[0]
            find_size_first = BeautifulSoup(find_size_first,"html.parser").get_text()
            find_div_size = td_find[4].findChildren("div")
            size_column = find_size_first

            for div_size_item in find_div_size:
                if div_size_item.findChild("div"):
                    parent_and_child_element = str(div_size_item).split('<div style="font-size: smaller;">')
                    parent_element = BeautifulSoup(parent_and_child_element[0],"html.parser").get_text()
                    child_element = BeautifulSoup(parent_and_child_element[1],"html.parser")
                    child_element = str(child_element).split("\n")[0] + " " +\
                        str(child_element).split("\n")[1].strip()
                    size_column += "|" + parent_element + '|' + child_element 
                else:
                    if "\n" not in str(div_size_item) :
                        size_column += "|" + div_size_item.get_text()

            format_dict[thlist[4]] = size_column

            # Extract Asking Price data
            find_asking_price = td_find[5].find("div",{"style": "position: relative;"}).findChildren("div")
            asking_price = "|".join([asking_price_item.get_text() for asking_price_item in find_asking_price])
            format_dict[thlist[5]] = asking_price

            # Extract Date data
            find_date = td_find[6].find_all("div")
            date_column = ""

            for find_date_item in find_date:
                if find_date_item.findChild("div"):
                    parent_and_child_element = str(find_date_item).split('<div style="font-family: monospace;">')
                    parent_element = BeautifulSoup(parent_and_child_element[0],"html.parser").get_text()
                    if date_column=="":
                        date_column += parent_element
                    else :
                        date_column += "|" + parent_element
                elif "\n" not in str(find_date_item):
                    if date_column=="":
                        date_column += find_date_item.get_text()
                    else :
                        date_column += "|" + find_date_item.get_text()

            format_dict[thlist[6]] = date_column

            # Extract Seller's Agent
            find_seller_s_agent = td_find[7].find("div")
            splitted_find_seller_s_agent= str(find_seller_s_agent).split("\n")
            agency_s_name_and_email = splitted_find_seller_s_agent[0].split('<a href="mailto:')
            # If there's email
            if len(agency_s_name_and_email) > 1 :
                agency_s_name_and_email = BeautifulSoup(agency_s_name_and_email[0],"html.parser").text.strip() + \
                                        "|" + str(agency_s_name_and_email[1]).split("?")[0]
                # Initiate Seller's Agent column data with agency_s_name_and_email data
                seller_s_agent_column = agency_s_name_and_email
                # Loop for processing others data and add into seller_s_agent_column data
                for splitted_find_seller_s_agen_item in splitted_find_seller_s_agent:
                    bs_of_splitted_item = BeautifulSoup(splitted_find_seller_s_agen_item,"html.parser").text.strip()
                    if bs_of_splitted_item != "" :
                        seller_s_agent_column += "|" + bs_of_splitted_item

            # If there's no email just agency's name and seller's agent name
            else :
                try :
                    agency_s_name_and_seller_s_name = BeautifulSoup(agency_s_name_and_email[0],"html.parser")
                    list_agency_s_name_and_seller_s_name = []
                    list_agency_s_name_and_seller_s_name.append(str(agency_s_name_and_seller_s_name.findChild("div",{"style":"font-size: smaller; font-style: italic;"})))
                    
                    agency_s_name_and_seller_s_name.findChild("div",{"style":"font-size: smaller; font-style: italic;"}).decompose()
                    list_agency_s_name_and_seller_s_name.append(str(agency_s_name_and_seller_s_name))
                    agency_s_name_and_email = BeautifulSoup(list_agency_s_name_and_seller_s_name[1],"html.parser").text.strip() +\
                        "|" + BeautifulSoup(list_agency_s_name_and_seller_s_name[0],"html.parser").text.strip()
                    
                    # Initiate Seller's Agent column data with agency_s_name_and_email data
                    seller_s_agent_column = agency_s_name_and_email
                    # Loop for processing others data and add into seller_s_agent_column data
                    for splitted_find_seller_s_agen_item in splitted_find_seller_s_agent:
                        if "tel:" in splitted_find_seller_s_agen_item:
                            bs_of_splitted_item = BeautifulSoup(splitted_find_seller_s_agen_item,"html.parser").text.strip()
                            if bs_of_splitted_item != "" :
                                seller_s_agent_column += "|" + bs_of_splitted_item

                # If there's only agency's name
                except:
                    seller_s_agent_column = BeautifulSoup(agency_s_name_and_email[0],"html.parser").text.strip()

            format_dict[thlist[7]] = seller_s_agent_column

            list_of_dict_table.append(format_dict)

    df = pd.DataFrame(list_of_dict_table)
    print("Exporting home page table to csv output..")
    df.to_csv("{}/temp/home_page_html.csv".format(BASE_DIR),index=False)
