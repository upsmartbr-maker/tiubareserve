"use client";

import React, { useState } from "react";
import { INITIAL_LOTS, LotData } from "@/data/lots";

export default function GestorLotes() {
  const [lots, setLots] = useState<LotData[]>(INITIAL_LOTS);
  const [selectedLot, setSelectedLot] = useState<LotData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updated: LotData = {
      id: formData.get("id") as string,
      safra: formData.get("safra") as string,
      tipoMel: formData.get("tipoMel") as string,
      origemTerritorial: formData.get("origemTerritorial") as string,
      produtorGuardiao: formData.get("produtorGuardiao") as string,
      dataEnvase: formData.get("dataEnvase") as string,
      certidaoLaudo: formData.get("certidaoLaudo") as string,
      perfilFloral: formData.get("perfilFloral") as string,
      garantiaPureza: formData.get("garantiaPureza") as string,
      umidadeNatural: formData.get("umidadeNatural") as string,
      acidezLivre: formData.get("acidezLivre") as string,
      abelhaProdutora: "Melipona fasciculata",
      statusLaudo: "Aprovado",
    };

    setLots((prev) => {
      const exists = prev.some((l) => l.id === updated.id);
      if (exists) {
        return prev.map((l) => (l.id === updated.id ? updated : l));
      }
      return [updated, ...prev];
    });

    setIsEditing(false);
    setSelectedLot(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-[#282117]">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#d6b26d] font-semibold">
            Certificação & Rastreabilidade
          </span>
          <h2 className="text-2xl font-serif text-[#fcf9f2] mt-1">Gestor de Lotes e Laudos Físico-Químicos</h2>
        </div>
        <button
          onClick={() => {
            setSelectedLot(null);
            setIsEditing(true);
          }}
          className="px-4 py-2.5 bg-[#d6b26d] hover:bg-[#e5be70] text-black text-xs font-semibold uppercase tracking-wider rounded transition-colors"
        >
          + Novo Lote de Safra
        </button>
      </div>

      {/* Lista de Lotes Cadastrados */}
      <div className="border border-[#261f15] bg-[#0c0a08] rounded overflow-hidden">
        <table className="w-full text-left text-xs text-[#ded4c3]">
          <thead className="bg-[#14100b] text-[#a89a85] uppercase tracking-wider border-b border-[#261f15]">
            <tr>
              <th className="p-4">Código / Lacre</th>
              <th className="p-4">Mel / Variedade</th>
              <th className="p-4">Safra / Envase</th>
              <th className="p-4">Nº Laudo</th>
              <th className="p-4">Humidade</th>
              <th className="p-4">Acidez</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c160f]">
            {lots.map((lot) => (
              <tr key={lot.id} className="hover:bg-[#120f0c] transition-colors">
                <td className="p-4 font-mono font-medium text-[#d6b26d]">{lot.id}</td>
                <td className="p-4 font-serif text-[#fcf8f2]">{lot.tipoMel}</td>
                <td className="p-4">{lot.safra} ({lot.dataEnvase})</td>
                <td className="p-4 font-mono text-[#a89a85]">{lot.certidaoLaudo}</td>
                <td className="p-4 text-[#d6b26d]">{lot.umidadeNatural}</td>
                <td className="p-4">{lot.acidezLivre}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#1a2e22] text-[#48bb78] border border-[#234d34]">
                    {lot.statusLaudo}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedLot(lot);
                      setIsEditing(true);
                    }}
                    className="text-[#d6b26d] hover:text-white underline text-xs ml-2"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal / Formulário de Criação e Edição de Lote */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e0c09] border border-[#382d1e] max-w-2xl w-full p-6 rounded-lg text-[#f4ecd8] max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-serif text-[#fcf9f2] mb-4">
              {selectedLot ? `Editar Lote ${selectedLot.id}` : "Cadastrar Novo Lote de Safra"}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a89a85] uppercase tracking-wider mb-1">Código do Lote (Lacre)</label>
                  <input
                    name="id"
                    defaultValue={selectedLot?.id || ""}
                    placeholder="Ex: TR-BF-002"
                    required
                    className="w-full bg-[#16120e] border border-[#382d1e] p-2.5 rounded text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#a89a85] uppercase tracking-wider mb-1">Safra</label>
                  <input
                    name="safra"
                    defaultValue={selectedLot?.safra || "2026"}
                    required
                    className="w-full bg-[#16120e] border border-[#382d1e] p-2.5 rounded text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a89a85] uppercase tracking-wider mb-1">Nome do Mel</label>
                <input
                  name="tipoMel"
                  defaultValue={selectedLot?.tipoMel || ""}
                  placeholder="Ex: Mel de Tiúba Multifloral"
                  required
                  className="w-full bg-[#16120e] border border-[#382d1e] p-2.5 rounded text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a89a85] uppercase tracking-wider mb-1">Data de Envase</label>
                  <input
                    name="dataEnvase"
                    defaultValue={selectedLot?.dataEnvase || "25/09/2026"}
                    className="w-full bg-[#16120e] border border-[#382d1e] p-2.5 rounded text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#a89a85] uppercase tracking-wider mb-1">Certidão / Laudo Nº</label>
                  <input
                    name="certidaoLaudo"
                    defaultValue={selectedLot?.certidaoLaudo || "CERT-BIO-AMZ-2026-XXXX"}
                    className="w-full bg-[#16120e] border border-[#382d1e] p-2.5 rounded text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a89a85] uppercase tracking-wider mb-1">Humidade Natural (%)</label>
                  <input
                    name="umidadeNatural"
                    defaultValue={selectedLot?.umidadeNatural || "24.8%"}
                    className="w-full bg-[#16120e] border border-[#382d1e] p-2.5 rounded text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#a89a85] uppercase tracking-wider mb-1">Acidez Livre (MEQ/KG)</label>
                  <input
                    name="acidezLivre"
                    defaultValue={selectedLot?.acidezLivre || "40.0 MEQ/KG"}
                    className="w-full bg-[#16120e] border border-[#382d1e] p-2.5 rounded text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a89a85] uppercase tracking-wider mb-1">Origem Territorial</label>
                <input
                  name="origemTerritorial"
                  defaultValue={selectedLot?.origemTerritorial || ""}
                  className="w-full bg-[#16120e] border border-[#382d1e] p-2.5 rounded text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a89a85] uppercase tracking-wider mb-1">Mestre Meliponicultor / Comunidade</label>
                <input
                  name="produtorGuardiao"
                  defaultValue={selectedLot?.produtorGuardiao || ""}
                  className="w-full bg-[#16120e] border border-[#382d1e] p-2.5 rounded text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a89a85] uppercase tracking-wider mb-1">Predominância Botânica</label>
                <textarea
                  name="perfilFloral"
                  rows={2}
                  defaultValue={selectedLot?.perfilFloral || ""}
                  className="w-full bg-[#16120e] border border-[#382d1e] p-2.5 rounded text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a89a85] uppercase tracking-wider mb-1">Garantia de Pureza</label>
                <input
                  name="garantiaPureza"
                  defaultValue={selectedLot?.garantiaPureza || "100% Puro Mel de Abelha Sem Ferrão Melipona fasciculata"}
                  className="w-full bg-[#16120e] border border-[#382d1e] p-2.5 rounded text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#261f15]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-[#382d1e] text-[#a89a85] hover:text-white rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d6b26d] text-black font-semibold uppercase tracking-wider rounded hover:bg-[#e5be70]"
                >
                  Salvar Lote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
