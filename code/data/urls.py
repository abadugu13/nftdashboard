from django.urls import path
from . import views

urlpatterns = [
    path('get_all/<value>', views.get_all_data, name='data'),
]