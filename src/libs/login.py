import os

from playwright.async_api import Browser, BrowserContext, Page
from typing import Tuple

from config import BaseConfig

login = os.getenv("login","lunatictina1@outlook.com")
password = os.getenv("password","!$K$cmkkT6YjMw2")

async def email_login(url:str, browser: Browser) -> Tuple[BrowserContext, Page]:
    context = await browser.new_context()
    page =  await context.new_page()
    await page.goto(url=url, wait_until="networkidle")
    await page.wait_for_selector("#logButton")
    await page.locator("#logButton").click()
    if "search.html" in url:
        await page.wait_for_selector('#loginForm > input[type=text]:nth-child(6)')#.is_visible()
        await page.fill('#loginForm > input[type=text]:nth-child(6)', login)
    else:
        await page.wait_for_selector('#uForm > input[type=text]:nth-child(7)')#.is_visible()
        await page.fill('#uForm > input[type=text]:nth-child(7)', login)
    if "search.html" in url:
        await page.wait_for_selector('#loginForm > input[type=password]:nth-child(9)')#.is_visible()
        await page.fill('#loginForm > input[type=password]:nth-child(9)', password)
    else:
        await page.wait_for_selector('#uForm > input[type=password]:nth-child(10)')#.is_visible()
        await page.fill('#uForm > input[type=password]:nth-child(10)', password)
    await page.evaluate(f"userLogin();")
    await page.wait_for_timeout(5000)
    await context.storage_state(path="{}/temp/cookie_state.json".format(BaseConfig.BASE_DIR))
    return context, page
