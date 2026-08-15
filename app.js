const events = [{
  id: 'horizon',
  name: 'AI Horizon',
  category: 'AI',
  city: 'Mumbai',
  date: '2026-08-28',
  display: '28 AUG 2026',
  description: 'A close look at the intelligence we are building next — with makers, skeptics and restless minds.',
  prizes: 'Creative grants + mentorship',
  flight: 'NX—101',
  color: '#ff7655'
}, {
  id: 'code',
  name: 'Code War',
  category: 'Coding',
  city: 'Bengaluru',
  date: '2026-08-30',
  display: '30 AUG 2026',
  description: 'Think faster. Build smarter. A high-voltage sprint for competitive makers.',
  prizes: 'Launch support + hardware fund',
  flight: 'NX—202',
  color: '#f2b84b'
}, {
  id: 'cyber',
  name: 'Cyber Strike',
  category: 'Cybersecurity',
  city: 'Delhi',
  date: '2026-09-02',
  display: '02 SEP 2026',
  description: 'Find the hidden seams in every system. Defend the edge.',
  prizes: 'Security lab fellowship',
  flight: 'NX—303',
  color: '#76b7b2'
}, {
  id: 'web',
  name: 'Web After Dark',
  category: 'Web',
  city: 'Pune',
  date: '2026-09-06',
  display: '06 SEP 2026',
  description: 'An evening salon for expressive interfaces and weird internet energy.',
  prizes: 'Featured maker residency',
  flight: 'NX—404',
  color: '#cf8df2'
}, {
  id: 'cloud',
  name: 'Cloud Atlas',
  category: 'Cloud',
  city: 'Hyderabad',
  date: '2026-09-12',
  display: '12 SEP 2026',
  description: 'Move beyond the diagram. Explore resilient infrastructure and thoughtful scale.',
  prizes: 'Cloud credits + mentorship',
  flight: 'NX—505',
  color: '#6da7e8'
}, {
  id: 'motion',
  name: 'Motion / Machine',
  category: 'Robotics',
  city: 'Chennai',
  date: '2026-09-19',
  display: '19 SEP 2026',
  description: 'Where hardware gets a heartbeat. Build, break and rethink movement.',
  prizes: 'Hardware fund',
  flight: 'NX—606',
  color: '#e981a2'
}];
let month = 7,
  year = 2026,
  active = 'All',
  selected = events[0],
  slide = 0;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
} [c]));

function byMonth() {
  return events.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year
  })
}

function renderCalendar() {
  const first = new Date(year, month, 1).getDay(),
    days = new Date(year, month + 1, 0).getDate(),
    name = new Date(year, month).toLocaleString('en', {
      month: 'long'
    }).toUpperCase();
  $('#monthButton').innerHTML = `${name} <small>${year}</small>⌄`;
  let h = '<div class="weekdays">SUN MON TUE WED THU FRI SAT</div><div class="calendar-grid">';
  for (let i = 0; i < first; i++) h += '<div class="day empty"></div>';
  for (let d = 1; d <= days; d++) {
    const found = events.filter(e => {
      const x = new Date(e.date);
      return x.getDate() === d && x.getMonth() === month && x.getFullYear() === year
    });
    h += `<div class="day"><b>${String(d).padStart(2,'0')}</b>${found.map(e=>`<button class="event-tag" style="--tag:${e.color}" data-id="${e.id}">${esc(e.name)}</button>`).join('')}</div>`
  }
  $('#calendar').innerHTML = h + '</div>';
  document.querySelectorAll('.event-tag').forEach(b => b.onclick = () => openEvent(events.find(e => e.id === b.dataset.id)))
}

function renderMonths() {
  let h = '';
  for (let i = 0; i < 12; i++) {
    const d = new Date(year, i);
    h += `<button data-month="${i}">${d.toLocaleString('en',{month:'long'})} <small>${year}</small></button>`
  }
  $('#monthMenu').innerHTML = h;
  document.querySelectorAll('#monthMenu button').forEach(b => b.onclick = () => {
    month = +b.dataset.month;
    $('#monthMenu').classList.remove('open');
    renderCalendar()
  })
}

function renderCategories() {
  const cats = ['All', 'AI', 'Coding', 'Cybersecurity', 'Web', 'Cloud', 'Robotics'];
  $('#categoryBubbles').innerHTML = cats.map(c => `<button class="category-bubble ${c===active?'selected':''}" data-category="${c}">${c}<span>↗</span></button>`).join('');
  document.querySelectorAll('.category-bubble').forEach(b => b.onclick = () => {
    active = b.dataset.category;
    renderCategories();
    renderEvents();
    $('#cityCategory').textContent = active.toUpperCase();
    $('#cityIntro').textContent = active === 'All' ? 'Select a category to begin your flight through the event cities.' : `A city flight through the world of ${active}.`
  })
}

function visible() {
  return events.filter(e => active === 'All' || e.category === active)
}

function renderEvents() {
  const list = visible();
  $('#eventGrid').innerHTML = list.map(e => `<article class="event-overview" style="--event-color:${e.color}" data-id="${e.id}"><div class="event-glow"></div><span>${e.flight} / ${e.city}</span><h3>${esc(e.name)}</h3><p>${esc(e.display)} · ${esc(e.category)}</p><button>Open overview ↗</button></article>`).join('');
  document.querySelectorAll('.event-overview').forEach(c => c.onclick = () => openEvent(events.find(e => e.id === c.dataset.id)));
  renderSearch()
}

