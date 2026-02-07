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

function selecionar(i, alternativa, correta, btn) {
  respostasUsuario[i] = alternativa;

  const botoes = btn.parentElement.querySelectorAll("button");
  botoes.forEach(b => b.style.background = "");

  btn.style.background = "#cce5ff";
}

function mostrarQuestoes(questoes) {
  const div = document.getElementById("simulado");
  div.innerHTML = "";

  questoes.forEach((q, i) => {
    const bloco = document.createElement("div");

    bloco.innerHTML = `
      <h3>Questão ${i + 1}</h3>
      <p>${q.pergunta}</p>
      <div id="q${i}">
        ${q.alternativas.map(a =>
          `<button onclick="selecionar(${i}, '${a}', '${q.correta}', this)">${a}</button>`
        ).join("")}
      </div>
      <hr/>
    `;

    div.appendChild(bloco);
  });

  const finalizar = document.createElement("button");
  finalizar.innerText = "Finalizar Prova";
  finalizar.onclick = () => corrigir(questoes);
  div.appendChild(finalizar);
}

function corrigir(questoes) {
  let acertos = 0;

  questoes.forEach((q, i) => {
    if (respostasUsuario[i] === q.correta) acertos++;
  });

  alert(`Você acertou ${acertos} de ${questoes.length} questões!`);
}

window.onload = async () => {
  const questoes = await carregarQuestoes();
  mostrarQuestoes(questoes);
};
