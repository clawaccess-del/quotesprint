'use client';

import { useEffect, useMemo, useState } from 'react';

type QuoteStatus = 'open' | 'won' | 'lost';
type LeadStatus = 'new' | 'qualified' | 'quoted' | 'followed-up' | 'won' | 'lost';
type PortalTab = 'hub' | 'tool' | 'social' | 'leads' | 'calendar' | 'history' | 'sales';
type SavedQuote = {
  id: string;
  customer: string;
  jobType: string;
  total: number;
  depositDue: number;
  status: QuoteStatus;
  winLossReason?: string;
  createdAt: string;
};

type SavedLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  source?: string;
  nextStep?: string;
  followUpDate?: string;
  appointmentDate?: string;
  status?: LeadStatus;
  createdAt: string;
};

type ServicePreset = {
  id: string;
  name: string;
  jobType: string;
  laborHours: number;
  laborRate: number;
  materials: number;
  deposit: number;
};

type IndustryPlaybook = {
  label: string;
  proofPoint: string;
  urgencyReason: string;
  prepNote: string;
  qualify: string;
  objection: string;
  risk: string;
  closeBenefit: string;
};

type IndustryDetail = {
  customerConcerns: string[];
  quoteInputs: string[];
  trustProof: string;
  followUpTiming: string;
  decisionAngle: string;
};

const jobTypes = [
  'HVAC repair',
  'plumbing repair',
  'painting project',
  'landscaping visit',
  'cleaning service',
  'roof inspection',
  'handyman job',
  'pest control visit',
  'electrical repair',
  'garage door repair',
  'tree service',
  'pool service',
  'pressure washing',
  'junk removal',
  'flooring project',
  'remodeling estimate',
];

const playbooks: Record<string, IndustryPlaybook> = {
  'HVAC repair': {
    label: 'HVAC',
    proofPoint: 'licensed comfort diagnostics, clear repair options, and no-pressure guidance before work begins',
    urgencyReason: 'temperature swings can turn a small comfort issue into an urgent household problem',
    prepNote: 'Please make sure the thermostat, indoor unit, outdoor unit, and electrical panel are accessible before we arrive.',
    qualify: 'system age, thermostat behavior, unusual sounds, airflow, filter condition, and whether the home is losing heating or cooling now',
    objection: 'If the price feels unexpected, we can separate the must-fix repair from optional efficiency improvements so you can decide clearly.',
    risk: 'Waiting can strain the system, raise energy use, and make the appointment window harder to hold during peak weather.',
    closeBenefit: 'restore comfort and avoid a longer outage window',
  },
  'plumbing repair': {
    label: 'plumbing',
    proofPoint: 'clean repair work, clear water-shutoff guidance, and practical options before anything is opened up',
    urgencyReason: 'water problems can spread quickly and become more expensive when they sit',
    prepNote: 'Please clear the area around the fixture or leak and note where the main shutoff is if you know it.',
    qualify: 'active leak status, fixture location, water shutoff access, drainage symptoms, recent repairs, and photos of the affected area',
    objection: 'If you want to control cost, we can start with the immediate repair and quote any optional upgrades separately.',
    risk: 'Delaying can increase water damage, odors, drywall issues, and emergency scheduling costs.',
    closeBenefit: 'stop the issue before it spreads',
  },
  'painting project': {
    label: 'painting',
    proofPoint: 'careful prep, clean lines, protected surfaces, and a finish schedule that respects your home',
    urgencyReason: 'paint schedules fill quickly when weather and room availability line up',
    prepNote: 'Please note wall condition, color goals, furniture access, and any areas that need patching or trim detail.',
    qualify: 'square footage, surface condition, color changes, trim needs, ceiling height, furniture moving, and desired finish date',
    objection: 'If budget is the concern, we can phase the project by room or separate prep, walls, trim, and ceiling options.',
    risk: 'Waiting can push the project into a busier schedule and delay rooms you want finished for guests, listing photos, or seasonal plans.',
    closeBenefit: 'lock in the finish date and avoid schedule drift',
  },
  'landscaping visit': {
    label: 'landscaping',
    proofPoint: 'practical outdoor planning, clean execution, and recommendations that fit the property instead of overbuilding it',
    urgencyReason: 'landscape timing depends on weather, growth cycles, and crew availability',
    prepNote: 'Please share photos of the yard, access points, drainage concerns, and the areas you want handled first.',
    qualify: 'yard size, access, drainage, sun exposure, cleanup needs, plant or mulch preferences, and recurring maintenance goals',
    objection: 'If the full scope feels large, we can break it into a first cleanup, priority install, and maintenance plan.',
    risk: 'Delaying can let weeds, drainage, or overgrowth add more labor before the next available visit.',
    closeBenefit: 'get the property back under control while the timing is right',
  },
  'cleaning service': {
    label: 'cleaning',
    proofPoint: 'reliable arrival windows, room-by-room scope clarity, and a clean checklist before the visit starts',
    urgencyReason: 'cleaning slots go quickly before move-outs, events, holidays, and busy weekends',
    prepNote: 'Please note bedrooms, bathrooms, pets, parking, access instructions, and any priority areas.',
    qualify: 'home size, room count, cleaning level, pets, access, supplies, priority areas, and whether this is one-time or recurring',
    objection: 'If the full clean is more than expected, we can focus the first visit on kitchens, baths, floors, and the highest-impact areas.',
    risk: 'Waiting can make the clean longer, especially before events, move-outs, inspections, or recurring service starts.',
    closeBenefit: 'secure the cleaning window before the schedule fills',
  },
  'roof inspection': {
    label: 'roofing',
    proofPoint: 'documented inspection notes, clear photo findings, and repair-first guidance when replacement is not necessary',
    urgencyReason: 'roof issues can worsen with the next rain, wind, or heat cycle',
    prepNote: 'Please share any leak photos, ceiling stains, attic access notes, and the approximate roof age if you know it.',
    qualify: 'roof age, leak location, storm timing, shingle condition, attic access, insurance involvement, and visible interior damage',
    objection: 'If you are not ready for a large repair, we can start with the inspection and separate urgent fixes from longer-term recommendations.',
    risk: 'Delaying can turn a small flashing, shingle, or seal issue into interior water damage.',
    closeBenefit: 'find the issue before the next weather event',
  },
  'handyman job': {
    label: 'handyman',
    proofPoint: 'clear task lists, practical repair options, and one visit planned around the highest-priority fixes',
    urgencyReason: 'small repairs stack up and appointment blocks are easiest to use when the list is clear',
    prepNote: 'Please send photos, measurements, product links if parts are needed, and your top three priorities.',
    qualify: 'task list, photos, measurements, parts availability, wall type, access, and whether multiple small repairs should be bundled',
    objection: 'If the list is too much for one visit, we can prioritize safety, function, and the most visible repairs first.',
    risk: 'Waiting can leave small issues unfinished and make it harder to bundle the work efficiently.',
    closeBenefit: 'knock out the repair list with a clear plan',
  },
  'pest control visit': {
    label: 'pest control',
    proofPoint: 'targeted treatment plans, prevention guidance, and clear expectations for what happens after service',
    urgencyReason: 'pest activity can spread when entry points, nests, or food sources stay active',
    prepNote: 'Please note where you are seeing activity, whether pets or children are in the home, and any recent treatments.',
    qualify: 'pest type, activity location, frequency, entry points, pets, children, previous treatments, and indoor or outdoor concerns',
    objection: 'If you are unsure about treatment, we can begin with inspection and prevention steps before recommending a larger plan.',
    risk: 'Delaying can allow activity to spread, nests to grow, or entry points to stay open.',
    closeBenefit: 'identify the source and stop the activity early',
  },

  'electrical repair': {
    label: 'electrical',
    proofPoint: 'safe diagnostics, code-aware repair options, and clear explanations before panels, outlets, or fixtures are opened',
    urgencyReason: 'electrical issues can create safety risks and disrupt daily routines when they are ignored',
    prepNote: 'Please note the affected rooms, breaker behavior, fixture or outlet type, and any burning smells, flickering, or tripping patterns.',
    qualify: 'breaker activity, affected rooms, fixture type, age of the panel, recent changes, visible damage, and whether power is currently out',
    objection: 'If the full scope feels uncertain, we can start with diagnosis and separate the safety-critical repair from optional upgrades.',
    risk: 'Waiting can leave a safety issue unresolved, make troubleshooting harder, or allow repeated breaker trips to continue.',
    closeBenefit: 'restore safe, reliable power with a clear repair plan',
  },
  'garage door repair': {
    label: 'garage door',
    proofPoint: 'practical door diagnostics, spring and opener guidance, and repair-first recommendations when replacement is not needed',
    urgencyReason: 'a stuck or unreliable garage door can affect home access, security, and daily schedules',
    prepNote: 'Please keep vehicles clear of the door if possible and share whether the opener runs, the spring is broken, or the door is off track.',
    qualify: 'door movement, opener behavior, spring condition, track alignment, remote issues, door size, and whether the car is trapped inside',
    objection: 'If budget is the concern, we can separate the immediate function repair from quieter opener or door upgrade options.',
    risk: 'Waiting can make the door harder to move safely and may increase strain on tracks, rollers, springs, or the opener.',
    closeBenefit: 'get the door moving safely again and protect access to the home',
  },
  'tree service': {
    label: 'tree service',
    proofPoint: 'property-aware tree work, cleanup clarity, and recommendations that balance safety, health, and budget',
    urgencyReason: 'tree timing depends on weather, access, crew availability, and whether limbs are threatening structures or utilities',
    prepNote: 'Please share photos from multiple angles, note nearby structures or lines, and describe access for equipment or haul-off.',
    qualify: 'tree size, location, limb risk, storm damage, access, haul-off needs, stump grinding, and proximity to structures or utilities',
    objection: 'If the full removal feels like too much, we can separate urgent safety cuts, pruning, haul-off, and stump work.',
    risk: 'Waiting can increase property risk if weak limbs, storm damage, or overgrowth are already present.',
    closeBenefit: 'reduce property risk and get the cleanup scheduled safely',
  },
  'pool service': {
    label: 'pool service',
    proofPoint: 'clear water diagnostics, equipment checks, and maintenance recommendations that keep the pool usable',
    urgencyReason: 'pool problems can get more expensive when chemistry, algae, leaks, or equipment issues sit too long',
    prepNote: 'Please note pool size, water condition, equipment symptoms, last service date, and whether the pump is running.',
    qualify: 'water clarity, chemical history, pump behavior, filter type, pool size, leak signs, algae level, and recurring maintenance goals',
    objection: 'If the full cleanup is more than expected, we can start with water recovery and equipment diagnosis, then separate ongoing maintenance.',
    risk: 'Waiting can let water quality decline, strain equipment, and make the recovery visit more involved.',
    closeBenefit: 'get the pool back on track before the issue compounds',
  },
  'pressure washing': {
    label: 'pressure washing',
    proofPoint: 'surface-safe cleaning, clear scope, and the right pressure or soft-wash method for each material',
    urgencyReason: 'exterior cleaning schedules fill quickly around weather, listings, events, and seasonal curb-appeal projects',
    prepNote: 'Please share photos, note the surfaces to clean, water access, stains, and any delicate paint, siding, plants, or outdoor furniture.',
    qualify: 'surface type, square footage, staining, water access, height, plant protection, driveway or siding needs, and desired timing',
    objection: 'If the full exterior is too much at once, we can prioritize the driveway, entry, siding, or highest-visibility areas first.',
    risk: 'Waiting can let mildew, algae, and staining become more visible and harder to clean efficiently.',
    closeBenefit: 'refresh the property while the weather and schedule line up',
  },
  'junk removal': {
    label: 'junk removal',
    proofPoint: 'clear volume estimates, careful removal, and a simple haul-away plan before the crew arrives',
    urgencyReason: 'removal windows go quickly before moves, cleanouts, renovations, and weekend projects',
    prepNote: 'Please send photos of the items, note stairs or elevator access, parking, heavy materials, and anything that may require special disposal.',
    qualify: 'item volume, item type, stairs, parking, heavy materials, donation potential, disposal restrictions, and preferred pickup window',
    objection: 'If the total load is bigger than planned, we can prioritize the must-go items and quote the rest separately.',
    risk: 'Waiting can slow down moves, cleanouts, renovations, or listing prep when unwanted items stay in the way.',
    closeBenefit: 'clear the space quickly with a simple pickup plan',
  },
  'flooring project': {
    label: 'flooring',
    proofPoint: 'careful measurements, prep clarity, and flooring recommendations that fit the room, traffic, and budget',
    urgencyReason: 'flooring projects depend on material availability, room access, and installation calendar openings',
    prepNote: 'Please share room measurements, current flooring type, subfloor concerns, material preference, and whether furniture needs moving.',
    qualify: 'square footage, material type, subfloor condition, removal needs, stairs, transitions, furniture moving, and desired completion date',
    objection: 'If the project feels large, we can separate material, prep, removal, and installation options so the decision is clearer.',
    risk: 'Waiting can push installation dates out and delay rooms needed for move-ins, listings, rentals, or family use.',
    closeBenefit: 'lock in the material and installation window with a clear scope',
  },
  'remodeling estimate': {
    label: 'remodeling',
    proofPoint: 'scope clarity, phased options, and practical remodeling guidance before decisions become expensive',
    urgencyReason: 'remodeling timelines depend on scope, selections, permitting, materials, and contractor availability',
    prepNote: 'Please share photos, rough measurements, must-haves, budget range, timeline, and any inspiration images or product choices.',
    qualify: 'room type, scope, measurements, selections, budget range, timeline, permits, structural changes, and whether the home is occupied',
    objection: 'If the full remodel is more than expected, we can phase the work or separate must-have improvements from optional upgrades.',
    risk: 'Waiting can delay selections, scheduling, and material ordering, especially when the project has a target completion date.',
    closeBenefit: 'turn the idea into a clear scope, timeline, and next step',
  },
};

