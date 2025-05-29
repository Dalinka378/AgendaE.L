// Verificăm dacă utilizatorul este logat
const user = JSON.parse(localStorage.getItem('loggedInUser'));
if (!user) {
  window.location.href = 'login.html';
}

const eventForm = document.getElementById('event-form');

eventForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value.trim();

  if (!title || !date || !description) {
    alert('Completează toate câmpurile!');
    return;
  }

  const events = JSON.parse(localStorage.getItem('events')) || [];

  events.push({
    title,
    date,
    description,
    createdBy: user.username,
  });

  localStorage.setItem('events', JSON.stringify(events));

  alert('Eveniment adăugat cu succes!');

  // După adăugare, ducem utilizatorul înapoi la lista de evenimente
  window.location.href = 'evenimente.html';
});
