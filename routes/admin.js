const express = require('express');           // library
const bodyParser = require('body-parser');
const md5 = require('md5');                   // md5 = mengenskripsi password, install terlebih dahulu (npm i --save md5)

const app = express();                        // implementasi library express
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));

const models = require('../models/index');   // mengimport file index.js dlm folder
const req = require("express/lib/request");
const admin = models.admin;                  // mengimport model

// end-point ditulis disini

// end-point GET data Admin
app.get("/", (req, res) => {
    admin.findAll()              // mengambil data
        .then(admin => {         // menampilkan data 
            res.json(admin)
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

module.exports = app;