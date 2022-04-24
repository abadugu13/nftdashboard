from django.shortcuts import render
from django.http import JsonResponse
import numpy as np
import json
# Create your views here.

def gen_radom_time_series(cols, start, end):
    N = 10
    rng = pd.date_range(start=start, end=end, periods=N)
    df = pd.DataFrame(np.random.rand(N, 3), columns=cols, index=rng)
    return df



def get_all_data(request, value):
    print(value)
    sentiment_data_path = f'data/sentiment_data/final_vader_output_#{value}.json'
    with open(sentiment_data_path, 'r') as f:
        sentiment_data = json.load(f)
        sentiment_data = [{"date":x["dt"], "volume":x["volume"], "sentiment":x["compound_score"]} for x in sentiment_data]
    data = {
        "price_data":[
            {"date": "2019-01-01", "price": 100, "prediction": False, "volume": 100},
            {"date": "2019-01-02", "price": 500, "prediction": False, "volume": 240},
            {"date": "2019-01-03", "price": 200, "prediction": False, "volume": 300},
            {"date": "2019-01-04", "price": 300, "prediction": False, "volume": 40},
            {"date": "2019-01-05", "price": 100, "prediction": True, "volume": 500},
            {"date": "2019-01-06", "price": 345, "prediction": True, "volume": 700},
        ],
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
