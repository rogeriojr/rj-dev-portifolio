// Função para carregar dados dos JSONs
async function carregarDados() {
  try {
    console.log("🔄 Buscando dados dos JSONs...");

    // Altere para caminhos relativos
    const [projetosRes, certificadosRes] = await Promise.all([
      fetch("json/projetos/desenvolvimento.json"),
      fetch("json/certificados/certificados.json"),
    ]);

    if (!projetosRes.ok || !certificadosRes.ok) {
      throw new Error(`Erro ao carregar JSONs: 
              Projetos: ${projetosRes.status}, 
              Certificados: ${certificadosRes.status}`);
    }

    const projetos = await projetosRes.json();
    const certificados = await certificadosRes.json();

    console.log("📂 JSON carregado com sucesso!");
    console.log("🗂 Projetos:", projetos);
    console.log("🎖 Certificados:", certificados);

    return {
      projetos: projetos.projetos || projetos,
      certificados: certificados.certificados || certificados,
    };
  } catch (error) {
    console.error("❌ Erro ao carregar dados:", error);
    return { projetos: [], certificados: [] }; // Retorna arrays vazios para evitar erro
  }
}

// Função para renderizar projetos na página
async function renderizarProjetos() {
  console.log("🔄 Iniciando renderização de projetos...");

  const dados = await carregarDados();

  const container = document.getElementById("projetos-container");
  if (!container) {
    console.error("❌ ERRO: Elemento `#projetos-container` não encontrado!");
    return;
  }

  container.innerHTML = ""; // Limpa antes de adicionar novos itens

  if (!Array.isArray(dados.projetos) || dados.projetos.length === 0) {
    console.warn("⚠ Nenhum projeto encontrado.");
    return;
  }

  dados.projetos.forEach((projeto, index) => {
    console.log(`🖼 Adicionando projeto [${index}]: ${projeto.titulo}`);

    const projetoDiv = document.createElement("div");
    projetoDiv.classList.add("col-lg-4", "col-md-6", "all", projeto.categoria);
    projetoDiv.innerHTML = `
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
                  ${(projeto.links || [])
                    .map(
                      (link) =>
                        `<p><a href="${link.url}" target="_blank">${link.texto}</a></p>`
                    )
                    .join("")}
              </div>
          </div>
      `;
    container.appendChild(projetoDiv);
  });

  console.log("✅ Projetos renderizados com sucesso!");
}

// Função para renderizar certificados na página
async function renderizarCertificados() {
  console.log("🔄 Iniciando renderização de certificados...");

  const dados = await carregarDados();

  const container = document.getElementById("certificados-container");
  if (!container) {
    console.error(
      "❌ ERRO: Elemento `#certificados-container` não encontrado!"
    );
    return;
  }

  container.innerHTML = ""; // Limpa antes de adicionar novos itens

  if (!Array.isArray(dados.certificados) || dados.certificados.length === 0) {
    console.warn("⚠ Nenhum certificado encontrado.");
    return;
  }

  dados.certificados.forEach((cert, index) => {
    console.log(`🎖 Adicionando certificado [${index}]: ${cert.titulo}`);

    const certDiv = document.createElement("div");
    certDiv.classList.add("col-md-4");
    certDiv.style.marginTop = "10px";
    certDiv.innerHTML = `
          <div class="card">
              <img src="${cert.imagem}" class="card-img-top" alt="${cert.titulo}">
              <div class="card-body">
                  <h5 class="card-title">${cert.titulo}</h5>
              </div>
          </div>
      `;
    container.appendChild(certDiv);
  });

  console.log("✅ Certificados renderizados com sucesso!");
}

// Inicializa os projetos e certificados ao carregar a página
// Remova o event listener DOMContentLoaded
// document.addEventListener("DOMContentLoaded", () => {

// Exporte as funções para acesso externo
window.portfolioManager = {
  init: function () {
    console.log("✅ portfolioManager.js inicializado!");
    this.renderizarProjetos();
    this.renderizarCertificados();
  },
  renderizarProjetos: renderizarProjetos,
  renderizarCertificados: renderizarCertificados,
};

// Chame init automaticamente apenas se carregado diretamente
if (document.getElementById("projetos-container")) {
  window.portfolioManager.init();
}
