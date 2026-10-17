const cards = document.querySelectorAll(".person-card, .service-card");
const overlay = document.getElementById("modalOverlay");
const modalImg = document.getElementById("modalImg");
const modalNome = document.getElementById("modalNome");
const modalBio = document.getElementById("modalBio");
const botaoFechar = document.getElementById("modalClose");
const elementosAnimados = document.querySelectorAll(".person-card, .service-card");

cards.forEach( function (card) {
  card.addEventListener("click", function () {

    const nome = card.querySelector("h3").textContent;
    const bio = card.getAttribute("data-bio") || card.getAttribute("data-detalhe");
    const imagem = card.getAttribute("data-img") || card.querySelector("img").src;

    modalNome.textContent = nome;
    modalBio.textContent = bio;
    modalImg.src = imagem;
    modalImg.alt = nome;

    overlay.classList.add("ativo");

  });
});

botaoFechar.addEventListener("click", function () {
  overlay.classList.remove("ativo");
});


overlay.addEventListener("click", function(evento) {
  if(evento.target == overlay) {
    overlay.classList.remove("ativo");
  }
});

const observer = new IntersectionObserver( function (entradas) {
  entradas.forEach( function (entrada) {
    if(entrada.isIntersecting) {
      entrada.target.classList.add("visivel");
    }
  });
},

  {
    threshold: 0.2
  });

  elementosAnimados.forEach( function (elemento){
    observer.observe(elemento);
  });


/* ===== Formulário de contato ===== */

// E-mail da empresa que recebe os pedidos
const EMAIL_EMPRESA = "gensyssofthause@gmail.com";

const contatoOverlay = document.getElementById("contatoOverlay");
const abrirContato = document.getElementById("abrirContato");
const contatoClose = document.getElementById("contatoClose");
const formContato = document.getElementById("formContato");
const contatoStatus = document.getElementById("contatoStatus");
const contatoEnviar = document.getElementById("contatoEnviar");

function mostrarStatus(texto, tipo) {
  contatoStatus.textContent = texto;
  contatoStatus.className = "form-status" + (tipo ? " " + tipo : "");
}

abrirContato.addEventListener("click", function () {
  mostrarStatus("", "");
  contatoOverlay.classList.add("ativo");
  document.getElementById("contatoEmail").focus();
});

contatoClose.addEventListener("click", function () {
  contatoOverlay.classList.remove("ativo");
});

contatoOverlay.addEventListener("click", function (evento) {
  if (evento.target == contatoOverlay) {
    contatoOverlay.classList.remove("ativo");
  }
});

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    contatoOverlay.classList.remove("ativo");
    overlay.classList.remove("ativo");
  }
});

formContato.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const email = document.getElementById("contatoEmail").value.trim();
  const servico = document.getElementById("contatoServico").value;
  const mensagem = document.getElementById("contatoMensagem").value.trim();
  const honey = document.getElementById("contatoHoney").value;

  if (honey) { return; } // robô preencheu o campo escondido

  if (!email || !email.includes("@") || !email.includes(".")) {
    mostrarStatus("Digite um e-mail válido.", "erro");
    return;
  }
  if (!servico) {
    mostrarStatus("Escolha o serviço que você deseja.", "erro");
    return;
  }

  contatoEnviar.disabled = true;
  mostrarStatus("Enviando...", "");

  const dados = {
    email: email,
    servico: servico,
    mensagem: mensagem || "(sem detalhes)",
    _subject: "Novo pedido pelo site: " + servico,
    _template: "table",
    _captcha: "false",
    _autoresponse:
      "Olá! Recebemos o seu contato na GenEsys Softhouse. " +
      "Entraremos em contato em breve para conversar sobre as nossas experiências " +
      "e sobre o serviço que você deseja: " + servico + ". Obrigado pelo interesse!"
  };

  fetch("https://formsubmit.co/ajax/" + EMAIL_EMPRESA, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(dados)
  })
    .then(function (resposta) {
      if (!resposta.ok) { throw new Error("Falha no envio"); }
      return resposta.json();
    })
    .then(function () {
      mostrarStatus("Pronto! Enviamos uma confirmação para o seu e-mail. Entraremos em contato em breve.", "ok");
      formContato.reset();
    })
    .catch(function () {
      mostrarStatus("Não conseguimos enviar agora. Tente de novo ou escreva para " + EMAIL_EMPRESA + ".", "erro");
    })
    .finally(function () {
      contatoEnviar.disabled = false;
    });
});
