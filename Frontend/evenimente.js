// Verificăm dacă utilizatorul este logat
const user = JSON.parse(localStorage.getItem('loggedInUser'));
if (!user) {
  window.location.href = 'login.html';
}

const eventsUl = document.getElementById('events-ul');
const eventForm = document.getElementById('event-form');

function afiseazaEvenimente() {
  const events = JSON.parse(localStorage.getItem('events')) || [];

  eventsUl.innerHTML = '';

  if (events.length === 0) {
    eventsUl.innerHTML = '<li>Nu există evenimente momentan.</li>';
    return;
  }

  events.forEach(event => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${event.title}</strong> - ${event.date} <br/>
                    <em>Creat de: ${event.createdBy}</em><br/>
                    <p>${event.description}</p>`;
    eventsUl.appendChild(li);
  });
}

afiseazaEvenimente();

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

  eventForm.reset();

  afiseazaEvenimente();
});
