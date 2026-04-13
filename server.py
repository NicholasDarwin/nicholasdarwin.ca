#!/usr/bin/env python3
import http.server
import socketserver
import os
import mimetypes

class RewriteHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        # Get the request path
        path = self.path.split('?')[0]  # Remove query string
        print(f"DEBUG: Request path: {path}")
        
        # Map clean URLs to actual files
        file_map = {
            '/': 'index.html',
            '/experience': 'experience.html',
            '/projects': 'projects.html',
            '/contact': 'contact.html',
        }
        
        # Redirect /html/* URLs to home
        if path.startswith('/html/'):
            self.send_response(301)
            self.send_header('Location', '/')
            self.end_headers()
            return
        
        # Get the file to serve
        if path in file_map:
            filename = file_map[path]
        elif path.endswith('.html') or path.endswith('.js') or path.endswith('.css') or path.startswith('/assets'):
            # Allow direct access to .html, .js, .css files and assets
            filename = path.lstrip('/')
        else:
            # For anything else, serve index.html (SPA behavior)
            filename = 'index.html'
        
        print(f"DEBUG: Mapped to filename: {filename}")
        print(f"DEBUG: File exists: {os.path.isfile(filename)}")
        
        # Check if file exists
        if not os.path.isfile(filename):
            self.send_error(404, f'File not found: {filename}')
            return
        
        # Serve the file
        try:
            with open(filename, 'rb') as f:
                content = f.read()
            
            # Guess the content type
            mime_type, _ = mimetypes.guess_type(filename)
            if mime_type is None:
                mime_type = 'text/html'
            
            self.send_response(200)
            self.send_header('Content-type', mime_type)
            self.send_header('Content-length', len(content))
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, str(e))

if __name__ == '__main__':
    PORT = 8000
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    Handler = RewriteHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print(f"Working directory: {os.getcwd()}")
        print("Press Ctrl+C to stop")
        httpd.serve_forever()
