module.exports = function(grunt) {
    'use strict';
    var pkg = require('./package.json'),
        moment = require('moment'),
        timestamp = new Date().getTime(),
        jpegRecompress = require('imagemin-jpeg-recompress');

    grunt.initConfig({
        pkg: pkg,
        meta: {
            banner: '/*\n' +
                    '* Enzo.io - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    '* Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
                    '* Leonardo Salles - http://leonardosalles.com\n' +
                    '*/',

            bannerJs: '/*\n' +
                    '* Enzo.io - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    '* Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
                    '* Leonardo Salles - http://leonardosalles.com\n' +
                    '*/\n'+
                    'var Enzo={App:function(config){if(!config)throw new Error("App config object is required");if(Object.keys(config).length<4)throw new Error("App config object require 4 arguments, apiUrl, apiPort, mode and version");function Enzo(){};var enzo=new Enzo;enzo.apiUrl=config.apiUrl;enzo.apiPort=config.apiPort;enzo.mode=config.mode;enzo.version=config.version;if(navigator.userAgent.indexOf("Chrome")>0)console.log("%c Enzo.io framework version "+enzo.version+" successfully started","background-color: green; color: #fff","Author: http://www.leonardosalles.com");else console.log("Enzo.io framework version "+enzo.version+" successfully started, Author: http://www.leonardosalles.com");return enzo}};'
        },

        requirejs: {
          compile: {
            options: {
              name: 'main',
              optimize: 'none',
              reserveLicenseComments: false,
              inlineText: true,
              removeCombined: false,
              baseUrl: 'static/js',
              mainConfigFile: 'static/js/main.js',
              out: 'dist/static/js/out.js',

              paths: {
                'angular': '../../vendor/angular/angular.min',
                'angular-resource': '../../vendor/angular/angular-resource.min',
                'angular-cookies': '../../vendor/angular/angular-cookies.min',
                'angular-loader': '../../vendor/angular/angular-loader.min',
                'angular-sanitize': '../../vendor/angular/angular-sanitize.min',
                'angular-strap': '../../vendor/angular-strap/angular-strap.min',
                'angular-route': '../../vendor/angular/angular-route.min',
                'angular-animate': '../../vendor/angular/angular-animate.min',
                'angular-ui-router': '../../vendor/ui-router/angular-ui-router.min',

                'bootstrap': '../../vendor/bootstrap/js/bootstrap.min',
                'jquery': '../../vendor/jquery/jquery.min',

                'moment': '../../vendor/moment/moment.min',

                requireLib: '../../vendor/requirejs/require.min'
              },

              include: ['requireLib']
            }
          }
        },

        jshint: {
          all: ['static/js/**/*.js']
        },

        uglify: {
          options: {
              mangle: false,
              banner: '<%= meta.bannerJs %>'
          },
          target: {
            files: {
              'dist/static/js/app-v<%= pkg.version %>.min.js': ['dist/static/js/out.js']
            }
          }
        },

        less: {
          production: {
            files: {
              'dist/static/css/app.css': 'static/css/app.less'
            }
          }
        },

        cssmin: {
          options: {
              keepSpecialComments: 0,
              banner: '<%= meta.banner %>'
          },
          combine: {
            files: {
              'dist/static/css/app-v<%= pkg.version %>.min.css': ['dist/static/css/app.css']
            }
          }
        },

        processhtml: {
          options: {
            customBlockTypes: ['build.js']
          },
          dist: {
            files: {
              'dist/index.html': ['index.html']
            }
          }
        },

        htmlmin: {
          dist: {
            options: {
              removeComments: true,
              collapseWhitespace: true
            },
            files: {
              'dist/index.html': 'dist/index.html',
            }
          }
        },

        imagemin: {
          dynamic: {
            options: {
              optimizationLevel: 7,
              use: [jpegRecompress({
                loops: 1
              })]
            },
            files: [{
              expand: true,
              cwd: 'static/img',
              src: ['**/*.{png,jpg,gif,ico}'],
              dest: 'dist/static/img'
            }]
          }
        },

        copy: {
          main: {
            files: [
              {
                expand: true,
                cwd: 'static/fonts',
                src: ['**'],
                dest: 'dist/static/fonts'
              }
            ]
          }
        },
        
        usebanner: {
            taskName: {
              options: {
                position: 'bottom',
                banner: 'var App = new Enzo.App({' +
                          'apiUrl: \'' + pkg.apiUrl + '\', ' +
                          'apiPort: \'' + pkg.apiPort + '\', ' +
                          'mode: \'production\', ' +
                          'version: \'' + pkg.version + '\'' +
                          '});',
                linebreak: false
              },
              files: {
                src: [ 'dist/static/js/app-v' + pkg.version + '.min.js' ]
              }
            }
          }
    });

  grunt.registerTask('clean', 'Delete files of dist', function () {
    grunt.file.delete('dist');
    grunt.file.mkdir('dist');
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-banner');

  grunt.registerTask('buildClean', 'Delete files used during the build', function () {
    grunt.file.delete('dist/static/js/out.js');
    grunt.file.delete('dist/static/css/app.css');
  });

  grunt.registerTask('logDeps', 'Log dependencias', function () {
    console.log('Require dependencias');
  });

  grunt.registerTask('logJSHint', 'Log JSHint', function () {
    console.log('Validating javascript');
  });

  grunt.registerTask('logRequirejs', 'Log dependencias', function () {
    console.log('Minify javascript');
  });

  grunt.registerTask('logLess', 'Log dependencias', function () {
    console.log('Compile LESS');
  });

  grunt.registerTask('logCss', 'Log dependencias', function () {
    console.log('Minify CSS');
  });

  grunt.registerTask('logProcessHtml', 'Log dependencias', function () {
    console.log('Process HTML');
  });

  grunt.registerTask('logHtml', 'Log dependencias', function () {
    console.log('Minify HTML');
  });

  grunt.registerTask('logOptImg', 'Log imagens', function () {
    console.log('Optimize images');
  });

  grunt.registerTask('logBuildClean', 'Log dependencias', function () {
    console.log('Cleaning build directory');
  });

  grunt.registerTask('logBuildClean', 'Log dependencias', function () {
    grunt.log.ok('Build version ' + pkg.version + ' done at ' + moment(new Date(timestamp)).format('MM/DD/YYYY') + ' - ' + moment(new Date(timestamp)).format('HH:mm:ss') + ' with success...');
  });

  grunt.registerTask('dist', 'Compiles all of the assets and copy the files to the build directory.', function () {
    grunt.log.ok('Starting Build version ' + pkg.version);

    if (grunt.option('clean') || grunt.option('clean-compress')) {
      console.log('Cleaning dist directory');
      grunt.task.run('clean');
    }

    grunt.task.run('logDeps', 'requirejs', 'logJSHint', 'jshint', 'logRequirejs', 'uglify', 'logLess', 'less', 'logCss', 'cssmin', 'logProcessHtml', 'processhtml', 'logHtml', 'htmlmin', 'logOptImg', 'imagemin', 'copy', 'usebanner', 'logBuildClean', 'buildClean');
    });
};
