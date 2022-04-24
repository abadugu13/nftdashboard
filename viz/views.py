from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

def index(request):
    context = {
        'title': 'NFT Dashboard',
        "collections":[
            {"name": "CryptoKitties", "id": "cryptokitties"},
            {"name": "CryptoPunks", "id": "cryptopunks"},
            {"name": "Azuki", "id": "azuki"},
            {"name": "Cryptovoxels", "id": "cryptovoxels"},
            {"name": "CyberKongz", "id": "cyberkongz"},
            {"name":"Decentraland", "id": "decentraland"},
        ]
    }
    return render(request, 'index.html', context)