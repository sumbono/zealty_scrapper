import requests
import json
import pandas as pd

url = "https://bcrealestatemap.ca/svcFetchDB.php"

payload='sql=SELECT%20*%20FROM%20***%20WHERE%20((propertyClassCode%20%3D%200)%20OR%20(propertyClassCode%20%3D%201%20AND%20type%20%3D%20\'Apartment\')%20OR%20(propertyClassCode%20%3D%201%20AND%20type%20%3C%3E%20\'Apartment\')%20OR%20(propertyClassCode%20%3D%203)%20OR%20(propertyClassCode%20%3D%204)%20OR%20(propertyClassCode%20%3D%202))%20AND%20reciprocityOK%20%3D%200%20AND%20regionName%20IN%20(\'Sunshine%20Coast\'%2C\'Squamish\'%2C\'Whistler\'%2C\'Pemberton\'%2C\'Bowen%20Island\'%2C\'West%20Vancouver\'%2C\'North%20Vancouver\'%2C\'Vancouver%20West\'%2C\'Vancouver%20East\'%2C\'Burnaby%20East\'%2C\'Burnaby%20North\'%2C\'Burnaby%20South\'%2C\'New%20Westminster\'%2C\'Port%20Moody\'%2C\'Coquitlam\'%2C\'Port%20Coquitlam\'%2C\'Pitt%20Meadows\'%2C\'Maple%20Ridge\'%2C\'Richmond\'%2C\'Ladner\'%2C\'Tsawwassen\'%2C\'Islands-Van.%20%26%20Gulf\')%20ORDER%20BY%20listingPrice%20DESC%20LIMIT%2028%20OFFSET%200&sold=active&s=f91278919507969f23c135ebb73e830d'
headers = {
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Origin': 'https://www.zealty.ca',
  'Pragma': 'no-cache',
  'Referer': 'https://www.zealty.ca/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'cross-site',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
  'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"'
}

response = requests.request("POST", url, headers=headers, data=payload)

with open ("response.json", "w") as f:
  f.write(json.dumps(response.json()))
  f.close()

df = pd.DataFrame(response.json()["rows"])
df.to_csv("response.csv", index=False)