const request = require('supertest')
const {app, Restaurant, Menu, Item} = require('./src/app.js')
const { syncSeed } = require('./seed.js')
const db = require('./db/connection.js')
const { seedRestaurant , seedMenu, seedItem } = require("./seedData");

beforeAll(async () => {
    // syncSeed()
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
})

describe('testing endpoints', () => {
    it('get restaurants returns status code 200', async () => {
        const response = await request(app).get('/restaurants')
        expect(response.statusCode).toEqual(200)
    });
    it('get restuarants returns an array', async () => {
        const response = await request(app).get('/restaurants')
        expect(typeof (JSON.parse(response.text))).toBe('object')
    });
    it('returns correct number of restaurants', async () => {
        const response = await request(app).get('/restaurants')
        const array = JSON.parse(response.text)
        expect(array.length).toBe(3)
    });
    it('returns correct restaurant data', async () => {
        const response = await request(app).get('/restaurants')
        const restaurants = JSON.parse(response.text)
        expect(restaurants[0]).toHaveProperty("Menus") // don't know how to test this really aside from copying expected output
    });
    it('get restuarants/:id returns correct data', async () => {
        const response = await request(app).get('/restaurants/2')
        const restaurant2 = JSON.parse(response.text)
        expect(restaurant2).toEqual({"cuisine": "Hotpot", "id": 2, "location": "Dallas", "name": "LittleSheep"})
    });
    it('test post restaurants returns new update array', async () => {
        const response = await request(app).post('/restaurants').send({name : "new", location: "new", cuisine: "new"})
        expect(JSON.parse(response.text).length).toBe(4)
    }, 10000);
    it('put resturants/:id updates retaurants correctly', async () => {
        const response = await request(app).put('/restaurants/2').send({name: "name", location: "location", cuisine: "cuisine"})
        const returnedRestaurant = JSON.parse(response.text)
        expect(returnedRestaurant).toEqual({id: 2, name: "name", location: "location", cuisine: "cuisine"})
    });
    it('delete restaurants/:id works correctly', async () => {
        const response = await request(app).delete('/restaurants/4')
        const allRestaurants = await Restaurant.findAll()
        expect(allRestaurants.length).toBe(3)
    });
    it('error is returned when trying to post restaurant with empty value', async () => {
        const response = await request(app).post('/restaurants/').send({name: "this should fail", location: "", cuisine: "this should fail"})
        expect(JSON.parse(response.text)).toHaveProperty("error")
    });
});

afterAll( async () => {
    await db.sync({force: true})
})