"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalCount } =
    useCart();

  // Fechar no ESC
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
      {/* Backdrop com desfoque */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#0c0c0b] border-l border-[#2a241b] text-[#f4ecd8] h-full flex flex-col shadow-2xl z-10">
        
        {/* Header */}
        <div className="p-6 border-b border-[#221c14] flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#c5a059] block font-medium">
              Boutique Tiúba Reserve
            </span>
            <h2 className="text-xl font-serif tracking-wide text-[#f7f2e7] mt-0.5">
              Sua Seleção ({totalCount})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-[#9f9483] hover:text-[#e8d7b5] transition-colors rounded-full hover:bg-white/5"
            aria-label="Fechar carrinho"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lista de Itens */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#1e1913]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full border border-[#30271c] flex items-center justify-center text-[#c5a059]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-[#a49784] text-sm">Seu frasco de safra exclusiva ainda não foi selecionado.</p>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 text-xs font-semibold tracking-wider uppercase border border-[#c5a059]/40 text-[#c5a059] hover:bg-[#c5a059]/10 transition-colors"
              >
                Explorar Colheita
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-center">
                {/* Imagem */}
                <div className="relative w-16 h-16 bg-[#15120e] rounded border border-[#2e261b] overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "/images/hero-bottle.jpg"}
                    alt={item.title}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                {/* Detalhes */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-serif text-[#f2ece1] truncate">{item.title}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#7e7362] hover:text-[#d35b5b] transition-colors ml-2"
                      title="Remover frasco"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  {item.volume && (
                    <span className="text-[10px] text-[#918572] uppercase tracking-wider block">
                      {item.volume}
                    </span>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    {/* Controle Qtd */}
                    <div className="flex items-center border border-[#2d251a] rounded bg-[#070605]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-[#9f9483] hover:text-[#f4ecd8]"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs text-[#d8cfbe] font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-[#9f9483] hover:text-[#f4ecd8]"
                      >
                        +
                      </button>
                    </div>
                    {/* Preço */}
                    <span className="text-sm font-serif text-[#d6b26d]">
                      R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#221c14] bg-[#080706] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#8f826f]">
                <span>Frete Especializado Climatizado</span>
                <span className="text-[#38a169]">Incluso (Cortesia)</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#1e1913]">
                <span className="text-sm font-medium text-[#c0b5a3]">Subtotal</span>
                <span className="text-xl font-serif font-bold text-[#e5be70]">
                  R$ {subtotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                closeCart();
                router.push("/checkout");
              }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9e7d3b] hover:brightness-110 text-black font-semibold text-xs tracking-[0.15em] uppercase rounded transition-all shadow-lg shadow-[#c5a059]/10 active:scale-[0.99]"
            >
              Finalizar Pedido Exclusivo
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#6d6353]">
              <svg className="w-3.5 h-3.5 text-[#c5a059]" fill="currentColor" viewBox="0 0 20 20">
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
