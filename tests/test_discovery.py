import json
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from check_discovery import check_inventory

EXPECTED = json.loads((Path(__file__).resolve().parents[1] / 'scripts/expected-tools.json').read_text())['tools']


class DiscoveryContractTest(unittest.TestCase):
    def test_original_33_tool_catalog_is_rejected(self):
        inventory = [n for n in sorted(EXPECTED)[:35] if n not in ('pushwing_prepare_publish_preview', 'pushwing_save_workspace_brand')]
        self.assertEqual(len(inventory), 33)
        with self.assertRaisesRegex(ValueError, 'missing'):
            check_inventory(inventory, EXPECTED)

    def test_local_and_custom_connection_names_are_accepted(self):
        for prefix in ('mcp__pushwing__', 'mcp__plugin_pushwing_pushwing__', 'mcp__codex_apps__pushwing_'):
            with self.subTest(prefix=prefix):
                self.assertEqual(check_inventory([prefix+n for n in EXPECTED], EXPECTED)['required'], 97)

    def test_listed_but_uncallable_tool_is_rejected(self):
        records = [{'name': n, 'callable': n != 'pushwing_prepare_publish_preview'} for n in EXPECTED]
        with self.assertRaisesRegex(ValueError, 'notCallable'):
            check_inventory(records, EXPECTED)

    def test_missing_tool_cannot_be_replaced_by_duplicate(self):
        with self.assertRaisesRegex(ValueError, 'duplicates'):
            check_inventory(EXPECTED[:-1]+[EXPECTED[0]], EXPECTED)

    def test_compatible_new_tools_are_allowed(self):
        result = check_inventory(EXPECTED+['pushwing_future_tool'], EXPECTED)
        self.assertEqual(result['extra'], ['pushwing_future_tool'])


if __name__ == '__main__':
    unittest.main()
