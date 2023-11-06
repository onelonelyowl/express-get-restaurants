const { Sequelize, DataTypes } = require("sequelize");
const db = require("../db/connection");

const Menu = db.define("Menu", {
    title: DataTypes.STRING
})

module.exports = {Menu}