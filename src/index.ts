// Imports
import Fastify from "fastify";

// server instance
const fastify = Fastify({
    logger: true
})

fastify.get('/', async (request, reply) => {
    return { status: "ok" };
})

try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}