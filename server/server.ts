import Fastify from "fastify";
import { readFileSync, writeFileSync } from "fs";
import cors from "@fastify/cors";
import { models, Pokemon } from "./models";

export function readDB() {
	return JSON.parse(
		readFileSync("./db.json", {
			encoding: "utf8"
		})
	);
}

function writeDB(data: any) {
	writeFileSync("./db.json", JSON.stringify(data));
}

async function init() {
	// Instantiate Fastify
	const fastify = Fastify({ logger: true });

	// add CORS middleware
	fastify.register(cors, { origin: ["127.0.0.1"] });

	// Declare a route/endpoint
	fastify.get("/pokemon/query", async (request, reply) => {
		const pokemon = readDB().pokemon;

		return pokemon.map((pokemon: any) => {
			return pokemon.name;
		});
	});

	fastify.get("/pokemon", {}, async (request, reply) => {
		return readDB().pokemon;
	});

	fastify.post("/pokemon", async (request, reply) => {
		const pokemon = models.postPokemonModel.parse(request.body);

		const list: Pokemon[] = readDB().pokemon;
		list.push(pokemon);

		writeDB({ pokemon: list });
	});

	fastify.put("/pokemon/:name", async (request, reply) => {
		const { name } = models.namePathModel.parse(request.params);

		const newPokemon = models.putPokemonModel.parse(request.body);

		let list: Pokemon[] = readDB().pokemon;

		const pokemon = list.find((pokemon) => {
			return pokemon.name == name;
		});

		if (!pokemon) {
			reply.status(404);
			reply.send(`Could not find any pokemon called ${name}.`);
			return;
		}

		list = list.filter((pokemon) => {
			return !(pokemon.name == name);
		});

		list.push({
			...newPokemon,
			name: name
		});

		writeDB({ pokemon: list });

		reply.status(200);
	});

	fastify.patch("/pokemon/:name", async (request, reply) => {
		const { name } = models.namePathModel.parse(request.params);

		const updatedFields = models.patchPokemonModel.parse(request.body);

		let list: Pokemon[] = readDB().pokemon;

		const pokemon = list.find((pokemon) => {
			return pokemon.name == name;
		});

		if (!pokemon) {
			reply.status(404);
			reply.send(`Could not find any pokemon called ${name}.`);
			return;
		}

		list = list.filter((pokemon) => {
			return !(pokemon.name == name);
		});

		list.push({
			...pokemon,
			...updatedFields,
			name: name
		});

		writeDB(list);
	});

	fastify.delete("/pokemon/:name", async (request, reply) => {
		const { name } = models.namePathModel.parse(request.params);

		let list: Pokemon[] = readDB().pokemon;

		const pokemon = list.find((pokemon) => {
			return pokemon.name == name;
		});

		if (!pokemon) {
			reply.status(404);
			reply.send(`Could not find any pokemon called ${name}.`);
			return;
		}

		list = list.filter((pokemon) => {
			return !(pokemon.name == name);
		});

		writeDB(list);
	});

	// Run the server!
	await fastify.listen({ port: 3000, host: "127.0.0.1" });
}

try {
	init();
} catch (err) {
	console.log(err);
	process.exit(1);
}
