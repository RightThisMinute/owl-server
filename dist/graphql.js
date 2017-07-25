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
const schema_1 = require("./graphql/schema");
const Video_1 = require("./graphql/Video");
const createDebug = require("debug");
const debug = createDebug('graphql');
const root = {
    activeVideos: () => __awaiter(this, void 0, void 0, function* () { return yield Video_1.default.getActive(); }),
    setActiveVideos: ({ input }) => __awaiter(this, void 0, void 0, function* () {
        yield Video_1.default.setActive(input.ids);
        return { clientMutationId: input.clientMutationId };
    }),
};
exports.default = graphqlHTTP({
    schema: schema_1.default,
    rootValue: root,
    graphiql: true,
});
//# sourceMappingURL=graphql.js.map