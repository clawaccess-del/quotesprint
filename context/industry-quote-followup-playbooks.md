# QuoteSprint industry quote and follow-up playbooks

Implementation-ready notes for local service quote customization. These are meant to feed industry-specific prompt/playbook data, form helper text, objection copy, prep notes, and follow-up timing logic.

## Product implementation notes

- Treat each industry as a playbook with these fields: `customerConcerns`, `quoteInputs`, `trustProof`, `urgencyRisk`, `prepNotes`, `objections`, `followUpTiming`.
- Use quote inputs as conditional form prompts, not mandatory fields all at once. Ask for photos first whenever visual condition affects price.
- Follow-up timing should vary by urgency:
  - Emergency or safety/leak/access issue: immediate SMS/call, same-day second touch, next-morning check-in, 48-hour close-out.
  - Standard repair: instant estimate/booking message, next-day follow-up, day-3 value/risk reminder, day-7 final check.
  - Project work: instant acknowledgement, 24-hour scope clarification, 3-day decision support, 7 to 14-day seasonal/scheduling reminder.
  - Recurring maintenance: instant acknowledgement, 24 to 48-hour reminder, weekly until first visit, then convert to cadence/plan messaging.
- Trust language should be specific and verifiable: license/insurance where relevant, photo documentation, written scope, cleanup, arrival window, warranty/guarantee, code compliance, material/brand clarity.
- Avoid pressure tactics. Frame urgency around real risks, scheduling, weather, access, damage prevention, or lost preparation time.

## HVAC

- **Customer concerns:** no heat/AC, cost shock, whether repair or replacement is needed, energy bills, technician honesty, same-day availability.
- **Quote inputs:** system type, age, thermostat behavior, current temperature issue, airflow, noises, error codes, filter age, outdoor/indoor unit access, photos, prior repair history.
- **Trust/proof:** licensed/insured, diagnostic-first process, clear repair vs replacement options, upfront authorization before added work, maintenance/warranty explanation.
- **Urgency/risk:** small faults can strain compressors/blowers, comfort can become safety issue during heat/cold waves, peak-weather schedules fill fast.
- **Prep notes:** clear thermostat, air handler/furnace, outdoor condenser, breaker panel; replace/locate filter if known; secure pets.
- **Objections/angles:** “Too expensive” -> separate must-fix repair from efficiency/comfort upgrades. “Need another quote” -> offer diagnostic summary and hold appointment window briefly. “Can wait” -> explain peak-demand and system strain risk.
- **Follow-up timing:** emergency no heat/AC gets call/SMS immediately and same-day second touch. Standard repair gets day-1 reminder and day-3 risk/comfort message. Replacement quotes need day-2 financing/options check and day-7 schedule/material reminder.

## Plumbing

- **Customer concerns:** active leaks, hidden water damage, emergency pricing, mess, fixture downtime, whether walls/floors need opening.
- **Quote inputs:** leak active or stopped, fixture/location, shutoff access, water pressure, drain symptoms, photos/video, property type, prior repairs, ceiling/drywall damage.
- **Trust/proof:** clean work, water-shutoff guidance, clear diagnosis before opening surfaces, photo evidence, licensed/insured, warranty on parts/labor.
- **Urgency/risk:** water spreads quickly, drain backups worsen, small leaks can become drywall, mold, flooring, or cabinet damage.
- **Prep notes:** clear under sinks/around fixture, locate main shutoff if possible, stop using affected fixture, place towels/bucket if active leak.
- **Objections/angles:** “Can you just patch it?” -> explain temporary vs durable repair. “Price is high” -> split emergency stop, permanent repair, optional replacement. “I’ll call if worse” -> warn about damage escalation.
- **Follow-up timing:** active leak requires immediate call/SMS and short-window booking. Non-urgent fixture repair day-1 and day-3. Remodel/repiping quote day-2 scope clarification and day-7 decision check.

## Electrical

- **Customer concerns:** safety/fire risk, outage inconvenience, code compliance, hidden panel problems, cost uncertainty.
- **Quote inputs:** breaker trips, flickering, affected rooms, outlet/switch/fixture type, burning smell/sparks, panel age, recent changes, photos, power currently out.
- **Trust/proof:** licensed electrician, code-aware repairs, panel/outlet safety diagnostics, permit guidance, clear authorization before upgrades.
- **Urgency/risk:** repeated trips, burning smell, warm outlets, or flicker can indicate unsafe conditions; outages disrupt home function.
- **Prep notes:** stop using suspect outlet/fixture, avoid resetting repeatedly, clear panel/affected room, note when issue happens.
- **Objections/angles:** “Can handyman do it cheaper?” -> stress licensed safety/code. “Diagnosis fee?” -> explain troubleshooting protects them from guessing. “Upgrade later” -> separate safety-critical fix from nice-to-have upgrades.
- **Follow-up timing:** safety/outage issue immediate call/SMS and same-day check. Standard repair day-1. Panel/upgrade quotes day-2 options/permit note and day-7 scheduling follow-up.

