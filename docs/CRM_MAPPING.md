# DreamTrawell website → CRM enquiry handoff contract (V11)

## Current state
Website enquiries write to Firestore `websiteEnquiries`. Authenticated staff may mark status, assign an owner, write private follow-up notes, set priority and export a single enquiry in CSV. This does **not** create a native CRM lead.

## Source fields for the bridge
- `reference` unique WEB-reference, `createdAt`, `source` = `dreamtrawell_website`, `crmSyncStatus`
- `packageSlug` (can be `custom-requirement`), `destination`, `arrivalDate`, `nights`, `hotelCategory`, `mealPlan`, `transferType`, `travelPurpose`
- `adults`, `children`, `infants`, `childAges`, `rooms`, `daySelections`, `upgrades`, `notes`, `budget`, `deadline`
- `agencyName`, `contactName`, `email`, `phone`, `assignedTo`, `priority`, `internalNote`

## Proposed CRM integration (not deployed)
An authenticated trusted service validates a signed or securely authorised handoff, looks up the travel agent by approved business identifier, de-duplicates by website `reference`, creates a native CRM enquiry with approved default stage and owner, stores native lead ID in website `crmLeadId`, then marks `crmSyncStatus='linked'`. On error, retry idempotently and report failure. Keep all internal vendor amounts, selected vendor fields, margin and GP inside CRM only.

**Required to complete:** latest CRM code/schema, valid native lead stage mapping, agent association strategy, role/assignment policy and authenticated integration mechanism. A browser-only Firebase Client SDK cannot securely impersonate a privileged identity in a separate Firebase project. Do not expose service credentials or broad cross-project rules.

## Manual workflow now
Admin → Quotation enquiries → choose enquiry → assign priority and staff → Export CRM CSV → import/recreate the native CRM record using its approved workflow → paste **actual confirmed** CRM lead ID → Save operations. This is an explicit manual workflow and must not be presented as automatic sync.
