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

COPY ./imovie/imovie.csproj ./imovie/
COPY ./imovie/ClientApp/package.json ./imovie/ClientApp/
COPY ./imovie/ClientApp/lerna.json ./imovie/ClientApp/
COPY ./imovie/ClientApp/yarn.lock ./imovie/ClientApp/

RUN cd /app/imovie/ClientApp && yarn

COPY ./imovie/ClientApp/packages/app/package.json ./imovie/ClientApp/packages/app/
COPY ./imovie/ClientApp/packages/app/yarn.lock ./imovie/ClientApp/packages/app/
COPY ./imovie/ClientApp/packages/common/package.json ./imovie/ClientApp/packages/common/
COPY ./imovie/ClientApp/packages/common/yarn.lock ./imovie/ClientApp/packages/common/
COPY ./imovie/ClientApp/packages/web/package.json ./imovie/ClientApp/packages/web/
COPY ./imovie/ClientApp/packages/web/yarn.lock ./imovie/ClientApp/packages/web/

RUN cd /app/imovie/ClientApp && yarn bootstrap

COPY ./imovie/ ./imovie/
COPY ./imovieTest/ ./imovieTest/
COPY ./compose/test/start.sh .

CMD ["sh", "start.sh"]
