"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphqlHTTP = require("express-graphql");
const graphql_1 = require("graphql");
const Hero_1 = require("./routes/Hero");
const schema = graphql_1.buildSchema(`
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
		hello: String!
		heroes: [Hero]!
		hero(id: Int!): Hero
	}
`);
class Hero {
    static getBy(id) {
        const hero = Hero_1.Heroes.filter(hero => hero.id === id);
        if (hero.length === 0)
            return null;
        return new Hero(hero[0]);
    }
    static getAll() {
        return Hero_1.Heroes.map(hero => new Hero(hero));
    }
    constructor({ id, name, aliases, occupation, gender, height, hair, eyes, powers }) {
        this.id = id;
        this.name = name;
        this.aliases = aliases;
        this.occupation = occupation;
        this.gender = gender;
        this.height = height;
        this.hair = hair;
        this.eyes = eyes;
        this.powers = powers;
    }
}
const root = {
    hello: () => {
        return 'Hello, World!';
    },
    heroes: () => Hero.getAll(),
    hero: ({ id }) => Hero.getBy(id)
};
exports.default = graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
});
