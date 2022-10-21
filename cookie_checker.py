import json
import time
import datetime
import asyncio
import aiofiles

async def session_checker():
    async with aiofiles.open("cookie_state.json", "r") as f:
        cookie_state = await f.read()
        f.close()
    cookie_state_json = json.loads(cookie_state)
    this_time =  datetime.datetime.now()
    unix_this_time =  time.mktime(this_time.timetuple())
    print(cookie_state_json["cookies"][0]["expires"])
    print(unix_this_time)
    if unix_this_time <= cookie_state_json["cookies"][0]["expires"]:
        print("Still login")
    else:
        print("Session expired!! Must login!!")
    
    return ""

if __name__ == "__main__":
    asyncio.run(session_checker())