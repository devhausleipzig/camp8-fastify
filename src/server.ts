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
fastify.get("/pokemon", async (request, reply) => {
	return exampleDB.pokemon;
});

fastify.post("/pokemon", async (request, reply) => {
	const pokemon = request.body;

	//@ts-ignore
	exampleDB.pokemon.push(pokemon);
});

type Pokemon = {
	name: string;
	hp: number;
	attribute1: string;
	attribute2: string;
};

fastify.put("/pokemon/:name", async (request, reply) => {
	//@ts-ignore
	const { name } = request.params;
	console.log(name);
	const newPokemon = request.body as Pokemon;

	const pokemon = exampleDB.pokemon.find((pokemon) => {
		return pokemon.name == name;
	});

	if (!pokemon) {
		reply.status(404);
		reply.send(`Could not find any pokemon called ${name}.`);
		return;
	}

	const list = exampleDB.pokemon.filter((pokemon) => {
		return !(pokemon.name == name);
	});

	list.push({
		...newPokemon,
		name: name
	});

	exampleDB.pokemon = list;

	reply.status(200);
});

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
