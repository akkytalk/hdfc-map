import axios from "axios";
import MapComponent from "../MapComponent";

export async function getCoordinates(address) {
	const result = await axios.get(
		"https://maps.googleapis.com/maps/api/geocode/json?address=" +
			address +
			"&key=" +
			process.env.API_KEY
	);

	const { lat, lng } = result.data.results.geometry.location;
	return { lat, lng };
	// .then((response) => response.json())
	// .then((data) => {
	// 	const latitude = data.results.geometry.location.lat;
	// 	const longitude = data.results.geometry.location.lng;
	// 	console.log({ latitude, longitude });
	// });
}
