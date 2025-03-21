const redis = require('redis');
const client = redis.createClient({
    host: 'localhost',
    port: 6379
})

// event listener
client.on('error', (err) => {
    console.log('Redis client error occured!', err)
});

async function testAdditionalFeatures() {
    try {
        await client.connect()
        // const subscriber = client.duplicate() // create a new client which will share the same connection
        // await subscriber.connect() // connect to the redic server for the subscriber
        // await subscriber.subscribe('dummy-channel', (message, channel) => {
        //     console.log(`Received message from ${channel}: ${message}`);
        // })

        // publish message to dummy-channel
        // await client.publish('dummy-channel', 'Some dummy data from publisher')
        // await client.publish('dummy-channel', 'Some new dummy data from publisher')

        // await new Promise((resolve) => {
        //     setTimeout(resolve, 5000)
        // })

        // await subscriber.unsubscribe('dummy-channel')

        // await subscriber.quit();

        // pipelining & transaction 
        // pipelining is a process of sending multiple request to redis in a batch
        // transaction is used to run multiple command as a single unit in redis

        const multi = client.multi()
        multi.set('key-transaction1', 'value1')
        multi.set('key-transaction2', 'value2')
        multi.get('key-transaction1')
        multi.get('key-transaction2')

        const result = await multi.exec();
        console.log(result)


        const pipeline = client.multi()
        pipeline.set('key-pipeline1', 'value1')
        pipeline.set('key-pipeline2', 'value2')
        pipeline.get('key-pipeline1')
        pipeline.get('key-pipeline2')
        const pipelineresult = await pipeline.exec();
        console.log(pipelineresult)


        // batch data operations
        const pipelineOne = client.multi()

        for (let i = 0; i < 1000; i++) {
            pipelineOne.set(`user:${i}:action`, `Action ${i}`)
        }

        const multiUser = await pipelineOne.exec()
        console.log(multiUser)

        console.log("Performance test");
        console.time("without pipelining");

        for (let i = 0; i < 1000; i++) {
            await client.set(`user${i}`, `user_value${i}`);
        }

        console.timeEnd("without pipelining");

        console.time("with pipelining");
        const bigPipeline = client.multi();

        for (let i = 0; i < 1000; i++) {
            bigPipeline.set(`user_pipeline_key${i}`, `user_pipeline_value${i}`);
        }

        await bigPipeline.exec();

        console.timeEnd("with pipelining");

    } catch (err) {
        console.log(err)
    }
    finally {
        await client.quit()
    }
}

testAdditionalFeatures()