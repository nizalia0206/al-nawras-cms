export const systems = [
  {
    id: "sys-fire",
    icon: "IconFlame",
    title: "Fire Fighting Systems",
    desc: "A complete firefighting scope engineered, supplied and installed to the highest standards — UL-listed and FM-approved fire pump sets, hose reels, wet risers, sprinkler, foam and deluge systems, hydrants and portable extinguishers.",
    products: [
      { icon: "IconPump", name: "Fire Pump Sets", desc: "Horizontal & vertical inline pump sets, 750–1000+ GPM, UL/FM approved." },
      { icon: "IconHoseReel", name: "Hose Reels & Hydrants", desc: "Wet riser, landing valve and hose reel systems for high-rise buildings." },
      { icon: "IconSmoke", name: "Sprinkler & Deluge Systems", desc: "Automatic sprinklers, foam sprinkler and water deluge protection." },
    ],
  },
  {
    id: "sys-alarm",
    icon: "IconPanel",
    title: "Fire Alarm Systems",
    desc: "Multi-loop addressable detection and control, designed around Honeywell's Morley and Farenhyt platforms and commissioned by our qualified engineering team to give occupants the earliest possible warning.",
    products: [
      { icon: "IconPanel", name: "Addressable Control Panels", desc: "1–4 loop networkable analogue addressable fire alarm panels." },
      { icon: "IconDetector", name: "Smoke & Heat Detectors", desc: "Addressable photoelectric, heat and multi-criteria detection devices." },
      { icon: "IconNotify", name: "Notification Appliances", desc: "Horns, strobes and sounder/strobe combinations for alerting occupants." },
    ],
  },
  {
    id: "sys-voice",
    icon: "IconSpeaker",
    title: "Voice Evacuation Systems",
    desc: "Integrated emergency communication and public address networks, engineered to deliver clear, prioritized evacuation instructions across a building of any scale.",
    products: [
      { icon: "IconSpeaker", name: "ECS Amplifiers & Speakers", desc: "Distributed amplifiers and ceiling/wall speakers for clear voice paging." },
      { icon: "IconPanel", name: "Voice Evacuation Panels", desc: "Panels integrated with the fire alarm control system for simple operation." },
      { icon: "IconGateway", name: "Networked Paging", desc: "Multi-zone, prioritized messaging across large or multi-building sites." },
    ],
  },
  {
    id: "sys-light",
    icon: "IconLightbulb",
    title: "Emergency Lighting",
    desc: "Central battery systems and DALI-addressable emergency and exit luminaires from Teknoware ESCALUX, monitored end-to-end through IntelliPanel and ESC-GATE gateways for consistent, code-compliant coverage.",
    products: [
      { icon: "IconBattery", name: "Central Battery Systems", desc: "8–72 output circuit central battery panels for site-wide emergency power." },
      { icon: "IconExitSign", name: "Exit & Emergency Luminaires", desc: "DALI-addressable exit signs and emergency luminaires, various IP ratings." },
      { icon: "IconGateway", name: "IntelliPanel & Gateways", desc: "Touch-screen monitoring of up to 1024 luminaires per panel." },
    ],
  },
  {
    id: "sys-elv",
    icon: "IconELV",
    title: "ELV Systems",
    desc: "Structured cabling, CCTV, access control and BMS integration delivered as a single low-voltage infrastructure, so every building system reports back through one manageable network.",
    products: [
      { icon: "IconCable", name: "Structured Cabling", desc: "Data, voice and building-automation cabling infrastructure." },
      { icon: "IconSwitch", name: "Network Switching", desc: "Access, aggregation and core switching for converged ELV networks." },
      { icon: "IconWifi", name: "Wireless & Access Control", desc: "Wi-Fi coverage, CCTV and access control integration." },
    ],
  },
  {
    id: "sys-smoke",
    icon: "IconSmoke",
    title: "Smoke Management",
    desc: "Fire and smoke dampers, extraction fans and electronic control units, specified and installed to keep stairwells and escape routes clear for the duration of an event.",
    products: [
      { icon: "IconSmoke", name: "Fire/Smoke Dampers", desc: "Duct-mounted dampers that inhibit smoke spread between zones." },
      { icon: "IconGateway", name: "Extraction Fans", desc: "Mechanical smoke extraction to keep stairwells and corridors clear." },
      { icon: "IconPanel", name: "Control Units", desc: "Electronic control panels coordinating smoke control sequences." },
    ],
  },
];

