import praw
from threading import Thread
from SocketServer import ThreadingMixIn
from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler
from urlparse import parse_qs,urlparse
from cgi import parse_header, parse_multipart
import sys
from pprint import pprint
import json


class Handler(BaseHTTPRequestHandler):
	def do_GET(self):
		self.send_response(200)
		self.send_header('Access-Control-Allow-Origin', '*')
		self.end_headers()
		params = parse_qs(self.path[self.path.find('?')+1:])
		if self.path=="/sub":
			pass
		elif self.path=="/posts":
			print "Getting Reddit Posts\n\n"
			r = praw.Reddit(user_agent='redditwrap')
			submissions = r.get_subreddit('funny').get_hot(limit=5)
			res = []
			for post in submissions:
				res.append({
					'num_comments': post.num_comments,
					'url': post.url,
					'title': post.title,
					'user': str(post.author),
					'subreddit': str(post.subreddit),
					'time': post.created_utc,
					'nsfw': post.over_18
				})
			self.wfile.write(json.dumps(res))
		elif self.path.find("/login") != -1:
			username = params['username'][0]
			password = params['password'][0]
			r = praw.Reddit(user_agent='redditwrap')
			r.login(username, password)
			submissions = r.get_subreddit('test').get_hot(limit=5)
			submissionsList = list(submissions)
			submissionsList[0].add_comment('hello world!')

	def do_POST(self):
		postvars = self.parse_POST()
		print postvars

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
		self.wfile.write(self.path)
		return postvars

class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
	pass

def serve_on_port(port):
	server = ThreadingHTTPServer(("localhost",port), Handler)
	server.serve_forever()

Thread(target=serve_on_port, args=[1111]).start()
serve_on_port(3333)