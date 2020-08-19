const NodeGeocoder = require('node-geocoder');
// const dotenv = require('config/config.env');
// dotenv.config({ path: "./config/config.env" });

const options = {
    provider: 'mapquest', //process.env.GEOCODE_PROVIDER,
    httpAdapter: 'https',
    apiKey: 'akxuTIIXQOOLCGFwPbxAEOaP8Z8u8CT8', //process.env.GEOCODER_API_KEY,
    formatter:null
}

const geocoder = NodeGeocoder(options);

module.exports = geocoder;