/**
 * Created by Kristof on 12/02/2015.
 */
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ''
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        jshint: {
            // define the files to lint
            files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'qunit']
        }
    });

    //grunt.event.on('qunit.begin', function() {
    //    grunt.log.ok("Qunit beginning");
    //});
    //grunt.event.on('qunit.moduleStart', function(name) {
    //    grunt.log.ok("Qunit module start: " + name);
    //});
    //grunt.event.on('qunit.testStart', function(name) {
    //    grunt.log.ok('qunit test starting: ' + name);
    //});
    //grunt.event.on('qunit.testDone', function(name) {
    //    grunt.log.ok('qunit test done: ' + name);
    //});
    //grunt.event.on('qunit.moduleDone', function(name) {
    //    grunt.log.ok("Qunit module done: " + name);
    //});
    //grunt.event.on('qunit.done', function() {
    //    grunt.log.ok("Qunit done");
    //});
    //grunt.event.on('qunit.error.onError', function(message, trace) {
    //    grunt.log.error('qunit error: ' + message);
    //});
    //grunt.event.on('qunit.log', function(result, actual, expected, message, source) {
    //    grunt.log.ok('result: ' + result);
    //    grunt.log.ok('actual: ' + actual);
    //    grunt.log.ok('expected: ' + expected);
    //    grunt.log.ok('message: ' + message);
    //    grunt.log.ok('source: ' + source);
    //});

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // this would be run by typing "grunt test" on the command line
    grunt.registerTask('test', ['jshint', 'qunit']);

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
};