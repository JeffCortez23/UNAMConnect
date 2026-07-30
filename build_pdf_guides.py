import subprocess
import os
import re

def markdown_to_html(md_text, title):
    lines = md_text.split('\n')
    html_lines = []
    in_code = False
    code_buf = []

    for line in lines:
        if line.startswith('```'):
            if in_code:
                in_code = False
                code_content = '\n'.join(code_buf)
                code_buf = []
                html_lines.append(f'<pre><code>{code_content}</code></pre>')
            else:
                in_code = True
                code_buf = []
            continue

        if in_code:
            code_buf.append(line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))
            continue

        # Headers
        if line.startswith('# '):
            html_lines.append(f'<div class="header"><h1>{line[2:]}</h1><p>Documento de Sustentación Técnica para Exposición</p></div>')
        elif line.startswith('## '):
            html_lines.append(f'<h2>{line[3:]}</h2>')
        elif line.startswith('### '):
            html_lines.append(f'<h3>{line[4:]}</h3>')
        elif line.startswith('#### '):
            html_lines.append(f'<h4>{line[5:]}</h4>')
        elif line.startswith('> '):
            html_lines.append(f'<div class="quote">{line[2:]}</div>')
        elif line.startswith('* ') or line.startswith('- '):
            html_lines.append(f'<li>{line[2:]}</li>')
        elif line.startswith('---'):
            html_lines.append('<hr>')
        elif line.strip() == '':
            html_lines.append('<br>')
        else:
            html_lines.append(f'<p>{line}</p>')

    body_content = '\n'.join(html_lines)
    
    # Inline formatting
    body_content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', body_content)
    body_content = re.sub(r'\*(.*?)\*', r'<em>\1</em>', body_content)
    body_content = re.sub(r'`(.*?)`', r'<code>\1</code>', body_content)

    return f'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>{title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
  @page {{
    size: A4;
    margin: 15mm 15mm 15mm 15mm;
  }}
  body {{
    font-family: 'Outfit', sans-serif;
    color: #1e293b;
    line-height: 1.5;
    font-size: 12px;
  }}
  .header {{
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
    color: #ffffff;
    padding: 22px 28px;
    border-radius: 12px;
    margin-bottom: 20px;
  }}
  .header h1 {{
    margin: 0 0 4px 0;
    font-size: 24px;
    color: #38bdf8;
  }}
  .header p {{
    margin: 0;
    opacity: 0.9;
  }}
  h2 {{
    color: #0f172a;
    font-size: 16px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 4px;
    margin-top: 20px;
  }}
  h3 {{
    color: #0284c7;
    font-size: 14px;
    margin-top: 14px;
  }}
  code {{
    background: #f1f5f9;
    color: #0f172a;
    padding: 2px 5px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 11px;
  }}
  pre {{
    background: #0f172a;
    color: #e2e8f0;
    padding: 12px;
    border-radius: 8px;
    font-size: 11px;
    overflow-x: auto;
  }}
  pre code {{
    background: transparent;
    color: inherit;
    padding: 0;
  }}
  .quote {{
    background: #f0f9ff;
    border-left: 4px solid #0284c7;
    padding: 10px 14px;
    margin: 10px 0;
    font-style: italic;
    border-radius: 4px;
    color: #0369a1;
  }}
  li {{
    margin-bottom: 4px;
  }}
  hr {{
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 16px 0;
  }}
</style>
</head>
<body>
{body_content}
</body>
</html>'''

def build_pdf(md_file, pdf_file, title):
    with open(md_file, 'r', encoding='utf-8') as f:
        md_text = f.read()
    
    html_content = markdown_to_html(md_text, title)
    temp_html = f'temp_{pdf_file}.html'
    with open(temp_html, 'w', encoding='utf-8') as f:
        f.write(html_content)
        
    cmd = ['chromium', '--headless', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer', f'--print-to-pdf={pdf_file}', temp_html]
    subprocess.run(cmd, check=True)
    if os.path.exists(temp_html):
        os.remove(temp_html)
    print(f'PDF {pdf_file} generado exitosamente.')

if __name__ == '__main__':
    build_pdf('Guia_Exposicion_Frontend.md', 'Guia_Exposicion_Frontend.pdf', 'Guía de Exposición - Frontend')
    build_pdf('Guia_Exposicion_Backend.md', 'Guia_Exposicion_Backend.pdf', 'Guía de Exposición - Backend')
    build_pdf('Guia_Exposicion_Firebase_Render.md', 'Guia_Exposicion_Firebase_Render.pdf', 'Guía de Exposición - Firebase & Render')
