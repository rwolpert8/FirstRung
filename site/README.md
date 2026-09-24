# FirstRung

A public graduate-program directory for the United States and Canada. Static HTML, CSS and native JavaScript modules; no build step or runtime dependencies.

## Local development

Run `npm start` from this directory, then visit http://127.0.0.1:4173. Run `npm test` for directory rules and dataset validation. Publish `dist/` with a static web host. Sites configuration is in `.openai/hosting.json`.

## Editorial workflow

Records live in `dist/programs.js`. Every record contains its official source URL and the date reviewed. The initial research date is September 24, 2026. Overview-only records use `unknown` status (displayed as “Check availability”); they are not claims of an active vacancy. GE Appliances intake details were available through indexed official Workday postings, but the live pages could not be read, so their status is also unknown. Bell entries are program tracks, not separately confirmed vacancies.

Only include graduate development, rotational, leadership or training programs. Exclude current-student internships, ordinary Level 1 jobs, return-intern-only recruitment and programs requiring experienced hires. Prefer current intake postings with clear direct-application eligibility. Broad program overviews need intake-specific screening before promoting to open. Do not infer degree eligibility, start dates, locations, or current availability from a past cycle.

Before marking a listing `open`, review the live official posting, record the start month, degree eligibility, graduation window and any work authorization requirements, and update `checked`. Degree filtering matches only explicitly recorded eligibility; an empty degree array means unknown, not ineligible.

`deadline` and `closedAt` are full ISO timestamps including timezone. Use the employer's actual end-of-application time. After a deadline, the record becomes closed automatically. If no deadline is known, an editor must review and record `closedAt` when the employer closes applications. Closed entries are hidden by default, discoverable using “Include recently closed” for 14 days, then excluded from every result view. This is view-time archiving, not deletion of source records. If closure date cannot be established for an already-closed discovery, do not add it to the public dataset. RBC's CPA program was excluded for this reason: its overview says closed, and a July 26 deadline has no explicit year.

Undated openings not rechecked within 14 days revert to “Check availability,” avoiding perpetual open claims. This does not mean they are closed. Refreshing source information remains an editorial task: there is no background scraper, scheduled monitoring or admin interface in this version.

## Interface

Search and combined filters, open-first/company/start-date sorting, desktop detail pane, mobile detail view with focus return, accessible native controls, empty state and criteria dialog. No sign-in, tracking, payments or personal data collection. Fonts are loaded from Google Fonts with local fallbacks.
