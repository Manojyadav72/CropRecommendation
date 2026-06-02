import re
import json
from deep_translator import GoogleTranslator

# The base English dictionary to append
new_en_data = {
    "weather": {
        "liveConditions": "Live Weather Conditions",
        "fetching": "Fetching weather data...",
        "errorFetch": "Unable to fetch weather data",
        "tryAgain": "Try Again",
        "searchCity": "Search city in India...",
        "refresh": "Refresh weather",
        "cityNotFound": "City not found in India",
        "currentDetails": "Current Details",
        "humidity": "Humidity",
        "wind": "Wind",
        "rainfall": "Rainfall",
        "pressure": "Pressure",
        "forecastTitle": "5-Day Forecast",
        "today": "Today",
        "days": {
            "Mon": "Mon", "Tue": "Tue", "Wed": "Wed", "Thu": "Thu", "Fri": "Fri", "Sat": "Sat", "Sun": "Sun"
        },
        "insightHighRain": "High rainfall expected. Ensure proper drainage.",
        "insightHighWind": "Strong winds detected. Secure tall crops.",
        "insightHighTemp": "High temperature alert. Increase irrigation.",
        "insightHighHumid": "High humidity. Monitor fungal diseases.",
        "insightLowTemp": "Cool conditions. Protect crops.",
        "insightOptimal": "Optimal growing conditions!"
    },
    "mandi": {
        "title": "Live Mandi Prices",
        "desc": "Check the latest agricultural commodity prices across Indian markets",
        "state": "Select State",
        "district": "Select District",
        "crop": "Select Crop",
        "checkPrices": "Check Prices",
        "resultsTitle": "Market Prices",
        "commodity": "Commodity",
        "market": "Market",
        "minPrice": "Min Price",
        "maxPrice": "Max Price",
        "modalPrice": "Modal Price",
        "noData": "No data available"
    },
    "stats": {
        "crops": "Crop Varieties",
        "fertilizers": "Fertilizer Types",
        "farmers": "Farmers Helped",
        "accuracy": "Accuracy Rate"
    },
    "season": {
        "title": "Understanding Crop Seasons in India",
        "desc": "Choose the right crop based on the season for optimal yield",
        "kharif": "Kharif Crops",
        "kharifMonth": "June – October",
        "kharifDesc": "Grown during monsoon season. Requires high rainfall and warm climate.",
        "rabi": "Rabi Crops",
        "rabiMonth": "October – March",
        "rabiDesc": "Grown during winter season. Requires cool climate for growth.",
        "zaid": "Zaid Crops",
        "zaidMonth": "March – June",
        "zaidDesc": "Grown during summer season. Requires warm, dry weather.",
        "currentTag": "Current Season",
        "examples": "Examples:"
    },
    "cropForm": {
        "title": "AI Crop Recommendation",
        "desc": "Enter your soil parameters and let our machine learning model suggest the best crop for maximum yield.",
        "nitrogen": "Nitrogen (N)",
        "phosphorous": "Phosphorous (P)",
        "potassium": "Potassium (K)",
        "temperature": "Temperature (°C)",
        "humidity": "Humidity (%)",
        "ph": "Soil pH Level",
        "rainfall": "Rainfall (mm)",
        "getRecommendation": "Get Crop Recommendation"
    },
    "fertForm": {
        "title": "AI Fertilizer Recommendation",
        "desc": "Get personalized fertilizer suggestions based on your soil profile and target crop.",
        "cropType": "Crop Type",
        "selectCrop": "Select a crop...",
        "nitrogen": "Nitrogen (N) in Soil",
        "phosphorous": "Phosphorous (P) in Soil",
        "potassium": "Potassium (K) in Soil",
        "getRecommendation": "Get Fertilizer Recommendation"
    }
}

translator = GoogleTranslator(source='en', target='hi')

def translate_dict(d):
    res = {}
    for k, v in d.items():
        if isinstance(v, dict):
            res[k] = translate_dict(v)
        else:
            try:
                res[k] = translator.translate(v)
            except:
                res[k] = v
    return res

print("Translating dictionary to Hindi...")
new_hi_data = translate_dict(new_en_data)

# Read i18n.js
filepath = r'e:\Major_Project\Frontend\src\i18n.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to insert these properties inside resources.en.translation and resources.hi.translation
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

# Find the end of en.translation object
# It's tricky to parse JS with regex but we can just find 'result: {' block and insert after it.
# result block ends with '      },'
en_insert = re.search(r'tryAnotherFert:\s*"[^"]*"\s*\}', content)
if en_insert:
    # insert after this block
    pos = en_insert.end()
    content = content[:pos] + ",\n" + en_js + content[pos:]

hi_insert = re.search(r'tryAnotherFert:\s*"[^"]*"\s*\}.*?tryAnotherFert:\s*"[^"]*"\s*\}', content, re.DOTALL)
if hi_insert:
    pos = hi_insert.end()
    content = content[:pos] + ",\n" + hi_js + content[pos:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated i18n.js successfully!")
