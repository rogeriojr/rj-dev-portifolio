/**
 * =============================================
 *          GERENCIADOR DE PORTFÓLIO
 * =============================================
 *
 * Responsável pelo carregamento dinâmico e
 * renderização de projetos e certificados
 *
 * Funcionalidades principais:
 * 1. Carregamento assíncrono de dados
 * 2. Renderização de cards responsivos
 * 3. Sistema de filtragem Isotope
 * 4. Tratamento de erros robusto
 */

// Configurações globais
const PORTFOLIO_CONFIG = {
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
  classes: {
    projectItem: "col-lg-4 col-md-6 all",
    certificateItem: "col-lg-3 col-md-4 col-sm-6 mb-4",
  },
  styles: {
    cardImageHeight: "200px",
    defaultCategory: "all",
  },
};

// Interface principal do portfólio
window.portfolioManager = (function () {
  // Métodos privados
  const _fetchData = async (endpoint) => {
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(
          `Erro HTTP: ${response.status} - ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Falha no fetch: ${endpoint}`, error);
      throw error;
    }
  };

  const _validateDataStructure = (data, expectedKey) => {
    if (!data[expectedKey] || !Array.isArray(data[expectedKey])) {
      throw new Error(
        `Estrutura inválida: Chave '${expectedKey}' não encontrada ou não é array`
      );
    }
    return data[expectedKey];
  };

  // Interface pública
  return {
    /**
     * Inicializa o portfólio
     */
    init: function () {
      this.loadProjects()
        .then(() => this.initFilters())
        .catch((error) => this.handleError("projetos", error));

      this.loadCertificates().catch((error) =>
        this.handleError("certificados", error)
      );
    },

    /**
     * Carrega e renderiza projetos
     */
    loadProjects: async function () {
      try {
        const rawData = await _fetchData(PORTFOLIO_CONFIG.endpoints.projetos);
        const projects = _validateDataStructure(rawData, "projetos");
        this.renderProjects(projects);
      } catch (error) {
        throw new Error(`Falha no carregamento de projetos: ${error.message}`);
      }
    },

    /**
     * Carrega e renderiza certificados
     */
    loadCertificates: async function () {
      try {
        const rawData = await _fetchData(
          PORTFOLIO_CONFIG.endpoints.certificados
        );
        const certificates = _validateDataStructure(rawData, "certificados");
        this.renderCertificates(certificates);
      } catch (error) {
        throw new Error(
          `Falha no carregamento de certificados: ${error.message}`
        );
      }
    },

    /**
     * Renderiza projetos no DOM
     */
    renderProjects: function (projects) {
      const container = document.querySelector(
        PORTFOLIO_CONFIG.selectors.projetos
      );

      if (!container) {
        throw new Error("Container de projetos não encontrado");
      }

      try {
        container.innerHTML = projects
          .map(
            (project) => `
              <div class="${PORTFOLIO_CONFIG.classes.projectItem} ${
              project.categoria || PORTFOLIO_CONFIG.styles.defaultCategory
            }">
                <div class="portfolio_box">
                  <div class="single_portfolio">
                    <img class="img-fluid w-100" 
                      src="${project.imagem}" 
                      alt="${project.titulo}"
                      loading="lazy"
                      style="height: 250px; object-fit: cover;"
                      onerror="this.style.display='none'">
                    <div class="overlay"></div>
                    <a href="${project.imagem}" class="img-gal">
                      <div class="icon"><span class="lnr lnr-cross"></span></div>
                    </a>
                  </div>
                  <div class="short_info">
                    <h4>${project.titulo}</h4>
                    <p class="text-muted">${project.descricao}</p>
                    ${(project.links || [])
                      .map(
                        (link) => `
                      <div class="link-container">
                        <a href="${link.url}" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          class="btn-link">
                          <i class="fa fa-external-link mr-2"></i>${link.texto}
                        </a>
                      </div>
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
        throw new Error(`Falha na renderização: ${error.message}`);
      }
    },

    /**
     * Renderiza certificados no DOM
     */
    renderCertificates: function (certificates) {
      const container = document.querySelector(
        PORTFOLIO_CONFIG.selectors.certificados
      );

      if (!container) {
        throw new Error("Container de certificados não encontrado");
      }

      try {
        container.innerHTML = certificates
          .map(
            (cert) => `
              <div class="${PORTFOLIO_CONFIG.classes.certificateItem}">
                <div class="card h-100 shadow-sm border-0">
                  <img src="${cert.imagem}" 
                    class="card-img-top" 
                    alt="${cert.titulo}"
                    loading="lazy"
                    style="height: ${PORTFOLIO_CONFIG.styles.cardImageHeight}; object-fit: cover; border-radius: 10px 10px 0 0;"
                    onerror="this.style.display='none'">
                  <div class="card-body text-center">
                    <h5 class="card-title font-weight-bold mb-0">${cert.titulo}</h5>
                  </div>
                </div>
              </div>
            `
          )
          .join("");
      } catch (error) {
        throw new Error(`Falha na renderização: ${error.message}`);
      }
    },

    /**
     * Renderiza certificados no DOM
     */
    renderCertificates: function (certificates) {
      const container = document.querySelector(
        PORTFOLIO_CONFIG.selectors.certificados
      );

      if (!container) {
        throw new Error("Container de certificados não encontrado");
      }

      try {
        container.innerHTML = certificates
          .map(
            (cert) => `
                  <div class="${PORTFOLIO_CONFIG.classes.certificateItem}">
                      <div class="card h-100 shadow-sm">
                          <img src="${cert.imagem}" 
                              class="card-img-top" 
                              alt="${cert.titulo}"
                              loading="lazy"
                              style="height: ${PORTFOLIO_CONFIG.styles.cardImageHeight}; object-fit: cover;"
                              onerror="this.style.display='none'">
                          <div class="card-body">
                              <h5 class="card-title text-center">${cert.titulo}</h5>
                          </div>
                      </div>
                  </div>
              `
          )
          .join("");
      } catch (error) {
        throw new Error(`Falha na renderização: ${error.message}`);
      }
    },

    /**
     * Inicializa o sistema de filtros
     */
    initFilters: function () {
      const gridElement = document.querySelector(
        PORTFOLIO_CONFIG.selectors.isotopeGrid
      );

      if (!gridElement || !window.Isotope) {
        console.warn("Isotope não carregado ou elemento grid não encontrado");
        return;
      }

      // Garante que o DOM está pronto
      $(document).ready(() => {
        const isotopeGrid = new Isotope(gridElement, {
          itemSelector: "." + PORTFOLIO_CONFIG.styles.defaultCategory,
          percentPosition: true,
          masonry: {
            columnWidth: "." + PORTFOLIO_CONFIG.styles.defaultCategory,
          },
        });

        $(PORTFOLIO_CONFIG.selectors.filterButtons).on("click", function () {
          $(this).parent().find(".active").removeClass("active");
          $(this).addClass("active");
          isotopeGrid.arrange({
            filter: $(this).attr("data-filter") || "*",
          });
        });
      });
    },

    /**
     * Manipulador global de erros
     */
    handleError: function (context, error) {
      console.error(`[${context.toUpperCase()}]`, error);

      const container = document.querySelector(
        PORTFOLIO_CONFIG.selectors[context]
      );
      if (!container) return;

      container.innerHTML = `
              <div class="col-12 text-center py-5">
                  <div class="alert alert-danger">
                      <i class="fa fa-exclamation-triangle"></i>
                      Erro ao carregar ${context}
                      ${
                        error.message
                          ? `<br><small>${error.message}</small>`
                          : ""
                      }
                  </div>
              </div>
          `;
    },
  };
})();
