---
title: "Mural de Recados"
date: 2026-03-26
type: "page"
weight: 9
---

Deixe uma mensagem especial para nós. Seu recado vai fazer parte desse grande dia! 💌

---

<form
  name="mural-recados"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
  class="mural-form"
  id="mural-form"
>
  <input type="hidden" name="form-name" value="mural-recados">
  <p style="display:none;">
    <label>Não preencha se for humano: <input name="bot-field"></label>
  </p>

  <div class="form-group">
    <label for="mural-nome">Seu nome</label>
    <input
      type="text"
      id="mural-nome"
      name="nome"
      placeholder="Como posso te chamar?"
      required
    >
  </div>

  <div class="form-group">
    <label for="mural-mensagem">Sua mensagem</label>
    <textarea
      id="mural-mensagem"
      name="mensagem"
      placeholder="Escreva algo lindo para Luiz & Isabela..."
      required
    ></textarea>
  </div>

  <button type="submit" class="mural-submit">Enviar Recado</button>
</form>

<div class="mural-success" id="mural-success">
  <span class="success-emoji">💌</span>
  <p style="font-weight:300; line-height:1.7;">
    Seu recado foi enviado com muito carinho!<br>
    <em style="opacity:0.6; font-size:0.9rem;">Obrigado por fazer parte da nossa história.</em>
  </p>
</div>

<script>
(function() {
  var form    = document.getElementById("mural-form");
  var success = document.getElementById("mural-success");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    var data = new FormData(form);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString()
    })
    .then(function() {
      form.style.display = "none";
      success.style.display = "block";
    })
    .catch(function() {
      alert("Ops! Erro ao enviar. Tente novamente.");
    });
  });
})();
</script>
