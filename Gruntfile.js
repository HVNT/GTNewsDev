'use strict';
var path = require('path');

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        config: {
            app: 'src',
            stage: '.tmp',
            dist: 'build'
        },
        env: {
            local: {ENV: 'local'},
            mock: {ENV: 'mock'},
            dev: {ENV: 'development'},
            test: {ENV: 'test'},
            stage: {ENV: 'stage'},
            demo: {ENV: 'mock'},
            prod: {ENV: 'production'}
        },
        preprocess: {
            index: {
                src: '<%= config.app %>/index.html.template',
                dest: '<%= config.app %>/index.html'
            }
        },
        watch: {
            scss: {
                files: [
                    '<%= config.app %>/core/**/*.{scss,sass}',
                    '<%= config.app %>/app/**/*.{scss,sass}',
                    '<%= config.app %>/submodule/**/*.{scss,sass}'
                ],
                tasks: ['compass:dev']
            },
            index: {
                files: ['<%= config.app %>/index.html.template'],
                tasks: ['preprocess']
            },
            html: {
                files: [
                    '<%= config.app %>/app/**/*.html',
                    '<%= config.app %>/core/**/*.html'
                ],
                tasks: ['ngtemplates:build']
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            watch: {
                tasks: ['watch:scss', 'watch:index', 'watch:html']
            }
        },
        clean: {
            options: {
                dot: true
            },
            dist: {
                files: [
                    {
                        src: [
                            '<%= config.dist%>'
                        ]
                    }
                ]
            },
            stage: {
                files: [
                    {
                        src: [
                            '<%= config.stage%>'
                        ]
                    }
                ]
            }
        },
        compass: {
            prod: {
                options: {
                    debugInfo: false,
                    outputStyle: 'compressed',
                    config: 'config.rb'
                }
            },
            dev: {
                options: {
                    debugInfo: false,
                    outputStyle: 'compressed',
                    config: 'config.rb'
                }
            }
        },
        copy: {
            toDist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.app %>',
                        dest: '<%= config.dist %>',
                        src: [
                            'index.html',
                            'submodule/patterns/**/*.{js}',
                            'submodule/ckeditor/dev/builder/release/ckeditor/**/*',
                            'vendor/**/*.{html,otf,eot,svg,ttf,woff,woff2}',
                            'assets/**/*'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.stage %>',
                        dest: '<%= config.dist %>',
                        src: ['assets/**/*']
                    }
                ]
            }
        },
        express: {
            all: {
                options: {
                    port: 9000,
                    bases: './src',
                    server: './server.js'
                }
            }
        },
        uglify: {
            options: {
                mangle: true,
                beautify: false
            }
        },
        karma: {
            unit: {
                configFile: 'config/karma-unit.config.js',
                singleRun: true
            }
        },
        useminPrepare: {
            html: '<%= config.app %>/index.html',
            options: {
                dest: '<%= config.stage%>'
            }
        },
        usemin: {
            html: '<%= config.app %>/index.html',
            options: {
                dest: '<%= config.stage %>',
                assetsDirs: ['<%= config.stage %>']
            }
        },
        filerev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            assets: {
                src: '<%= config.stage %>/assets/**/*.{js,css}'
            }
        },
        ngAnnotate: {
            buildjs: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.stage%>/concat/assets/js/',
                        src: 'build.js',
                        dest: '<%= config.stage%>/concat/assets/js/'
                    }
                ]
            }
        },
        ngtemplates: {
            build: {
                cwd: '<%= config.app %>',
                src: [
                    'app/**/*.html',
                    'core/**/*.html'
                ],
                dest: '<%= config.app %>/app/app.templates.js',
                options: {
                    module: 'nd.app',
                    prefix: '/',
                    htmlmin: {
                        collapseBooleanAttributes:      true,
                        collapseWhitespace:             true,
                        removeAttributeQuotes:          true,
                        removeComments:                 true,
                        removeEmptyAttributes:          true,
                        removeRedundantAttributes:      true,
                        removeScriptTypeAttributes:     true,
                        removeStyleLinkTypeAttributes:  true
                    }
                }
            }
        },
        compress: {
            build: {
                options: {
                    archive: 'mozart-build.zip'
                },
                files: [
                    {
                        src: ['<%= config.dist%>/**']
                    }
                ]
            }
        },
        http_upload: {
            dev: {
                options: {
                    url: 'https://deploy:0071E7D1-7876-479C-889B-3C5FFBD73DBD@dev.landinglion.com/Catcher/SaveIt.ashx',
                    method: 'POST',
                    rejectUnauthorized: false,
                    onComplete: function(data) {
                        console.log('Response: ' + data);
                    }
                },
                src: 'mozart-build.zip',
                dest: 'mozart-build'
            }
        }
    });

    grunt.registerTask('server', [
        'preprocess',
        'compass:dev',
        'express',
        'concurrent:watch'
    ]);

    grunt.registerTask('build', [
        'preprocess',
        'clean:dist',
        'compass:dev',
        'ngtemplates:build',
        'useminPrepare',
        'concat:generated',
        'ngAnnotate',
        'cssmin:generated',
        'uglify:generated',
        'filerev',
        'usemin',
        'copy:toDist',
        'compress:build',
        'clean:stage'
    ]);

    grunt.registerTask('develop.local', [
        'ngtemplates:build',
        'env:local',
        'server'
    ]);

    grunt.registerTask('develop.mock', [
        'ngtemplates:build',
        'env:mock',
        'server'
    ]);

    grunt.registerTask('build.local', [
        'env:local',
        'build'
    ]);

    grunt.registerTask('build.dev', [
        'env:dev',
        'build'
    ]);

    grunt.registerTask('build.test', [
        'env:test',
        'build'
    ]);

    grunt.registerTask('build.stage', [
        'env:stage',
        'build'
    ]);

    grunt.registerTask('build.demo', [
        'env:demo',
        'build'
    ]);

    grunt.registerTask('build.prod', [
        'env:prod',
        'build'
    ]);

    grunt.registerTask('deploy.dev', [
        'env:dev',
        'build',
        'http_upload:dev'
    ]);

    grunt.registerTask('deploy.prod', [
        'env:prod',
        'build',
        'http_upload:dev'
    ]);
};