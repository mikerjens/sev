(() => {
  'use strict';
  const VERSION = '2026-08-17-1656';
  const FILMED = [
    {scene:'1A',title:'Lyskontakt og åbningsbillede',location:'Skálabúðin, Tórshavn'},
    {scene:'2A',title:'Drengen læser',location:'Skálabúðin, Tórshavn'},
    {scene:'2B',title:'Nærbillede af bog/foto',location:'Skálabúðin, Tórshavn'},
    {scene:'2C',title:'Arkivfoto / historisk materiale',location:'Postproduktion / arkivmateriale'},
    {scene:'3A',title:'Klaksvík',location:'Klaksvík'},
    {scene:'4A',title:'Børn under gadelyset',location:'Elduvík'},
    {scene:'5A',title:'Remote village night',location:'Funningur'},
    {scene:'6A',title:'Dæmning, turbine, Eiðisvatn og Eiðisverkið',location:'Eiði / Eiðisvatn / Eiðisverkið'},
    {scene:'7A',title:'Vindmøller',location:'Eystnes'},
    {scene:'15A',title:'Måske begynder det med dig',location:'Skálabúðin, Tórshavn'},
    {scene:'16A',title:'Lyset slukkes',location:'Skálabúðin, Tórshavn'}
  ];
  const ids = new Set(FILMED.map(item => item.scene));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c]);

  function addStyles(){
    if(document.getElementById('filmed-scenes-authoritative-styles')) return;
    const s=document.createElement('style'); s.id='filmed-scenes-authoritative-styles'; s.textContent=`#authoritative-filmed-scenes{margin-top:22px;padding:18px;background:rgba(74,222,128,.055);border:1px solid rgba(74,222,128,.28);border-radius:11px}#authoritative-filmed-scenes .afs-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:12px}#authoritative-filmed-scenes .afs-head h3{font-size:19px}#authoritative-filmed-scenes .afs-head p{margin-top:3px;color:var(--text-muted);font-size:11px}#authoritative-filmed-scenes .afs-count{color:#4ade80;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:850}#authoritative-filmed-scenes .afs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:9px}#authoritative-filmed-scenes .afs-card{padding:14px 15px;background:var(--bg-elevated-2);border:1px solid rgba(74,222,128,.24);border-left:4px solid #4ade80;border-radius:8px}.storyboard-scene-card.filmed-authoritative{border-color:#4ade80!important;background:rgba(74,222,128,.11)!important;box-shadow:inset 4px 0 0 #4ade80}.storyboard-authoritative-filmed-tag{display:inline-flex;margin-top:7px;padding:3px 7px;color:#071512;background:#4ade80;border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:900}`; document.head.appendChild(s);
  }
  function card(item){return `<article class="afs-card"><div style="display:flex;justify-content:space-between;gap:8px"><a class="scene-portal-link" href="#storyboard-${item.scene.toLowerCase()}" data-scene-link="${item.scene}" style="color:#4ade80;font-family:'IBM Plex Mono',monospace;font-weight:900;text-decoration:none">SCENE ${item.scene}</a><span style="padding:3px 6px;color:#071512;background:#4ade80;border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:8px;font-weight:900">✓ FILMET</span></div><h4 style="margin-top:8px">${esc(item.title)}</h4><p style="margin-top:3px;color:var(--text-muted);font-size:11px">${esc(item.location)}</p></article>`}
  function install(){
    addStyles();
    const root=document.querySelector('#panel-schedule [data-plan-v3-root]');
    const planList=root?.querySelector('.ap3-plan-list');
    if(root&&planList){let section=root.querySelector('#authoritative-filmed-scenes'); if(!section){section=document.createElement('section');section.id='authoritative-filmed-scenes';planList.insertAdjacentElement('afterend',section)} section.innerHTML=`<div class="afs-head"><div><h3>Filmede scener</h3><p>Disse scener er optaget og skal ikke længere planlægges.</p></div><span class="afs-count">${FILMED.length} SCENER FILMET</span></div><div class="afs-grid">${FILMED.map(card).join('')}</div>`}
    document.querySelectorAll('.storyboard-scene-card[data-storyboard-scene]').forEach(card=>{const id=card.dataset.storyboardScene;card.classList.toggle('filmed-authoritative',ids.has(id));card.querySelectorAll('.storyboard-authoritative-filmed-tag').forEach(tag=>tag.remove());if(ids.has(id)){const tag=document.createElement('span');tag.className='storyboard-authoritative-filmed-tag';tag.textContent='✓ FILMET';card.appendChild(tag)}});
  }
  function start(){install();window.setTimeout(install,500)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
