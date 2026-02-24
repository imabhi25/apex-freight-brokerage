import re

with open('app/quote/page.tsx', 'r') as f:
    content = f.read()

def replacer(match):
    prefix = match.group(1)
    delay_match = re.search(r'delay:\s*0\.1', match.group(0))
    
    amount = "0.1"
    
    if delay_match:
        transition = f"transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}"
    else:
        transition = f"transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}"
        
    return f"""{prefix}initial={{{{ opacity: 0, y: 30 }}}}
{prefix}whileInView={{{{ opacity: 1, y: 0 }}}}
{prefix}viewport={{{{ once: false, amount: {amount} }}}}
{prefix}{transition}"""

# regex to find motion.div transition blocks
pattern = r'([ \t]*)initial=\{\{\s*opacity:\s*0,\s*y:\s*\d+\s*\}\}\n[ \t]*whileInView=\{\{\s*opacity:\s*1,\s*y:\s*0\s*\}\}\n[ \t]*viewport=\{\{\s*once:\s*false,\s*amount:\s*0\.\d+\s*\}\}\n[ \t]*transition=\{\{.*?\}\}'

new_content = re.sub(pattern, replacer, content)

# Also add the separator to hazmat
hazmat_pattern = r'className="w-full relative z-0 mt-10"'
new_content = new_content.replace(hazmat_pattern, 'className="w-full relative z-0 mt-16 pt-16 border-t border-[#222]"')

# Make sure SDS text is clearly left-aligned under YES
sds_pattern = r'className="text-\[#888888\] text-\[11px\] font-sans font-light"'
new_content = new_content.replace(sds_pattern, 'className="text-[#888888] text-[11px] font-sans font-light text-left"')

with open('app/quote/page.tsx', 'w') as f:
    f.write(new_content)

print("Updated transitions and layout in page.tsx")
