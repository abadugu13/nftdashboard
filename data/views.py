from django.shortcuts import render
from django.http import JsonResponse
import numpy as np
# Create your views here.

def gen_radom_time_series(cols, start, end):
    N = 10
    rng = pd.date_range(start=start, end=end, periods=N)
    df = pd.DataFrame(np.random.rand(N, 3), columns=cols, index=rng)
    return df



def get_all_data(request, value):
    print(value)
    data = {
        "price_data":[
            {"date": "2019-01-01", "price": 100},
            {"date": "2019-01-02", "price": 500},
            {"date": "2019-01-03", "price": 200},
            {"date": "2019-01-04", "price": 300},
            {"date": "2019-01-05", "price": 100},
            {"date": "2019-01-06", "price": 345},
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
        "sentiment_data":[
            {"sentiment":-0.2, "date":"2019-01-01", "volume":150},
            {"sentiment":-0.1, "date":"2019-01-02", "volume":210},
            {"sentiment":0.19, "date":"2019-01-03", "volume":200},
            {"sentiment":-0.9, "date":"2019-01-04", "volume":800},
            {"sentiment":0.90, "date":"2019-01-05", "volume":300},
        ],
        "word_cloud_data":{},
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
