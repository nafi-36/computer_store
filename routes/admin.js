// import library
const express = require('express');           // library
const bodyParser = require('body-parser');
const md5 = require('md5');                   // md5 = mengenskripsi password, install terlebih dahulu (npm i --save md5)

// implementasi
const app = express();                        // implementasi library express
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));

// import model
const models = require('../models/index');   // mengimport file index.js dlm folder
const admin = models.admin;                  // mengimport model

// import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeJSItuMenyenangkan"

// end-point GET data Admin
app.get("/" , (req, res) => {
    admin.findAll()              // mengambil data
        .then(admin => {         // menampilkan data 
            res.json({
                count: admin.length,
                admin: admin
            })
        })
        .catch(error => {        // jika error 
            res.json({
                message: error.message
            })
        })
})

// end-point menyimpan data admin, METHOD:POST, function: create
app.post("/", (req, res) => {
    let data = {                             // data yg mau disimpan
        name: req.body.name,   
        username: req.body.username,
        password: md5(req.body.password)
    }
    admin.create(data)                       // menambahkan dan menyimpan data
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
})

// end-point untuk mengupdate data admin, METHOD: PUT, function: UPDATE
app.put("/:id", (req, res) => {
    let param = {
        admin_id : req.params.id
    }
    let data = {
        name : req.body.name,
        username : req.body.username,
        password : md5(req.body.password)
    }
    admin.update(data, {where: param})
        .then(result => {
            res.json({
                message : "data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message : error.message
            })
        })
})

// end-point untuk menghapus data admin, METHOD: DELETE, function: DESTROY
app.delete("/:id", (req, res) => {
    let param = {
        admin_id : req.params.id
    }
    admin.destroy({where: param})
        .then(result => {
            res.json({
                message : "data has been deleted"
            })
        })
        .catch(error => {
            res.json({
                message : error.message
            })
        })
})

// end-point login admin (authentication), METHOD: POST, function: findOne 
app.post("/auth", async (req, res) => {
    let data = {
        username : req.body.username,
        password : md5(req.body.password)
    }

    // cari data admin yang username dan password sama dengan input 
    let result = await admin.findOne({where : data})
    if (result) {
        // ditemukan
        // set payload data 
        let payload = JSON.stringify({
            admin_id: result.admin_id,
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