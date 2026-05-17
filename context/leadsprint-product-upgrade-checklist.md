# LeadSprint product upgrade checklist

Work through these one by one until complete. Keep each item scoped, build/test, commit, and push before moving to the next.

## 1. Today's follow-ups + overdue follow-ups ✅
- Added dashboard panel for follow-ups due today.
- Added overdue follow-ups panel.
- Users can open/load the lead from each reminder.
- Calendar tab and Lead pipeline show due/overdue counts.

## 2. Lead source ROI
- Track lead source consistently on every lead.
- Show source totals: total leads, won leads, lost leads, quoted value, won value, win rate.
- Highlight best-performing source.

## 3. Customer timeline
- Add a per-lead timeline built from lead creation, status changes, quote saves, follow-up dates, appointment dates, win/loss events.
- Display timeline in the lead workflow/customer profile area.
- Keep it lightweight using existing lead/quote data first, then expand if needed.

## 4. Message templates by stage
- Add templates for: new lead reply, need photos/details, estimate sent, 24-hour follow-up, final check-in, won job confirmation, lost lead reactivation.
- Make templates use company profile, customer name, job type, service area, and lead stage.
- Add copy buttons if simple.

## 5. Quote-to-job checklist
- Add checklist for won/near-won work: deposit collected, appointment scheduled, prep instructions sent, materials confirmed, review request sent.
- Tie checklist to lead/customer where possible.

## 6. Simple revenue dashboard
- Add dashboard metrics: open quoted value, won revenue, lost quoted value, average quote value, win rate, follow-ups due.
- Keep visible in Sales tools or a new Dashboard section.

## 7. Import/export
- Add CSV export for leads.
- Add CSV export for quotes/history.
- Consider import later only if export is stable.

## 8. Lead scoring
- Add hot/warm/cold scoring using urgency, status, follow-up date, appointment date, notes/source, and quote amount.
- Show score on lead cards and use it to prioritize today’s work.

## 9. Appointment prep notes
- Generate prep notes based on job type, lead notes, address/contact state, photos/details needed, appointment date, and industry playbook.
- Show in calendar item and lead workflow.

## 10. Review/referral loop
- After a lead is won, show review request and referral ask templates.
- Track whether review request was sent if practical.

## Completion rule
After each item:
- run `npm run build`
- commit with a specific message
- push to `main`
- update this checklist if scope changes
