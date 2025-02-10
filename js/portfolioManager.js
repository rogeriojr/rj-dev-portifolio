// Função para carregar dados dos JSONs
async function carregarDados() {
  try {
    const [projetosRes, certificadosRes] = await Promise.all([
      fetch("/json/projetos/desenvolvimento.json"),
      fetch("/json/certificados/certificados.json"),
    ]);

    if (!projetosRes.ok || !certificadosRes.ok) {
      throw new Error("Erro ao carregar um dos JSONs");
    }

    const projetos = await projetosRes.json();
    const certificados = await certificadosRes.json();

    console.log("📂 JSON carregado:", projetos, certificados); // Depuração no console

    return {
      projetos: Array.isArray(projetos) ? projetos : projetos.projetos || [],
      certificados: Array.isArray(certificados)
        ? certificados
        : certificados.certificados || [],
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
    console.warn(
      "⚠ Nenhum projeto encontrado ou `dados.projetos` não é um array válido."
    );
    return;
  }

  dados.projetos.forEach((projeto) => {
    console.log("🖼 Adicionando projeto:", projeto.titulo);
    const projetoHTML = `
      <div class="col-lg-4 col-md-6 all ${projeto.categoria}">
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
      </div>
    `;
    container.innerHTML += projetoHTML;
  });
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
    console.warn(
      "⚠ Nenhum certificado encontrado ou `dados.certificados` não é um array válido."
    );
    return;
  }

  dados.certificados.forEach((cert) => {
    console.log("🎖 Adicionando certificado:", cert.titulo);
    const certHTML = `
      <div class="col-md-4" style="margin-top: 10px;">
        <div class="card">
          <img src="${cert.imagem}" class="card-img-top" alt="${cert.titulo}">
          <div class="card-body">
            <h5 class="card-title">${cert.titulo}</h5>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += certHTML;
  });
}

// Inicializa os projetos e certificados ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ portfolioManager.js carregado!");
  console.log("✅ Evento `DOMContentLoaded` acionado!");
  renderizarProjetos();
  renderizarCertificados();
});
