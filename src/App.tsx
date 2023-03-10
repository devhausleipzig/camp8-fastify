import { useState, useEffect } from "react";
import axios from "axios";
import reactLogo from "./assets/react.svg";

function App() {
	const [pokemonNames, setPokemonNames] = useState([] as Array<any>);

	async function getPokemonNames() {
		const response = await axios.get("http://127.0.0.1:3000/pokemon/query");
		console.log(response);
		setPokemonNames(response.data);
	}

	useEffect(() => {
		getPokemonNames();
	}, []);

	return (
		<div className="flex justify-center h-screen">
			<div className="flex flex-col justify-between h-full">
				<div className="w-[800px] h-[450px] pl-50px bg-[url('https://shots.codepen.io/Negor/pen/JEXmMJ-800.jpg?version=1488491989')] bg-contain bg-no-repeat">
					{pokemonNames ? pokemonNames : <div>Loading...</div>}
				</div>
			</div>
		</div>
	);
}

export default App;
