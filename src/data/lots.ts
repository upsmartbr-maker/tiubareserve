export interface LotData {
  id: string; // Ex: TR-BF-001
  safra: string;
  tipoMel: string;
  origemTerritorial: string;
  produtorGuardiao: string;
  dataEnvase: string;
  certidaoLaudo: string;
  perfilFloral: string;
  garantiaPureza: string;
  umidadeNatural: string;
  acidezLivre: string;
  abelhaProdutora: string;
  statusLaudo: "Aprovado" | "Em Análise" | "Reservado";
}

export const INITIAL_LOTS: LotData[] = [
  {
    id: "TR-BF-001",
    safra: "2026",
    tipoMel: "Mel de Tiúba Bifloral",
    origemTerritorial: "Reserva Extrativista da Baixada Maranhense / Amazônia",
    produtorGuardiao: "Mestre Meliponicultor Raimundo Nonato & Comunidade Guardiã",
    dataEnvase: "18/02/2026",
    certidaoLaudo: "CERT-BIO-AMZ-2026-0881",
    perfilFloral: "Predominância Botânica: Florada A (Pequizeiro da Mata) + Florada B (Ipê-Amarelo Silvestre)",
    garantiaPureza: "100% Puro Mel de Abelha Sem Ferrão Melipona fasciculata - Sem Aquecimento e Sem Adulterantes",
    umidadeNatural: "25.1%",
    acidezLivre: "41.2 MEQ/KG",
    abelhaProdutora: "Melipona fasciculata",
    statusLaudo: "Aprovado",
  },
  {
    id: "AM-2026-001",
    safra: "2026",
    tipoMel: "Mel de Tiúba do Amazonas Grand Cru",
    origemTerritorial: "Floresta Amazônica Primária (AM)",
    produtorGuardiao: "Cooperativa Agroextrativista Rio Urubu",
    dataEnvase: "05/03/2026",
    certidaoLaudo: "CERT-BIO-AMZ-2026-0912",
    perfilFloral: "Polifonia botânica de copas altas amazónicas",
    garantiaPureza: "100% Mel Cru Orgânico Certificado",
    umidadeNatural: "24.6%",
    acidezLivre: "38.5 MEQ/KG",
    abelhaProdutora: "Melipona fasciculata",
    statusLaudo: "Aprovado",
  },
];
