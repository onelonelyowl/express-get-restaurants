const request = require('supertest')
const {app, Restaurant, Menu, Item} = require('./src/app')
const { syncSeed } = require('./seed.js')

beforeAll(async () => {
    syncSeed()
})

describe('testing endpoints', () => {
    it('get restaurants returns status code 200', async () => {
        const response = await request(app).get('/restaurants') // WHY DOESN'T THIS WORK?
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
        expect(restaurants).toEqual([{"cuisine": "FastFood", "id": 1, "location": "Texas", "name": "AppleBees"}, {"cuisine": "Hotpot", "id": 2, "location": "Dallas", "name": "LittleSheep"}, {"cuisine": "Indian", "id": 3, "location": "Houston", "name": "Spice Grill"}])
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
});