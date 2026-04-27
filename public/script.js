const panier = {};

function ajouter(id) {
  panier[id] = (panier[id] || 0) + 1;
  afficher();
}

function afficher() {
  const ul = document.getElementById('panier');
  ul.innerHTML = '';
  Object.entries(panier).forEach(([id, qte]) => {
    const li = document.createElement('li');
    li.textContent = `${id} x ${qte}`;
    ul.appendChild(li);
  });
}

async function payer() {
  const items = Object.entries(panier).map(([id, quantity]) => ({ id, quantity }));

  const res = await fetch('/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ panier: items })
  });

  const data = await res.json();
  window.location.href = data.url;
}