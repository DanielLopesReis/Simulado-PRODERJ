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
    bloco.innerHTML = `
      <h3>Questão ${i + 1}</h3>
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

  // ativar cliques DEPOIS que o HTML existe
  document.querySelectorAll(".alt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const q = btn.dataset.q;
      const alt = btn.dataset.alt;

      respostasUsuario[q] = alt;

      // destacar botão escolhido
      const grupo = btn.parentElement.querySelectorAll(".alt-btn");
      grupo.forEach(b => b.style.background = "");
      btn.style.background = "#cce5ff";
    });
  });

  const btnFinalizar = document.createElement("button");
  btnFinalizar.innerText = "Finalizar Simulado";
  btnFinalizar.onclick = corrigirProva;
  div.appendChild(btnFinalizar);
}

function corrigirProva() {
  let pontos = 0;

  respostasUsuario.forEach((resp, i) => {
    if (resp === gabarito[i]) pontos++;
  });

  alert(`Você acertou ${pontos} de ${gabarito.length} questões!`);
}

window.onload = async () => {
  const questoes = await carregarQuestoes();
  mostrarQuestoes(questoes);
};
