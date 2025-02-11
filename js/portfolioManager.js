// =============================================
//  GERENCIADOR DE PORTFÓLIO
// =============================================

// Responsável pelo carregamento dinâmico e
// renderização de projetos e certificados

// Funcionalidades principais:
// 1. Carregamento assíncrono de dados
// 2. Renderização de cards responsivos
// 3. Sistema de filtragem Isotope
// 4. Tratamento de erros robusto

// Configurações globais
const PORTFOLIO_MANAGER = (() => {
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
    classes: {
      projectItem: "col-lg-4 col-md-6 all",
      certificateItem: "col-lg-3 col-md-4 col-sm-6 mb-4",
    },
    settings: {
      imageLoadDelay: 150,
      animationDuration: 600,
      hoverIntentDelay: 100,
    },
  };

  // Métodos privados
  const _fetchData = async (endpoint) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Falha no fetch: ${endpoint}`, error);
      throw error;
    }
  };

  const _createElement = (html) => {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild;
  };

  const _animateElement = (element, animationClass) => {
    element.classList.add(animationClass);
    setTimeout(
      () => element.classList.remove(animationClass),
      CONFIG.settings.animationDuration
    );
  };

  // Interface pública
  return {
    init: function () {
      this.loadProjects()
        .then(() => this.initFilters())
        .catch((error) => this.handleError("projetos", error));

      this.loadCertificates().catch((error) =>
        this.handleError("certificados", error)
      );

      this.initHoverEffects();
    },

    async loadProjects() {
      try {
        const data = await _fetchData(CONFIG.endpoints.projetos);
        this.renderProjects(data.projetos);
      } catch (error) {
        throw new Error(`Falha no carregamento de projetos: ${error.message}`);
      }
    },

    async loadCertificates() {
      try {
        const data = await _fetchData(CONFIG.endpoints.certificados);
        this.renderCertificates(data.certificados);
      } catch (error) {
        throw new Error(
          `Falha no carregamento de certificados: ${error.message}`
        );
      }
    },

    renderProjects(projects) {
      const container = document.querySelector(CONFIG.selectors.projetos);
      container.innerHTML = "";

      projects.forEach((project) => {
        const projectHTML = `
                  <div class="${CONFIG.classes.projectItem} ${
          project.categoria || ""
        }">
                      <div class="portfolio_box">
                          <div class="single_portfolio">
                              <img src="${project.imagem}" 
                                   alt="${project.titulo}"
                                   loading="lazy"
                                   style="opacity:0; transition: opacity 0.6s ease"
                                   onload="setTimeout(() => this.style.opacity = 1, ${
                                     CONFIG.settings.imageLoadDelay
                                   })"
                                   onerror="this.style.display='none'">
                              <div class="overlay"></div>
                              <div class="img-gal">
                                  <span class="icon lnr lnr-cross"></span>
                                  <span>Ver Detalhes</span>
                              </div>
                          </div>
                          <div class="short_info">
                              <h4>${project.titulo}</h4>
                              <p>${project.descricao}</p>
                              <div class="d-flex flex-wrap">
                                  ${(project.links || [])
                                    .map(
                                      (link) => `
                                      <a href="${link.url}" 
                                         target="_blank" 
                                         rel="noopener"
                                         class="btn-link"
                                         onmouseenter="_animateElement(this, 'animate__tada')">
                                         <i class="fa fa-${
                                           link.icone || "external-link"
                                         } mr-2"></i>${link.texto}
                                      </a>
                                  `
                                    )
                                    .join("")}
                              </div>
                          </div>
                      </div>
                  </div>
              `;
        container.appendChild(_createElement(projectHTML));
      });
    },

    renderCertificates(certificates) {
      const container = document.querySelector(CONFIG.selectors.certificados);
      container.innerHTML = "";

      certificates.forEach((cert) => {
        const certHTML = `
                  <div class="${CONFIG.classes.certificateItem}">
                      <div class="card h-100" 
                           onmouseenter="_animateElement(this, 'animate__pulse')">
                          <div class="certificate-image-container">
                              <img src="${cert.imagem}" 
                                   class="card-img-top" 
                                   alt="${cert.titulo}"
                                   loading="lazy"
                                   style="opacity:0; transition: opacity 0.6s ease"
                                   onload="setTimeout(() => this.style.opacity = 1, ${
                                     CONFIG.settings.imageLoadDelay
                                   })"
                                   onerror="this.style.display='none'">
                          </div>
                          <div class="card-body text-center">
                              <h5 class="card-title mb-0">${cert.titulo}</h5>
                              ${
                                cert.emissor
                                  ? `<p class="text-muted mt-2 mb-0">${cert.emissor}</p>`
                                  : ""
                              }
                          </div>
                      </div>
                  </div>
              `;
        container.appendChild(_createElement(certHTML));
      });
    },

    initFilters() {
      const grid = document.querySelector(CONFIG.selectors.isotopeGrid);
      if (!grid || !window.Isotope) return;

      const iso = new Isotope(grid, {
        itemSelector: ".col-lg-4",
        layoutMode: "masonry",
        masonry: { columnWidth: ".col-lg-4" },
        transitionDuration: "0.6s",
      });

      document
        .querySelectorAll(CONFIG.selectors.filterButtons)
        .forEach((button) => {
          button.addEventListener("click", () => {
            document
              .querySelector(`${CONFIG.selectors.filterButtons}.active`)
              ?.classList.remove("active");
            button.classList.add("active");
            iso.arrange({ filter: button.dataset.filter });
          });
        });
    },

    initHoverEffects() {
      let hoverTimeout;

      document.querySelectorAll(".portfolio_box, .card").forEach((element) => {
        element.addEventListener("mouseenter", () => {
          hoverTimeout = setTimeout(() => {
            element.style.transform = "translateY(-8px)";
          }, CONFIG.settings.hoverIntentDelay);
        });

        element.addEventListener("mouseleave", () => {
          clearTimeout(hoverTimeout);
          element.style.transform = "translateY(0)";
        });
      });
    },

    handleError(context, error) {
      console.error(`[${context.toUpperCase()}]`, error);
      const container = document.querySelector(CONFIG.selectors[context]);

      if (container) {
        container.innerHTML = `
                  <div class="col-12 text-center py-5">
                      <div class="alert alert-danger animate__animated animate__shakeX">
                          <i class="fa fa-exclamation-triangle"></i>
                          Erro ao carregar ${context}
                          ${
                            error.message
                              ? `<br><small>${error.message}</small>`
                              : ""
                          }
                      </div>
                  </div>`;
      }
    },
  };
})();

// Inicialização
document.addEventListener("DOMContentLoaded", () => PORTFOLIO_MANAGER.init());
