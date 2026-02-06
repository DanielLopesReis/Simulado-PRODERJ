import { gerarQuestoesIA } from "./openai.js";
import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function carregarMaterias() {
  const res = await fetch("materias.json");
  return res.json();
}

function gerarQuestaoFake(materia, assunto) {
  return {
    materia,
    assunto,
    enunciado: `Questão sobre ${assunto} (${materia})`,
    alternativas: [
      "Alternativa A",
      "Alternativa B",
      "Alternativa C",
      "Alternativa D"
    ],
    correta: "A"
  };
}

document.getElementById("gerar").addEventListener("click", async () => {
  const materias = await carregarMaterias();

 for (const materia in materias) {
  for (const assunto of materias[materia]) {

    const questoes = await gerarQuestoesIA(materia, assunto);

    for (const q of questoes) {
      await addDoc(collection(db, "questoes"), {
        materia,
        assunto,
        ...q
      });
    }
  }
}
