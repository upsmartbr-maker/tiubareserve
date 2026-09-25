"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalCount } =
    useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
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
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fundo escuro com desfoque */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Painel Lateral */}
      <div className="relative w-full max-w-md bg-[#0d0c0a] border-l border-[#332a1e] text-[#f4ecd8] h-full flex flex-col shadow-2xl z-10">
        
        {/* Cabeçalho */}
        <div className="p-6 border-b border-[#282117] flex items-center justify-between">
          <div>
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#d6b26d] block font-semibold">
              Boutique Tiúba Reserve
            </span>
            <h2 className="text-xl font-serif tracking-wide text-[#fcf9f2] mt-1 font-medium">
              Sua Seleção ({totalCount})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-[#c2b6a3] hover:text-white transition-colors rounded-full hover:bg-white/10"
            aria-label="Fechar carrinho"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lista de Produtos */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#221c13]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full border border-[#443828] flex items-center justify-center text-[#d6b26d]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-[#c8bdaf] text-sm">O seu frasco de safra exclusiva ainda não foi selecionado.</p>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 text-xs font-semibold tracking-wider uppercase border border-[#d6b26d]/60 text-[#d6b26d] hover:bg-[#d6b26d]/15 transition-colors"
              >
                Explorar Colheita
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-center">
                {/* Imagem do Produto */}
                <div className="relative w-16 h-16 bg-[#16130f] rounded border border-[#3b3022] overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "/images/hero-bottle.jpg"}
                    alt={item.title}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                {/* Dados do Produto */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-serif font-medium text-[#fcf8f2] tracking-wide truncate">
                      {item.title}
                    </h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#9e907d] hover:text-[#e06666] transition-colors ml-2 p-1"
                      title="Remover frasco"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {item.volume && (
                    <span className="text-[11px] text-[#b8ab96] uppercase tracking-wider block mt-0.5">
                      {item.volume}
                    </span>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    {/* Controlo de Quantidade */}
                    <div className="flex items-center border border-[#3d3222] rounded bg-[#070605]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs text-[#cfc4b2] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs text-[#f5efe3] font-mono font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs text-[#cfc4b2] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Preço Unitário/Total */}
                    <span className="text-base font-serif font-semibold text-[#dfbe76]">
                      R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé e Finalização */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#282117] bg-[#070605] space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#c4b8a5]">
                <span className="font-normal">Frete Especializado Climatizado</span>
                <span className="text-[#48bb78] font-medium tracking-wide">Incluso (Cortesia)</span>
              </div>
              <div className="flex justify-between items-baseline pt-2.5 border-t border-[#221c13]">
                <span className="text-sm font-medium text-[#ded4c3]">Subtotal</span>
                <span className="text-2xl font-serif font-bold text-[#e5be70]">
                  R$ {subtotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                closeCart();
                router.push("/checkout");
              }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9e7d3b] hover:brightness-110 text-black font-semibold text-xs tracking-[0.16em] uppercase rounded transition-all shadow-lg shadow-[#c5a059]/15 active:scale-[0.99]"
            >
              Finalizar Pedido Exclusivo
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#9e917d] pt-1">
              <svg className="w-3.5 h-3.5 text-[#d6b26d] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
              <span>Lacre Termofundido e Certificado de Lote Melissopalinológico</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
