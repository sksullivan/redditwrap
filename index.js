r = require('rereddit');
sys = require("sys");
http = require("http");

http.createServer(function(req,res){
	r.read('funny').limit(1)
    .end(function(err, posts) {
    	sys.puts(posts[0]);
        res.write("zolo");
    });
	res.end();
}).listen(8080);
sys.puts("Server Running on 8080");