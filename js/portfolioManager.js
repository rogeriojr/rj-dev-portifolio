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
  // Modifique o método de acesso ao Firestore para usar a sintaxe modular
  const _fetchFirestoreData = async (collectionName) => {
    try {
      console.log(`Buscando dados da coleção: ${collectionName}...`); // 🔍 Log para verificar a chamada
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
        console.error(
          "❌ ERRO: Container de projetos não encontrado! Verifique o seletor."
        );
        return;
      }
      console.log("🎨 Renderizando projetos...", projects);
      container.innerHTML = projects
        .map(
          (project) => `
              <div class="${PORTFOLIO_CONFIG.classes.projectItem}">
                  <div class="portfolio_box">
                      <div class="single_portfolio">
                          <img src="${project.imagem}" alt="${project.titulo}" 
                               style="height: 250px; object-fit: contain;">
                          <div class="overlay"></div>
                      </div>
                      <div class="short_info">
                          <h4>${project.titulo}</h4>
                          <p>${project.descricao}</p>
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
        console.error(
          "❌ ERRO: Container de certificados não encontrado! Verifique o seletor."
        );
        return;
      }
      console.log("🎖 Renderizando certificados...", certificates);
      container.innerHTML = certificates
        .map(
          (cert) => `
              <div class="${PORTFOLIO_CONFIG.classes.certificateItem}">
                  <div class="card h-100">
                      <img src="${cert.imagem}" class="card-img-top" 
                           alt="${cert.titulo}" style="height: 200px; object-fit: cover;">
                      <div class="card-body">
                          <h5 class="card-title">${cert.titulo}</h5>
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
      container.innerHTML = certificates
        .map(
          (cert) => `
                <div class="${PORTFOLIO_CONFIG.classes.certificateItem}">
                    <div class="card h-100">
                        <img src="${cert.imagem}" class="card-img-top" 
                             alt="${cert.titulo}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${cert.titulo}</h5>
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
        // Verifica existência
        window.imagesLoaded(grid, () => {
          // Usa imagesLoaded
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
