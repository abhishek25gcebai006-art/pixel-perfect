export const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function rupees(value: number | null | undefined) {
  return INR.format(Number(value ?? 0));
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export const DOC_TYPES = [
  "Aadhaar",
  "PAN",
  "Driving licence",
  "Vehicle RC",
  "Insurance",
  "Bank proof",
  "Platform document",
  "Other",
] as const;

export const DOC_STATUSES = ["verified", "pending", "expiring", "expired"] as const;
export type DocStatus = (typeof DOC_STATUSES)[number];

export const DOC_STATUS_LABEL: Record<string, string> = {
  verified: "Verified",
  pending: "Pending verification",
  expiring: "Expiring soon",
  expired: "Expired",
};

/** Expiry always wins over the stored verification status. */
export function effectiveDocStatus(status: string, expiry: string | null): DocStatus {
  if (expiry) {
    const days = daysUntil(expiry);
    if (days < 0) return "expired";
    if (days <= 30) return "expiring";
  }
  return status === "verified" ? "verified" : "pending";
}

export function daysUntil(date: string) {
  const target = new Date(date + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export const PLATFORM_NAMES = [
  "Zomato",
  "Swiggy",
  "Rapido",
  "Uber",
  "Ola",
  "Blinkit",
  "Zepto",
  "Porter",
  "Urban Company",
  "Other",
] as const;

export const GIG_CATEGORIES = [
  "Food delivery",
  "Quick commerce",
  "Bike taxi",
  "Ride-hailing",
  "Logistics",
  "Home services",
  "Other",
] as const;

export const LANGUAGES = [
  "English",
  "हिन्दी (Hindi)",
  "বাংলা (Bengali)",
  "मराठी (Marathi)",
  "தமிழ் (Tamil)",
  "తెలుగు (Telugu)",
  "ಕನ್ನಡ (Kannada)",
  "ગુજરાતી (Gujarati)",
] as const;

export const STATES = [
  "Delhi NCR",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "West Bengal",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "Kerala",
  "Punjab",
  "Other",
] as const;

export const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    blurb: "Everything you need to start keeping records.",
    features: [
      "Basic dashboard",
      "Earnings tracking",
      "Document management",
      "Basic benefits discovery",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    price: 149,
    blurb: "For workers juggling several platforms.",
    features: [
      "Advanced earnings analytics",
      "Benefits recommendations",
      "Document reminders",
      "Platform matching",
      "Priority support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 349,
    blurb: "Deeper insight into your money and paperwork.",
    features: [
      "Advanced financial insights",
      "Personalised benefits discovery",
      "Premium support",
      "Advanced reports",
    ],
  },
] as const;

export function startOfWeek(d = new Date()) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Monday first
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day);
  return date;
}

export function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}
