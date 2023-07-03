from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import logout
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializer import UserSerializer


@api_view(['GET'])
def index(request):
    user = {'username': 'John', 'password': 'Doe'}
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)

    if user is not None:
        # Authentication successful, generate JWT tokens
        refresh = RefreshToken.for_user(user)
        serializer = UserSerializer(user)

        # Return the tokens in the response
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': serializer.data

        })
    else:
        # Authentication failed
        return Response("Login failed")


@api_view(['POST'])
def logout(request):
    token = request.data.get('refresh_token')

    if token:
        try:
            # Invalidates the refresh token
            token_obj = RefreshToken(token)
            token_obj.blacklist()
        except Exception as e:
            # Handle any exceptions that may occur
            pass

    return Response("Logout successful")

# @api_view(['GET'])
# def test(request):
#     items = Item.objects.all()
#     serializer = ItemSerializer(items,many=true)
#     return Response(serializer.data)


# @api_view(['POST'])
# def login(request):
#     serializer = ItemSerializer(items,many=true)
#     if serializer.is_valid():
#         serializer.save
#     return Response(serializer.data)
