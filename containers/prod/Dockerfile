FROM mcr.microsoft.com/dotnet/core/sdk:3.0.100 AS DOTNET

# set up node
ENV NODE_VERSION 12.8.1
ENV NODE_DOWNLOAD_URL https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz
#ENV NODE_DOWNLOAD_SHA B8FF1DD80F370B137922A9DD2D8B04E16FD4F8681458F92C566E65E2E80724AD

RUN curl -SL "$NODE_DOWNLOAD_URL" --output nodejs.tar.gz \
#    && echo "$NODE_DOWNLOAD_SHA nodejs.tar.gz" | sha256sum -c - \
    && tar -xzf "nodejs.tar.gz" -C /usr/local --strip-components=1 \
    && rm nodejs.tar.gz \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs

# set up yarn
ENV YARN_VERSION 1.19.1

RUN set -ex \
  && wget -qO- https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --import \
  && curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
  && curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz.asc" \
  && gpg --batch --verify yarn-v$YARN_VERSION.tar.gz.asc yarn-v$YARN_VERSION.tar.gz \
  && mkdir -p /opt/yarn \
  && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/yarn --strip-components=1 \
  && ln -s /opt/yarn/bin/yarn /usr/local/bin/yarn \
  && ln -s /opt/yarn/bin/yarn /usr/local/bin/yarnpkg \
  && rm yarn-v$YARN_VERSION.tar.gz.asc yarn-v$YARN_VERSION.tar.gz

WORKDIR /app

COPY ./imovie/imovie.csproj .
COPY ./imovie/ClientApp/package.json ./ClientApp/
COPY ./imovie/ClientApp/lerna.json ./ClientApp/
COPY ./imovie/ClientApp/yarn.lock ./ClientApp/

RUN cd /app/ClientApp && yarn

COPY ./imovie/ClientApp/packages/app/package.json ./ClientApp/packages/app/
COPY ./imovie/ClientApp/packages/app/yarn.lock ./ClientApp/packages/app/
COPY ./imovie/ClientApp/packages/common/package.json ./ClientApp/packages/common/
COPY ./imovie/ClientApp/packages/common/yarn.lock ./ClientApp/packages/common/
COPY ./imovie/ClientApp/packages/web/package.json ./ClientApp/packages/web/
COPY ./imovie/ClientApp/packages/web/yarn.lock ./ClientApp/packages/web/

RUN cd /app/ClientApp && yarn bootstrap \
    && cd ../ && dotnet restore

COPY ./imovie/ .

RUN dotnet publish -c Release -r alpine-x64 -f netcoreapp3.0 -o ./deploy --self-contained true

# PRODUCTION READY
FROM alpine:3.10.2

COPY --from=DOTNET /app/deploy ./

RUN apk update && apk add libstdc++ && apk add libintl

CMD ["./imovie"]
