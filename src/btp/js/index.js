var $ = require('jquery');

var $document = $(document);

function navClick(e) {
  e.preventDefault();
  console.log('click');
  $('body').toggleClass('nav-opened nav-closed');
}

function ready() {
  $('.menu-button__link').on('click', navClick);
}

$document.ready(ready);
