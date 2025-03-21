const cors = require('cors');

const configureCors = () => {
    return cors({
        // origin ->  this will tell which origin are allowed to access the API.
        origin : (origin, callback) => {
            const allowedOrigin = [
                'http://localhost:3001', // local dev 
                'https://yourcustomdomain.com', //production url

            ]
            if(!origin || allowedOrigin.indexOf(origin) !== -1){
                callback(null, true) // giving permission so that req can be allowed
            }
            else {
                callback(new Error('Not allowed by cors'))
            }

        },
        methods : ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders : [
            'Content-Type',
            'Authorization',
            'Accept-Version'
        ],
        exposedHeaders : [
            'X-Total-Count',
            'Content-Range'
        ],
        credentials : true, // this will enable support for cookies
        preflightContinue : false,
        maxAge: 600, // cache pre flight responses for 10 minutes (600 sec) -> avoid sending options request multiple time
        optionsSuccessStatus: 204
    })
}

module.exports = {configureCors}