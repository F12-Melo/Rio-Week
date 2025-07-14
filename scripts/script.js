let theme = 'dark';

const map = L.map('map', { zoomControl: false }).setView([-22.947, -43.245], 15);
let tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap & CartoDB',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

const locais = [
  { lat: -22.966553, lng: -43.236245, info: "Parque Nacional da Tijuca" },
  { lat: -22.962000, lng: -43.248001, info: "Tijuca National Park" },
  { lat: -22.945917, lng: -43.238345, info: "Morro do Sumaré" },
  { lat: -22.947778, lng: -43.259167, info: "Praça Hans Klussmann" },
  { lat: -22.934500, lng: -43.255000, info: "Praça Xavier de Brito" },
  { lat: -22.9242, lng: -43.2413, info: "SESC - TIJUCA" }
];

const areas = locais.map(ponto => {
  const area = L.circle([ponto.lat, ponto.lng], {
    color: '#00ffff',
    fillColor: '#00ffff',
    fillOpacity: 0.3,
    radius: 100
  }).addTo(map);
  area.info = ponto.info;
  return area;
});

let personagemLatLng = L.latLng(-22.947, -43.245);

const personagemIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const personagem = L.marker(personagemLatLng, {
  icon: personagemIcon
}).addTo(map);

map.setView(personagemLatLng, 15);

function mover(dx, dy) {
  const deslocamento = 0.00015; 
  personagemLatLng = L.latLng(
    personagemLatLng.lat - dy * deslocamento, 
    personagemLatLng.lng + dx * deslocamento
  );
  personagem.setLatLng(personagemLatLng);
  map.setView(personagemLatLng);
  verificarProximidade();
}


function verificarProximidade() {
  areas.forEach(area => {
    const distancia = personagemLatLng.distanceTo(area.getLatLng());
    if (distancia <= area.getRadius()) {
      L.popup()
        .setLatLng(personagemLatLng)
        .setContent(`<b>Você entrou em:</b><br>${area.info}`)
        .openOn(map);
    }
  });
}

const base = document.getElementById('joystick-base');
const knob = document.getElementById('joystick-knob');
let center = { x: 50, y: 50 };
let dragging = false;
let animationFrame;

base.addEventListener('pointerdown', e => {
  dragging = true;
  moveKnob(e);
});

document.addEventListener('pointermove', e => {
  if (!dragging) return;
  moveKnob(e);
});

document.addEventListener('pointerup', () => {
  dragging = false;
  knob.style.left = '30px';
  knob.style.top = '30px';
});

function moveKnob(e) {
  const rect = base.getBoundingClientRect();
  const dx = e.clientX - rect.left - center.x;
  const dy = e.clientY - rect.top - center.y;
  const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 40);
  const angle = Math.atan2(dy, dx);
  const offsetX = Math.cos(angle) * dist;
  const offsetY = Math.sin(angle) * dist;

  knob.style.left = `${30 + offsetX}px`;
  knob.style.top = `${30 + offsetY}px`;

  const normX = offsetX / 40;
  const normY = offsetY / 40;

  cancelAnimationFrame(animationFrame);
  function loop() {
    mover(normX, normY);
    animationFrame = requestAnimationFrame(loop);
  }
  animationFrame = requestAnimationFrame(loop);
}

document.addEventListener('pointerup', () => {
  cancelAnimationFrame(animationFrame);
});

// Alternância de tema
document.getElementById('toggleTheme').addEventListener('click', () => {
  map.removeLayer(tileLayer);
  if (theme === 'dark') {
    tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    theme = 'light';
  } else {
    tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
    theme = 'dark';
  }
});
