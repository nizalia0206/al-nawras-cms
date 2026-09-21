// Seed data for the `system_images` table — used by supabase/seed.js and
// supabase/seed-system-images.mjs.
//
// Pictures live in /public/assets/systems/<system-key>/ (square, white-background
// product shots — same files the public site uses). `src` here is the site-relative
// path; seed-system-images.mjs can upload them to Storage and store full URLs instead.
//
// `description` and `brand` need the two columns added by
// supabase/migrations/001_system_images_card_fields.sql.
const S = "/assets/systems/";

export const SYSTEM_IMAGES_SEED = [
  // ---- fire-fighting (grouped) ----
  { system_key: "fire-fighting", group_title: "Fire Pump Sets", group_order: 0, sort_order: 0, name: "Complete Fire Pump Set", description: "Fully assembled diesel/electric duty-standby pump skid, factory piped and tested.", brand: null, src: S + "fire-fighting/complete-fire-pump-set.jpg" },
  { system_key: "fire-fighting", group_title: "Fire Pump Sets", group_order: 0, sort_order: 1, name: "Diesel Engine-Driven Fire Pump", description: "UL/FM listed diesel driver for standby fire water supply during power outages.", brand: null, src: S + "fire-fighting/diesel-engine-driven-fire-pump.jpg" },
  { system_key: "fire-fighting", group_title: "Fire Pump Sets", group_order: 0, sort_order: 2, name: "Electric Motor-Driven Fire Pump", description: "Motor-driven centrifugal fire pump for mains-powered primary duty service.", brand: null, src: S + "fire-fighting/electric-motor-driven-fire-pump.jpg" },
  { system_key: "fire-fighting", group_title: "Fire Pump Sets", group_order: 0, sort_order: 3, name: "Vertical Turbine Fire Pump", description: "Vertical turbine pump for drawing suction from wells, tanks or reservoirs.", brand: null, src: S + "fire-fighting/vertical-turbine-fire-pump.jpg" },

  { system_key: "fire-fighting", group_title: "Hose Reels, Hydrants & Risers", group_order: 1, sort_order: 0, name: "Fire Hose Reel & Cabinets", description: "Wall-mounted hose reel cabinets for first-response firefighting by occupants.", brand: null, src: S + "fire-fighting/fire-hose-reel-cabinets.jpg" },
  { system_key: "fire-fighting", group_title: "Hose Reels, Hydrants & Risers", group_order: 1, sort_order: 1, name: "Fire Hydrants", description: "External pillar hydrants providing a fire brigade connection point on site.", brand: null, src: S + "fire-fighting/fire-hydrants.jpg" },
  { system_key: "fire-fighting", group_title: "Hose Reels, Hydrants & Risers", group_order: 1, sort_order: 2, name: "Landing Valves", description: "Riser-mounted landing valves for firefighter hose connection on each floor.", brand: null, src: S + "fire-fighting/landing-valves.jpg" },
  { system_key: "fire-fighting", group_title: "Hose Reels, Hydrants & Risers", group_order: 1, sort_order: 3, name: "Dry & Wet Riser Systems", description: "Vertical riser piping delivering water to upper floors of high-rise buildings.", brand: null, src: S + "fire-fighting/dry-wet-riser-systems.jpg" },
  { system_key: "fire-fighting", group_title: "Hose Reels, Hydrants & Risers", group_order: 1, sort_order: 4, name: "Automatic Sprinklers", description: "Heat-activated sprinkler heads for automatic fire suppression coverage.", brand: null, src: S + "fire-fighting/automatic-sprinklers.jpg" },

  { system_key: "fire-fighting", group_title: "Suppression & Extinguishers", group_order: 2, sort_order: 0, name: "Suppression Cylinders", description: "Clean-agent suppression cylinders for total-flooding protection of enclosed risk areas.", brand: null, src: S + "fire-fighting/suppression-cylinders.jpg" },
  { system_key: "fire-fighting", group_title: "Suppression & Extinguishers", group_order: 2, sort_order: 1, name: "Suppression Control Panel", description: "Dedicated release control panel monitoring and triggering the suppression bank.", brand: null, src: S + "fire-fighting/suppression-control-panel.jpg" },
  { system_key: "fire-fighting", group_title: "Suppression & Extinguishers", group_order: 2, sort_order: 2, name: "Nozzles & Manifolds", description: "Discharge nozzles and manifold piping distributing agent from the cylinder bank.", brand: null, src: S + "fire-fighting/nozzles-manifolds.jpg" },
  { system_key: "fire-fighting", group_title: "Suppression & Extinguishers", group_order: 2, sort_order: 3, name: "Agent Storage Cylinder", description: "High-pressure agent storage cylinder with valve assembly for gas suppression systems.", brand: null, src: S + "fire-fighting/agent-storage-cylinder.jpg" },
  { system_key: "fire-fighting", group_title: "Suppression & Extinguishers", group_order: 2, sort_order: 4, name: "Portable Fire Extinguishers", description: "Powder, water, CO2, foam, wet chemical and clean-agent portable extinguishers.", brand: null, src: S + "fire-fighting/portable-fire-extinguishers.jpg" },

  // ---- fire-alarm ----
  { system_key: "fire-alarm", group_title: "", group_order: 0, sort_order: 0, name: "Addressable Fire Alarm Control Panel", description: "Multi-loop networkable control panel with active or passive repeater options.", brand: "Honeywell", src: S + "fire-alarm/addressable-control-panel.jpg" },
  { system_key: "fire-alarm", group_title: "", group_order: 0, sort_order: 1, name: "Smoke Detectors & Notification Devices", description: "Addressable smoke detector heads for early warning across protected zones.", brand: "Honeywell", src: S + "fire-alarm/smoke-detectors-notification.jpg" },

  // ---- voice-evacuation ----
  { system_key: "voice-evacuation", group_title: "", group_order: 0, sort_order: 0, name: "Ceiling & Wall Speakers", description: "Indoor cabinet speakers, paging horns and a gooseneck microphone console.", brand: null, src: S + "voice-evacuation/ceiling-wall-speakers.jpg" },
  { system_key: "voice-evacuation", group_title: "", group_order: 0, sort_order: 1, name: "PA Amplifiers & Control Rack", description: "Rack-mounted amplifiers and a paging console for zoned voice evacuation.", brand: null, src: S + "voice-evacuation/pa-amplifiers-control-rack.jpg" },

  // ---- emergency-lighting ----
  { system_key: "emergency-lighting", group_title: "", group_order: 0, sort_order: 0, name: "Central Battery System Panel", description: "IntelliPanel central battery cabinets supplying emergency circuits building-wide.", brand: "Teknoware", src: S + "emergency-lighting/central-battery-panel.jpg" },
  { system_key: "emergency-lighting", group_title: "", group_order: 0, sort_order: 1, name: "Exit & Emergency Luminaires", description: "Illuminated running-man exit signs for wall and ceiling mounting.", brand: "Teknoware", src: S + "emergency-lighting/exit-emergency-luminaires.jpg" },
  { system_key: "emergency-lighting", group_title: "", group_order: 0, sort_order: 2, name: "Emergency Bulkhead Luminaires", description: "Surface and recessed emergency luminaires for escape route illumination.", brand: "Teknoware", src: S + "emergency-lighting/emergency-bulkhead-luminaires.jpg" },

  // ---- elv ----
  { system_key: "elv", group_title: "", group_order: 0, sort_order: 0, name: "Access Control Readers & Turnstiles", description: "Card and biometric readers controlling door entry at protected access points.", brand: null, src: S + "elv/access-control-readers.jpg" },
  { system_key: "elv", group_title: "", group_order: 0, sort_order: 1, name: "Dome & Bullet Cameras", description: "Indoor/outdoor dome and bullet cameras with DVR and monitoring station.", brand: null, src: S + "elv/dome-bullet-cameras.jpg" },
  { system_key: "elv", group_title: "", group_order: 0, sort_order: 2, name: "PTZ & NVR Camera Systems", description: "Pan-tilt-zoom cameras networked to an NVR for centralized live monitoring.", brand: null, src: S + "elv/ptz-nvr-camera-systems.jpg" },

  // ---- smoke-management ----
  { system_key: "smoke-management", group_title: "", group_order: 0, sort_order: 0, name: "Axial Smoke Extraction Fan", description: "High-temperature axial duct fan rated F400/F300 for smoke extract duty.", brand: null, src: S + "smoke-management/axial-smoke-extraction-fan.jpg" },
  { system_key: "smoke-management", group_title: "", group_order: 0, sort_order: 1, name: "Boxed Smoke Extraction Fan", description: "Acoustic-cased centrifugal fan unit rated F400 for ducted smoke extraction.", brand: null, src: S + "smoke-management/boxed-smoke-extraction-fan.jpg" },
  { system_key: "smoke-management", group_title: "", group_order: 0, sort_order: 2, name: "Roof-Mounted Smoke Extract Fan", description: "Weatherproof roof-mounted extract fan rated F400 at 120°C for stairwell venting.", brand: null, src: S + "smoke-management/roof-mounted-smoke-extract-fan.jpg" },
  { system_key: "smoke-management", group_title: "", group_order: 0, sort_order: 3, name: "In-Duct Jet Smoke Fan", description: "Inline jet-type duct fan rated F400/F300 for car park smoke ventilation.", brand: null, src: S + "smoke-management/in-duct-jet-smoke-fan.jpg" },
  { system_key: "smoke-management", group_title: "", group_order: 0, sort_order: 4, name: "Motorized Fire & Smoke Dampers", description: "MFSD combination dampers isolating ductwork to contain fire and smoke spread.", brand: null, src: S + "smoke-management/motorized-fire-smoke-dampers.jpg" },
];
