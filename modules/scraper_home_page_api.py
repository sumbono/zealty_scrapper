import json
import pandas as pd
from playwright.async_api import async_playwright
import asyncio
import aiofiles

main_url = "https://www.zealty.ca/search.html"
detail_url = "https://www.zealty.ca/mls-{}/{}-{}"#.format(mls,building.replace("","-"),province)

url_api = ""
headers = {}
payload = {}

async def on_response(response):
    global status_code
    global resp_body

    if "svcFetchDB.php" in response.url:
        status_code = response.status
        try:
          resp_body = await response.json()
        except:
          pass

async def scrape_main_page():
   async with async_playwright() as p:
      chromium = p.chromium
      browser = await chromium.launch(headless=True)
      context = await browser.new_context(storage_state="cookie_state.json")
      page = await context.new_page()
      page.on("response", on_response)
      await page.goto(main_url,wait_until="networkidle")
      
      # Create dataframe from key rows json
      # columns = ["MLS", "", "",]
      df = pd.DataFrame(resp_body["rows"])
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
        df.columns[106]: "PID",
        df.columns[126]: "2nd Agent's Name",
        df.columns[136]: "Ownership Interest",
        df.columns[138]: "Image URL(s)",
        df.columns[140]: "Province"
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
      "Features & Amenities",
      "Size of House", "PID",
      "2nd Agent's Name", "Ownership Interest",
      "Image URL(s)","Province"]]

      su.to_csv("response.csv", index=False)
      await browser.close()

      return su

if __name__ == "__main__":
  import time
  start_time = time.time()
  asyncio.run(scrape_main_page())  
  print("--- %s seconds ---" % (time.time() - start_time))
