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
    const bloco = document.createElement("div");
    bloco.innerHTML = `
      <h3>Questão ${i + 1}</h3>
      <p>${q.pergunta}</p>
      ${q.alternativas.map(a => `<button>${a}</button>`).join("")}
      <hr/>
    `;
    div.appendChild(bloco);
  });
}

window.onload = async () => {
  const questoes = await carregarQuestoes();
  mostrarQuestoes(questoes);
};
