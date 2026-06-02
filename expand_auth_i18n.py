import re
import json

new_en_data = {
    "profile": {
        "edit": "Edit Profile",
        "name": "Name",
        "enterName": "Enter name",
        "email": "Email",
        "farmerId": "Farmer ID",
        "save": "Save Changes"
    },
    "auth": {
        "login": "Login",
        "signup": "Signup",
        "email": "Email",
        "password": "Password",
        "enterEmail": "Enter your email",
        "enterPassword": "Enter your password",
        "noAccount": "Don't have an account? Signup here",
        "haveAccount": "Already have an account? Login here"
    }
}

new_hi_data = {
    "profile": {
        "edit": "प्रोफ़ाइल संपादित करें",
        "name": "नाम",
        "enterName": "नाम दर्ज करें",
        "email": "ईमेल",
        "farmerId": "किसान आईडी",
        "save": "परिवर्तन सहेजें"
    },
    "auth": {
        "login": "लॉग इन करें",
        "signup": "साइन अप करें",
        "email": "ईमेल",
        "password": "पासवर्ड",
        "enterEmail": "अपना ईमेल दर्ज करें",
        "enterPassword": "अपना पासवर्ड दर्ज करें",
        "noAccount": "खाता नहीं है? यहाँ साइन अप करें",
        "haveAccount": "क्या आपके पास पहले से खाता है? यहाँ लॉग इन करें"
    }
}

filepath = r'e:\Major_Project\Frontend\src\i18n.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

def dict_to_js_str(d, indent=8):
    s = ""
    ind = " " * indent
    for k, v in d.items():
        if isinstance(v, dict):
            s += f"{ind}{k}: {{\n{dict_to_js_str(v, indent+2)}{ind}}},\n"
        else:
            v_safe = v.replace('"', '\\"')
            s += f'{ind}{k}: "{v_safe}",\n'
    return s

en_js = dict_to_js_str(new_en_data)
hi_js = dict_to_js_str(new_hi_data)

en_insert = re.search(r'fertForm:\s*\{.*?getRecommendation:\s*"[^"]*"\s*\}', content, re.DOTALL)
if en_insert:
    pos = en_insert.end()
    content = content[:pos] + ",\n" + en_js + content[pos:]

hi_insert = re.search(r'fertForm:\s*\{.*?getRecommendation:\s*"[^"]*"\s*\}.*?fertForm:\s*\{.*?getRecommendation:\s*"[^"]*"\s*\}', content, re.DOTALL)
if hi_insert:
    pos = hi_insert.end()
    content = content[:pos] + ",\n" + hi_js + content[pos:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated i18n.js successfully with profile and auth!")
