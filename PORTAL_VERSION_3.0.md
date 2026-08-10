# SEV Produktionsportal 3.0

Stable snapshot approved 10 August 2026.

## Active components

- portal-loading-safety-v1.js — dd04919e3c91f5947bbd7e3de7bf2f41535b8c0e
- portal-approved-core-v3.js — 1e78b5b238e0e24b4fc7df5324f23fe138a27fb3
- scene-links-light-v2.js — 4d10dd8e9212eed5a03cdad6592e6a632ef8e2b2
- filmed-scenes-authoritative-v2.js — 3e74ac1de472df822dd06a22fc62798bd2847164
- team-contacts-doc-aug10-v1.js — c99ae7af3cf283b536037b3a4d03bd56d3f53247
- storyboard-single-page-v4.js — cad987d2839425f24d550b2da190599600a6db86
- portal-release-3.0.js — aebdea47448a583dca9aaa474c246ccba856ef97
- netlify/edge-functions/mobile-nav.js — ef8639fea3b93f2ca488c00d926abcfd8d31d39a

## Behaviour to preserve

- Plan & optagelser is HOME/default view.
- Detailed planned shoot cards show dates, meeting times, scenes, participants, equipment, ready items and missing items.
- TEAM shows the complete current contact list, including Rókur Thomsen replacing Nora Vitalis Joensen.
- Legacy production-team-correction.js is disabled at the edge because it previously overwrote TEAM.
- Storyboard preview shows one selected storyboard page only and switches when another scene is selected.
- Filmed scene status currently: 3A, 5A, 6A, 7A.

This file records the exact approved Portal 3.0 component set so it can be restored if later changes introduce regressions.
