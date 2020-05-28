// jest-puppeteer.config.js
module.exports = {
	server: {
		command: 'vue-cli-service serve --port 18080',
		launchTimeout: 30000,
		port: 18080,
		usedPortAction: 'kill',
	},
}