export const brands = [
  {
    id: "honeywell",
    name: "Honeywell",
    tag: "Fire Alarm & Voice Evacuation",
    desc: "2024 Catalyst META Fire System Integrator Program — Silver Partner. Authorized sub-distributor for Morley, Farenhyt, System Sensor and X-618/RK2 PA-VA ranges.",
    products: [
      { icon: "IconPanel", name: "Morley-IAS DXc / Max Panels", desc: "1–4 loop networkable addressable fire alarm control panels with touch-screen UI." },
      { icon: "IconDetector", name: "Farenhyt IDP Devices", desc: "Addressable photoelectric, heat and combination fire/CO detectors." },
      { icon: "IconNotify", name: "System Sensor L-Series", desc: "Audible/visible notification appliances — horns, strobes, speaker/strobes." },
    ],
  },
  {
    id: "teknoware",
    name: "Teknoware",
    tag: "ESCALUX Emergency Lighting",
    desc: "Authorized distributor for Teknoware Central Battery Systems and ESCALUX DALI emergency & exit lighting, supplied, installed, tested and commissioned by Al Nawras.",
    products: [
      { icon: "IconBattery", name: "TKX Central Battery Systems", desc: "Wall or floor-mounted panels with 8–72 output circuits, single or 3-phase." },
      { icon: "IconExitSign", name: "ESCALUX DALI Luminaires", desc: "ZIYA, AURA, ACONITE & LIOR ranges — self-contained emergency & exit lights." },
      { icon: "IconGateway", name: "IntelliPanel & ESC-GATE", desc: "Central monitoring panel and DALI gateway, up to 1024 devices per network." },
    ],
  },
  {
    id: "waterfall",
    name: "Waterfall",
    tag: "UL/FM Fire Pump Sets",
    desc: "Authorized supplier of Waterfall fire pump sets — the most common pump type specified across Al Nawras firefighting projects in the UAE.",
    products: [
      { icon: "IconPump", name: "Horizontal Split-Case Pumps", desc: "750–1000+ GPM @ 14 bar, UL listed / FM approved fire pump sets." },
      { icon: "IconPump", name: "Vertical Inline Pumps", desc: "Compact-footprint pump option for space-constrained plant rooms." },
      { icon: "IconGateway", name: "Jockey & Controller Sets", desc: "Pressure-maintenance jockey pumps with matched fire pump controllers." },
    ],
  },
  {
    id: "kd-industries",
    name: "KD Industries",
    tag: "ERW Steel Pipes & Tubes",
    desc: "ISO 9001:2008 accredited manufacturer of carbon steel ERW, black & galvanized pipes — supplied by Al Nawras for firefighting network piping.",
    products: [
      { icon: "IconPipe", name: "ERW Black Steel Pipe", desc: "Schedule 40/10 black steel pipe manufactured to ASTM A53 / A795." },
      { icon: "IconPipe", name: "Galvanized Steel Pipe", desc: "Corrosion-resistant piping for exposed and outdoor firefighting mains." },
      { icon: "IconGateway", name: "Fittings & Accessories", desc: "Grooved-end fittings for fast, reliable firefighting network assembly." },
    ],
  },
  {
    id: "uranus",
    name: "Uranus",
    tag: "Fire Cables, Lighting & Firefighting Equipment",
    desc: "Authorized distributor (via Rewire International LLC) for Uranus fire-resistant cables, DALI emergency lighting, firefighting equipment, and Mercury/Jupiter/Venus product lines.",
    products: [
      { icon: "IconCable", name: "PH120 Fire Resistant Cable", desc: "120-minute fire survival cable for critical life-safety circuits." },
      { icon: "IconExitSign", name: "DALI Emergency Lighting", desc: "Self-contained addressable emergency lighting, 2-year warranty." },
      { icon: "IconHoseReel", name: "Firefighting Equipment", desc: "Fire hose reels and firefighting accessories for building installations." },
    ],
  },
  {
    id: "h3c",
    name: "H3C",
    tag: "ICT & Digital Infrastructure",
    desc: "Authorized agent for New H3C Technologies — bringing enterprise networking, compute and unified operations platforms into Al Nawras ICT project scopes.",
    products: [
      { icon: "IconSwitch", name: "Enterprise Switches", desc: "Campus and data-center switching from access to core." },
      { icon: "IconWifi", name: "WLAN Access Points", desc: "Wi-Fi 6/7 indoor, outdoor and wall-plate access points." },
      { icon: "IconServer", name: "U-Center O&M Platform", desc: "Unified network operations, monitoring and management platform." },
    ],
  },
];

