# import warnings
# warnings.simplefilter(action='ignore', category=FutureWarning)

import os
import pandas as pd
import random
import sys
import time

from playwright.async_api import Page
from typing import Dict, Union

for dir_item in os.listdir(os.path.abspath(os.path.join('.'))):
    sys.path.append(dir_item)

from libs.export_result import export_result
from workers.background import background_threads

# pd.options.mode.chained_assignment = None

# https://bcrealestatemap.ca/svcGetAssessmentHistory.php
# https://bcrealestatemap.ca/svcGetPermits.php
# https://bcrealestatemap.ca/svcGetInfoDB.php
# https://bcrealestatemap.ca/svcGetHistoryMLS.php
# https://bcrealestatemap.ca/svcFetchDB.php
# https://bcrealestatemap.ca/svcGetStatistics.php

status_code,status_code_ah,status_code_bp,status_code_ns,status_code_sh = 0,0,0,0,0
resp_body,resp_body_mls,resp_body_ah,resp_body_bp,resp_body_ns,resp_body_sh,resp_body_mo = {},{},[],[],[],[],{}

async def on_response(response):
    global status_code
    global resp_body
    global resp_body_mls
    global this_mls

    # print(response)

    if "svcFetchDB.php" in response.url:
        status_code = response.status
        try:
            resp_body = await response.json()
            rp_mls_row = [rp for rp in resp_body['rows'] if rp[0] == this_mls]
            if rp_mls_row:
                resp_body_mls = {'columns':[], 'rows':rp_mls_row, 'error': {'code': 0, 'message': '', 'query': ''}}
                # print(f"svcFetchDB_for_mls:{this_mls} response:{resp_body_mls}")
                return resp_body_mls
        except Exception as err:
            print(f"Error while get the response svcFetchDB from API - {err}")

    global status_code_ah
    global resp_body_ah
    
    if "svcGetAssessmentHistory.php" in response.url:
        status_code_ah = response.status
        try:
            resp_body_ah = await response.json()
            # print(f"svcGetAssessmentHistory: {resp_body_ah}")
            return resp_body_ah
        except Exception as err:
            print(f"Error while get the response svcGetAssessmentHistory from API - {err}")

    global status_code_bp
    global resp_body_bp
    
    if "svcGetPermits.php" in response.url:
        status_code_bp = response.status
        try:
            resp_body_bp = await response.json()
            # print(f"svcGetPermits: {resp_body_bp}")
            return resp_body_bp
        except Exception as err:
            print(f"Error while get the response svcGetPermits from API - {err}")
    
    global status_code_ns
    global resp_body_ns
    
    if "svcGetInfoDB.php" in response.url:
        status_code_ns = response.status
        try:
            resp_body_ns = await response.json()
            # print(f"svcGetInfoDB: {resp_body_ns}")
            return resp_body_ns
        except Exception as err:
            print(f"Error while get the response svcGetInfoDB from API - {err}")
    
    global status_code_sh
    global resp_body_sh
    
    if "svcGetHistoryMLS.php" in response.url:
        status_code_sh = response.status
        try:
            resp_body_sh = await response.json()
            # print(f"svcGetHistoryMLS: {resp_body_sh}")
            return resp_body_sh
        except Exception as err:
            print(f"Error while get the response svcGetHistoryMLS from API - {err}")

    global status_code_mo
    global resp_body_mo
    
    if "svcGetStatistics.php" in response.url:
        status_code_mo = response.status
        try:
            resp_body_mo = await response.json()
            # print(f"svcGetStatistics: {resp_body_mo}")
            return resp_body_mo
        except Exception as err:
            print(f"Error while get the response svcGetStatistics from API - {err}")


def process_details(
    mls: str,
    resp_body_mls: Dict, resp_body_ah: list, resp_body_bp: list, resp_body_ns: Dict, resp_body_sh: list, resp_body_mo: dict,
    filename: str, is_first_page: bool, df: Union[pd.DataFrame, None], mode: str='normal'
):  
    prop_main_detail: pd.DataFrame = None
    
    if mode=='normal':
        prop_main_detail = df
    else:
        if resp_body_mls:
            prop_main_detail = export_result(resp_body_mls,is_first_page=True)
        elif isinstance(df, pd.DataFrame):
            prop_main_detail = df    
        else:
            raise Exception(f"Error occured, try again to crawl this mls-{mls} details...")

    # print(prop_main_detail.head())
    
    prop_main_detail['assessments'] = ''
    prop_main_detail['building_permits'] = ''
    prop_main_detail['nearby_schools'] = ''
    prop_main_detail['sales_history'] = ''

    if resp_body_ns:
        nearby_schools: list = export_result(resp_body=resp_body_ns, resp_name='svcGetInfoDB')
        prop_main_detail['nearby_schools'] = pd.Series([nearby_schools]*len(prop_main_detail), index=prop_main_detail.index)
    else:
        print(f"This mls-{mls} have no data for nearby_schools")
        
    if resp_body_bp:
        prop_main_detail['building_permits'] = pd.Series([resp_body_bp]*len(prop_main_detail), index=prop_main_detail.index)
    else:
        print(f"This mls-{mls} have no data for building_permits")
        
    if resp_body_ah:
        assessments: list = export_result(resp_body=resp_body_ah, resp_name='svcGetAssessmentHistory')
        prop_main_detail['assessments'] = pd.Series([assessments]*len(prop_main_detail), index=prop_main_detail.index)
    else:
        print(f"This mls-{mls} have no data for assessments")
    
    if resp_body_sh:
        sales_history: list = export_result(resp_body=resp_body_sh, resp_name='svcGetHistoryMLS')
        prop_main_detail['sales_history'] = pd.Series([sales_history]*len(prop_main_detail), index=prop_main_detail.index)
    else:
        print(f"This mls-{mls} have no data for sales_history")

    if resp_body_mo:
        prop_main_detail['market_overview'] = pd.Series([resp_body_mo]*len(prop_main_detail), index=prop_main_detail.index)
    else:
        print(f"This mls-{mls} have no data for market_overview")

    # print(f"Store the property's details...")
    # print(prop_main_detail.head())
    prop_main_detail = prop_main_detail.replace(float('nan'), '', regex=True)
    export_result(filename=filename, is_first_page=is_first_page, just_export=True, df=prop_main_detail)


async def mls_detail(
        page: Page, mls: str, url: str, 
        property_status: str='active', filename: str='', is_first_page: bool=False,
        df: pd.DataFrame=None, mode: str='normal'
    ) -> None:

    global this_mls
    
    this_mls = mls
    timeout = 10000
    await page.goto(url=url, wait_until="networkidle")
    page.on("response", on_response)
    await page.wait_for_timeout(timeout)

    try:
        await page.wait_for_selector("div#container", timeout=timeout)
        await page.wait_for_selector("div#container > div > div#details-section", timeout=timeout)
        await page.wait_for_selector("div#container > div > div.section-tile", timeout=timeout)
        # await page.wait_for_selector("div#container > div > div#rateHub", timeout=timeout)
        await page.wait_for_selector("div#container > div#photo-section", timeout=timeout)
        await page.wait_for_selector("div#container > div#more-info-section", timeout=timeout)
        await page.wait_for_selector("#schools > div > table.stripedTable", timeout=timeout)
    except Exception as err:
        print(f"Error while waiting elements - {err}")

    # print("Start process the data...")
    await background_threads.run(process_details,mls,resp_body_mls,resp_body_ah,resp_body_bp,resp_body_ns,resp_body_sh,resp_body_mo,filename,is_first_page,df,mode)