import { validationResult } from "express-validator";
import { getAddressCoordinates, getDistanceAndTime, getAutoCompleteSuggestionservice } from "../services/mapService.js";

export const getCoordinates = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { address } = req.query;
    try {
        const coordinates = await getAddressCoordinates(address);
        res.status(200).json(coordinates)

    } catch (error) {
        res.status(404).json({ error: "Coordinates not found" })
    }
};

export const getDistanceTime = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { origin, destination } = req.query;

        const distanceTime = await getDistanceAndTime(origin, destination);

        res.status(200).json(distanceTime)

    } catch (error) {
        res.status(404).json({ error: "Distance and time not found" })
    }
};


export const getAutoCompleteSuggestions = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { input } = req.query;
        const suggestions = await getAutoCompleteSuggestionservice(input);

        res.status(200).json(suggestions)
    } catch (error) {
        res.status(404).json({ error: "Suggestions not found" })
    }
};