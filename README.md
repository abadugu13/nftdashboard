# NFT DashBoard Description
First of a kind holistic interactive dashboard for evaluation of NFT Collections that visualizes trends and predictions of the NFT market. In particular, the dashboard would present analysis regarding 
- The sales volume, 
- buyer-seller networks, 
- online sentiment, 
- trends anomalies, and 
- content
pricing of several NFT collections

## Frontend
Built on *d3.js* <br>
Majority of code present in `viz/templates/index.html` and `viz/static/js/viz.js`
## Backend
Built using Django
## APIs
Building only simple GET requests
Sample Code For API is written in `data/views.py` with its url code mentioned in `data/urls.py`.
# Installation & Execution
```
cd code
conda create -n nft_project python=3.8
conda activate nft_project
pip install -r requirements.txt
python manage.py runserver
```
Navigate to http://127.0.0.1:8000/viz/ to check the vizualization

# Dashboard Snapshot

![Alt text](images/page_capture_final.png?raw=true "Title")
