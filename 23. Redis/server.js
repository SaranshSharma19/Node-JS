const redis = require('redis');

const client = redis.createClient({
    host: 'localhost',
    port: 6379 
})
 
// event listener
client.on('error', (err) => {
    console.log('Redis client error occured!', err)
});

async function testRedisConnection(){
    try{
        await client.connect()
        console.log('Connected to redis');


        await client.set("name", "Saransh");
        const extractValue = await client.get("name");
        console.log(extractValue)

        const deleteCount = await client.del("name")
        console.log(deleteCount);

        const extractUpdatedValue = await client.get("name");
        console.log(extractUpdatedValue)

        await client.set("count", "100")
        const incrementCount = await client.incr("count")
        console.log(incrementCount)

        const decrementCount = await client.decr("count")
        const decrementCountTwoTimes = await client.decr("count")
        console.log(decrementCountTwoTimes)

    }catch(err){
        console.log(err)
    }
    finally{
        await client.quit()
    }
}

testRedisConnection()