import asyncio
import sys
import os
import time

from playwright.async_api import async_playwright

for dir_item in os.listdir(os.path.abspath(os.path.join('.'))):
    sys.path.append(dir_item)
    
from config import BaseConfig, SEARCH_URL
from libs.check_temp_dir import check_temp_dir
from libs.cookie_checker import session_checker
from libs.export_result import export_result
from libs.login import email_login


async def on_response(response):
    global status_code
    global resp_body

    if "svcFetchDB.php" in response.url:
        status_code = response.status
        try:
            resp_body = await response.json()
            return resp_body
        except Exception as err:
            print(f"Error while get the response from API - {err}")
        
async def search(property_status: str='sold', page_start: int=1, page_end: int=10) -> None:
    
    async with async_playwright() as p:
        
        chromium = p.chromium
        browser = await chromium.launch(headless=False, slow_mo=100)
        
        check_temp_dir()
        page = await email_login(SEARCH_URL, browser)
        page.on("response", on_response)
        
        await page.wait_for_selector("#searchResults > div.noprint > div > div > i")
        await page.click("#searchResults > div.noprint > div > div > i")
        # await page.wait_for_selector("#searchResults > div.table-container > div > table")
        
        # Select 'All of British Columbia' Region
        await page.locator('select#database').select_option('allBC')
        
        # select property_status
        if property_status=='active':
            await page.get_by_label('For Sale').check()

        elif property_status=='sold':
            await page.get_by_label('Sold').check()
            await page.wait_for_selector(
                "div#soldDaysPopup > div > div > select[name='agesold']" #
                )
            await page.locator(
                "div#soldDaysPopup > div > div > select[name='agesold']"
                ).select_option('1095')
            
        else:
            await page.get_by_label('Expired').check()
            await page.wait_for_selector(
                "div#soldDaysPopup > div > div > select[name='agesold']"
                )
            await page.locator(
                "div#soldDaysPopup > div > div > select[name='agesold']"
                ).select_option('1095')
        
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

        await page.locator("div#typeMenuPanel > div > div > button.tall:has-text('Done')").click()
        await page.wait_for_timeout(5000)
        
        #scrape search results
        for num in range(page_start, page_end+1):
            if num==1:
                print(f"Getting the #{num} page properties's details...")
                export_result(resp_body=resp_body, filename=f"{property_status}/search_{page_start}_{page_end}", is_first_page=True)
            else:
                await page.evaluate(f'doSearch({num}, true);')
                await page.wait_for_event("response", on_response)
                # await page.wait_for_selector("div#searchResults > div.table-container > div.search-table > table.stripedTable")
                
                await page.wait_for_timeout(2000)
                print(f"Getting the #{num} page properties's details...")
                export_result(resp_body=resp_body, filename=f"{property_status}/search_{page_start}_{page_end}")
            
            await page.screenshot(path=f"{BaseConfig.BASE_DIR}/temp/{property_status}/search_page_{num}.png") #, full_page=True 
        
        await page.close()
        await browser.close()

if __name__ == "__main__":
    start_time = time.time()
    asyncio.run(search())
    print("--- %s seconds ---" % (time.time() - start_time))