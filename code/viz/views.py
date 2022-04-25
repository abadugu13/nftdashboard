from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

def index(request):
    context = {
        'title': 'NFT Collections - Visualization of trends',
        "collections":[
            {"name":"Alien Worlds", "id": "alienworlds"},
            {"name":"Axie NFT", "id": "axie"},
            {"name": "CryptoKitties", "id": "cryptokitties"},
            {"name": "CryptoPunks", "id": "cryptopunks"},
            {"name": "Cryptovoxels", "id": "cryptovoxels"},
            {"name":"Decentraland", "id": "decentraland"},
            {"name":"Hashmasks", "id": "hashmasks"},
            {"name":"Rarible", "id": "rarible"},
            # {"name":"Sorare", "id": "sorare"}
            # {"name": "CyberKongz", "id": "cyberkongz"},
            # {"name": "Azuki", "id": "azuki"},

        ]
    }
    return render(request, 'index.html', context)