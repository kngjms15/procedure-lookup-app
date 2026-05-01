export const procedures = [
  {
    name: "Hip Injection",
    modality: "PMI",
    clinics: ["BW", "MB", "CH"],
    bookingCategories: ["BasInj", "Bas/AdvInj"],
    notes: "Book based on clinic/radiologist availability.",
  },
  {
    name: "Shoulder Injection",
    modality: "PMI",
    clinics: ["BW", "MB", "CH"],
    bookingCategories: ["BasInj"],
    notes: "Can be ultrasound or fluoro guided depending on protocol.",
  },
  {
    name: "Wrist Arthrogram",
    modality: "Fluoro",
    clinics: ["MB"],
    bookingCategories: ["MR Arthro"],
    notes: "Confirm protocol before booking.",
  },
];
