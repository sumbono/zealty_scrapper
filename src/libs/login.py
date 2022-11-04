from playwright.async_api import Browser, Page

from config import BaseConfig

# login_url = "https://www.bccondosandhomes.com/login"
# login_url = "https://www.zealty.ca/search.html"

login = "lunatictina1@outlook.com"
password = "!$K$cmkkT6YjMw2"
# login = "samwiro2209@gmail.com"
# password = "wiro2209sam"

async def email_login(url:str, browser: Browser) -> Page:
    context = await browser.new_context()
    page =  await context.new_page()
    
    print("Go to login page")
    await page.goto(url=url, wait_until="networkidle")
    
    print("Finding and opening log in button")
    await page.wait_for_selector("#logButton")
    await page.locator("#logButton").click()
    
    print("Typing email ...")
    await page.wait_for_selector('#loginForm > input[type=text]:nth-child(6)')#.is_visible()
    await page.fill('#loginForm > input[type=text]:nth-child(6)', login)
    
    print("Typing Password ...")
    await page.wait_for_selector('#loginForm > input[type=password]:nth-child(9)')#.is_visible()
    await page.fill('#loginForm > input[type=password]:nth-child(9)', password)
    
    print("Click login button")
    await page.click('#loginForm > div:nth-child(13) > button:nth-child(2)')

    await page.wait_for_timeout(5000)
    
    await context.storage_state(path="{}/temp/cookie_state.json".format(BaseConfig.BASE_DIR))

    return page
