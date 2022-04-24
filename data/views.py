from django.shortcuts import render
from django.http import JsonResponse
import numpy as np
import pandas as pd
import json
# Create your views here.

def gen_radom_time_series(cols, start, end):
    N = 10
    rng = pd.date_range(start=start, end=end, periods=N)
    df = pd.DataFrame(np.random.rand(N, 3), columns=cols, index=rng)
    return df

df_time_series = pd.read_csv("data/time_series_data/final_result.csv")
df_time_series["Collection"] = df_time_series["Collection"].str.lower()
df_time_series["prediction_flag"] = ~df_time_series["prediction"].isnull()
df_time_series["volume"] = df_time_series.apply(lambda row: row["prediction"] if row["prediction_flag"] else row["sales"], axis=1)

def get_all_data(request, value):
    print(value)
    sentiment_data_path = f'data/sentiment_data/final_vader_output_#{value}.json'
    with open(sentiment_data_path, 'r') as f:
        sentiment_data = json.load(f)
        sentiment_data = [{"date":x["dt"].split()[0], "volume":x["volume"], "sentiment":x["compound_score"]} for x in sentiment_data]
    
    time_series = df_time_series[df_time_series["Collection"] == value]
    print(time_series)
    time_series_data = [{"date":x["Datetime_updated"], "volume":x["volume"], "price":0, "prediction":x["prediction_flag"]} for x in time_series.to_dict(orient='records')]

    data = {
        "price_data": time_series_data,
        "feature_data":[
            {"feature": "feature1", "value": 0.5},
            {"feature": "feature2", "value": 0.9},
            {"feature": "feature3", "value": 0.1},
            {"feature": "feature4", "value": -0.2},
            {"feature": "feature5", "value": 0.57},
        ],
        "graph_data":[
                {"source": "feature1", "target": "feature2", "value": 500},
                {"source": "feature1", "target": "feature3", "value": 23},
                {"source": "feature1", "target": "feature4", "value": 134},
                {"source": "feature1", "target": "feature5", "value": 250},
                {"source": "feature2", "target": "feature3", "value": 523},
                {"source": "feature2", "target": "feature4", "value": 19},
                {"source": "feature2", "target": "feature5", "value": 250},
            ]
        ,
        "sentiment_data": sentiment_data,
        "word_cloud_data":[
            {"text":"word1", "frequency":100},
            {"text":"word2", "frequency":250},
            {"text":"word3", "frequency":123},
            {"text":"word4", "frequency":345},
        ],
        "anomaly_data":[
            {"date":"2019-01-01", "anomaly":0.1, "volume":100},
            {"date":"2019-01-02", "anomaly":0.2, "volume":200},
            {"date":"2019-01-03", "anomaly":0.75,   "volume":500},
            {"date":"2019-01-04", "anomaly":0.9, "volume":1800},
            {"date":"2019-01-05", "anomaly":0.8, "volume":900},
            {"date":"2019-01-06", "anomaly":0.2, "volume":100},

        ],
    }
    return JsonResponse(data)
