async function gerarQuestoes(materia, assunto) {
  const prompt = `
Gere 5 questões de múltipla escolha para concurso Técnico de Suporte PRODERJ.
Matéria: ${materia}
Assunto: ${assunto}

Responda SOMENTE com JSON válido:

[
 { "enunciado": "...", "alternativas": ["A) ...","B) ...","C) ...","D) ..."], "correta": "A" }
]`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("OPENAI_KEY")
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: prompt
    })
  });

  const data = await response.json();
  const texto = data.output_text;

  const jsonMatch = texto.match(/\[[\s\S]*\]/);
  return JSON.parse(jsonMatch[0]);
}

async function gerarBanco() {
  const key = prompt("Cole sua OPENAI KEY (sk-proj) aqui:");
  localStorage.setItem("OPENAI_KEY", key);

  const materias = await fetch("materias.json").then(r => r.json());

  let banco = [];

  for (const materia in materias) {
    for (const assunto of materias[materia]) {
      alert(`Gerando: ${materia} - ${assunto}`);
      const qs = await gerarQuestoes(materia, assunto);
      banco.push(...qs.map(q => ({ materia, assunto, ...q })));
    }
  }

  const blob = new Blob([JSON.stringify(banco, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "questoes.json";
  a.click();
}
