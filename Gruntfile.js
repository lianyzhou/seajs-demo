module.exports = function(grunt){

	var transport = require('grunt-antrol-transport');
	
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);
	

    grunt.initConfig({
    	transport :  {
    		options : {
    			paths : ["js"],
    			parsers : {
                    '.js' : [script.jsParser],
                    '.css' : [style.css2jsParser],
                    '.tpl' : [text.html2jsParser]
                },
                debug : false
    		},
    		dest : {
	            files: [{
	                cwd: 'js',
	                src: '**/*',
	                filter : "isFile",
	                expand : true,
	                dest: 'tmp'
	            }]
	        }
    	},
    	concat : {
    		dest : {
    			options : {
    				paths : ["./tmp"],
    				include : "all"
    			},
    			files : [{
    				cwd : './tmp',
    				src : 'page/*.js',
    				expand : true,
    				dest : 'dist'
    			}]
    		}
    	}
    });

    grunt.loadNpmTasks('grunt-antrol-transport');
    grunt.loadNpmTasks('grunt-antrol-concat');
    
    grunt.registerTask('build', [
    	'transport:dest' 
    	,'concat'
    // 	, 'uglify'
    //	, 'clean'
    ]);
    
}