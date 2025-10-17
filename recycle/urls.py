from django.urls import path
from . import views

urlpatterns = [
    path('', views.main_page, name='main_page'),  # '' 요청 → main_page.html 렌더링
]