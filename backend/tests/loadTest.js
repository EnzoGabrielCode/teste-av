const axios = require('axios');
const fs = require('fs');
const path = require('path');

const url = 'http://localhost:3000/api';
const api = axios.create({ baseURL: url, timeout: 15000 });
let t = null;

async function logar() {
  try {
    console.log('fazendo login...');
    const r = await api.post('/auth/login', {
      usuario: 'admin',
      senha: 'admin123'
    });
    t = r.data.token;
    api.defaults.headers.common['Authorization'] = 'Bearer ' + t;
    console.log('logou ok');
  } catch (e) {
    console.log('erro no login');
    console.log(e.message);
  }
}

async function teste(users, n = 20) {
  console.log('testando com ' + users + ' users');
  
  try { await api.post('/metrics/clear'); } catch (e) {}
  
  for (let i = 0; i < n; i++) {
    console.log('rodando lote ' + (i + 1));
    const list = [];
    for(let j=0; j<users; j++) {
      list.push((async () => {
        try {
          let h = { 'x-client-time': Date.now().toString() };
          await api.get('/aeronaves', { headers: h });
        } catch (err) {
          console.log('erro req');
        }
      })());
    }
    await Promise.all(list);
    await new Promise(r => setTimeout(r, 50));
  }
  
  await new Promise(r => setTimeout(r, 1500));
  
  const m = await api.get('/metrics/summary');
  const d = m.data.data;
  
  return {
    u: users,
    reqs: n,
    lat: d.averageLatency || 0,
    proc: d.averageProcessingTime || 0,
    tot: d.averageResponseTime || 0,
    p95: d.p95 || 0
  };
}

async function start() {
  await logar();
  if(!t) return;

  const r1 = await teste(1, 20);
  console.log('esperando um pouco...');
  await new Promise(r => setTimeout(r, 2000));

  const r5 = await teste(5, 20);
  console.log('esperando mais um pouco...');
  await new Promise(r => setTimeout(r, 2000));

  const r10 = await teste(10, 20);

  const final = [r1, r5, r10];
  
  fs.writeFileSync(path.join(__dirname, 'resultado.json'), JSON.stringify(final));
  
  let html = `<html><head><script src="https://cdn.jsdelivr.net/npm/chart.js"></script></head><body>
  <h1>Relatorio AV3</h1>
  <table border="1" style="width:100%; text-align:center;">
    <tr><th>Usuarios</th><th>Latencia</th><th>Proc</th><th>Total</th><th>P95</th></tr>
    ${final.map(x => `<tr><td>${x.u}</td><td>${x.lat.toFixed(2)}</td><td>${x.proc.toFixed(2)}</td><td>${x.tot.toFixed(2)}</td><td>${x.p95.toFixed(2)}</td></tr>`).join('')}
  </table>
  <br>
  <div style="width: 500px; float:left;"><canvas id="c1"></canvas></div>
  <div style="width: 500px; float:left;"><canvas id="c2"></canvas></div>
  <script>
    const d = ${JSON.stringify(final)};
    new Chart(document.getElementById('c1'), {
      type: 'bar',
      data: {
        labels: d.map(x => x.u + ' users'),
        datasets: [{ label: 'Tempo Total', data: d.map(x => x.tot), backgroundColor: 'blue' }]
      }
    });
    new Chart(document.getElementById('c2'), {
      type: 'line',
      data: {
        labels: d.map(x => x.u + ' users'),
        datasets: [
          { label: 'Latencia', data: d.map(x => x.lat), borderColor: 'red' },
          { label: 'Processamento', data: d.map(x => x.proc), borderColor: 'green' }
        ]
      }
    });
  </script>
  </body></html>`;

  fs.writeFileSync(path.join(__dirname, '../relatorio-performance.html'), html);
  console.log('acabou, arquivo salvo');
}

start();