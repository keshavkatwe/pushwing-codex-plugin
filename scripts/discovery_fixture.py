"""Loopback-only MCP/model fixtures. No provider handlers or real model calls."""
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread


class Fixture:
    def __init__(self, names, page_size):
        self.names = names
        self.page_size = page_size
        self.mcp_requests = []
        self.model_requests = []
        self.catalog = []
        for name in names:
            schema = {'type': 'object', 'properties': {}, 'additionalProperties': False}
            if name in ('pushwing_prepare_publish_preview', 'pushwing_save_workspace_brand'):
                schema = {'type': 'object', 'properties': {'nested': schema}}
                for _ in range(6):
                    schema = {'type': 'object', 'properties': {'nested': schema}}
            self.catalog.append({'name': name, 'description': 'Discovery-only test fixture; execution disabled.', 'inputSchema': schema})

    def __enter__(self):
        fixture = self

        class Handler(BaseHTTPRequestHandler):
            def log_message(self, *_):
                pass

            def reply(self, value, status=200):
                body = json.dumps(value).encode() if value is not None else b''
                self.send_response(status)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)

            def sse(self, events):
                self.send_response(200)
                self.send_header('Content-Type', 'text/event-stream')
                self.end_headers()
                for event in events:
                    self.wfile.write(('event: '+event['type']+'\ndata: '+json.dumps(event)+'\n\n').encode())

            def do_GET(self):
                self.reply({'object': 'list', 'data': []}, 200 if self.path.startswith('/v1/models') else 405)

            def do_POST(self):
                data = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
                if self.path == '/mcp':
                    fixture.mcp_requests.append(data)
                    if 'id' not in data:
                        return self.reply(None, 202)
                    method = data['method']
                    if method == 'initialize':
                        result = {'protocolVersion': '2025-06-18', 'capabilities': {'tools': {}}, 'serverInfo': {'name': 'pushwing-fixture', 'version': '1.0.0'}}
                    elif method == 'tools/list':
                        cursor = data.get('params', {}).get('cursor')
                        offset = int(cursor.split(':')[1]) if cursor else 0
                        result = {'tools': fixture.catalog[offset:offset+fixture.page_size]}
                        if offset+fixture.page_size < len(fixture.catalog):
                            result['nextCursor'] = f'fixture:{offset+fixture.page_size}'
                    elif method == 'ping':
                        result = {}
                    elif method in ('resources/list', 'resources/templates/list', 'prompts/list'):
                        result = {{'resources/list': 'resources', 'resources/templates/list': 'resourceTemplates', 'prompts/list': 'prompts'}[method]: []}
                    else:
                        return self.reply({'jsonrpc': '2.0', 'id': data['id'], 'error': {'code': -32601, 'message': 'Discovery-only fixture: tool execution disabled'}})
                    return self.reply({'jsonrpc': '2.0', 'id': data['id'], 'result': result})
                fixture.model_requests.append({'path': self.path, 'body': data})
                if self.path.startswith('/v1/responses'):
                    if len(fixture.model_requests) == 1:
                        code = 'text(ALL_TOOLS.filter(t => t.name.startsWith("mcp__") && t.name.includes("pushwing")).map(t => ({name:t.name,callable:typeof tools[t.name] === "function"})));'
                        item = {'id': 'ctc_fixture', 'type': 'custom_tool_call', 'call_id': 'call_fixture', 'name': 'exec', 'namespace': 'functions', 'input': code}
                    else:
                        item = {'id': 'msg_fixture', 'type': 'message', 'role': 'assistant', 'status': 'completed', 'content': [{'type': 'output_text', 'text': 'Discovery checked.', 'annotations': []}]}
                    response = {'id': 'resp_fixture', 'object': 'response', 'created_at': 0, 'status': 'completed', 'model': data.get('model'), 'output': [item], 'usage': {'input_tokens': 0, 'output_tokens': 0, 'total_tokens': 0}}
                    return self.sse([{'type': 'response.created', 'response': {**response, 'status': 'in_progress', 'output': []}}, {'type': 'response.output_item.added', 'output_index': 0, 'item': item}, {'type': 'response.output_item.done', 'output_index': 0, 'item': item}, {'type': 'response.completed', 'response': response}])
                if self.path.startswith('/v1/messages/count_tokens'):
                    return self.reply({'input_tokens': 0})
                if self.path.startswith('/v1/messages'):
                    message = {'id': 'msg_fixture', 'type': 'message', 'role': 'assistant', 'model': data.get('model'), 'content': [], 'stop_reason': None, 'stop_sequence': None, 'usage': {'input_tokens': 0, 'output_tokens': 0}}
                    if not data.get('stream'):
                        return self.reply({**message, 'content': [{'type': 'text', 'text': 'Discovery checked.'}], 'stop_reason': 'end_turn'})
                    return self.sse([{'type': 'message_start', 'message': message}, {'type': 'content_block_start', 'index': 0, 'content_block': {'type': 'text', 'text': ''}}, {'type': 'content_block_delta', 'index': 0, 'delta': {'type': 'text_delta', 'text': 'Discovery checked.'}}, {'type': 'content_block_stop', 'index': 0}, {'type': 'message_delta', 'delta': {'stop_reason': 'end_turn', 'stop_sequence': None}, 'usage': {'output_tokens': 0}}, {'type': 'message_stop'}])
                self.reply({'error': 'Unexpected fixture route'}, 404)

        self.server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        self.url = f'http://127.0.0.1:{self.server.server_port}'
        self.thread = Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        return self

    def __exit__(self, *_):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=5)
