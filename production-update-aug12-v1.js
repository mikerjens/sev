(() => {
  'use strict';

  const VERSION = '2026-08-12-1253';
  const HEATPUMP_IMAGE_URL = 'https://drive.google.com/file/d/1rPeAqgFpKCQCoFAX8yza0lIWjS5rOnub/view?usp=sharing';

  function cardText(card) {
    return (card?.textContent || '').replace(/\s+/g, ' ');
  }

  function isAug17(card) {
    const text = cardText(card);
    return /17\. AUGUST/i.test(text) && /Skálabúðin/i.test(text) && /1A/i.test(text) && /16A/i.test(text);
  }

  function isAug19House(card) {
    if (card?.dataset.productionPlanAug11 === 'aug19-9abc') return true;
    const text = cardText(card);
    return /19\. AUGUST/i.test(text) && /9A/i.test(text) && /9B/i.test(text) && /9C/i.test(text);
  }

  function setList(box, items) {
    const list = box?.querySelector('ul');
    if (!list) return;
    list.innerHTML = items.map(item => `<li>${item}</li>`).join('');
  }

  function patchAug17(card) {
    if (!isAug17(card)) return false;

    const equipmentBox = [...card.querySelectorAll('.ap3-detail-box')]
      .find(box => /Rekvisitter|styling|udstyr/i.test(box.querySelector('h4')?.textContent || ''));
    if (equipmentBox) {
      let hasHeidiClothing = false;
      equipmentBox.querySelectorAll('li').forEach(li => {
        const text = li.textContent || '';
        if (/1970/i.test(text)) {
          li.remove();
          return;
        }
        if (/Styling og makeup/i.test(text) || /styling.*makeup/i.test(text)) {
          li.textContent = 'Heidi Mortensen har kontakt med skuespillerne omkring tøj.';
          hasHeidiClothing = true;
        }
        if (/Heidi Mortensen.*tøj/i.test(text)) hasHeidiClothing = true;
      });
      const list = equipmentBox.querySelector('ul');
      if (list && !hasHeidiClothing) {
        const li = document.createElement('li');
        li.textContent = 'Heidi Mortensen har kontakt med skuespillerne omkring tøj.';
        list.appendChild(li);
      }
    }

    const missingBox = [...card.querySelectorAll('.ap3-detail-box')]
      .find(box => /Mangler/i.test(box.querySelector('h4')?.textContent || ''));
    missingBox?.querySelectorAll('li').forEach(li => {
      if (/1970/i.test(li.textContent || '')) li.remove();
    });

    card.dataset.productionUpdateAug12 = VERSION;
    return true;
  }

  function ensureHeatpumpImageAction(card) {
    const actions = card.querySelector('.ap3-actions');
    if (!actions || actions.querySelector('[data-heatpump-placement]')) return;
    const link = document.createElement('a');
    link.className = 'ap3-action secondary';
    link.href = HEATPUMP_IMAGE_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.dataset.heatpumpPlacement = VERSION;
    link.textContent = '↗ Se placering af varmepumpe';
    const primary = actions.querySelector('.ap3-action.primary');
    if (primary) primary.insertAdjacentElement('afterend', link);
    else actions.prepend(link);
  }

  function patchAug19House(card) {
    if (!isAug19House(card)) return false;

    const location = card.querySelector('.ap3-location');
    if (location) location.textContent = '📍 Fjalsvegur 28, Vestmanna';

    card.querySelectorAll('.ap3-time').forEach(item => {
      const label = item.querySelector('span')?.textContent || '';
      const value = item.querySelector('b');
      if (!value) return;
      if (/Make-up|skuespillere/i.test(label)) value.textContent = '12:00';
      if (/Crew/i.test(label)) value.textContent = '12:30';
      if (/Optagelse/i.test(label)) value.textContent = '13:30–15:00';
    });

    const boxes = [...card.querySelectorAll('.ap3-detail-box')];
    const equipmentBox = boxes.find(box => /Rekvisitter|styling|udstyr/i.test(box.querySelector('h4')?.textContent || ''));
    const readyBox = boxes.find(box => /På plads/i.test(box.querySelector('h4')?.textContent || ''));
    const missingBox = boxes.find(box => /Mangler/i.test(box.querySelector('h4')?.textContent || ''));

    setList(equipmentBox, [
      'Elbil',
      'Varmepumpe · Demich leverer varmepumpen fredag',
      'Ladestation / ladeboks'
    ]);
    setList(readyBox, [
      'Dato og tider er fastlagt.',
      'Location: Fjalsvegur 28, Vestmanna.',
      'Locationejer: Laila Friis.',
      'Helena Heðinsdóttir Guttesen og Heini Dam Lassen er bekræftet.'
    ]);
    setList(missingBox, [
      'Ladestationen skal sættes sammen.',
      'Heidi Mortensens rolle på styling/props skal endeligt bekræftes.'
    ]);

    const note = card.querySelector('.ap3-note');
    if (note) {
      note.innerHTML = '<b>Sceneinfo:</b> 9A: Heini løber hen til Helena. 9B: elbil og ladeboks. 9C: varmepumpe. Optagelse kl. 13:30–15:00 på Fjalsvegur 28, Vestmanna. Locationejer: Laila Friis · +298 724068 · laila.friis@gmail.com.';
    }

    ensureHeatpumpImageAction(card);
    card.dataset.productionUpdateAug12 = VERSION;
    return true;
  }

  function patchAll() {
    document.querySelectorAll('#panel-schedule .ap3-shoot, #panel-my-schedule .ap3-shoot').forEach(card => {
      patchAug17(card);
      patchAug19House(card);
    });
    document.documentElement.dataset.productionUpdateAug12 = VERSION;
  }

  function installEvents() {
    if (document.documentElement.dataset.productionUpdateAug12Events === VERSION) return;
    document.documentElement.dataset.productionUpdateAug12Events = VERSION;

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('nav.tabs button[data-tab="schedule"], nav.tabs button[data-tab="my-schedule"], [data-open-personal], .brand, [data-home]')) {
        window.setTimeout(patchAll, 80);
      }
    }, true);

    document.addEventListener('change', event => {
      const select = event.target instanceof HTMLSelectElement ? event.target : null;
      if (select && ['ap3-home-person', 'ap3-person-select'].includes(select.id)) window.setTimeout(patchAll, 80);
    }, true);
  }

  function start() {
    installEvents();
    patchAll();
    [500, 1100, 2100, 3600].forEach(delay => window.setTimeout(patchAll, delay));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
