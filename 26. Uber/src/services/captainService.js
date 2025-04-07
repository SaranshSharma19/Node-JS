import captainModel from "../models/captainModel.js";

export const createCaptain = async ({ firstname, lastname, email, password, color, plate, vehicleType, capacity, status }) => {

    if (!firstname || !lastname || !email || !password || !color || !plate || !vehicleType || !capacity) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const captain = captainModel.create({
        fullname: {
            firstname,
            lastname,
        },
        email,
        password,
        vehicles: {
            color,
            plate,
            vehicleType,
            capacity,
        },
        status
    });
    return captain;
}