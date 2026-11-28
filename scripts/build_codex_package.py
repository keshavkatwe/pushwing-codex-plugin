"""Generate the ready-to-install native Codex package from the portable source."""
import argparse
import json
from pathlib import Path


def package_files(root):
    source = root/'plugins/pushwing'
    manifest = json.loads((source/'plugin.json').read_text())
    host = manifest['extensions']['com.openai']
    native = {key: manifest[key] for key in (
        'name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords'
    )}
    native.update({
        'skills': './skills', 'mcpServers': './mcp.json', 'interface': host['interface'],
        'extensions': {'com.openai': {'onboardingSkill': host['onboardingSkill']}},
    })
    files = {p.relative_to(source): p.read_bytes() for p in source.rglob('*')
             if p.is_file() and p.relative_to(source) != Path('plugin.json')}
    files[Path('.codex-plugin/plugin.json')] = (json.dumps(native, indent=2)+'\n').encode()
    return files


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    target = root/'plugins/pushwing-codex'
    expected = package_files(root)
    actual = {p.relative_to(target): p for p in target.rglob('*') if p.is_file()}
    if args.check:
        assert set(actual) == set(expected), 'Run python3 scripts/build_codex_package.py'
        assert all(actual[p].read_bytes() == content for p, content in expected.items()), 'Native package differs from portable source; regenerate it'
    else:
        for path in set(actual)-set(expected):
            actual[path].unlink()
        for path, content in expected.items():
            output = target/path
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(content)
    print(f'Native Codex package {"checked" if args.check else "generated"}: {len(expected)} files')


if __name__ == '__main__':
    main()
