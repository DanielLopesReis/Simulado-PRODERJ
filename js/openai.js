export async function gerarQuestoesIA(materia, assunto) {
  const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
Gere 3 questões de múltipla escolha, nível médio,
para concurso de Técnico de Suporte do PRODERJ.

Matéria: ${materia}
Assunto: ${assunto}

Formato JSON:
[
 {
  "enunciado": "...",
  "alternativas": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correta": "A"
 }
]
`
        }
      ]
    })
  });

  const data = await resposta.json();
  return JSON.parse(data.choices[0].message.content);
}
