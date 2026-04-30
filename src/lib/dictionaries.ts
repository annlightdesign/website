export const categoryTranslations: Record<string, string> = {
  "שקועי תקרה": "Recessed Ceiling",
  "תאורה מגנטית": "Magnetic Lighting",
  "פרופילי תאורה": "Lighting Profiles",
  "מנורות תלייה": "Pendant Lights",
  "צמודי תקרה": "Ceiling Flush Mounts",
  "מנורת קיר": "Wall Lamps",
  "שקועי קיר": "Recessed Wall Lights",
  "פסי אמבטיה": "Bathroom Strips",
  "מראות מוארות": "Illuminated Mirrors",
  "גופי תאורה בייצור מיוחד": "Custom Lighting",
  "מנורות עמידה / שולחן": "Floor Table Lamps",
  "גופי תאורה חוץ": "Outdoor Lighting",
  "ריהוט גן מואר": "Illuminated Garden Furniture",
  "מאווררי תקרה": "Ceiling Fans"
};

export const specKeyTranslations: Record<string, string> = {
  "צבע": "Color",
  "גוון אור": "Light Tone (Kelvin)",
  "הספק": "Wattage",
  "קוטר": "Diameter",
  "עומק": "Depth",
  "קדח": "Cut-out",
  "חומר": "Material",
  "מתח": "Voltage",
  "ערך IP": "IP Rating",
  "ערך Lumen": "Lumen",
  "ערך CRI": "CRI",
  "זווית הארה": "Beam Angle",
  "סוג לד": "LED Type",
  "סוג דרייבר": "Driver Type",
  "בית נורה": "Bulb Holder",
  "ניתן לעמעום": "Dimmable",
  "גובה": "Height",
  "חיפוי": "Diffuser",
  "IP": "IP Rating",
  "מידות": "Dimensions",
  "צבעים": "Colors",
  "לומן/Lumen": "Lumen",
  "נורה/הספק": "Bulb/Wattage"
};

export const specValueTranslations: Record<string, string> = {
  "אלומיניום": "Aluminum",
  "ברזל": "Iron",
  "זכוכית": "Glass",
  "פליז": "Brass",
  "שחור": "Black",
  "לבן": "White",
  "כסף": "Silver",
  "זהב": "Gold",
  "זהב מט": "Matte Gold",
  "פליז מושחר": "Blackened Brass",
  "לא": "No",
  "כן": "Yes",
  "לד מובנה": "Built-in LED",
  "בז׳": "Beige",
  "אדום": "Red",
  "כחול": "Blue",
  "ירוק": "Green",
  "לבן ושחור": "White & Black",
  "שחור ולבן": "Black & White",
  "פוליקרבונט": "Polycarbonate"
};

export function translateCategory(name: string, locale: string): string {
  if (locale !== 'en') return name;
  return categoryTranslations[name] || name;
}

export function translateSpecKey(key: string, locale: string): string {
  if (locale !== 'en') return key;
  return specKeyTranslations[key] || key;
}

export function translateSpecValue(value: string, locale: string): string {
  if (locale !== 'en') return value;
  // Handle multiple values separated by commas or slashes (e.g. "שחור / לבן" or "שחור, לבן")
  if (value.includes(",") || value.includes("/")) {
    const separator = value.includes("/") ? " / " : ", ";
    const tokens = value.includes("/") ? value.split("/") : value.split(",");
    return tokens.map(v => translateSpecValue(v.trim(), locale)).join(separator);
  }
  let translatedValue = specValueTranslations[value] || value;
  if (typeof translatedValue === 'string') {
    translatedValue = translatedValue.replace(/מ"מ/g, 'mm');
  }
  return translatedValue;
}
