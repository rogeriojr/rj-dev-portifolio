import { db } from "/components/firebase-config.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

const PORTFOLIO_CONFIG = {
  selectors: {
    projetos: "#projetos-container",
    certificados: "#certificados-container",
    isotopeGrid: ".portfolio-grid",
    filterButtons: ".portfolio-filter li",
  },
  classes: {
    projectItem: "col-lg-4 col-md-6 mb-4 all",
    certificateItem: "col-lg-3 col-md-4 col-sm-6 mb-4",
  },
};

export const portfolioManager = (function () {
  const _fetchFirestoreData = async (collectionName) => {
    try {
      console.log(`Buscando dados da coleção: ${collectionName}...`);
      const querySnapshot = await getDocs(collection(db, collectionName));
      if (querySnapshot.empty) {
        console.warn(
          `⚠️ Nenhum documento encontrado na coleção "${collectionName}"`
        );
      } else {
        console.log(
          `✅ Dados recebidos de "${collectionName}":`,
          querySnapshot.docs.map((doc) => doc.data())
        );
      }
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(
        `❌ Erro ao buscar dados da coleção "${collectionName}":`,
        error
      );
      throw error;
    }
  };

  return {
    init: async function () {
      console.log("🚀 Inicializando Portfolio Manager...");
      try {
        await this.loadProjects();
        await this.loadCertificates();
        this.initFilters();
      } catch (error) {
        this.handleError("geral", error);
      }
    },

    loadProjects: async function () {
      const projects = await _fetchFirestoreData("projetos");
      this.renderProjects(projects);
    },

    loadCertificates: async function () {
      const certificates = await _fetchFirestoreData("certificados");
      this.renderCertificates(certificates);
    },

    renderProjects: function (projects) {
      const container = document.querySelector(
        PORTFOLIO_CONFIG.selectors.projetos
      );
      container.innerHTML = projects
        .map(
          (project) => `
        <div class="${PORTFOLIO_CONFIG.classes.projectItem} ${
            project.categoria || "latest"
          }">
          <div class="card h-100 border-0 shadow-lg hover-scale">
            <div class="card-header p-3" style="background: #6f42c1; border-radius: 15px 15px 0 0;">
              <img src="${project.imagem}" alt="${project.titulo}" 
                   class="img-fluid" 
                   style="height: 200px; object-fit: contain; border-radius: 10px;">
            </div>
            <div class="card-body">
              <h5 class="card-title mb-3" style="color: #2d3748; font-weight: 600;">
                ${project.titulo}
              </h5>
              <p class="card-text text-secondary mb-4" style="font-size: 0.9rem;">
                ${project.descricao}
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <a href="${project.link}" target="_blank" 
                   class="btn btn-primary btn-sm px-4 py-2" 
                   style="border-radius: 8px; transition: all 0.3s;">
                  <i class="fa fa-external-link mr-2"></i>Ver Projeto
                </a>
                ${
                  project.repo
                    ? `
                <a href="${project.repo}" target="_blank" 
                   class="btn btn-outline-secondary btn-sm px-3 py-2"
                   style="border-radius: 8px; transition: all 0.3s;">
                  <i class="fa fa-github mr-2"></i>Código
                </a>`
                    : ""
                }
              </div>
            </div>
          </div>
        </div>
      `
        )
        .join("");
    },

    renderCertificates: function (certificates) {
      const container = document.querySelector(
        PORTFOLIO_CONFIG.selectors.certificados
      );
      if (!container) {
        console.error("❌ ERRO: Container de certificados não encontrado!");
        return;
      }
      console.log("🎖 Renderizando certificados...", certificates);
      container.innerHTML = certificates
        .map(
          (cert) => `
        <div class="${PORTFOLIO_CONFIG.classes.certificateItem}">
          <div class="card h-100 border-0 shadow-sm hover-scale">
            <div class="card-img-top overflow-hidden" style="background: #f8f9fa; padding: 20px;">
              <img src="${cert.imagem}" alt="${cert.titulo}" 
                   class="img-fluid" 
                   style="height: 180px; object-fit: contain;">
            </div>
            <div class="card-body text-center">
              <h6 class="card-title mb-3" style="color: #4a5568; font-size: 0.95rem;">
                ${cert.titulo}
              </h6>
              <a href="${cert.link}" target="_blank" 
                 class="btn btn-link text-primary px-3 py-2" 
                 style="text-decoration: none; transition: all 0.3s;">
                <i class="fa fa-certificate mr-2"></i>Ver Credencial
              </a>
            </div>
          </div>
        </div>
      `
        )
        .join("");
    },

    initFilters: function () {
      const grid = document.querySelector(
        PORTFOLIO_CONFIG.selectors.isotopeGrid
      );
      const filters = document.querySelectorAll(
        PORTFOLIO_CONFIG.selectors.filterButtons
      );

      if (grid && window.Isotope) {
        window.imagesLoaded(grid, () => {
          new window.Isotope(grid, {
            itemSelector: `.${
              PORTFOLIO_CONFIG.classes.projectItem.split(" ")[0]
            }`,
            layoutMode: "fitRows",
            percentPosition: true,
          });
        });

        filters.forEach((btn) => {
          btn.addEventListener("click", () => {
            filters.forEach((f) => f.classList.remove("active"));
            btn.classList.add("active");
            const filterValue = btn.getAttribute("data-filter");
            window.Isotope(grid).arrange({ filter: filterValue });
          });
        });
      }
    },

    handleError: function (context, error) {
      console.error(`[${context}]`, error);
      document.getElementById(`${context}-error`).innerHTML = `
        <div class="alert alert-danger mx-3">Erro ao carregar ${context}</div>
      `;
    },
  };
})();

document.addEventListener("DOMContentLoaded", () => portfolioManager.init());
