# identity-portal

A self-hosted identity portal that will sit in front of the apps I build for myself and my household. Devices sign in with client certificates (mutual TLS) issued by my own certificate authority, so a password alone isn't enough to get in.

> **Status:** early work in progress.

## What works so far

- A Fastify HTTPS server that only accepts clients presenting a certificate signed by the portal's CA, and reads the device's identity (subject and serial number) from it
- A PostgreSQL data model (Prisma) for users with roles, households and their members, and registered devices that can be revoked
- A TOTP secret field on users, ready for two-factor sign-in

## Planned

- Account registration and sign-in with TOTP two-factor
- Enrolling and revoking devices
- The dashboard itself: one place to reach all my self-hosted apps

## Tech

TypeScript, Node.js, Fastify, Prisma, PostgreSQL

## Running it locally

1. Start PostgreSQL:

   ```bash
   docker run -d --name identity-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres
   ```

2. Copy `.env.example` to `.env` and set `DATABASE_URL`, for example `postgresql://postgres:postgres@localhost:5432/postgres`.

3. Create a development CA, a server certificate and a device certificate in `certs/` (this folder is ignored by git):

   ```bash
   mkdir certs && cd certs
   openssl req -x509 -newkey rsa:2048 -nodes -keyout ca.key -out ca.crt -days 365 -subj "/CN=identity-portal dev CA"
   openssl req -newkey rsa:2048 -nodes -keyout server.key -out server.csr -subj "/CN=localhost"
   openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 365 -extfile <(printf "subjectAltName=DNS:localhost")
   openssl req -newkey rsa:2048 -nodes -keyout client.key -out client.csr -subj "/CN=my-laptop"
   openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 365
   cd ..
   ```

4. Install, set up the database and start the server:

   ```bash
   npm install
   npx prisma migrate dev
   npx prisma generate
   npm run dev
   ```

5. Call it with the device certificate. The server answers with that device's identity:

   ```bash
   curl --cacert certs/ca.crt --cert certs/client.crt --key certs/client.key https://localhost:3000/
   ```

   A request without a valid client certificate is rejected.
