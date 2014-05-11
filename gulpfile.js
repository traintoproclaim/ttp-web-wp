var gulp = require('gulp');
var gutil = require('gulp-util');
var exec = require('gulp-exec');

// livereload
var livereload = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();

var srcTheme = [
    'htdocs/wp/wp-content/themes/ttp/views/*.twig',
    'htdocs/wp/wp-content/themes/ttp/*.php',
    'htdocs/wp/wp-content/themes/ttp/*.css',
    'htdocs/wp/wp-content/themes/ttp/css/*.css',
    'htdocs/wp/wp-content/themes/ttp/js/*.js'
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
		key: "/home/cambell/dev.key"
	};
	gulp.src('htdocs')
		.pipe(exec('rsync -rzlt --chmod=Dug=rwx,Fug=rw,o-rwx --delete --exclude-from="upload-exclude.txt" --stats --rsync-path="sudo -u vu2003 rsync" --rsh="ssh -i <%= options.key %>" <%= file.path %>/ <%= options.dest %>', options));
	gulp.src('htdocs/images')
		.pipe(exec('rsync -rzlt --chmod=Dug=rwx,Fug=rw,o-rwx --stats --rsync-path="sudo -u vu2003 rsync" --rsh="ssh -i <%= options.key %>" <%= file.path %>/ <%= options.dest %>images/', options));
});


gulp.task('db-backup', function() {
	var options = {
		silent: false,
		dest: "root@new.traintoproclaim.com",
		key: "/home/cambell/dev.key",
		password: gutil.env.password
	};
	gulp.src('')
		.pipe(exec('mysqldump -u cambell --password=<%= options.password %> traintoproclaim | gzip > backup/backup.sql.gz', options));
});

gulp.task('db-copy', ['db-backup'], function() {
	var options = {
		silent: false,
		dest: "root@new.traintoproclaim.com",
		key: "/home/cambell/dev.key",
		password: gutil.env.password
	};
	gulp.src('')
		.pipe(exec('ssh -C -i <%= options.key %> <%= options.dest %> mysqldump -u cambell --password=<%= options.password %> traintoproclaim2 | mysql -u cambell --password=<%= options.password %> -D traintoproclaim', options));
});

