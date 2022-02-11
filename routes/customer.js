const express = require("express"); // library, engine end-point
const app = express();              // implementasi library express
app.use(express.json())

// import md5
const md5 = require('md5')          // enkripsi
                            
const multer = require("multer")             
const path = require("path")        
const fs = require("fs")            // file sistem (mengakses file tersebut), embaca file sistem (dimana file itu) 

// import model
const models = require('../models/index');
const { error } = require("console");
const customer = models.customer 

// import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeJSItuMenyenangkan"

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

app.put("/:id", upload.single("image"), (req, res) =>{
    let param = { customer_id: req.params.id}
    let data = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        username: req.body.username
    }
    if (req.file) {
        // get data by id
        const row = customer.findOne({where: param}) // untuk 
        .then(result => {
            let oldFileName = result.image // hasil gambar kita dapatkan dr database didimpan
           
            // delete old file
            let dir = path.join(__dirname,"../image/customer",oldFileName) // direktori gambar
            // mneghapus sebuah file dari sistem 
            fs.unlink(dir, err => console.log(err))
        })
        .catch(error => {
            console.log(error.message);
        })
 
        // set new filename (image)
        data.image = req.file.filename
    }
 
    if(req.body.password){
        data.password = md5(req.body.password)
    }
 
    customer.update(data, {where: param})
        .then(result => {
            res.json({
                message: "data has been updated",
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

// async = asyncronus, untuk menjalankan data secara tdk berurutan (bisa ada yg dilewati) 
// await = untuk menunggu proses, tambahkan await di proses yg tdk boleh dilewati
app.delete("/:id", async (req, res) =>{
    try {
        let param = { customer_id: req.params.id}
        let result = await customer.findOne({where: param})
        let oldFileName = result.image
           
        // delete old file
        let dir = path.join(__dirname,"../image/customer",oldFileName)
        fs.unlink(dir, err => console.log(err))
 
        // delete data
        customer.destroy({where: param})
        .then(result => {
            res.json({
                message: "data has been deleted",
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
 
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

// end-point login customer (authentication), METHOD: POST, function: findOne 
app.post("/auth", async (req, res) => {
    let data = {
        username : req.body.username,
        password : md5(req.body.password)
    }

    // cari data customer yang username dan password sama dengan input 
    let result = await customer.findOne({where : data})
    if (result) {
        // ditemukan
        // set payload data 
        let payload = JSON.stringify({
            customer_id: result.customer_id,
            name: result.name,
            username: result.username
        })

        // generate token based on payload and secret_key
        let token = jwt.sign(payload, SECRET_KEY)

        // set output 
        res.json({
            logged: true,
            data: result,
            token: token
        })
    }
    else {
        // tidak ditemukan 
        res.json({
            logged: false,
            message: "Invalid username or password"
        })
    }
})

module.exports = app;
