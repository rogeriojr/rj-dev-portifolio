// Função para carregar dados
async function carregarDados() {
  try {
    const [projetosRes, certificadosRes] = await Promise.all([
      fetch("json/projetos/desenvolvimento.json"),
      fetch("json/certificados/certificados.json"),
    ]);

    const projetos = await projetosRes.json();
    const certificados = await certificadosRes.json();

    return {
      projetos: projetos.projetos || projetos,
      certificados: certificados.certificados || certificados,
    };
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    return { projetos: [], certificados: [] };
  }
}

// Renderizar Projetos
async function renderizarProjetos() {
  const dados = await carregarDados();
  const container = document.getElementById("projetos-container");

  container.innerHTML = dados.projetos
    .map(
      (projeto) => `
      <div class="col-lg-4 col-md-6 all ${projeto.categoria}">
          <div class="portfolio_box">
              <div class="single_portfolio">
                  <img class="img-fluid w-100" src="${projeto.imagem}" alt="${
        projeto.titulo
      }">
                  <div class="overlay"></div>
                  <a href="${projeto.imagem}" class="img-gal">
                      <div class="icon"><span class="lnr lnr-cross"></span></div>
                  </a>
              </div>
              <div class="short_info">
                  <h4>${projeto.titulo}</h4>
                  <p>${projeto.descricao}</p>
                  ${projeto.links
                    ?.map(
                      (link) => `
                      <p><a href="${link.url}" target="_blank">${link.texto}</a></p>
                  `
                    )
                    .join("")}
              </div>
          </div>
      </div>
  `
    )
    .join("");
}

// Renderizar Certificados
async function renderizarCertificados() {
  const dados = await carregarDados();
  const container = document.getElementById("certificados-container");

  container.innerHTML = dados.certificados
    .map(
      (cert) => `
      <div class="col-lg-3 col-md-4 col-sm-6">
          <div class="card h-100">
              <img src="${cert.imagem}" class="card-img-top" alt="${cert.titulo}">
              <div class="card-body">
                  <h5 class="card-title">${cert.titulo}</h5>
              </div>
          </div>
      </div>
  `
    )
    .join("");
}

// Inicialização
window.portfolioManager = {
  init: function () {
    renderizarProjetos();
    renderizarCertificados();
    this.initIsotope();
  },

  initIsotope: function () {
    const $grid = $(".portfolio-grid").isotope({
      itemSelector: ".all",
      percentPosition: true,
      masonry: {
        columnWidth: ".all",
      },
    });

    $(".portfolio-filter li").click(function () {
      $(".portfolio-filter li").removeClass("active");
      $(this).addClass("active");
      const filterValue = $(this).attr("data-filter");
      $grid.isotope({ filter: filterValue });
    });
  },
};
