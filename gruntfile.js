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
        },
        bower: {
            install: {
                //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
            }
        }
});

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-task');


    // this would be run by typing "grunt test" on the command line
    grunt.registerTask('test', ['jshint', 'bower', 'qunit']);

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('default', ['jshint', 'bower', 'qunit', 'concat', 'uglify']);
};