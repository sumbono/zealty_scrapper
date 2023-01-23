"""
The command-line interface of the crawler
"""

import argparse
import asyncio
import time

from workers.detail import detail
from workers.search import search

def main():
    parser = argparse.ArgumentParser(
        description="A crawler of Zealty.ca"
    )
    parser.add_argument(
        "page", type=str,
        help="The PAGE of the Zealty URL to be crawled. Available choices: 'search' or 'detail'"
    )
    parser.add_argument(
        "property_status", type=str,
        help="The STATUS of the PROPERTY to be searched. Available choices: 'active', 'sold', 'expired'"
    )
    parser.add_argument(
        "--start", "-s",
        help=("The first page number to be crawled. If not set, default value is 1.")
    )
    parser.add_argument(
        "--end", "-e",
        help=("The last page number to be crawled. If not set, default value is 10000.")
    )
    parser.add_argument(
        "--img", "-i",
        help=(
            """
            For `detail` Page only. The option to download the image of each property. 
            Available choices: 'yes' or 'no'.
            If not set, default value is 'no'.
            """
        )
    )
    parser.add_argument(
        "--only-img", "-o",
        help=(
            """
            For `detail` Page only. The option to download just the image of each property, not the details. 
            Available choices: 'yes' or 'no'.
            If not set, default value is 'no'.
            """
        )
    )
    parser.add_argument(
        "--url", "-u",
        help=(
            """
            For `detail` Page only. The option to crawl the details of single url. 
            If not set, default value is empty string ('').
            """
        )
    )
    parser.add_argument(
        "--custom-file", "-cf",
        help="""
            For `detail` Page only. The option to crawl the details of single custom file.\n
            The base directory is the project directory root.\n
            Example format:\n
            - 'my_custom_file.csv' -> in root project directory.\n
            - 'temp/my_custom_file.csv' -> in root/temp/ project directory.\n
            - 'src/my_custom_file.csv' -> in root/src/ project directory.\n
            If not set, default value is empty string ('').
            """
    )
    parser.add_argument(
        "--active-age", "-aa",
        help="""
            For `search` Page and 'active' status only. The option to crawl by active age on the listing.\n
            Available choices:\n
            - "today"
            - "today & yesterday"
            - "last 7 days"
            - "last 14 days"
            - "yesterday"
            - "this month"
            - "last month"
            - "this year"
            - "last year"
            - "15+ days"
            - "30+ days"
            - "60+ days"
            - "90+ days"
            - "120+ days"
            - "180+ days"
            .
            If not set, default value is empty string ('').
            """
    )
    parser.add_argument(
        "--sold-age", "-sa",
        help="""
            For `search` Page and 'sold'/'expired' status only. The option to crawl by sold age on the listing.\n
            Available choices:\n
            - "today"
            - "yesterday"
            - "last 7 days"
            - "last 14 days"
            - "last 30 days"
            - "last 60 days"
            - "last 90 days"
            - "last 6 months"
            - "last 12 months"
            - "last 24 months"
            - "last 36 months"
            - "yesterday"
            - "this month"
            - "last month"
            - "this year"
            - "last year"
            .
            If not set, default value is empty string ('').
            """
    )
    parser.add_argument(
        "--debug", "-d",
        help=(
            """
            The option for testing purpose. 
            Available choices: 'yes' or 'no'.
            If not set, default value is 'no'.
            """
        )
    )
    args = parser.parse_args()
    
    prop_status = args.property_status
    start_page = args.start or '1'
    end_page = args.end or '10000'
    with_img = True if args.img=='yes' else False
    debug = True if args.debug=='yes' else False
    img_only = True if args.only_img=='yes' else False
    url = args.url or ''
    custom_csv_file = args.custom_file or ''
    active_age = args.active_age or ''
    sold_age = args.sold_age or ''
    
    start_time = time.time()
    
    print(f"active_age: {active_age}")
    print(f"sold_age: {sold_age}")

    if args.page == 'search':
        asyncio.run(search(property_status=prop_status, page_start=int(start_page), page_end=int(end_page), debug=debug, active_age=active_age, sold_age=sold_age))
    else:
        asyncio.run(detail(property_status=prop_status, page_start=int(start_page), page_end=int(end_page), download_img=with_img, debug=debug, img_only=img_only, url=url, custom_csv_file=custom_csv_file))
    
    print("\n--- %s minutes ---" % int((time.time() - start_time)/60))

if __name__ == "__main__":
    main()