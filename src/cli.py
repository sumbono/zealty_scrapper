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
        help=("The last page number to be crawled. If not set, default value is 10.")
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
    end_page = args.end or '10'
    with_img = True if args.img=='yes' else False
    debug = True if args.debug=='yes' else False
    
    start_time = time.time()
    
    if args.page == 'search':
        asyncio.run(search(property_status=prop_status, page_start=int(start_page), page_end=int(end_page), debug=debug))
    else:
        asyncio.run(detail(property_status=prop_status, page_start=int(start_page), page_end=int(end_page), download_img=with_img, debug=debug))
    
    print("\n--- %s seconds ---" % (time.time() - start_time))

if __name__ == "__main__":
    main()