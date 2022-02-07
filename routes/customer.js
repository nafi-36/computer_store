const express = require("express");           // library, engine end-point
const app = express();                        // implementasi library express
app.use(express.json())

// import md5
const md5 = require('md5')                    // enkripsi

const multer = require("multer")              
const path = require("path")
const fs = require("fs")                      // untuk membaca file sistem (dimana file itu) 

// import model
const models = require('../models/index');
const customer = models.customer 

// config storage image, membuat konfigurasi untuk menyimpan foto / dimana foto yang diinsert akan disimpan
const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"./image/customer")
    },
    filename:(req,file,cb) => {
        cb(null,"img-" + Date.now() + path.extname(file.originalname))
    }
})
// callback(cb) setiap dijalankan call lagi / berulang  

let upload = multer({storage : storage})
// yang diganti yang ada dalam cb

// menampilkan data customer yang tersimpan
// GET ALL CUSTOMER, METHOD: GET, FUNCTION: findAll
app.get("/", (req, res) => {
    customer.findAll()             // mengambil data
        .then(result => {          // menampilkan data 
            res.json({
                customer: result
            })
        })
        .catch(error => {          // jika error masuk ke blok .catch diambil errornya apa dan ditampilkan errornya
            res.json({
                message: error.message
            })
        })
})

// GET CUSTOMER by ID, METHOD: GET, FUNCTION: findOne
app.get("/:customer_id", (req, res) => {
    customer.findOne({where: {customer_id: req.params.customer_id}})
        .then(result => {
            res.json({
                customer: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.post("/", upload.single("image"), (req, res) => {
    if (!req.file) {
        res.json({
            message: "No uploaded file"
        })
    } else {
        let data = {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            image: req.file.filename,
            username: req.body.username,
            password: md5(req.body.password)
        }
        customer.create(data)
        .then(result => {
            res.json({
                message: "data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    }
})

module.exports = app;
