const express = require("express");
const app = express();
const Restaurant = require("../models/index")
const db = require("../db/connection");

app.use(express.json())

app.use(express.urlencoded())

app.get('/restaurants', async (req, res) => {
    res.json(await Restaurant.findAll())
})

app.get('/restaurants/:id', async (req, res) => {
    const foundRestaurant = await Restaurant.findByPk(req.params.id)
    res.json(foundRestaurant)
})

app.post('/restaurants', async (req, res) => {
    await Restaurant.create(req.body)
    res.send("Restaurant created")
})

app.put('/restaurants/:id', async (req, res) => {
    const restaurantToUpdate = await Restaurant.findByPk(req.params.id)
    await restaurantToUpdate.update(req.body)
    res.send(`Restaurant #${req.params.id} updated`)
})

app.delete('/restaurants/:id', async (req, res) => {
    const restaurantToDelete = await Restaurant.findByPk(req.params.id)
    await restaurantToDelete.destroy()
    res.send(`Restaurant #${req.params.id} deleted`)
})


module.exports = app;