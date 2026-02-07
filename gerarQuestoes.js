const fs = require("fs");

const materias = require("./materias.json");

async function gerar(materia, assunto) {
  if (!process.env.OPENAI_KEY) {
    throw new Error("OPENAI_KEY não encontrada no ambiente!");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `
Gere 5 questões de múltipla escolha para concurso Técnico de Suporte PRODERJ.
Matéria: ${materia}
Assunto: ${assunto}

Responda SOMENTE com JSON válido, sem texto antes ou depois:

[
 { "enunciado": "...", "alternativas": ["A) ...","B) ...","C) ...","D) ..."], "correta": "A" }
]`
      }]
    })
  });

  const data = await res.json();

  if (!data.choices) {
    console.log(data);
    throw new Error("Resposta inesperada da OpenAI");
  }

  const texto = data.choices[0].message.content;

  // Extrai apenas o JSON do meio do texto
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
