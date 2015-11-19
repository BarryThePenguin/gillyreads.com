import path from 'path';
import util from 'gulp-util';

var theme = 'gillian';

if (util.env.theme) {
	theme = util.env.theme;
}

const dirPath = (...paths) => {
	const params = ['./'];
	params.push(...paths);
	return path.join(...params);
};

const src = p => {
	return dirPath('/src/' + theme, p || '');
};

const common = p => {
	return dirPath('/src/_common', p || '');
};

const dest = p => {
	return dirPath('/content/themes/' + theme, p || '');
};

const modules = p => {
	return dirPath('/node_modules/', p || '');
};

export default {
	dest: dest(),
	bundle: {
		src: src(),
		dest: dest('/assets')
	},
	style: {
		src: src('/css/main.scss'),
		dest: dest('/assets/css'),
		watch: [
			src('/css/**/*.scss'),
			common('/css/**/*.scss')
		],
		imports: [
			dirPath('node_modules')
		]
	},
	scripts: {
		src: src('/js/**/*'),
		dest: dest('/assets/js'),
		bundle: src('/js/')
	},
	templates: {
		src: [
			src('/templates/**/*.hbs'),
			common('/templates/**/*.hbs')
		],
		dest: dest(),
		watch: [
			dest('/**/*.hbs')
		]
	},
	extras: {
		src: src('/stuff/*'),
		dest: dest()
	},
	fonts: {
		src: [
			src('/fonts/*.{eot,svg,ttf,woff,otf}'),
			common('/fonts/*.{eot,svg,ttf,woff,otf}')
		],
		dest: dest('/assets/fonts')
	}
};
