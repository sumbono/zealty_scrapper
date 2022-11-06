import os
import sys

from playwright.async_api import async_playwright

for dir_item in os.listdir(os.path.abspath(os.path.join('.'))):
    sys.path.append(dir_item)
    
from libs.async_iterator import CustomIterator
from libs.check_temp_dir import check_result_file
from libs.get_mls_detail import mls_detail
from libs.load_result import get_property_metadata
from libs.img_downloader import bulk_img_download
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
            prop_meta = prop_meta[21:40]
            
        mls_img_meta_list = []

        print(f"Crawl additional data for each properties...")
        async with async_playwright() as p:
            chromium = p.chromium
            browser = await chromium.launch(headless=not debug)
            context = await browser.new_context()
            page = await context.new_page()
            
            print("get for the first porperty...")
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
            await background_threads.run(bulk_img_download, mls_img_meta_list)
        
    else:
        print(f"The requested property's data NOT exist, `search` it first!")
        
    background_threads.close()