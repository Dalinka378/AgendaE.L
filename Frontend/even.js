document.addEventListener('DOMContentLoaded', function() {
            // Calea către fișierul evenimente.html
            const evenimenteUrl = 'evenimente.html';
            const containerIndex = document.getElementById('evenimente-container');

            fetch(evenimenteUrl)
                .then(response => response.text())
                .then(html => {
                    // Creăm un div temporar pentru a parsa HTML-ul
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    // Selectăm containerul cu evenimente din fișierul evenimente.html
                    const listaEvenimente = doc.getElementById('lista-evenimente');

                    if (listaEvenimente) {
                        // Extragem toate evenimentele din lista-evenimente
                        const evenimente = Array.from(listaEvenimente.querySelectorAll('.eveniment'));

                        // Sortăm evenimentele dacă ai folosi data-order, altfel se preiau în ordinea din HTML
                        // evenimente.sort((a, b) => {
                        //     const orderA = parseInt(a.dataset.order);
                        //     const orderB = parseInt(b.dataset.order);
                        //     return orderA - orderB;
                        // });

                        // Inserăm evenimentele în containerul din index.html
                        evenimente.forEach(eveniment => {
                            // Clonăm elementul pentru a evita mutarea directă din DOM-ul parsării
                            const evenimentClonat = eveniment.cloneNode(true);
                            // Poți schimba clasa pentru stilizare specifică pe index.html
                            evenimentClonat.classList.remove('eveniment');
                            evenimentClonat.classList.add('eveniment-afisat');
                            containerIndex.appendChild(evenimentClonat);
                        });
                    } else {
                        console.error('Containerul cu ID-ul "lista-evenimente" nu a fost găsit în evenimente.html');
                    }
                })
                .catch(error => {
                    console.error('Eroare la încărcarea evenimentelor:', error);
                });
        });