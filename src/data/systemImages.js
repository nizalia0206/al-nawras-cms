// Fire Fighting
import dryWetRiser from "../assets/systems/fire-fighting/Dry_wet_riser_systems.png";
import hoseReel from "../assets/systems/fire-fighting/Fire_Hose_Reel_and_Cabinets.png";
import hydrant from "../assets/systems/fire-fighting/Fire_hydrant.png";
import landingValve from "../assets/systems/fire-fighting/Landing_valve.png";
import sprinklers from "../assets/systems/fire-fighting/Sprinklers.png";

// Fire Pump
import dieselPump from "../assets/systems/fire-pump/Diesel_Engine_Driven_Fire_Pump.png";
import electricPump from "../assets/systems/fire-pump/Electric_Motor_Driven_Fire_Pump.png";
import pumpSet from "../assets/systems/fire-pump/Fire_pump_set.png";
import turbinePump from "../assets/systems/fire-pump/Vertical_Turbine_Fire_Pump.png";

// Fire Suppression
import fs1 from "../assets/systems/fire-suppression/fs1.png";
import fs2 from "../assets/systems/fire-suppression/fs2.png";
import fs3 from "../assets/systems/fire-suppression/fs3.png";
import fs4 from "../assets/systems/fire-suppression/fs4.png";

// Fire Extinguisher
import extinguisher from "../assets/systems/fire-extinguisher/Fire_extinguisher.png";

// Fire Alarm & Voice Evacuation
import fe1 from "../assets/systems/fire-alarm/fe1.png";
import fe2 from "../assets/systems/fire-alarm/fe2.png";

// Public Address
import pas1 from "../assets/systems/public-address/pas1.png";
import pas2 from "../assets/systems/public-address/pas2.png";

// Emergency Lighting
import el1 from "../assets/systems/emergency-light/el1.png";
import el2 from "../assets/systems/emergency-light/el2.png";
import el3 from "../assets/systems/emergency-light/el3.png";

// Access Control
import acs1 from "../assets/systems/access-control/acs1.png";

// CCTV
import cc1 from "../assets/systems/cctv/cc1.png";
import cc2 from "../assets/systems/cctv/cc2.png";

// Smoke Management
import sms1 from "../assets/systems/smoke-management/sms1.png";
import sms2 from "../assets/systems/smoke-management/sms2.png";
import sms3 from "../assets/systems/smoke-management/sms3.png";
import sms4 from "../assets/systems/smoke-management/sms4.png";
import sms5 from "../assets/systems/smoke-management/sms5.png";

export const fireFightingGroups = [
  {
    title: "Fire Pump Sets",
    items: [
      { src: pumpSet, name: "Complete Fire Pump Set" },
      { src: dieselPump, name: "Diesel Engine-Driven Fire Pump" },
      { src: electricPump, name: "Electric Motor-Driven Fire Pump" },
      { src: turbinePump, name: "Vertical Turbine Fire Pump" },
    ],
  },
  {
    title: "Hose Reels, Hydrants & Risers",
    items: [
      { src: hoseReel, name: "Fire Hose Reel & Cabinets" },
      { src: hydrant, name: "Fire Hydrants" },
      { src: landingValve, name: "Landing Valves" },
      { src: dryWetRiser, name: "Dry & Wet Riser Systems" },
      { src: sprinklers, name: "Automatic Sprinklers" },
    ],
  },
  {
    title: "Suppression & Extinguishers",
    items: [
      { src: fs1, name: "Suppression Cylinders" },
      { src: fs2, name: "Nozzles & Manifolds" },
      { src: fs3, name: "Suppression Control Panel" },
      { src: fs4, name: "Detection & Release Devices" },
      { src: extinguisher, name: "Portable Fire Extinguishers" },
    ],
  },
];

export const fireAlarmImages = [
  { src: fe1, name: "Addressable Fire Alarm Control Panel" },
  { src: fe2, name: "Smoke Detectors & Notification Devices" },
];

export const voiceEvacImages = [
  { src: pas1, name: "Ceiling & Wall Speakers" },
  { src: pas2, name: "PA Amplifiers & Control Rack" },
];

export const emergencyLightImages = [
  { src: el1, name: "Central Battery System Panel" },
  { src: el2, name: "Exit & Emergency Luminaires" },
  { src: el3, name: "Emergency Bulkhead Luminaires" },
];

export const elvImages = [
  { src: acs1, name: "Access Control Readers & Turnstiles" },
  { src: cc1, name: "Dome & Bullet Cameras" },
  { src: cc2, name: "PTZ & NVR Camera Systems" },
];

export const smokeManagementImages = [
  { src: sms1, name: "Fire & Smoke Dampers" },
  { src: sms2, name: "Damper Actuators" },
  { src: sms3, name: "Smoke Extraction Fans" },
  { src: sms4, name: "Smoke Control Panel" },
  { src: sms5, name: "Ductwork & Louvres" },
];
