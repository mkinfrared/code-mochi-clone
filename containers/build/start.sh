#!/bin/ash

dotnet publish -c Release -r alpine-x64 -f netcoreapp3.0 -o ./deploy --self-contained true
