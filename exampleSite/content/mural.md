---
title: "Mural de Recados"
date: 2026-03-26
type: "page"
weight: 9
---

Deixe uma mensagem especial para nós. Seu recado vai fazer parte desse grande dia! 💌

---

### Deixe seu Recado

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

---

### 🎵 A Trilha Sonora do Nosso Dia
A música sempre foi fundamental na nossa jornada. Enquanto aguardamos o grande dia, curta nossa playlist e nos ajude a montar a trilha sonora perfeita para a festa!

{{< spotify id="5qiGBsH83SRayyZbrxCXPK" >}}

<div style="margin-top: 1.5rem;">
<a href="https://open.spotify.com/playlist/5qiGBsH83SRayyZbrxCXPK?si=2fddf8d5e3bd4f8b&pt=de4ae5cef79a7e89d6812a9bb11dccdd" target="_blank" class="btn-spotify">
  Adicionar Músicas no Spotify
</a>
</div>
