// System & Solutions product pictures.
//
// Files live in /public/assets/systems/<system-key>/ so the same stable URLs
// can be used by the site's bundled fallback data (below) AND by the CMS
// `system_images` table (seeded from the CMS project: supabase/seed-system-images.mjs). Each picture is a
// square, white-background product shot, sized to sit in the same 1:1 thumbnail
// as the product cards on the Brands / Products page.
const S = "/assets/systems/";

// Fire Fighting
const dryWetRiser   = S + "fire-fighting/dry-wet-riser-systems.jpg";
const hoseReel      = S + "fire-fighting/fire-hose-reel-cabinets.jpg";
const hydrant       = S + "fire-fighting/fire-hydrants.jpg";
const landingValve  = S + "fire-fighting/landing-valves.jpg";
const sprinklers    = S + "fire-fighting/automatic-sprinklers.jpg";
const pumpSet       = S + "fire-fighting/complete-fire-pump-set.jpg";
const dieselPump    = S + "fire-fighting/diesel-engine-driven-fire-pump.jpg";
const electricPump  = S + "fire-fighting/electric-motor-driven-fire-pump.jpg";
const turbinePump   = S + "fire-fighting/vertical-turbine-fire-pump.jpg";
const fs1           = S + "fire-fighting/suppression-cylinders.jpg";
const fs2           = S + "fire-fighting/suppression-control-panel.jpg";
const fs3           = S + "fire-fighting/nozzles-manifolds.jpg";
const fs4           = S + "fire-fighting/agent-storage-cylinder.jpg";
const extinguisher  = S + "fire-fighting/portable-fire-extinguishers.jpg";

// Fire Alarm
const fe1 = S + "fire-alarm/addressable-control-panel.jpg";
const fe2 = S + "fire-alarm/smoke-detectors-notification.jpg";

// Voice Evacuation / Public Address
const pas1 = S + "voice-evacuation/ceiling-wall-speakers.jpg";
const pas2 = S + "voice-evacuation/pa-amplifiers-control-rack.jpg";

// Emergency Lighting
const el1 = S + "emergency-lighting/central-battery-panel.jpg";
const el2 = S + "emergency-lighting/exit-emergency-luminaires.jpg";
const el3 = S + "emergency-lighting/emergency-bulkhead-luminaires.jpg";

// ELV — Access Control & CCTV
const acs1 = S + "elv/access-control-readers.jpg";
const cc1  = S + "elv/dome-bullet-cameras.jpg";
const cc2  = S + "elv/ptz-nvr-camera-systems.jpg";

// Smoke Management
const sms1 = S + "smoke-management/axial-smoke-extraction-fan.jpg";
const sms2 = S + "smoke-management/boxed-smoke-extraction-fan.jpg";
const sms3 = S + "smoke-management/roof-mounted-smoke-extract-fan.jpg";
const sms4 = S + "smoke-management/in-duct-jet-smoke-fan.jpg";
const sms5 = S + "smoke-management/motorized-fire-smoke-dampers.jpg";

