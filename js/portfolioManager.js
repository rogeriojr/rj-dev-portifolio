import { db } from "/components/firebase-config.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.24.1/firebase-firestore-compat.js";

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
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      throw error;
    }
  };

  return {
    init: async function () {
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
