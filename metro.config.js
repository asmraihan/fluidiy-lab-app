const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname)
// Add additional asset extensions
config.resolver.assetExts.push('bin');

module.exports = (config)