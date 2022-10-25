import json
import time
import datetime
import asyncio
import aiofiles

from core.config import BaseConfig

async def session_checker():
    try :
        async with aiofiles.open("{}/temp/cookie_state.json".format(BaseConfig.BASE_DIR), "r") as f:
            cookie_state = await f.read()
            f.close()
        cookie_state_json = json.loads(cookie_state)
        this_time =  datetime.datetime.now()
        unix_this_time =  time.mktime(this_time.timetuple())

        print("Current Timestamp :",unix_this_time)
        print("Cookie Expired Time :",cookie_state_json["cookies"][0]["expires"])

        if unix_this_time <= cookie_state_json["cookies"][0]["expires"]:
            print("STATUS = Still login")
        else:
            print("STATUS = Session expired!! Must login again!!")
    except:
        print("cookie_state.json is not available in {}".format(os.path.join(BaseConfig.BASE_DIR,"temp")))
        print("Please login to genereate cookie_state.json!!!")

if __name__ == "__main__":
    asyncio.run(session_checker())