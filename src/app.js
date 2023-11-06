const express = require("express");
const app = express();
const {Restaurant, Menu, Item} = require("../models/index.js")
const db = require("../db/connection");
const { seedRestaurant , seedMenu, seedItem } = require("../seedData");


async function addAssociations() {
    await db.sync({force: true});
    await Restaurant.bulkCreate(seedRestaurant)
    await Menu.bulkCreate(seedMenu)
    await Item.bulkCreate(seedItem)
    const firstRest = await Restaurant.findByPk(1)
    const firstMenu = await Menu.findOne()
    const secondMenu = await Menu.findByPk(2)
    const firstItem = await Item.findByPk(1)
    const secondItem = await Item.findByPk(2)
    const thirdItem = await Item.findByPk(3)
    await firstRest.addMenus([firstMenu, secondMenu])
    await firstMenu.addItems([firstItem, secondItem])
    await secondMenu.addItems([secondItem, thirdItem])
}
addAssociations()

app.use(express.json())

app.use(express.urlencoded())

app.get('/restaurants', async (req, res) => {
    const allRestaurants = await Restaurant.findAll({include: Menu, include: [{model: Menu, include: [{model: Item}]}]})
    res.json(allRestaurants)
})

app.get('/restaurants/:id', async (req, res) => {
    const foundRestaurant = await Restaurant.findByPk(req.params.id)
    res.json(foundRestaurant)
})

app.post('/restaurants', async (req, res) => {
    await Restaurant.create(req.body)
    const allRestaurants = await Restaurant.findAll()
    res.json(allRestaurants)
})

app.put('/restaurants/:id', async (req, res) => {
    const restaurantToUpdate = await Restaurant.findByPk(req.params.id)
    const updatedRestaurant = await restaurantToUpdate.update(req.body)
    res.json(updatedRestaurant)
})

app.delete('/restaurants/:id', async (req, res) => {
    const restaurantToDelete = await Restaurant.findByPk(req.params.id)
    await restaurantToDelete.destroy()
    res.send(`Restaurant #${req.params.id} deleted`)
})


module.exports = {app, Restaurant, Menu, Item};