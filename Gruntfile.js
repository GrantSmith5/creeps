require('dotenv').config();

module.exports = function (grunt) {
    require('time-grunt')(grunt);

    // Allow grunt options to override default configuration
    var branch = grunt.option('branch') || process.env.BRANCH || 'default';
    var private_directory = grunt.option('private_directory') || process.env.PRIVATE_DIRECTORY || null;

    var currentdate = new Date();
    grunt.log.subhead('Task Start: ' + currentdate.toLocaleString());
    grunt.log.writeln('Branch: ' + branch);

    // Load needed tasks
    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-file-append');
    grunt.loadNpmTasks('grunt-rsync');

    grunt.initConfig({

        // Push all files in the dist folder to screeps. What is in the dist folder
        // and gets sent will depend on the tasks used.
        screeps: {
            options: {
                email: process.env.EMAIL,
                password: process.env.PASSWORD,
                branch: branch,
                ptr: false
            },
            dist: {
                src: ['dist/*.js']
            }
        },


        // Copy all source files into the dist folder, flattening the folder
        // structure by converting path delimiters to underscores
        copy: {
            // Pushes the game code to the dist folder so it can be modified before
            // being send to the screeps server.
            screeps: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**',
                    dest: 'dist/',
                    filter: 'isFile',
                    rename: function (dest, src) {
                        // Change the path name utilize underscores for folders
                        return dest + src.replace(/\//g,'_');
                    }
                }],
            }
        },


        // Copy files to the folder the client uses to sink to the private server.
        // Use rsync so the client only uploads the changed files.
        rsync: {
            options: {
                args: ["--verbose", "--checksum"],
                exclude: [".git*"],
                recursive: true
            },
            private: {
                options: {
                    src: './dist/',
                    dest: private_directory,
                }
            },
        },


        // Add version variable using current timestamp.
        file_append: {
            versioning: {
                files: [
                    {
                        append: "\nglobal.SCRIPT_VERSION = "+ currentdate.getTime() + "\n",
                        input: 'dist/version.js',
                    }
                ]
            }
        },


        // Remove all files from the dist folder.
        clean: {
            'dist': ['dist']
        },

    });

    // Combine the above into a default task
    grunt.registerTask('default',  ['clean', 'copy:screeps',  'file_append:versioning', 'screeps']);
    grunt.registerTask('private',  ['clean', 'copy:screeps',  'file_append:versioning', 'rsync:private']);
};
