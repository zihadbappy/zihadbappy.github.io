(() => {
  const links = [...document.querySelectorAll('.outline-shell nav a')];
  const sections = links.map(link => document.querySelector(link.hash));
  let selected = null;
  let scheduled = false;

  function activate(id) {
    links.forEach(link => {
      const active = link.hash === '#' + id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function update() {
    scheduled = false;
    if (selected) return activate(selected);
    let current = sections[0];
    {
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      for (const section of sections) {
        const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
        if (section.getBoundingClientRect().top <= padding + margin + 4) current = section;
      }
    }
    // A shorter footer tail still lets the last section become current.
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3) current = sections[sections.length - 1];
    activate(current.id);
  }

  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }
  // Keep the chosen section active throughout anchor scrolling, including
  // short sections near the bottom which cannot reach the viewport top.
  links.forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    selected = link.hash.slice(1);
    activate(selected);
  }));
  function resumeTracking() { selected = null; schedule(); }
  window.addEventListener('wheel', resumeTracking, {passive: true});
  window.addEventListener('touchstart', resumeTracking, {passive: true});
  window.addEventListener('pointerdown', resumeTracking, {passive: true});
  window.addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) resumeTracking();
  });
  function followHash() {
    selected = sections.some(section => '#' + section.id === location.hash) ? location.hash.slice(1) : null;
    schedule();
  }
  window.addEventListener('hashchange', followHash);
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule);
  followHash();
})();
