from django.shortcuts import render
from django.http import JsonResponse
import numpy as np
import pandas as pd
import json

from pkg_resources import working_set
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
    time_series_data = [{"date":x["Datetime_updated"], "volume":x["volume"], "price":0, "prediction":x["prediction_flag"]} for x in time_series.to_dict(orient='records')]

    if value == 'cryptokitties':
        graph_df = pd.read_csv("data/graph_data/Cryptokittiesgraph_network.csv")
    elif value == 'decentraland':
        graph_df = pd.read_csv("data/graph_data/Decentralandgraph_network.csv")
    elif value == 'cyberkongz':
        graph_df = pd.read_csv("data/graph_data/Cyberkongzgraph_network.csv")
    elif value == 'cryptovoxels':
        graph_df = pd.read_csv("data/graph_data/Cryptovoxelsgraph_network.csv")
    elif value == 'cryptopunks':
        graph_df = pd.read_csv("data/graph_data/Cryptopunksgraph_network.csv")
    
    graph_data = [{"source":x["Seller_address"], "target":x["Buyer_address"],  "value":x["edge_value"]} for x in graph_df.to_dict(orient='records')]

    anomaly_data_path = f'data/anomaly_data/anomaly_{value}.csv'
    anomaly_data = pd.read_csv(anomaly_data_path)
    print(anomaly_data.head())
    anomaly_data = [{"date":x["date"], "volume":x["count"]} for x in anomaly_data.to_dict(orient='records')]
    print(anomaly_data[:10])
    
    word_cloud_path = f'data/wordcloud_data/#{value}_wordcloud.json'
    with open(word_cloud_path, 'r') as f:
        word_cloud_data = json.load(f)
        word_cloud_out = []
        for key, value in word_cloud_data.items():
            if key == "cryptokitties":
                print(key, value)
            word_cloud_out.append({"text":key, "frequency":value})
    data = {
        "price_data": time_series_data,
        "feature_data":[
            {"feature": "feature1", "value": 0.5},
            {"feature": "feature2", "value": 0.9},
            {"feature": "feature3", "value": 0.1},
            {"feature": "feature4", "value": -0.2},
            {"feature": "feature5", "value": 0.57},
        ],
        "graph_data":graph_data
        ,
        "sentiment_data": sentiment_data,
        "word_cloud_data":sorted(word_cloud_out, key=lambda x: x["frequency"], reverse=True)[:500],
        "anomaly_data":{"volumeData":time_series_data, "anomalyData":anomaly_data},
    }
    return JsonResponse(data)
