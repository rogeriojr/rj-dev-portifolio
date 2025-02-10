/**
 * =============================================
 *          GERENCIADOR DE PORTFÓLIO
 * =============================================
 *
 * Responsável por:
 * - Carregar dados de projetos e certificados
 * - Renderizar conteúdo dinâmico
 * - Gerenciar filtros
 */

// Configuração Principal
const config = {
  endpoints: {
    projetos: "json/projetos/desenvolvimento.json",
    certificados: "json/certificados/certificados.json",
  },
  selectors: {
    projetos: "#projetos-container",
    certificados: "#certificados-container",
    isotopeGrid: ".portfolio-grid",
  },
};

/**
 * Função principal de inicialização
 */
window.portfolioManager = {
  init: function () {
    this.renderizarProjetos()
      .then(() => this.initIsotope())
      .catch(console.error);

    this.renderizarCertificados().catch(console.error);
  },

  /**
   * Carrega dados dos arquivos JSON
   */
  carregarDados: async function () {
    try {
      const [projetosRes, certificadosRes] = await Promise.all([
        fetch(config.endpoints.projetos),
        fetch(config.endpoints.certificados),
      ]);

      return {
        projetos: await projetosRes.json(),
        certificados: await certificadosRes.json(),
      };
    } catch (error) {
      console.error("Erro na carga de dados:", error);
      throw error;
    }
  },

  /**
   * Renderiza projetos na página
   */
  renderizarProjetos: async function () {
    const container = document.querySelector(config.selectors.projetos);

    try {
      const { projetos } = await this.carregarDados();

      container.innerHTML = projetos
        .map(
          (projeto) => `
              <div class="col-lg-4 col-md-6 all ${projeto.categoria}">
                  <div class="portfolio_box">
                      <div class="single_portfolio">
                          <img class="img-fluid w-100" 
                               src="${projeto.imagem}" 
                               alt="${projeto.titulo}"
                               loading="lazy">
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
                              <p><a href="${link.url}" target="_blank" rel="noopener">${link.texto}</a></p>
                          `
                            )
                            .join("")}
                      </div>
                  </div>
              </div>
          `
        )
        .join("");
    } catch (error) {
      container.innerHTML = `
              <div class="col-12 text-center py-5">
                  <div class="alert alert-danger">Erro ao carregar projetos</div>
              </div>
          `;
    }
  },

  /**
   * Renderiza certificações na página
   */
  renderizarCertificados: async function () {
    const container = document.querySelector(config.selectors.certificados);

    try {
      const { certificados } = await this.carregarDados();

      container.innerHTML = certificados
        .map(
          (cert) => `
              <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                  <div class="card h-100 shadow-sm">
                      <img src="${cert.imagem}" 
                           class="card-img-top" 
                           alt="${cert.titulo}"
                           loading="lazy">
                      <div class="card-body">
                          <h5 class="card-title">${cert.titulo}</h5>
                      </div>
                  </div>
              </div>
          `
        )
        .join("");
    } catch (error) {
      container.innerHTML = `
              <div class="col-12 text-center py-5">
                  <div class="alert alert-danger">Erro ao carregar certificados</div>
              </div>
          `;
    }
  },

  /**
   * Inicializa o sistema de filtros Isotope
   */
  initIsotope: function () {
    const $grid = $(config.selectors.isotopeGrid).isotope({
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
