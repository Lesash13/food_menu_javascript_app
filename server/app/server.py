#!/usr/bin/env python3

from http.server import BaseHTTPRequestHandler, HTTPServer
import logging

class S(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

    def do_GET(self):
        logging.info("GET request:")
#         logging.info("Headers:\n%s\n", str(self.headers))
        self._set_response()

    def do_POST(self):
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        post_data = self.rfile.read(content_length) # <--- Gets the data itself
        logging.info("POST request:")
#         logging.info("Headers:\n%s\n", str(self.headers))
        logging.info("Body:\n%s\n", post_data.decode('utf-8'))
        self._set_response()

def run(server_class=HTTPServer, handler_class=S, port=6544):
    logging.basicConfig(level=logging.INFO)
    server_address = ('', port)
    server = server_class(server_address, handler_class)
    logging.info('Start server...\n')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        logging.info('ctrl-c button was pressed')
    server.server_close()
    logging.info('Stop server...\n')

if __name__ == '__main__':
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()