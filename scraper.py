import requests
import json
import pandas as pd
from playwright.async_api import async_playwright
import asyncio
import aiofiles
# url = "https://bcrealestatemap.ca/svcFetchDB.php"
main_url = "https://www.zealty.ca/search.html"
detail_url = "https://www.zealty.ca/mls-{}/"
# payload='sql=SELECT%20*%20FROM%20***%20WHERE%20((propertyClassCode%20%3D%200)%20OR%20(propertyClassCode%20%3D%201%20AND%20type%20%3D%20\'Apartment\')%20OR%20(propertyClassCode%20%3D%201%20AND%20type%20%3C%3E%20\'Apartment\')%20OR%20(propertyClassCode%20%3D%203)%20OR%20(propertyClassCode%20%3D%204)%20OR%20(propertyClassCode%20%3D%202))%20AND%20reciprocityOK%20%3D%200%20AND%20regionName%20IN%20(\'Sunshine%20Coast\'%2C\'Squamish\'%2C\'Whistler\'%2C\'Pemberton\'%2C\'Bowen%20Island\'%2C\'West%20Vancouver\'%2C\'North%20Vancouver\'%2C\'Vancouver%20West\'%2C\'Vancouver%20East\'%2C\'Burnaby%20East\'%2C\'Burnaby%20North\'%2C\'Burnaby%20South\'%2C\'New%20Westminster\'%2C\'Port%20Moody\'%2C\'Coquitlam\'%2C\'Port%20Coquitlam\'%2C\'Pitt%20Meadows\'%2C\'Maple%20Ridge\'%2C\'Richmond\'%2C\'Ladner\'%2C\'Tsawwassen\'%2C\'Islands-Van.%20%26%20Gulf\')%20ORDER%20BY%20listingPrice%20DESC%20LIMIT%2028%20OFFSET%2028&sold=active&s=f91278919507969f23c135ebb73e830d'
# headers = {
#   'Accept': '*/*',
#   'Accept-Language': 'en-US,en;q=0.9',
#   'Cache-Control': 'no-cache',
#   'Connection': 'keep-alive',
#   'Content-Type': 'application/x-www-form-urlencoded',
#   'Origin': 'https://www.zealty.ca',
#   'Pragma': 'no-cache',
#   'Referer': 'https://www.zealty.ca/',
#   'Sec-Fetch-Dest': 'empty',
#   'Sec-Fetch-Mode': 'cors',
#   'Sec-Fetch-Site': 'cross-site',
#   'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
#   'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
#   'sec-ch-ua-mobile': '?0',
#   'sec-ch-ua-platform': '"macOS"'
# }

# # Validation login
# # if 

# response = requests.request("POST", url, headers=headers, data=payload)

# with open ("response.json", "w") as f:
#   f.write(json.dumps(response.json()))
#   f.close()

# # Create dataframe from key rows json
# columns = ["", "", "",]
# df = pd.DataFrame(response.json()["rows"],columns=columns)
# df.to_csv("response.csv", index=False)
url_api = ""
headers = {}
payload = {}

# def on_request(request):
#     global headers
#     global url_api
#     global payload

#     if "svc" in request.url:
#         payload = request.post_data_json
#         url_api = request.url
#         headers = request.headers
async def on_response(response):
    global status_code
    global resp_body

    if "svc" in response.url:
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
      # page.on("request", on_request)
      page.on("response", on_response)
      await page.goto(main_url,wait_until="networkidle")
      
      # print(headers)
      # print(payload)
      # print(url_api)

      # print(status_code)
      # print(resp_body)
      json_resp = json.dumps(resp_body)

      async with aiofiles.open("response.json", "w") as f:
        f.write(json_resp)
        f.close()
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
        df.columns[138]: "Image URL(s)"

        }
      su = df.rename(columns=mapping)
      su = su[["MLS", "Building", 
      "Asking Price", "Description",
      "Property Type","Style of House",
      "Bedrooms","Bathrooms",
      "Agency's Name","Agent's Name",
      "Agent's Phone Number","Agent's Email",
      "Agency's Website", "Originial Asking Price",
      "Property Taxes", "Lot Size",
      "Features & Amenities",
      "Size of House", "PID",
      "2nd Agent's Name", "Ownership Interest",
      "Image URL(s)"]]
      su.to_csv("response.csv", index=False)
      await browser.close()

if __name__ == "__main__":
  asyncio.run(scrape_main_page())