from playwright.async_api import async_playwright

from core.config import BaseConfig
from modules.scrape_sold_history_table import scrape_sold_history
from modules.scrape_nearby_school import scrape_nearby_school
from modules.scrape_permits_table import scrape_permits_table
from modules.scrape_market_overview import scrape_market_overview
from modules.scrape_property_assesment import scrape_property_assesment

url_detail = "https://www.zealty.ca/mls-R2720295/4838-BELMONT-AVENUE-Vancouver-BC/"
async def process_table_detail(url_detail):
    async with async_playwright() as p:
        chromium = p.chromium
        browser = await chromium.launch(headless=True)
        context = await browser.new_context(storage_state="{}/temp/cookie_state.json".format(BaseConfig.BASE_DIR))
        page = await context.new_page()
        await page.goto(url_detail, wait_until="networkidle")

        # Sold History Table Section
        await page.wait_for_selector("#soldHistory > div > table")
        sold_history_table_selection = await page.query_selector("#soldHistory > div > table")
        sold_history_table_html = await sold_history_table_selection.inner_html()
        # Exporting Sold History Table to CSV
        scrape_sold_history(sold_history_table_html)

        # Nearby School Table Section
        await page.wait_for_selector("#schools > div > table")
        nearby_school_table_selection = await page.query_selector("#schools > div > table")
        nearby_school_table_html = await nearby_school_table_selection.inner_html()
        # Exporting Nearby School Table to CSV
        scrape_nearby_school(nearby_school_table_html)

        # Scrape Permits Table Section
        await page.wait_for_selector("#permits > table")
        permits_table_selection = await page.query_selector("#permits > table")
        permits_table_html = await permits_table_selection.inner_html()
        # Exporting Permits Table to XLSX
        scrape_permits_table(permits_table_html)

        # Market Overview Table Section
        await page.wait_for_selector("#statistics > div:nth-child(1) > div:nth-child(2) > table")
        await page.wait_for_selector("#statistics > div:nth-child(2) > div > table.stripedTable")
        market_overview_table_selection_active = await page.query_selector("#statistics > div:nth-child(1) > div:nth-child(2) > table")
        market_overview_table_selection_sold = await page.query_selector("#statistics > div:nth-child(2) > div > table.stripedTable")
        market_overview_table_html_active = await market_overview_table_selection_active.inner_html()
        market_overview_table_html_sold = await market_overview_table_selection_sold.inner_html()
        # Market Overview Table to CSV
        scrape_market_overview(table_html_active=market_overview_table_html_active,table_html_sold=market_overview_table_html_sold)

        # Scrape Permits Table Section
        await page.wait_for_selector("#permits > table")
        property_assesment_selection = await page.query_selector("#permits > table")
        property_assesment_table_html = await property_assesment_selection.inner_html()
        # Exporting Permits Table to XLSX
        scrape_property_assesment(property_assesment_table_html)

        await browser.close()
    
if __name__ == "__main__":
    import time
    import asyncio

    start_time = time.time()
    asyncio.run(process_table_detail(url_detail))
    print("--- %s seconds ---" % (time.time() - start_time))

   