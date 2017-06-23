
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

	youtube: {
		key: string
	}
}

export const config: Config = yamlConfig(`${__dirname}/../config.yaml`)
