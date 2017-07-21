import * as fs from 'fs'
import { graphql } from 'graphql'
import { introspectionQuery, printSchema } from 'graphql/utilities'
import * as path from 'path'

import schema from '../src/graphql/schema'


// Save JSON of full schema introspection for Babel Relay Plugin to use
(async () => {
	const result = await graphql(schema, introspectionQuery);

	if (result.errors) {
		console.error(
			'ERROR introspecting schema: ',
			JSON.stringify(result.errors, null, 2)
		);
	}
	else {
		fs.writeFileSync(
			path.join(__dirname, '../data/schema.json'),
			JSON.stringify(result, null, 2)
		);
	}
})()


fs.writeFileSync(
	path.join(__dirname, '../data/schema.graphqls'),
	printSchema(schema),
)

