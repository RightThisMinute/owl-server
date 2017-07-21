
import * as yamlConfig from 'config-yaml'

interface Config {

	api: {
		port: number
	}

	database: {
		host: string,
		port: number,
		name: string,
	}

	testDatabase?: {
		host: string,
		port: number,
		name: string,
	}

	cors: {
		originPatterns: RegExp[]
	}

	youtube: {
		key: string
	}

}

let conf: Config = yamlConfig(`${__dirname}/../config.yaml`)

if (conf.cors && conf.cors.originPatterns instanceof Array)
	conf.cors.originPatterns = conf.cors.originPatterns.map(pattern => {
		return new RegExp(pattern, 'i')
	})

export const config: Config = conf
