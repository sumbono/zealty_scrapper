from bs4 import BeautifulSoup
import pandas as pd

def scrape_market_overview(table_html_active,table_html_sold):
    # Get Active Data
    soup = BeautifulSoup(table_html_active, "html.parser")
    tr = soup.find_all("tr")
    th = tr[0].find_all("th")
    thlist = [str(th_item).replace("<br/>"," ") for th_item in th]
    thlist = [BeautifulSoup(th_item,'html.parser').get_text() for th_item in thlist]

    # List that contain format_dict(s) for pandas dataframe
    list_of_dict_table_active = []
    for index_cell_content,cell_content in enumerate(tr[1:]):
        list_td = cell_content.find_all('td')
        for index_td_item, td_item in enumerate(list_td):
            # Dict formatting for pandas dataframe
            format_dict = {}
            format_dict[thlist[index_td_item]] = td_item.get_text()

        list_of_dict_table_active.append(format_dict)
                    
    df = pd.DataFrame(list_of_dict_table_active)
    print("Exporting market overview active table to csv output..")
    df.to_csv("market_overview_active.csv",index=False)

    # Get Sold Data
    soup_sold = BeautifulSoup(table_html_sold, "html.parser")
    tr_sold = soup_sold.find_all("tr")
    th_sold = tr_sold[0].find_all("th")
    thlist_sold = [str(th_item).replace("<br/>"," ") for th_item in th_sold]
    thlist_sold = [BeautifulSoup(th_item,'html.parser').get_text() for th_item in thlist_sold]

    # List that contain format_dict(s) for pandas dataframe
    list_of_dict_table_sold= []

    for index_cell_content, cell_content in enumerate(tr_sold[1:]):
        list_td = cell_content.find_all('td')
        # Dict formatting for pandas dataframe
        format_dict = {}
        for index_td_item, td_item in enumerate(list_td):
            if "<br/>" in str(td_item):
                td_split = str(td_item).split("<br/>")
                td_cell_data = "|".join([BeautifulSoup(td_split_item,'html.parser').text.strip()\
                    for td_split_item in td_split if BeautifulSoup(td_split_item,'html.parser').\
                        text.strip() != ""])
                format_dict[thlist[index_td_item]] = td_cell_data
            else:
                td_cell_data = td_item.get_text()
                format_dict[thlist[index_td_item]] = td_cell_data

        if format_dict != {}:
            list_of_dict_table_sold.append(format_dict)

    df = pd.DataFrame(list_of_dict_table_sold)
    print("Exporting market overview sold table to csv output..")
    df.to_csv("market_overview_sold.csv",index=False)