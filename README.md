# NFT DashBoard
Build a holistic analysis platform for popular NFT Collections

# Frontend
(will be) Built on *d3.js* and *chart.js*.<br>
Majority of code present in `viz/templates/index.html` and `viz/static/js/viz.js`
# Backend
Built using Django
## APIs
Building only simple GET requests
Sample Code For API is written in `data/views.py` with its url code mentioned in `data/urls.py`.
## Data Ingestion
??
# Installation & Running
```
conda create env -n nft_project python=3.8
conda activate nft_project
pip install -r requirements.txt
python manage.py runserver
```
Navigate to http://127.0.0.1:8000/viz/ to check the vizualization

# Current State

![Alt text](images/screenshot.jpeg?raw=true "Title")