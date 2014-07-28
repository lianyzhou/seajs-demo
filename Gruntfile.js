module.exports = function(grunt){

	var transport = require('grunt-antrol-transport');
	
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);
	

    grunt.initConfig({
    	
    	// Project settings
        yeoman: {
            // configurable paths
            app: './resources',
            dist: './dist'
        },
    	
    	transport :  {
    		options : {
    			paths : ["<%= yeoman.app %>"],
    			parsers : {
                    '.js' : [script.jsParser],
                    '.css' : [style.css2jsParser],
                    '.tpl' : [text.html2jsParser]
                },
                debug : false
    		},
    		dest : {
	            files: [{
	                cwd: '<%= yeoman.app %>',
	                src: '**/*',
	                filter : "isFile",
	                expand : true,
	                dest: '.tmp'
	            }]
	        }
    	},
    	cmdconcat : {
    		dest : {
    			options : {
    				paths : [".tmp"],
    				include : "all"
    			},
    			files : [{
    				cwd : '.tmp',
    				src : 'page/*.js',
    				expand : true,
    				dest : 'dist'
    			},
    			{
    				cwd : '.tmp',
    				src : 'common/base.js',
    				expand : true,
    				dest : 'dist'
    			},
    			]
    		}
    	},
    	useminPrepare: {
            html: '<%= yeoman.app %>/main.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
		           html: {
		             steps: {
		               js: ['concat', 'uglifyjs'],
		               css: ['cssmin']
		             },
		             post: {}
		           }
		        }
            }
        },
        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/*.html'],
            css: ['<%= yeoman.dist %>/css/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>' , '<%= yeoman.dist %>/images']
            }
        },
        cssmin: {
	       options: {
	         root: '<%= yeoman.app %>'
	       }
	    },
    	copy : {
    		dest : {
    			files : [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.html',
                            'images/{,*/}*.{png,jpg,jpeg,gif}'
                        ]
                    },
	    			{
	    				cwd : '<%= yeoman.app %>',
	    				src : [
	    					'lib/sea/{,*/}*.js',
	                        'lib/jquery.js',
	                        'lib/sea.js'
	    				],
	    				expand : true,
	    				dot: true,
	    				dest : '<%= yeoman.dist %>'
	    			}
	    		]
    		}
    	},
    	rev: {
            dest: {
                files: {
                    src: [
                    	'<%= yeoman.dist %>/css/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif}'
                    ]
                }
            }
        },
        uglify : {
	   	   options : {
		   	   mangle : {
		   	   	 except : ['require','exports','module']
		   	   }
		   },
	       dest: {
	         files: [{
	         	expand : true,
	         	cwd : '<%= yeoman.dist %>',
	         	src : ["common/*.js" , "page/*.js"],
	         	dest : '<%= yeoman.dist %>'
	         }]
	       }
        },
        imagemin : {
        	dest : {
        		files : [{
					expand : true,
					cwd : '<%= yeoman.dist %>',
					src : ['**/*.{png,jpg,gif}'],
					dest : '<%= yeoman.dist %>'
        		}]
        	}
        },
        htmlmin : {
        	options: { 
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeCommentsFromCDATA: true,
                removeOptionalTags: true,
                minifyJS : true
	      	},
			dest : {
        		files : [{
					expand : true,
					cwd : '<%= yeoman.dist %>',
					src : ['**/*.html'],
					dest : '<%= yeoman.dist %>'
        		}]
        	}        	
        },
    	clean : {
    		pre : {
    			files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>'
                        ]
                    }
                ]
    		},
    		post : {
    			files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                        ]
                    }
                ]
    		}
    	}
    });

    grunt.loadNpmTasks('grunt-antrol-transport');
    grunt.loadNpmTasks('grunt-antrol-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-clean');
		    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-rev');
    grunt.registerTask('build', [
    	'clean:pre'
    	,'transport' 
    	,'cmdconcat'
    	,'useminPrepare'
	    ,'copy'
	    ,'cssmin'
	    ,'rev'
    	,'usemin'
    	,'uglify'
    	,'imagemin'
    	,'htmlmin'
    	, 'clean:post'
    ]);
    
}
