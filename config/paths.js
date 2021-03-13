const path = require('path');

const dirPath = (...paths) => path.join('.', ...paths);

const src = (...p) => dirPath('src', ...p);

const dest = (...p) => dirPath('content/themes/gillian', ...p);

const modules = (...p) => dirPath('node_modules', ...p);

const assets = (...p) => dest('assets', ...p);

const bundle = {
	src: src(),
	dest: assets()
};

const styles = {
	watch: assets('*.css')
};

const scripts = {
	src: src('js/**/*'),
	watch: [assets('*.js'), assets('*.mjs')],
	bundle: src('js')
};

const templates = {
	src: src('**/*.hbs'),
	dest: dest(),
	watch: src('/**/*.hbs')
};

const images = {
	src: src('images/**/*'),
	dest: assets('images'),
	watch: src('images/**/*')
};

const extras = {
	src: src('stuff/*'),
	dest: dest()
};

const fonts = {
	src: [src('fonts/*.{eot,svg,ttf,woff,otf}')],
	dest: assets('fonts')
};

module.exports = {
	src,
	dest,
	modules,
	bundle,
	styles,
	scripts,
	templates,
	extras,
	images,
	fonts
};