## Painting

- **Customer concerns:** finish quality, prep level, mess, timeline, color confidence, price differences between bids.
- **Quote inputs:** interior/exterior, rooms/square footage, wall condition, ceiling height, trim/doors/cabinets, color change, paint quality, furniture moving, desired date, photos.
- **Trust/proof:** prep checklist, surface protection, clean lines, product clarity, daily cleanup, insured crew, portfolio/reviews.
- **Urgency/risk:** calendars fill around weather, holidays, listing photos, move-ins; exterior windows depend on temperature/rain.
- **Prep notes:** confirm colors/sheens, remove small items/wall decor, note repairs, plan pet/room access, clarify furniture moving.
- **Objections/angles:** “Another painter is cheaper” -> compare prep, coats, paint quality, protection, warranty. “Too much at once” -> phase by room/priority. “Need color help” -> offer sample/consult step.
- **Follow-up timing:** day-1 answer questions/colors, day-3 schedule-window reminder, day-7 “hold dates or release crew” check. Exterior gets weather-window reminders.

## Landscaping

- **Customer concerns:** curb appeal, ongoing maintenance cost, plants surviving, drainage/erosion, crew reliability, property access.
- **Quote inputs:** yard size, photos, cleanup/install/maintenance goal, access/gates, drainage/slope, sun/shade, plant/mulch preferences, irrigation, haul-off, recurring cadence.
- **Trust/proof:** property-specific plan, plant/soil suitability, clean edges/cleanup, recurring schedule reliability, before/after photos.
- **Urgency/risk:** weeds/overgrowth add labor, planting and cleanup depend on weather/growth cycles, drainage issues worsen after storms.
- **Prep notes:** share photos and priorities, unlock gates, mark sprinkler heads/hidden items, clear pet waste/toys, note HOA requirements.
- **Objections/angles:** “Scope is too big” -> split cleanup, priority areas, install, maintenance. “Can wait” -> note growth/weather and schedule. “Plants are expensive” -> offer phased or lower-maintenance options.
- **Follow-up timing:** maintenance lead day-1 and 48-hour cadence offer. Install/cleanup day-2 scope/priorities, day-5 weather/schedule reminder, day-10 final seasonal window touch.

## Cleaning

- **Customer concerns:** price vs deep-clean level, trust inside home, pets, missed areas, supplies, arrival reliability, recurring value.
- **Quote inputs:** square footage, bedrooms/bathrooms, cleaning type, last cleaned, pets, clutter level, priority rooms, access/parking, supplies, recurring vs one-time, photos if heavy/deep clean.
- **Trust/proof:** checklist by room, insured/background-aware staff if true, satisfaction policy, arrival window, recurring consistency, reviews.
- **Urgency/risk:** slots fill before holidays, move-outs, inspections, listings, events; deeper buildup increases first-visit time.
- **Prep notes:** pick up personal items/clutter if not included, secure pets, share entry/parking, list priority areas and delicate surfaces.
- **Objections/angles:** “Too much” -> prioritize kitchens/baths/floors or convert to recurring after first deep clean. “Can I provide supplies?” -> clarify supply policy. “Trust concern” -> explain checklist, staff, access process.
- **Follow-up timing:** one-time/event clean gets same-day/day-1 urgency and 48-hour slot hold. Recurring gets day-2 plan comparison and day-7 first-visit reminder.

## Roofing

- **Customer concerns:** leaks, storm damage, insurance, replacement vs repair, price, workmanship warranty, weather exposure.
- **Quote inputs:** roof age, leak location, storm date, shingle/material type, photos of roof/interior stains, attic access, slope/stories, insurance claim status, HOA needs.
- **Trust/proof:** licensed/insured, photo-documented inspection, repair-first guidance when valid, warranty, material brands, cleanup/nail sweep, insurance familiarity without overpromising.
- **Urgency/risk:** next rain/wind can worsen leaks and interior damage; temporary fixes may not hold; storm-season schedules fill.
- **Prep notes:** share leak/stain photos, clear driveway/access, provide insurance/HOA details, protect attic access area if inspection needed.
- **Objections/angles:** “Need insurance first” -> offer documentation/photos and scope. “Can patch it?” -> separate temporary mitigation, permanent repair, replacement. “Big price” -> explain materials, warranty, ventilation, disposal.
- **Follow-up timing:** active leak/storm damage immediate call/SMS, same-day inspection push. Replacement quote day-2 material/warranty comparison, day-5 weather-risk reminder, day-10 financing/insurance check.

## Garage door

