const log = require('fancy-log');
const del = require('del');
const {dest} = require('../config/paths');

module.exports = () => {
	log(`Cleaning ${dest()}`);
	return del(dest());
};
