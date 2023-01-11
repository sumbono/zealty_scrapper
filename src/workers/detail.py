import asyncio
import os
import random
import sys
import time

from more_itertools import chunked
from playwright.async_api import async_playwright, Page
from tqdm import tqdm
from typing import Dict, List

for dir_item in os.listdir(os.path.abspath(os.path.join('.'))):
    sys.path.append(dir_item)
    
from config import BaseConfig, SEARCH_URL
from libs.async_iterator import CustomIterator
from libs.check_temp_dir import check_result_file, check_custom_file
from libs.get_mls_detail import mls_detail
from libs.img_downloader import async_bulk_img_download
from libs.load_result import get_property_metadata, get_custom_property_metadata
from libs.login import email_login
from workers.background import background_threads


async def detail(
    property_status: str='active', 
    page_start: int=1, page_end: int=10, 
    download_img: bool=False, img_only: bool=False, 
    url: str='', custom_csv_file: str='',
    debug: bool=False
) -> None:

    background_threads.start()
    
    if url:
        # https://www.zealty.ca/mls-R2738990/32450-BEST-AVENUE-Mission-BC/
        mls = url.replace("https://www.zealty.ca/","").split("/")[0].replace("mls-","").strip()
        filename = f"temp/{property_status}/csv/detail_{property_status}_{mls}.csv"
        filename = os.path.join(BaseConfig.BASE_DIR, filename)
        print(f"The filename for this detail is {filename}")
        async with async_playwright() as p:
            chromium = p.chromium
            browser = await chromium.launch(headless=not debug)
            context, page = await email_login("https://www.zealty.ca/imap.html", browser)
            await mls_detail(page, mls, url, property_status=property_status, filename=filename, is_first_page=True, mode='url')
            await page.close()
            await context.close()
            await browser.close()
    
    elif custom_csv_file:
        if check_custom_file(custom_csv_file):
            print(f"The requested custom property's data exist, ready for detail crawling...")
            print(f"Get this custom properties metadata...")
            custom_prop_meta = get_custom_property_metadata(custom_csv_file)
            filename = os.path.join(BaseConfig.BASE_DIR, custom_csv_file.replace('.csv','_details.csv'))
            print(f"The result file for this custom csv is {filename}")
            
            mls_img_meta_list = []

            if img_only:
                print(f"User choose to download image only...")
                mls_img_meta_list = [(el['mls'],el['img_urls'],property_status) for el in custom_prop_meta]
                if mls_img_meta_list:
                    print(f"download the image[s] of each property...")
                    await async_bulk_img_download(mls_img_meta_list)
            
            else:
                print(f"Crawl additional data for each properties...")
                async with async_playwright() as p:
                    chromium = p.chromium
                    browser = await chromium.launch(headless=not debug)
                    context, page = await email_login("https://www.zealty.ca/imap.html", browser)
                    
                    print(f"Start the crawler...")
                    for idx,el in tqdm(enumerate(custom_prop_meta, start=1), ncols=80, desc=f"Crawl the details"):
                        if idx==1:
                            is_first_page = True
                        else:
                            is_first_page = False
                        try:
                            await mls_detail(
                                page, custom_prop_meta[idx]['mls'], custom_prop_meta[idx]['url'], 
                                property_status=property_status, filename=filename, is_first_page=is_first_page,
                                df=custom_prop_meta[idx]['dataframe'] #, mode='custom_file'
                            )
                        except Exception as err:
                            time.sleep(random.randint(20,30))
                            try:
                                await mls_detail(
                                    page, custom_prop_meta[idx]['mls'], custom_prop_meta[idx]['url'], 
                                    property_status=property_status, filename=filename, is_first_page=is_first_page,
                                    df=custom_prop_meta[idx]['dataframe'] #, mode='custom_file'
                                )
                            except Exception as err:
                                print(f"Error occured while crawl details of mls-{el['mls']} - err: {err}")
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
            print(f"This file {custom_csv_file} not found. Make sure to input the correct file location path.")

    else:
    
        if check_result_file(property_status, start=page_start, end=page_end):
            print(f"The requested property's data exist, ready for detail crawling...")
            
            filename = f"temp/{property_status}/csv/detail_{property_status}_{page_start}_{page_end}.csv"
            filename = os.path.join(BaseConfig.BASE_DIR, filename)
            print(f"The filename for this detail is {filename}")
            
            print(f"Get the properties metadata...")
            prop_meta = get_property_metadata(property_status,start=page_start,end=page_end)
                
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
                    context, page = await email_login("https://www.zealty.ca/imap.html", browser)
                    
                    # single crawl at one time
                    print(f"Start the crawler...")
                    for idx,el in tqdm(enumerate(prop_meta, start=1), ncols=80, desc=f"Crawl the details"):
                        if idx==1:
                            is_first_page = True
                        else:
                            is_first_page = False
                        try:
                            await mls_detail(
                                page, el['mls'], el['url'], 
                                property_status=property_status, filename=filename, is_first_page=is_first_page,
                                df=el['dataframe']
                            )
                        except Exception as err:
                            await asyncio.sleep(random.randint(20,30))
                            try:
                                await mls_detail(
                                    page, el['mls'], el['url'], 
                                    property_status=property_status, filename=filename, is_first_page=is_first_page,
                                    df=el['dataframe']
                                )
                            except Exception as err:
                                print(f"Error occured while crawl details of mls-{el['mls']} - err: {err}")
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