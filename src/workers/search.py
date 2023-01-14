import os
import random
import sys
import time

from playwright.async_api import async_playwright, Page

for dir_item in os.listdir(os.path.abspath(os.path.join('.'))):
    sys.path.append(dir_item)
    
from config import BaseConfig, SEARCH_URL
from libs.check_temp_dir import check_temp_dir
from libs.export_result import export_result
from libs.login import email_login


active_age_conversion = {
    "today" : "today",
    "today & yesterday": "1",
    "last 7 days": "7",
    "last 14 days": "14",
    "yesterday": "yesterday",
    "this month": "this-month",
    "last month": "last-month",
    "this year": "this-year",
    "last year": "last-year",
    "15+ days": "15+",
    "30+ days": "30+",
    "60+ days": "60+",
    "90+ days": "90+",
    "120+ days": "120+",
    "180+ days": "180+"
}

sold_age_conversion = {
    "today" : "today",
    "today & yesterday": "1",
    "last 7 days": "7",
    "last 14 days": "14",
    "last 30 days": "30",
    "last 60 days": "60",
    "last 90 days": "90",
    "last 6 months": "183",
    "last 12 months": "365",
    "last 24 months": "730",
    "last 36 months": "1095",
    "yesterday": "yesterday",
    "this month": "this-month",
    "last month": "last-month",
    "this year": "this-year",
    "last year": "last-year",
}

async def on_response(response):
    global status_code
    global resp_body

    if "svcFetchDB.php" in response.url:
        status_code = response.status
        get_resp_status = False
        while not get_resp_status:
            try:
                resp_body = await response.json()
                get_resp_status = True
                return resp_body
            except Exception as err:
                print(f"Error while get the response from API - {err}")
                resp_body = None
                time.sleep(random.randint(10,30))
                print(f"Retry to get the response from API")


async def search(property_status: str='sold', page_start: int=1, page_end: int=10, debug: bool=False, active_age: str='', sold_age: str='') -> None:
    
    if active_age:
        end_name = "_".join(active_age.replace('+',' more').split(' '))
    elif sold_age:
        end_name = "_".join(sold_age.replace('+',' more').split(' '))
    else:
        end_name = f"{page_start}_{page_end}"
    filename = f"temp/{property_status}/csv/search_{property_status}_{end_name}.csv"
    filename = os.path.join(BaseConfig.BASE_DIR, filename)
    
    # examine the age
    prop_active_age = active_age_conversion.get(active_age)
    prop_sold_age = sold_age_conversion.get(sold_age, "1095")

    print(f"prop_active_age: {prop_active_age}")
    print(f"prop_sold_age: {prop_sold_age}")

    async with async_playwright() as p:
        
        chromium = p.chromium
        browser = await chromium.launch(headless=not debug)
        
        check_temp_dir()
        context, page = await email_login(SEARCH_URL, browser)
        page.on("response", on_response)
        
        await page.wait_for_selector("#searchResults > div.noprint > div > div > i")
        await page.click("#searchResults > div.noprint > div > div > i")
        
        # Select 'All of British Columbia' Region
        await page.locator('select#database').select_option('allBC')

        # select property_status & its age
        if property_status=='active':
            await page.get_by_label('For Sale').check()
            if prop_active_age:
                await page.wait_for_selector("div#activeDaysPopup > div > div > select[name='ageactive']")
                await page.locator("div#activeDaysPopup > div > div > select[name='ageactive']").select_option(prop_active_age)

        elif property_status=='sold':
            await page.get_by_label('Sold').check()
            await page.wait_for_selector("div#soldDaysPopup > div > div > select[name='agesold']")
            await page.locator("div#soldDaysPopup > div > div > select[name='agesold']").select_option(prop_sold_age)

        else:
            await page.get_by_label('Expired').check()
            await page.wait_for_selector("div#soldDaysPopup > div > div > select[name='agesold']")
            await page.locator("div#soldDaysPopup > div > div > select[name='agesold']").select_option(prop_sold_age)

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
        
        '''
        Sorting the search results for each status:
        1. active sorted by 'Days on Market (low to high)' -> 2
        2. sold sorted by 'Sale Reported Date (recent first)' -> 11 
        3. expired sorted by 'Off Market Date (recent first)' -> 11
        '''
        if property_status=='active':
            await page.evaluate(f"gSortOrder = parseInt({2}, 10); savePreferences(); doSearch(1, false);")
        elif property_status=='sold':
            await page.evaluate(f"gSortOrder = parseInt({11}, 10); savePreferences(); doSearch(1, false);")
        else:
            await page.evaluate(f"gSortOrder = parseInt({11}, 10); savePreferences(); doSearch(1, false);")
        
        page.on("response", on_response)
        await page.wait_for_timeout(5000)

        #get total property
        await page.wait_for_selector("div#foundCount")
        total_raw = await page.text_content("div#foundCount")
        try:
            total_prop = total_raw.replace('found','').strip().replace(',','').strip()
            total_prop = int(total_prop)
        except Exception as err:
            print(f"The total prop - {total_raw} - error_msg: {err}")
            total_prop = int(page_end*28)

        print(f"total_raw: {total_raw} - total_prop: {total_prop}")
        page_end_tp = int(total_prop/28) + 1
        if page_end_tp <= page_end:
            page_end = page_end_tp
            print(f"change the page_end to {page_end}")

        #scrape search results
        for num in range(page_start, page_end+1):
            try:
                if num==1:
                    print(f"Getting the property list and its details on #{num} page...")
                    page.on("response", on_response)
                    export_result(resp_body=resp_body, filename=filename, resp_name='svcFetchDB', is_first_page=True, is_search=True)
                elif num==page_start:
                    await page.evaluate(f'doSearch({num}, true);')
                    page.on("response", on_response)
                    await page.wait_for_timeout(5000)
                    print(f"Getting the property list and its details on #{num} page...")
                    page.on("response", on_response)
                    export_result(resp_body=resp_body, filename=filename, resp_name='svcFetchDB', is_first_page=True, is_search=True)
                else:
                    await page.evaluate(f'doSearch({num}, true);')
                    page.on("response", on_response)
                    await page.wait_for_timeout(5000)
                    print(f"Getting the property list and its details on #{num} page...")
                    page.on("response", on_response)
                    export_result(resp_body=resp_body, filename=filename, resp_name='svcFetchDB', is_search=True)
            except Exception as err:
                print(f"parsing #{num} page - err_msg: {err}")
            if debug:
                await page.screenshot(path=f"{BaseConfig.BASE_DIR}/temp/{property_status}/csv/search_page_{num}.png", full_page=True)
        
        await page.close()
        await browser.close()