const industryDetails: Record<string, IndustryDetail> = {
  'HVAC repair': {
    customerConcerns: ['no heat or AC', 'repair versus replacement', 'energy bills', 'same-day availability'],
    quoteInputs: ['system type and age', 'thermostat behavior', 'airflow', 'noises or error codes', 'filter age', 'unit access and photos'],
    trustProof: 'licensed diagnostics, repair-versus-replacement options, warranty explanation, and authorization before added work',
    followUpTiming: 'For no heat or AC, follow up same day. For standard repairs, check in tomorrow and again on day three. For replacement decisions, follow up around options, financing, materials, and schedule windows.',
    decisionAngle: 'Separate the must-fix comfort repair from optional efficiency or replacement upgrades.',
  },
  'plumbing repair': {
    customerConcerns: ['active leaks', 'hidden water damage', 'mess', 'emergency pricing'],
    quoteInputs: ['active or stopped leak', 'fixture or location', 'shutoff access', 'drain symptoms', 'photos or video', 'visible drywall or cabinet damage'],
    trustProof: 'clean work, shutoff guidance, photo evidence, licensed repair, and warranty clarity',
    followUpTiming: 'Active leaks need immediate call or SMS and a short booking window. Fixture repairs get next-day and day-three reminders. Remodel or repipe scopes need a day-two clarification follow-up.',
    decisionAngle: 'Split the immediate stop-the-damage visit from permanent repair or optional fixture replacement.',
  },
  'electrical repair': {
    customerConcerns: ['safety or fire risk', 'outages', 'code compliance', 'hidden panel issues'],
    quoteInputs: ['breaker trips', 'flickering', 'affected rooms', 'outlet or fixture type', 'burning smell or sparks', 'panel age and photos'],
    trustProof: 'licensed electrician work, code-aware troubleshooting, permit guidance, and clear authorization before upgrades',
    followUpTiming: 'Safety, outage, burning smell, or warm outlet leads need same-day follow-up. Standard repairs get day-one reminders. Panel or upgrade quotes need day-two options and a day-seven scheduling check.',
    decisionAngle: 'Separate safety-critical repair from nice-to-have upgrades or future panel work.',
  },
  'painting project': {
    customerConcerns: ['finish quality', 'prep level', 'mess', 'timeline', 'color confidence'],
    quoteInputs: ['interior or exterior', 'rooms or square footage', 'wall condition', 'trim or doors', 'color change', 'paint quality and photos'],
    trustProof: 'prep checklist, surface protection, product clarity, daily cleanup, reviews, and finish warranty',
    followUpTiming: 'Follow up day one on questions and colors, day three on schedule windows, and day seven before releasing dates. Exterior projects should mention weather windows.',
    decisionAngle: 'Compare prep, coats, paint quality, protection, and warranty instead of competing only on price.',
  },
  'landscaping visit': {
    customerConcerns: ['curb appeal', 'maintenance cost', 'plant survival', 'drainage', 'crew reliability'],
    quoteInputs: ['yard size', 'cleanup or install goal', 'access and gates', 'drainage or slope', 'sun and shade', 'plant, mulch, irrigation, and haul-off needs'],
    trustProof: 'property-specific planning, plant and soil fit, clean edges, before-and-after photos, and reliable recurring scheduling',
    followUpTiming: 'Maintenance leads need a 24 to 48-hour cadence offer. Installs and cleanups need day-two scope/priorities, day-five weather or schedule reminder, and day-ten seasonal-window touch.',
    decisionAngle: 'Break the work into cleanup, priority areas, install, and maintenance so the customer can start smaller.',
  },
  'cleaning service': {
    customerConcerns: ['trust inside the home', 'deep-clean scope', 'pets', 'missed areas', 'recurring value'],
    quoteInputs: ['square footage', 'bedrooms and bathrooms', 'cleaning type', 'last cleaned', 'pets and clutter level', 'access, parking, supplies, and priority rooms'],
    trustProof: 'room-by-room checklist, arrival window, satisfaction policy, recurring consistency, and reviews',
    followUpTiming: 'Event, move-out, listing, or holiday cleans need same-day or next-day slot holds. Recurring leads need day-two plan comparison and day-seven first-visit reminder.',
    decisionAngle: 'Prioritize kitchens, baths, floors, and highest-impact rooms or convert a first deep clean into recurring service.',
  },
  'roof inspection': {
    customerConcerns: ['leaks', 'storm damage', 'insurance', 'repair versus replacement', 'workmanship warranty'],
    quoteInputs: ['roof age', 'leak location', 'storm date', 'material type', 'interior stain photos', 'attic access and insurance status'],
    trustProof: 'photo-documented inspection, repair-first guidance, material brands, warranty, cleanup, nail sweep, and insurance documentation support',
    followUpTiming: 'Active leaks or storm damage need same-day inspection follow-up. Replacement quotes need day-two material or warranty comparison, day-five weather-risk reminder, and day-ten insurance or financing check.',
    decisionAngle: 'Separate temporary mitigation, permanent repair, and replacement so the next step feels clear.',
  },
  'garage door repair': {
    customerConcerns: ['trapped car', 'home security', 'spring safety', 'opener reliability', 'upsell fear'],
    quoteInputs: ['door stuck open or closed', 'car trapped', 'spring condition', 'opener behavior', 'track or roller issue', 'door size and photos'],
    trustProof: 'repair-first diagnostics, common stocked parts, spring and opener expertise, safety testing, and warranty',
    followUpTiming: 'Trapped car or open door gets immediate follow-up and same-day booking. Standard noise or opener issues get day-one and day-three touches. Door replacement gets day-three and day-seven follow-up.',
    decisionAngle: 'Separate the function repair from quieter opener, smart opener, or full door upgrade options.',
  },
  'tree service': {
    customerConcerns: ['property damage', 'limb hazards', 'cleanup', 'permits', 'power lines', 'whether the tree can be saved'],
    quoteInputs: ['photos from multiple angles', 'tree size or species', 'proximity to structures or lines', 'storm damage', 'equipment access', 'haul-off, stump, permit, or HOA needs'],
    trustProof: 'insured crews, safety plan, property protection, cleanup clarity, arborist or health guidance where applicable, and utility-boundary awareness',
    followUpTiming: 'Hazardous limbs and storm damage need immediate contact. Routine pruning or removal gets day-two scope check, day-five access reminder, and day-ten slot touch.',
    decisionAngle: 'Split hazard removal, pruning, haul-off, and stump work so price and safety priorities are easier to evaluate.',
  },
  'pool service': {
    customerConcerns: ['green or cloudy water', 'equipment cost', 'swim readiness', 'recurring maintenance value', 'chemical safety'],
    quoteInputs: ['pool size and type', 'water photos', 'pump or filter behavior', 'filter type', 'last service', 'algae, leak, heater, salt, or chlorinator issues'],
    trustProof: 'water diagnostics, equipment checks, clear recovery plan, recurring checklist, and chemical balance guidance',
    followUpTiming: 'Green pool or equipment-down leads need day-zero and day-one follow-up. Recurring maintenance gets day-two cadence messaging. Swim-deadline leads need tighter same-day and 48-hour reminders.',
    decisionAngle: 'Separate water recovery, equipment diagnosis, repair or replacement, and ongoing maintenance.',
  },
  'pressure washing': {
    customerConcerns: ['surface damage', 'plant safety', 'paint or siding safety', 'streaks', 'weather'],
    quoteInputs: ['surfaces', 'square footage', 'photos', 'algae, rust, oil, or stains', 'height or stories', 'water access and delicate plants or outlets'],
    trustProof: 'surface-safe methods, soft-wash versus pressure explanation, plant protection, insured work, and before-and-after photos',
    followUpTiming: 'Listing, party, inspection, or event leads need a 24-hour slot hold. Standard quotes get day-two photo or scope check, day-five weather-window reminder, and day-ten curb-appeal touch.',
    decisionAngle: 'Prioritize driveway, front entry, siding, fence, deck, or highest-visibility areas if the full exterior is too much.',
  },
  'junk removal': {
    customerConcerns: ['price uncertainty', 'heavy item handling', 'donation or disposal', 'access and stairs', 'fast pickup'],
    quoteInputs: ['photos', 'item list and volume', 'heavy items', 'stairs or elevator', 'parking or truck access', 'hazardous items, donation preference, and pickup deadline'],
    trustProof: 'transparent volume pricing, careful removal, donation or recycling where possible, insured crew, and same/next-day windows',
    followUpTiming: 'Move, cleanout, renovation, or listing deadlines need immediate and same-day second touch. Standard pickup gets day-one. Larger cleanout gets day-two planning and day-five deadline reminder.',
    decisionAngle: 'Prioritize must-go items first and explain how volume or access can change the final price.',
  },
  'flooring project': {
    customerConcerns: ['material choice', 'total cost', 'disruption', 'subfloor surprises', 'timeline', 'durability'],
    quoteInputs: ['rooms and square footage', 'current flooring', 'desired material', 'subfloor concerns', 'stairs and transitions', 'furniture, pets, moisture, and finish date'],
    trustProof: 'accurate measurements, prep and subfloor clarity, material suitability, installation warranty, clean transitions, and portfolio',
    followUpTiming: 'Follow up day one on materials, day three on measurement or samples, day seven on install window and material availability, and day fourteen for longer project nurture.',
    decisionAngle: 'Offer good/better/best materials and explain prep or subfloor risk before promising timeline.',
  },
  'remodeling estimate': {
    customerConcerns: ['scope creep', 'budget', 'timeline', 'disruption', 'permits', 'design decisions'],
    quoteInputs: ['room type', 'must-haves', 'rough measurements', 'photos', 'budget range', 'selections, structural changes, permits, HOA, and occupancy constraints'],
    trustProof: 'written scope, phased options, change-order process, permit guidance, schedule communication, references, portfolio, and protection/cleanup plan',
    followUpTiming: 'Use day-one scope clarification, day-three budget or phasing note, day-seven decision-maker check, day-fourteen selections/timeline reminder, and monthly nurture for large projects.',
    decisionAngle: 'Separate must-haves from optional upgrades and phase the project around budget, selections, permits, and timeline.',
  },
  'handyman job': {
    customerConcerns: ['small job availability', 'hourly uncertainty', 'parts', 'workmanship', 'whether a specialist is needed'],
    quoteInputs: ['task list', 'photos', 'measurements', 'part or product links', 'wall or material type', 'access, priority order, deadline, and safety issues'],
    trustProof: 'clear task list, realistic time block, practical repair options, before-and-after photos, cleanup, and licensed trade referral when needed',
    followUpTiming: 'Follow up day one on tasks and priorities, day three on the appointment block, and day seven to bundle repairs before the next opening. Safety or function issues get same-day push.',
    decisionAngle: 'Set a time block and priority list so open-ended hourly work feels controlled.',
  },
  'pest control visit': {
    customerConcerns: ['health and safety', 'pets or kids', 'recurring infestations', 'chemicals', 'discreet service', 'speed'],
    quoteInputs: ['pest type or photos', 'activity location and frequency', 'entry points', 'indoor or outdoor issue', 'pets, children, allergies, previous treatments, and prevention interest'],
    trustProof: 'inspection-first plan, targeted treatment, prevention guidance, safety instructions, follow-up expectations, and licensed applicators where applicable',
    followUpTiming: 'Active infestations get day-zero and day-one follow-up. Initial treatment gets day-two expectation-setting and day-seven efficacy check. Recurring prevention follows lifecycle or seasonal reminders.',
    decisionAngle: 'Explain source, entry-point, and lifecycle treatment instead of only spraying what is visible.',
  },
};

