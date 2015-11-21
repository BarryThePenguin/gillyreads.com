import path from 'path';
import util from 'gulp-util';

let theme = 'gillian';

if (util.env.theme) {
	theme = util.env.theme;
}

export const dirPath = (...paths) => {
	const params = ['./'];
	params.push(...paths);
	return path.join(...params);
};

export const src = p => dirPath('/src/', theme, p || '');

export const common = p => dirPath('/src/_common', p || '');

export const dest = p => dirPath('/content/themes/', theme, p || '');

export const modules = p => dirPath('/node_modules/', p || '');

export const bundle = {
	src: src(),
	dest: dest('/assets')
};

export const style = {
	src: src('/css/main.scss'),
	dest: dest('/assets/css'),
	watch: [
		src('/css/**/*.scss'),
		common('/css/**/*.scss')
	],
	imports: [
		dirPath('node_modules')
	]
};

export const scripts = {
	src: src('/js/**/*'),
	dest: dest('/assets/js'),
	bundle: src('/js/')
};

export const templates = {
	src: [
		src('/templates/**/*.hbs'),
		common('/templates/**/*.hbs')
	],
	dest: dest(),
	watch: [
		dest('/**/*.hbs')
	]
};

export const extras = {
	src: src('/stuff/*'),
	dest: dest()
};

export const fonts = {
	src: [
		src('/fonts/*.{eot,svg,ttf,woff,otf}'),
		common('/fonts/*.{eot,svg,ttf,woff,otf}')
	],
	dest: dest('/assets/fonts')
};
