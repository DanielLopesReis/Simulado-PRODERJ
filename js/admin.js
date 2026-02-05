import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.getElementById("teste").addEventListener("click", async () => {
  try {
    await addDoc(collection(db, "teste"), {
      mensagem: "Firebase conectado com sucesso!",
      data: new Date()
    });

    alert("Firebase conectado com sucesso!");
  } catch (erro) {
    alert("Erro ao conectar: " + erro.message);
  }
});
