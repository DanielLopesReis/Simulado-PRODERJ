let respostasUsuario = [];

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

function mostrarQuestoes(questoes) {
  const div = document.getElementById("simulado");
  div.innerHTML = "";

  questoes.forEach((q, i) => {
    respostasUsuario[i] = null;

    const bloco = document.createElement("div");
    bloco.id = `q${i}`;
    bloco.innerHTML = `
      <h3>Questão ${i + 1}</h3>
      <p>${q.pergunta}</p>
      ${q.alternativas
        .map(
          (a) =>
            `<button onclick="responder(${i}, '${a}')">${a}</button>`
        )
        .join("")}
      <hr/>
    `;
    div.appendChild(bloco);
  });

  const botaoFinalizar = document.createElement("button");
  botaoFinalizar.innerText = "Finalizar Prova";
  botaoFinalizar.onclick = () => corrigir(questoes);
  div.appendChild(botaoFinalizar);
}

function responder(indice, resposta) {
  respostasUsuario[indice] = resposta;

  const bloco = document.getElementById(`q${indice}`);
  const botoes = bloco.querySelectorAll("button");

  botoes.forEach((btn) => (btn.style.background = ""));
  botoes.forEach((btn) => {
    if (btn.innerText === resposta) {
      btn.style.background = "#d0e6ff";
    }
  });
}

function corrigir(questoes) {
  const div = document.getElementById("simulado");
  let acertos = 0;

  questoes.forEach((q, i) => {
    const bloco = document.getElementById(`q${i}`);
    const botoes = bloco.querySelectorAll("button");

    botoes.forEach((btn) => {
      if (btn.innerText === q.correta) {
        btn.style.background = "#28a745"; // verde correta
      }

      if (
        btn.innerText === respostasUsuario[i] &&
        respostasUsuario[i] !== q.correta
      ) {
        btn.style.background = "#dc3545"; // vermelho erro
      }
    });

    if (respostasUsuario[i] === q.correta) acertos++;
  });

  const resultado = document.createElement("h2");
  resultado.innerText = `Resultado: ${acertos} de ${questoes.length}`;
  div.appendChild(resultado);
}

window.onload = async () => {
  const questoes = await carregarQuestoes();
  mostrarQuestoes(questoes);
};
