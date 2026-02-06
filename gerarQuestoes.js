const fs = require("fs");

const materias = require("./materias.json");

async function gerar(materia, assunto) {
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

Formato JSON:
[
 { "enunciado": "...", "alternativas": ["A)","B)","C)","D)"], "correta": "A" }
]`
      }]
    })
  });

  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

(async () => {
  let banco = [];

  for (const materia in materias) {
    for (const assunto of materias[materia]) {
      const qs = await gerar(materia, assunto);
      banco.push(...qs.map(q => ({ materia, assunto, ...q })));
    }
  }

  fs.writeFileSync("questoes.json", JSON.stringify(banco, null, 2));
})();
