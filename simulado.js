async function carregarQuestoes() {
  const res = await fetch("db/questoes.json");
  const banco = await res.json();

  let todas = [];

  for (let materia in banco) {
    for (let topico in banco[materia]) {
      todas.push(...banco[materia][topico]);
    }
  }

  return todas.sort(() => Math.random() - 0.5).slice(0, 10);
}

let respostasUsuario = [];
let gabarito = [];

function mostrarQuestoes(questoes) {
  const div = document.getElementById("simulado");
  div.innerHTML = "";

  questoes.forEach((q, i) => {
    gabarito[i] = q.correta;

    const bloco = document.createElement("div");
    bloco.className = "questao";

    bloco.innerHTML = `
      <h3>Questão ${i + 1}</h3>
      <p>${q.pergunta}</p>
      ${q.alternativas.map(a =>
        `<button class="alt-btn" data-q="${i}" data-alt="${a}">
          ${a}
        </button>`
      ).join("")}
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
}

function corrigirProva() {
  let pontos = 0;

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

    if (respostasUsuario[i] === gabarito[i]) pontos++;
  });

  alert(`Resultado: ${pontos} de ${gabarito.length} questões`);

  const btnRefazer = document.createElement("button");
  btnRefazer.id = "refazer";
  btnRefazer.innerText = "Refazer Simulado";
  btnRefazer.onclick = () => location.reload();

  document.getElementById("simulado").appendChild(btnRefazer);

  document.getElementById("finalizar").remove();
}

window.onload = async () => {
  const questoes = await carregarQuestoes();
  mostrarQuestoes(questoes);
};
