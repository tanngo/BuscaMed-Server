"""buscaMedServer URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
	https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
	1. Add an import:  from my_app import views
	2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
	1. Add an import:  from other_app.views import Home
	2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
	1. Import the include() function: from django.urls import include, path
	2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls import include, url
from django.urls import  path

from stores.views import HomeView


urlpatterns = [
	path('', HomeView.as_view(), name='home'), # URL DEL HOMEPAGE
	url(r'^rest/', include('rest.urls')), # URLS DEL API REST
	url(r'^stores/', include('stores.urls')), # URLS DE LA APP DE TIENDAS
	url(r'admin/', admin.site.urls), # URLS ADMINISTRATIVAS
]
