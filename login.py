from playwright.async_api import async_playwright
import time
import asyncio
# login_url = "https://www.bccondosandhomes.com/login"
login_url = "https://www.zealty.ca/search.html"

login = "lunatictina1@outlook.com"
password = "!$K$cmkkT6YjMw2"

async def email_login():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        # Create a new context with the saved storage state.
        context = await browser.new_context()
        page =  await context.new_page()
        print("Go to login page")
        print()
        await page.goto(url=login_url, wait_until="networkidle")
        # print("Please wait for 5s!")
        # print()
        # time.sleep(5)
        print("Finding and opening log in button")
        await page.wait_for_selector("#logButton")
        await page.locator("#logButton").click()
        # print("Please wait for 2s!")
        # print()
        # time.sleep(2)
        print("Typing email ...")
        # page.locator("#loginForm > input[type=text]:nth-child(6)").click()
        await page.wait_for_selector('#loginForm > input[type=text]:nth-child(6)')#.is_visible()
        await page.fill('#loginForm > input[type=text]:nth-child(6)', login)
        # page.click('#firebaseui-auth-container > div > form > div.firebaseui-card-actions > div > button.firebaseui-id-submit.firebaseui-button.mdl-button.mdl-js-button.mdl-button--raised.mdl-button--colored')
        print("Typing Password ...")
        await page.wait_for_selector('#loginForm > input[type=password]:nth-child(9)')#.is_visible()
        await page.fill('#loginForm > input[type=password]:nth-child(9)', password)
        # page.wait_for_selector("#firebaseui-auth-container > div > form > div.firebaseui-card-actions > div.firebaseui-form-actions > button").is_visible()
        print("Click login button")
        print()
        await page.click('#loginForm > div:nth-child(13) > button:nth-child(2)')

        await page.wait_for_timeout(5000)
        await context.storage_state(path="cookie_state.json")

        await context.close()
        await browser.close()

if __name__ == "__main__":
    asyncio.run(email_login())