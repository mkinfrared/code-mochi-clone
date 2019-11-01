#!/bin/ash

cd /app/imovieTest/

dotnet restore && \
dotnet test --logger:trx