const urgencyMultipliers: Record<string, number> = { normal: 1, soon: 1.12, emergency: 1.28 };
const tones: Record<string, string> = {
  direct: 'clear, confident, and to the point',
  warm: 'friendly, reassuring, and service-minded',
  premium: 'polished, calm, and high-trust',
};

function money(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

const leadStages: { status: LeadStatus; label: string; helper: string; action: string }[] = [
  { status: 'new', label: 'New', helper: 'First contact captured', action: 'Qualify the lead and confirm the job details.' },
  { status: 'qualified', label: 'Qualified', helper: 'Good fit, needs estimate', action: 'Build the estimate and send the first clear next step.' },
  { status: 'quoted', label: 'Quoted', helper: 'Estimate sent, waiting on answer', action: 'Follow up with the quote, deposit, timing, and objection response.' },
  { status: 'followed-up', label: 'Followed up', helper: 'Needs final answer', action: 'Ask for a final yes/no or set a specific later check-in.' },
  { status: 'won', label: 'Won', helper: 'Booked or accepted work', action: 'Confirm schedule, deposit, prep notes, and review opportunity.' },
  { status: 'lost', label: 'Lost', helper: 'Not moving forward', action: 'Record the loss reason and keep useful notes for future reactivation.' },
];

const leadStageOrder = leadStages.map((stage) => stage.status);

const winReasons = ['Booked quickly', 'Strong fit', 'Trusted the proof', 'Timing worked', 'Price accepted', 'Follow-up converted'];
const lossReasons = ['Price', 'Timing', 'No response', 'Competitor', 'Not qualified', 'Scope changed'];

const starterServicePresets: ServicePreset[] = [
  { id: 'preset-diagnostic', name: 'Diagnostic visit', jobType: 'HVAC repair', laborHours: 1, laborRate: 125, materials: 0, deposit: 0 },
  { id: 'preset-small-repair', name: 'Small repair block', jobType: 'handyman job', laborHours: 2, laborRate: 95, materials: 75, deposit: 30 },
  { id: 'preset-maintenance', name: 'Maintenance visit', jobType: 'landscaping visit', laborHours: 2, laborRate: 85, materials: 40, deposit: 25 },
  { id: 'preset-project', name: 'Medium project estimate', jobType: 'painting project', laborHours: 8, laborRate: 85, materials: 350, deposit: 40 },
];

function leadStatus(lead: SavedLead): LeadStatus {
  return lead.status || 'new';
}

function safeJsonArray<T>(value: string | null): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mergeById<T extends { id: string; createdAt?: string }>(localItems: T[], accountItems: T[], limit: number) {
  const byId = new Map<string, T>();
  [...accountItems, ...localItems].forEach((item) => byId.set(item.id, item));
  return Array.from(byId.values())
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, limit);
}

function servicePhrase(jobType: string) {
  return jobType.startsWith('HVAC') ? jobType : jobType.toLowerCase();
}

