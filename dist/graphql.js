"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphqlHTTP = require("express-graphql");
const graphql_1 = require("graphql");
const Hero_1 = require("./routes/Hero");
const Video_1 = require("./store/Video");
const createDebug = require("debug");
const debug = createDebug('graphql');
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
		heroes: [Hero]!
		hero(id: Int!): Hero
	}

	type Mutation {
		setActiveVideos(ids: [String]!): [String]!
		hello: String!
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
    hello: () => 'Hello, World!',
    heroes: () => Hero.getAll(),
    hero: ({ id }) => Hero.getBy(id),
    setActiveVideos: ({ ids }) => __awaiter(this, void 0, void 0, function* () {
        yield Video_1.videoStore.setActive(ids);
        return yield Video_1.videoStore.getActiveIDs();
    })
};
exports.default = graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
});
