/**
 * =============================================
 *          GERENCIADOR DE PORTFÓLIO
 * =============================================
 *
 * Responsável por:
 * - Carregar dados de projetos e certificados
 * - Renderizar conteúdo dinâmico
 * - Gerenciar filtros
 *
 * Última atualização: [DD/MM/AAAA]
 */

// Configurações globais
const CONFIG = {
  endpoints: {
    projetos: "json/projetos/desenvolvimento.json",
    certificados: "json/certificados/certificados.json",
  },
  selectors: {
    projetos: "#projetos-container",
    certificados: "#certificados-container",
    isotopeGrid: ".portfolio-grid",
    filterButtons: ".portfolio-filter li",
  },
  styles: {
    cardImageHeight: "200px",
  },
};

// Interface principal
window.portfolioManager = {
  /**
   * Inicializa o portfólio
   */
  init: function () {
    this._loadProjects()
      .then(() => this._initFilters())
      .catch(this._handleError.bind(this, "projetos"));

    this._loadCertificates().catch(
      this._handleError.bind(this, "certificados")
    );
  },

  /**
   * Carrega e renderiza projetos
   */
  _loadProjects: async function () {
    try {
      const data = await this._fetchData("projetos");
      this._renderProjects(data.projetos);
    } catch (error) {
      throw new Error(`Falha ao carregar projetos: ${error.message}`);
    }
  },

  /**
   * Carrega e renderiza certificados
   */
  _loadCertificates: async function () {
    try {
      const data = await this._fetchData("certificados");
      this._renderCertificates(data.certificados);
    } catch (error) {
      throw new Error(`Falha ao carregar certificados: ${error.message}`);
    }
  },

  /**
   * Busca dados na API
   */
  _fetchData: async function (type) {
    try {
      const response = await fetch(CONFIG.endpoints[type]);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Valida estrutura dos dados
      if (!data[type] || !Array.isArray(data[type])) {
        throw new Error(`Estrutura de dados inválida para ${type}`);
      }

      return data;
    } catch (error) {
      console.error(`Erro ao buscar ${type}:`, error);
      throw error;
    }
  },

  /**
   * Renderiza projetos na tela
   */
  _renderProjects: function (projects) {
    const container = document.querySelector(CONFIG.selectors.projetos);

    if (!container) {
      throw new Error("Container de projetos não encontrado");
    }

    container.innerHTML = projects
      .map(
        (project) => `
          <div class="col-lg-4 col-md-6 all ${project.categoria}">
              <div class="portfolio_box">
                  <div class="single_portfolio">
                      <img class="img-fluid w-100" 
                          src="${project.imagem}" 
                          alt="${project.titulo}"
                          loading="lazy">
                      <div class="overlay"></div>
                      <a href="${project.imagem}" class="img-gal">
                          <div class="icon"><span class="lnr lnr-cross"></span></div>
                      </a>
                  </div>
                  <div class="short_info">
                      <h4>${project.titulo}</h4>
                      <p>${project.descricao}</p>
                      ${project.links
                        ?.map(
                          (link) => `
                          <p><a href="${link.url}" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              class="project-link">
                              ${link.texto}
                          </a></p>
                      `
                        )
                        .join("")}
                  </div>
              </div>
          </div>
      `
      )
      .join("");
  },

  /**
   * Renderiza certificados na tela
   */
  _renderCertificates: function (certificates) {
    const container = document.querySelector(CONFIG.selectors.certificados);

    if (!container) {
      throw new Error("Container de certificados não encontrado");
    }

    container.innerHTML = certificates
      .map(
        (cert) => `
          <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div class="card h-100 shadow-sm">
                  <img src="${cert.imagem}" 
                      class="card-img-top" 
                      alt="${cert.titulo}"
                      loading="lazy"
                      style="height: ${CONFIG.styles.cardImageHeight}; object-fit: cover;">
                  <div class="card-body">
                      <h5 class="card-title text-center">${cert.titulo}</h5>
                  </div>
              </div>
          </div>
      `
      )
      .join("");
  },

  /**
   * Inicializa filtros Isotope
   */
  _initFilters: function () {
    const grid = document.querySelector(CONFIG.selectors.isotopeGrid);

    if (!grid) {
      console.warn("Elemento grid não encontrado para inicializar filtros");
      return;
    }

    const $grid = $(grid).isotope({
      itemSelector: ".all",
      percentPosition: true,
      masonry: {
        columnWidth: ".all",
      },
    });

    $(CONFIG.selectors.filterButtons).click(function () {
      $(CONFIG.selectors.filterButtons).removeClass("active");
      $(this).addClass("active");
      const filterValue = $(this).attr("data-filter");
      $grid.isotope({ filter: filterValue });
    });
  },

  /**
   * Manipulador de erros global
   */
  _handleError: function (context, error) {
    console.error(`Erro no contexto ${context}:`, error);
    const container = document.querySelector(CONFIG.selectors[context]);

    if (container) {
      container.innerHTML = `
              <div class="col-12 text-center py-5">
                  <div class="alert alert-danger">
                      Erro ao carregar ${context}<br>
                      <small>${error.message}</small>
                  </div>
              </div>
          `;
    }
  },
};
