#!/usr/bin/env python3
"""Local preview server. Run: python3 serve.py [port]"""
import functools, http.server, os, socketserver, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8787


class Handler(http.server.SimpleHTTPRequestHandler):
    """Serves clean URLs the way Vercel does: /contact -> contact.html"""

    def translate_path(self, path):
        p = path.split('?', 1)[0].split('#', 1)[0]
        rel = p.lstrip('/')
        full = os.path.join(ROOT, rel)
        if p in ('', '/'):
            return os.path.join(ROOT, 'index.html')
        if os.path.isdir(full):
            idx = os.path.join(full, 'index.html')
            if os.path.exists(idx):
                return idx
        if not os.path.exists(full) and os.path.exists(full + '.html'):
            return full + '.html'
        return full

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            page = os.path.join(ROOT, '404.html')
            if os.path.exists(page):
                body = open(page, 'rb').read()
                self.send_response(404)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
        super().send_error(code, message, explain)


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('', PORT), Handler) as httpd:
    print(f'Serving {ROOT} at http://localhost:{PORT}')
    httpd.serve_forever()
