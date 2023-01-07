import pandas as pd
import csv
import datetime
import time
import requests
import re
import os
from collections import defaultdict

directory = os.getenv("DIRECTORY")
log_folder = os.getenv("LOG_FOLDER")

def printlog(log):
    csv_log = open(directory + log_folder + 'log.csv', 'a', newline='')
    csv_writer = csv.writer(csv_log, delimiter=',')
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    csv_writer.writerow([timestamp, log])
    print(log)
    csv_log.close()

# connect to rest api https://raw.githubusercontent.com/bcgov/api-specs/master/geocoder/geocoder-combined.json
# query the api with addressString and save the json response to a column
# maximum 1000 queries per second based on API requirements
def get_address(address):
  max_queries_per_minute = 800
  delay_between_requests = 60 / max_queries_per_minute
  time.sleep(delay_between_requests)
  response = requests.get('https://geocoder.api.gov.bc.ca/addresses.json?addressString=' + address + '&maxResults=1')
  data = response.json()

  return data


def format_phone(phone):
    if pd.isnull(phone):
        return ''
    # Use regular expression to match and capture the three parts of the phone number
    phone = phone.lstrip("1")
    match = re.fullmatch(r'(\d{3})\D*(\d{3})\D*(\d{4})', phone)
    if match:
        # Remove phone number if the first three digits are "000"
        if match.group(1) == "000":
            return ""
        # Return the phone number in the desired format
        return f'({match.group(1)}) {match.group(2)}-{match.group(3)}'
    else:
        # Return the original phone number if it doesn't match the expected format
        return phone

def count_list(x):
    if isinstance(x, list):
        list_counts = {i:x.count(i) for i in x}
        sorted_list_counts = sorted(list_counts.items(), key=lambda x: x[1], reverse=True)
        return dict(sorted_list_counts)
    else:
        return {}

def count_sentences(description):
  # Check if the description is null
  if pd.isnull(description):
    return 0
  # Tokenize the description into sentences
  sentences = nltk.sent_tokenize(description)
  # Return the number of sentences
  return len(sentences)

def generate_top_words(df, column):
    # Extract the text from the specified column
    text = df.apply(lambda row: row[column], axis=1).tolist()
    text = list(map(str, text))
    text = ' '.join(text)
    words = text.split()
    words = [re.sub(r'[^a-zA-Z]', '', word) for word in words]
    words = [word for word in words if word]
    word_freqs = defaultdict(int)
    for word in words:
        word_freqs[word] += 1
    sorted_word_freqs = sorted(word_freqs.items(), key=lambda x: x[1], reverse=True)
    return sorted_word_freqs