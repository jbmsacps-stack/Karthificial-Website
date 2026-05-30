import re
from pathlib import Path
p = Path('style.css')
text = p.read_text(encoding='utf-8')
text = re.sub(r'background:\s*transparent\s*\d+%\),\s*\n\s*linear-gradient\(', 'background: linear-gradient(', text)
text = text.replace(
    '    background: transparent 36%),\n         transparent 38%),\n        rgba(var(--black-rgb), 0.88) !important;\n',
    '    background: rgba(var(--black-rgb), 0.88) !important;\n'
)
text = text.replace(
    '    background: transparent 34%),\n         transparent 34%),\n        var(--surface-panel) !important;\n',
    '    background: var(--surface-panel) !important;\n'
)
text = text.replace(
    '    background: rgba(var(--gold-rgb), 0.08) 48%, var(--surface-panel-darker) 72%) !important;\n',
    '    background: linear-gradient(180deg, rgba(var(--gold-rgb), 0.08), var(--surface-panel-darker) 72%) !important;\n'
)
text = text.replace(
    '    background: rgba(var(--gold-rgb), 0.07) 48%, var(--surface-deep) 74%) !important;\n',
    '    background: linear-gradient(180deg, rgba(var(--gold-rgb), 0.07), var(--surface-deep) 74%) !important;\n'
)
text = text.replace(
    '    background: rgba(var(--gold-rgb), 0.08) 46%, var(--surface-deep) 72%);\n',
    '    background: linear-gradient(180deg, rgba(var(--gold-rgb), 0.08), var(--surface-deep) 72%);\n'
)
text = text.replace('var(--surface)111', 'var(--surface)')
text = text.replace('var(--surface)827', 'var(--surface)')
text = text.replace(
    '    background: transparent 34%),\n        linear-gradient(180deg, var(--surface-alt-3), var(--black-very-dark)) !important;\n',
    '    background: linear-gradient(180deg, var(--surface-alt-3), var(--black-very-dark)) !important;\n'
)
p.write_text(text, encoding='utf-8')
print('done')