export const fireFightingGroups = [
  {
    title: "Fire Pump Sets",
    items: [
      { src: pumpSet, name: "Complete Fire Pump Set", desc: "Fully assembled diesel/electric duty-standby pump skid, factory piped and tested." },
      { src: dieselPump, name: "Diesel Engine-Driven Fire Pump", desc: "UL/FM listed diesel driver for standby fire water supply during power outages." },
      { src: electricPump, name: "Electric Motor-Driven Fire Pump", desc: "Motor-driven centrifugal fire pump for mains-powered primary duty service." },
      { src: turbinePump, name: "Vertical Turbine Fire Pump", desc: "Vertical turbine pump for drawing suction from wells, tanks or reservoirs." },
    ],
  },
  {
    title: "Hose Reels, Hydrants & Risers",
    items: [
      { src: hoseReel, name: "Fire Hose Reel & Cabinets", desc: "Wall-mounted hose reel cabinets for first-response firefighting by occupants." },
      { src: hydrant, name: "Fire Hydrants", desc: "External pillar hydrants providing a fire brigade connection point on site." },
      { src: landingValve, name: "Landing Valves", desc: "Riser-mounted landing valves for firefighter hose connection on each floor." },
      { src: dryWetRiser, name: "Dry & Wet Riser Systems", desc: "Vertical riser piping delivering water to upper floors of high-rise buildings." },
      { src: sprinklers, name: "Automatic Sprinklers", desc: "Heat-activated sprinkler heads for automatic fire suppression coverage." },
    ],
  },
  {
    title: "Suppression & Extinguishers",
    items: [
      { src: fs1, name: "Suppression Cylinders", desc: "Clean-agent suppression cylinders for total-flooding protection of enclosed risk areas." },
      { src: fs2, name: "Suppression Control Panel", desc: "Dedicated release control panel monitoring and triggering the suppression bank." },
      { src: fs3, name: "Nozzles & Manifolds", desc: "Discharge nozzles and manifold piping distributing agent from the cylinder bank." },
      { src: fs4, name: "Agent Storage Cylinder", desc: "High-pressure agent storage cylinder with valve assembly for gas suppression systems." },
      { src: extinguisher, name: "Portable Fire Extinguishers", desc: "Powder, water, CO2, foam, wet chemical and clean-agent portable extinguishers." },
    ],
  },
];

export const fireAlarmImages = [
  { src: fe1, name: "Addressable Fire Alarm Control Panel", brand: "Honeywell", desc: "Multi-loop networkable control panel with active or passive repeater options." },
  { src: fe2, name: "Smoke Detectors & Notification Devices", brand: "Honeywell", desc: "Addressable smoke detector heads for early warning across protected zones." },
];

export const voiceEvacImages = [
  { src: pas1, name: "Ceiling & Wall Speakers", desc: "Indoor cabinet speakers, paging horns and a gooseneck microphone console." },
  { src: pas2, name: "PA Amplifiers & Control Rack", desc: "Rack-mounted amplifiers and a paging console for zoned voice evacuation." },
];

export const emergencyLightImages = [
  { src: el1, name: "Central Battery System Panel", brand: "Teknoware", desc: "IntelliPanel central battery cabinets supplying emergency circuits building-wide." },
  { src: el2, name: "Exit & Emergency Luminaires", brand: "Teknoware", desc: "Illuminated running-man exit signs for wall and ceiling mounting." },
  { src: el3, name: "Emergency Bulkhead Luminaires", brand: "Teknoware", desc: "Surface and recessed emergency luminaires for escape route illumination." },
];

export const elvImages = [
  { src: acs1, name: "Access Control Readers & Turnstiles", desc: "Card and biometric readers controlling door entry at protected access points." },
  { src: cc1, name: "Dome & Bullet Cameras", desc: "Indoor/outdoor dome and bullet cameras with DVR and monitoring station." },
  { src: cc2, name: "PTZ & NVR Camera Systems", desc: "Pan-tilt-zoom cameras networked to an NVR for centralized live monitoring." },
];

export const smokeManagementImages = [
  { src: sms1, name: "Axial Smoke Extraction Fan", desc: "High-temperature axial duct fan rated F400/F300 for smoke extract duty." },
  { src: sms2, name: "Boxed Smoke Extraction Fan", desc: "Acoustic-cased centrifugal fan unit rated F400 for ducted smoke extraction." },
  { src: sms3, name: "Roof-Mounted Smoke Extract Fan", desc: "Weatherproof roof-mounted extract fan rated F400 at 120°C for stairwell venting." },
  { src: sms4, name: "In-Duct Jet Smoke Fan", desc: "Inline jet-type duct fan rated F400/F300 for car park smoke ventilation." },
  { src: sms5, name: "Motorized Fire & Smoke Dampers", desc: "MFSD combination dampers isolating ductwork to contain fire and smoke spread." },
];
