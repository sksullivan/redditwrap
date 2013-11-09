import praw
from threading import Thread
from SocketServer import ThreadingMixIn
from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler
from urlparse import parse_qs
from cgi import parse_header, parse_multipart


class Handler(BaseHTTPRequestHandler):
	def do_GET(self):
		self.send_response(200)
		self.send_header("Content-type", "text/plain")
		self.end_headers()
		if self.path=="/slutty":
			print "you\'re at slutty"
			self.wfile.write("<hr>")
		else:
			print "you\'re at home!"
		r = praw.Reddit(user_agent='redditrap')
		submissions = r.get_subreddit('funny').get_hot(limit=5)
		for post in submissions:
			self.wfile.write(str(post)+"\n")

	def do_POST(self):
		postvars = self.parse_POST()
		print postvars;
		return postvars;

	def parse_POST(self):
		ctype, pdict = parse_header(self.headers['content-type'])
		if ctype == 'multipart/form-data':
			postvars = parse_multipart(self.rfile, pdict)
		elif ctype == 'application/x-www-form-urlencoded':
			length = int(self.headers['content-length'])
			postvars = parse_qs(
			self.rfile.read(length), 
			keep_blank_values=1)
		else:
			postvars = {}
		self.wfile.write("plootis")
		return postvars

class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
	pass

def serve_on_port(port):
	server = ThreadingHTTPServer(("localhost",port), Handler)
	server.serve_forever()

Thread(target=serve_on_port, args=[1111]).start()
serve_on_port(2222)