
import { expect } from 'chai'

import { config } from '../src/config'
import { recorder } from '../src/Recorder'
import { store } from '../src/Store'
import { videoStore } from '../src/store/Video'
import { channelStore } from '../src/store/Channel'
import { snapshotStore } from '../src/store/Snapshot'

import * as createDebug from 'debug'
const debug = createDebug('recorder.test')


const VIDEOS = [
	{ id: 'sB6HY8r983c', channel: 'UCORIeT1hk6tYBuntEXsguLg',
		title: /Seven Nation Army/i, views: 16108609 },
	{ id: 'fSnoXJzb17s', channel: 'UCiAx3aeh8X9FriOn1Hhch5g',
		title: /Zelda.*Goron Cannon/i, views: 10339 },
	{ id: '9bZkp7q19f0', channel: 'UCrDkAvwZum-UTjHmzDI2iIw',
		title: /GANGNAM STYLE/i, views: 2879947547 },
]


async function initStore(): Promise<void> {
	await store.initialize(config.testDatabase,
	                       { dropAndRecreateTables: true })

	const ids = VIDEOS.map(vid => vid.id)
	await videoStore.setActive(ids)
}

describe('recorder.record()', () => {

	it('should not result in error', async () => {
		await initStore()
		await recorder.record()
	})

	it('should fill out video details', async () => {
		let vids = await videoStore.getActive()

		expect(vids).to.be.an('array').of.length(VIDEOS.length)

		vids.forEach(vid => {
			const expected = VIDEOS.find(expected => expected.id === vid.id)
			expect(expected).to.exist
			expect(vid.title).to.match(expected.title)
			expect(vid.channelID).to.equal(expected.channel)
		})
	})

	it('should fill out channels', async () => {
		const channels = await channelStore.getAll()

		expect(channels).to.be.an('array').of.length(VIDEOS.length)

		channels.forEach(channel => {
			const expected = VIDEOS.find(vid => vid.channel === channel.id)
			expect(expected).to.exist
		})
	})

	it('should save a snapshot of statistics', async () => {
		const snapshots = await snapshotStore.getAll()

		expect(snapshots).to.be.an('array').of.length(VIDEOS.length)

		snapshots.forEach(snapshot => {
			const expected = VIDEOS.find(expected => {
				return expected.id === snapshot.videoID
			})
			expect(expected).to.exist
			const views = Number(snapshot.viewCount)
			expect(views).to.be.a('number').and.at.least(expected.views)
		})
	})

})

