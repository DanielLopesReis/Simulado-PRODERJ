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
      ${q.alternativas.map((a, idx) =>
        `<button onclick="responder(${i}, '${a}', this)">${a}</button>`
      ).join("")}
      <hr/>
    `;
    div.appendChild(bloco);
  });

  const btnFinalizar = document.createElement("button");
  btnFinalizar.innerText = "Finalizar Simulado";
  btnFinalizar.onclick = corrigirProva;
  div.appendChild(btnFinalizar);
}

function responder(numero, alternativa, botao) {
  respostasUsuario[numero] = alternativa;

  // destacar botão escolhido
  const botoes = botao.parentElement.querySelectorAll("button");
  botoes.forEach(b => b.style.background = "");
  botao.style.background = "#cce5ff";
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
