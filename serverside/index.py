import praw
#import socket, ssl
from threading import Thread
from SocketServer import ThreadingMixIn
from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler
from urlparse import parse_qs,urlparse
from cgi import parse_header, parse_multipart
from pprint import pprint
import json


class Handler(BaseHTTPRequestHandler):
	def do_GET(self):
		self.send_response(200)
		self.send_header('Access-Control-Allow-Origin', '*')
		self.end_headers()
		params = parse_qs(self.path[self.path.find('?')+1:])
		r = praw.Reddit(user_agent='redditwrap, a simple Reddit UI wrapper. v1.0')
		if len(params) == 0:
			return
		req = params['req'][0]

		if req == "topComment":
			submission = r.get_submission(submission_id=params['id'][0])
			self.wfile.write(json.dumps({'comment': str(submission.comments[0]), 'author': str(submission.comments[0].author)}))

		if req == "comments":
			submission = r.get_submission(submission_id=params['id'][0])
			comments = []
			self.getComments(comments,submission.comments,0)
			self.wfile.write(json.dumps(comments))

		if req == "rawComments":
			res = []
			for comment in r.get_submission(submission_id='1qacov').comments:
				res.append(json.dumps(str(comment)))
			self.wfile.write(res)

		elif req == "submit":
			submissions = r.get_subreddit('test').get_hot(limit=5)
			modhash = params['modhash'][0]
			user = params['user'][0]
			r._authentication = True
			r.modhash = modhash
			r.user = r.get_redditor(user)
			pprint(vars(r))
			comment = params['c'][0]
			submissionsList = list(submissions)
			submissionsList[0].add_comment(comment)

		elif req == "posts":
			print "Getting Reddit Posts"
			sub = params['sub'][0]
			sorter = params['sort'][0]
			lim = params['limit'][0]
			if sub == "front":
				submissions = r.get_front_page()
			else:
				if sorter == 'hot':
					submissions = r.get_subreddit(sub).get_hot(limit=lim)
				elif sorter == 'top':
					submissions = r.get_subreddit(sub).get_top(limit=lim)
				elif sorter == 'new':
					submissions = r.get_subreddit(sub).get_new(limit=lim)
				elif sorter == 'controversial': 
					submissions = r.get_subreddit(sub).get_controversial(limit=lim)
				elif sorter == 'gilded':
					submissions = r.get_subreddit(sub).get_gilded(limit=lim)
				elif sorter == 'rising':
					submissions = r.get_subreddit(sub).get_rising(limit=lim)
				else:
					submissions = r.get_subreddit(sub).get_hot(limit=lim)
			res = []
			for post in submissions:
				res.append({
					'num_comments': post.num_comments,
					'url': post.url,
					'title': post.title,
					'user': str(post.author),
					'subreddit': str(post.subreddit),
					'time': post.created_utc,
					'nsfw': post.over_18,
					'id': post.id
				})
			self.wfile.write(json.dumps(res))

	def do_POST(self):
		postvars = self.parse_POST()
		print postvars

	def parse_POST(self):
		r = praw.Reddit(user_agent='redditwrap, a simple Reddit UI wrapper. v1.0')
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
		req = postvars['req'][0]
		
		if req == "login":
			username = postvars['usr'][0]
			password = postvars['pwd'][0]
			r.login(username, password)
			self.wfile.write(json.dumps(r.modhash))
		else:
			pass

	def getComments(self,holder,comments,level):
		if comments == None:
			return
		else:
			for comment in comments:
				if isinstance(comment, praw.objects.Comment):
					holder.append({'comment':str(comment),'level':level})
					self.getComments(holder,comment._replies,level+1)

class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
	pass

def serve_on_port(port):
	server = ThreadingHTTPServer(("172.16.113.241",port), Handler)
	#server = ThreadingHTTPServer(("localhost",port), Handler)
	server.serve_forever()

Thread(target=serve_on_port, args=[1111]).start()
serve_on_port(2222)