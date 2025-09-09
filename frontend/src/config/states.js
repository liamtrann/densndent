// src/config/states.js

// Canonical lookups (lowercased names → 2-letter codes)
const stateMappings = {
  ca: {
    ontario: "ON",
    quebec: "QC",
    "british columbia": "BC",
    alberta: "AB",
    saskatchewan: "SK",
    manitoba: "MB",
    "new brunswick": "NB",
    "nova scotia": "NS",
    "prince edward island": "PE",
    "newfoundland and labrador": "NL",
    yukon: "YT",
    "northwest territories": "NT",
    nunavut: "NU",
  },
  us: {
    alabama: "AL",
    alaska: "AK",
    arizona: "AZ",
    arkansas: "AR",
    california: "CA",
    colorado: "CO",
    connecticut: "CT",
    delaware: "DE",
    florida: "FL",
    georgia: "GA",
    hawaii: "HI",
    idaho: "ID",
    illinois: "IL",
    indiana: "IN",
    iowa: "IA",
    kansas: "KS",
    kentucky: "KY",
    louisiana: "LA",
    maine: "ME",
    maryland: "MD",
    massachusetts: "MA",
    michigan: "MI",
    minnesota: "MN",
    mississippi: "MS",
    missouri: "MO",
    montana: "MT",
    nebraska: "NE",
    nevada: "NV",
    "new hampshire": "NH",
    "new jersey": "NJ",
    "new mexico": "NM",
    "new york": "NY",
    "north carolina": "NC",
    "north dakota": "ND",
    ohio: "OH",
    oklahoma: "OK",
    oregon: "OR",
    pennsylvania: "PA",
    "rhode island": "RI",
    "south carolina": "SC",
    "south dakota": "SD",
    tennessee: "TN",
    texas: "TX",
    utah: "UT",
    vermont: "VT",
    virginia: "VA",
    washington: "WA",
    "west virginia": "WV",
    wisconsin: "WI",
    wyoming: "WY",
  },
};

















































export default stateMappings;

/* ---------- helpers you can import ---------- */

// Title-case for display labels
const toTitle = (s = "") =>
  s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1));

/** Return [{label:'Ontario (ON)', value:'ON'}, ...] for a country code ('ca'|'us') */
export function getStateOptions(country = "ca") {
  const map = stateMappings[country] || {};
  return [
    { label: "-- Select --", value: "" },
    ...Object.entries(map).map(([name, abbr]) => ({
      label: `${toTitle(name)} (${abbr})`,
      value: abbr,
    })),
  ];
}

/** Normalize any user input (name or code) to the 2-letter code for a country. */
export function normalizeStateInput(country = "ca", input) {
  if (!input) return "";
  const map = stateMappings[country] || {};
  const lower = String(input).trim().toLowerCase();
  // already a name?
  if (map[lower]) return map[lower];
  // maybe it's a code
  const rev = Object.fromEntries(
    Object.entries(map).map(([name, abbr]) => [abbr.toLowerCase(), abbr])
  );
  return rev[lower] || String(input).toUpperCase();
}
