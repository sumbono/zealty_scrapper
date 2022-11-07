import os
import pandas as pd
import sys

from playwright.async_api import Page
from typing import Dict, Union

for dir_item in os.listdir(os.path.abspath(os.path.join('.'))):
    sys.path.append(dir_item)

from libs.export_result import export_result
from workers.background import background_threads

# https://bcrealestatemap.ca/svcGetAssessmentHistory.php
# https://bcrealestatemap.ca/svcGetPermits.php
# https://bcrealestatemap.ca/svcGetInfoDB.php
# https://bcrealestatemap.ca/svcFetchDB.php

status_code,status_code_ah,status_code_bp,status_code_ns = 0,0,0,0
resp_body,resp_body_ah,resp_body_bp,resp_body_ns = None,None,None,None

async def on_response_ah(response):
    global status_code_ah
    global resp_body_ah
    
    if "svcGetAssessmentHistory.php" in response.url:
        status_code_ah = response.status
        try:
            resp_body_ah = await response.json()
            return resp_body_ah
        except Exception as err:
            print(f"Error while get the response svcGetAssessmentHistory from API - {err}")

async def on_response_bp(response):
    global status_code_bp
    global resp_body_bp
    
    if "svcGetPermits.php" in response.url:
        status_code_bp = response.status
        try:
            resp_body_bp = await response.json()
            return resp_body_bp
        except Exception as err:
            print(f"Error while get the response svcGetPermits from API - {err}")
    
async def on_response_ns(response):
    global status_code_ns
    global resp_body_ns
    
    if "svcGetInfoDB.php" in response.url:
        status_code_ns = response.status
        try:
            resp_body_ns = await response.json()
            return resp_body_ns
        except Exception as err:
            print(f"Error while get the response svcGetInfoDB from API - {err}")

async def on_response(response):
    global status_code
    global resp_body
    
    if "svcFetchDB.php" in response.url:
        status_code = response.status
        try:
            resp_body = await response.json()
            return resp_body
        except Exception as err:
            print(f"Error while get the response svcFetchDB from API - {err}")

def process_details(
    mls: str, 
    resp_body: Dict, resp_body_ah: Dict, resp_body_bp: Dict, resp_body_ns: Dict,
    filename: str, is_first_page: bool, df: Union[pd.DataFrame, None]
):
    
    try:
        if resp_body['rows'][0][0] != mls:
            resp_body = None
    except Exception as err:
        print(f"Error while parsing resp_body - {err}")
        
    prop_main_detail = df
    
    if resp_body and resp_body_ns:
        nearby_schools: list = export_result(resp_body=resp_body_ns, resp_name='svcGetInfoDB')
        prop_main_detail['nearby_schools'] = [nearby_schools]
    else:
        print(f"Error while add nearby_schools")
        prop_main_detail['nearby_schools'] = ""
        
    if resp_body and resp_body_bp:
        prop_main_detail['building_permits'] = [resp_body_bp]
    else:
        print(f"Error while add building_permits")
        prop_main_detail['building_permits'] = ""
        
    if resp_body and resp_body_ah:
        assessments: list = export_result(resp_body=resp_body_ah, resp_name='svcGetAssessmentHistory')
        prop_main_detail['assessments'] = [assessments]
    else:
        print(f"Error while add assessments")
        prop_main_detail['assessments'] = ""

    print(f"Store the property's details...")
    prop_main_detail = prop_main_detail.replace(float('nan'), '', regex=True)
    export_result(filename=filename, is_first_page=is_first_page, just_export=True, df=prop_main_detail)


async def mls_detail(
        page: Page, mls: str, url: str, 
        property_status: str='active', filename: str='', is_first_page: bool=False,
        df: pd.DataFrame=None
    ) -> None:
    
    if property_status!='active':
        timeout = 5.0
    else:
        timeout = 30.0

    await page.goto(url=url, wait_until="commit")
    
    try:
        await page.wait_for_selector("div#container", timeout=timeout)
        await page.wait_for_selector("div#container > div > div#details-section", timeout=timeout)
        await page.wait_for_selector("div#container > div > div.section-tile", timeout=timeout)
        await page.wait_for_selector("div#container > div > div#rateHub", timeout=timeout)
        # await page.wait_for_selector("div#container > div#photo-section", timeout=timeout)
        await page.wait_for_selector("div#container > div#more-info-section", timeout=timeout)
        await page.wait_for_selector("#schools > div > table.stripedTable", timeout=timeout)
    except Exception as err:
        print(f"Error while waiting elements - {err}")
    
    await page.wait_for_timeout(3000)
    
    page.on("response", on_response)
    page.on("response", on_response_ns)
    page.on("response", on_response_bp)
    page.on("response", on_response_ah)
    
    print("Start process the data...")
    await background_threads.run(process_details,mls,resp_body,resp_body_ah,resp_body_bp,resp_body_ns,filename,is_first_page,df)