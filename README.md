# Zealty Scraper Script

## Command Sample
```bash
$ poetry run python src/cli.py search active --start 1 --end 1
$ poetry run python src/cli.py search sold --start 1 --end 1
$ poetry run python src/cli.py search expired --start 1 --end 1
```

## Environment setup
- install poetry on your machine 
```bash
$ pip install poetry==1.1.15
```
- another option is use `pip3`, if `pip` doesn't work
- restart your command-line or terminal
- check poetry installation:
```bash
$ poetry --version
```
- if no error, then your environment ready.

## Set up  with conda and poetry
- https://felix11h.github.io/notes/ops/poetry.html
- create poetry env
```bash
$ poetry env use python
```
- verify python path and virtualenv location
```bash
$ poetry env info
```
- however, when running Jupyter notebooks, inside conda virtual environment, selecting conda kernal instead of peotry kernal

## Install dependencies 
```bash
$ cd zealty_scraper
$ poetry install
$ poetry run playwright install
```

## Set up env viarables 
```bash
$ poetry add python-dotenv
```

```bash
from dotenv import load_dotenv
load_dotenv()
scraper_path = os.getenv("SCRAPER_PATH")
```

## Crawling guide

### Check the --help cli documentations
- Check --help with `poetry run python src/cli.py --help`  to see the cli documentations. 

```bash
$ poetry run python src/cli.py --help
usage: cli.py [-h] [--start START] [--end END] [--img IMG] [--only-img ONLY_IMG] [--url URL] [--custom-file CUSTOM_FILE] [--active-age ACTIVE_AGE] [--sold-age SOLD_AGE] [--debug DEBUG] page property_status

A crawler of Zealty.ca

positional arguments:
  page                  The PAGE of the Zealty URL to be crawled. Available choices: 'search' or 'detail'
  property_status       The STATUS of the PROPERTY to be searched. Available choices: 'active', 'sold', 'expired'

optional arguments:
  -h, --help            show this help message and exit
  --start START, -s START
                        The first page number to be crawled. If not set, default value is 1.
  --end END, -e END     The last page number to be crawled. If not set, default value is 10.
  --img IMG, -i IMG     For `detail` Page only. The option to download the image of each property. Available choices: 'yes' or 'no'. If not set, default value is 'no'.
  --only-img ONLY_IMG, -o ONLY_IMG
                        For `detail` Page only. The option to download just the image of each property, not the details. Available choices: 'yes' or 'no'. If not set, default value is 'no'.
  --url URL, -u URL     For `detail` Page only. The option to crawl the details of single url. If not set, default value is empty string ('').
  --custom-file CUSTOM_FILE, -cf CUSTOM_FILE
                        For `detail` Page only. The option to crawl the details of single custom file. The base directory is the project directory root. Example format: - 'my_custom_file.csv' -> in root project directory. -
                        'temp/my_custom_file.csv' -> in root/temp/ project directory. - 'src/my_custom_file.csv' -> in root/src/ project directory. If not set, default value is empty string ('').
  --active-age ACTIVE_AGE, -aa ACTIVE_AGE
                        For `search` Page and 'active' status only. The option to crawl by active age on the listing. Available choices: - "today" - "today & yesterday" - "last 7 days" - "last 14 days" - "yesterday" - "this month" - "last      
                        month" - "this year" - "last year" - "15+ days" - "30+ days" - "60+ days" - "90+ days" - "120+ days" - "180+ days" . If not set, default value is empty string ('').
  --sold-age SOLD_AGE, -sa SOLD_AGE
                        For `search` Page and 'sold'/'expired' status only. The option to crawl by sold age on the listing. Available choices: - "today" - "yesterday" - "last 7 days" - "last 14 days" - "last 30 days" - "last 60 days" - "last   
                        90 days" - "last 6 months" - "last 12 months" - "last 24 months" - "last 36 months" - "yesterday" - "this month" - "last month" - "this year" - "last year" . If not set, default value is empty string ('').
  --debug DEBUG, -d DEBUG
                        The option for testing purpose. Available choices: 'yes' or 'no'. If not set, default value is 'no'.
```

### Start your crawler
- Run script with `poetry run python src/cli.py <page> <property_status> --start <start_page> --end <end_page>`
- example: to crawl `search` page, for `active` property, from page `5` to `10`.
```bash
$ poetry run python src/cli.py search active --start 5 --end 10
```
- get `detail` page with image
```bash
$ poetry run python src/cli.py detail active --start 5 --end 10 --img yes
```
- get `detail` for image only
```bash
$ poetry run python src/cli.py detail active --start 5 --end 10 --only-img yes
```

### Results
- The csv file would be generated in `temp/<property_status>/csv/<page>_<property_status>_<start_page>_<end_page>.csv`


### Notes:
- `property_status`: 'active', 'sold', 'expired'.
- `page`: 'search' or 'detail'.
- `start_page`: number of the initial page to be crawl.
- `end_page`: number of the final page to be crawl.

#### Sorting Rule on the `search` page:
1. `active` sorted by `Days on Market (low to high)`
2. `sold` sorted by `Sale Date (recent first)`
3. `expired` sorted by `Off Market Date (recent first)`


## Features
- Crawl multiple property on `search` page.
  - Result on crawl the `search` page: csv file with 152 column details.

- Crawl additional information about the property on `detail` page: 
  - List of nearby schools, 
  - List of building permits, 
  - List of assessment detail.
  - Result on crawl the `detail` page: csv file with 152 + 3 column details.
  - Only property with status `active` will be crawl for `detail` page.

- New Features:
  - 
  - Crawl the details from custom csv file. 
    - The custom csv file format must follow the `search` page result csv format.
    - use `-cf` option then followed by file location path inside root project folder.
    - Example:
      - `poetry run python src/cli.py detail active -cf 'my_custom_file.csv'` -> in root project directory.
      - `poetry run python src/cli.py detail sold -cf 'temp/my_custom_file.csv'` -> in root/temp/ project directory.
      - `poetry run python src/cli.py detail expired -cf 'src/my_custom_file.csv'` -> in root/src/ project directory.

  - Crawl by property age.
    
    - active-age for active property status.
      
      - `-aa` option, then followed by choices (select one). listed at:
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
      
      - Example:
        - `poetry run python src/cli.py search active -s 1 -e 5 -aa "today & yesterday"`
        - `poetry run python src/cli.py search active -s 1 -e 5 -aa "120+ days"`
    
    - sold-age for sold and expired property status.
      
      - `-sa` option, then followed by choices (select one), sold at:
        - "today"
        - "today & yesterday"
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
      
      - Example:
        - `poetry run python src/cli.py search sold -s 1 -e 5 -sa "yesterday"`
        - `poetry run python src/cli.py search expired -s 1 -e 5 -sa "last 24 months"`