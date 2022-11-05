"""
The command-line interface of the crawler
"""

import argparse
import asyncio
import time

from workers.search import search

def main():
    parser = argparse.ArgumentParser(
        description="A crawler of the Zealty.ca"
    )
    parser.add_argument(
        "page", type=str,
        help="The PAGE of the Zealty URL to be crawled. Available choices: 'search' or 'detail' (in progress)"
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
    args = parser.parse_args()
    
    if args.page == 'search':
        prop_status = args.property_status
        start_page = args.start or '1'
        end_page = args.end or '10'
        
        start_time = time.time()
        asyncio.run(search(property_status=prop_status, page_start=int(start_page), page_end=int(end_page)))
        print("--- %s seconds ---" % (time.time() - start_time))
    
    else:
        print(f"This '{args.page}' page crawler, not yet ready.")

if __name__ == "__main__":
    main()