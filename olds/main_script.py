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
url_detail = "https://www.zealty.ca/mls-{}/{}-{}"#.format(mls,building.replace("","-"),province)

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

def export_home_page_api(resp_body: dict, filename: str) -> None:
      df = pd.DataFrame(resp_body["rows"])
      df.to_csv(f"{BaseConfig.BASE_DIR}/temp/df_{filename}.csv", index=False)
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

      su.to_csv(f"{BaseConfig.BASE_DIR}/temp/data_{filename}.csv", index=False)

      # return su

async def scrape_main_page(main_url):
    async with async_playwright() as p:
        chromium = p.chromium
        browser = await chromium.launch(headless=False)
        # browser = await chromium.launch()
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
        
        #  Scrape 28 rows home page api data
        print("Getting API page table home page...")
        export_home_page_api(resp_body=resp_body, filename='hp_01')

        # Select 'All of British Columbia' Region
        await page.locator('select#database').select_option('allBC')

        # select status
        await page.get_by_label('For Sale').check()

        # select property type
        await page.locator('div.multiPopup').click()
        await page.wait_for_selector("div#typeMenuPanel > div > label > div > div > input")

        await page.locator("div#typeMenuPanel > div > label > div > div > input[value='HSE']").check()
        await page.locator("div#typeMenuPanel > div > label > div > div > input[value='APT']").check()
        await page.locator("div#typeMenuPanel > div > label > div > div > input[value='TWN']").check()
        await page.locator("div#typeMenuPanel > div > label > div > div > input[value='PAD']").check()
        await page.locator("div#typeMenuPanel > div > label > div > div > input[value='MUF']").check()
        await page.locator("div#typeMenuPanel > div > label > div > div > input[value='LND']").check()
        await page.locator("div#typeMenuPanel > div > label > div > div > input[value='COM']").check()

        await page.screenshot(path=f"{BaseConfig.BASE_DIR}/temp/homepage_select_property_type.png", ) #full_page=True, 

        await page.locator("div#typeMenuPanel > div > div > button.tall:has-text('Done')").click()

        await page.wait_for_selector("#searchResults > div.table-container > div > table")
        
        await page.screenshot(path=f"{BaseConfig.BASE_DIR}/temp/homepage1.png", full_page=True ) 
        
        #  Scrape 28 rows home page api data
        print("Getting API page table home page...")
        export_home_page_api(resp_body=resp_body, filename='hp_filtered_01')

        
        # # Scrape 28 rows home page html data
        # print("Getting HTML page table home page...")
        # main_page_selection = await page.query_selector("#searchResults > div.table-container > div > table")
        # home_page_html = await main_page_selection.inner_html()
        
        # scrape_home_html(home_page_html)

        # # Select page and scrape per page detail
        # await page.click("#footer > div > button:nth-child(3)")
        
        await page.evaluate('doSearch(5, true);')
        
        await page.pause()
        
        await page.screenshot(path=f"{BaseConfig.BASE_DIR}/temp/homepage2.png", full_page=True)
        
        #  Scrape 28 rows home page api data
        print("Getting API page table home page...")
        export_home_page_api(resp_body=resp_body, filename='hp_filtered_05')
                
        await context.close()
        await browser.close()

if __name__ == "__main__":
    import asyncio
    import time
    start_time = time.time()
    asyncio.run(scrape_main_page(MAIN_URL))
    print("--- %s seconds ---" % (time.time() - start_time))
