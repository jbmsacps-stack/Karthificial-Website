from pathlib import Path

try:
    import tinycss2
    from tinycss2 import serialize
except ImportError:
    raise SystemExit("tinycss2 is required to run this validator. Install it with pip.")

path = Path(__file__).resolve().parent / 'style.css'
css = path.read_bytes()
errors = []

token_list, _ = tinycss2.parse_stylesheet_bytes(css, skip_whitespace=True, skip_comments=False)
for token in token_list:
    if getattr(token, 'type', None) == 'error':
        errors.append(f"line {token.source_line}, column {token.source_column}: {token.message}")

selectors = {}
for rule in token_list:
    if getattr(rule, 'type', None) == 'qualified-rule':
        selector = serialize(rule.prelude).strip()
        if selector:
            selectors.setdefault(selector, []).append(rule.source_line)

duplicate_selectors = {sel: locs for sel, locs in selectors.items() if len(locs) > 1}

print('ERRORS:')
if errors:
    for e in errors:
        print(e)
else:
    print('NO_ERRORS')

if duplicate_selectors:
    print('\nDUPLICATE SELECTORS:')
    for sel, locs in sorted(duplicate_selectors.items(), key=lambda item: item[1][0]):
        print(f"{sel!r} at lines {locs[:10]}")
