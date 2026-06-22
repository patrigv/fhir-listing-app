# Salus Vita — FHIR Patient Management App

A web app that implements **HL7 FHIR R4** patient management against a live FHIR server — the same API standard used by Epic and Oracle Health (Cerner).

## Features

- **List patients** — fetches paginated results from the FHIR server and parses the `Bundle` response, extracting each `Patient` resource from the `entry[]` array
- **Search patients** — real-time name filtering with debouncing using the FHIR `?name=` search parameter
- **Register a patient** — creates a new `Patient` resource via `POST /Patient` with client-side validation
- **Edit a patient** — updates an existing resource inline via `PUT /Patient/{id}`

All operations send HTTP requests to a [HAPI FHIR R4 server](https://hapi.fhir.org/baseR4), which returns responses in FHIR JSON format. The app parses those responses to extract resources, pagination links (`link[].relation: next/previous`), and totals.

## Tech stack

Svelte 5 · TypeScript · Axios · Tailwind CSS · Vite

## Getting started

```bash
npm install
npm run dev
```

To point to a different FHIR server (e.g. an Epic sandbox), update `src/api.ts`:

```ts
export const fhirBaseUrl = 'https://your-epic-sandbox-url/api/FHIR/R4'
```

## Resources

- [HL7 FHIR R4 spec](https://hl7.org/fhir/R4/)
- [Epic FHIR API](https://open.epic.com)
- [Oracle Health FHIR R4](https://fhir.cerner.com)