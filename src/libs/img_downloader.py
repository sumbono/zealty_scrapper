import asyncio

from asgiref.sync import sync_to_async
from p_tqdm import p_umap
from tqdm import tqdm
from typing import List, Tuple

from libs.check_temp_dir import check_mls_img_dir
from libs.runcmd import runcmd
from workers.background import background_threads

def img_download(mls_meta: Tuple[str,List,str]) -> None:
    mls: str = mls_meta[0] 
    img_urls: List = mls_meta[1]
    property_status: str = mls_meta[2]
    
    mls_img_dir = check_mls_img_dir(mls,property_status)
    cmd_list = [
        f"wget --output-document={mls_img_dir}/{mls}-{idx}.jpg {url}"
        for idx,url in enumerate(img_urls, start=1)
    ]
    for cmd in tqdm(cmd_list,ncols=75,desc=f"{mls} img download"):
        runcmd(cmd)
        
def bulk_img_download(mls_meta_list: List[Tuple[str,List,str]]) -> None:
    p_umap(img_download, mls_meta_list, num_cpus=8, ncols=75, desc="Bulk Image Download")

# async def async_bulk_img_download(mls_meta_list: List[Tuple[str,List,str]]) -> None:
#     tasks = [background_threads.run(img_download, mls_meta) for mls_meta in mls_meta_list]
#     await asyncio.gather(*tasks)
