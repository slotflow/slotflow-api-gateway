<div align="center">

# SlotFlow API Gateway

### One entry point. Multiple services.

A TypeScript and Express gateway for routing SlotFlow API traffic, validating access tokens, and proxying Socket.IO connections to backend services.

  <img src="https://img.shields.io/badge/status-source--documented-2ea44f?style=for-the-badge" alt="Status: source documented" />
  <img src="https://img.shields.io/badge/architecture-microservices-635bff?style=for-the-badge" alt="Microservice architecture" />
  <img src="https://img.shields.io/badge/runtime-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js runtime" />
  <img src="https://img.shields.io/badge/language-TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/deployment-not%20specified-lightgrey?style=for-the-badge" alt="Deployment platform not specified" />

---

### Live link & Repositories

  <a href="https://slotflow.online">
    <img src="https://img.shields.io/badge/Live_Application-SlotFlow-181717?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Application" />
  </a>
  <a href="https://github.com/slotflow">
    <img src="https://img.shields.io/badge/GitHub-SlotFlow-181717?style=for-the-badge&logo=github&logoColor=white" alt="SlotFlow GitHub" />
  </a>

### Technology Stack

<img src="https://img.shields.io/badge/Node.js-runtime-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
<img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/HTTP-Proxying-00599C?style=for-the-badge" alt="HTTP proxying" />
<img src="https://img.shields.io/badge/Socket.IO-WebSocket%20proxy-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO and WebSocket proxying" />
<img src="https://img.shields.io/badge/JWT-authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT authentication" />
<img src="https://img.shields.io/badge/CORS-configured-635bff?style=for-the-badge" alt="CORS" />
<img src="https://img.shields.io/badge/Upstash-Redis%20rate%20limits-00E9A3?style=for-the-badge&logo=upstash&logoColor=white" alt="Upstash Redis rate limits" />
<img src="https://img.shields.io/badge/OpenTelemetry-7B3FF2?style=for-the-badge&logo=opentelemetry&logoColor=white" alt="OpenTelemetry" />
<img src="https://img.shields.io/badge/Tempo-F46800?style=for-the-badge&logo=grafana&logoColor=white" alt="Grafana Tempo" />
<img src="https://img.shields.io/badge/Loki-F46800?style=for-the-badge&logo=grafana&logoColor=white" alt="Grafana Loki" />
<img src="https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white" alt="Prometheus" />
<img src="https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white" alt="Grafana" />
<img src="https://img.shields.io/badge/Winston-logging-231F20?style=for-the-badge" alt="Winston logging" />
<img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge" alt="Zod" />
<img src="https://img.shields.io/badge/Upstash-Redis-00E9A3?style=for-the-badge&logo=upstash&logoColor=white" alt="Upstash Redis" />
<img src="https://img.shields.io/badge/pnpm-10.28.1-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm 10.28.1" />
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
<img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white" alt="AWS" />
</div>

---

## Overview

The API Gateway is the client-facing entry point for SlotFlow's backend services. It accepts API requests under `/api`, applies gateway-level middleware, and forwards service-specific traffic to configured backend URLs. It also handles the `/socket.io` path for the realtime service.

The frontend can communicate with backend services through the gateway rather than addressing each service directly. The gateway verifies JWTs for protected API routes, propagates authenticated user details to downstream services in `x-user-*` headers, applies request limits, and routes realtime traffic separately from ordinary HTTP requests.

This repository implements routing and gateway middleware. Business logic, payment processing, realtime message handling, and notification delivery belong to downstream services and are not implemented here.

## Core Features

### HTTP Routing and Proxying

- Mounts versioned APIs under `/api/v1`.
- Rewrites gateway paths to downstream `/api/v1/...` paths.
- Routes core application APIs to the configured main backend, with separate targets for payment, notification, and realtime APIs.

### Socket.IO and WebSocket Proxying

- Proxies HTTP polling and WebSocket upgrade traffic matching `/socket.io` to the configured realtime service.
- Enables WebSocket proxying and performs token validation during WebSocket upgrades.

### Authentication and Access Boundaries

