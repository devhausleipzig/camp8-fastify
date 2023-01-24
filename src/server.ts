import Fastify from "fastify";

// Require the framework and instantiate it
const fastify = Fastify({ logger: true });

const exampleDB = {
	pokemon: [
		{
			name: "Charmander",
			hp: 100,
			attribute1: "fire"
		}
	]
};

// Declare a route/endpoint
fastify.get("/pokemon", async (request, reply) => {});

fastify.post("/pokemon", async (request, reply) => {});

fastify.put("/pokemon", async (request, reply) => {});

fastify.patch("/pokemon", async (request, reply) => {});

fastify.delete("/pokemon", async (request, reply) => {});

// Run the server!
const start = async () => {
	try {
		await fastify.listen({ port: 3000 });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();
