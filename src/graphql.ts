

import * as graphqlHTTP from 'express-graphql'

import schema from './graphql/schema'
import Video from './graphql/Video'

import * as createDebug from 'debug'
const debug = createDebug('graphql')


const root = {
	activeVideos: async () => await Video.getActive(),
	setActiveVideos: async ({ids}) => await Video.setActive(ids),
}

export default graphqlHTTP({
	schema,
	rootValue: root,
	graphiql: true,
})
