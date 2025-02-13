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
    projectItem: "col-lg-4 col-md-6 all",
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
      try {
        const projects = await _fetchFirestoreData("projetos");
        this.renderProjects(projects);
      } catch (error) {
        throw error;
      }
    },

    loadCertificates: async function () {
      try {
        const certificates = await _fetchFirestoreData("certificados");
        this.renderCertificates(certificates);
      } catch (error) {
        throw error;
      }
    },

    renderProjects: function (projects) {
      const container = document.querySelector(
        PORTFOLIO_CONFIG.selectors.projetos
      );
      if (!container) {
        console.error("❌ ERRO: Container de projetos não encontrado!");
        return;
      }
      console.log("🎨 Renderizando projetos...", projects);
      container.innerHTML = projects
        .map(
          (project) => `
              <div class="${PORTFOLIO_CONFIG.classes.projectItem}">
                  <div class="portfolio_box" 
                       style="background: white; border-radius: 12px; padding: 15px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                      <div class="single_portfolio" 
                           style="background: #cec0f5; border-radius: 8px; padding: 10px;">
                          <img src="${project.imagem}" alt="${project.titulo}" 
                               style="height: 250px; width: 100%; object-fit: contain; border-radius: 8px;">
                      </div>

                      <div class="short_info" style="padding: 10px;">
                          <h4 style="color: #cec0f5; font-size: 20px; margin-bottom: 5px;">${
                            project.titulo
                          }</h4>
                          <p style="color: #333; font-size: 14px;">${
                            project.descricao
                          }</p>
                          <div style="margin-top: auto;">
                          ${
                            project.links && project.links.length > 0
                              ? project.links
                                  .map(
                                    (link) => `
                                    <a href="${link.url}" target="_blank" 
                                       style="display: inline-block; margin: 5px; padding: 8px 15px; 
                                              background: #6f42c1; color: white; border-radius: 6px; 
                                              text-decoration: none; transition: 0.3s;">
                                        <i class="fa fa-external-link"></i>🔗 ${link.texto}
                                    </a>
                                `
                                  )
                                  .join("")
                              : `  <a href="${project.link}" target="_blank" 
                              style="display: inline-block; margin-top: 8px; padding: 8px 15px; background: #6f42c1; color: white; border-radius: 6px; text-decoration: none; transition: 0.3s;">
                               🔗 Ver Projeto
                           </a>`
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
                  <div class="card h-100" 
                       style="background: white; border-radius: 12px; padding: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                      <div style="background: #cec0f5; border-radius: 8px; padding: 10px;">
                          <img src="${cert.imagem}" class="card-img-top" 
                               alt="${cert.titulo}" style="height: 200px; width: 100%; object-fit: contain; border-radius: 8px;">
                      </div>
                      <div class="card-body">
                          <h5 class="card-title" style="color: #6f42c1;">${cert.titulo}</h5>
                          <a href="${cert.link}" target="_blank" 
                             style="display: inline-block; margin-top: 5px; padding: 8px 15px; background: #6f42c1; color: white; border-radius: 6px; text-decoration: none; transition: 0.3s;">
                              📜 Ver Certificado
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
      if (grid && window.Isotope && window.imagesLoaded) {
        window.imagesLoaded(grid, () => {
          new window.Isotope(grid, {
            itemSelector: ".col-lg-4",
            layoutMode: "fitRows",
          });
        });
      }
    },

    handleError: function (context, error) {
      console.error(`[${context}]`, error);
      document.getElementById(`${context}-error`).innerHTML = `
                <div class="alert alert-danger">Erro ao carregar ${context}</div>
            `;
    },
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  portfolioManager.init();
});
