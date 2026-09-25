"use client";

import React, { useState } from "react";
import ProductQuickviewModal, { ProductDetail } from "@/components/ProductQuickviewModal";
import { useStore } from "@/lib/store";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";

export default function HoneyBoutiqueSection() {
  const { products } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCart();

  const handleOpenDetail = (prod: Product) => {
    const photos = prod.images || [];
    const mainImage = photos[0] || prod.image || prod.foto1 || "/images/hero-bottle.jpg";
    const detail: ProductDetail = {
      id: prod.id,
      title: prod.name || prod.title || "Mel de Tiúba",
      subtitle: prod.subtitle || prod.concept || "",
      price: prod.promo_price || prod.price,
      image: mainImage,
      foto1: photos[0] || prod.foto1 || prod.image || "",
      foto2: photos[1] || "",
      foto3: photos[2] || "",
      foto4: photos[3] || "",
      images: photos,
      volume: prod.volume || "150 ml (5.07 fl oz)",
      safra: "2026",
      origem: prod.biome || "Bioma Amazônia",
      especie: prod.bee_species || "Melipona fasciculata",
      sensorial: prod.characteristics || [
        prod.sensory_profile?.aroma,
        prod.sensory_profile?.flavor,
        prod.sensory_profile?.texture,
      ].filter(Boolean) as string[],
      harmonizacao: [
        "Queijos de massa mole (Brie, Camembert)",
        "Finalização de pratos e pescados",
        "Degustação pura com colher de madrepérola",
      ],
      descricao: prod.description || prod.subtitle || "",
    };
    setSelectedProduct(detail);
    setIsModalOpen(true);
  };

  return (
    <section className="py-16">
      {/* Cabeçalho da Seção */}
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center space-y-3">
        <span className="text-[11px] tracking-[0.25em] uppercase text-[#d6b26d] font-semibold block">
          Coleção Botânica Exclusiva
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#fcf9f2] font-normal">
          Boutique do Mel Tiúba Reserve
        </h2>
        <p className="text-xs sm:text-sm text-[#a89a85] max-w-xl mx-auto italic">
          Quatro expressões singulares da floresta amazônica em frascos colecionáveis de 150ml.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {products.map((prod) => {
          const mainImage = prod.images?.[0] || prod.image || prod.foto1 || "/images/hero-bottle.jpg";
          const title = prod.name || prod.title || "Mel de Tiúba";
          const price = prod.promo_price || prod.price || 0;
          const subtitle = prod.subtitle || prod.concept || "";
          const volume = prod.volume || "150 ml";
          const origem = prod.biome || "Bioma Amazônia";

          return (
            <div
              key={prod.id}
              className="bg-[#110e0b] border border-[#2b2318] hover:border-[#c5a059]/60 transition-all rounded p-4 flex flex-col justify-between group shadow-lg"
            >
              {/* Clique na Imagem abre o Quickview */}
              <div
                onClick={() => handleOpenDetail(prod)}
                className="cursor-pointer overflow-hidden rounded relative aspect-square flex items-center justify-center bg-[#070605]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mainImage}
                  alt={title}
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 max-h-full max-w-full"
                />
                <span className="absolute bottom-2 right-2 bg-black/70 text-[#d6b26d] text-[10px] px-2 py-0.5 rounded border border-[#382d1e] opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver Detalhes
                </span>
              </div>

              {/* Informações */}
              <div className="mt-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-[#9e917d] uppercase tracking-wider block">
                    {origem}
                  </span>
                  <h3
                    onClick={() => handleOpenDetail(prod)}
                    className="text-base font-serif text-[#fcf8f2] cursor-pointer hover:text-[#d6b26d] transition-colors mt-1"
                  >
                    {title}
                  </h3>
                  <p className="text-xs text-[#a89a85] italic mt-1 line-clamp-2">
                    {subtitle}
                  </p>
                </div>

                {/* Preço e Botão Comprar */}
                <div className="mt-4 pt-3 border-t border-[#231d14] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8e816f] uppercase block">{volume}</span>
                    <span className="text-base font-serif font-bold text-[#e5be70]">
                      R$ {price.toFixed(2).replace(".", ",")}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      addItem({
                        id: prod.id,
                        title: title,
                        price: price,
                        image: mainImage,
                        volume: volume,
                      })
                    }
                    className="bg-[#c5a059] hover:bg-[#d6b26d] text-black font-semibold text-xs py-2 px-3.5 rounded uppercase tracking-wider transition-all"
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Render do Modal */}
      <ProductQuickviewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
