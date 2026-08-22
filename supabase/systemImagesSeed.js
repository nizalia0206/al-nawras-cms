// DEPRECATED — no longer used by supabase/seed.js.
// These paths assumed the systems gallery images lived under
// nawras-website-final/public/assets/systems/, but they never did (they're
// bundled from src/assets/systems/ instead), so any site seeded from this
// file served 404s for every systems gallery image.
// Use `supabase/uploadSystemImages.js` instead — it uploads the real files
// to Supabase storage and writes correct public URLs.
const S = "/assets/systems/";

export const SYSTEM_IMAGES_SEED = [
  // ---- fire-fighting (grouped) ----
  { system_key: "fire-fighting", group_title: "Fire Pump Sets", group_order: 0, sort_order: 0, name: "Complete Fire Pump Set", src: S + "fire-pump/Fire_pump_set.png" },
  { system_key: "fire-fighting", group_title: "Fire Pump Sets", group_order: 0, sort_order: 1, name: "Diesel Engine-Driven Fire Pump", src: S + "fire-pump/Diesel_Engine_Driven_Fire_Pump.png" },
  { system_key: "fire-fighting", group_title: "Fire Pump Sets", group_order: 0, sort_order: 2, name: "Electric Motor-Driven Fire Pump", src: S + "fire-pump/Electric_Motor_Driven_Fire_Pump.png" },
  { system_key: "fire-fighting", group_title: "Fire Pump Sets", group_order: 0, sort_order: 3, name: "Vertical Turbine Fire Pump", src: S + "fire-pump/Vertical_Turbine_Fire_Pump.png" },

  { system_key: "fire-fighting", group_title: "Hose Reels, Hydrants & Risers", group_order: 1, sort_order: 0, name: "Fire Hose Reel & Cabinets", src: S + "fire-fighting/Fire_Hose_Reel_and_Cabinets.png" },
  { system_key: "fire-fighting", group_title: "Hose Reels, Hydrants & Risers", group_order: 1, sort_order: 1, name: "Fire Hydrants", src: S + "fire-fighting/Fire_hydrant.png" },
  { system_key: "fire-fighting", group_title: "Hose Reels, Hydrants & Risers", group_order: 1, sort_order: 2, name: "Landing Valves", src: S + "fire-fighting/Landing_valve.png" },
  { system_key: "fire-fighting", group_title: "Hose Reels, Hydrants & Risers", group_order: 1, sort_order: 3, name: "Dry & Wet Riser Systems", src: S + "fire-fighting/Dry_wet_riser_systems.png" },
  { system_key: "fire-fighting", group_title: "Hose Reels, Hydrants & Risers", group_order: 1, sort_order: 4, name: "Automatic Sprinklers", src: S + "fire-fighting/Sprinklers.png" },

  { system_key: "fire-fighting", group_title: "Suppression & Extinguishers", group_order: 2, sort_order: 0, name: "Suppression Cylinders", src: S + "fire-suppression/fs1.png" },
  { system_key: "fire-fighting", group_title: "Suppression & Extinguishers", group_order: 2, sort_order: 1, name: "Nozzles & Manifolds", src: S + "fire-suppression/fs2.png" },
  { system_key: "fire-fighting", group_title: "Suppression & Extinguishers", group_order: 2, sort_order: 2, name: "Suppression Control Panel", src: S + "fire-suppression/fs3.png" },
  { system_key: "fire-fighting", group_title: "Suppression & Extinguishers", group_order: 2, sort_order: 3, name: "Detection & Release Devices", src: S + "fire-suppression/fs4.png" },
  { system_key: "fire-fighting", group_title: "Suppression & Extinguishers", group_order: 2, sort_order: 4, name: "Portable Fire Extinguishers", src: S + "fire-extinguisher/Fire_extinguisher.png" },

  // ---- fire-alarm ----
  { system_key: "fire-alarm", group_title: "", group_order: 0, sort_order: 0, name: "Addressable Fire Alarm Control Panel", src: S + "fire-alarm/fe1.png" },
  { system_key: "fire-alarm", group_title: "", group_order: 0, sort_order: 1, name: "Smoke Detectors & Notification Devices", src: S + "fire-alarm/fe2.png" },

  // ---- voice-evacuation ----
  { system_key: "voice-evacuation", group_title: "", group_order: 0, sort_order: 0, name: "Ceiling & Wall Speakers", src: S + "public-address/pas1.png" },
  { system_key: "voice-evacuation", group_title: "", group_order: 0, sort_order: 1, name: "PA Amplifiers & Control Rack", src: S + "public-address/pas2.png" },

  // ---- emergency-lighting ----
  { system_key: "emergency-lighting", group_title: "", group_order: 0, sort_order: 0, name: "Central Battery System Panel", src: S + "emergency-light/el1.png" },
  { system_key: "emergency-lighting", group_title: "", group_order: 0, sort_order: 1, name: "Exit & Emergency Luminaires", src: S + "emergency-light/el2.png" },
  { system_key: "emergency-lighting", group_title: "", group_order: 0, sort_order: 2, name: "Emergency Bulkhead Luminaires", src: S + "emergency-light/el3.png" },

  // ---- elv ----
  { system_key: "elv", group_title: "", group_order: 0, sort_order: 0, name: "Access Control Readers & Turnstiles", src: S + "access-control/acs1.png" },
  { system_key: "elv", group_title: "", group_order: 0, sort_order: 1, name: "Dome & Bullet Cameras", src: S + "cctv/cc1.png" },
  { system_key: "elv", group_title: "", group_order: 0, sort_order: 2, name: "PTZ & NVR Camera Systems", src: S + "cctv/cc2.png" },

  // ---- smoke-management ----
  { system_key: "smoke-management", group_title: "", group_order: 0, sort_order: 0, name: "Fire & Smoke Dampers", src: S + "smoke-management/sms1.png" },
  { system_key: "smoke-management", group_title: "", group_order: 0, sort_order: 1, name: "Damper Actuators", src: S + "smoke-management/sms2.png" },
  { system_key: "smoke-management", group_title: "", group_order: 0, sort_order: 2, name: "Smoke Extraction Fans", src: S + "smoke-management/sms3.png" },
  { system_key: "smoke-management", group_title: "", group_order: 0, sort_order: 3, name: "Smoke Control Panel", src: S + "smoke-management/sms4.png" },
  { system_key: "smoke-management", group_title: "", group_order: 0, sort_order: 4, name: "Ductwork & Louvres", src: S + "smoke-management/sms5.png" },
];