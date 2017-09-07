
import * as yamlConfig from 'config-yaml'

interface Config {

	api: {
		port: number
	}

	database: DatabaseConfig
	testDatabase?: DatabaseConfig

	cors: {
		originPatterns: RegExp[]
	}

	youtube: {
		key: string
	}

}

export interface DatabaseConfig {
	host: string
	port: number
	name: string
	user?: string
	password?: string
}

let conf: Config = yamlConfig(`${__dirname}/../config.yaml`)

if (conf.cors && conf.cors.originPatterns instanceof Array)
	conf.cors.originPatterns = conf.cors.originPatterns.map(pattern => {
		return new RegExp(pattern, 'i')
	})

export const config: Config = conf
