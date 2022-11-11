import asyncio
import os
import sys

from more_itertools import chunked
from playwright.async_api import async_playwright, Page
from typing import Dict, List

for dir_item in os.listdir(os.path.abspath(os.path.join('.'))):
    sys.path.append(dir_item)
    
from libs.async_iterator import CustomIterator
from libs.check_temp_dir import check_result_file
from libs.get_mls_detail import mls_detail
from libs.load_result import get_property_metadata
from libs.img_downloader import async_bulk_img_download
from workers.background import background_threads


async def detail(property_status: str='active', page_start: int=1, page_end: int=10, download_img: bool=False, debug: bool=False, img_only: bool=False) -> None:
    
    if property_status=='active':
        
        background_threads.start()
        
        if check_result_file(property_status, start=page_start, end=page_end):
            print(f"The requested property's data exist, ready for detail crawling...")
            
            filename=f"{property_status}/csv/detail_{property_status}_{page_start}_{page_end}"
            print(f"The filename for this detail is {filename}")
            
            print(f"Get the properties metadata...")
            prop_meta = get_property_metadata(property_status,start=page_start,end=page_end)
            
            if debug:
                prop_meta = prop_meta[1:10]
                
            mls_img_meta_list = []

            if img_only:
                print(f"User choose to download image only...")
                mls_img_meta_list = [(el['mls'],el['img_urls'],property_status) for el in prop_meta]
                if mls_img_meta_list:
                    print(f"download the image[s] of each property...")
                    await async_bulk_img_download(mls_img_meta_list)
            
            else:
                print(f"Crawl additional data for each properties...")
                async with async_playwright() as p:
                    chromium = p.chromium
                    browser = await chromium.launch(headless=not debug)
                    context = await browser.new_context()
                    
                    print("get for the first porperty...")
                    page = await context.new_page()
                    await mls_detail(
                        page, prop_meta[0]['mls'], prop_meta[0]['url'], 
                        property_status=property_status, filename=filename, is_first_page=True,
                        df=prop_meta[0]['dataframe']
                    )
                    
                    print("get for the next properties...")
                    prop_meta = prop_meta[1:]
                    
                    # single crawl at one time
                    print(f"Start the crawler...")
                    async for el in CustomIterator(prop_meta):
                        await mls_detail(
                            page, el['mls'], el['url'], 
                            property_status=property_status, filename=filename, is_first_page=False,
                            df=el['dataframe']
                        )
                        if download_img:
                            mls_img_meta_list.append( (el['mls'],el['img_urls'],property_status) )
                        
                    await page.close()
                    await context.close()
                    await browser.close()
                
                # download the property's images
                if mls_img_meta_list:
                    print(f"download the image[s] of each property...")
                    chnkd = list(chunked(mls_img_meta_list,100))
                    async for miml in CustomIterator(chnkd):
                        await async_bulk_img_download(miml)
            
        else:
            print(f"The requested property's data NOT exist, `search` it first!")
            
        background_threads.close()
    
    else:
        print(f"The requested property's data for status '{property_status}', doesnt have the detail page. \
        \nOnly the property with status 'active' a.k.a 'For Sale', have it.")