function lowerFirst(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

export function QuoteBuilder({ accountEmail, aiEnabled }: { accountEmail?: string; aiEnabled?: boolean }) {
  const [business, setBusiness] = useState('Acme Home Services');
  const [serviceArea, setServiceArea] = useState('the local area');
  const [brandVoice, setBrandVoice] = useState('clear, helpful, and no-pressure');
  const [differentiator, setDifferentiator] = useState('fast response, clean work, and clear next steps');
  const [guarantee, setGuarantee] = useState('we explain any change before work begins');
  const [customer, setCustomer] = useState('Jordan');
  const [jobType, setJobType] = useState(jobTypes[0]);
  const [laborHours, setLaborHours] = useState(3);
  const [laborRate, setLaborRate] = useState(95);
  const [materials, setMaterials] = useState(180);
  const [urgency, setUrgency] = useState('soon');
  const [deposit, setDeposit] = useState(30);
  const [tone, setTone] = useState('direct');
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [savedLeads, setSavedLeads] = useState<SavedLead[]>([]);
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadAddress, setLeadAddress] = useState('');
  const [leadNotes, setLeadNotes] = useState('');
  const [leadSource, setLeadSource] = useState('Website form');
  const [leadNextStep, setLeadNextStep] = useState('Send first response and confirm details');
  const [leadFollowUpDate, setLeadFollowUpDate] = useState('');
  const [leadAppointmentDate, setLeadAppointmentDate] = useState('');
  const [editingLead, setEditingLead] = useState<SavedLead | null>(null);
  const [editingQuote, setEditingQuote] = useState<SavedQuote | null>(null);
  const [customizedCopy, setCustomizedCopy] = useState<Record<string, string>>({});
  const [aiStatus, setAiStatus] = useState('');
  const [generatingSection, setGeneratingSection] = useState<string | null>(null);
  const [accountLoaded, setAccountLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<PortalTab>('hub');
  const [socialPlatform, setSocialPlatform] = useState('Facebook');
  const [socialGoal, setSocialGoal] = useState('Book more estimates');
  const [socialTopic, setSocialTopic] = useState('seasonal service reminder');
  const [customSocialPosts, setCustomSocialPosts] = useState<Record<number, string>>({});
  const [aiUsage, setAiUsage] = useState<{ used: number; remaining: number; total: number; enabled: boolean } | null>(null);
  const [servicePresets, setServicePresets] = useState<ServicePreset[]>(starterServicePresets);
  const [presetName, setPresetName] = useState('My saved service');
  const [customerReply, setCustomerReply] = useState('Can you do any better on price? I am comparing a few quotes.');
  const [coachedReply, setCoachedReply] = useState('');
  const [leadStageFilter, setLeadStageFilter] = useState<LeadStatus | 'all'>('all');

  useEffect(() => {
    const savedTab = window.localStorage.getItem('leadsprint-active-tab') as PortalTab | null;
    if (savedTab && ['hub', 'tool', 'social', 'leads', 'calendar', 'history', 'sales'].includes(savedTab)) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('leadsprint-active-tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    fetch('/api/ai/usage')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data?.ok) setAiUsage({ used: data.used, remaining: data.remaining, total: data.total, enabled: data.enabled }); })
      .catch(() => null);
  }, []);

  useEffect(() => {
    const localQuotes = safeJsonArray<SavedQuote>(window.localStorage.getItem('leadsprint-quotes'));
    const localLeads = safeJsonArray<SavedLead>(window.localStorage.getItem('leadsprint-leads'));
    const localPresets = safeJsonArray<ServicePreset>(window.localStorage.getItem('leadsprint-service-presets'));
    const profileRaw = window.localStorage.getItem('leadsprint-company-profile');
    if (localQuotes.length) setSavedQuotes(localQuotes);
    if (localLeads.length) setSavedLeads(localLeads);
    if (localPresets.length) setServicePresets(mergeById(starterServicePresets, localPresets, 40));
    if (profileRaw) {
      try {
        const profile = JSON.parse(profileRaw);
        setBusiness(profile.business || 'Acme Home Services');
        setServiceArea(profile.serviceArea || 'the local area');
        setBrandVoice(profile.brandVoice || 'clear, helpful, and no-pressure');
        setDifferentiator(profile.differentiator || 'fast response, clean work, and clear next steps');
        setGuarantee(profile.guarantee || 'we explain any change before work begins');
      } catch {}
    }

    fetch('/api/account', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!data?.ok) return;
        if (data.profile) {
          setBusiness(data.profile.business || 'Acme Home Services');
          setServiceArea(data.profile.serviceArea || 'the local area');
          setBrandVoice(data.profile.brandVoice || 'clear, helpful, and no-pressure');
          setDifferentiator(data.profile.differentiator || 'fast response, clean work, and clear next steps');
          setGuarantee(data.profile.guarantee || 'we explain any change before work begins');
        }
        const accountQuotes = Array.isArray(data.quotes) ? data.quotes as SavedQuote[] : [];
        const accountLeads = Array.isArray(data.leads) ? data.leads as SavedLead[] : [];
        const mergedQuotes = mergeById(localQuotes, accountQuotes, 50);
        const mergedLeads = mergeById(localLeads, accountLeads, 100);
        if (mergedQuotes.length) setSavedQuotes(mergedQuotes);
        if (mergedLeads.length) setSavedLeads(mergedLeads);

        const accountQuoteIds = new Set(accountQuotes.map((quote) => quote.id));
        localQuotes.filter((quote) => !accountQuoteIds.has(quote.id)).forEach((quote) => {
          fetch('/api/quotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quote }),
          }).catch(() => null);
        });

        const accountLeadIds = new Set(accountLeads.map((lead) => lead.id));
        localLeads.filter((lead) => !accountLeadIds.has(lead.id)).forEach((lead) => {
          fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lead }),
          }).catch(() => null);
        });
      })
      .catch(() => null)
      .finally(() => setAccountLoaded(true));
  }, []);

  useEffect(() => {
    window.localStorage.setItem('leadsprint-quotes', JSON.stringify(savedQuotes));
  }, [savedQuotes]);

  useEffect(() => {
    window.localStorage.setItem('leadsprint-leads', JSON.stringify(savedLeads));
  }, [savedLeads]);

  useEffect(() => {
    window.localStorage.setItem('leadsprint-service-presets', JSON.stringify(servicePresets));
  }, [servicePresets]);

  useEffect(() => {
    const profile = { business, serviceArea, brandVoice, differentiator, guarantee };
    window.localStorage.setItem('leadsprint-company-profile', JSON.stringify(profile));
    if (!accountLoaded) return;
    const timeout = window.setTimeout(() => {
      fetch('/api/account', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      }).catch(() => null);
    }, 600);
    return () => window.clearTimeout(timeout);
  }, [business, serviceArea, brandVoice, differentiator, guarantee, accountLoaded]);

  useEffect(() => {
    setCustomizedCopy({});
    setAiStatus('Generated text updated from the current quote options.');
  }, [business, serviceArea, brandVoice, differentiator, guarantee, customer, jobType, laborHours, laborRate, materials, urgency, deposit, tone]);

  const result = useMemo(() => {
    const subtotal = laborHours * laborRate + materials;
    const total = subtotal * urgencyMultipliers[urgency];
    const depositDue = total * (deposit / 100);
    const firstName = customer.trim().split(' ')[0] || 'there';
    const timePhrase = urgency === 'emergency' ? 'an opening today' : urgency === 'soon' ? 'an opening this week' : 'an opening when your schedule allows';
    const serviceRequest = servicePhrase(jobType);
    const riskSentence = lowerFirst(playbooks[jobType].risk);
    const playbook = playbooks[jobType];
    const detail = industryDetails[jobType];
    const inputFocus = detail.quoteInputs.slice(0, 5).join(', ');
    const customerConcerns = detail.customerConcerns.slice(0, 4).join(', ');
    const tonePhrase = `${tones[tone]}, with a brand voice that feels ${brandVoice}`;
    const bookingReason = urgency === 'emergency'
      ? `${playbook.urgencyReason}, so reserving the appointment now protects the fastest available response`
      : urgency === 'soon'
        ? `${playbook.urgencyReason}, so holding the slot now keeps the project moving`
        : `it gives you a clear next step without pressure`;

    return {
      total,
      depositDue,
      playbook,
      sms: `Hi ${firstName}, this is ${business}. I reviewed the ${serviceRequest} details and put together a working estimate of ${money(total)}. The main things we’ll confirm are ${inputFocus}. For ${serviceArea}, our focus is ${differentiator}. We can reserve ${timePhrase} with ${money(depositDue)} down. Want me to hold it?`,
      email: `Subject: ${jobType} estimate from ${business}\n\nHi ${firstName},\n\nThanks for reaching out to ${business}. Your working estimate is ${money(total)} for this ${serviceRequest}. That includes the expected labor, materials, and scheduling priority based on what you shared.\n\nFor this kind of request, customers usually care most about ${customerConcerns}. To keep the quote accurate, we’ll confirm ${inputFocus}.\n\nWhat matters for this type of work: ${playbook.risk}\n\nWhy customers choose us: ${differentiator}. Our approach is ${detail.trustProof}.\n\nTo reserve the next available opening, the deposit is ${money(depositDue)} (${deposit}%). ${playbook.prepNote}\n\nIf anything changes after we see the job in person, ${guarantee}.\n\nBest,\n${business}`,
      call: `Open with: “Hi ${firstName}, this is ${business}. I saw your ${serviceRequest} request and wanted to help you get a clear answer quickly.”\n\nMatch the brand voice: ${tonePhrase}.\n\nListen for customer concerns around ${customerConcerns}.\n\nQualify for this job: ask about ${playbook.qualify}.\n\nBuild confidence: “For this kind of work, we focus on ${detail.trustProof}. The main reason to handle it now is that ${riskSentence}”\n\nClose: “The working estimate is ${money(total)}. I can reserve the next opening with ${money(depositDue)} down because ${bookingReason}. Should I hold that spot for you?”`,
      sequence: [
        `Day 0: Hi ${firstName}, this is ${business}. Your ${serviceRequest} estimate is ${money(total)}. Because ${playbook.urgencyReason}, I can reserve the next opening with ${money(depositDue)} down. Want me to hold it?`,
        `Day 1: Quick follow-up, ${firstName}. For this ${serviceRequest}, the main thing to avoid is that ${riskSentence} If you want the current opening, I can reserve it with the ${deposit}% deposit.`,
        `Day 3: Hi ${firstName}, checking before we release this ${serviceRequest} estimate window. We’ll use ${inputFocus} to keep the quote accurate. ${playbook.prepNote} Do you want us to keep the ${money(total)} quote active?`,
        `Day 7: Last touch from ${business}. ${detail.followUpTiming} If this is still on your list, reply “ready” and we will help you ${playbook.closeBenefit}.`
      ],
      objectionReply: `If ${firstName} hesitates on price: “I understand. ${playbook.objection} ${detail.decisionAngle} The estimate is ${money(total)}, and the ${money(depositDue)} deposit simply reserves the appointment so we can keep the schedule clear for you.”`,
      quoteInputs: detail.quoteInputs,
      customerConcerns: detail.customerConcerns,
      trustProof: detail.trustProof,
      followUpTiming: detail.followUpTiming,
    };
  }, [business, serviceArea, brandVoice, differentiator, guarantee, customer, jobType, laborHours, laborRate, materials, urgency, deposit, tone]);

  const stats = useMemo(() => {
    const totalQuoted = savedQuotes.reduce((sum, quote) => sum + quote.total, 0);
    const won = savedQuotes.filter((quote) => quote.status === 'won');
    const open = savedQuotes.filter((quote) => quote.status === 'open');
    const winRate = savedQuotes.length ? Math.round((won.length / savedQuotes.length) * 100) : 0;
    return { totalQuoted, won: won.length, open: open.length, winRate };
  }, [savedQuotes]);

  const pipelineStats = useMemo(() => {
    const active = savedLeads.filter((lead) => !['won', 'lost'].includes(leadStatus(lead))).length;
    const won = savedLeads.filter((lead) => leadStatus(lead) === 'won').length;
    const lost = savedLeads.filter((lead) => leadStatus(lead) === 'lost').length;
    return { active, won, lost, total: savedLeads.length };
  }, [savedLeads]);

  const leadWorkflow = useMemo(() => {
    const normalizedCustomer = customer.trim().toLowerCase();
    const currentLead = savedLeads.find((lead) => lead.name.trim().toLowerCase() === normalizedCustomer) || savedLeads[0] || null;
    const currentStage = currentLead ? leadStatus(currentLead) : 'new';
    const stageIndex = Math.max(0, leadStageOrder.indexOf(currentStage));
    const stage = leadStages.find((item) => item.status === currentStage) || leadStages[0];
    const latestQuote = currentLead ? savedQuotes.find((quote) => quote.customer.trim().toLowerCase() === currentLead.name.trim().toLowerCase()) : null;
    const checklist = [
      { label: 'Contact captured', done: Boolean(currentLead?.phone || currentLead?.email) },
      { label: 'Job notes saved', done: Boolean(currentLead?.notes) },
      { label: 'Lead qualified', done: stageIndex >= leadStageOrder.indexOf('qualified') || Boolean(latestQuote) },
      { label: 'Estimate sent', done: Boolean(latestQuote) || stageIndex >= leadStageOrder.indexOf('quoted') },
      { label: 'Follow-up completed', done: stageIndex >= leadStageOrder.indexOf('followed-up') },
      { label: 'Final answer recorded', done: currentStage === 'won' || currentStage === 'lost' },
    ];
    return { currentLead, currentStage, stageIndex, stage, latestQuote, checklist };
  }, [customer, savedLeads, savedQuotes]);

  const calendarItems = useMemo(() => {
    const items = savedLeads.flatMap((lead) => {
      const base = { lead, status: leadStatus(lead) };
      return [
        lead.followUpDate ? { ...base, date: lead.followUpDate, type: 'Follow-up', detail: lead.nextStep || 'Follow up with this lead' } : null,
        lead.appointmentDate ? { ...base, date: lead.appointmentDate, type: 'Sales appointment', detail: 'Booked sales call, estimate visit, or job decision' } : null,
      ].filter(Boolean) as { lead: SavedLead; status: LeadStatus; date: string; type: string; detail: string }[];
    });
    return items.sort((a, b) => a.date.localeCompare(b.date));
  }, [savedLeads]);

  const todayKey = new Date().toISOString().slice(0, 10);

  const todaysFollowUps = useMemo(() => calendarItems.filter((item) => item.type === 'Follow-up' && item.date === todayKey), [calendarItems, todayKey]);

  const overdueFollowUps = useMemo(() => calendarItems.filter((item) => item.type === 'Follow-up' && item.date < todayKey && !['won', 'lost'].includes(item.status)), [calendarItems, todayKey]);

  const upcomingCalendarItems = useMemo(() => calendarItems.filter((item) => item.date >= todayKey).slice(0, 12), [calendarItems, todayKey]);

  const calendarDays = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`;
      return { date, day: index + 1, items: calendarItems.filter((item) => item.date === date) };
    });
  }, [calendarItems]);

  const hubSummary = useMemo(() => {
    const openValue = savedQuotes.filter((quote) => quote.status === 'open').reduce((sum, quote) => sum + quote.total, 0);
    const wonValue = savedQuotes.filter((quote) => quote.status === 'won').reduce((sum, quote) => sum + quote.total, 0);
    const newestLead = savedLeads[0] || null;
    return { openValue, wonValue, newestLead };
  }, [savedLeads, savedQuotes]);

  const leadSourceRoi = useMemo(() => {
    const bySource = new Map<string, { source: string; total: number; won: number; lost: number; quotedValue: number; wonValue: number }>();
    savedLeads.forEach((lead) => {
      const source = (lead.source || 'Unknown').trim() || 'Unknown';
      if (!bySource.has(source)) bySource.set(source, { source, total: 0, won: 0, lost: 0, quotedValue: 0, wonValue: 0 });
      const row = bySource.get(source)!;
      const status = leadStatus(lead);
      const leadQuotes = savedQuotes.filter((quote) => quote.customer.trim().toLowerCase() === lead.name.trim().toLowerCase());
      const quotedValue = leadQuotes.reduce((sum, quote) => sum + quote.total, 0);
      const wonValue = leadQuotes.filter((quote) => quote.status === 'won' || status === 'won').reduce((sum, quote) => sum + quote.total, 0);
      row.total += 1;
      row.quotedValue += quotedValue;
      row.wonValue += wonValue;
      if (status === 'won') row.won += 1;
      if (status === 'lost') row.lost += 1;
    });
    const rows = Array.from(bySource.values()).map((row) => ({
      ...row,
      winRate: row.total ? Math.round((row.won / row.total) * 100) : 0,
      avgQuoted: row.total ? Math.round(row.quotedValue / row.total) : 0,
    })).sort((a, b) => b.wonValue - a.wonValue || b.quotedValue - a.quotedValue || b.total - a.total);
    return { rows, best: rows[0] || null };
  }, [savedLeads, savedQuotes]);

  const currentLeadTimeline = useMemo(() => {
    const lead = leadWorkflow.currentLead;
    if (!lead) return [];
    const normalizedName = lead.name.trim().toLowerCase();
    const leadQuotes = savedQuotes.filter((quote) => quote.customer.trim().toLowerCase() === normalizedName);
    const events = [
      { date: lead.createdAt, title: 'Lead created', detail: `${lead.source || 'Unknown source'}${lead.notes ? ` · ${lead.notes}` : ''}` },
      { date: lead.createdAt, title: `Current stage: ${leadStages.find((stage) => stage.status === leadStatus(lead))?.label || 'New'}`, detail: lead.nextStep || leadStages.find((stage) => stage.status === leadStatus(lead))?.action || 'Confirm the next step' },
      lead.followUpDate ? { date: lead.followUpDate, title: 'Follow-up scheduled', detail: lead.nextStep || 'Follow up with this lead' } : null,
      lead.appointmentDate ? { date: lead.appointmentDate, title: 'Sales / appointment date', detail: 'Sales call, estimate visit, or decision checkpoint' } : null,
      ...leadQuotes.map((quote) => ({ date: quote.createdAt, title: `${quote.status === 'won' ? 'Won' : quote.status === 'lost' ? 'Lost' : 'Quote saved'}`, detail: `${quote.jobType} · ${money(quote.total)}${quote.winLossReason ? ` · ${quote.winLossReason}` : ''}` })),
    ].filter(Boolean) as { date: string; title: string; detail: string }[];
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [leadWorkflow.currentLead, savedQuotes]);

  const visibleLeadStages = useMemo(() => leadStages
    .filter((stage) => leadStageFilter === 'all' || stage.status === leadStageFilter)
    .map((stage) => ({ ...stage, leads: savedLeads.filter((lead) => leadStatus(lead) === stage.status) })), [leadStageFilter, savedLeads]);

  const customerProfiles = useMemo(() => savedLeads.map((lead) => {
    const leadQuotes = savedQuotes.filter((quote) => quote.customer.trim().toLowerCase() === lead.name.trim().toLowerCase());
    const totalQuoted = leadQuotes.reduce((sum, quote) => sum + quote.total, 0);
    const lastQuote = leadQuotes[0];
    return { lead, leadQuotes, totalQuoted, lastQuote };
  }), [savedLeads, savedQuotes]);

  const monthlyScripts = useMemo(() => {
    const firstName = customer.trim().split(' ')[0] || 'there';
    return [
      { title: 'Slow lead reactivation', text: `Hi ${firstName}, this is ${business}. Just checking whether the ${jobType.toLowerCase()} is still on your list. We still have a few ${serviceArea} openings, and I can help you choose the simplest next step if timing or budget changed.` },
      { title: 'Seasonal check-in', text: `${business} is helping ${serviceArea} homeowners get ahead of seasonal service issues. If you want us to look at ${jobType.toLowerCase()} before the schedule fills, reply with a good day and I will send the next available options.` },
      { title: 'Payment plan language', text: `If it helps, we can separate the must-do work from optional upgrades and talk through deposit or phasing options. The goal is to solve the urgent part first without making the decision feel rushed.` },
      { title: 'Review request', text: `Thanks again for choosing ${business}. If the work felt clear, professional, and easy, would you mind leaving us a quick review? It helps other ${serviceArea} homeowners know who they can trust.` },
    ];
  }, [business, customer, jobType, serviceArea]);

  const reviewPrompts = useMemo(() => ({
    sms: `Hi ${customer.trim().split(' ')[0] || 'there'}, thanks again for choosing ${business}. If everything went smoothly, would you leave us a quick review? It helps local homeowners feel confident reaching out to us.`,
    email: `Subject: Quick favor after your ${jobType.toLowerCase()}\n\nHi ${customer.trim().split(' ')[0] || 'there'},\n\nThanks again for choosing ${business}. We appreciate the chance to help in ${serviceArea}. If the experience felt clear, professional, and easy, would you leave us a quick review?\n\nYour feedback helps other local homeowners know what to expect before they reach out.\n\nThank you,\n${business}`,
  }), [business, customer, jobType, serviceArea]);

  const stageTemplates = useMemo(() => {
    const firstName = customer.trim().split(' ')[0] || 'there';
    const lead = leadWorkflow.currentLead;
    const phoneOrEmail = lead ? [lead.phone, lead.email].filter(Boolean).join(' / ') : '';
    return [
      { stage: 'New lead reply', text: `Hi ${firstName}, this is ${business}. Thanks for reaching out about ${jobType.toLowerCase()}. I can help. Can you send the service address, a quick description of what is going on, and a couple photos if possible? Once I have that, I’ll give you the clearest next step.` },
      { stage: 'Need photos/details', text: `Hi ${firstName}, to keep this accurate, can you send photos and any details about access, timing, and what you have already tried? For ${jobType.toLowerCase()}, the details that matter most are ${result.quoteInputs.slice(0, 4).join(', ')}.` },
      { stage: 'Estimate sent', text: `Hi ${firstName}, I sent over the ${jobType.toLowerCase()} estimate. The working total is ${money(result.total)}, and ${money(result.depositDue)} reserves the appointment. Do you want me to hold the next available opening?` },
      { stage: '24-hour follow-up', text: `Hi ${firstName}, quick follow-up from ${business}. Did you want to move forward with the ${jobType.toLowerCase()} estimate, or is there anything you want me to clarify before you decide?` },
      { stage: 'Final check-in', text: `Hi ${firstName}, last check-in on this ${jobType.toLowerCase()} estimate before I close the loop. If timing or budget changed, no problem. If you still want help, reply “ready” and I’ll help with the next step.` },
      { stage: 'Won job confirmation', text: `Great, ${firstName}. You’re confirmed with ${business}. We have ${lead?.appointmentDate ? `the appointment set for ${lead.appointmentDate}` : 'the next step ready'}, and the deposit/booking amount is ${money(result.depositDue)} if required. We’ll keep the process ${brandVoice} and let you know if anything changes.` },
      { stage: 'Lost lead reactivation', text: `Hi ${firstName}, this is ${business}. Just checking whether the ${jobType.toLowerCase()} is still on your list. If the timing, scope, or budget changed, I can help you choose the simplest next step.` },
      { stage: 'Contact note', text: `Lead: ${customer}\nContact: ${phoneOrEmail || 'No contact saved'}\nSource: ${lead?.source || leadSource || 'Unknown'}\nNext step: ${lead?.nextStep || leadNextStep}\nFollow-up: ${lead?.followUpDate || leadFollowUpDate || 'Not set'}` },
    ];
  }, [business, brandVoice, customer, jobType, leadFollowUpDate, leadNextStep, leadSource, leadWorkflow.currentLead, result, serviceArea]);

  const winLossBreakdown = useMemo(() => {
    const tracked = savedQuotes.filter((quote) => quote.status !== 'open');
    const reasons = tracked.reduce<Record<string, number>>((acc, quote) => {
      const reason = quote.winLossReason || 'No reason set';
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {});
    return { tracked: tracked.length, reasons: Object.entries(reasons).sort((a, b) => b[1] - a[1]) };
  }, [savedQuotes]);

  useEffect(() => {
    setCustomSocialPosts({});
  }, [business, serviceArea, brandVoice, differentiator, guarantee, jobType, socialPlatform, socialGoal, socialTopic]);

  const socialPosts = useMemo(() => {
    const detail = industryDetails[jobType];
    const playbook = playbooks[jobType];
    const platformStyle = socialPlatform === 'Instagram'
      ? 'short, visual, friendly, with a few hashtags'
      : socialPlatform === 'Google Business Profile'
        ? 'local, direct, service-focused, with a clear call to book'
        : socialPlatform === 'LinkedIn'
          ? 'professional, trust-building, and operationally clear'
          : socialPlatform === 'Nextdoor'
            ? 'neighborly, practical, and community-minded'
            : 'clear, conversational, and easy to respond to';
    const cta = socialPlatform === 'Instagram' ? 'DM us for an estimate.' : socialPlatform === 'Google Business Profile' ? 'Call or message us to schedule an estimate.' : 'Reply or message us to get on the schedule.';
    const goalAngles: Record<string, string> = {
      'Book more estimates': `invite people to request a clear estimate and mention that ${detail.quoteInputs.slice(0, 3).join(', ')} help keep it accurate`,
      'Promote seasonal maintenance': `connect ${socialTopic} to timing, prevention, and schedule availability in ${serviceArea}`,
      'Educate customers': `teach customers what to look for, especially ${detail.customerConcerns.slice(0, 3).join(', ')}`,
      'Show trust and proof': `lead with proof: ${detail.trustProof}`,
      'Win urgent calls': `stress real urgency without scare tactics: ${playbook.urgencyReason}`,
    };
    const topicLine = socialTopic.trim() || `${jobType} reminder`;
    return [
      `${topicLine}: ${goalAngles[socialGoal]}.\n\n${business} helps ${serviceArea} homeowners with ${jobType.toLowerCase()} by focusing on ${differentiator}. For this service, the big things to watch are ${detail.customerConcerns.slice(0, 3).join(', ')}.\n\n${cta}`,
      `Not every ${jobType.toLowerCase()} quote is the same. For ${topicLine.toLowerCase()}, the details that matter most are ${detail.quoteInputs.slice(0, 5).join(', ')}.\n\n${business} keeps the process ${brandVoice}, with ${guarantee}. ${cta}`,
      `${socialGoal}: ${topicLine}\n\n${playbook.risk} That’s why ${business} gives ${serviceArea} customers a clear next step, practical prep guidance, and service recommendations based on the actual situation.\n\n${playbook.prepNote}\n\n${cta}`,
    ].map((post) => `${post}\n\nStyle: ${platformStyle}`);
  }, [business, serviceArea, brandVoice, differentiator, guarantee, jobType, socialPlatform, socialGoal, socialTopic]);

  function saveLead() {
    const lead: SavedLead = {
      id: crypto.randomUUID(),
      name: customer,
      phone: leadPhone,
      email: leadEmail,
      address: leadAddress,
      notes: leadNotes,
      source: leadSource,
      nextStep: leadNextStep,
      followUpDate: leadFollowUpDate,
      appointmentDate: leadAppointmentDate,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setSavedLeads((leads) => [lead, ...leads].slice(0, 100));
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead }),
    }).catch(() => null);
  }

  function saveQuote() {
    const quote: SavedQuote = {
      id: crypto.randomUUID(),
      customer,
      jobType,
      total: result.total,
      depositDue: result.depositDue,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const normalizedCustomer = customer.trim().toLowerCase();
    const existingLead = savedLeads.find((lead) => lead.name.trim().toLowerCase() === normalizedCustomer);
    const leadFromQuote: SavedLead = {
      id: existingLead?.id || crypto.randomUUID(),
      name: customer,
      phone: existingLead?.phone || leadPhone,
      email: existingLead?.email || leadEmail,
      address: existingLead?.address || leadAddress,
      notes: existingLead?.notes || `${jobType} quote: ${money(result.total)}`,
      source: existingLead?.source || leadSource,
      nextStep: 'Follow up on estimate and ask for a yes/no decision',
      followUpDate: existingLead?.followUpDate || leadFollowUpDate,
      appointmentDate: existingLead?.appointmentDate || leadAppointmentDate,
      status: 'quoted',
      createdAt: existingLead?.createdAt || new Date().toISOString(),
    };
    setSavedQuotes((quotes) => [quote, ...quotes].slice(0, 50));
    setSavedLeads((leads) => [leadFromQuote, ...leads.filter((lead) => lead.id !== leadFromQuote.id)].slice(0, 100));
    fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quote }),
    }).catch(() => null);
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead: leadFromQuote }),
    }).catch(() => null);
  }

  function updateStatus(id: string, status: QuoteStatus) {
    let updatedQuote: SavedQuote | null = null;
    setSavedQuotes((quotes) => quotes.map((quote) => {
      if (quote.id !== id) return quote;
      updatedQuote = { ...quote, status, winLossReason: status === 'open' ? undefined : quote.winLossReason };
      return updatedQuote;
    }));
    window.setTimeout(() => {
      if (!updatedQuote) return;
      fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote: updatedQuote }),
      }).catch(() => null);
    }, 0);
  }

  function updateQuoteReason(id: string, winLossReason: string) {
    let updatedQuote: SavedQuote | null = null;
    setSavedQuotes((quotes) => quotes.map((quote) => {
      if (quote.id !== id) return quote;
      updatedQuote = { ...quote, winLossReason };
      return updatedQuote;
    }));
    window.setTimeout(() => {
      if (!updatedQuote) return;
      fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote: updatedQuote }),
      }).catch(() => null);
    }, 0);
  }

  function applyServicePreset(preset: ServicePreset) {
    setJobType(preset.jobType);
    setLaborHours(preset.laborHours);
    setLaborRate(preset.laborRate);
    setMaterials(preset.materials);
    setDeposit(preset.deposit);
    setAiStatus(`Applied ${preset.name}.`);
  }

  function saveCurrentServicePreset() {
    const preset: ServicePreset = { id: crypto.randomUUID(), name: presetName || `${jobType} preset`, jobType, laborHours, laborRate, materials, deposit };
    setServicePresets((presets) => [preset, ...presets].slice(0, 40));
    setAiStatus(`Saved ${preset.name} as a reusable service preset.`);
  }

  function loadCustomerProfile(lead: SavedLead) {
    setCustomer(lead.name);
    setLeadPhone(lead.phone);
    setLeadEmail(lead.email);
    setLeadAddress(lead.address);
    setLeadNotes(lead.notes);
    setLeadSource(lead.source || 'Website form');
    setLeadNextStep(lead.nextStep || leadStages.find((stage) => stage.status === leadStatus(lead))?.action || 'Confirm the next step');
    setLeadFollowUpDate(lead.followUpDate || '');
    setLeadAppointmentDate(lead.appointmentDate || '');
    setActiveTab('leads');
    setAiStatus(`Loaded ${lead.name}'s contact profile.`);
  }

  function saveLeadEdit() {
    if (!editingLead) return;
    setSavedLeads((leads) => leads.map((lead) => lead.id === editingLead.id ? editingLead : lead));
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead: editingLead }),
    }).catch(() => null);
    setEditingLead(null);
  }

  function updateLeadStatus(id: string, status: LeadStatus) {
    let updatedLead: SavedLead | null = null;
    const nextAction = leadStages.find((stage) => stage.status === status)?.action;
    setSavedLeads((leads) => leads.map((lead) => {
      if (lead.id !== id) return lead;
      updatedLead = { ...lead, status, nextStep: nextAction || lead.nextStep };
      return updatedLead;
    }));
    window.setTimeout(() => {
      if (!updatedLead) return;
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: updatedLead }),
      }).catch(() => null);
    }, 0);
  }

  function moveCurrentLead(status: LeadStatus) {
    const currentLead = leadWorkflow.currentLead;
    if (!currentLead) {
      setAiStatus('Save the lead first, then move it through the workflow.');
      return;
    }
    updateLeadStatus(currentLead.id, status);
    setAiStatus(`${currentLead.name} moved to ${leadStages.find((stage) => stage.status === status)?.label || status}.`);
  }

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setAiStatus(`Copied ${label}.`);
    } catch {
      setAiStatus('Copy failed. Select the text and copy manually.');
    }
  }

  function saveQuoteEdit() {
    if (!editingQuote) return;
    setSavedQuotes((quotes) => quotes.map((quote) => quote.id === editingQuote.id ? editingQuote : quote));
    fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quote: editingQuote }),
    }).catch(() => null);
    setEditingQuote(null);
  }

  async function enhanceCopy(title: string, text: string, action = 'rewrite') {
    if (generatingSection) return;
    setGeneratingSection(title);
    setAiStatus(`Customizing ${title.toLowerCase()}...`);
    const detail = industryDetails[jobType];
    const company = `Business: ${business}\nService area: ${serviceArea}\nBrand voice: ${brandVoice}\nWhy customers choose us: ${differentiator}\nTrust promise: ${guarantee}\nIndustry customer concerns: ${detail.customerConcerns.join(', ')}\nIndustry quote inputs: ${detail.quoteInputs.join(', ')}\nIndustry trust proof: ${detail.trustProof}\nIndustry follow-up timing: ${detail.followUpTiming}`;
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        company,
        industry: jobType,
        source: text,
        instruction: `Add a deeper customization layer for ${customer}. Keep it customer-facing, specific to the job type, and ready to send. Reflect the industry's real buyer concerns, quote inputs, timing, prep, and objection dynamics.`,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setAiStatus(data.message || 'AI customization is unavailable.');
      setGeneratingSection(null);
      return;
    }
    if (data.output) setCustomizedCopy((copy) => ({ ...copy, [title]: data.output }));
    if (typeof data.remaining === 'number') setAiUsage({ used: data.used, remaining: data.remaining, total: 50, enabled: true });
    setAiStatus(`Customized ${title.toLowerCase()}. ${data.remaining} AI credits left this month.`);
    setGeneratingSection(null);
  }

  async function enhanceSocialPost(index: number, text: string) {
    if (generatingSection) return;
    setGeneratingSection(`Social post ${index + 1}`);
    setAiStatus(`Customizing social post option ${index + 1}...`);
    const detail = industryDetails[jobType];
    const company = `Business: ${business}\nService area: ${serviceArea}\nBrand voice: ${brandVoice}\nWhy customers choose us: ${differentiator}\nTrust promise: ${guarantee}\nPlatform: ${socialPlatform}\nPost goal: ${socialGoal}\nPost topic: ${socialTopic}\nIndustry customer concerns: ${detail.customerConcerns.join(', ')}\nIndustry quote inputs: ${detail.quoteInputs.join(', ')}\nIndustry trust proof: ${detail.trustProof}`;
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'social',
        company,
        industry: jobType,
        source: text,
        instruction: `Rewrite this into a more custom ${socialPlatform} post. It must strongly reflect the selected goal (${socialGoal}) and topic (${socialTopic}). Make it specific to the company, industry, customer concerns, and platform. Return only the finished post.`,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setAiStatus(data.message || 'AI customization is unavailable.');
      setGeneratingSection(null);
      return;
    }
    if (data.output) setCustomSocialPosts((posts) => ({ ...posts, [index]: data.output }));
    if (typeof data.remaining === 'number') setAiUsage({ used: data.used, remaining: data.remaining, total: 50, enabled: true });
    setAiStatus(`Customized social post option ${index + 1}. ${data.remaining} AI credits left this month.`);
    setGeneratingSection(null);
  }

  async function coachFollowUpReply() {
    if (generatingSection) return;
    const fallback = `Hi ${customer.trim().split(' ')[0] || 'there'}, I understand. For this ${jobType.toLowerCase()}, the best next step is to separate the must-handle items from anything optional so you can make a clear decision. The working estimate is ${money(result.total)}, and the deposit to hold the schedule is ${money(result.depositDue)}. If price or timing is the concern, I can walk you through the simplest option first.`;

    if (!aiEnabled) {
      setCoachedReply(fallback);
      setAiStatus('Generated a non-AI follow-up coach reply. Live + AI can tailor this from the exact customer message.');
      return;
    }

    setGeneratingSection('Follow-up coach');
    setAiStatus('Coaching the best reply...');
    const detail = industryDetails[jobType];
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'follow-up-coach',
        company: `Business: ${business}\nService area: ${serviceArea}\nBrand voice: ${brandVoice}\nWhy customers choose us: ${differentiator}\nTrust promise: ${guarantee}`,
        industry: jobType,
        source: customerReply,
        instruction: `The customer replied to a quote. Write the best concise SMS reply for ${customer}. It should address the concern, protect trust, avoid sounding desperate, and move toward a clear next step. Quote total: ${money(result.total)}. Deposit: ${money(result.depositDue)}. Industry concerns: ${detail.customerConcerns.join(', ')}. Return only the message to send.`,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setCoachedReply(fallback);
      setAiStatus(data.message || 'AI coach unavailable, showing a strong fallback reply.');
      setGeneratingSection(null);
      return;
    }
    setCoachedReply(data.output || fallback);
    if (typeof data.remaining === 'number') setAiUsage({ used: data.used, remaining: data.remaining, total: 50, enabled: true });
    setAiStatus(`Follow-up coach reply ready. ${data.remaining} AI credits left this month.`);
    setGeneratingSection(null);
  }

  return (
    <>
      {aiEnabled ? <aside className="ai-credit-widget"><span>AI credits</span><strong>{aiUsage ? aiUsage.remaining : '—'} / {aiUsage ? aiUsage.total : 50}</strong><small>{aiUsage ? `${aiUsage.used} used this month` : 'Loading usage'}</small></aside> : null}
      <div className="portal-tabs" role="tablist" aria-label="Customer portal sections">
        <button type="button" className={activeTab === 'hub' ? 'active' : ''} onClick={() => setActiveTab('hub')}>Hub</button>
        <button type="button" className={activeTab === 'tool' ? 'active' : ''} onClick={() => setActiveTab('tool')}>Quote tool</button>
        <button type="button" className={activeTab === 'social' ? 'active' : ''} onClick={() => setActiveTab('social')}>Social posts</button>
        <button type="button" className={activeTab === 'leads' ? 'active' : ''} onClick={() => setActiveTab('leads')}>Lead pipeline</button>
        <button type="button" className={activeTab === 'calendar' ? 'active' : ''} onClick={() => setActiveTab('calendar')}>Calendar{todaysFollowUps.length + overdueFollowUps.length ? ` (${todaysFollowUps.length + overdueFollowUps.length})` : ''}</button>
        <button type="button" className={activeTab === 'sales' ? 'active' : ''} onClick={() => setActiveTab('sales')}>Sales tools</button>
        <button type="button" className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>Saved history</button>
      </div>

      {activeTab === 'hub' ? <section className="portal-panel-grid single hub-grid">
        <article className="copy-card hub-hero-card">
          <div><span className="eyebrow">LeadSprint Hub</span><h2>Today’s sales command center</h2><p>See what needs attention, where the pipeline stands, and which leads to work next.</p></div>
          <div className="hub-actions"><button type="button" className="button" onClick={() => setActiveTab('leads')}>Work leads</button><button type="button" className="button secondary" onClick={() => setActiveTab('calendar')}>Open calendar</button></div>
        </article>
        <article className="copy-card"><h3>Pipeline snapshot</h3><div className="hub-metrics"><span><strong>{pipelineStats.total}</strong>Total leads</span><span><strong>{pipelineStats.active}</strong>Active</span><span><strong>{pipelineStats.won}</strong>Won</span><span><strong>{pipelineStats.lost}</strong>Lost</span></div></article>
        <article className="copy-card"><h3>Money snapshot</h3><div className="hub-metrics"><span><strong>{money(hubSummary.openValue)}</strong>Open quoted</span><span><strong>{money(hubSummary.wonValue)}</strong>Won revenue</span><span><strong>{stats.winRate}%</strong>Quote win rate</span><span><strong>{money(stats.totalQuoted)}</strong>Total quoted</span></div></article>
        <article className="copy-card"><div className="card-title-row"><h3>Needs attention</h3><button type="button" className="button mini secondary-button" onClick={() => setActiveTab('calendar')}>View all</button></div><div className="pipeline-metrics"><span>{todaysFollowUps.length} due today</span><span>{overdueFollowUps.length} overdue</span><span>{upcomingCalendarItems.length} upcoming</span></div>{[...overdueFollowUps, ...todaysFollowUps].slice(0, 4).map((item) => <div className="hub-list-item" key={`${item.lead.id}-${item.date}-${item.type}`}><strong>{item.lead.name}</strong><span>{item.type} · {item.date} · {item.detail}</span><button type="button" className="button mini secondary-button" onClick={() => loadCustomerProfile(item.lead)}>Open</button></div>)}</article>
        <article className="copy-card"><div className="card-title-row"><h3>Best lead source</h3><button type="button" className="button mini secondary-button" onClick={() => setActiveTab('sales')}>Sales tools</button></div>{leadSourceRoi.best ? <div className="hub-highlight"><strong>{leadSourceRoi.best.source}</strong><span>{leadSourceRoi.best.total} leads · {leadSourceRoi.best.winRate}% win rate · {money(leadSourceRoi.best.wonValue)} won value</span></div> : <p>Add lead sources to see what is working.</p>}</article>
        <article className="copy-card"><h3>Current lead</h3>{leadWorkflow.currentLead ? <div className="hub-highlight"><strong>{leadWorkflow.currentLead.name}</strong><span>{leadWorkflow.stage.label} · {leadWorkflow.currentLead.nextStep || leadWorkflow.stage.action}</span><button type="button" className="button mini" onClick={() => setActiveTab('leads')}>Continue</button></div> : <p>No current lead yet. Add one from Lead pipeline.</p>}</article>
      </section> : null}

      {activeTab === 'tool' ? <section className="builder-grid">
      <form className="builder-panel">
        <div className="form-section-title">Company profile</div>
        <label>Business name<input value={business} onChange={(e) => setBusiness(e.target.value)} /></label>
        <label>Service area<input value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} placeholder="Charleston, SC" /></label>
        <label>Brand voice<input value={brandVoice} onChange={(e) => setBrandVoice(e.target.value)} placeholder="friendly, expert, premium, direct" /></label>
        <label>Why customers choose you<textarea value={differentiator} onChange={(e) => setDifferentiator(e.target.value)} rows={3} /></label>
        <label>Trust promise<textarea value={guarantee} onChange={(e) => setGuarantee(e.target.value)} rows={2} /></label>

        <div className="form-section-title">Quote details</div>
        <label>Lead / customer name<input value={customer} onChange={(e) => setCustomer(e.target.value)} /></label>
        <label>Job type<select value={jobType} onChange={(e) => setJobType(e.target.value)}>{jobTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <div className="two-col">
          <label>Labor hours<input type="number" min="1" value={laborHours} onChange={(e) => setLaborHours(Number(e.target.value))} /></label>
          <label>Hourly rate<input type="number" min="25" value={laborRate} onChange={(e) => setLaborRate(Number(e.target.value))} /></label>
        </div>
        <div className="two-col">
          <label>Materials<input type="number" min="0" value={materials} onChange={(e) => setMaterials(Number(e.target.value))} /></label>
          <label>Deposit %<input type="number" min="0" max="100" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} /></label>
        </div>
        <label>Urgency<select value={urgency} onChange={(e) => setUrgency(e.target.value)}><option value="normal">Flexible</option><option value="soon">Soon</option><option value="emergency">Emergency</option></select></label>
        <label>Copy style<select value={tone} onChange={(e) => setTone(e.target.value)}><option value="direct">Direct</option><option value="warm">Warm</option><option value="premium">Premium</option></select></label>
        <button type="button" className="button secondary full" onClick={() => { setCustomizedCopy({}); setAiStatus('Generated text refreshed from the current quote options.'); }}>Refresh generated text</button>
        <button type="button" className="button full" onClick={saveQuote}>Save this quote</button>
      </form>
      <div className="output-panel">
        <div className="estimate-box">
          <small>{result.playbook.label} working estimate</small>
          <strong>{money(result.total)}</strong>
          <span>Deposit due: {money(result.depositDue)}</span>
        </div>
        <div className="industry-card">
          <strong>{result.playbook.label} playbook applied</strong>
          <p>{result.playbook.risk}</p>
          <span>{result.playbook.prepNote}</span>
        </div>
        <div className="industry-insight-grid">
          <article className="copy-card compact-card">
            <h3>Customer concerns</h3>
            <ul>{result.customerConcerns.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article className="copy-card compact-card">
            <h3>Quote inputs to collect</h3>
            <ul>{result.quoteInputs.slice(0, 6).map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article className="copy-card compact-card">
            <h3>Follow-up logic</h3>
            <p>{result.followUpTiming}</p>
          </article>
        </div>
        {accountEmail ? <p className="fine-print">Saving to account: {accountEmail}</p> : null}
        <div className="mini-stats">
          <div><strong>{savedQuotes.length}</strong><span>saved quotes</span></div>
          <div><strong>{money(stats.totalQuoted)}</strong><span>quoted pipeline</span></div>
          <div><strong>{stats.winRate}%</strong><span>tracked win rate</span></div>
        </div>
        <div className="ai-inline-panel"><span className="eyebrow">Live preview</span><p>Change the lead and quote details on the left to update the next-step messages before saving. Saving adds the quote and keeps the opportunity tied to the customer record.</p>{aiStatus ? <p className="fine-print">{aiStatus}</p> : null}{aiEnabled ? <p className="fine-print">Use AI when a section needs an extra custom pass for the customer, job, and brand voice.</p> : null}</div>
        <Output title="SMS follow-up" text={customizedCopy['SMS follow-up'] || result.sms} customized={Boolean(customizedCopy['SMS follow-up'])} aiEnabled={aiEnabled} generating={generatingSection === 'SMS follow-up'} disabled={Boolean(generatingSection)} onEnhance={() => enhanceCopy('SMS follow-up', customizedCopy['SMS follow-up'] || result.sms, 'rewrite')} />
        <Output title="Email follow-up" text={customizedCopy['Email follow-up'] || result.email} customized={Boolean(customizedCopy['Email follow-up'])} aiEnabled={aiEnabled} generating={generatingSection === 'Email follow-up'} disabled={Boolean(generatingSection)} onEnhance={() => enhanceCopy('Email follow-up', customizedCopy['Email follow-up'] || result.email, 'email')} />
        <Output title="Call script" text={customizedCopy['Call script'] || result.call} customized={Boolean(customizedCopy['Call script'])} aiEnabled={aiEnabled} generating={generatingSection === 'Call script'} disabled={Boolean(generatingSection)} onEnhance={() => enhanceCopy('Call script', customizedCopy['Call script'] || result.call, 'rewrite')} />
        <Output title="Objection response" text={customizedCopy['Objection response'] || result.objectionReply} customized={Boolean(customizedCopy['Objection response'])} aiEnabled={aiEnabled} generating={generatingSection === 'Objection response'} disabled={Boolean(generatingSection)} onEnhance={() => enhanceCopy('Objection response', customizedCopy['Objection response'] || result.objectionReply, 'objection')} />
        <article className="copy-card">
          <div className="card-title-row"><h3>Follow-up sequence {customizedCopy['Follow-up sequence'] ? <span className="customized-badge">AI customized</span> : null}</h3>{aiEnabled ? <button className="button mini" type="button" disabled={Boolean(generatingSection)} onClick={() => enhanceCopy('Follow-up sequence', customizedCopy['Follow-up sequence'] || result.sequence.join('\n'), 'sequence')}>{generatingSection === 'Follow-up sequence' ? <><span className="spinner" /> Generating</> : customizedCopy['Follow-up sequence'] ? 'Customize again' : 'Customize with AI'}</button> : null}</div>
          {customizedCopy['Follow-up sequence'] ? <pre>{customizedCopy['Follow-up sequence']}</pre> : <ol className="sequence-list">{result.sequence.map((step) => <li key={step}>{step}</li>)}</ol>}
        </article>
      </div>
    </section> : null}

      {activeTab === 'social' ? <section className="portal-panel-grid">
        <article className="builder-panel lead-entry-panel">
          <div className="form-section-title">Social post generator</div>
          <label>Platform<select value={socialPlatform} onChange={(e) => setSocialPlatform(e.target.value)}><option>Facebook</option><option>Instagram</option><option>Google Business Profile</option><option>LinkedIn</option><option>Nextdoor</option></select></label>
          <label>Industry<select value={jobType} onChange={(e) => setJobType(e.target.value)}>{jobTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
          <label>Post goal<select value={socialGoal} onChange={(e) => setSocialGoal(e.target.value)}><option>Book more estimates</option><option>Promote seasonal maintenance</option><option>Educate customers</option><option>Show trust and proof</option><option>Win urgent calls</option></select></label>
          <label>Post topic<input value={socialTopic} onChange={(e) => setSocialTopic(e.target.value)} placeholder="storm prep, spring cleaning, no-heat calls, etc." /></label>
          <p className="fine-print">Posts use the saved company profile plus the selected industry playbook.</p>
        </article>
        <article className="copy-card">
          <h3>{socialPlatform} post options</h3>
          <div className="social-post-list">
            {socialPosts.map((post, index) => {
              const visiblePost = customSocialPosts[index] || post;
              const generating = generatingSection === `Social post ${index + 1}`;
              return <article className="social-post-card" key={`${index}-${post}`}><div className="card-title-row"><strong>Option {index + 1} {customSocialPosts[index] ? <span className="customized-badge">AI customized</span> : null}</strong>{aiEnabled ? <button className="button mini" type="button" disabled={Boolean(generatingSection)} onClick={() => enhanceSocialPost(index, visiblePost)}>{generating ? <><span className="spinner" /> Generating</> : customSocialPosts[index] ? 'Customize again' : 'Customize with AI'}</button> : null}</div><pre>{visiblePost}</pre></article>;
            })}
          </div>
        </article>
      </section> : null}

      {activeTab === 'leads' ? <section className="portal-panel-grid single lead-management-layout">
        <article className="copy-card lead-selector-card">
          <div className="card-title-row"><div><h3>Select a lead</h3><p className="fine-print">Choose the lead up top, then update contact details, stage, follow-up dates, and next actions below.</p></div><span className="pipeline-total">{savedLeads.length} total</span></div>
          {savedLeads.length ? <div className="lead-selector-list">{savedLeads.map((lead) => <button type="button" key={lead.id} className={leadWorkflow.currentLead?.id === lead.id ? 'active' : ''} onClick={() => loadCustomerProfile(lead)}><strong>{lead.name}</strong><span>{leadStages.find((stage) => stage.status === leadStatus(lead))?.label}</span>{lead.followUpDate ? <small>Follow-up {lead.followUpDate}</small> : null}</button>)}</div> : <p>No leads yet. Add the first lead below.</p>}
        </article>
        <div className="lead-options-grid">
        <article className="builder-panel lead-entry-panel">
          <div className="form-section-title">Lead contact</div>
          <label>Lead / customer name<input value={customer} onChange={(e) => setCustomer(e.target.value)} /></label>
          <div className="two-col">
            <label>Lead phone<input value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} placeholder="(555) 123-4567" /></label>
            <label>Lead email<input type="email" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} placeholder="customer@email.com" /></label>
          </div>
          <label>Lead address<input value={leadAddress} onChange={(e) => setLeadAddress(e.target.value)} placeholder="Street, city, ZIP" /></label>
          <div className="two-col">
            <label>Lead source<input value={leadSource} onChange={(e) => setLeadSource(e.target.value)} placeholder="Google, referral, Facebook, phone call" /></label>
            <label>Follow-up date<input type="date" value={leadFollowUpDate} onChange={(e) => setLeadFollowUpDate(e.target.value)} /></label>
          </div>
          <div className="two-col">
            <label>Sales / appointment date<input type="date" value={leadAppointmentDate} onChange={(e) => setLeadAppointmentDate(e.target.value)} /></label>
            <label>Pipeline stage<select value={leadWorkflow.currentStage} onChange={(e) => leadWorkflow.currentLead ? updateLeadStatus(leadWorkflow.currentLead.id, e.target.value as LeadStatus) : null}>{leadStages.map((option) => <option value={option.status} key={option.status}>{option.label}</option>)}</select></label>
          </div>
          <label>Next step<input value={leadNextStep} onChange={(e) => setLeadNextStep(e.target.value)} placeholder="Send estimate, call back Friday, request photos" /></label>
          <label>Lead notes<textarea value={leadNotes} onChange={(e) => setLeadNotes(e.target.value)} rows={3} placeholder="Gate code, preferred time, issue summary, budget, photos needed, decision maker, etc." /></label>
          <button type="button" className="button full" onClick={saveLead}>Save lead contact</button>
        </article>
        <article className="copy-card lead-workflow-card">
          <div className="card-title-row"><div><h3>Selected lead workflow</h3><p className="fine-print">Pick a lead below, then use this guided panel to move it to the next answer.</p></div>{leadWorkflow.currentLead ? <span className="pipeline-total">{leadWorkflow.stage.label}</span> : null}</div>
          {leadWorkflow.currentLead ? <>
            <div className="selected-lead-title"><strong>{leadWorkflow.currentLead.name}</strong><span>{[leadWorkflow.currentLead.phone, leadWorkflow.currentLead.email].filter(Boolean).join(' · ') || 'No contact details yet'}</span></div>
            <div className="workflow-progress" aria-label="Lead workflow progress">{leadStages.map((stage, index) => <button key={stage.status} type="button" className={index <= leadWorkflow.stageIndex ? 'complete' : ''} onClick={() => moveCurrentLead(stage.status)}><span>{index + 1}</span>{stage.label}</button>)}</div>
            <div className="next-action-box"><strong>Recommended next action</strong><p>{leadWorkflow.currentLead.nextStep || leadWorkflow.stage.action}</p>{leadWorkflow.currentLead.followUpDate ? <span>Follow up on {leadWorkflow.currentLead.followUpDate}</span> : null}{leadWorkflow.currentLead.appointmentDate ? <span>Sales/appointment date: {leadWorkflow.currentLead.appointmentDate}</span> : null}</div>
            <div className="lead-checklist">{leadWorkflow.checklist.map((item) => <span key={item.label} className={item.done ? 'done' : ''}>{item.done ? '✓' : '○'} {item.label}</span>)}</div>
            <div className="hero-actions"><button type="button" className="button secondary" onClick={() => moveCurrentLead('qualified')}>Qualified</button><button type="button" className="button secondary" onClick={saveQuote}>Save quote + mark quoted</button><button type="button" className="button secondary" onClick={() => moveCurrentLead('followed-up')}>Followed up</button><button type="button" className="button" onClick={() => moveCurrentLead('won')}>Won</button><button type="button" className="button secondary" onClick={() => moveCurrentLead('lost')}>Lost</button></div>
            <div className="customer-timeline"><h3>Customer timeline</h3>{currentLeadTimeline.map((event) => <div className="timeline-event" key={`${event.title}-${event.date}-${event.detail}`}><span>{event.date.slice(0, 10)}</span><div><strong>{event.title}</strong><p>{event.detail}</p></div></div>)}</div>
          </> : <p>Save a lead or load a customer profile to see the guided workflow from first contact to final answer.</p>}
        </article>
        </div>
        <article className="copy-card pipeline-card">
          <div className="card-title-row"><div><h3>All leads by stage</h3><p className="fine-print">Tap Load to focus one lead, or use Quick move to advance it without opening the full editor.</p></div><span className="pipeline-total">{pipelineStats.active} active</span></div>
          <div className="pipeline-metrics"><span>{pipelineStats.total} total leads</span><span>{pipelineStats.won} won</span><span>{pipelineStats.lost} lost</span><span>{todaysFollowUps.length} due today</span><span>{overdueFollowUps.length} overdue</span></div>
          <div className="stage-filter"><button type="button" className={leadStageFilter === 'all' ? 'active' : ''} onClick={() => setLeadStageFilter('all')}>All</button>{leadStages.map((stage) => <button type="button" key={stage.status} className={leadStageFilter === stage.status ? 'active' : ''} onClick={() => setLeadStageFilter(stage.status)}>{stage.label}</button>)}</div>
          {savedLeads.length ? (
            <div className="all-leads-stack">
              {visibleLeadStages.map((stage) => {
                const stageLeads = stage.leads;
                return <section className="pipeline-column" key={stage.status}>
                  <div className="pipeline-column-head"><strong>{stage.label}</strong><span>{stageLeads.length}</span></div>
                  <p>{stage.helper}</p>
                  <div className="pipeline-leads">
                    {stageLeads.length ? stageLeads.map((lead) => (
                      <div className="lead-row pipeline-lead-card" key={lead.id}>
                        {editingLead?.id === lead.id ? (
                          <div className="edit-stack">
                            <label>Name<input value={editingLead.name} onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })} /></label>
                            <div className="two-col">
                              <label>Phone<input value={editingLead.phone} onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })} /></label>
                              <label>Email<input type="email" value={editingLead.email} onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })} /></label>
                            </div>
                            <label>Address<input value={editingLead.address} onChange={(e) => setEditingLead({ ...editingLead, address: e.target.value })} /></label>
                            <div className="two-col"><label>Source<input value={editingLead.source || ''} onChange={(e) => setEditingLead({ ...editingLead, source: e.target.value })} /></label><label>Follow-up date<input type="date" value={editingLead.followUpDate || ''} onChange={(e) => setEditingLead({ ...editingLead, followUpDate: e.target.value })} /></label></div>
                            <label>Sales / appointment date<input type="date" value={editingLead.appointmentDate || ''} onChange={(e) => setEditingLead({ ...editingLead, appointmentDate: e.target.value })} /></label>
                            <label>Next step<input value={editingLead.nextStep || ''} onChange={(e) => setEditingLead({ ...editingLead, nextStep: e.target.value })} /></label>
                            <label>Status<select value={leadStatus(editingLead)} onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value as LeadStatus })}>{leadStages.map((option) => <option value={option.status} key={option.status}>{option.label}</option>)}</select></label>
                            <label>Notes<textarea rows={2} value={editingLead.notes} onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })} /></label>
                            <div className="row-actions"><button type="button" className="button mini" onClick={saveLeadEdit}>Save changes</button><button type="button" className="button mini secondary-button" onClick={() => setEditingLead(null)}>Cancel</button></div>
                          </div>
                        ) : (
                          <><div><div className="lead-card-topline"><strong>{lead.name}</strong><span>{leadStages.find((item) => item.status === leadStatus(lead))?.label}</span></div><span>{[lead.phone, lead.email, lead.address].filter(Boolean).join(' · ') || 'No contact details yet'}</span>{lead.source ? <small>Source: {lead.source}</small> : null}{lead.nextStep ? <small>Next: {lead.nextStep}</small> : null}<div className="lead-date-row">{lead.followUpDate ? <span>Follow-up {lead.followUpDate}</span> : null}{lead.appointmentDate ? <span>Appt {lead.appointmentDate}</span> : null}</div>{lead.notes ? <small>{lead.notes}</small> : null}</div><div className="lead-card-actions"><select value={leadStatus(lead)} onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)} aria-label={`Pipeline status for ${lead.name}`}>{leadStages.map((option) => <option value={option.status} key={option.status}>{option.label}</option>)}</select><button type="button" className="button mini" onClick={() => loadCustomerProfile(lead)}>Load</button><button type="button" className="button mini secondary-button" onClick={() => setEditingLead(lead)}>Edit</button></div></>
                        )}
                      </div>
                    )) : <div className="pipeline-empty">No leads here yet.</div>}
                  </div>
                </section>;
              })}
            </div>
          ) : <p>Save lead contact details so the pipeline board has customers to track.</p>}
        </article>
      </section> : null}

      {activeTab === 'calendar' ? <section className="portal-panel-grid single">
        <article className="copy-card calendar-card reminder-card">
          <div className="card-title-row"><div><h3>Today’s follow-ups</h3><p className="fine-print">Lead contacts that should happen today.</p></div><span className="pipeline-total">{todaysFollowUps.length} today</span></div>
          {todaysFollowUps.length ? <div className="calendar-list compact-calendar-list">
            {todaysFollowUps.map((item) => <article className="calendar-item urgent" key={`${item.lead.id}-${item.type}-${item.date}-today`}>
              <div><strong>{item.date}</strong><span>{item.type}</span></div>
              <div><b>{item.lead.name}</b><p>{item.detail}</p><small>{[item.lead.phone, item.lead.email].filter(Boolean).join(' · ') || 'No contact details yet'}</small></div>
              <button type="button" className="button mini" onClick={() => loadCustomerProfile(item.lead)}>Work lead</button>
            </article>)}
          </div> : <p>No follow-ups due today.</p>}
        </article>
        <article className="copy-card calendar-card reminder-card">
          <div className="card-title-row"><div><h3>Overdue follow-ups</h3><p className="fine-print">Open leads with follow-up dates before today.</p></div><span className="pipeline-total overdue-total">{overdueFollowUps.length} overdue</span></div>
          {overdueFollowUps.length ? <div className="calendar-list compact-calendar-list">
            {overdueFollowUps.map((item) => <article className="calendar-item overdue" key={`${item.lead.id}-${item.type}-${item.date}-overdue`}>
              <div><strong>{item.date}</strong><span>{item.type}</span></div>
              <div><b>{item.lead.name}</b><p>{item.detail}</p><small>{[item.lead.phone, item.lead.email].filter(Boolean).join(' · ') || 'No contact details yet'}</small></div>
              <button type="button" className="button mini" onClick={() => loadCustomerProfile(item.lead)}>Catch up</button>
            </article>)}
          </div> : <p>No overdue follow-ups. Nice.</p>}
        </article>
        <article className="copy-card calendar-card">
          <div className="card-title-row"><div><h3>My Calendar</h3><p className="fine-print">See upcoming lead follow-ups, sales calls, estimate visits, and decision dates.</p></div><span className="pipeline-total">{upcomingCalendarItems.length} upcoming</span></div>
          {upcomingCalendarItems.length ? <div className="calendar-list">
            {upcomingCalendarItems.map((item) => <article className="calendar-item" key={`${item.lead.id}-${item.type}-${item.date}`}>
              <div><strong>{item.date}</strong><span>{item.type}</span></div>
              <div><b>{item.lead.name}</b><p>{item.detail}</p><small>{[item.lead.phone, item.lead.email, item.lead.address].filter(Boolean).join(' · ') || 'No contact details yet'} · {leadStages.find((stage) => stage.status === item.status)?.label}</small></div>
              <button type="button" className="button mini secondary-button" onClick={() => loadCustomerProfile(item.lead)}>Open lead</button>
            </article>)}
          </div> : <p>No upcoming lead contacts yet. Add follow-up dates or sales/appointment dates on the Lead pipeline tab.</p>}
        </article>
        <article className="copy-card calendar-card">
          <h3>This month at a glance</h3>
          <div className="month-grid">
            {calendarDays.map((day) => <div className={day.items.length ? 'has-items' : ''} key={day.date}>
              <strong>{day.day}</strong>
              {day.items.slice(0, 3).map((item) => <button type="button" key={`${item.lead.id}-${item.type}`} onClick={() => loadCustomerProfile(item.lead)}>{item.type}: {item.lead.name}</button>)}
            </div>)}
          </div>
        </article>
      </section> : null}

      {activeTab === 'sales' ? <section className="portal-panel-grid single sales-tools-grid">
        <article className="copy-card source-roi-card">
          <div className="card-title-row"><div><h3>Lead source ROI</h3><p className="fine-print">See which lead sources produce the most quoted value, won jobs, and revenue.</p></div>{leadSourceRoi.best ? <span className="pipeline-total">Best: {leadSourceRoi.best.source}</span> : null}</div>
          {leadSourceRoi.rows.length ? <div className="source-roi-table">
            <div className="source-roi-head"><span>Source</span><span>Leads</span><span>Won</span><span>Win rate</span><span>Quoted</span><span>Won value</span></div>
            {leadSourceRoi.rows.map((row) => <div className="source-roi-row" key={row.source}>
              <strong>{row.source}</strong><span>{row.total}</span><span>{row.won}</span><span>{row.winRate}%</span><span>{money(row.quotedValue)}</span><span>{money(row.wonValue)}</span>
            </div>)}
          </div> : <p>Add lead sources on the Lead pipeline tab to see which channels are producing value.</p>}
        </article>

        <article className="copy-card">
          <div className="card-title-row"><div><h3>Customer profiles</h3><p className="fine-print">Saved contact details, quote history, and quick-load customer records.</p></div></div>
          {customerProfiles.length ? <div className="profile-grid">
            {customerProfiles.slice(0, 12).map(({ lead, leadQuotes, totalQuoted, lastQuote }) => <article className="social-post-card" key={lead.id}>
              <div className="card-title-row"><strong>{lead.name}</strong><button type="button" className="button mini secondary-button" onClick={() => loadCustomerProfile(lead)}>Load profile</button></div>
              <p>{[lead.phone, lead.email, lead.address].filter(Boolean).join(' · ') || 'No contact details yet'}</p>
              <p className="fine-print">Source: {lead.source || 'Unknown'} · {leadQuotes.length} saved quote{leadQuotes.length === 1 ? '' : 's'} · {money(totalQuoted)} total quoted{lastQuote ? ` · Last: ${lastQuote.jobType}` : ''}</p>
              {lead.notes ? <p className="fine-print">{lead.notes}</p> : null}
              <div className="mini-timeline">{[
                { label: 'Created', date: lead.createdAt },
                lead.followUpDate ? { label: 'Follow-up', date: lead.followUpDate } : null,
                lead.appointmentDate ? { label: 'Appointment', date: lead.appointmentDate } : null,
                lastQuote ? { label: lastQuote.status === 'won' ? 'Won' : lastQuote.status === 'lost' ? 'Lost' : 'Quoted', date: lastQuote.createdAt } : null,
              ].filter(Boolean).map((item) => <span key={`${lead.id}-${item!.label}`}>{item!.label}: {item!.date.slice(0, 10)}</span>)}</div>
            </article>) }
          </div> : <p>Save leads in the pipeline to build reusable customer profiles.</p>}
        </article>

        <article className="copy-card">
          <h3>Service menu presets</h3>
          <div className="preset-save-row"><label>Preset name<input value={presetName} onChange={(e) => setPresetName(e.target.value)} /></label><button type="button" className="button" onClick={saveCurrentServicePreset}>Save current quote settings</button></div>
          <div className="profile-grid">
            {servicePresets.map((preset) => <article className="social-post-card" key={preset.id}>
              <div className="card-title-row"><strong>{preset.name}</strong><button type="button" className="button mini" onClick={() => applyServicePreset(preset)}>Apply</button></div>
              <p>{preset.jobType} · {preset.laborHours} hrs · {money(preset.laborRate)}/hr · {money(preset.materials)} materials · {preset.deposit}% deposit</p>
            </article>)}
          </div>
        </article>

        <article className="copy-card">
          <div className="card-title-row"><div><h3>Message templates by stage</h3><p className="fine-print">Copy the right message for each step from first contact to final answer.</p></div></div>
          <div className="template-grid">
            {stageTemplates.map((template) => <article className="social-post-card template-card" key={template.stage}><div className="card-title-row"><strong>{template.stage}</strong><button type="button" className="button mini secondary-button" onClick={() => copyText(template.text, template.stage)}>Copy</button></div><pre>{template.text}</pre></article>)}
          </div>
        </article>

        <article className="copy-card">
          <h3>Monthly workflow drops</h3>
          <div className="social-post-list">
            {monthlyScripts.map((script) => <article className="social-post-card" key={script.title}><strong>{script.title}</strong><pre>{script.text}</pre></article>)}
          </div>
        </article>

        <article className="copy-card">
          <div className="card-title-row"><h3>AI follow-up coach</h3><button type="button" className="button mini" disabled={Boolean(generatingSection)} onClick={coachFollowUpReply}>{generatingSection === 'Follow-up coach' ? <><span className="spinner" /> Coaching</> : aiEnabled ? 'Coach reply with AI' : 'Draft reply'}</button></div>
          <label>Paste the customer's reply<textarea rows={4} value={customerReply} onChange={(e) => setCustomerReply(e.target.value)} /></label>
          {coachedReply ? <pre>{coachedReply}</pre> : <p className="fine-print">Use this when a customer pushes back, goes quiet, asks about price, or needs a clearer next step.</p>}
        </article>

        <article className="copy-card">
          <h3>Review and reputation prompts</h3>
          <div className="social-post-list">
            <article className="social-post-card"><strong>Review request SMS</strong><pre>{reviewPrompts.sms}</pre></article>
            <article className="social-post-card"><strong>Review request email</strong><pre>{reviewPrompts.email}</pre></article>
          </div>
        </article>

        <article className="copy-card">
          <h3>Win/loss tracking</h3>
          <p className="fine-print">Mark quotes won or lost in Saved history, then set the reason. LeadSprint will summarize what is actually happening.</p>
          {winLossBreakdown.tracked ? <div className="pipeline-metrics">{winLossBreakdown.reasons.map(([reason, count]) => <span key={reason}>{reason}: {count}</span>)}</div> : <p>No won/lost reasons tracked yet.</p>}
        </article>
      </section> : null}

      {activeTab === 'history' ? <section className="portal-panel-grid single">
        <article className="copy-card">
          <h3>Saved quote and opportunity history</h3>
          {savedQuotes.length ? (
            <div className="quote-list">
              {savedQuotes.map((quote) => (
                <div className="quote-row" key={quote.id}>
                  {editingQuote?.id === quote.id ? (
                    <div className="edit-stack quote-edit-stack">
                      <div className="two-col">
                        <label>Customer<input value={editingQuote.customer} onChange={(e) => setEditingQuote({ ...editingQuote, customer: e.target.value })} /></label>
                        <label>Job type<select value={editingQuote.jobType} onChange={(e) => setEditingQuote({ ...editingQuote, jobType: e.target.value })}>{jobTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
                      </div>
                      <div className="two-col">
                        <label>Total<input type="number" min="0" value={Math.round(editingQuote.total)} onChange={(e) => setEditingQuote({ ...editingQuote, total: Number(e.target.value) })} /></label>
                        <label>Deposit due<input type="number" min="0" value={Math.round(editingQuote.depositDue)} onChange={(e) => setEditingQuote({ ...editingQuote, depositDue: Number(e.target.value) })} /></label>
                      </div>
                      <label>Status<select value={editingQuote.status} onChange={(e) => setEditingQuote({ ...editingQuote, status: e.target.value as QuoteStatus, winLossReason: e.target.value === 'open' ? undefined : editingQuote.winLossReason })}><option value="open">Open</option><option value="won">Won</option><option value="lost">Lost</option></select></label>
                      {editingQuote.status !== 'open' ? <label>{editingQuote.status === 'won' ? 'Win reason' : 'Loss reason'}<select value={editingQuote.winLossReason || ''} onChange={(e) => setEditingQuote({ ...editingQuote, winLossReason: e.target.value })}><option value="">Choose a reason</option>{(editingQuote.status === 'won' ? winReasons : lossReasons).map((reason) => <option key={reason}>{reason}</option>)}</select></label> : null}
                      <div className="row-actions"><button type="button" className="button mini" onClick={saveQuoteEdit}>Save changes</button><button type="button" className="button mini secondary-button" onClick={() => setEditingQuote(null)}>Cancel</button></div>
                    </div>
                  ) : (
                    <><div><strong>{quote.customer}</strong><span>{quote.jobType} · {money(quote.total)}</span>{quote.winLossReason ? <small>{quote.status === 'won' ? 'Win' : 'Loss'} reason: {quote.winLossReason}</small> : null}</div><div className="quote-row-actions"><select value={quote.status} onChange={(e) => updateStatus(quote.id, e.target.value as QuoteStatus)} aria-label={`Status for ${quote.customer}`}><option value="open">Open</option><option value="won">Won</option><option value="lost">Lost</option></select>{quote.status !== 'open' ? <select value={quote.winLossReason || ''} onChange={(e) => updateQuoteReason(quote.id, e.target.value)} aria-label={`Reason for ${quote.customer}`}><option value="">Reason</option>{(quote.status === 'won' ? winReasons : lossReasons).map((reason) => <option key={reason}>{reason}</option>)}</select> : null}<button type="button" className="button mini secondary-button" onClick={() => setEditingQuote(quote)}>Edit</button></div></>
                  )}
                </div>
              ))}
            </div>
          ) : <p>Save a quote to start tracking open estimates, won work, and lost opportunities.</p>}
        </article>
      </section> : null}
    </>
  );
}

function Output({ title, text, customized, aiEnabled, generating, disabled, onEnhance }: { title: string; text: string; customized?: boolean; aiEnabled?: boolean; generating?: boolean; disabled?: boolean; onEnhance?: () => void }) {
  return (
    <article className="copy-card">
      <div className="card-title-row"><h3>{title} {customized ? <span className="customized-badge">AI customized</span> : null}</h3>{aiEnabled ? <button className="button mini" type="button" disabled={disabled} onClick={onEnhance}>{generating ? <><span className="spinner" /> Generating</> : customized ? 'Customize again' : 'Customize with AI'}</button> : null}</div>
      <pre>{text}</pre>
    </article>
  );
}
