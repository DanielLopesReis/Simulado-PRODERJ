import { db } from "./js/firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function carregarQuestoes() {
  const querySnapshot = await getDocs(collection(db, "questoes"));
  let questoes = [];

  querySnapshot.forEach((doc) => {
    questoes.push(doc.data());
  });

  return questoes.sort(() => Math.random() - 0.5).slice(0, 10);
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
