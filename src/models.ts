import { z } from "zod";

const stringModel = z.string().min(10).max(20);

const numberModel = z.number().gte(20).lte(100);

const nullModel = z.null();

const undefModel = z.undefined();

const boolModel = z.boolean();

const arrayModel = z.array(z.string());

const objectModel = z
	.object({
		apples: z.optional(z.string()),
		pears: z.optional(z.number()),
		fruits: z.union([z.string(), z.number(), z.boolean()]) // fruits can be string or number or boolean
	})
	.refine(
		(val) => {
			return (
				(Boolean(val.apples) || Boolean(val.pears)) &&
				!(Boolean(val.apples) && Boolean(val.pears))
			);
		},
		{ message: "You must have either apples or pears but not both." }
	)
	.transform((val) => {
		if (val.pears) {
			val.apples = String(val.pears);
		}

		if (val.apples) {
			val.pears = val.apples.length;
		}

		return {
			...val,
			cherries: "123456"
		};
	});

const example = objectModel.parse({
	apples: "green",
	fruits: false
})!;

const arrayOfObjectsModel = z.array(
	z.object({
		key1: z.number(),
		key2: z.boolean()
	})
);
