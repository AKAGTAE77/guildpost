(function () {
  const root = document.getElementById('page-root');

  // Show who is signed in (right side of topbar)
  const tb = document.querySelector('.topbar');
  const me = GP.currentUser ? GP.currentUser() : null;
  if (tb) {
    const who = document.createElement('div');
    who.className = 'muted';
    who.textContent = me ? `${me.name} (${me.role})` : 'Guest';
    tb.appendChild(who);
  }

  // Settings card
  const card = document.createElement('div');
  card.className = 'card';

  const h = document.createElement('h3');
  h.textContent = 'Profile';
  card.appendChild(h);

  // Name
  const nameWrap = document.createElement('div');
  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Name';
  const nameI = document.createElement('input');
  nameI.value = me ? (me.name || '') : '';
  nameI.placeholder = 'Your name';
  nameWrap.appendChild(nameLabel);
  nameWrap.appendChild(nameI);

  // Class
  const classWrap = document.createElement('div');
  const classLabel = document.createElement('label');
  classLabel.textContent = 'Class';
  const classS = document.createElement('select');
  classS.innerHTML = `
    <option value="">—</option>
    <option>Scout</option>
    <option>Tank</option>
    <option>General</option>
    <option>Mage</option>
    <option>Merchant</option>
    <option>Mercenary</option>`;
  classS.value = me ? (me.class || '') : '';
  classWrap.appendChild(classLabel);
  classWrap.appendChild(classS);

  // Row
  const row = document.createElement('div');
  row.className = 'row';
  row.appendChild(nameWrap);
  row.appendChild(classWrap);
  card.appendChild(row);

  // Save / Logout
  const actions = document.createElement('div');
  const saveB = document.createElement('button');
  saveB.textContent = 'Save Profile';
  saveB.onclick = () => {
    if (!me) { alert('Please login first.'); return; }
    const store = GP.authLoad ? GP.authLoad() : null;
    if (!store) { alert('Auth store missing.'); return; }
    const u = store.users.find(u => u.id === me.id);
    if (!u) { alert('User not found.'); return; }
    u.name = nameI.value.trim();
    u.class = classS.value;
    GP.authSave(store);
    alert('Saved!');
    // update topbar label
    if (tb && tb.lastElementChild && tb.lastElementChild.classList.contains('muted')) {
      tb.lastElementChild.textContent = `${u.name} (${u.role})`;
    }
  };

  const logoutB = document.createElement('button');
  logoutB.className = 'ghost';
  logoutB.textContent = 'Logout';
  logoutB.onclick = () => GP.logout ? GP.logout() : (location.href = 'login.html');

  actions.appendChild(saveB);
  actions.appendChild(document.createTextNode(' '));
  actions.appendChild(logoutB);
  card.appendChild(actions);

  // Guest hint
  if (!me) {
    const note = document.createElement('div');
    note.className = 'alert';
    note.textContent = 'You are viewing as Guest. Login or Sign up to edit your profile.';
    root.appendChild(note);
  }

  root.appendChild(card);

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
