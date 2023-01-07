import glob
import pandas as pd

# use the glob module to find all CSV files in the data folder and its subdirectories
csv_files = glob.glob('data/**/*.csv', recursive=True)

# use a for loop to read each CSV file and store the data in a list of DataFrames
data_frames = []
for csv_file in csv_files:
    df = pd.read_csv(csv_file)
    data_frames.append(df)

# use the pandas concat() function to combine the data from the list of DataFrames
df = pd.concat(data_frames)

# use the DataFrame.drop_duplicates() method to remove duplicate rows based on the "MLS" column
df = df.drop_duplicates(subset=['MLS'])

# use the DataFrame.duplicated() method to check for duplicate rows in the DataFrame
duplicated_rows = df[df.duplicated()]

# use the DataFrame.shape attribute to get the number of rows in the DataFrame
n_duplicated = duplicated_rows.shape[0]
n_unique = df.shape[0]

# print the number of duplicated and unique rows in the DataFrame
print(f'Deleted {n_duplicated} duplicated rows')
print(f'Saved {n_unique} unique rows')