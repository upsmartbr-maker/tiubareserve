"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export interface ProductDetail {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
  foto1?: string;
  foto2?: string;
  foto3?: string;
  foto4?: string;
  images?: string[];
  volume: string;
  safra: string;
  origem: string;
  especie: string;
  sensorial: string[];
  harmonizacao: string[];
  descricao: string;
}

interface ProductQuickviewModalProps {
  product: ProductDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickviewModal({
  product,
  isOpen,
  onClose,
}: ProductQuickviewModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");

  // Resetar quantidade e foto selecionada ao trocar de produto
  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setSelectedPhoto(
        product.foto1 ||
        product.image ||
        (product.images && product.images[0]) ||
        "/images/hero-bottle.jpg"
      );
    }
  }, [isOpen, product]);

  // Fechar com a tecla ESC e travar scroll da página
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: selectedPhoto || product.foto1 || product.image || "/images/hero-bottle.jpg",
        volume: product.volume,
      },
      quantity
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Conteúdo do Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d0c0a] border border-[#382e21] rounded-lg shadow-2xl text-[#f4ecd8] flex flex-col md:flex-row overflow-hidden z-10">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#c2b6a3] hover:text-white rounded-full bg-black/50 hover:bg-black/80 transition-colors"
          aria-label="Fechar detalhes"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Coluna Esquerda: Apresentação Visual */}
        <div className="md:w-5/12 bg-gradient-to-b from-[#14110d] to-[#080705] p-6 sm:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#261f15] relative">
          <div className="absolute top-4 left-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#d6b26d] font-semibold bg-[#211a12] px-2.5 py-1 rounded border border-[#3d311f]">
              Safra {product.safra}
            </span>
          </div>

          <div className="relative w-56 h-64 sm:w-64 sm:h-72 my-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto || product.foto1 || product.image || "/images/hero-bottle.jpg"}
              alt={product.title}
              className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
            />
          </div>

          {/* Miniaturas de Fotos do Produto */}
          <div className="flex gap-2 mt-1 mb-4">
            {/* Agrupa as fotos e remove qualquer item vazio, nulo ou indefinido */}
            {[
              product.foto1 || product.images?.[0] || product.image,
              product.foto2 || product.images?.[1],
              product.foto3 || product.images?.[2],
              product.foto4 || product.images?.[3],
            ]
              .filter((foto): foto is string => Boolean(foto && foto.trim() !== ""))
              .map((fotoUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPhoto(fotoUrl)}
                  className={`relative w-14 h-14 rounded border overflow-hidden transition-all ${
                    selectedPhoto === fotoUrl
                      ? "border-[#d6b26d] scale-105"
                      : "border-[#2c2317] hover:border-[#8e816f]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoUrl}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-contain bg-[#0c0a08] p-1"
                  />
                </button>
              ))}
          </div>

          <span className="text-[11px] uppercase tracking-[0.2em] text-[#b8ab96]">
            {product.volume} • Frasco Colecionador
          </span>
        </div>

        {/* Coluna Direita: Curadoria & Ficha do Sommelier */}
        <div className="md:w-7/12 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#d6b26d] font-semibold">
                Curadoria Gastronômica Tiúba Reserve
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#fcf9f2] font-normal mt-1">
                {product.title}
              </h2>
              <p className="text-xs text-[#a89a85] italic tracking-wide mt-1">
                {product.subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#ded4c3] leading-relaxed">
              {product.descricao}
            </p>

            {/* Notas Sensoriais */}
            <div className="pt-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d6b26d] mb-2 flex items-center gap-1.5">
                <span>✦</span> Perfil Sensorial
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.sensorial.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-[#191510] text-[#ded4c3] border border-[#382d1e] px-3 py-1 rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Harmonização */}
            <div className="pt-1">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d6b26d] mb-2 flex items-center gap-1.5">
                <span>✦</span> Harmonização Sugerida
              </h4>
              <ul className="text-xs text-[#c4b8a5] space-y-1 list-disc list-inside">
                {product.harmonizacao.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Especificações Rápidas */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#231d14] text-[11px]">
              <div>
                <span className="text-[#8e816f] block uppercase tracking-wider">Abelha Nativa</span>
                <span className="text-[#ded4c3] font-medium italic">{product.especie}</span>
              </div>
              <div>
                <span className="text-[#8e816f] block uppercase tracking-wider">Origem Territorial</span>
                <span className="text-[#ded4c3] font-medium">{product.origem}</span>
              </div>
            </div>
          </div>

          {/* Área de Preço e Ação */}
          <div className="pt-4 border-t border-[#2a2217] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#a89a85] block">
                  Valor Unitário
                </span>
                <span className="text-2xl font-serif font-bold text-[#e5be70]">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
              </div>

              {/* Seletor de Quantidade */}
              <div className="flex items-center border border-[#3d3222] rounded bg-[#070605]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-xs text-[#cfc4b2] hover:text-white hover:bg-white/5 transition-colors"
                >
                  -
                </button>
                <span className="px-3 text-xs text-[#f5efe3] font-mono font-medium">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-xs text-[#cfc4b2] hover:text-white hover:bg-white/5 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9e7d3b] hover:brightness-110 text-black font-semibold text-xs tracking-[0.16em] uppercase rounded transition-all shadow-lg shadow-[#c5a059]/15 active:scale-[0.99]"
            >
              Adicionar ao Pedido • R$ {(product.price * quantity).toFixed(2).replace(".", ",")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
