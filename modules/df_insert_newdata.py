import pandas as pd

def df_insert_newdata(df_path):
    try:
        df = pd.read_csv(df_path)
    except:
        df = pd.read_excel(df_path)

    