- **Customer concerns:** trapped car, home security, spring safety, opener reliability, same-day repair, replacement upsell fear.
- **Quote inputs:** door stuck/open/closed, car trapped, spring broken, opener runs, track/roller condition, remote/keypad issue, door size/material, photos/video, manual release status.
- **Trust/proof:** repair-first diagnostics, spring/opener expertise, stocked common parts, safety testing, clear warranty.
- **Urgency/risk:** stuck doors affect access/security; forcing door can damage tracks/opener or create injury risk.
- **Prep notes:** do not force door, clear area/vehicles if possible, unlock side access, share opener brand/model if visible.
- **Objections/angles:** “Just replace spring cheap” -> explain cycle rating, balance, safety test. “Need new opener?” -> separate function repair from quieter/smart opener upgrade. “Can wait” -> security/access risk.
- **Follow-up timing:** trapped car/open door immediate call/SMS and same-day booking. Standard opener/noise issue day-1 and day-3. Door replacement quote day-3 and day-7.

## Tree service

- **Customer concerns:** property damage, limb hazards, cleanup, cost, permits, power lines, whether tree can be saved.
- **Quote inputs:** photos from multiple angles, tree size/species if known, proximity to structures/lines/fences, storm damage, access/equipment room, haul-off, stump grinding, permits/HOA.
- **Trust/proof:** insured crews, safety-first plan, property protection, cleanup clarity, arborist/health guidance when applicable, utility coordination boundaries.
- **Urgency/risk:** cracked/hanging limbs and storm-damaged trees can fall; weather and access affect safe scheduling.
- **Prep notes:** mark target trees, clear vehicles/outdoor items, note septic/irrigation/underground utilities, keep people/pets away from hazardous limbs.
- **Objections/angles:** “Too expensive” -> split hazard removal, pruning, haul-off, stump. “Can save it?” -> offer assessment/pruning vs removal. “Another quote” -> stress insurance/safety/cleanup differences.
- **Follow-up timing:** hazardous limb/storm damage immediate. Routine pruning/removal day-2 scope check, day-5 schedule/access reminder, day-10 final slot touch.

## Pool service

- **Customer concerns:** green/cloudy water, equipment cost, swim readiness, recurring maintenance value, chemical safety, leaks.
- **Quote inputs:** pool size/type, water condition/photos, pump/filter behavior, filter type, last service, algae level, chemical readings if known, leak signs, heater/salt/chlorinator issues, desired swim date.
- **Trust/proof:** water diagnostics, equipment check, clear recovery plan, recurring maintenance checklist, chemical balance guidance.
- **Urgency/risk:** algae and chemistry issues compound, equipment can strain, swim deadlines can be missed.
- **Prep notes:** keep pump running if safe, clear equipment pad, share gate/access, do not add random chemicals before visit unless instructed.
- **Objections/angles:** “Can I just shock it?” -> explain diagnosis and filtration matter. “Recurring cost” -> compare prevention vs recovery visits. “Equipment sticker shock” -> separate repair, replacement, maintenance.
- **Follow-up timing:** green pool/equipment down day-0/day-1. Recurring maintenance day-2 plan/cadence. Swim deadline gets tighter same-day and 48-hour reminders.

## Pressure washing

- **Customer concerns:** surface damage, plants/paint/siding safety, streaks, water access, weather, price by area.
- **Quote inputs:** surfaces, approximate square footage, photos, stains/algae/rust/oil, height/stories, water access, delicate plants/paint, driveway/fence/deck/siding/roof, desired date.
- **Trust/proof:** surface-safe method, soft-wash vs pressure explanation, plant protection, before/after photos, insured work.
- **Urgency/risk:** algae/mildew and stains worsen, curb-appeal deadlines (listing, party, inspection) depend on weather windows.
- **Prep notes:** move vehicles/furniture, close windows, unlock gates, note fragile plants/outlets, confirm water spigot access.
- **Objections/angles:** “Can rent machine cheaper” -> explain surface risk/time/results. “Not whole house” -> prioritize driveway/front entry/high-visibility areas. “Weather?” -> explain reschedule/weather policy.
- **Follow-up timing:** event/listing lead day-0 and 24-hour slot hold. Standard quote day-2 photo/scope check, day-5 weather-window reminder, day-10 curb appeal touch.

## Junk removal

