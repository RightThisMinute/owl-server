
import * as mocha from 'mocha'
import * as chai from 'chai'
import chaiHttp = require('chai-http')

import app from '../src/App'

chai.use(chaiHttp)
const expect = chai.expect


describe('GET api/v1/heroes', () => {

	it('responds with JSON array', () => {
		return chai.request(app).get('/api/v1/heroes')
		.then(res => {
			expect(res.status).to.equal(200)
			expect(res).to.be.json
			expect(res.body).to.be.an('array')
			expect(res.body).to.have.length(5)
		})
	})

	it('should include Wovlerine', () => {
		return chai.request(app).get('/api/v1/heroes')
		.then(res => {
			let Wolverine = res.body.find(hero => hero.name === 'Wolverine')
			expect(Wolverine).to.exist
			expect(Wolverine).to.have.all.keys([
				'id', 'name', 'aliases', 'occupation', 'gender', 'height', 'hair',
				'eyes', 'powers'
			])
		})
	})

})


describe('GET api/v1/heroes/:id', () => {

	it('responds with single JSON object', () => {
		return chai.request(app).get('/api/v1/heroes/1')
		.then(res => {
			expect(res.status).to.equal(200)
			expect(res).to.be.json
			expect(res.body).to.be.an('object')
		})
	})

	it('should return Luke Cage', () => {
		return chai.request(app).get('/api/v1/heroes/1')
		.then(res => {
			expect(res.body.hero.name).to.equal('Luke Cage')
		})
	})

})


describe('query { heroes }', () => {

	it('responds with a JSON array', () => {
		return chai.request(app)
		.post('/graphql')
		.set('content-type', 'application/json')
		.send({ query: 'query { heroes { id } }' })
		.then(res => {
			expect(res.status).to.equal(200)
			expect(res).to.be.json
			expect(res.body).to.be.an('object')
				.and.have.nested.property('data.heroes')
			expect(res.body.data.heroes).to.be.an('array').of.length(5)
		})
	})

	it('should include Spider-Man', () => {
		return chai.request(app)
		.post('/graphql')
		.set('content-type', 'application/json')
		.send({ query: 'query { heroes { id, name, powers } }' })
		.then(res => {
			let Spidey = res.body.data.heroes.find(hero => hero.name === 'Spider-Man')
			expect(Spidey).to.exist
				.and.to.have.all.keys(['id', 'name', 'powers'])
				.and.not.have.any.keys([
					'aliases', 'occupation', 'gender', 'height', 'hair', 'eyes'
				])
		})
	})

})


describe('query { hero(:id) }', () => {

	it('responds with JSON object', () => {
		return chai.request(app)
		.post('/graphql')
		.set('content-type', 'application/json')
		.send({ query: 'query { hero(id: 4) { id } }' })
		.then(res => {
			expect(res.status).to.equal(200)
			expect(res).to.be.json
			expect(res.body).to.be.an('object')
				.and.have.nested.property('data.hero')
			expect(res.body.data.hero).to.be.an('object')
		})
	})

	it('should return Iron Man', () => {
		return chai.request(app)
		.post('/graphql')
		.set('content-type', 'application/json')
		.send({ query: 'query { hero(id: 4) { id, name, powers } }' })
		.then(res => {
			expect(res.body.data.hero)
				.to.have.all.keys(['id', 'name', 'powers'])
				.and.not.have.any.keys([
					'aliases', 'occupation', 'gender', 'height', 'hair', 'eyes'
				])
			expect(res.body.data.hero.name).to.equal('Iron Man')
		})
	})

})

