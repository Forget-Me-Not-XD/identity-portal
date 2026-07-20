// Imports
import Fastify from "fastify";
import fs from "node:fs";
import { TLSSocket } from "node:tls";

// files into var
const serverKey  = fs.readFileSync("certs/server.key");
const serverCert = fs.readFileSync("certs/server.crt");
const caCert     = fs.readFileSync("certs/ca.crt");

// server instance
const fastify = Fastify({
    logger: true,
    https: {
        key: serverKey,
        cert: serverCert,
        ca: caCert,
        requestCert: true,
        rejectUnauthorized: true,
    }
})

fastify.get('/', async (req, rep) => {
    const peerCert = (req.raw.socket as TLSSocket).getPeerCertificate();
    const subject = peerCert.subject;
    const serialNumber = peerCert.serialNumber;
    return { subject: subject, serialNumber: serialNumber };
})

try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}