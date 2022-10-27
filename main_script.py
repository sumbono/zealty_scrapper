import sys, os
from playwright.async_api import async_playwright
import pandas as pd
for dir_item in os.listdir(os.path.abspath(os.path.join('.'))):
    sys.path.append(dir_item)

from core.config import BaseConfig
from modules.cookie_checker import session_checker
from modules.check_temp import check_temp
from modules.login import email_login
from modules.scrape_home_page_html import scrape_home_html

MAIN_URL = "https://zealty.ca/search.html"

async def on_response(response):
    global status_code
    global resp_body

    if "svcFetchDB.php" in response.url:
        status_code = response.status
        try:
          resp_body = await response.json()
          return resp_body
        except:
          pass

def export_home_page_api(resp_body):
  #  async with async_playwright() as p:
      # chromium = p.chromium
      # browser = await chromium.launch(headless=True)
      # context = await browser.new_context(storage_state="cookie_state.json")
      # page = await context.new_page()
    #   page.on("response", on_response)
    #   await page.goto(main_url,wait_until="networkidle")
      
      # Create dataframe from key rows json
      # columns = ["MLS", "", "",]
      df = pd.DataFrame(resp_body["rows"])
      df.to_csv("{}/temp/df_home_page_api.csv".format(BaseConfig.BASE_DIR), index=False)
      mapping = {
        df.columns[0]: 'MLS', 
        df.columns[5]: 'Building',
        df.columns[7]: 'Asking Price',
        df.columns[8]: 'Description',
        df.columns[9]: 'Property Type',
        df.columns[10]: "Style of House",
        df.columns[12]: "Bedrooms",
        df.columns[13]: "Bathrooms",
        df.columns[14]: "Size of House",
        df.columns[20]: "Agency's Name",
        df.columns[21]: "Agent's Name",
        df.columns[22]: "Agent's Phone Number",
        df.columns[23]: "Agent's Email",
        df.columns[24]: "Agency's Website",
        df.columns[25]: "Original Asking Price",
        df.columns[27]: "Property Taxes",
        df.columns[29]: "Lot Size",
        df.columns[30]: "Features & Amenities",
        df.columns[40]: "Videos",
        df.columns[106]: "PID",
        df.columns[126]: "2nd Agent's Name",
        df.columns[136]: "Ownership Interest",
        df.columns[138]: "Image URL(s)",
        df.columns[141]: "Province"
        }
        
      su = df.rename(columns=mapping)
      su = su[["MLS", "Building", 
      "Asking Price", "Description",
      "Property Type","Style of House",
      "Bedrooms","Bathrooms",
      "Agency's Name","Agent's Name",
      "Agent's Phone Number","Agent's Email",
      "Agency's Website", "Original Asking Price",
      "Property Taxes", "Lot Size",
      "Features & Amenities", "Videos",
      "Size of House", "PID",
      "2nd Agent's Name", "Ownership Interest",
      "Image URL(s)","Province"]]

      su.to_csv("{}/temp/home_page_api.csv".format(BaseConfig.BASE_DIR), index=False)

      return su

async def scrape_main_page(main_url):
    async with async_playwright() as p:
        chromium = p.chromium
        browser = await chromium.launch(headless=False)
        check_temp()
        await session_checker()
        try :
            context = await browser.new_context(storage_state="{}/temp/cookie_state.json".format(BaseConfig.BASE_DIR))
        except:
            await email_login()
            context = await browser.new_context(storage_state="{}/temp/cookie_state.json".format(BaseConfig.BASE_DIR))
        page = await context.new_page()
        page.on("response", on_response)
        await page.goto(main_url,wait_until="networkidle")
        await page.wait_for_selector("#searchResults > div.noprint > div > div > i")
        await page.click("#searchResults > div.noprint > div > div > i")
        await page.wait_for_selector("#searchResults > div.table-container > div > table")

        #  Scrape 28 home page api
        # print("Getting API page table home page...")
        # export_home_page_api(resp_body=resp_body)

        # # Scrape 28 home page html
        print("Getting HTML page table home page...")
        main_page_selection = await page.query_selector("#searchResults > div.table-container > div > table")
        home_page_html = await main_page_selection.inner_html()
        scrape_home_html(home_page_html)

        await context.close()
        await browser.close()

if __name__ == "__main__":
    import asyncio
    import time
    start_time = time.time()
    asyncio.run(scrape_main_page(MAIN_URL))
    print("--- %s seconds ---" % (time.time() - start_time))
