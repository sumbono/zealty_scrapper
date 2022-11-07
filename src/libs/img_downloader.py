import asyncio, requests

from typing import List, Tuple

from libs.check_temp_dir import check_mls_img_dir
# from libs.runcmd import runcmd
from workers.background import background_threads

# def img_download(mls_meta: Tuple[str,List,str]) -> None:
#     mls: str = mls_meta[0] 
#     img_urls: List = mls_meta[1]
#     property_status: str = mls_meta[2]
    
#     mls_img_dir = check_mls_img_dir(mls,property_status)
#     cmd_list = [
#         f"wget --output-document={mls_img_dir}/{mls}-{idx}.jpg {url}"
#         for idx,url in enumerate(img_urls, start=1)
#     ]
#     for cmd in tqdm(cmd_list,ncols=75,desc=f"{mls} img download"):
#         runcmd(cmd)

def img_downloader(mls_meta: Tuple[str,List,str]) -> None:
    # https://stackoverflow.com/questions/30229231/python-save-image-from-url

    mls: str = mls_meta[0] 
    img_urls: List = mls_meta[1]
    property_status: str = mls_meta[2]
    
    mls_img_dir = check_mls_img_dir(mls,property_status)

    for idx,url in enumerate(img_urls, start=1):
        try:
            with open(f"{mls_img_dir}/{mls}-{idx}.jpg", 'wb') as handle:
                response = requests.get(url.lower(), stream=True)
                if not response.ok:
                    print(response)
                for block in response.iter_content(1024):
                    if not block:
                        break
                    handle.write(block)
        except Exception as err:
            print(f"Error while downloading {idx}# {mls} image")

async def async_bulk_img_download(mls_meta_list: List[Tuple[str,List,str]]) -> None:
    print(f"Downloading images...")
    tasks = [background_threads.run(img_downloader, mls_meta) for mls_meta in mls_meta_list]
    await asyncio.gather(*tasks)
    print(f"Images downloaded...")

