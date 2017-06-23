
import * as graphqlHTTP from 'express-graphql'
import {buildSchema } from 'graphql'
import { Heroes } from './routes/Hero'
import { videoStore } from './store/Video'

import * as createDebug from 'debug'
const debug = createDebug('graphql')

const schema = buildSchema(`
	type Height {
		ft: Int!
		in: Int!
	}

	type Hero {
		id: Int!
		name: String!
		aliases: [String]
		occupation: String
		gender: String!
		height: Height!
		hair: String
		eyes: String
		powers: [String]!
	}

	type Query {
		heroes: [Hero]!
		hero(id: Int!): Hero
	}

	type Mutation {
		setActiveVideoIDs(ids: [String]!): [String]!
		hello: String!
	}
`)

class Hero {

	public static getBy(id: number): Hero|null {
		const hero = Heroes.filter(hero => hero.id === id)
		
		if (hero.length === 0)
			return null

		return new Hero(hero[0])
	}

	public static getAll(): Hero[] {
		return Heroes.map(hero => new Hero(hero))
	}

	id: number
	name: string
	aliases: string[]
	occupation: string
	gender: string
	height: object
	hair: string
	eyes: string
	powers: string[]

	constructor({id, name, aliases, occupation, gender, height, hair, eyes,
		            powers})
	{
		this.id         = id
		this.name       = name
		this.aliases    = aliases
		this.occupation = occupation
		this.gender     = gender
		this.height     = height
		this.hair       = hair
		this.eyes       = eyes
		this.powers     = powers
	}
}


const root = {
	hello: () => 'Hello, World!',

	heroes: () => Hero.getAll(),
	hero: ({id}) => Hero.getBy(id),

	setActiveVideoIDs: async ({ids}) => {
		await videoStore.setActive(ids)
		return await videoStore.getActiveIDs()
	}
}

export default graphqlHTTP({
	schema,
	rootValue: root,
	graphiql: true,
})