export const projects = [
  {
    tag: "Residential · Dubai",
    grad: "from-[#1c2230] to-[#2b3346]",
    title: "Opalz by Danube",
    meta: "Client: Danube Properties · 23-storey tower, Dubai Science Park",
    systems: "Addressable Fire Alarm, Voice Evacuation & Central Battery",
  },
  {
    tag: "Twin Towers · Dubai",
    grad: "from-[#241b1b] to-[#3d2622]",
    title: "Al Merkadh Residential Twin Towers",
    meta: "Client: Ellington Properties Development LLC",
    systems: "Fire Pump 750 GPM, Sprinklers, Foam & Deluge Systems",
  },
  {
    tag: "Mixed-Use · Dubai",
    grad: "from-[#1e2a24] to-[#28392f]",
    title: "Danube Waves",
    meta: "Client: Mr. Sajan Rizwan Askerali · Wadi Al Safa 2",
    systems: "Fire Pump 1000 GPM, HDPE Network, Foam & Sprinkler Systems",
  },
  {
    tag: "Healthcare · Dubai",
    grad: "from-[#1b2430] to-[#24344a]",
    title: "Saudi German Hospital",
    meta: "Client: Emirates Health Care Development Corporation",
    systems: "Central Battery Emergency Lighting System",
  },
  {
    tag: "Hospitality · Dubai",
    grad: "from-[#231a2c] to-[#3a2a45]",
    title: "Hor Al Anz Hotel Building",
    meta: "Client: Mr. Salem Saeed Mohammed Al Jabri, Abu Hail",
    systems: "Extra Low Voltage (ELV) Systems",
  },
  {
    tag: "Industrial · Ras Al Khaimah",
    grad: "from-[#1c2230] to-[#2b3346]",
    title: "SEAH UAE Pipe Factory",
    meta: "Client: SEAH Steel UAE LLC · Al Ghail Industrial Area",
    systems: "Fire Alarm, Dry Riser & Wet Riser Systems",
  },
];

export const certifications = [
  { num: "01", title: "ISO 9001:2015", desc: "Quality Management System — supply, installation, design & maintenance of fire alarm and firefighting systems." },
  { num: "02", title: "Sharjah Civil Defense", desc: "Category A licensed installer & maintainer of detection, alarm and firefighting systems." },
  { num: "03", title: "Dubai Civil Defense", desc: "Category A & D license covering fire/smoke detection and ventilation & smoke control systems." },
  { num: "04", title: "Abu Dhabi Civil Defense", desc: "Licensed distributor for firefighting and life-safety equipment across the Emirate." },
  { num: "05", title: "Honeywell Silver Partner", desc: "2024 Catalyst META Fire System Integrator Program — Silver Partner status." },
  { num: "06", title: "Authorized Distributor", desc: "Honeywell, Teknoware, Waterfall, KD Industries, Uranus (Rewire International) and H3C." },
];

export const industries = [
  {
    id: "ind-hotels",
    title: "Hotels & Hospitality",
    image: "https://images.unsplash.com/photo-1536269404660-0a8d4e88bf1b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ind-government",
    title: "Government Buildings",
    image: "https://images.unsplash.com/photo-1703641852060-dc7e63d83978?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ind-offices",
    title: "Offices & Towers",
    image: "https://images.unsplash.com/photo-1745015446589-7ee6f702d8c1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ind-manufacturing",
    title: "Manufacturing Plants",
    image: "https://images.unsplash.com/photo-1727870752423-4d51d5b500c7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ind-healthcare",
    title: "Healthcare Facilities",
    image: "https://images.unsplash.com/photo-1764885517847-79d62138cc58?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ind-residential",
    title: "Residential Towers",
    image: "https://images.unsplash.com/photo-1521208059781-bcf3fd4d1245?auto=format&fit=crop&w=800&q=80",
  },
];

export const team = [
  {
    id: "mg",
    initials: "MG",
    name: "Eng. Mohammed Ghazy",
    role: "Managing Director",
    phone: "+971 50 4544361",
    icon: "person",
  },
  {
    id: "yg",
    initials: "YG",
    name: "Eng. Yasser Mohammed Ghazy",
    role: "General Manager",
    phone: "+971 55 1099879",
    icon: "hardhat",
  },
  {
    id: "ag",
    initials: "AG",
    name: "Eng. Amr Mohammed Ghazy",
    role: "Sales & Business Development Manager",
    phone: "+971 55 1099885",
    icon: "person",
  },
  {
    id: "am",
    initials: "AM",
    name: "Eng. Ahmed Morsy",
    role: "Project Manager",
    phone: "+971 55 1099886",
    icon: "person",
    highlight: true,
  },
  {
    id: "sg",
    initials: "SG",
    name: "Eng. Sayed Gamal",
    role: "Engineering Manager",
    phone: "info@nawrassystems.com",
    icon: "hardhat",
  },
  {
    id: "th",
    initials: "TH",
    name: "Mr. Tarek Haikal",
    role: "Purchase Manager",
    phone: "+971 55 1099884",
    icon: "person",
  },
];

export const locations = [
  { tag: "HQ", title: "Sharjah — Head Office", desc: "Office 905, Al Baker Tower 5, Al Khan · Tel +971 6 562 5425" },
  { tag: "Branch", title: "Dubai Office", desc: "Barsha Valley Building, Al Barsha First · Tel +971 4 333 5373" },
  { tag: "Branch", title: "Abu Dhabi Office", desc: "Office 13, 9th Floor, Tower 1, Mazyad Mall, MBZ City" },
  { tag: "Warehouse", title: "Sharjah Warehouse", desc: "Shed No. 8, Industrial Area No. 11" },
];
