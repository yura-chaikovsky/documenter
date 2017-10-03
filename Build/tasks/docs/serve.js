var gulp = require('gulp');
var webpack = require('webpack');
var path = require('path');

gulp.task('docs:serve', function(done) {
	var WebpackDevServer = require('webpack-dev-server');
	var port = 8080;
	var server = new WebpackDevServer(webpack({output: {path: path.resolve(__dirname, './../../../S/docs/')}, watch: true}), {
		contentBase: path.resolve(__dirname, './../../../S/docs/')
	});

	server.listen(port, function() {
		require('opn')('http://localhost:8080');
		done();
	});

});
