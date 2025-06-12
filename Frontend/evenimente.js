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
document.addEventListener('DOMContentLoaded', () => {
    const sliderImages = document.querySelector('.slider-images');
    const images = document.querySelectorAll('.slider-images img');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    let currentIndex = 0; 
    const totalImages = images.length; 
    function updateSlider() {
        sliderImages.style.transform = `translateX(${-currentIndex * 100}%)`;
    }
    nextBtn.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= totalImages) {
            currentIndex = 0; 
        }
        updateSlider();
    });
    prevBtn.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = totalImages - 1; 
        }
        updateSlider();
    });
    updateSlider();
});
document.addEventListener('DOMContentLoaded', () => {
    // ... alte variabile ...
    const navLogoutBtn = document.getElementById('nav-logout-btn');
    // ...

    // Logica pentru butonul de deconectare
    if (navLogoutBtn) { // Această verificare este crucială
        navLogoutBtn.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser'); // Elimină utilizatorul din localStorage
            alert('Ai fost deconectat!');
            // Redirecționează către pagina principală sau de login
            window.location.href = 'index.html'; // Sau 'login.html'
            updateNavVisibility(); // Actualizează navigarea imediat
        });
    }
});