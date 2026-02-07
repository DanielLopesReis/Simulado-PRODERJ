const fs = require("fs");

const materias = require("./materias.json");

async function gerar(materia, assunto) {
  if (!process.env.OPENAI_KEY) {
    throw new Error("OPENAI_KEY não encontrada no ambiente!");
  }

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: `
Gere 5 questões de múltipla escolha para concurso Técnico de Suporte PRODERJ.
Matéria: ${materia}
Assunto: ${assunto}

Responda SOMENTE com JSON válido:

[
 { "enunciado": "...", "alternativas": ["A) ...","B) ...","C) ...","D) ..."], "correta": "A" }
]`
    })
  });

  const data = await res.json();

  const texto = data.output[0].content[0].text;

  const jsonMatch = texto.match(/\[[\s\S]*\]/);

  if (!jsonMatch) {
    console.log(texto);
    throw new Error("JSON não encontrado na resposta");
  }

  return JSON.parse(jsonMatch[0]);
}

(async () => {
  let banco = [];

  for (const materia in materias) {
    for (const assunto of materias[materia]) {
      console.log(`Gerando: ${materia} - ${assunto}`);
      const qs = await gerar(materia, assunto);
      banco.push(...qs.map(q => ({ materia, assunto, ...q })));
    }
  }

  fs.writeFileSync("questoes.json", JSON.stringify(banco, null, 2));
  console.log("questoes.json criado com sucesso!");
})();
