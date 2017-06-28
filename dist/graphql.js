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
const Video_1 = require("./graphql/Video");
const createDebug = require("debug");
const debug = createDebug('graphql');
const schema = graphql_1.buildSchema(`
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
`);
const root = {
    activeVideos: () => __awaiter(this, void 0, void 0, function* () { return yield Video_1.default.getActive(); }),
    setActiveVideos: ({ ids }) => __awaiter(this, void 0, void 0, function* () { return yield Video_1.default.setActive(ids); }),
};
exports.default = graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
});
