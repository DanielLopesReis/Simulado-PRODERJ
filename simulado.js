const TEMPO_MINUTOS = 240;

let respostasUsuario = {};
let gabarito = {};
let materiasQuestoes = {};
let timerInterval;

function iniciarTimer() {
  let tempo = TEMPO_MINUTOS * 60;
  const el = document.getElementById("timer");

  timerInterval = setInterval(() => {
    let h = Math.floor(tempo / 3600);
    let m = Math.floor((tempo % 3600) / 60);
    let s = tempo % 60;

    el.innerText =
      `Tempo restante: ${h}h ${m.toString().padStart(2, "0")}m ${s
        .toString()
        .padStart(2, "0")}s`;

    if (tempo <= 0) {
      clearInterval(timerInterval);
      corrigirProva();
    }

    tempo--;
  }, 1000);
}

function pegarQuestoesNaoUsadas(todas) {
  const usadas = JSON.parse(localStorage.getItem("usadas") || "[]");
  const novas = todas.filter(q => !usadas.includes(q.pergunta));

  const escolhidas = novas.sort(() => Math.random() - 0.5).slice(0, 10);

  const atualizadas = [...usadas, ...escolhidas.map(q => q.pergunta)];
  localStorage.setItem("usadas", JSON.stringify(atualizadas));

  return escolhidas;
}

async function carregarQuestoes() {
  const res = await fetch("db/questoes.json");
  const banco = await res.json();

  let todas = [];

  for (let materia in banco) {
    for (let topico in banco[materia]) {
      banco[materia][topico].forEach(q => {
        q.materia = materia;
        todas.push(q);
      });
    }
  }

  return pegarQuestoesNaoUsadas(todas);
}

function mostrarQuestoes(questoes) {
  const div = document.getElementById("simulado");
  div.innerHTML = `<div id="timer"></div><hr/>`;

  questoes.forEach((q, i) => {
    // gabarito = PRIMEIRA alternativa (padrão do seu gerador)
    gabarito[i] = q.alternativas[0];
    materiasQuestoes[i] = q.materia;

    const bloco = document.createElement("div");
    bloco.className = "questao";

    bloco.innerHTML = `
      <h3>Questão ${i + 1} - ${q.materia}</h3>
      <p>${q.pergunta}</p>
      ${q.alternativas.map(a =>
        `<button class="alt-btn" data-q="${i}" data-alt="${a}">
          ${a}
        </button>`
      ).join("")}
      <hr/>
    `;

    div.appendChild(bloco);
  });

  document.querySelectorAll(".alt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const q = btn.dataset.q;
      const alt = btn.dataset.alt;

      respostasUsuario[q] = alt;

      const grupo = btn.parentElement.querySelectorAll(".alt-btn");
      grupo.forEach(b => b.classList.remove("selecionada"));
      btn.classList.add("selecionada");
    });
  });

  const btnFinalizar = document.createElement("button");
  btnFinalizar.id = "finalizar";
  btnFinalizar.innerText = "Finalizar Simulado";
  btnFinalizar.onclick = corrigirProva;
  div.appendChild(btnFinalizar);

  iniciarTimer();
}

function corrigirProva() {
  clearInterval(timerInterval);

  let total = 0;
  let porMateria = {};

  document.querySelectorAll(".questao").forEach((bloco, i) => {
    const botoes = bloco.querySelectorAll(".alt-btn");

    botoes.forEach(btn => {
      const alt = btn.dataset.alt;

      if (alt === gabarito[i]) {
        btn.classList.add("correta");
      }

      if (respostasUsuario[i] === alt && alt !== gabarito[i]) {
        btn.classList.add("errada");
      }
    });

    const materia = materiasQuestoes[i];
    if (!porMateria[materia]) porMateria[materia] = 0;

    if (respostasUsuario[i] === gabarito[i]) {
      total++;
      porMateria[materia]++;
    }
  });

  let resumo = `Resultado Total: ${total}/10\n\nPor matéria:\n`;
  for (let m in porMateria) {
    resumo += `${m}: ${porMateria[m]}\n`;
  }

  alert(resumo);
}

window.onloa