- Accepts a JWT from the `token` cookie, a `Bearer` authorization header, or a `token` query parameter.
- Verifies tokens with the configured `JWT_SECRET` and attaches the decoded user identity to the Express request.
- Leaves `/api/v1/auth` in front of the gateway authentication middleware so authentication endpoints can be proxied without an existing gateway-authenticated user.
- Checks cached block status for selected user-facing routes and rejects blocked accounts.
- Does not implement per-role authorization rules at the gateway; downstream services remain responsible for their own authorization and business rules.
- The Express Socket.IO route applies authentication and block-status middleware to HTTP polling requests.

### CORS, Cookies, and Request Handling

- Allows the configured frontend origin with credentials.
- Allows `GET`, `POST`, `PUT`, `DELETE`, and `PATCH`, and the configured request headers listed in the middleware.
- Parses cookies and trusts one proxy hop when determining the client IP used by rate limiting.
- Logs incoming HTTP method and path at debug level.

### Rate Limiting and Error Handling

- Applies a Redis-backed Upstash sliding-window limit of 100 requests per identifier per minute to `/api`.
- Applies a separate limit of 10 requests per identifier per minute to `/api/v1/auth`.
- Sends standard rate-limit headers and returns `429` when a limit is exceeded; if the rate-limit Redis check fails, returns `503`.
- Normalizes application errors into JSON responses and logs operational, named, and unexpected errors.
- Exposes `GET /` as a basic `{"status":"gateway online"}` response. This is a process-level response, not a downstream readiness check.

## Architecture

```mermaid
flowchart LR
    Client[SlotFlow Client]
    Gateway[API Gateway<br/>Express · JWT · CORS · Rate Limits]
    Main[Main Backend]
    Realtime[Realtime Service]
    Notify[Notification Service]
    Payment[Payment Service]
    Redis[(Upstash Redis)]
    OTel[OTLP Collector<br/>configured endpoint]

    Client -->|HTTP /api/v1/*| Gateway
    Client -->|Socket.IO /socket.io| Gateway
    Gateway -->|HTTP proxy| Main
    Gateway -->|HTTP proxy| Realtime
    Gateway -->|HTTP proxy| Notify
    Gateway -->|HTTP proxy| Payment
    Gateway -->|block status, engaged-slot keys| Redis
    Gateway -.->|traces, metrics, logs| OTel
```

The client sends ordinary API requests and Socket.IO traffic to the gateway. Express middleware handles CORS, cookies, rate limiting, and authentication before API routes are dispatched. HTTP proxy middleware rewrites selected paths and forwards requests to configured service URLs. The Socket.IO proxy handles polling and WebSocket upgrades separately.

Redis is used directly for cached account-block checks and engaged-slot key lookup. A Redis-backed Upstash rate limiter provides request limits. OpenTelemetry exporters are configured to send telemetry to OTLP endpoints supplied through the environment. The collector and backend services are external dependencies; this repository does not provision them.

Service targets are selected from environment variables; no dynamic service-discovery component is configured here. The gateway has no Kafka integration in its dependencies or source code.

### Realtime Routing

The gateway forwards paths containing `/socket.io` to the realtime service URL. This supports Socket.IO's HTTP polling handshake and WebSocket upgrades. The HTTP and WebSocket proxy paths use separate proxy callbacks; neither creates a separate public realtime host.

## Security and Middleware

### Implemented Protections

- **JWT verification:** Protected API routes verify a token against `JWT_SECRET`. Tokens may be supplied by cookie, bearer header, or query parameter.
- **Account block checks:** Selected routes compare the authenticated user against the cached `user:block-status:<userId>` value in Redis. A blocked account receives a forbidden response.
- **Rate limits:** API-wide and authentication limits use Upstash's Redis-backed sliding-window limiter. The global and auth limits are keyed by client IP in the current middleware order because the global limiter and auth limiter execute before route authentication.
- **CORS:** A single configured frontend origin is allowed with credentials; the allowed methods and headers are explicitly set in the Express app.
- **Proxy identity forwarding:** The gateway forwards identity values in `x-user-*` headers after token verification.
- **Cookie handling:** `cookie-parser` makes the `token` cookie available to the authentication middleware. No cookie attributes are set by this gateway.
- **Error responses:** Unexpected internal details are not included in ordinary production error responses. Stack traces are added only when `NODE_ENV` is `development`.

## Project Structure

