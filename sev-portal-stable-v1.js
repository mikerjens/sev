(() => {
  'use strict';

  const VERSION = '2026-08-05-1815';
  const STORAGE_KEY = 'sev-task-person';
  const TAB_STORAGE_KEY = 'sev-active-portal-tab';

  const people = [
    { id: 'michael', name: 'Michael Koba', role: 'Producer' },
    { id: 'thomas', name: 'Thomas Koba', role: 'Instruktør og filmmaker' },
    { id: 'elisabeth', name: 'Elisabeth Vitalis Tausen', role: 'Rådgiver · SANSIR' },
    { id: 'tor', name: 'Tór Verland Johansen', role: 'Direktør · SANSIR' },
    { id: 'bogi', name: 'Bogi Henriksen', role: 'Kreativ direktør · SANSIR' }
  ];

  const bureau = ['elisabeth', 'tor', 'bogi'];

  const tasks = [
    {
      date: '2026-08-03', displayDate: '3. august', time: 'I gang',
      title: 'Hold den samlede produktionsplan opdateret',
      assignees: ['michael'], status: 'I gang', priority: 'Høj', type: 'Produktion',
      detail: 'Saml casting, locations, tilladelser, rekvisitter, call sheets, filmede scener og næste optagelser i én entydig plan.',
      done: 'Portalen og masterplanen viser samme aktuelle status uden modstridende datoer.'
    },
    {
      date: '2026-08-05', displayDate: '5. august', time: 'Kl. 21:30',
      title: 'Film scene 5A i Funningur',
      assignees: ['michael', 'thomas'], status: 'Planlagt', priority: 'Høj', type: 'Optagelse',
      detail: 'Optag det natlige dronebillede af den lille bygd i Funningur. Kontrollér vejr, sigt, lys, lokal adgang og droneforhold før afgang.',
      done: 'Scene 5A er filmet, sikkerhedskopieret og markeret som optaget i planen.'
    },
    {
      date: '2026-08-05', displayDate: 'Senest 5. august', time: 'Inden dagens slutning',
      title: 'Indstil castingkandidater til alle roller',
      assignees: bureau, status: 'I gang', priority: 'Høj', type: 'Casting',
      detail: 'Find kandidater til dreng, mor, mand ved tørresnoren og børnene til scene 4A. Saml billeder, alder, kontaktoplysninger og tilgængelighed.',
      done: 'Der ligger mindst én brugbar kandidat til hver rolle, klar til fælles godkendelse.'
    },
    {
      date: '2026-08-05', displayDate: 'Senest 5. august', time: 'Inden dagens slutning',
      title: 'Tilføj egne castingkandidater',
      assignees: ['michael'], status: 'I gang', priority: 'Normal', type: 'Casting',
      detail: 'Tilføj eventuelle egne kandidater med de samme oplysninger som bureauets kandidater.',
      done: 'Alle relevante kandidater kan vurderes på samme grundlag.'
    },
    {
      date: '2026-08-06', displayDate: 'Så hurtigt som muligt', time: 'Før Elduvík-datoen fastsættes',
      title: 'Spørg Airbnb-ejeren i Elduvík om filmtilladelse',
      assignees: ['michael'], status: 'Ikke startet', priority: 'Høj', type: 'Location',
      detail: 'Kontakt ejeren og afklar tilladelse til optagelse inde og ved huset, adgang, mulige tidspunkter, parkering, strøm, udstyr og eventuelle vilkår.',
      done: 'Ejeren har godkendt optagelsen, og de praktiske vilkår er dokumenteret.'
    },
    {
      date: '2026-08-06', displayDate: 'Så hurtigt som muligt', time: 'Før Elduvík-optagelsen',
      title: 'Book stylist og makeupartist til Elduvík-scenerne',
      assignees: bureau, status: 'Ikke startet', priority: 'Høj', type: 'Styling',
      detail: 'SANSIR-teamet og Elisabeth koordinerer stylist og makeupartist til et troværdigt 1970’er-look for dreng og mor. Drengens hår må ikke klippes før optagelsen.',
      done: 'Stylist og makeupartist er bekræftet, 1970’er-tøjet er valgt, og hår- og makeupplanen er godkendt.'
    },
    {
      date: '2026-08-06', displayDate: '6.–8. august', time: 'Løbende',
      title: 'Dokumentér og afklar resterende locations',
      assignees: ['michael', 'thomas'], status: 'I gang', priority: 'Høj', type: 'Locations',
      detail: 'Afklar locations til hus med elbil og varmepumpe, tørresnor, vandløb, solpaneler og scene 14A. Dokumentér adgang, parkering, strøm, lys, lyd og plan B.',
      done: 'Hver location har billeder eller video, en praktisk vurdering og et klart næste skridt.'
    },
    {
      date: '2026-08-07', displayDate: 'Senest 7. august', time: 'Efter forslagene er klar',
      title: 'Godkend de endelige locations',
      assignees: bureau, status: 'Ikke startet', priority: 'Høj', type: 'Godkendelse',
      detail: 'Gennemgå locationforslagene og godkend den kreative retning eller skriv præcist, hvad der skal ændres.',
      done: 'Hver location er godkendt eller har én tydelig rettelse og en ansvarlig.'
    },
    {
      date: '2026-08-07', displayDate: 'Senest 7. august', time: 'Efter castingforslag',
      title: 'Godkend den endelige casting',
      assignees: [...bureau, 'thomas'], status: 'Ikke startet', priority: 'Høj', type: 'Godkendelse',
      detail: 'SANSIR, Thomas Koba og SEV gennemgår og godkender de valgte skuespillere.',
      done: 'Dreng, mor, mand og børn er valgt og godkendt.'
    },
    {
      date: '2026-08-08', displayDate: 'Senest 8. august', time: 'Før scene 4A',
      title: 'Find børn og forældrekontakter til scene 4A',
      assignees: ['elisabeth'], status: 'Ikke startet', priority: 'Høj', type: 'Casting',
      detail: 'Find navnene på de tre børn samt navnene på deres forældre. Registrér telefonnummer og e-mailadresse til hver familie.',
      done: 'Der foreligger en komplet kontaktliste, så tilladelser og koordinering kan gennemføres før optagelsen.'
    },
    {
      date: '2026-08-08', displayDate: 'Senest 8. august', time: 'Før optagelse med børn',
      title: 'Få kontrakter og forældretilladelser på plads',
      assignees: bureau, status: 'Ikke startet', priority: 'Høj', type: 'Casting',
      detail: 'Indhent aftaler, releases og forældretilladelser til børnene før optagelsen.',
      done: 'Alle medvirkende kan lovligt og praktisk møde til optagelse.'
    },
    {
      date: '2026-08-08', displayDate: 'Senest 8. august', time: 'Før de relevante optagelser',
      title: 'Vælg og klargør tøj, makeup og rekvisitter',
      assignees: bureau, status: 'I gang', priority: 'Høj', type: 'Art department',
      detail: 'Klargør tøj, makeup og rekvisitter pr. scene. Elduvík-scenerne kræver et 1970’er-look, og drengens hår må ikke klippes.',
      done: 'Alt er valgt, godkendt, mærket og fordelt pr. scene med kontinuitetsnoter.'
    },
    {
      date: '2026-08-08', displayDate: 'Senest 8. august', time: 'Inden efterarbejdet planlægges',
      title: 'Find og rettighedsafklar historisk stillbillede',
      assignees: ['michael'], status: 'Ikke startet', priority: 'Normal', type: 'Rettigheder',
      detail: 'Find billedet til scene 2B/2C og afklar brug samt mulighed for senere animation.',
      done: 'Billedfil, kilde og skriftlig rettighedsafklaring er samlet.'
    },
    {
      date: '2026-08-09', displayDate: 'Senest 9. august', time: 'Før scene 4A',
      title: 'Udsend call sheet til scene 4A',
      assignees: ['michael'], status: 'Ikke startet', priority: 'Høj', type: 'Produktion',
      detail: 'Call sheet skal indeholde mødetid, location, børn og forældre, crew, transport, tøj, rekvisitter, sikkerhed og plan B.',
      done: 'Alle relevante personer har modtaget én opdateret og entydig version.'
    },
    {
      date: '2026-08-10', displayDate: '10. august', time: 'Kl. 21:30',
      title: 'Film scene 4A under gadelyset',
      assignees: ['michael', 'thomas', 'elisabeth'], status: 'Planlagt', priority: 'Høj', type: 'Optagelse',
      detail: 'Film tre børn, der leger med bold under et gadelys. Thomas fastlægger bygd og præcis location.',
      done: 'Scene 4A er filmet, og alle medvirkende samt tilladelser er dokumenteret.'
    },
    {
      date: '2026-08-12', displayDate: 'Medio august', time: 'Når boreholdet er tilbage på Streymoy',
      title: 'Koordinér aktiv jordvarmeboring med Jarðhiti',
      assignees: ['michael'], status: 'Afventer', priority: 'Høj', type: 'Tilladelse',
      detail: 'Afvent at Ørvur Heinesen og boreholdet kommer tilbage fra Suðuroy. Bekræft dato, borested, adgang, grundejer og sikkerhedsregler.',
      done: 'Scene 11A har en bekræftet optagedato og kan gennemføres sikkert.'
    },
    {
      date: '2026-08-20', displayDate: 'Før hver optagedag', time: 'Sidste kontrol',
      title: 'Gennemfør produktionskontrol',
      assignees: people.map(person => person.id), status: 'Løbende', priority: 'Høj', type: 'Fælles',
      detail: 'Gennemgå casting, locations, tilladelser, tøj, makeup, rekvisitter, udstyr, transport, call sheet og plan B.',
      done: 'Alle har set deres ansvar, og næste optagedag kan gennemføres uden åbne kritiske punkter.'
    }
  ];

  const milestones = [
    { date: '2026-08-05', label: '5. august', title: 'Næste optagelse · scene 5A', text: 'Natligt dronebillede i Funningur kl. 21:30.' },
    { date: '2026-08-10', label: '10. august', title: 'Scene 4A · børn under gadelyset', text: 'Optagelse kl. 21:30. Præcis bygd og location fastlægges af Thomas.' },
    { date: '2026-08-11', label: 'Dato afventer', title: 'Elduvík · Airbnb-location', text: 'Scener 1A, 2A, 2B, 2C, 15A og 16A afventer ejerens tilladelse.' },
    { date: '2026-08-12', label: 'Medio august', title: 'Scene 11A · Jarðhiti', text: 'Filmes, når boreholdet er tilbage på Streymoy.' },
    { date: '2026-08-20', label: '20. august', title: 'Mål for hovedoptagelser', text: 'De planlagte hovedoptagelser bør være gennemført.' },
    { date: '2026-08-21', label: '21.–22. august', title: 'Reservedage', text: 'Pickups, genoptagelser og vejrafhængige mangler.' },
    { date: '2026-08-23', label: '23. august', title: 'Absolut sidste reserve', text: 'Bruges kun til nødvendige resterende optagelser.' }
  ];

  const filmedScenes = new Map([
    ['3A', 'Filmet i Klaksvík 4. august 2026'],
    ['6A', 'Filmet 4. august 2026'],
    ['7A', 'Filmet 3. august 2026'],
    ['8A', 'Filmet 5. august 2026']
  ]);

  const sceneGroups = [
    {
      location: 'Airbnb i Elduvík · samme location',
      status: 'Afventer ejerens tilladelse · 1970’er styling',
      scenes: [
        ['1A', 'Drengen tænder lyset.'],
        ['2A', 'Drengen sidder og læser.'],
        ['2B', 'Nærbillede af bogen og det historiske foto.'],
        ['2C', 'Den historiske del og fiskerbillederne.'],
        ['15A', '“Måske begynder det med dig.”'],
        ['16A', 'Drengen slukker lyset.']
      ],
      comment: 'Michael spørger Airbnb-ejeren, om det er muligt at filme i huset. Optagedatoen fastsættes først, når ejeren har godkendt det.',
      warning: 'Dreng og mor skal fremstå som i 1970’erne. SANSIR-teamet og Elisabeth koordinerer stylist og makeupartist. Drengens hår må ikke klippes før optagelsen – instruks fra Thomas Koba.'
    },
    {
      location: 'Gadelys-location',
      status: 'Planlagt · 10. august kl. 21:30',
      scenes: [['4A', 'Tre børn leger med bold under gadelyset.']],
      comment: 'Thomas fastlægger bygd og præcis location. Elisabeth samler børnenes og forældrenes navne, telefonnumre og e-mailadresser.'
    },
    {
      location: 'Lille bygd om natten · Funningur',
      status: 'Planlagt · 5. august kl. 21:30',
      scenes: [['5A', 'Natligt dronebillede af en lille bygd.']],
      comment: 'Filmes i Funningur. Vejr, sigt, lys og droneforhold kontrolleres før optagelsen.'
    },
    {
      location: 'Hus med elbil, ladeboks og varmepumpe · samme location',
      status: 'Location scouting',
      scenes: [
        ['9A', 'Drengen kommer løbende hen til sin mor.'],
        ['9B', 'Moren viser eller taler om elbilen.'],
        ['9C', 'Moren viser varmepumpen og peger op i luften.']
      ],
      comment: 'Thomas scouter efter location.'
    },
    {
      location: 'Historisk tørresnor',
      status: 'Location scouting',
      scenes: [['10A', 'En mand hænger tøj til tørre.']],
      comment: 'Thomas scouter efter location.'
    },
    {
      location: 'Jarðhiti',
      status: 'Afventer borehold',
      scenes: [['11A', 'Aktiv jordvarmeboring med Ørvur Heinesen og boreholdet.']],
      comment: 'Filmes, når boreholdet kommer tilbage til Streymoy fra Suðuroy.'
    },
    {
      location: 'Vandløb',
      status: 'Location scouting',
      scenes: [['12A', 'Dreng og mor ved et vandløb.']],
      comment: 'Thomas scouter efter location.'
    },
    {
      location: 'Solenergi · samme location',
      status: 'Location scouting',
      scenes: [
        ['13A', 'Hus og solpaneler.'],
        ['13B', 'Drengen bliver blændet af solen.']
      ],
      comment: 'Thomas scouter efter location.'
    },
    {
      location: 'Dreng blæser udenfor',
      status: 'Kreativ og praktisk afklaring',
      scenes: [['14A', 'Drengen blæser på en legetøjsvindmølle eller pollen fra en blomst.']]
    }
  ];

  const datedShoots = [
    { date: '2026-08-05', time: '21:30', scenes: ['5A'], title: 'Lille bygd om natten', location: 'Funningur' },
    { date: '2026-08-10', time: '21:30', scenes: ['4A'], title: 'Børn under gadelyset', location: 'Bygd og præcis location afventer Thomas' }
  ];

  const pendingShoots = [
    {
      period: 'Dato afventer', badge: 'EJERTILLADELSE AFVENTER',
      scenes: ['1A', '2A', '2B', '2C', '15A', '16A'],
      title: 'Airbnb i Elduvík',
      location: 'Michael kontakter ejeren. 1970’er-tøj, stylist og makeup skal koordineres.'
    },
    {
      period: 'Medio august', badge: 'DATO AFVENTER',
      scenes: ['11A'], title: 'Aktiv jordvarmeboring',
      location: 'Streymoy · afventer Jarðhitis borehold'
    }
  ];

  const teamGroups = [
    {
      title: 'Filmhold og produktion',
      description: 'Ansvarlige for produktion, instruktion og optagelser.',
      members: [
        { name: 'Michael Koba', type: 'Filmproducer', organisation: 'KOVBOY FILM / FIXER.FO', email: 'michael@kovboyfilm.com', phone: '+298 591011', status: 'Bekræftet' },
        { name: 'Thomas Koba', type: 'Instruktør og filmmaker', organisation: 'KOVBOY FILM', email: 'thomas@kovboyfilm.com', phone: '+298 239100', status: 'Bekræftet' }
      ]
    },
    {
      title: 'Bureau og kreativt team',
      description: 'SANSIRs ansvarlige for kreativ retning, koordinering og godkendelser.',
      members: [
        { name: 'Elisabeth Vitalis Tausen', type: 'Rådgiver', organisation: 'SANSIR', email: 'elisabeth@sansir.fo', phone: '+298 299365', status: 'Bekræftet' },
        { name: 'Tór Verland Johansen', type: 'Direktør', organisation: 'SANSIR', email: 'torverland@sansir.fo', phone: '+298 299372', status: 'Bekræftet' },
        { name: 'Bogi Henriksen', type: 'Kreativ direktør', organisation: 'SANSIR', email: 'bogi@sansir.fo', phone: '+298 299361', status: 'Bekræftet' }
      ]
    },
    {
      title: 'Faglige bidragsydere',
      description: 'Fagpersoner og virksomheder, som bidrager med adgang eller medvirken.',
      members: [
        { name: 'Ørvur Heinesen', type: 'Bidragsyder · jordvarmeboring', organisation: 'Jarðhiti', phone: '+298 288433', status: 'I proces', note: 'Scene 11A filmes, når boreholdet er tilbage på Streymoy.' }
      ]
    },
    {
      title: 'Talenter og skuespillere',
      description: 'Roller foran kameraet. Navne tilføjes, når castingen er godkendt.',
      members: [
        { name: 'Dreng · hovedrolle', type: 'Talent / skuespiller', status: 'Casting i gang', note: 'Elduvík-scenerne kræver 1970’er-look. Håret må ikke klippes før optagelsen.' },
        { name: 'Mor', type: 'Skuespiller', status: 'Casting i gang', note: 'Medvirker blandt andet i Elduvík-scenerne og skal have 1970’er-look.' },
        { name: 'Mand ved tørresnoren', type: 'Skuespiller', status: 'Casting i gang', note: 'Historisk rolle i scene 10A.' }
      ]
    },
    {
      title: 'Statister og øvrige medvirkende',
      description: 'Børn, borehold og andre medvirkende i de enkelte scener.',
      members: [
        { name: 'Barn 1, Barn 2 og Barn 3', type: 'Børnetalenter', status: 'Casting i gang', note: 'Scene 4A. Forældrekontakter og tilladelser skal være på plads.' },
        { name: 'Jarðhiti borehold', type: 'Faglige medvirkende', organisation: 'Jarðhiti', status: 'I proces', note: 'Forventet medvirken i scene 11A medio august.' }
      ]
    }
  ];

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[character]);
  }

  function personName(id) {
    return people.find(person => person.id === id)?.name || id;
  }

  function localDateKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function formatDate(dateKey) {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Intl.DateTimeFormat('da-DK', { weekday: 'short', day: 'numeric', month: 'short' })
      .format(new Date(year, month - 1, day)).replace('.', '');
  }

  function readSelection() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'all' || people.some(person => person.id === value) ? value : 'all';
    } catch (_) {
      return 'all';
    }
  }

  function saveSelection(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (_) {}
  }

  function installStyles() {
    if (document.getElementById('sev-stable-portal-styles')) return;
    const style = document.createElement('style');
    style.id = 'sev-stable-portal-styles';
    style.textContent = `
      .plan-toolbar{display:grid;grid-template-columns:minmax(230px,330px) 1fr;gap:14px;align-items:end;margin:0 0 20px;padding:16px;background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:9px}
      .plan-toolbar label{display:block;margin-bottom:6px;color:var(--signal);font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
      .plan-toolbar select{width:100%;padding:11px 12px;color:var(--text);background:var(--bg-elevated-2);border:2px solid rgba(246,176,66,.75);border-radius:7px;font-size:14px;font-weight:650;outline:none}
      .plan-toolbar select:focus{box-shadow:0 0 0 4px rgba(246,176,66,.16)}
      .plan-summary{min-height:42px;color:var(--text-muted);font-size:12.5px}.plan-summary strong{display:block;color:var(--text);font-size:15px}.current-person{color:var(--current)}
      #schedule-calendar-layout{display:grid;grid-template-columns:minmax(0,1fr) 310px;gap:18px;align-items:start}
      #schedule-main-column{min-width:0}
      .bureau-note{margin:0 0 16px;padding:12px 14px;color:var(--text);background:rgba(246,176,66,.08);border:1px solid rgba(246,176,66,.26);border-radius:8px;font-size:12.5px}
      .plan-date{margin:24px 0 9px;color:var(--current);font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.05em;text-transform:uppercase}
      .task-card{margin-bottom:10px;padding:16px 18px;background:var(--bg-elevated);border:1px solid var(--border);border-left:3px solid var(--current-dim);border-radius:8px}
      .task-card.high{border-left-color:var(--signal)}
      .task-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.task-title{font-family:'Space Grotesk',sans-serif;font-size:15.5px;font-weight:600}.task-time{margin-top:2px;color:var(--text-muted);font-size:11.5px}
      .task-status{flex-shrink:0;padding:3px 8px;color:var(--current);border:1px solid var(--border-strong);border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase}
      .task-meta{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.task-chip{padding:3px 7px;color:var(--text-muted);background:var(--bg-elevated-2);border-radius:5px;font-size:10.5px}.task-chip.owner{color:var(--text)}
      .task-copy{margin-top:11px;color:var(--text-muted);font-size:13px}.task-copy b,.task-done b{color:var(--text);font-weight:550}.task-done{margin-top:8px;padding-top:8px;color:var(--text-muted);border-top:1px solid var(--border);font-size:12px}
      .milestone{margin-bottom:10px;padding:14px 16px;background:rgba(20,40,50,.65);border:1px solid var(--border);border-radius:8px}.milestone-title{font-weight:600}.milestone-text{margin-top:3px;color:var(--text-muted);font-size:12.5px}
      .empty-plan{padding:20px;color:var(--text-muted);border:1px dashed var(--border-strong);border-radius:8px}
      #producer-scene-status{margin-top:28px;padding:18px;background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:10px}
      .producer-scene-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:15px}.producer-scene-head h3{font-size:18px}.producer-scene-head p{margin-top:4px;color:var(--text-muted);font-size:12px}.producer-scene-updated{color:var(--current);font-family:'IBM Plex Mono',monospace;font-size:9px}
      .producer-location-list{display:grid;gap:10px}.producer-location-card{padding:14px;background:var(--bg-elevated-2);border:1px solid var(--border);border-radius:8px}.producer-location-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.producer-location-title{font-weight:650}.producer-location-status{flex-shrink:0;max-width:230px;padding:3px 7px;color:var(--signal);background:rgba(246,176,66,.08);border:1px solid rgba(246,176,66,.28);border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:8.5px;text-align:center}.producer-scenes{display:grid;gap:6px;margin-top:10px}.producer-scene-line{display:grid;grid-template-columns:44px 1fr;gap:8px;font-size:12.5px}.producer-scene-code{color:var(--current);font-family:'IBM Plex Mono',monospace;font-weight:800}.producer-comment,.producer-warning{margin-top:11px;padding:10px 12px;border-radius:6px;font-size:12px}.producer-comment{background:rgba(77,217,192,.06);border-left:3px solid var(--current)}.producer-warning{background:rgba(246,176,66,.08);border:1px solid rgba(246,176,66,.28);border-left:4px solid var(--signal)}.producer-filmed{margin-top:13px;padding-top:12px;color:var(--text-muted);border-top:1px solid var(--border);font-size:11.5px}.producer-filmed b{color:#4ade80}
      .shoot-calendar-card{padding:16px;background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:11px}.shoot-calendar-card.sticky{position:sticky;top:16px}.shoot-calendar-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}.shoot-calendar-head span{color:var(--current);font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:800;letter-spacing:.08em}.shoot-calendar-head h3{margin-top:3px;font-size:18px}.calendar-live-dot{width:9px;height:9px;margin-top:5px;background:var(--current);border-radius:50%;box-shadow:0 0 0 5px rgba(77,217,192,.12)}
      .mini-cal-weekdays,.mini-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.mini-cal-weekdays{margin-bottom:5px;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:8px;text-align:center}.mini-cal-day{position:relative;display:grid;place-items:center;aspect-ratio:1;color:var(--text-muted);background:var(--bg-elevated-2);border:1px solid transparent;border-radius:6px;font-family:'IBM Plex Mono',monospace;font-size:10px}.mini-cal-day.empty{background:transparent}.mini-cal-day.has-shoot{color:var(--text);border-color:rgba(246,176,66,.42);background:rgba(246,176,66,.09)}.mini-cal-day.is-today{border-color:var(--current);box-shadow:inset 0 0 0 1px var(--current)}.mini-cal-day i{position:absolute;right:4px;bottom:3px;width:4px;height:4px;background:var(--signal);border-radius:50%}
      .next-shoot-list{display:grid;gap:8px;margin-top:15px}.next-shoot-event{padding:11px 12px;background:var(--bg-elevated-2);border:1px solid var(--border);border-left:3px solid var(--signal);border-radius:8px}.next-shoot-event.today{border-color:rgba(77,217,192,.5);border-left-color:var(--current);background:rgba(77,217,192,.05)}.next-shoot-event.pending{border-left-color:var(--text-muted)}.next-shoot-date{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase}.next-shoot-date b{padding:2px 5px;color:var(--current);background:rgba(77,217,192,.09);border-radius:4px;font-size:8px}.next-shoot-time{margin-top:5px;color:var(--signal);font-family:'IBM Plex Mono',monospace;font-size:10px}.next-shoot-scenes{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}.next-shoot-scenes strong{padding:2px 5px;color:var(--current);background:rgba(77,217,192,.08);border:1px solid rgba(77,217,192,.18);border-radius:4px;font-family:'IBM Plex Mono',monospace;font-size:9px}.next-shoot-event h4{margin-top:7px;font-size:12.5px}.next-shoot-event p{margin-top:3px;color:var(--text-muted);font-size:10.5px}.calendar-undated{margin-top:12px;padding:9px 10px;color:var(--text-muted);border:1px dashed var(--border-strong);border-radius:7px;font-size:9.5px}.calendar-undated span{display:block;margin-bottom:4px;font-family:'IBM Plex Mono',monospace;text-transform:uppercase}.calendar-undated b{color:var(--text);font-weight:550}.calendar-filmed{margin-top:9px;color:#4ade80;font-family:'IBM Plex Mono',monospace;font-size:9px}
      .next-scenes-page-grid{display:grid;grid-template-columns:minmax(260px,360px) minmax(0,1fr);gap:18px;align-items:start}.next-scenes-page-events{display:grid;gap:10px}.next-scenes-page-events .next-shoot-event{padding:15px 16px}.next-scenes-page-events .next-shoot-event h4{font-size:15px}.next-scenes-page-events .next-shoot-event p{font-size:12px}.next-scenes-page-note{margin-top:15px;padding:13px 14px;color:var(--text-muted);border:1px dashed var(--border-strong);border-radius:8px;font-size:12px}
      .team-search-row{margin:0 0 22px}.team-search-row input{width:100%;padding:12px 14px;color:var(--text);background:var(--bg-elevated);border:1px solid var(--border-strong);border-radius:8px}.team-group{margin-top:26px}.team-group:first-of-type{margin-top:0}.team-group-head{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:10px;padding-bottom:9px;border-bottom:1px solid var(--border)}.team-group-title{font-size:16px}.team-group-description{margin-top:3px;color:var(--text-muted);font-size:12px}.team-group-count{color:var(--text-muted);font-family:'IBM Plex Mono',monospace;font-size:9px}.team-card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}.team-card{padding:15px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:9px}.team-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.team-card-name{font-weight:650}.team-card-type{margin-top:3px;color:var(--current);font-family:'IBM Plex Mono',monospace;font-size:10px}.team-card-organisation{margin-top:3px;color:var(--text-muted);font-size:11.5px}.team-status{padding:3px 7px;color:var(--signal);background:rgba(246,176,66,.08);border:1px solid rgba(246,176,66,.26);border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:8px;text-align:center}.team-card-note{margin-top:9px;color:var(--text-muted);font-size:11.5px}.team-contact-list{display:grid;gap:5px;margin-top:11px;padding-top:9px;border-top:1px solid var(--border)}.team-contact-list a{width:fit-content;max-width:100%;color:var(--text);font-family:'IBM Plex Mono',monospace;font-size:10px;text-decoration:none;overflow-wrap:anywhere}.team-no-match{padding:18px;color:var(--text-muted);border:1px dashed var(--border-strong);border-radius:8px;text-align:center}
      .storyboard-scene-card.filmed{border-color:#4ade80!important;background:rgba(74,222,128,.12)!important;box-shadow:inset 4px 0 0 #4ade80}.storyboard-scene-card.filmed .storyboard-scene-number{color:#4ade80}.storyboard-chip.filmed{color:#071512!important;background:#4ade80!important;border-color:#4ade80!important;font-weight:800}.storyboard-filmed-tag{display:inline-flex;margin-top:7px;padding:3px 7px;color:#071512;background:#4ade80;border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:800}.storyboard-selected-status{display:inline-flex;margin-top:6px;padding:3px 8px;color:#071512;background:#4ade80;border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:800}
      @media(max-width:980px){#schedule-calendar-layout,.next-scenes-page-grid{grid-template-columns:1fr}.shoot-calendar-card.sticky{position:relative;top:auto}}
      @media(max-width:650px){.plan-toolbar{grid-template-columns:1fr}.task-top,.producer-scene-head,.producer-location-top,.team-group-head,.team-card-top{flex-direction:column;align-items:flex-start}.task-status{align-self:flex-start}.producer-location-status{max-width:none}.team-card-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function renderTaskList(selectedId) {
    const list = document.getElementById('production-plan-list');
    const summary = document.getElementById('plan-summary');
    if (!list || !summary) return;

    const selectedPerson = people.find(person => person.id === selectedId);
    const filteredTasks = selectedId === 'all' ? tasks : tasks.filter(task => task.assignees.includes(selectedId));
    summary.innerHTML = selectedPerson
      ? `<strong><span class="current-person">${esc(selectedPerson.name)}</span> · ${filteredTasks.length} opgaver</strong><span>${esc(selectedPerson.role)} · kun egne opgaver og deadlines.</span>`
      : `<strong>Samlet plan · ${tasks.length} opgaver</strong><span>Alle personer, opgaver og milepæle.</span>`;

    const items = selectedId === 'all'
      ? [...tasks.map(task => ({ kind: 'task', date: task.date, item: task })), ...milestones.map(item => ({ kind: 'milestone', date: item.date, item }))]
      : filteredTasks.map(task => ({ kind: 'task', date: task.date, item: task }));

    items.sort((a, b) => a.date.localeCompare(b.date) || (a.kind === 'milestone' ? -1 : 1));
    let currentDate = '';
    const html = items.map(entry => {
      const label = entry.kind === 'task' ? entry.item.displayDate : entry.item.label;
      let block = '';
      if (entry.date !== currentDate) {
        currentDate = entry.date;
        block += `<div class="plan-date">${esc(label)}</div>`;
      }
      if (entry.kind === 'milestone') {
        return `${block}<div class="milestone"><div class="milestone-title">${esc(entry.item.title)}</div><div class="milestone-text">${esc(entry.item.text)}</div></div>`;
      }
      const task = entry.item;
      const owners = task.assignees.map(personName).join(' · ');
      return `${block}<article class="task-card ${task.priority === 'Høj' ? 'high' : ''}">
        <div class="task-top"><div><div class="task-title">${esc(task.title)}</div><div class="task-time">${esc(task.time)}</div></div><span class="task-status">${esc(task.status)}</span></div>
        <div class="task-meta"><span class="task-chip">${esc(task.type)}</span><span class="task-chip owner">Ansvar: ${esc(owners)}</span></div>
        <div class="task-copy"><b>Opgaven:</b> ${esc(task.detail)}</div>
        <div class="task-done"><b>Færdig når:</b> ${esc(task.done)}</div>
      </article>`;
    }).join('');

    list.innerHTML = html || '<div class="empty-plan">Der er endnu ingen opgaver registreret på dette navn.</div>';
  }

  function producerStatusMarkup() {
    return `<section id="producer-scene-status" data-version="${VERSION}">
      <div class="producer-scene-head"><div><h3>Resterende scener · producentstatus</h3><p>Scenerne er grupperet efter location. A-, B- og C-delene står separat.</p></div><span class="producer-scene-updated">Opdateret 5. august 2026</span></div>
      <div class="producer-location-list">${sceneGroups.map(group => `<article class="producer-location-card">
        <div class="producer-location-top"><div class="producer-location-title">${esc(group.location)}</div><span class="producer-location-status">${esc(group.status)}</span></div>
        <div class="producer-scenes">${group.scenes.map(([code, description]) => `<div class="producer-scene-line"><span class="producer-scene-code">${esc(code)}</span><span>${esc(description)}</span></div>`).join('')}</div>
        ${group.comment ? `<div class="producer-comment"><b>Michael · producer:</b> ${esc(group.comment)}</div>` : ''}
        ${group.warning ? `<div class="producer-warning"><b>Kostume · hår · stylist · makeup:</b> ${esc(group.warning)}</div>` : ''}
      </article>`).join('')}</div>
      <div class="producer-filmed"><b>Filmet:</b> 3A · Klaksvík om natten, 6A · vandkraft, 7A · vindmøller og 8A · ø-landskab.</div>
    </section>`;
  }

  function monthGridMarkup() {
    const year = 2026;
    const monthIndex = 7;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstMondayIndex = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    const eventDates = new Set(datedShoots.map(event => event.date));
    const today = localDateKey();
    const cells = [];
    for (let index = 0; index < 42; index += 1) {
      const day = index - firstMondayIndex + 1;
      if (day < 1 || day > daysInMonth) {
        cells.push('<span class="mini-cal-day empty" aria-hidden="true"></span>');
        continue;
      }
      const dateKey = `${year}-08-${String(day).padStart(2, '0')}`;
      const event = datedShoots.find(item => item.date === dateKey);
      const classes = ['mini-cal-day'];
      if (eventDates.has(dateKey)) classes.push('has-shoot');
      if (dateKey === today) classes.push('is-today');
      const label = event ? `${day}. august. Scene ${event.scenes.join(', ')}. ${event.title}.` : `${day}. august`;
      cells.push(`<span class="${classes.join(' ')}" aria-label="${esc(label)}"><b>${day}</b>${event ? '<i></i>' : ''}</span>`);
    }
    return cells.join('');
  }

  function eventMarkup(event) {
    const isToday = event.date === localDateKey();
    return `<article class="next-shoot-event${isToday ? ' today' : ''}">
      <div class="next-shoot-date"><span>${esc(formatDate(event.date))}</span>${isToday ? '<b>I DAG</b>' : ''}</div>
      <div class="next-shoot-time">● ${esc(event.time)}</div>
      <div class="next-shoot-scenes">${event.scenes.map(scene => `<strong>${esc(scene)}</strong>`).join('')}</div>
      <h4>${esc(event.title)}</h4><p>${esc(event.location)}</p>
    </article>`;
  }

  function pendingMarkup(event) {
    return `<article class="next-shoot-event pending">
      <div class="next-shoot-date"><span>${esc(event.period)}</span><b>${esc(event.badge)}</b></div>
      <div class="next-shoot-scenes">${event.scenes.map(scene => `<strong>${esc(scene)}</strong>`).join('')}</div>
      <h4>${esc(event.title)}</h4><p>${esc(event.location)}</p>
    </article>`;
  }

  function calendarMarkup(sticky = false) {
    return `<aside class="shoot-calendar-card${sticky ? ' sticky' : ''}" aria-label="Kalender for næste optagelser">
      <div class="shoot-calendar-head"><div><span>NÆSTE OPTAGELSER</span><h3>August 2026</h3></div><div class="calendar-live-dot" title="Aktuel produktionsplan"></div></div>
      <div class="mini-cal-weekdays" aria-hidden="true"><span>M</span><span>T</span><span>O</span><span>T</span><span>F</span><span>L</span><span>S</span></div>
      <div class="mini-cal-grid">${monthGridMarkup()}</div>
      <div class="next-shoot-list">${datedShoots.map(eventMarkup).join('')}${pendingShoots.map(pendingMarkup).join('')}</div>
      <div class="calendar-undated"><span>Dato mangler</span><b>9A–9C · 10A · 12A · 13A–13B · 14A</b></div>
      <div class="calendar-filmed">✓ Filmet: 3A · 6A · 7A · 8A</div>
    </aside>`;
  }

  function buildSchedulePanel() {
    const panel = document.getElementById('panel-schedule');
    if (!panel) return;
    const selected = readSelection();
    const options = ['<option value="all">Alle · samlet plan</option>', ...people.map(person => `<option value="${person.id}">${esc(person.name)} · ${esc(person.role)}</option>`)].join('');
    panel.innerHTML = `<div class="section-head"><h2>Produktionsplan og personlige opgaver</h2><p>Vælg dit navn. Så vises kun dine egne opgaver, deadlines og næste skridt.</p></div>
      <div class="plan-toolbar" id="person-task-selector"><div><label for="task-person-filter">Vælg dit navn – se dit skema</label><select id="task-person-filter">${options}</select></div><div class="plan-summary" id="plan-summary"></div></div>
      <div id="schedule-calendar-layout"><div id="schedule-main-column"><div class="bureau-note"><b>Fælles bureauansvar:</b> Opgaver, der er tildelt SANSIR-teamet, vises hos Elisabeth, Tór og Bogi.</div><div id="production-plan-list"></div>${producerStatusMarkup()}</div>${calendarMarkup(true)}</div>`;
    const select = panel.querySelector('#task-person-filter');
    select.value = selected;
    select.addEventListener('change', event => {
      const value = event.target.value;
      saveSelection(value);
      renderTaskList(value);
    });
    renderTaskList(selected);
  }

  function ensureNextScenesTab() {
    const nav = document.querySelector('nav.tabs');
    const main = document.querySelector('main');
    if (!nav || !main) return;
    let button = nav.querySelector('button[data-tab="next-scenes"]');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.dataset.tab = 'next-scenes';
      const storyboardButton = nav.querySelector('button[data-tab="storyboard"]');
      nav.insertBefore(button, storyboardButton || nav.querySelector('button[data-tab="weather"]') || null);
    }
    button.textContent = 'Næste optagelser';
    button.setAttribute('aria-label', 'Næste optagelser og optagekalender');
    button.onclick = () => window.openPortalTab?.('next-scenes');

    let panel = document.getElementById('panel-next-scenes');
    if (!panel) {
      panel = document.createElement('section');
      panel.className = 'panel';
      panel.id = 'panel-next-scenes';
      const anchor = document.getElementById('panel-storyboard') || document.getElementById('panel-weather');
      main.insertBefore(panel, anchor || null);
    }
    panel.innerHTML = `<div class="section-head"><h2>Næste optagelser</h2><p>Samlet oversigt over låste optagedatoer, scener der afventer en dato, og scener der allerede er filmet.</p></div>
      <div class="next-scenes-page-grid">${calendarMarkup(false)}<div><div class="next-scenes-page-events">${datedShoots.map(eventMarkup).join('')}${pendingShoots.map(pendingMarkup).join('')}</div><div class="next-scenes-page-note"><b>Scener uden dato:</b> 9A–9C, 10A, 12A, 13A–13B og 14A. Datoerne fastsættes, når locations, casting og godkendelser er på plads.</div></div></div>`;
  }

  function teamContactMarkup(member) {
    const links = [];
    if (member.email) links.push(`<a href="mailto:${esc(member.email)}">✉ ${esc(member.email)}</a>`);
    if (member.phone) links.push(`<a href="tel:${member.phone.replace(/\s+/g, '')}">☎ ${esc(member.phone)}</a>`);
    return links.length ? `<div class="team-contact-list">${links.join('')}</div>` : '';
  }

  function renderTeam(filter = '') {
    const container = document.getElementById('team-groups');
    if (!container) return;
    const query = filter.trim().toLocaleLowerCase('da-DK');
    const html = teamGroups.map(group => {
      const members = group.members.filter(member => [group.title, member.name, member.type, member.organisation, member.status, member.note].filter(Boolean).join(' ').toLocaleLowerCase('da-DK').includes(query));
      if (!members.length) return '';
      return `<section class="team-group"><div class="team-group-head"><div><h3 class="team-group-title">${esc(group.title)}</h3><p class="team-group-description">${esc(group.description)}</p></div><span class="team-group-count">${members.length} ${members.length === 1 ? 'person' : 'personer'}</span></div>
        <div class="team-card-grid">${members.map(member => `<article class="team-card"><div class="team-card-top"><div><div class="team-card-name">${esc(member.name)}</div><div class="team-card-type">${esc(member.type)}</div>${member.organisation ? `<div class="team-card-organisation">${esc(member.organisation)}</div>` : ''}</div>${member.status ? `<span class="team-status">${esc(member.status)}</span>` : ''}</div>${member.note ? `<p class="team-card-note">${esc(member.note)}</p>` : ''}${teamContactMarkup(member)}</article>`).join('')}</div></section>`;
    }).join('');
    container.innerHTML = html || '<div class="team-no-match">Ingen personer matcher søgningen.</div>';
  }

  function buildTeamPanel() {
    document.querySelector('nav.tabs button[data-tab="contacts"]')?.remove();
    document.getElementById('panel-contacts')?.remove();
    const tab = document.querySelector('nav.tabs button[data-tab="crew"]');
    if (tab) tab.textContent = 'TEAM';
    const panel = document.getElementById('panel-crew');
    if (!panel) return;
    panel.innerHTML = `<div class="section-head"><h2>TEAM</h2><p>Kontakter og medvirkende på produktionen, opdelt efter funktion.</p></div><div class="team-search-row"><input id="team-search" type="search" placeholder="Søg efter navn, rolle eller virksomhed…" aria-label="Søg i TEAM"></div><div id="team-groups"></div>`;
    panel.querySelector('#team-search').addEventListener('input', event => renderTeam(event.target.value));
    renderTeam();
  }

  function updateSelectedStoryboardStatus() {
    const active = document.querySelector('.storyboard-scene-card.active[data-storyboard-scene]');
    const selected = document.querySelector('.storyboard-selected-scene');
    const title = document.getElementById('storyboard-selected-title');
    if (!active || !selected) return;
    const sceneId = active.dataset.storyboardScene;
    const label = filmedScenes.get(sceneId);
    selected.querySelector('.storyboard-selected-status')?.remove();
    if (!label) return;
    if (title && !title.textContent.includes('FILMET')) title.textContent += ' · FILMET';
    const status = document.createElement('span');
    status.className = 'storyboard-selected-status';
    status.textContent = `✓ ${label.toUpperCase()}`;
    selected.appendChild(status);
  }

  function updateStoryboard() {
    filmedScenes.forEach((label, sceneId) => {
      document.querySelectorAll(`[data-storyboard-scene="${sceneId}"]`).forEach(element => {
        element.classList.add('filmed');
        element.setAttribute('aria-label', `Scene ${sceneId}. ${label}.`);
        if (element.classList.contains('storyboard-chip')) element.textContent = `✓ ${sceneId} · FILMET`;
        if (element.classList.contains('storyboard-scene-card')) {
          let tag = element.querySelector('.storyboard-filmed-tag');
          if (!tag) {
            tag = document.createElement('span');
            tag.className = 'storyboard-filmed-tag';
            element.appendChild(tag);
          }
          tag.textContent = `✓ FILMET · ${label.replace('Filmet ', '')}`;
        }
      });
    });
    const quickCopy = document.querySelector('.storyboard-quick-copy span');
    if (quickCopy) quickCopy.textContent = 'Filmet: 3A, 6A, 7A og 8A · Resterende droneoptagelse: 5A';
    updateSelectedStoryboardStatus();
    document.addEventListener('click', event => {
      if (event.target.closest('[data-storyboard-scene]')) window.setTimeout(updateSelectedStoryboardStatus, 0);
    }, { capture: true, once: false });
  }

  function translateStaticInterface() {
    const heroSub = document.querySelector('.hero-sub');
    if (heroSub) heroSub.textContent = 'Filmproduktion for Elfelagið SEV · SANSIR · KOVBOY FILM / FIXER.FO.';
    const scheduleTab = document.querySelector('nav.tabs button[data-tab="schedule"]');
    if (scheduleTab) scheduleTab.textContent = 'Plan & opgaver';
    const weatherTab = document.querySelector('nav.tabs button[data-tab="weather"]');
    if (weatherTab) weatherTab.textContent = 'Vejr';
    const storyboardTab = document.querySelector('nav.tabs button[data-tab="storyboard"]');
    if (storyboardTab) storyboardTab.textContent = 'Storyboard';
    const shortcutTitle = document.querySelector('.shortcut-title strong');
    if (shortcutTitle) shortcutTitle.textContent = '7-dages optagevejr';
    const shortcutLink = document.getElementById('open-weather-details');
    if (shortcutLink) shortcutLink.textContent = 'Se detaljer';
    const countdownLabel = document.querySelector('.status-banner [role="timer"] span');
    if (countdownLabel) countdownLabel.textContent = 'SIDSTE OPTAGEDAG · 23. AUGUST 2026';
  }

  function installTabMemory() {
    const nav = document.querySelector('nav.tabs');
    if (!nav || nav.dataset.stableTabMemory === VERSION) return;
    nav.dataset.stableTabMemory = VERSION;
    nav.addEventListener('click', event => {
      const button = event.target.closest('button[data-tab]');
      if (!button) return;
      try { sessionStorage.setItem(TAB_STORAGE_KEY, button.dataset.tab); } catch (_) {}
    });
    let saved = '';
    try { saved = sessionStorage.getItem(TAB_STORAGE_KEY) || ''; } catch (_) {}
    if (saved && document.getElementById(`panel-${saved}`)) window.openPortalTab?.(saved);
  }

  function revealPortal() {
    document.documentElement.classList.remove('sev-booting');
    document.documentElement.classList.add('sev-ready');
    document.documentElement.dataset.portalReady = VERSION;
  }

  function install() {
    try {
      installStyles();
      translateStaticInterface();
      buildSchedulePanel();
      ensureNextScenesTab();
      buildTeamPanel();
      updateStoryboard();
      installTabMemory();
      revealPortal();
      document.dispatchEvent(new CustomEvent('sev:portal-ready', { detail: { version: VERSION } }));
    } catch (error) {
      console.error('SEV portal stable init failed', error);
      revealPortal();
    }
  }

  let observer = null;
  let installed = false;
  let readyTimer = null;

  function baseIsReady() {
    const selector = document.getElementById('task-person-filter');
    const storyboard = document.getElementById('panel-storyboard');
    return Boolean(selector && storyboard && storyboard.dataset.exactPageNavigation === 'scene-files');
  }

  function scheduleInstall(delay = 360) {
    if (installed || readyTimer) return;
    readyTimer = window.setTimeout(() => {
      readyTimer = null;
      if (installed) return;
      installed = true;
      observer?.disconnect();
      install();
    }, delay);
  }

  function checkReady() {
    if (baseIsReady()) scheduleInstall();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkReady, { once: true });
  } else {
    checkReady();
  }

  observer = new MutationObserver(checkReady);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-exact-page-navigation'] });
  window.setTimeout(() => scheduleInstall(0), 4500);
})();