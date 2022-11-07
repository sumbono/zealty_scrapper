# Zealty Scraper Script

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

## Install dependencies 
```bash
$ cd zealty_scraper
$ poetry install
$ poetry run playwright install
```

## Crawling guide

### Check the --help cli documentations
- Check --help with `poetry run python src/cli.py --help`  to see the cli documentations. 

```bash
$ poetry run python src/cli.py --help
usage: cli.py [-h] [--start START] [--end END] [--img IMG] [--only-img ONLY_IMG] [--debug DEBUG] page property_status

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
  --debug DEBUG, -d DEBUG
                        The option for testing purpose. Available choices: 'yes' or 'no'. If not set, default value is 'no'.
```

### Start your crawler
- Run script with `poetry run python src/cli.py <page> <property_status> --start <start_page> --end <end_page>`
- example: to crawl `search` page, for `active` property, from page `5` to `10`.
```bash
$ poetry run python src/cli.py search active --start 5 --end 10
```

### Results
- The csv file would be generated in `temp/<page>/<property_status>_<start_page>_<end_page>.csv`


### Notes:
- `property_status`: 'active', 'sold', 'expired'.
- `page`: 'search' or 'detail'.
- `start_page`: number of the initial page to be crawl.
- `end_page`: number of the final page to be crawl.