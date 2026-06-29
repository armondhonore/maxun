# Maxun frontend (Vite dev server) built from source.
#
# Built here instead of using the prebuilt getmaxun/maxun-frontend image so the
# patched vite.config.js (server.host=true, allowedHosts=true) is baked in.
# Without that patch Vite 6 binds to the hostname parsed from VITE_PUBLIC_URL
# (unreachable -> 502/503) and rejects the Nexlayer public Host header.
# Serves the UI on :5173.
FROM node:18-alpine

WORKDIR /app

COPY package.frontend.json ./package.json
RUN npm install --legacy-peer-deps || npm install --legacy-peer-deps

COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.js ./
COPY tsconfig.json ./

EXPOSE 5173

CMD ["npm", "run", "client", "--", "--host", "--port", "5173"]
