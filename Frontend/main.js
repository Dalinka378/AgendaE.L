
const backBtn = document.getElementById('btn-inapoi');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    window.history.back();
  });
}
