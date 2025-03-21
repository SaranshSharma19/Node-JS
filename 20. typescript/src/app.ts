console.log('Hello Node JS from TypeScript');

let isDone: boolean = true

let num: number = 100

let str: string = "Saransh"

let numArr: Array<number> = [1, 2, 3, 4]

let strArr: string[] = ['str 1', 'str 2', 'str 3']

import express, { Express, NextFunction, Request, Response } from 'express';
const app: Express = express();
const port = 3001

app.use(express.json())

interface CustomRequest extends Request {
    startTime?: number
}

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
    req.startTime = Date.now();
    next()
})

interface User {
    name: string,
    email: string
}

app.post('/user', (req: Request<{}, {}, User>, res: Response) => {
    const {name, email} = req.body;
    res.json({
        message: `User created Successfully`
    })
})

app.get("/", (req: Request, res: Response) => {
    res.send("Hello. TypeScript with Express")
})


app.listen(port, () => {
    console.log(`Server is now running on port ${port}`);

})


