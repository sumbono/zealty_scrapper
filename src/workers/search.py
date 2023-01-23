import asyncio
import os
import sys

from more_itertools import chunked
from playwright.async_api import async_playwright, Browser, Page
from tqdm import tqdm
from typing import List, Tuple

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
        try:
            resp_body = await response.json()
            return resp_body
        except Exception as err:
            print(f"Error while get the response from API - {err}")
            resp_body = None


async def default_page(browser: Browser, property_status: str='sold', page_end: int=10, prop_active_age: str=None, prop_sold_age: str="1095") -> Tuple[Page, str, int, int]:
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

    return page, total_raw, total_prop


async def loop_through_pages(page: Page, filename: str, page_list: List[int], idx: int=1, page_start: int=1, property_status: str='active', debug: bool=False) -> List[int]:
    uncrawled_page = []; page_timeout = 5000
    for num in tqdm(page_list, ncols=85, desc=f"{idx}# batch"):
        try:
            await page.evaluate(f'doSearch({num}, true);')
            page.on("response", on_response)
            await page.wait_for_timeout(page_timeout)
            page.on("response", on_response)
            if num==page_start:
                export_result(resp_body=resp_body, filename=filename, resp_name='svcFetchDB', is_first_page=True, is_search=True)
            else:
                export_result(resp_body=resp_body, filename=filename, resp_name='svcFetchDB', is_search=True)
        except Exception as err:
            print(f"parsing #{num} page - err_msg: {err}")
            uncrawled_page.append(num)
        if debug:
            try:
                os.mkdir(os.path.join(BaseConfig.BASE_DIR,f"temp/{property_status}/csv/page_ss"))
            except Exception as err:
                (f"Error while creating temp sub-dir - {err}")
            try:
                await page.screenshot(path=f"{BaseConfig.BASE_DIR}/temp/{property_status}/csv/page_ss/search_page_{num}.png", full_page=True)
            except Exception as err:
                print(f"Error while screenshot the {num}# page - {err}")
    return uncrawled_page


async def search(property_status: str='sold', page_start: int=1, page_end: int=10, debug: bool=False, active_age: str='', sold_age: str='') -> None:
    # check the page range order
    if page_start > page_end:
        print(f"Wrong page range order. '--start' must be less than or equal with '--end'.")
        return

    # examine the age
    prop_active_age = active_age_conversion.get(active_age, "")
    prop_sold_age = sold_age_conversion.get(sold_age, "1095")
    print(f"prop_active_age: {prop_active_age}")
    print(f"prop_sold_age: {prop_sold_age}")
    
    # check the temporary folder for csv results
    check_temp_dir()
    
    print(f"Instantiate the browser")
    apw = await async_playwright().start()
    browser = await apw.chromium.launch(headless=not debug)
    print(f"Get the total properties for desired config")
    page, total_raw, total_prop = await default_page(browser,property_status,page_end,prop_active_age,prop_sold_age)

    #get the page range that will be crawl
    print(f"Total properties: {total_raw} - total_page: {int(total_prop/28)+1}")
    print(f"Desired page_start: {page_start} ({'default' if page_start==1 else 'user input'}) - page_end: {page_end} ({'default' if page_end==10000 else 'user input'})")
    page_end_tp = int(total_prop/28) + 1
    if page_end_tp < page_start:
        print(f"The requested '--start' out of range. Try again with any value between 1 to {page_end_tp}.")
        await page.close()
        await browser.close()
        await apw.stop()
        return
    elif page_end_tp <= page_end:
        print(f"Change the page_end from {page_end} to {page_end_tp}")
        page_end = page_end_tp
    page_range = list(range(page_start, page_end+1))
    chunked_page_range = list(chunked(page_range, n=150))

    if active_age:
        end_name = "_".join(active_age.replace('+',' more').split(' '))
        if page_start!=1 or page_end!=10000:
            end_name = f"{end_name}_page_{page_start}_{page_end}"
    elif sold_age:
        end_name = "_".join(sold_age.replace('+',' more').split(' '))
        if page_start!=1 or page_end!=10000:
            end_name = f"{end_name}_page_{page_start}_{page_end}"
    else:
        end_name = f"{page_start}_{page_end}"
    filename = f"temp/{property_status}/csv/search_{property_status}_{end_name}.csv"
    filename = os.path.join(BaseConfig.BASE_DIR, filename)
    print(f"The filename for this batches is: '{filename.split('/')[-1]}'")
    
    print(f"Start scraping in {len(chunked_page_range)} {'batch' if len(chunked_page_range)==1 else 'batches'}.")
    uncrawled_page_cpr = []
    for idx, cpr in tqdm(enumerate(chunked_page_range, start=1), ncols=85, total=len(chunked_page_range), desc=f"batch crawl"):
        if uncrawled_page_cpr:
            print(f"\nTotal uncrawled pages: {len(uncrawled_page_cpr)}")
        uncrawled_page_cpr = await loop_through_pages(page, filename, uncrawled_page_cpr+cpr, idx=idx, page_start=page_start, property_status=property_status)
        await page.close()
        await browser.close()
        if idx < len(chunked_page_range):
            browser = await apw.chromium.launch(headless=not debug)
            page, total_raw, total_prop = await default_page(browser,property_status,page_end,prop_active_age,prop_sold_age)
    await apw.stop()