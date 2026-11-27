"""Check a host's callable Pushwing catalog, not just MCP server discovery."""
import argparse
import json
from pathlib import Path


def check_inventory(inventory, expected):
    if not isinstance(inventory, list):
        raise ValueError('Inventory must be a JSON array of tool names or {name, callable} records')
    names = []
    unavailable = []
    for entry in inventory:
        name = entry if isinstance(entry, str) else entry.get('name') if isinstance(entry, dict) else None
        if not isinstance(name, str):
            raise ValueError('Every inventory entry must have a string tool name')
        if name.startswith('mcp__codex_apps__pushwing_'):
            name = name.removeprefix('mcp__codex_apps__pushwing_')
        elif name.startswith('mcp__'):
            name = name.rsplit('__', 1)[-1]
        if not name.startswith('pushwing_'):
            continue
        names.append(name)
        if isinstance(entry, dict) and entry.get('callable', True) is not True:
            unavailable.append(name)
    missing = sorted(set(expected) - set(names))
    duplicates = sorted(name for name in set(names) if names.count(name) > 1)
    if missing or unavailable or duplicates:
        raise ValueError(json.dumps({'visible': len(names), 'required': len(expected), 'missing': missing, 'notCallable': unavailable, 'duplicates': duplicates}))
    return {'visible': len(names), 'required': len(expected), 'extra': sorted(set(names) - set(expected))}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('inventory', type=Path)
    parser.add_argument('--expected', type=Path, default=Path(__file__).with_name('expected-tools.json'))
    args = parser.parse_args()
    try:
        result = check_inventory(json.loads(args.inventory.read_text()), json.loads(args.expected.read_text())['tools'])
    except (ValueError, OSError) as error:
        parser.exit(1, f'Discovery incomplete: {error}\n')
    print(json.dumps(result))
