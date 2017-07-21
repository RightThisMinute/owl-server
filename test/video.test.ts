
import * as chai from 'chai'
import chaiHTTP = require('chai-http')

import api from '../src/API'
import { config } from '../src/config'
import { store } from '../src/Store'
import { recorder } from '../src/Recorder'

chai.use(chaiHTTP)
const expect = chai.expect

import * as createDebug from 'debug'
const debug = createDebug('test.video')

const VIDEOS = [
	{ id: 'sB6HY8r983c', channel: 'UCORIeT1hk6tYBuntEXsguLg',
		title: /Seven Nation Army/i, views: 16108609 },
	{ id: 'fSnoXJzb17s', channel: 'UCiAx3aeh8X9FriOn1Hhch5g',
		title: /Zelda.*Goron Cannon/i, views: 10339 },
	{ id: '9bZkp7q19f0', channel: 'UCrDkAvwZum-UTjHmzDI2iIw',
		title: /GANGNAM STYLE/i, views: 2879947547 },
]

const IDS = VIDEOS.map(vid => vid.id)

before('initialize store', async () => {
	config.testDatabase.host, config.testDatabase.port, config.testDatabase.name,
		{ dropAndRecreateTables: true }
})

describe('mutation { setActiveVideos(:ids) }', () => {


	it('should set and return IDs', async () => {
		const res = await chai.request(api)
			.post('/graphql')
			.set('content-type', 'application/json')
			.send({
				query: `
					mutation SetActiveVideos($ids: [ID]!) {
						setActiveVideos(ids: $ids) { id }
					}
				`,
				variables: { ids: IDS }
			})

		expect(res.status).to.equal(200)
		expect(res).to.be.json
		expect(res.body).to.be.an('object')
			.and.have.nested.property('data.setActiveVideos')
		expect(res.body.data.setActiveVideos)
			.to.be.an('array').of.length(IDS.length)

		let storedIDs: number[] = []

		res.body.data.setActiveVideos.forEach(vid => {
			expect(vid).to.be.an('object').with.all.keys(['id'])
			storedIDs.push(vid.id)
		})
		
		expect(storedIDs).to.have.members(IDS)
	})

	it('should have set the active videos', async () => {
		const res = await chai.request(api)
			.post('/graphql')
			.set('content-type', 'application/json')
			.send({
				query: `query { activeVideos { id } }`,
			})

		expect(res.status).to.equal(200)
		expect(res).to.be.json
		expect(res.body).to.be.an('object')
			.and.have.nested.property('data.activeVideos')
		expect(res.body.data.activeVideos)
			.to.be.an('array').of.length(IDS.length)
			.and.to.have.nested.property('[0].id')
		
		const storedIDs = res.body.data.activeVideos.map(vid => vid.id)
		expect(storedIDs).to.have.members(IDS)
	})

})


describe('query { activeVideos }', () => {

	const start = Date.now()

	before('record video stats', async () => {
		await recorder.record()
		await recorder.record()
		await recorder.record()
	})

	it('should have active videos with full details and stats', async () => {
		const seconds = Math.ceil((Date.now() - start) / 1000)

		const res = await chai.request(api)
			.post('/graphql')
			.set('content-type', 'application/json')
			.send({
				query: `query ActiveVideos($seconds: Int!) {
					activeVideos {
						id
						details {
							title
							channel { id }
						}
						stats: statsByAge(seconds: $seconds) {
							videoID
							recordedAt
							views
						}
					} 
				}`,
				variables: { seconds: seconds },
			})

		expect(res.status).to.equal(200)
		expect(res).to.be.json
		expect(res.body).to.be.an('object')
			.and.have.nested.property('data.activeVideos')
		expect(res.body.data.activeVideos)
			.to.be.an('array').of.length(IDS.length)
			.and.to.have.nested.property('[0].id')

		const storedIDs = res.body.data.activeVideos.map(vid => vid.id)
		expect(storedIDs).to.have.members(IDS)

		res.body.data.activeVideos.forEach(vid => {
			expect(vid)
				.to.have.all.keys(['id', 'details', 'stats'])

			expect(vid.details).to.be.an('object')
				.with.all.keys(['title', 'channel'])
			expect(vid.details.channel).to.be.an('object')
				.with.all.keys(['id'])

			const expected = VIDEOS.find(expected => {
				return expected.id === vid.id
			})

			expect(expected).to.exist
			expect(vid.details.title).to.match(expected.title)
			expect(vid.details.channel.id).to.equal(expected.channel)

			expect(vid.stats).to.be.an('array').with.length.of.at.least(3)
			expect(vid.stats[0]).to.be.an('object')
				.with.all.keys(['videoID', 'recordedAt', 'views'])

			vid.stats.forEach(stats => {
				expect(Number(stats.recordedAt)).to.be.a('number')
					.of.at.least(Math.floor(start))
					.but.lessThan(Math.ceil(start) + (seconds * 1000))
				expect(Number(stats.views)).to.be.a('number')
					.of.at.least(expected.views)
			})
		})
	})

})
