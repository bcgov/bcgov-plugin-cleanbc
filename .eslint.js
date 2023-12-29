module.exports = {
	rules: {
		"no-console": ["error", { "allow": ["error"] }],
	},
	extends: [
    	"./node_modules/@bcgov/wordpress-eslint/.eslint.js",
	],
}