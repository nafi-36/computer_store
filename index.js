const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// import end-point diletakkan disini
// end-point admin
const admin = require('./routes/admin')  // import  
app.use("/store/admin", admin)           // implementasi, membuat end-point  

// end-point customer
const customer = require('./routes/customer')  // import  
app.use("/customer", customer)                 // implementasi, membuat end-point

// end-point product
const product = require('./routes/product')  // import  
app.use("/product", product)                 // implementasi, membuat end-point  

// end-point transaksi
const transaksi = require('./routes/transaksi');
app.use("/transaksi", transaksi)

app.use(express.static(__dirname))

// app.get("/test", (req, res) => {
//     let test = {
//         message : "test"
//     }
//     res.json(test)
// })

app.listen(8000, () => {
    console.log('server run on port 8000');
})