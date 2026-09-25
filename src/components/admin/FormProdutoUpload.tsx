"use client";

import React, { useState, useRef } from "react";

export interface ProductFormData {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
  volume: string;
  origem: string;
}

export interface ProductFormProps {
  initialData?: {
    id?: string;
    title?: string;
    subtitle?: string;
    price?: number;
    image?: string;
    volume?: string;
    origem?: string;
  };
  onSave: (productData: ProductFormData) => void;
  onCancel: () => void;
}

export default function FormProdutoUpload({ initialData, onSave, onCancel }: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || "");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Processar arquivo selecionado ou arrastado
  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione um arquivo de imagem válido (PNG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!imagePreview) {
      alert("Por favor, adicione uma imagem para o frasco de mel.");
      return;
    }

    const payload: ProductFormData = {
      id: (formData.get("id") as string) || initialData?.id || `tiuba-${Date.now()}`,
      title: (formData.get("title") as string) || "",
      subtitle: (formData.get("subtitle") as string) || "",
      price: parseFloat(formData.get("price") as string) || 0,
      image: imagePreview, // Guarda a imagem local carregada (Base64 Data URL)
      volume: (formData.get("volume") as string) || "",
      origem: (formData.get("origem") as string) || "",
    };

    onSave(payload);
  };

  return (
    <div className="bg-[#0e0c09] border border-[#382d1e] rounded-lg p-6 text-[#f4ecd8] max-w-2xl w-full">
      <h3 className="text-xl font-serif text-[#fcf9f2] mb-6">
        {initialData ? "Editar Frasco Tiúba Reserve" : "Cadastrar Novo Frasco de Safra"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* ÁREA DE UPLOAD DO COMPUTADOR */}
        <div>
          <label className="block text-[#a89a85] uppercase tracking-wider mb-2 font-medium">
            Imagem do Frasco (Envio Direto do PC)
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[170px] ${
              isDragging
                ? "border-[#d6b26d] bg-[#1a150e]"
                : "border-[#382d1e] bg-[#130f0b] hover:border-[#d6b26d]/60"
            }`}
          >
            {imagePreview ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-24 h-24 bg-[#070605] border border-[#382d1e] rounded p-2 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Pré-visualização do Frasco"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <span className="text-xs text-[#d6b26d] underline font-medium">
                    Trocar imagem do computador
                  </span>
                  <p className="text-[10px] text-[#8e816f] mt-0.5">
                    Arraste outro arquivo ou clique para selecionar
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full border border-[#382d1e] bg-[#1a140d] mx-auto flex items-center justify-center text-[#d6b26d]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="text-[#ded4c3]">
                  <span className="font-semibold text-[#d6b26d]">Clique para enviar do PC</span> ou arraste a imagem aqui
                </div>
                <p className="text-[10px] text-[#7a6f5e]">PNG, JPG ou WEBP (Recomendado fundo transparente)</p>
              </div>
            )}
          </div>
        </div>

        {/* CAMPOS DE TEXTO DO PRODUTO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#a89a85] uppercase tracking-wider mb-1 font-medium">
              Nome do Produto / Edição
            </label>
            <input
              name="title"
              required
              defaultValue={initialData?.title || ""}
              placeholder="Ex.: Mel de Tiúba Bifloral"
              className="w-full bg-[#14100b] border border-[#332819] rounded p-2.5 text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
            />
          </div>

          <div>
            <label className="block text-[#a89a85] uppercase tracking-wider mb-1 font-medium">
              Preço de Venda (R$)
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              required
              defaultValue={initialData?.price || ""}
              placeholder="198.00"
              className="w-full bg-[#14100b] border border-[#332819] rounded p-2.5 text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#a89a85] uppercase tracking-wider mb-1 font-medium">
            Subtítulo / Descrição Curta
          </label>
          <input
            name="subtitle"
            defaultValue={initialData?.subtitle || ""}
            placeholder="Ex.: Duas floradas, uma identidade singular"
            className="w-full bg-[#14100b] border border-[#332819] rounded p-2.5 text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#a89a85] uppercase tracking-wider mb-1 font-medium">
              Volume / Frasco
            </label>
            <input
              name="volume"
              defaultValue={initialData?.volume || "150 ml (5.07 fl oz)"}
              className="w-full bg-[#14100b] border border-[#332819] rounded p-2.5 text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
            />
          </div>

          <div>
            <label className="block text-[#a89a85] uppercase tracking-wider mb-1 font-medium">
              Origem Territorial
            </label>
            <input
              name="origem"
              defaultValue={initialData?.origem || "Bioma Amazônia Profunda"}
              className="w-full bg-[#14100b] border border-[#332819] rounded p-2.5 text-[#fcf9f2] focus:border-[#d6b26d] outline-none"
            />
          </div>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#261f15]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-[#382d1e] text-[#a89a85] hover:text-white rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#a38038] hover:brightness-110 text-black font-semibold uppercase tracking-wider rounded transition-all shadow-md"
          >
            Salvar Frasco
          </button>
        </div>
      </form>
    </div>
  );
}
