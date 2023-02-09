import { z } from "zod";
import { readDB } from "./server";

const operators = ["gt", "lt", "eq"];

const queryPokemonModel = z.object({
	attribute: z.optional(z.string()),
	hp: z.optional(
		z.string().refine((val) => {
			return operators.reduce((accum, operator) => {
				return accum || val.startsWith(operator);
			}, false);
		})
	),
	prefix: z.optional(z.string())
});

export type Pokemon = {
	name: string;
	hp: number;
	attribute1: string;
	attribute2?: string;
};

const namePathModel = z.object({ name: z.string() });

const postPokemonModel = z.object({
	name: z.string().refine(
		async (val) => {
			return !Boolean(
				readDB().pokemon.find((pokemon: Pokemon) => pokemon.name == val)
			);
		},
		{ message: "Name already exists." }
	),
	hp: z.number(),
	attribute1: z.string(),
	attribute2: z.string()
});

const putPokemonModel = postPokemonModel;

const patchPokemonModel = putPokemonModel.partial();

export const models = {
	namePathModel,
	queryPokemonModel,
	postPokemonModel,
	putPokemonModel,
	patchPokemonModel
};

////////////////////
////////////////////

// Example Models

// const stringModel = z.string().min(10).max(20);

// const numberModel = z.number().gte(20).lte(100);

// const nullModel = z.null();

// const undefModel = z.undefined();

// const boolModel = z.boolean();

// export const arrayModel = z.array(z.string());

// export const objectModel = z
// 	.object({
// 		apples: z.optional(z.string()),
// 		pears: z.optional(z.number()),
// 		fruits: z.union([z.string(), z.number(), z.boolean()]) // fruits can be string or number or boolean
// 	})
// 	.refine(
// 		(val) => {
// 			return (
// 				(Boolean(val.apples) || Boolean(val.pears)) &&
// 				!(Boolean(val.apples) && Boolean(val.pears))
// 			);
// 		},
// 		{ message: "You must have either apples or pears but not both." }
// 	)
// 	.transform((val) => {
// 		if (val.pears) {
// 			val.apples = String(val.pears);
// 		}

// 		if (val.apples) {
// 			val.pears = val.apples.length;
// 		}

// 		return {
// 			...val,
// 			cherries: "123456"
// 		};
// 	});

// const example = objectModel.parse({
// 	apples: "green",
// 	fruits: false
// })!;

// const arrayOfObjectsModel = z.array(
// 	z.object({
// 		key1: z.number(),
// 		key2: z.boolean()
// 	})
// );
