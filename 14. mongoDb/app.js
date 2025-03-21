const mongoose = require('mongoose');
mongoose.connect('******************************************************************').then(() => {
    console.log('database connected successfully')
}).catch(e => {
    console.log(e)
})

// creating schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    isActive: Boolean,
    tags: [String],
    createdAt: { type: Date, default: Date.now }
})

// create user model
const User = mongoose.model('User', userSchema);    // 'User' should be the name of collection as well in your database

async function runQueryExample() {
    try {

        // create a new document
        const newUser = await User.create({
            name: 'Deleted Sharma',
            email: 'Deleted@gmail.com',
            age: 75,
            isActive: true,
            tags: ['Birla Soft', 'Testing', 'Developer'],
        })

        // const newUser = new User({
        //     name: 'Shruti Sharma',
        //     email: 'shruti@gmail.com',
        //     age: 30,
        //     isActive: true,
        //     tags: ['Java Developer', 'Sopra Banking', 'Software Developers'],
        // })
        // await newUser.save()

        console.log('Created new user', newUser)

        const allUsers = await User.find({});
        console.log(`All User ${allUsers}`)

        const getInactiveUser = await User.find({
            isActive: false
        })

        console.log("get inactive user details", getInactiveUser)

        const getLastCreatedUserByUserId = await User.findById(newUser._id)
        console.log("getLastCreatedUserByUserId", getLastCreatedUserByUserId);

        const selectedFields = await User.find({}).select('name email -_id')
        console.log(`Selected Fields ${selectedFields}`)

        const limitedUsers = await User.find().limit(5).skip(2)
        console.log(`Limited Users ${limitedUsers}`)

        const sortedUsers = await User.find().sort({age:1}) 
        console.log(`Sorted Users ${sortedUsers}`)

        const countDocuments = await User.countDocuments({isActive: false});
        console.log(`countDocuments for active user ${countDocuments}`)

        // const deletedUser = await User.findByIdAndDelete(newUser._id)
        // console.log(`deleted user ${deletedUser}`);

        const updateUser = await User.findByIdAndUpdate(newUser._id, {
            $set :  {age: 98}, $push : {tags : 'Updated'}
        }, {new :  true})
        console.log(`updated User ${updateUser}`)

    } catch (e) {
        console.log(`Error: ${e}`)
    }
    finally {
        await mongoose.connection.close();
    }
}

runQueryExample()
