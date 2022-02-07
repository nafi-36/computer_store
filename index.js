const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// import end-point diletakkan disini
const admin = require('./routes/admin')  // import  
app.use("/store/admin", admin)           // implementasi, membuat end-point  

const customer = require('./routes/customer')  // import  
app.use("/customer", customer)                 // implementasi, membuat end-point

const product = require('./routes/product')  // import  
app.use("/product", product)                  // implementasi, membuat end-point  

// app.get("/test", (req, res) => {
//     let test = {
//         message : "test"
//     }
//     res.json(test)
// })

app.listen(8000, () => {
    console.log('server run on port 8000');
})