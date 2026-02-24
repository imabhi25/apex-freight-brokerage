import re

with open('app/quote/page.tsx', 'r') as f:
    text = f.read()

# Fix `transition={duration: ... }` -> `transition={{ duration: ... }}`
text = re.sub(r'transition=\{duration:\s*(.*?)\}', r'transition={{ duration: \1 }}', text)
text = re.sub(r'transition=\{\{\s*duration:\s*0\.8,\s*ease:\s*\[([^\]]+)\]\s*\}\s*\n', r'transition={{ duration: 0.8, ease: [\1] }}\n', text)
text = re.sub(r'transition=\{\s*duration:', r'transition={{ duration:', text)
text = re.sub(r'ease: \[0\.22, 1, 0\.36, 1\] \}', r'ease: [0.22, 1, 0.36, 1] }}', text)

# There is some weird indentation on className
# Let's just fix the double closing braces for transition
text = re.sub(r'\}\}\}', r'}}', text)

# Fix the specific L173-L175 area that was broken:
text = text.replace('transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}\n                className="mb-20 transition-opacity duration-500 ease-in-out opacity-100"\n                    >\n                <h1', 
                    'transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}\n                        className="mb-20 transition-opacity duration-500 ease-in-out opacity-100"\n                    >\n                        <h1')

with open('app/quote/page.tsx', 'w') as f:
    f.write(text)

