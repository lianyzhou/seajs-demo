module.exports = function(grunt){

	var transport = require('grunt-antrol-transport');
	
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);
	

    grunt.initConfig({
    	transport :  {
    		options : {
    			paths : ["resources"],
    			parsers : {
                    '.js' : [script.jsParser],
                    '.css' : [style.css2jsParser],
                    '.tpl' : [text.html2jsParser]
                },
                debug : false
    		},
    		dest : {
	            files: [{
	                cwd: 'resources',
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
            html: './main.html',
            options: {
                dest: 'dist'
            }
        },
        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
        	html: ['dist/main.html'],
            css: ['css/{,*/}*.css'],
            options: {
                assetsDirs: ['dist']
            }
        },
    	copy : {
    		dest : {
    			files : [
                    {
                        expand: true,
                        cwd: './resources/css',
                        dest: '.tmp/css/',
                        src: '{,*/}*.*'
                    },
	    			{
	    				cwd : './resources',
	    				src : [
	    					'lib/sea/{,*/}*.js',
	                        'lib/jquery.js',
	                        'lib/sea.js'
	    				],
	    				expand : true,
	    				dot: true,
	    				dest : 'dist'
	    			}
	    		]
    		}
    	},
    	clean : {
    		dest : [".tmp"]
    	}
    });

    grunt.loadNpmTasks('grunt-antrol-transport');
    grunt.loadNpmTasks('grunt-antrol-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-clean');
		    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-rev');
    
    grunt.registerTask('build', [
    
    	'transport' 
    	,'cmdconcat'
    	,'copy'
    	
    	,'useminPrepare'
    	,'concat'
	    ,'cssmin'
	    ,'uglify'
	    ,'rev'
    	,'usemin'
    	
    	//, 'clean'
    ]);
    
}