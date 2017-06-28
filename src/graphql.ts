

import * as graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'

import Video from './graphql/Video'

import * as createDebug from 'debug'
const debug = createDebug('graphql')

const schema = buildSchema(`
	type Video {
		id: ID!
		active: Boolean!
		details: VideoDetails
		statsByAge(seconds: Int!): [VideoStats]!
	}
	
	type VideoDetails {
		title: String!
		description: String!
		thumbnailURL: String!
		publishedAt: String!
		channel: Channel!
	}
	
	type VideoStats {
		videoID: ID!
		recordedAt: String!
		views: String!
		likes: String!
		dislikes: String!
		favorites: String!
		comments: String!
	}
	
	type Channel {
		id: ID!
		name: String!
	}

	type Query {
		activeVideos: [Video]!
	}

	type Mutation {
		setActiveVideos(ids: [ID]!): [Video]!
	}
`)


const root = {
	activeVideos: async () => await Video.getActive(),
	setActiveVideos: async ({ids}) => await Video.setActive(ids),
}

export default graphqlHTTP({
	schema,
	rootValue: root,
	graphiql: true,
})
