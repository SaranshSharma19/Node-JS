import axios from "axios";
import captainModel from "../models/captainModel.js ";
import dotenv from "dotenv";
dotenv.config();

const ORS_API_KEY = process.env.ORS_API_KEY;

export const getAddressCoordinates = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    try {
        const response = await axios.get(url);

        if (response.data.length > 0) {
            const location = response.data[0];
            return {
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lon)
            };
        } else {
            throw new Error(`Failed to fetch coordinates for: ${address}`);
        }
    } catch (error) {
        throw error;
    }
}

export const getDistanceAndTime = async (originName, destinationName) => {
    try {
        const origin = await getAddressCoordinates(originName);
        const destination = await getAddressCoordinates(destinationName);

        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${origin.lng},${origin.lat}&end=${destination.lng},${destination.lat}`;

        const response = await axios.get(url);
        if (response) {
            const route = response.data.features[0].properties.summary;;
            return {
                origin: originName,
                destination: destinationName,
                distance_km: (route.distance / 1000).toFixed(2),
                duration_min: (route.duration / 60).toFixed(0),
                origin_coords: origin,
                destination_coords: destination
            };
        } else {
            throw new Error("Failed to fetch distance and time");
        }
    } catch (error) {
        throw error;
    }
}

export const getAutoCompleteSuggestionservice = async (input) => {
    try {

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&addressdetails=1&limit=5`;

        const response = await axios.get(url);

        if (response) {
            const suggestions = response.data.map((place) => ({
                display_name: place.display_name,
                lat: parseFloat(place.lat),
                lng: parseFloat(place.lon),
            }));

            return suggestions;
        } else {
            return "No suggestions found";
        }
    } catch (error) {
        return "Internal server error";
    }
};
