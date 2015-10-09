/* eslint-env browser */

import Instagram from './instagram';

Instagram.initialise({
	accessToken: '31694633.32a8a43.4e2eb7ef66db45efae265d0264b15a0a',
	clientID: '32a8a43b97c54d30964b9d65d0e5be79'
});

let instagram = new Instagram({
	query: '@gillydowe',
	max: 4
}, document.querySelector('.ghost-snap'));

instagram.userFeed();
