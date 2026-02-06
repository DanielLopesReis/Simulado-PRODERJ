export async function gerarQuestoesIA(materia, assunto) {
  const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer SUA_CHAVE_OPENAI"
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
