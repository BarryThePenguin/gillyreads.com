const util = require('gulp-util');
const del = require('del');
const {dest} = require('../config/paths');

module.exports = () => {
	util.log(`Cleaning ${dest()}`);
	return del(dest());
};
