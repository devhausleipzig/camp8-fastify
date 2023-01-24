import Fastify from "fastify";
import { read, readFileSync, writeFileSync } from "fs";
import { arrayModel, objectModel } from "./models";

import { FastifyZod, buildJsonSchemas, register } from "fastify-zod";

const models = {
	objectModel,
	arrayModel
};

// Global augmentation, as suggested by
// https://www.fastify.io/docs/latest/Reference/TypeScript/#creating-a-typescript-fastify-plugin
declare module "fastify" {
	interface FastifyInstance {
		readonly zod: FastifyZod<typeof models>;
	}
}

async function init() {
	// Require the framework and instantiate it
	const fastify = await register(Fastify(), {
		jsonSchemas: buildJsonSchemas(models)
	});

	type Pokemon = {
		name: string;
		hp: number;
		attribute1: string;
		attribute2?: string;
	};

	function readDB() {
		return JSON.parse(
			readFileSync("./src/db.json", {
				encoding: "utf8"
			})
		);
	}

	function writeDB(data: any) {
		writeFileSync("./src/db.json", JSON.stringify(data));
	}

	// Declare a route/endpoint
	fastify.get("/pokemon/query", async (request, reply) => {
		//@ts-ignore
		const { attribute, hp, prefix } = request.query;
		console.log("query: ", attribute, hp, prefix);

		let list: Pokemon[] = readDB().pokemon;

		if (attribute) {
			list = list.filter((pokemon) => {
				return Boolean(
					[pokemon.attribute1, pokemon.attribute2].find((attr) => {
						return attr == attribute;
					})
				);
			});
		}

		if (hp) {
			if ((hp as string).startsWith("lt")) {
				const number = Number((hp as string).replace("lt", ""));

				list = list.filter((pokemon) => {
					return pokemon.hp < number;
				});
			} else if ((hp as string).startsWith("gt")) {
				const number = Number((hp as string).replace("gt", ""));

				list = list.filter((pokemon) => {
					return pokemon.hp > number;
				});
			} else if ((hp as string).startsWith("eq")) {
				const number = Number((hp as string).replace("eq", ""));

				list = list.filter((pokemon) => {
					return pokemon.hp == number;
				});
			} else {
				// nope
			}
		}

		if (prefix) {
			list = list.filter((pokemon) => {
				return pokemon.name
					.toLowerCase()
					.startsWith(prefix.toLowerCase());
			});
		}

		return list;
	});

	fastify.get("/pokemon", async (request, reply) => {
		return readDB().pokemon;
	});

	fastify.post("/pokemon", async (request, reply) => {
		const pokemon = request.body as Pokemon;

		//@ts-ignore
		const list: Pokemon[] = readDB().pokemon;
		list.push(pokemon);

		writeDB({ pokemon: list });
	});

	fastify.put("/pokemon/:name", async (request, reply) => {
		//@ts-ignore
		const { name } = request.params;
		console.log(name);
		const newPokemon = request.body as Pokemon;

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
		//@ts-ignore
		const { name } = request.params;
		console.log(name);
		const updatedFields = request.body as Pokemon;

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
		//@ts-ignore
		const { name } = request.params;

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
	try {
		await fastify.listen({ port: 3000 });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}

init();
