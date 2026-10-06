import {
  FaSquareInstagram,
  FaSquareFacebook,
  FaSquareYoutube,
  FaSquareWhatsapp,
} from "react-icons/fa6";

export const SHOP = {
  name: "Shree Dhandai Mata Mobile",
  short: "SDM Mobile",
  owner: "Pratik Patil",
  phone: "8856998493",
  wa: "https://wa.me/918856998493",
  youtube: "https://www.youtube.com/@SDM2436",
  insta: "https://instagram.com/shreedhandaimatamobile",
  facebook: "https://www.facebook.com/YOUR_PAGE_NAME", // <- apna real link daalo
  address:
    "Shop No 07, Ground Floor, Shyam Avenue, Opp. Navjivan Flat, Nr. Radhe Park, Old Asopalav Society Road, Vatva, Ahmedabad - 382440",
};

// Social links: yahin se manage karo (naya add karna ho to bas ek line jodo)
export const SOCIALS = [
  { label: "WhatsApp", href: SHOP.wa, Icon: FaSquareWhatsapp, color: "#25D366" },
  { label: "Instagram", href: SHOP.insta, Icon: FaSquareInstagram, color: "#E4405F" },
  { label: "YouTube", href: SHOP.youtube, Icon: FaSquareYoutube, color: "#FF0000" },
  { label: "Facebook", href: SHOP.facebook, Icon: FaSquareFacebook, color: "#1877F2" },
];

export const ISSUES = [
  "Broken glass & Display",
  "Battery replacement",
  "Water damage",
  "Phone unlock",
  "iPhone front & back glass",
  "All iPhone original batteries available",
  "Curved display front glass change",
  "All company mobile original parts available",
  "Other",
];

export const ISSUE_ICONS: Record<string, string> = {
  "Broken glass & Display": "💥",
  "Battery replacement": "🔋",
  "Water damage": "💧",
  "Phone unlock": "🔓",
  "iPhone front & back glass": "🍎",
  "All iPhone original batteries available": "🔋",
  "Curved display front glass change": "📲",
  "All company mobile original parts available": "✅",
  Other: "⚙️",
};

export const BRANDS = ["Samsung", "Oppo", "OnePlus", "Vivo", "Mi", "Techno","Poco","Infinix","Nothing","Apple","Other"];
export const BRAND_ICONS: Record<string, string> = {
  Samsung: "📱",
  Oppo: "📱",
  OnePlus: "📱",
  Vivo: "📱",
  Mi: "📱",
  Techno: "📱",
  Poco: "📱",
  Infinix: "📱",
  Nothing: "📱",
  Apple: "🍎",
  Other: "❓",
};

export const STATUSES = ["received", "diagnosing", "in repair", "ready for pickup", "delivered"];
export const STATUS_ICONS: Record<string, string> = {
  received: "📥",
  diagnosing: "🔍",
  "in repair": "🛠️",
  "ready for pickup": "✅",
  delivered: "🚚",
};