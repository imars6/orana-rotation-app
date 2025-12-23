const PASSCODE = "orana2026"; // ← CHANGE THIS

let data = [];

function unlock() {
  const input = document.getElementById("passcode").value;
  if (input === PASSCODE) {
    localStorage.setItem("authed", "yes");
    showApp();
  } else {
    alert("Incorrect passcode");
  }
}

function showApp() {
  document.getElementById("passcode-screen").style.display = "none";
  document.getElementById("app").style.display = "block";
}

if (localStorage.getItem("authed") === "yes") {
  showApp();
}

fetch("rotation.csv")
  .then(res => res.text())
  .then(text => {
    const rows = text.trim().split("\n").slice(1);
    data = rows.map(r => {
      const [participant, week, day, session, zone] = r.split(",");
      return { participant, week, day, session, zone };
    });
    setupControls();
    render();
  });

function setupControls() {
  fill("week", ["A", "B"]);
  fill("day", ["Mon", "Tue", "Wed", "Thu", "Fri"]);
  fill("session", ["AM", "PM"]);
}

function fill(id, values) {
  const sel = document.getElementById(id);
  values.forEach(v => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    sel.appendChild(o);
  });
  sel.onchange = render;
}

document.getElementById("search").oninput = render;

function render() {
  const w = week.value, d = day.value, s = session.value;
  const q = search.value.toLowerCase();

  const filtered = data.filter(r =>
    r.week === w &&
    r.day === d &&
    r.session === s &&
    (r.participant.toLowerCase().includes(q) || r.zone.toLowerCase().includes(q))
  );

  const zones = {};
  filtered.forEach(r => {
    zones[r.zone] = zones[r.zone] || [];
    zones[r.zone].push(r.participant);
  });

  results.innerHTML = "";
  Object.keys(zones).forEach(z => {
    results.innerHTML += `
      <div class="zone">
        <h3>${z}</h3>
        <div>${zones[z].join("<br>")}</div>
      </div>`;
  });
}
