// Função para carregar dados do localStorage
// Carregar dados de arquivos JSON
async function carregarDados() {
  try {
    const [projetosRes, certificadosRes] = await Promise.all([
      fetch("/json/projetos/desenvolvimento.json"),
      fetch("/json/certificados/certificados.json"),
    ]);

    return {
      projetos: await projetosRes.json(),
      certificados: await certificadosRes.json(),
    };
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    return { projetos: [], certificados: [] };
  }
}

// Função para salvar dados no localStorage
function salvarDados(dados) {
  localStorage.setItem("portfolioData", JSON.stringify(dados));
}

// Função para renderizar projetos
function renderizarProjetos() {
  const dados = carregarDados();
  const container = $("#projetos-container");
  container.empty();

  dados.projetos.forEach((projeto) => {
    const projetoHTML = `
          <div class="col-lg-4 col-md-6 all ${projeto.categoria}">
              <div class="portfolio_box">
                  <div class="single_portfolio">
                      <img class="img-fluid w-100" src="${
                        projeto.imagem
                      }" alt="${projeto.titulo}">
                      <div class="overlay"></div>
                      <a href="${projeto.imagem}" class="img-gal">
                          <div class="icon">
                              <span class="lnr lnr-cross"></span>
                          </div>
                      </a>
                  </div>
                  <div class="short_info">
                      <h4>${projeto.titulo}</h4>
                      <p>${projeto.descricao}</p>
                      ${projeto.links
                        .map(
                          (link) =>
                            `<p><a href="${link.url}" target="_blank">${link.texto}</a></p>`
                        )
                        .join("")}
                  </div>
              </div>
          </div>
      `;
    container.append(projetoHTML);
  });
}

// Formulário de cadastro
$("#formProjeto").submit(function (e) {
  e.preventDefault();

  const novoProjeto = {
    titulo: $("#titulo").val(),
    categoria: $("#categoria").val(),
    descricao: $("#descricao").val(),
    imagem: $("#imagem").val(),
    links: $("#links")
      .val()
      .split(",")
      .map((link) => {
        const [texto, url] = link.split("|");
        return { texto: texto.trim(), url: url.trim() };
      }),
  };

  const dados = carregarDados();
  dados.projetos.push(novoProjeto);
  salvarDados(dados);

  // Atualiza a exibição
  renderizarProjetos();

  // Limpa o formulário
  this.reset();
});

// Carrega os projetos ao iniciar
$(document).ready(function () {
  renderizarProjetos();
});
