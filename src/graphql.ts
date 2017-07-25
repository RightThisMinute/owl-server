

import * as graphqlHTTP from 'express-graphql'

import schema from './graphql/schema'
import Video from './graphql/Video'

import * as createDebug from 'debug'
const debug = createDebug('graphql')


export interface SetActiveVideosInput {
	ids: string[],
	clientMutationId: string
}

const root = {
	activeVideos: async () => await Video.getActive(),
	setActiveVideos: async ({ input }: { input: SetActiveVideosInput }) => {
		await Video.setActive(input.ids)
		return { clientMutationId: input.clientMutationId }
	},
}

export default graphqlHTTP({
	schema,
	rootValue: root,
	graphiql: true,
})
