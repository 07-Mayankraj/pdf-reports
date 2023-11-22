
FROM node:14-slim


WORKDIR /usr/scr/app
COPY package*.json index.js ./




RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN npm init -y &&  \
    npm i puppeteer \
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /usr/scr/app/pptruser/Downloads \
    && chown -R pptruser:pptruser /usr/scr/app/pptruser \
    && chown -R pptruser:pptruser /usr/scr/app/node_modules \
    && chown -R pptruser:pptruser /usr/scr/app/package.json \
    && chown -R pptruser:pptruser /usr/scr/app/package-lock.json

# Run everything after as non-privileged user.
USER pptruser

RUN npm install 


EXPOSE 4000
CMD [ "node","index.js" ]