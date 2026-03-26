---
title: "RSVP"
date: 2026-03-24
type: "page"
weight: 4
---

<p style="font-size: 0.80rem; opacity: 0.7; font-style: italic; line-height: 1.4; margin-bottom: 1.5rem; border-left: 2px solid var(--wedding-border); padding-left: 1rem;">
    <strong>O que é RSVP?</strong><br>
    Abreviação da expressão francesa "Répondez s'il vous plaît", que significa "responda, por favor". É uma ferramenta essencial para planejarmos cada detalhe com precisão, garantindo o melhor conforto para todos os nossos convidados.
</p>

# Confirmar Presença

Para nos ajudar na organização, por favor confirme sua presença até o dia **17 de Junho de 2027**.

---

<form
  name="rsvp"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
  class="mural-form"
  id="rsvp-form"
>
  <input type="hidden" name="form-name" value="rsvp">
  <p style="display:none;">
    <label>Não preencha se for humano: <input name="bot-field"></label>
  </p>

  <div class="form-group">
    <label for="rsvp-nome">Seu nome completo *</label>
    <input
      type="text"
      id="rsvp-nome"
      name="nome"
      placeholder="Como você se chama?"
      required
    >
  </div>

  <div class="form-group">
    <label>Você irá comparecer? *</label>
    <div class="radio-group" role="radiogroup">
      <label class="radio-option">
        <input type="radio" name="presenca" value="Sim, estarei presente!" required>
        <span>Sim, estarei presente!</span>
      </label>
      <label class="radio-option">
        <input type="radio" name="presenca" value="Não poderei comparecer">
        <span>Não poderei comparecer</span>
      </label>
      <label class="radio-option">
        <input type="radio" name="presenca" value="Ainda não tenho certeza">
        <span>Ainda não tenho certeza</span>
      </label>
    </div>
  </div>

  <div class="form-group">
    <label>Número de acompanhantes</label>
    <div class="radio-group" role="radiogroup">
      <label class="radio-option">
        <input type="radio" name="acompanhantes" value="0" checked>
        <span>Nenhum</span>
      </label>
      <label class="radio-option">
        <input type="radio" name="acompanhantes" value="1">
        <span>1</span>
      </label>
      <label class="radio-option">
        <input type="radio" name="acompanhantes" value="2">
        <span>2</span>
      </label>
      <label class="radio-option">
        <input type="radio" name="acompanhantes" value="3">
        <span>3</span>
      </label>
      <label class="radio-option">
        <input type="radio" name="acompanhantes" value="4">
        <span>4</span>
      </label>
      <label class="radio-option">
        <input type="radio" name="acompanhantes" value="5 ou mais">
        <span>5+</span>
      </label>
    </div>
  </div>

  <div class="form-group">
    <label for="rsvp-restricao">Restrições alimentares</label>
    <input
      type="text"
      id="rsvp-restricao"
      name="restricao_alimentar"
      placeholder="Ex: vegetariano, sem glúten, alergia a frutos do mar... (opcional)"
    >
  </div>

  <div class="form-group">
    <label for="rsvp-mensagem">Alguma mensagem para os noivos? (opcional)</label>
    <textarea
      id="rsvp-mensagem"
      name="mensagem"
      placeholder="Deixe um recadinho carinhoso se quiser..."
      style="min-height:100px;"
    ></textarea>
  </div>

  <button type="submit" class="mural-submit">Confirmar Presença</button>
</form>

<div class="mural-success" id="rsvp-success">
  <span class="success-emoji">🎉</span>
  <p style="font-weight:300; line-height:1.7;">
    Presença confirmada com sucesso!<br>
    <em style="opacity:0.6; font-size:0.9rem;">Mal podemos esperar para te ver lá. Obrigado! ❤️</em>
  </p>
</div>

<script>
(function() {
  var form    = document.getElementById("rsvp-form");
  var success = document.getElementById("rsvp-success");
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
      alert("Ops! Erro ao enviar. Por favor, tente novamente.");
    });
  });
})();
</script>

