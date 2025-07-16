let theme = 'dark';

const map = L.map('map', { zoomControl: false }).setView([-22.947, -43.245], 15);
let tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap & CartoDB',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Dados dos pontos turísticos com imagens
const locais = [
  {
    lat: -22.928159,
    lng: -43.234250,
    nome: "Sesc Tijuca",
    descricao: "Centro cultural e de lazer na Tijuca com atividades esportivas, teatro e biblioteca.",
    imagens: ["https://www.sescrio.org.br/wp-content/uploads/2018/09/A%C3%A9reo.jpg"]
  },
  {
    lat: -22.9122,
    lng: -43.2302,
    nome: "Estádio do Maracanã",
    descricao: "Um dos maiores estádios de futebol do mundo, palco de grandes eventos esportivos e culturais.",
    imagens: ["https://upload.wikimedia.org/wikipedia/commons/6/64/Maracana_stadium_Rio_de_Janeiro_2016.JPG"]
  },
  {
    lat: -22.912983,
    lng: -43.222158,
    nome: "Quinta da Boa Vista – Museu Nacional",
    descricao: "Parque histórico e sede do Museu Nacional, com rica história e espaço para lazer.",
    imagens: ["https://upload.wikimedia.org/wikipedia/commons/a/a2/Museu_Nacional_do_Rio_de_Janeiro_2013.jpg"]
  },
  {
    lat: -22.923116,
    lng: -43.229841,
    nome: "Jardim Zoológico do Rio de Janeiro",
    descricao: "Zoológico localizado na Quinta da Boa Vista, abriga diversas espécies animais.",
    imagens: ["https://upload.wikimedia.org/wikipedia/commons/8/8b/Jardim_Zool%C3%B3gico_do_Rio_de_Janeiro_-_Estrela-do-Mar.jpg"]
  },
  {
    lat: -22.939601,
    lng: -43.230681,
    nome: "Praça Saens Peña",
    descricao: "Praça central da Tijuca, importante ponto comercial e de transporte.",
    imagens: ["https://upload.wikimedia.org/wikipedia/commons/4/4f/Praca_Saens_Pena_-_Rio_de_Janeiro_-_Brasil.JPG"]
  },
  {
    lat: -22.936680,
    lng: -43.234722,
    nome: "Praça Hans Klussmann – Praça dos Bichinhos",
    descricao: "Praça aconchegante e pet-friendly, ideal para passeios com animais de estimação.",
    imagens: ["https://upload.wikimedia.org/wikipedia/commons/2/2b/Praca_dos_Bichinhos_-_Rio_de_Janeiro.JPG"]
  },
  {
    lat: -22.934500,
    lng: -43.255000,
    nome: "Praça Xavier de Brito – Praça dos Cavalinhos",
    descricao: "Praça com área de lazer para crianças e eventos culturais.",
    imagens: ["https://upload.wikimedia.org/wikipedia/commons/c/c9/Praca_Xavier_de_Brito.jpg"]
  },
  {
    lat: -22.951916,
    lng: -43.210487,
    nome: "Cristo Redentor (via acesso Cosme Velho)",
    descricao: "O famoso monumento símbolo do Rio de Janeiro, localizado no topo do Corcovado.",
    imagens: ["https://upload.wikimedia.org/wikipedia/commons/9/99/Cristo_Redentor_-_Rio_de_Janeiro%2C_Brasil.jpg"]
  },
  {
    lat: -22.9530,
    lng: -43.2103,
    nome: "Trem do Corcovado – estação de embarque",
    descricao: "Estação de embarque do trem que leva ao Cristo Redentor pelo Parque Nacional da Tijuca.",
    imagens: ["https://upload.wikimedia.org/wikipedia/commons/7/77/Trem_do_Corcovado_-_Rio_de_Janeiro.jpg"]
  },
  {
    lat: -22.9430,
    lng: -43.2642,
    nome: "Parque Nacional da Tijuca – entrada Floresta da Tijuca",
    descricao: "Entrada principal para uma das maiores florestas urbanas do mundo, com trilhas e cachoeiras.",
    imagens: ["https://upload.wikimedia.org/wikipedia/commons/b/b5/Parque_Nacional_da_Tijuca.jpg"]
  }
];


let personagemLatLng = L.latLng(-22.947, -43.245);

const personagemIcon = L.icon({
  iconUrl: '/assets/anderson.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const personagem = L.marker(personagemLatLng, {
  icon: personagemIcon
}).addTo(map);

map.setView(personagemLatLng, 15);

function mover(dx, dy) {
  const deslocamento = 0.00015;
  personagemLatLng.lat -= dy * deslocamento;
  personagemLatLng.lng += dx * deslocamento;
  personagem.setLatLng(personagemLatLng);
  map.setView(personagemLatLng);
  verificarProximidade();
}

// Substituindo círculos por imagens como ícones
const pontos = locais.map(loc => {
  const icon = L.icon({
    iconUrl: loc.imagens[0],
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);
  marker.dados = loc;
  return marker;
});

function verificarProximidade() {
  pontos.forEach(ponto => {
    const dist = personagemLatLng.distanceTo(ponto.getLatLng());
    if (dist < 100) {
      mostrarInfo(ponto.dados);
    }
  });
}

function mostrarInfo(dados) {
  const box = document.getElementById('info-box');
  document.getElementById('info-title').innerText = dados.nome;
  document.getElementById('info-desc').innerText = dados.descricao;

  const imgDiv = document.getElementById('info-images');
  imgDiv.innerHTML = '';
  dados.imagens.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    imgDiv.appendChild(img);
  });

  box.classList.remove('hidden');
  box.classList.add('active');
}

document.getElementById('toggleTheme').addEventListener('click', () => {
  map.removeLayer(tileLayer);
  tileLayer = theme === 'dark'
    ? L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
    : L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
  theme = theme === 'dark' ? 'light' : 'dark';
});

// Joystick
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
  if (dragging) moveKnob(e);
});

document.addEventListener('pointerup', () => {
  dragging = false;
  knob.style.left = '30px';
  knob.style.top = '30px';
  cancelAnimationFrame(animationFrame);
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

