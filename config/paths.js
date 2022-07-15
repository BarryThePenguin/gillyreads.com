import path from 'node:path';

const dirPath = (...paths) => path.join('.', ...paths);

export const src = (...p) => dirPath('src', ...p);

export const dest = (...p) => dirPath('content/themes/gillian', ...p);

export const modules = (...p) => dirPath('node_modules', ...p);

export const assets = (...p) => dest('assets', ...p);

export const bundle = {
	src: src(),
	dest: assets(),
};

export const styles = {
	watch: assets('*.css'),
};

export const scripts = {
	src: src('js/**/*'),
	watch: [assets('*.js'), assets('*.mjs')],
};

export const templates = {
	src: src('**/*.hbs'),
	clean: dest('**/*.hbs'),
	dest: dest(),
	watch: src('**/*.hbs'),
};

export const images = {
	src: src('images/**/*'),
	clean: assets('images'),
	dest: assets('images'),
	watch: src('images/**/*'),
};

export const extras = {
	src: src('stuff/*'),
	dest: dest(),
};

export const fonts = {
	src: src('fonts/*.{eot,svg,ttf,woff,otf}'),
	clean: assets('fonts'),
	dest: assets('fonts'),
};
