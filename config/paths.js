import path from 'node:path';

const directoryPath = (...paths) => path.join('.', ...paths);

export const source = (...p) => directoryPath('src', ...p);

export const destination = (...p) => directoryPath('content/themes/gillian', ...p);

export const modules = (...p) => directoryPath('node_modules', ...p);

export const assets = (...p) => destination('assets', ...p);

export const bundle = {
	src: source(),
	dest: assets(),
};

export const styles = {
	watch: assets('*.css'),
};

export const scripts = {
	src: source('js/**/*'),
	watch: [assets('*.js'), assets('*.mjs')],
};

export const templates = {
	src: source('**/*.hbs'),
	clean: destination('**/*.hbs'),
	dest: destination(),
	watch: source('**/*.hbs'),
};

export const images = {
	src: source('images/**/*'),
	clean: assets('images'),
	dest: assets('images'),
	watch: source('images/**/*'),
};

export const extras = {
	src: source('stuff/*'),
	dest: destination(),
};
