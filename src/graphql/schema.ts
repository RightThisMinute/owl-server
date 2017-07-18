
import { buildSchema } from 'graphql'


export default buildSchema(`
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
