import re
import json
from deep_translator import GoogleTranslator

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the output_descriptions object
    match = re.search(r'export const output_descriptions = \{(.*?)\};?\s*$', content, re.DOTALL | re.MULTILINE)
    if not match:
        print(f"Could not find output_descriptions in {filepath}")
        return

    obj_str = match.group(1)
    
    # Parse the keys and values. The format is "key": `value`,
    pattern = re.compile(r'"([^"]+)"\s*:\s*`([^`]*)`', re.DOTALL)
    entries = pattern.findall(obj_str)
    
    en_dict = {}
    hi_dict = {}
    
    translator = GoogleTranslator(source='en', target='hi')
    
    print(f"Translating {len(entries)} entries for {filepath}...")
    for key, val in entries:
        en_dict[key] = val
        # translate
        translated = translator.translate(val)
        hi_dict[key] = translated
        print(f"  Translated {key}")

    # Build the new JS code
    new_obj_str = "export const output_descriptions = {\n"
    
    # English
    new_obj_str += '  en: {\n'
    for k, v in en_dict.items():
        v_clean = v.replace('`', '\\`')
        new_obj_str += f'    "{k}": `{v_clean}`,\n'
    new_obj_str += '  },\n'
    
    # Hindi
    new_obj_str += '  hi: {\n'
    for k, v in hi_dict.items():
        v_clean = v.replace('`', '\\`')
        new_obj_str += f'    "{k}": `{v_clean}`,\n'
    new_obj_str += '  }\n'
    
    new_obj_str += "}\n"
    
    new_content = content[:match.start()] + new_obj_str + content[match.end():]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {filepath} successfully.")

process_file(r'e:\Major_Project\Frontend\src\components\crop\CropOutputs.jsx')
process_file(r'e:\Major_Project\Frontend\src\components\fertilizer\FertilizerOutputs.jsx')

