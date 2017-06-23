
import * as chai from 'chai'
import chaiHttp = require('chai-http')

import api from '../src/API'
import { store } from '../src/Store'
import { videoStore } from '../src/store/Video'

chai.use(chaiHttp)
const expect = chai.expect

const storeInit = store.initialize(
	'localhost', 5432, 'owl.test'
)

describe('mutation { setActiveVideoIDs(:ids) }', () => {

	const ids = [
		"mcLeqt9QUdY", "fAAKQxuL-sE", "-Ch6cXq9Ktw", "PIP6UHMQldU",
		"a9xIhgsqrkU", "mW6rRnqq1KQ", "NYaN0XjySKY", "BrsV4c0fEpg",
		"NX-SzOF0IAc", "1lELtQkodXo", "KP-SzplJRBY", "8gb38dWjXkc",
		"5RnSYZ6l86g", "FhqZ5cNnzH4", "vuUCdKvD2GQ", "g7921r4J6K4",
		"uA2iwiATyq8", "DxGOO1pDsM4", "c7hgXhGpX3U"
	];

	it('should set and return IDs', async () => {
		await storeInit

		const res = await chai.request(api)
			.post('/graphql')
			.set('content-type', 'application/json')
			.send({
				query: `
					mutation SetActiveVideoIDs($ids: [String]!) {
						setActiveVideoIDs(ids: $ids)
					}
				`,
				variables: { ids: ids }
			})

		expect(res.status).to.equal(200)
		expect(res).to.be.json
		expect(res.body).to.be.an('object')
			.and.have.nested.property('data.setActiveVideoIDs')
		expect(res.body.data.setActiveVideoIDs)
			.to.be.an('array').of.length(ids.length)
			.and.to.have.members(ids)
	})

	it('should have set IDs in video store', async () => {
		const storedIDs = await videoStore.getActiveIDs()
		expect(storedIDs).to.have.members(ids)
	})
})

