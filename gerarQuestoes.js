const fs = require("fs");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

const materias = require("./materias.json");

async function gerar(materia, assunto) {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `
Gere 5 questões de múltipla escolha para concurso Técnico de Suporte PRODERJ.
Matéria: ${materia}
Assunto: ${assunto}

Responda SOMENTE com JSON válido:

[
 { "enunciado": "...", "alternativas": ["A) ...","B) ...","C) ...","D) ..."], "correta": "A" }
]`
  });

  const texto = response.output_text;

  const jsonMatch = texto.match(/\[[\s\S]*\]/);

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
