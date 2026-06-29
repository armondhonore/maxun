# Maxun deploy — pinned build guidance

The root `Dockerfile` builds the Maxun **frontend** (Vite dev server) from
source and MUST NOT be regenerated. It exists specifically so the patched
`vite.config.js` is baked in:

- `server.host: true` — bind 0.0.0.0. The upstream config parses the bind host
  from `VITE_PUBLIC_URL`, which pins Vite to a non-local hostname and makes the
  pod unreachable (502/503).
- `server.allowedHosts: true` — Vite 6 rejects the Nexlayer public Host header
  otherwise ("host not allowed").

The `app` pod image MUST stay `maxun:latest` (basename = app name) so the
pipeline substitutes the source-built image into that pod. If it is set to a
fully-qualified external image (e.g. `getmaxun/maxun-frontend:latest`) the
runner uses the prebuilt image instead and the vite.config.js patch never runs,
producing a 403 "host not allowed".

There is no single `maxun/maxun` image — that was the original failure (image
does not exist -> ImagePullBackOff -> 503). Maxun ships separate images:
`getmaxun/maxun-frontend`, `getmaxun/maxun-backend`, `getmaxun/maxun-browser`.
The frontend is built from source here; the backend uses the prebuilt image.
Do not regenerate the Dockerfile or collapse the pods into one.
