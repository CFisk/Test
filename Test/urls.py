from django.conf.urls import patterns, include, url
from django.contrib import admin

from ProjectX import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'Test.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^main/', views.main, name='main'),
    url(r'^upgrades/', views.upgrades, name='upgrades')
)