function renderSearch() {
  const term = ($('#searchInput')?.value || '').toLowerCase();
  const list = events.filter(e => `${e.name} ${e.category} ${e.city}`.toLowerCase().includes(term));
  $('#searchResults').innerHTML = list.map(e => `<button class="search-result" data-id="${e.id}"><span>${e.display}</span><b>${e.name}</b><small>${e.category} / ${e.city} ↗</small></button>`).join('') || '<p class="empty">No matching flights found.</p>';
  document.querySelectorAll('.search-result').forEach(b => b.onclick = () => openEvent(events.find(e => e.id === b.dataset.id)))
}

function openEvent(e) {
  selected = e;
  slide = 0;
  $('#eventModal').setAttribute('aria-hidden', 'false');
  $('#modalFlight').textContent = e.flight;
  $('#modalName').textContent = e.name;
  renderSlide()
}

function renderSlide() {
  const s = [`<strong>${selected.display}</strong><small>DEPARTURE DATE</small>`, `<strong>${selected.category}</strong><small>FLIGHT CATEGORY / ${selected.city}</small>`, `<p>${selected.description}</p><small>EVENT OVERVIEW</small>`, `<strong>${selected.prizes}</strong><small>PRIZE SIGNAL</small>`][slide];
  $('#modalSlide').innerHTML = s;
  $('#modalKicker').textContent = `${selected.city.toUpperCase()} / DESTINATION`;
  $('#slideDots').innerHTML = [0, 1, 2, 3].map(i => `<i class="${i===slide?'active':''}"></i>`).join('')
}

function storage() {
  return JSON.parse(localStorage.getItem('techairRegistrations') || '[]')
}

function renderRegistered() {
  const list = storage();
  $('#registeredList').innerHTML = list.length ? list.map(r => `<button class="registered-item" data-id="${r.id}"><span>${r.eventName}</span><small>${r.name} · ${r.date} · ${r.id}</small><b>OPEN PASS ↗</b></button>`).join('') : '<p class="empty">No registered events yet. Your next destination is waiting.</p>';
  document.querySelectorAll('.registered-item').forEach(b => b.onclick = () => showPass(storage().find(r => r.id === b.dataset.id)))
}

function showPass(r) {
  if (!r) return;
  $('#passPassenger').textContent = r.name;
  $('#passEvent').textContent = r.eventName;
  $('#passDate').textContent = r.date;
  $('#passCategory').textContent = r.category;
  $('#passFlight').textContent = r.flight;
  $('#passOverlay').setAttribute('aria-hidden', 'false')
}

function init() {
  renderMonths();
  renderCalendar();
  renderCategories();
  renderEvents();
  renderRegistered();
  $('#monthButton').onclick = () => $('#monthMenu').classList.toggle('open');
  $('#searchInput').oninput = renderSearch;
  $('#eventClose').onclick = () => $('#eventModal').setAttribute('aria-hidden', 'true');
  $('#prevSlide').onclick = () => {
    slide = (slide + 3) % 4;
    renderSlide()
  };
  $('#nextSlide').onclick = () => {
    slide = (slide + 1) % 4;
    renderSlide()
  };
  $('#registerButton').onclick = () => {
    $('#eventModal').setAttribute('aria-hidden', 'true');
    $('#paperOverlay').setAttribute('aria-hidden', 'false')
  };
  $('#paperClose').onclick = () => $('#paperOverlay').setAttribute('aria-hidden', 'true');
  $('#openPaper').onclick = () => $('#paperOverlay .registration-paper').classList.add('open');
  $('#passClose').onclick = () => $('#passOverlay').setAttribute('aria-hidden', 'true');
  $('#donePass').onclick = () => $('#passOverlay').setAttribute('aria-hidden', 'true');
  $('#registrationForm').onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target),
      r = {
        id: 'TA-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        name: f.get('name'),
        eventName: selected.name,
        eventId: selected.id,
        date: selected.display,
        category: selected.category,
        flight: selected.flight
      };
    const old = storage();
    old.push(r);
    localStorage.setItem('techairRegistrations', JSON.stringify(old));
    renderRegistered();
    $('#paperOverlay').setAttribute('aria-hidden', 'true');
    e.target.reset();
    showPass(r)
  };
  $('#hostForm').onsubmit = e => {
    e.preventDefault();
    $('#hostMessage').textContent = 'Your journey idea has been submitted. We will be in touch.';
    e.target.reset()
  };
  $('#themeToggle').onclick = () => {
    const d = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = d;
    localStorage.setItem('techairTheme', d)
  };
  if (localStorage.getItem('techairTheme')) document.documentElement.dataset.theme = localStorage.getItem('techairTheme');
  $('#menuToggle').onclick = () => $('#mobileNav').classList.toggle('open');
  document.querySelectorAll('#mobileNav a').forEach(a => a.onclick = () => $('#mobileNav').classList.remove('open'));
  window.addEventListener('scroll', () => {
    $('#scrollProgress').style.width = `${scrollY/(document.documentElement.scrollHeight-innerHeight)*100}%`
  }, {
    passive: true
  })
}
init();
