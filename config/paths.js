const path = require('path');

const dirPath = (...paths) => path.join('./', ...paths);

const src = (p) => dirPath('/src/', p || '');

const dest = (p) => dirPath('/content/themes/gillian/', p || '');

const modules = (p) => dirPath('/node_modules/', p || '');

const bundle = {
	src: src(),
	dest: dest('/assets')
};

const style = {
	dest: dest('/assets/css'),
	watch: [src('/css/**/*.css'), dirPath('/tailwind.config.js')],
	imports: [dirPath('node_modules')]
};

const scripts = {
	src: src('/js/**/*'),
	dest: dest('/assets/js'),
	bundle: src('/js/')
};

const templates = {
	src: [src('/**/*.hbs')],
	dest: dest(),
	watch: [src('/**/*.hbs')]
};

const extras = {
	src: src('/stuff/*'),
	dest: dest()
};

const fonts = {
	src: [src('/fonts/*.{eot,svg,ttf,woff,otf}')],
	dest: dest('/assets/fonts')
};

module.exports = {
	src,
	dest,
	modules,
	bundle,
	style,
	scripts,
	templates,
	extras,
	fonts
};
