const express = require('express')

const app = express();
 
// root route
app.get('/', (req, res) => {
    res.send('Welcome to home page');
})

// all products
app.get('/products',(req, res) => {
    const products = [
        {
            id: 1,
            label: 'Product 1'
        },
        {
            id: 2,
            label: 'Product 2'
        },
        {
            id: 3,
            label: 'Product 3'
        }
    ]
    res.json(products)
} )

// to get a single product - : is used to create a dynamic routing
app.get('/product/:id', (req,res) => {
    const productId = parseInt(req.params.id)
    console.log(productId)
    const products = [
        {
            id: 1,
            label: 'Product 1'
        },
        {
            id: 2,
            label: 'Product 2'
        },
        {
            id: 3,
            label: 'Product 3'
        }
    ]

    const getSingleProduct = products.find(product => product.id === productId)
    if(getSingleProduct){
        res.json(getSingleProduct)
    }else{
        res.status(404).send('Product not found')
    }
})

const port = 3001
app.listen(port, () => {
    console.log(`Server is now listening on port ${port}`)
})