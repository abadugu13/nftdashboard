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
        "graph_data":{},
        "sentiment_data":{},
        "word_cloud_data":{},
    }
    return JsonResponse(data)
