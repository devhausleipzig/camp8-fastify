import axios from "axios";
import { writeFileSync } from "fs";

async function generateDB() {
	const response = await axios.get(
		"https://pokeapi.co/api/v2/pokemon?limit=151&offset=0"
	);

	const pokemon = response.data.results;
	const list = [];

	for (const { name, url } of pokemon) {
		const response = await axios.get(url);
		list.push({ ...response.data, name });
	}

	writeFileSync("./db.json", JSON.stringify({ pokemon: list }));
}

generateDB();