- **Customer concerns:** price uncertainty, heavy item handling, disposal/donation, access/stairs, fast pickup, mess/damage.
- **Quote inputs:** photos, item list/volume, heavy items, stairs/elevator, parking/truck access, hazardous/restricted materials, donation/recycling preference, pickup window, cleanout deadline.
- **Trust/proof:** transparent volume pricing, careful removal, donation/recycling where possible, insured crew, same/next-day windows.
- **Urgency/risk:** delays block moves, renovations, listings, estate cleanouts, storage turnover, or weekend projects.
- **Prep notes:** group/label items if possible, clear pathway, reserve parking/elevator, separate keep/donate/remove, disclose heavy/hazardous items.
- **Objections/angles:** “Price changed on arrival” -> explain volume/access variables and photo estimate. “Too much” -> prioritize must-go items. “Can donate?” -> clarify what can be donated vs disposed.
- **Follow-up timing:** move/renovation deadline immediate and same-day second touch. Standard pickup day-1. Larger cleanout day-2 planning and day-5 deadline reminder.

## Flooring

- **Customer concerns:** material choice, total cost, disruption, subfloor surprises, timeline, furniture moving, durability.
- **Quote inputs:** rooms/square footage, current flooring, desired material, subfloor concerns, stairs/transitions, removal/disposal, furniture moving, pets/kids, moisture areas, desired finish date.
- **Trust/proof:** accurate measurements, prep/subfloor clarity, material suitability, installation warranty, clean transitions, portfolio.
- **Urgency/risk:** material availability and installer calendar affect deadlines for move-ins, rentals, listings, holidays.
- **Prep notes:** choose/shortlist materials, clear small items, discuss furniture/appliance moving, note squeaks/moisture/uneven floors.
- **Objections/angles:** “Material is expensive” -> compare good/better/best options. “Can install over existing?” -> explain substrate/prep risk. “Timeline” -> separate measurement, material order, install window.
- **Follow-up timing:** day-1 material/options answer, day-3 measurement or sample reminder, day-7 installation-window/material availability check, day-14 longer project nurture.

## Remodeling

- **Customer concerns:** scope creep, budget, timeline, disruption, permits, trust, design decisions, living in the home during work.
- **Quote inputs:** room/type, must-haves, rough measurements, photos, budget range, timeline, inspiration/selections, structural/plumbing/electrical changes, permits/HOA, occupancy constraints.
- **Trust/proof:** written scope, phased options, change-order process, permit guidance, schedule communication, references/portfolio, cleanup/protection.
- **Urgency/risk:** decisions, selections, permits, and material lead times drive start dates; unclear scope causes delays and cost surprises.
- **Prep notes:** collect inspiration, define must-have vs nice-to-have, share budget range, note access/parking, identify decision-makers.
- **Objections/angles:** “Over budget” -> phase project, remove optional upgrades, specify allowance choices. “Need to think” -> offer design/scope consult. “Timeline too long” -> explain sequencing and selections.
- **Follow-up timing:** day-1 scope clarification, day-3 budget/phasing note, day-7 decision-maker check, day-14 selections/timeline reminder, monthly nurture for large projects.

## Handyman

- **Customer concerns:** small job availability, hourly uncertainty, parts, workmanship, bundling tasks, whether task requires specialist.
- **Quote inputs:** task list, photos, measurements, part/product links, wall/material type, access, priority order, estimated count of tasks, deadline, safety issues.
- **Trust/proof:** clear task list, realistic time block, practical repair options, before/after photos, cleanup, referral to licensed trade when needed.
- **Urgency/risk:** small repairs stack up, parts/access issues waste appointment time, safety/function issues can worsen.
- **Prep notes:** send photos/measurements, buy/confirm parts if owner-provided, clear work areas, prioritize top tasks.
- **Objections/angles:** “Hourly feels open-ended” -> set time block and priority list. “Can you do electrical/plumbing?” -> clarify licensed boundaries. “Too many tasks” -> rank safety/function/visibility.
- **Follow-up timing:** day-1 task/priorities check, day-3 appointment block reminder, day-7 “bundle before next opening” touch. Safety/function issues get same-day push.

## Pest control

- **Customer concerns:** health/safety, pets/kids, recurring infestations, treatment effectiveness, chemicals, discreet service, speed.
- **Quote inputs:** pest type/photos, activity location/frequency, entry points, indoor/outdoor, pets/children, allergies/sensitivities, previous treatments, property type, recurring prevention interest.
- **Trust/proof:** inspection-first plan, targeted treatment, prevention guidance, safety instructions, follow-up expectations, licensed applicators where applicable.
- **Urgency/risk:** activity can spread, nests/colonies grow, entry points remain open, some pests create health/property risks.
- **Prep notes:** note sightings, avoid disturbing nests, secure food/trash, clear access to activity areas, follow pet/child prep instructions.
- **Objections/angles:** “Can buy spray” -> explain source/entry-point treatment and lifecycle. “Recurring plan?” -> position prevention after initial control. “Chemical concern” -> explain targeted options and safety prep.
- **Follow-up timing:** active infestation day-0/day-1. Initial treatment day-2 expectation-setting (“activity may change”). Day-7 efficacy check. Recurring prevention reminder before next lifecycle/seasonal spike.
