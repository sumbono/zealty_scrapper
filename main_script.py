import sys, os

from modules.scrape_nearby_school import scrape_nearby_school

for dir_item in os.listdir(os.path.abspath(os.path.join('.'))):
    sys.path.append(dir_item)

from core.config import *
from modules.cookie_checker import session_checker

table = """
<table class="stripedTable" style="font-size: 12pt; width: 100%;">
    <tbody>
        <tr onmouseover="doMouseOverLoc(49.27460, -123.23704); abortEvent(event);">
            <td style="text-align: center; font-weight: bold;"><span class="circled"></span></td>
            <td>University Hill Elementary<br>ELEMENTARY</td>
            <td>5395 Chancellor Blvd<br><span style="font-weight: bold;">1.2 km</span> • Public • SD 39</td>
            <td style="white-space: nowrap; text-align: right;"><i class="fa-solid fa-phone"></i>&nbsp;<a
                    href="tel:"></a></td>
        </tr>
        <tr onmouseover="doMouseOverLoc(49.26808, -123.20511); abortEvent(event);">
            <td style="text-align: center; font-weight: bold;"><span class="circled"></span></td>
            <td>Queen Mary Elementary<br>ELEMENTARY</td>
            <td>2000 Trimble St<br><span style="font-weight: bold;">1.4 km</span> • Public • SD 39</td>
            <td style="white-space: nowrap; text-align: right;"><i class="fa-solid fa-phone"></i>&nbsp;<a
                    href="tel:"></a></td>
        </tr>
        <tr onmouseover="doMouseOverLoc(49.26186, -123.23242); abortEvent(event);">
            <td style="text-align: center; font-weight: bold;"><span class="circled"></span></td>
            <td>Norma Rose Point Elementary Junior<br>ELEMENTARY</td>
            <td>5488 Ortona Ave<br><span style="font-weight: bold;">1.7 km</span> • Public • SD 39</td>
            <td style="white-space: nowrap; text-align: right;"><i class="fa-solid fa-phone"></i>&nbsp;<a
                    href="tel:"></a></td>
        </tr>
        <tr onmouseover="doMouseOverLoc(49.26659, -123.20030); abortEvent(event);">
            <td style="text-align: center; font-weight: bold;"><span class="circled"></span></td>
            <td>West Point Grey Academy<br>ELEMENTARY SECONDARY</td>
            <td>4125 West 8th Avenue<br><span style="font-weight: bold;">1.8 km</span> • Independent • SD 39</td>
            <td style="white-space: nowrap; text-align: right;"><i class="fa-solid fa-phone"></i>&nbsp;<a
                    href="tel:"></a></td>
        </tr>
        <tr onmouseover="doMouseOverLoc(49.26756, -123.19902); abortEvent(event);">
            <td style="text-align: center; font-weight: bold;"><span class="circled"></span></td>
            <td>SelfDesign Learning Community (DL)<br>ELEMENTARY SECONDARY</td>
            <td>4196 4TH AVE W<br><span style="font-weight: bold;">1.8 km</span> • Independent • SD 39</td>
            <td style="white-space: nowrap; text-align: right;"><i class="fa-solid fa-phone"></i>&nbsp;<a
                    href="tel:"></a></td>
        </tr>
        <tr onmouseover="doMouseOverLoc(49.26756, -123.19902); abortEvent(event);">
            <td style="text-align: center; font-weight: bold;"><span class="circled"></span></td>
            <td>Family Montessori School<br>ELEMENTARY</td>
            <td>4196 4th Ave W<br><span style="font-weight: bold;">1.8 km</span> • Independent • SD 39</td>
            <td style="white-space: nowrap; text-align: right;"><i class="fa-solid fa-phone"></i>&nbsp;<a
                    href="tel:"></a></td>
        </tr>
        <tr onmouseover="doMouseOverLoc(49.26756, -123.19902); abortEvent(event);">
            <td style="text-align: center; font-weight: bold;"><span class="circled"></span></td>
            <td>Pacific Spirit School<br>ELEMENTARY</td>
            <td>4196 4TH AVE W<br><span style="font-weight: bold;">1.8 km</span> • Independent • SD 39</td>
            <td style="white-space: nowrap; text-align: right;"><i class="fa-solid fa-phone"></i>&nbsp;<a
                    href="tel:"></a></td>
        </tr>
        <tr onmouseover="doMouseOverLoc(49.26587, -123.24341); abortEvent(event);">
            <td style="text-align: center; font-weight: bold;"><span class="circled"></span></td>
            <td>Eaton Arrowsmith School (Vancouver) Ltd<br>ELEMENTARY SECONDARY</td>
            <td>213-2150 Western Parkway<br><span style="font-weight: bold;">1.9 km</span> • Independent • SD 39</td>
            <td style="white-space: nowrap; text-align: right;"><i class="fa-solid fa-phone"></i>&nbsp;<a
                    href="tel:"></a></td>
        </tr>
        <tr onmouseover="doMouseOverLoc(49.26409, -123.19640); abortEvent(event);">
            <td style="text-align: center; font-weight: bold;"><span class="circled"></span></td>
            <td>Our Lady of Perpetual Help<br>ELEMENTARY</td>
            <td>2550 Camosun St<br><span style="font-weight: bold;">2.2 km</span> • Independent • SD 39</td>
            <td style="white-space: nowrap; text-align: right;"><i class="fa-solid fa-phone"></i>&nbsp;<a
                    href="tel:"></a></td>
        </tr>
        <tr onmouseover="doMouseOverLoc(49.25761, -123.19747); abortEvent(event);">
            <td style="text-align: center; font-weight: bold;"><span class="circled"></span></td>
            <td>Queen Elizabeth Elementary<br>ELEMENTARY</td>
            <td>4102 16th Ave W<br><span style="font-weight: bold;">2.6 km</span> • Public • SD 39</td>
            <td style="white-space: nowrap; text-align: right;"><i class="fa-solid fa-phone"></i>&nbsp;<a
                    href="tel:"></a></td>
        </tr>
    </tbody>
</table>
"""

if __name__ == "__main__":
    import asyncio
    asyncio.run(session_checker())
    scrape_nearby_school(table)
    # print(BaseConfig.BASE_DIR)