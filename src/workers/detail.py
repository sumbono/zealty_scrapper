import asyncio
import os
import sys
import time

from playwright.async_api import async_playwright, Browser, BrowserContext, Page

for dir_item in os.listdir(os.path.abspath(os.path.join('.'))):
    sys.path.append(dir_item)
    
from config import BaseConfig, SEARCH_URL
from libs.async_iterator import CustomIterator
from libs.check_temp_dir import check_temp_dir, check_result_file
from libs.export_result import export_result
from libs.get_mls_detail import mls_detail
from libs.load_result import get_property_metadata
from libs.login import email_login
from libs.img_downloader import bulk_img_download, img_download
from workers.background import background_threads

async def detail(property_status: str='sold', page_start: int=1, page_end: int=10, download_img: bool=False, debug: bool=False) -> None:
    background_threads.start()
    
    if check_result_file(property_status, start=page_start, end=page_end):
        print(f"The requested property's data exist, ready for detail crawling...")
        
        filename=f"{property_status}/csv/detail_{page_start}_{page_end}"
        print(f"The filename for this detail is {filename}")
        
        print(f"Get the properties metadata...")
        prop_meta = get_property_metadata(property_status,start=page_start,end=page_end)
        
        if debug:
            prop_meta = prop_meta[112:127]
            
        mls_img_meta_list = []

        print(f"Crawl additional data for each properties...")
        async with async_playwright() as p:
            chromium = p.chromium
            browser = await chromium.launch(headless=not debug)
            
            context, page = await email_login(SEARCH_URL, browser)
            
            # context = await browser.new_context()
            pages = [await context.new_page() for num in range(5)]
            
            print("get for the first porperty...")
            await mls_detail(await context.new_page(), prop_meta[0]['mls'], prop_meta[0]['url'], property_status=property_status, filename=filename, is_first_page=True)
            
            print("get for the next properties...")
            prop_meta = prop_meta[1:]
            
            chunked_prop_meta = [prop_meta[i:i + len(pages)] for i in range(0, len(prop_meta), len(pages))]
            print(f"Chunking the metadata by group of {len(pages)} - for {len(chunked_prop_meta)} bacth[es]...")
            
            print(f"Start the crawler...")
            for mul in chunked_prop_meta:
                print(f"mls to be crawl: {[el['mls'] for el in mul]}")
                count = 0
                async for el in CustomIterator(mul):
                # for el in mul:
                    await mls_detail(pages[count], el['mls'], el['url'], property_status=property_status, filename=filename, is_first_page=False)
                    if download_img:
                        # await background_threads.run(img_download, (el['mls'],el['img_urls'],property_status))
                        mls_img_meta_list.append( (el['mls'],el['img_urls'],property_status) )
                    count += 1
            
            await context.close()
            await browser.close()
        
        # download the property's images
        if mls_img_meta_list:
            print(f"download the image[s] of each property...")
            await background_threads.run(bulk_img_download, mls_img_meta_list)
        
    else:
        print(f"The requested property's data NOT exist, `search` it first!")
        