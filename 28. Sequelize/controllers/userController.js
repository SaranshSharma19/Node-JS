var db = require("../models/index.js");
const { Op, Sequelize, QueryTypes } = require("sequelize");
const User = db.user;
const Contact = db.contact;
const sequelize = db.sequelize;

var addUser = async (req, res) => {
    try {
        const userdata = req.body;
        if (userdata.length > 1) {
            var data = await User.bulkCreate(userdata)
            return res.status(200).json({
                success: true,
                message: "User saved successfully.",
                user: data,
            });
        }
        else {
            var data = await User.create(userdata)
            console.log("data", data)
            return res.status(200).json({
                success: true,
                message: "User saved successfully.",
                user: data,
            });
        }
        // const jane = await User.create({
        //     firstName,
        //     lastName,
        //     email
        // });

        // jane.set({
        //     firstName: "Saransh",
        //     lastName: "Sharma",
        //     email: "Saransh14@gmail.com"
        // })
        // jane.update({ firstName: "Saransh", lastName: "Sharma", email: "Saransh12@gmail.com" })
        // await jane.save()

        // res.status(200).json({
        //     success: true,
        //     message: "User saved successfully.",
        //     user: jane.toJSON(),
        // });
    } catch (error) {
        console.error("❌ Sequelize Error:", error); // 👈 log full error object
        res.status(500).json({
            success: false,
            message: "Failed to save user.",
            error: error.message,
        });
    }
};

var getUser = async (req, res) => {
    try {
        const data = await User.findAll({});

        res.status(200).json({
            success: true,
            message: "User Fetched successfully.",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to save user.",
            error: error.message,
        });
    }
};

var getUserById = async (req, res) => {
    try {
        const data = await User.findOne({
            where: { id: req.params.id }
        });

        res.status(200).json({
            success: true,
            message: "User Fetched successfully.",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to save user.",
            error: error.message,
        });
    }
};

var deleteUser = async (req, res) => {
    try {
        const data = await User.destroy({
            where: { id: req.params.id }
        });

        res.status(200).json({
            success: true,
            message: "User Deleted Successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to save user.",
            error: error.message,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const updatedData = req.body;
        const data = await User.update(updatedData, {
            where: { id: req.params.id }
        });

        res.status(200).json({
            success: true,
            message: "User Updated Successfully.",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to Update user.",
            error: error.message,
        });
    }
}

const queryUser = async (req, res) => {
    try {
        // const data = await User.create({
        //     firstName: "Saransh",
        //     lastName: "Singh",
        //     email: "Saranshsharma@gmail.com"
        // }, { fields: ['firstName', 'email'] })

        // const data = await User.findAll({
        //     attributes: ['firstName', 'email'],
        // })

        // const data = await User.findAll({
        //     where: {
        //         id: {
        //             [Op.eq]: 17
        //         }
        //     }
        // })

        const data = await User.findAll({
            // // order: [['id', 'ASC']],
            // group: ['lastName', 'id']

            attributes: [
                'lastName',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'userCount']
            ],
            group: ['lastName']
        })
        res.status(200).json({
            success: true,
            message: "User Fetched successfully.",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to Update user.",
            error: error.message,
        });
    }
}

const getsetUser = async (req, res) => {
    try {
        // const data = await User.findAll({})
        // res.status(200).json({
        //     success: true,
        //     message: "User Fetched successfully.",
        //     data: data,
        // });

        const data = await User.create({
            firstName: "Saransh",
            lastName: "Singh",
            email: "abc@gmail.com"
        })
        res.status(200).json({
            success: true,
            message: "User Fetched successfully.",
            data: data,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to Update user.",
            error: error.message,
        });
    }
}

const rawQueries = async (req, res) => {
    try {
        const data = await sequelize.query('SELECT * FROM "Users"', {
            type: QueryTypes.SELECT,
            model: User,
            mapToModel: true 
        })
        res.status(200).json({
            success: true,
            message: "User Fetched successfully.",
            data: data,
        });
    }catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to execute query.",
            error: error.message,
        });
    }
}

const oneTOOne = async(req, res) => {
    try{
        // const data = await User.create({
        //     firstName: "Saksham",
        //     lastName: "Sharma",
        //     email: "abc@gmail.com"
        // })
        // if(data && data.id){
        //     await Contact.create({
        //         user_id: data.id,
        //         permanent_address: "Delhi",
        //         current_address: "Noida"

        //     })
        // }

        // const data = await User.findAll({
        //     include: [
        //         {
        //             model: Contact,
        //             as: 'contact',
        //             attributes: ['permanent_address', 'current_address']
        //         }
        //     ]
        // })


        const data = await Contact.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['firstName', 'lastName', 'email']
                }
            ]
        })
        res.status(200).json({
            success: true,
            message: "User One to One Created successfully.",
            data: data,
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to execute query.",
            error: error.message,
        });
    }
}

const oneTOMany = async(req, res) => {
    try{
        // const data = await Contact.findAll({
        //     include: [
        //         {
        //             model: User,
        //             as: 'user',
        //             attributes: ['firstName', 'lastName', 'email']
        //         }
        //     ]
        // })
        // const data = await Contact.create({
        //     user_id: 3,
        //     permanent_address: "Noida",
        //     current_address: "Ghaziabad"
        // })

         const data = await User.findAll({
            include: [
                {
                    model: Contact,
                    as: 'contact',
                    attributes: ['permanent_address', 'current_address']
                }
            ]
        })
        res.status(200).json({
            success: true,
            message: "User One to One Created successfully.",
            data: data,
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to execute query.",
            error: error.message,
        });
    }
}

const manyTOMany = async(req, res) => {
    try{

        const data = await User.create({
            firstName: "Tushar",
            lastName: "Sharma",
            email: "tushar@gmail.com"
        })
        if(data && data.id){
            await Contact.create({
                permanent_address: "Ghaziabad",
                current_address: "Noida"
            })
        }

        // const data = await Contact.findAll({
        //     include: [
        //         {
        //             model: User,
        //             attributes: ['firstName', 'lastName', 'email'],
        //         }
        //     ]
        // })

        // const data = await User.findAll({
        //     attributes: ['firstName', 'lastName', 'email'],
        //     include: [
        //         {
        //             model: Contact,
        //             attributes: ['permanent_address', 'current_address'],
        //         }
        //     ]
        // })
        res.status(200).json({
            success: true,
            message: "User One to One Created successfully.",
            data: data,
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to execute query.",
            error: error.message,
        });
    }
}

module.exports = { addUser, getUser, getUserById, deleteUser, updateUser, queryUser, getsetUser, rawQueries, oneTOOne, oneTOMany, manyTOMany };