import { db } from "/components/firebase-config.js";
/**
 * =============================================
 *          GERENCIADOR DE PORTFÓLIO (com Firebase)
 * =============================================
 *
 * Responsável pelo carregamento dinâmico e
 * renderização de projetos e certificados do Firestore
 *
 * Funcionalidades principais:
 * 1. Carregamento assíncrono de dados do Firestore
 * 2. Renderização de cards responsivos
 * 3. Sistema de filtragem Isotope
 * 4. Tratamento de erros robusto
 */

// Configurações globais (agora com configuração do Firebase)
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
  // Métodos privados (agora usando o Firebase)
  const _fetchFirestoreData = async (collectionName) => {
    try {
      const querySnapshot = await db.collection(collectionName).get();
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(
        `Erro ao buscar dados do Firestore: ${collectionName}`,
        error
      );
      throw error;
    }
  };

  // Interface pública
  return {
    /**
     * Inicializa o portfólio
     */
    init: async function () {
      try {
        await this.loadProjects();
        await this.loadCertificates();
        this.initFilters();
      } catch (error) {
        this.handleError("geral", error);
      }
    },

    /**
     * Carrega e renderiza projetos do Firestore
     */
    loadProjects: async function () {
      try {
        const projects = await _fetchFirestoreData("projetos");
        this.renderProjects(projects);
      } catch (error) {
        throw error;
      }
    },

    /**
     * Carrega e renderiza certificados do Firestore
     */
    loadCertificates: async function () {
      try {
        const certificates = await _fetchFirestoreData("certificados");
        this.renderCertificates(certificates);
      } catch (error) {
        throw error;
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
                      style="height: 250px; object-fit: contain; background-color: #e5e5e5;"
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
     * Manipulador global de erros (refatorado para melhor clareza)
     */
    handleError: function (context, error) {
      console.error(`[${context.toUpperCase()}]`, error);
      const container = document.querySelector(`#${context}-error`); // Usa um container de erro específico

      if (!container) {
        console.warn("Container de erro não encontrado.");
        return;
      }

      container.innerHTML = `
        <div class="alert alert-danger">
          <i class="fa fa-exclamation-triangle"></i>
          Erro ao carregar ${context}: ${error.message}
        </div>
      `;
    },
  };
})();
