document.addEventListener('DOMContentLoaded', () => {
  const showDriversBtn = document.getElementById('show-drivers');
  const showTeamsBtn = document.getElementById('show-teams');
  const driversSection = document.getElementById('drivers-section');
  const teamsSection = document.getElementById('teams-section');
  const driversTable = driversSection && driversSection.querySelector('table');

  function showDrivers() {
    driversSection.style.display = '';
    teamsSection.style.display = 'none';
  }

  function showTeams() {
    driversSection.style.display = 'none';
    teamsSection.style.display = '';
  }

  if (showDriversBtn) showDriversBtn.addEventListener('click', showDrivers);
  if (showTeamsBtn) showTeamsBtn.addEventListener('click', showTeams);

  // Inline edit handler
  if (driversTable) {
    driversTable.addEventListener('click', async (e) => {
      const target = e.target;
      if (target.matches('.edit-btn')) {
        e.preventDefault();
        const id = target.dataset.id;
        const row = target.closest('tr');
        if (!row || row.classList.contains('editing')) return;
        row.classList.add('editing');

        // collect cells
        const tdNum = row.querySelector('td[data-field="num"]');
        const tdCode = row.querySelector('td[data-field="code"]');
        const tdForename = row.querySelector('td[data-field="forename"]');
        const tdDob = row.querySelector('td[data-field="dob"]');
        const tdNat = row.querySelector('td[data-field="nationality"]');
        const tdTeam = row.querySelector('td[data-field="teamId"]');
        const tdUrl = row.querySelector('td[data-field="url"]');
        const tdActions = row.querySelector('td.actions');

        // store originals
        const orig = {
          num: tdNum ? tdNum.dataset.value : '',
          code: tdCode ? tdCode.dataset.value : '',
          forename: tdForename ? tdForename.dataset.value : '',
          surname: tdForename ? tdForename.dataset.surname : '',
          dob: tdDob ? tdDob.dataset.value : '',
          nationality: tdNat ? tdNat.dataset.value : '',
          teamId: tdTeam ? tdTeam.dataset.value : '',
          url: tdUrl ? tdUrl.dataset.value : ''
        };

        // build inputs
        if (tdNum) tdNum.innerHTML = `<input name="num" type="number" value="${orig.num || ''}" style="width:60px" />`;
        if (tdCode) tdCode.innerHTML = `<input name="code" type="text" value="${orig.code || ''}" style="width:60px" />`;
        if (tdForename) tdForename.innerHTML = `<input name="forename" type="text" value="${orig.forename || ''}" style="width:80px" /> <input name="surname" type="text" value="${orig.surname || ''}" style="width:100px" />`;
        if (tdDob) tdDob.innerHTML = `<input name="dob" type="date" value="${orig.dob || ''}" />`;

        // clone nationality and team options from hidden selects
        const nationOptions = document.getElementById('nation-options');
        const teamOptions = document.getElementById('team-options');
        if (tdNat && nationOptions) tdNat.innerHTML = `<select name="nationality">${nationOptions.innerHTML}</select>`;
        if (tdTeam && teamOptions) tdTeam.innerHTML = `<select name="teamId">${teamOptions.innerHTML}</select>`;
        if (tdUrl) tdUrl.innerHTML = `<input name="url" type="url" value="${orig.url || ''}" style="width:140px" />`;

        // set selected values
        if (tdNat) tdNat.querySelector('select').value = orig.nationality || '';
        if (tdTeam) tdTeam.querySelector('select').value = orig.teamId || '';

        // actions: Save / Cancel
        const saveBtn = document.createElement('a');
        saveBtn.href = '#';
        saveBtn.textContent = 'Save';
        saveBtn.style.marginRight = '8px';

        const cancelBtn = document.createElement('a');
        cancelBtn.href = '#';
        cancelBtn.textContent = 'Cancel';

        // clear existing actions and append
        tdActions.dataset.orig = tdActions.innerHTML;
        tdActions.innerHTML = '';
        tdActions.appendChild(saveBtn);
        tdActions.appendChild(document.createTextNode(' | '));
        tdActions.appendChild(cancelBtn);

        // Save handler
        saveBtn.addEventListener('click', async (ev) => {
          ev.preventDefault();
          const formData = new URLSearchParams();
          formData.append('num', tdNum.querySelector('input').value || '');
          formData.append('code', tdCode.querySelector('input').value || '');
          formData.append('forename', tdForename.querySelector('input[name="forename"]').value || '');
          formData.append('surname', tdForename.querySelector('input[name="surname"]').value || '');
          formData.append('dob', tdDob.querySelector('input').value || '');
          formData.append('nationality', tdNat.querySelector('select').value || '');
          formData.append('teamId', tdTeam.querySelector('select').value || '');
          formData.append('url', tdUrl.querySelector('input').value || '');

          try {
            const resp = await fetch(`/driver/edit/${id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: formData.toString()
            });
            if (resp.ok) {
              location.reload();
            } else {
              alert('Failed to save');
              row.classList.remove('editing');
            }
          } catch (err) {
            console.error(err);
            alert('Error saving');
            row.classList.remove('editing');
          }
        });

        // Cancel handler
        cancelBtn.addEventListener('click', (ev) => {
          ev.preventDefault();
          // restore original values
          if (tdNum) tdNum.innerHTML = orig.num || '';
          if (tdCode) tdCode.innerHTML = orig.code || '';
          if (tdForename) tdForename.innerHTML = `${orig.forename} <span style="font-weight:600;">${orig.surname}</span>`;
          if (tdDob) tdDob.innerHTML = orig.dob || '';
          if (tdNat) tdNat.innerHTML = orig.nationality || '';
          if (tdTeam) tdTeam.innerHTML = teamsDisplayName(orig.teamId);
          if (tdUrl) tdUrl.innerHTML = orig.url ? `<a href="${orig.url}" target="_blank">link</a>` : '';
          tdActions.innerHTML = tdActions.dataset.orig || '';
          row.classList.remove('editing');
        });
      }
    });
  }

  function teamsDisplayName(teamId) {
    const opt = document.getElementById('team-options').querySelector(`option[value="${teamId}"]`);
    return opt ? opt.textContent : 'N/A';
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const driversSection = document.getElementById('drivers-section');
  const teamsSection = document.getElementById('teams-section');
  const toggleDrivers = document.getElementById('show-drivers');
  const toggleTeams = document.getElementById('show-teams');

  function show(section) {
    if (section === 'drivers') {
      driversSection.style.display = '';
      teamsSection.style.display = 'none';
    } else {
      driversSection.style.display = 'none';
      teamsSection.style.display = '';
    }
  }

  toggleDrivers && toggleDrivers.addEventListener('click', (e) => { e.preventDefault(); show('drivers'); });
  toggleTeams && toggleTeams.addEventListener('click', (e) => { e.preventDefault(); show('teams'); });

  // Inline edit handlers
  document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', onEditClick));

  function onEditClick(e) {
    e.preventDefault();
    const id = this.dataset.id;
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;

    // If already editing, do nothing
    if (row.dataset.editing === 'true') return;
    row.dataset.editing = 'true';

    // Replace text with inputs
    const cells = row.querySelectorAll('td.editable');
    const inputs = [];
    cells.forEach(cell => {
      const value = cell.dataset.value || cell.textContent.trim();
      const name = cell.dataset.field;
      let input;
      if (name === 'nationality') {
        input = document.createElement('select');
        // copy options from the global select if present
        const globalSelect = document.getElementById('nation-options');
        if (globalSelect) input.innerHTML = globalSelect.innerHTML;
        input.value = value;
      } else if (name === 'dob') {
        input = document.createElement('input');
        input.type = 'date';
        input.value = value ? value.split('T')[0] : '';
      } else if (name === 'teamId') {
        input = document.createElement('select');
        const teamSelect = document.getElementById('team-options');
        if (teamSelect) input.innerHTML = teamSelect.innerHTML;
        input.value = value;
      } else {
        input = document.createElement('input');
        input.type = 'text';
        input.value = value;
      }
      input.className = 'inline-input';
      inputs.push({ name, input });
      cell.textContent = '';
      cell.appendChild(input);
    });

    // Replace actions with Save / Cancel
    const actionsCell = row.querySelector('td.actions');
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    actionsCell._original = actionsCell.innerHTML;
    actionsCell.innerHTML = '';
    actionsCell.appendChild(saveBtn);
    actionsCell.appendChild(document.createTextNode(' '));
    actionsCell.appendChild(cancelBtn);

    cancelBtn.addEventListener('click', (ev) => { ev.preventDefault(); restoreRow(row); });

    saveBtn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      // build payload
      const payload = {};
      inputs.forEach(({ name, input }) => {
        payload[name] = input.value;
      });

      try {
        const res = await fetch(`/driver/edit/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Save failed');
        // on success, replace inputs with new text
        inputs.forEach(({ name, input }, i) => {
          const cell = cells[i];
          cell.textContent = input.value;
        });
        restoreRow(row, true);
      } catch (err) {
        alert('Failed to save: ' + err.message);
      }
    });
  }

  function restoreRow(row, saved = false) {
    // If saved, update dataset values from inputs
    const cells = row.querySelectorAll('td.editable');
    cells.forEach(cell => {
      const input = cell.querySelector('.inline-input');
      if (input) {
        cell.dataset.value = input.value;
        cell.textContent = input.value;
      }
    });
    const actionsCell = row.querySelector('td.actions');
    if (actionsCell._original) actionsCell.innerHTML = actionsCell._original;
    row.dataset.editing = 'false';
    // rebind edit handlers
    actionsCell.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', onEditClick));
  }
});
