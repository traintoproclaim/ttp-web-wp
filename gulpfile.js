var gulp = require('gulp');
var gutil = require('gulp-util');
var exec = require('gulp-exec');

// livereload
var livereload = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();

var srcTheme = [
    'htdocs/wp/wp-content/themes/ttp-wp-theme/views/*.twig',
    'htdocs/wp/wp-content/themes/ttp-wp-theme/*.php',
    'htdocs/wp/wp-content/themes/ttp-wp-theme/*.css',
    'htdocs/wp/wp-content/themes/ttp-wp-theme/css/*.css',
    'htdocs/wp/wp-content/themes/ttp-wp-theme/js/*.js'
];

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('do-reload', function() {
	return gulp.src('htdocs/wp/index.php')
		.pipe(livereload(server));
});

gulp.task('reload', function() {
	server.listen(35729, function(err) {
		if (err) {
			return console.log(err);
		}
		gulp.watch(srcTheme, ['do-reload']);
	});
});

gulp.task('upload', function() {
	var options = {
		silent: false,
		src: "htdocs",
		dest: "root@new.traintoproclaim.com:/var/www/virtual/new.traintoproclaim.com/htdocs/",
		key: "/home/cambell/.ssh/dev_rsa"
	};
	gulp.src('htdocs')
		.pipe(exec('rsync -rzlt --chmod=Dug=rwx,Fug=rw,o-rwx --exclude-from="upload-exclude.txt" --stats --rsync-path="sudo -u vu2003 rsync" --rsh="ssh -i <%= options.key %>" <%= file.path %>/ <%= options.dest %>', options));
});


gulp.task('db-backup', function() {
	var options = {
		silent: false,
		dest: "root@new.traintoproclaim.com",
		key: "/home/cambell/.ssh/dev_rsa",
		password: process.env.password
	};
	gulp.src('')
		.pipe(exec('mysqldump --host=default.local -u cambell --password=<%= options.password %> traintoproclaim | gzip > backup/backup.sql.gz', options));
});

gulp.task('db-copy', ['db-backup'], function() {
	var options = {
		silent: false,
		dest: "root@new.traintoproclaim.com",
		key: "/home/cambell/.ssh/dev_rsa",
		password: process.env.password
	};
	gulp.src('')
		.pipe(exec('ssh -C -i <%= options.key %> <%= options.dest %> mysqldump -u cambell --password=<%= options.password %> traintoproclaim_wp | mysql --host=default.local -u cambell --password=<%= options.password %> -D traintoproclaim', options));
});

