require('@babel/register')({
	extends: './.babelrc',
	ignore: [/node_modules/],
	extensions: ['.js', '.jsx', 'ts', '.tsx'],
});

require('core-js/es5');
require('core-js/es6');
require('core-js/library');
require('core-js/stage/0');
require('regenerator-runtime/runtime');