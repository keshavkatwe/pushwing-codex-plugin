"""Install a fixture copy through the native marketplace and check tool exposure."""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

from check_discovery import check_inventory
from discovery_fixture import Fixture


def run(command, cwd, env):
    result = subprocess.run(command, cwd=cwd, env=env, input='', capture_output=True, text=True, timeout=90)
    if result.returncode:
        raise RuntimeError(f'{command[0]} {command[1]} failed ({result.returncode}):\n{result.stdout[-3000:]}\n{result.stderr[-3000:]}')
    return result


def codex_inventory(root, temporary, fixture, env):
    home = temporary/'codex-home'
    home.mkdir()
    marketplace = temporary/'marketplace'
    package = marketplace/'plugins/pushwing'
    shutil.copytree(root/'plugins/pushwing', package)
    catalog = marketplace/'.agents/plugins'
    catalog.mkdir(parents=True)
    shutil.copyfile(root/'.agents/plugins/marketplace.json', catalog/'marketplace.json')
    path = package/'mcp.json'
    data = json.loads(path.read_text())
    assert data['mcpServers']['pushwing']['url'] == 'https://mcp.pushwing.com/mcp'
    data['mcpServers']['pushwing']['url'] = fixture.url+'/mcp'
    path.write_text(json.dumps(data))
    (home/'config.toml').write_text(f'''model = "gpt-6.1-sol"
model_provider = "fixture"
model_reasoning_effort = "low"
approval_policy = "never"
sandbox_mode = "read-only"
[features]
apps = false
plugins = true
shell_tool = false
computer_use = false
browser_use = false
enable_request_compression = false
skip_host_skill_discovery = true
code_mode = true
code_mode_only = true
[model_providers.fixture]
name = "Loopback fixture"
base_url = "{fixture.url}/v1"
wire_api = "responses"
requires_openai_auth = false
[projects.{json.dumps(str(temporary))}]
trust_level = "trusted"
''')
    env['CODEX_HOME'] = str(home)
    run(['codex', 'plugin', 'marketplace', 'add', str(marketplace), '--json'], temporary, env)
    run(['codex', 'plugin', 'add', 'pushwing@pushwing-plugins', '--json'], temporary, env)
    run(['codex', 'exec', '--ephemeral', '--skip-git-repo-check', '--json', '-C', str(temporary), 'Print the callable Pushwing tool inventory using functions.exec. Do not execute any MCP tools.'], temporary, env)
    for request in fixture.model_requests:
        for item in request['body'].get('input', []):
            if item.get('type') == 'custom_tool_call_output':
                for block in item.get('output', []):
                    text = block.get('text', '')
                    if block.get('type') == 'input_text' and text.startswith('[{"name":'):
                        return json.loads(text)
    raise RuntimeError('The native client did not return a code-mode inventory')


def claude_inventory(root, temporary, fixture, env):
    package = temporary/'marketplace'
    shutil.copytree(root, package, ignore=shutil.ignore_patterns('.git', '__pycache__'))
    path = package/'.mcp.json'
    data = json.loads(path.read_text())
    assert data['mcpServers']['pushwing']['url'] == 'https://mcp.pushwing.com/mcp'
    data['mcpServers']['pushwing']['url'] = fixture.url+'/mcp'
    path.write_text(json.dumps(data))
    env.update({'CLAUDE_CONFIG_DIR': str(temporary/'claude-home'), 'ANTHROPIC_API_KEY': 'discovery-fixture-not-a-real-key', 'ANTHROPIC_BASE_URL': fixture.url, 'ENABLE_TOOL_SEARCH': 'false', 'DISABLE_AUTOUPDATER': '1', 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC': '1'})
    run(['claude', 'plugin', 'marketplace', 'add', str(package), '--json'], temporary, env)
    run(['claude', 'plugin', 'install', 'pushwing@pushwing-plugins'], temporary, env)
    run(['claude', '--print', '--output-format', 'json', '--no-session-persistence', '--tools', 'Read', '--model', 'claude-sonnet-4-6', '--settings', '{"disableAllHooks":true}', 'This is a discovery-only fixture. Reply Discovery checked. Do not execute any tools.'], temporary, env)
    messages = [request['body'] for request in fixture.model_requests if request['path'].split('?')[0] == '/v1/messages']
    tools = [tool for tool in (messages[-1].get('tools', []) if messages else []) if tool.get('name', '').startswith('mcp__')]
    if not tools:
        raise RuntimeError('The native client did not advertise MCP tools to the model fixture')
    return sorted(set(tool['name'] for tool in tools))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host', choices=['codex', 'claude'], required=True)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    expected = json.loads(Path(__file__).with_name('expected-tools.json').read_text())['tools']
    # No credentials or user config are copied into either temporary client profile.
    env = {k:v for k,v in os.environ.items() if not k.startswith(('OPENAI_', 'ANTHROPIC_', 'CLAUDE_', 'CODEX_')) and k != 'CLAUDECODE'}
    for page_size in (35, 100):
        with tempfile.TemporaryDirectory(prefix='pushwing-discovery-') as folder, Fixture(expected, page_size) as fixture:
            temporary = Path(folder)
            inventory = (codex_inventory if args.host == 'codex' else claude_inventory)(root, temporary, fixture, env.copy())
            result = check_inventory(inventory, expected)
            methods = [request['method'] for request in fixture.mcp_requests]
            assert 'tools/call' not in methods, 'The discovery check must not execute tools'
            cursors = [request.get('params', {}).get('cursor') for request in fixture.mcp_requests if request['method']=='tools/list']
            assert cursors, 'No native MCP discovery request was observed'
            if page_size == 35:
                assert 'fixture:35' in cursors and 'fixture:70' in cursors, cursors
            print(json.dumps({'host': args.host, 'pageSize': page_size, **result, 'mcpToolCalls': 0, 'model': 'canned loopback fixture'}), flush=True)


if __name__ == '__main__':
    main()
