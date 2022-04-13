from django.shortcuts import render
from django.http import JsonResponse
# Create your views here.


def get_all_data(request, value):
    print(value)
    data = {
        "price_data":{},
        "feature_attr_data":{},
        "graph_data":{},
        "sentiment_data":{},
        "word_cloud_data":{},
    }
    return JsonResponse(data)
