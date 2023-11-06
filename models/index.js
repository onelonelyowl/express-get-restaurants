const { Restaurant } = require('./Restaurant')
const { Item } = require('./Item')
const { Menu } = require('./Menu')

Restaurant.hasMany(Menu)
Menu.belongsTo(Restaurant)

Item.belongsToMany(Menu, {through: "item-menu"})
Menu.belongsToMany(Item, {through: "item-menu"})

module.exports = {Restaurant, Item, Menu};