```text
slotflow-api-gateway/
│
├── src/
    ├── app/
    ├── cache/
    ├── config/
    ├── express.d.ts
    ├── interfaces/
    ├── middleware/
    ├── observability/
    ├── proxy/
    ├── routes/
    ├── server.ts
    ├── services/
    ├── shared/
    └── slotChecker/
```

## Observability

- **Logging:** Winston writes to the console. In development it also writes JSON logs to `logs/combined.log` and `logs/error.log`; the directory is created by the logger when needed. The configured Winston OpenTelemetry transport exports log records.
- **Traces:** The OpenTelemetry Node SDK uses Node auto-instrumentations and exports traces over OTLP/gRPC.
- **Metrics:** Metrics are exported over OTLP/gRPC every 10 seconds by the configured periodic metric reader.
- **Logs:** OpenTelemetry logs are exported over OTLP/HTTP.
- **Resource attributes:** The service name comes from `SERVICE_NAME`; the resource also includes version `1.0.0` and a development/production environment attribute.
- **Health response:** `GET /` returns a simple gateway-online JSON response. It does not check Redis, exporters, or downstream services.
- **Shutdown:** `SIGINT` and `SIGTERM` initiate OpenTelemetry shutdown and then close the HTTP server.

The receiver endpoints and any collector, metrics backend, log backend, or trace backend are externally configured. This repository does not include their deployment or dashboard configuration.

## Related Repositories

Only repositories with verified GitHub URLs are linked below. The backend targets correspond to services configured by this gateway; the infrastructure repository is related context and is not provisioned by this project.

<div align="center">

[![SlotFlow Client](https://img.shields.io/badge/slotflow-slotflow--client-181717?style=for-the-badge&logo=github)](https://github.com/slotflow/slotflow-client)
[![Main Backend](https://img.shields.io/badge/slotflow-slotflow--backend--main-181717?style=for-the-badge&logo=github)](https://github.com/slotflow/slotflow-backend-main)
[![Realtime Service](https://img.shields.io/badge/slotflow-slotflow--socket-181717?style=for-the-badge&logo=github)](https://github.com/slotflow/slotflow-socket)
[![Payment Service](https://img.shields.io/badge/slotflow-slotflow--payment-181717?style=for-the-badge&logo=github)](https://github.com/slotflow/slotflow-payment)
[![Notification Service](https://img.shields.io/badge/slotflow-slotflow--notification-181717?style=for-the-badge&logo=github)](https://github.com/slotflow/slotflow-notification)
[![Infrastructure](https://img.shields.io/badge/slotflow-slotflow--infra-181717?style=for-the-badge&logo=github)](https://github.com/slotflow/slotflow-infra)

</div>

## Project Highlights

- Provides a single HTTP and Socket.IO entry point for SlotFlow backend services.
- Keeps routing targets configurable per environment rather than embedding service URLs in route definitions.
- Centralizes token verification, identity propagation, CORS, selected account-block checks, and Redis-backed rate limits.
- Supports HTTP proxying and Socket.IO polling/WebSocket upgrades while leaving business behavior in the owning services.
- Exports logs, traces, and metrics through OpenTelemetry without coupling the gateway to a specific telemetry backend.

## License

**Proprietary — All Rights Reserved**

Copyright © 2026 SlotFlow.

The SlotFlow source code and associated assets are proprietary and confidential
property of SlotFlow.

No permission is granted to any person or organization to:

- Use the software for personal, commercial, or production purposes
- Copy, reproduce, or redistribute the source code
- Modify, adapt, or create derivative works
- Sell, sublicense, lease, or otherwise commercialize the software
- Incorporate any portion of the software into another product or service
- Host or deploy the software without explicit written permission

Viewing the source code on GitHub does not grant any license or rights to use,
modify, distribute, or commercialize the software.

Any use beyond viewing the repository requires prior written permission from
SlotFlow.

All rights reserved.

---

<p align="center">
  <strong>SlotFlow API Gateway</strong>
  <br />
  One entry point. Multiple services.
</p>

<p align="center">
  Built with TypeScript, Express, and a microservice-oriented architecture.
</p>

<p align="center">
  <a href="https://github.com/slotflow/slotflow-api-gateway">GitHub Repository</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/slotflow/slotflow-client">SlotFlow Client</a>
</p>

<p align="center">
  © 2025 slotflow · MIT License
</p>

---
