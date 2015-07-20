from django.shortcuts import render_to_response

# Create your views here.


def main(request):
    template = 'ProjectX/main.html'
    return render_to_response(template)

def upgrades(request):
    template = 'ProjectX/upgrades.html'
    return render_to_response(template)