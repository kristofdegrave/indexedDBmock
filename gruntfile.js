/**
 * Created by Kristof on 12/02/2015.
 */
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= webpack.mock.output.path + webpack.mock.output.filename %>']
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
        },
        nugetpack: {
            dist: {
                src: 'nuget/indexedDBmock.nuspec',
                dest: 'nuget/packages/',
                options: {
                    version: '<%= version %>'
                }
            }
        },
        nugetpush: {
            dist: {
                src: 'nuget/packages/*.nupkg'
            }
        },
        release: {
            options: {
                bump: false,
                commitMessage: 'Release <%= version %>'
            }
        },
        bump: {
            options: {
                updateConfigs: ['pkg'],
                commit: false,
                createTag: false,
                push: false
            }
        },
        webpack: {
            mock: {
                // webpack options
                entry: "./src/mock",
                output: {
                    path: "dist/",
                    filename: "indexedDBmock.js",
                    library: "mock",
                    libraryTarget: "umd"
                },
                resolve: {
                    extensions: ['.js'],
                    root: './src'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-nuget');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-webpack');



    // this would be run by typing "grunt test" on the command line
    grunt.registerTask('test', ['jshint', 'bower', 'qunit']);

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('default', ['jshint', 'bower', 'webpack', 'qunit', 'uglify']);

    grunt.registerTask('publish', ['publish:patch']);
    grunt.registerTask('publish:patch', ['bump:patch', 'release', 'nugetpack', 'nugetpush']);
    grunt.registerTask('publish:minor', ['bump:minor', 'release', 'nugetpack', 'nugetpush']);
    grunt.registerTask('publish:major', ['bump:major', 'release', 'nugetpack', 'nugetpush']);
};