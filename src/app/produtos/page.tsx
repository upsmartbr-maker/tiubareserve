'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { 
  Sparkles, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  FlaskConical, 
  Compass, 
  Droplets,
  ArrowRight
} from 'lucide-react';

export default function ProductsPage() {
  const { products, addToCart, t } = useStore();
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handleNextImage = (productId: string, total: number) => {
    setActiveImageIndices((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % total,
    }));
  };

  const handlePrevImage = (productId: string, total: number) => {
    setActiveImageIndices((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + total) % total,
    }));
  };

  const handleSelectImage = (productId: string, index: number) => {
    setActiveImageIndices((prev) => ({
      ...prev,
      [productId]: index,
    }));
  };

  const handleBuy = (product: any) => {
    addToCart(product, 1);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <div className="w-full pb-24 space-y-20">
      {/* Header Banner */}
      <section className="relative w-full py-16 bg-gradient-to-b from-onyx-950 via-forest-dark to-onyx-950 border-b border-gold-400/20 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs font-sans tracking-monumental uppercase text-gold-400 font-bold">
            {t('Catálogo Editorial & Análise Botânica', 'Editorial Catalog & Botanical Analysis')}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
            A Linha de Méis Tiúba Reserve
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans max-w-2xl mx-auto">
            {t(
              'A TIÚBA RESERVE nasce da valorização do mel produzido pela abelha Tiúba (Melipona fasciculata) e da riqueza botânica da Amazônia. Nossa proposta é apresentar o mel não apenas como alimento, mas como uma expressão de origem, flora, território, sazonalidade e identidade sensorial.',
              'TIÚBA RESERVE springs from the veneration of honey produced by the native Tiúba bee (Melipona fasciculata) and the botanical richness of the Amazon. Each batch represents origin, flora, territory, seasonality, and sensory identity.'
            )}
          </p>
        </div>
      </section>

      {/* The 4 Products Detailed Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {products.map((product, idx) => {
          const currentIdx = activeImageIndices[product.id] || 0;
          const isReverse = idx % 2 === 1;

          return (
            <div
              key={product.id}
              id={product.slug}
              className="p-8 sm:p-12 rounded-3xl bg-onyx-900 border border-gold-400/20 shadow-2xl relative overflow-hidden space-y-12"
            >
              {/* Product Header & Number */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-400/15 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-400/60 font-mono">
                      0{idx + 1}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground">
                      {product.name}
                    </h2>
                  </div>
                  <p className="font-serif text-sm sm:text-base text-gold-300 italic mt-1">
                    “{product.concept}”
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-sans text-stone-400 block">
                      {t('Frasco 150ml', '150ml Flask')}
                    </span>
                    <span className="font-serif text-2xl font-bold text-gold-300">
                      R$ {(product.promo_price || product.price).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBuy(product)}
                    className="flex items-center gap-2 py-3 px-5 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-gold-400/20"
                  >
                    {addedItem === product.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-950" />
                        <span>{t('No Carrinho!', 'In Cart!')}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{t('Comprar', 'Purchase')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Main Content: Gallery & Sensory Info */}
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-start ${isReverse ? 'lg:grid-flow-dense' : ''}`}>
                {/* 4-Image Interactive Carousel */}
                <div className={`lg:col-span-6 space-y-4 ${isReverse ? 'lg:col-start-7' : ''}`}>
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-gold-400/30 bg-onyx-950 group">
                    <Image
                      src={product.images[currentIdx] || product.images[0]}
                      alt={`${product.name} - Imagem ${currentIdx + 1}`}
                      fill
                      className="object-cover object-center transition-all duration-500"
                    />
                    
                    {/* Carousel Navigation Arrows */}
                    <button
                      onClick={() => handlePrevImage(product.id, product.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-onyx-950/70 text-stone-300 hover:text-gold-400 hover:bg-onyx-950 border border-gold-400/30 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleNextImage(product.id, product.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-onyx-950/70 text-stone-300 hover:text-gold-400 hover:bg-onyx-950 border border-gold-400/30 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-4 right-4 bg-onyx-950/80 px-2.5 py-1 rounded text-[10px] font-mono text-gold-300 border border-gold-400/30">
                      {currentIdx + 1} / {product.images.length}
                    </div>
                  </div>

                  {/* Thumbnails row (up to 4 photos) */}
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectImage(product.id, i)}
                        className={`relative aspect-square rounded-xl overflow-hidden border transition-all ${
                          currentIdx === i
                            ? 'border-gold-400 ring-2 ring-gold-400/40'
                            : 'border-gold-400/20 hover:border-gold-400/50 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image src={img} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Editorial Details & Characteristics */}
                <div className={`lg:col-span-6 space-y-6 ${isReverse ? 'lg:col-start-1' : ''}`}>
                  <div>
                    <h3 className="text-xs uppercase tracking-luxury text-gold-400 font-bold mb-2">
                      {t('Apresentação & Identidade', 'Presentation & Identity')}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                      {product.description}
                    </p>
                  </div>

                  {/* Botanical Characteristics List */}
                  <div>
                    <h3 className="text-xs uppercase tracking-luxury text-gold-400 font-bold mb-3">
                      {t('Características Botânicas', 'Botanical Characteristics')}
                    </h3>
                    <ul className="space-y-2">
                      {product.characteristics.map((item, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2.5 text-xs text-stone-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0 mt-1.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sensory Profile Matrix */}
                  <div className="p-5 rounded-2xl bg-onyx-950 border border-gold-400/20 space-y-4">
                    <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold-400" />
                      <span>{t('Ficha de Análise Sensorial', 'Sensory Analysis Specs')}</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-onyx-900/60 p-2.5 rounded-lg border border-gold-400/10">
                        <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold block">Aroma</span>
                        <span className="text-stone-300">{product.sensory_profile.aroma}</span>
                      </div>
                      <div className="bg-onyx-900/60 p-2.5 rounded-lg border border-gold-400/10">
                        <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold block">Sabor</span>
                        <span className="text-stone-300">{product.sensory_profile.flavor}</span>
                      </div>
                      <div className="bg-onyx-900/60 p-2.5 rounded-lg border border-gold-400/10">
                        <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold block">Textura & Fluidez</span>
                        <span className="text-stone-300">{product.sensory_profile.texture}</span>
                      </div>
                      <div className="bg-onyx-900/60 p-2.5 rounded-lg border border-gold-400/10">
                        <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold block">Acidez & pH</span>
                        <span className="text-stone-300">{product.sensory_profile.acidity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical-Chemical and Nutritional Table */}
              <div className="border-t border-gold-400/15 pt-8 space-y-4">
                <div className="flex items-center gap-2 text-gold-400">
                  <FlaskConical className="w-4 h-4" />
                  <h3 className="font-serif text-sm uppercase tracking-wider font-bold text-foreground">
                    {t('Tabela Físico-Química e Nutricional Detalhada', 'Detailed Physical-Chemical & Nutritional Table')}
                  </h3>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gold-400/15">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-onyx-950 text-gold-300 uppercase tracking-wider text-[10px] border-b border-gold-400/15">
                      <tr>
                        <th className="py-3 px-4">Parâmetro / Componente</th>
                        <th className="py-3 px-4">Valor Constatado no Lote</th>
                        <th className="py-3 px-4">Significado Sensorial & Funcional</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-stone-300">
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-foreground">Carboidratos Totais</td>
                        <td className="py-2.5 px-4 font-mono text-gold-300">{product.nutritional_info.carbs}</td>
                        <td className="py-2.5 px-4 text-stone-400">Fonte nobre e rápida de energia bioativa.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-foreground">Frutose Natural</td>
                        <td className="py-2.5 px-4 font-mono text-gold-300">{product.nutritional_info.fructose}</td>
                        <td className="py-2.5 px-4 text-stone-400">Açúcar primário de absorção suave com alta solubilidade.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-foreground">Glicose</td>
                        <td className="py-2.5 px-4 font-mono text-gold-300">{product.nutritional_info.glucose}</td>
                        <td className="py-2.5 px-4 text-stone-400">Equilíbrio glicêmico natural de néctar silvestre.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-foreground">Sacarose</td>
                        <td className="py-2.5 px-4 font-mono text-gold-300">{product.nutritional_info.sucrose}</td>
                        <td className="py-2.5 px-4 text-stone-400">Teor mínimo garantindo total digestão pelas abelhas.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-foreground">Umidade Natural</td>
                        <td className="py-2.5 px-4 font-mono text-gold-300">{product.nutritional_info.moisture}</td>
                        <td className="py-2.5 px-4 text-stone-400">Fluidez nobre e característica marcante da espécie Tiúba.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-foreground">Compostos Fenólicos</td>
                        <td className="py-2.5 px-4 font-mono text-gold-300">{product.nutritional_info.phenolic_compounds}</td>
                        <td className="py-2.5 px-4 text-stone-400">Ação antioxidante e defesa celular ativa.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-foreground">Acidez Livre</td>
                        <td className="py-2.5 px-4 font-mono text-gold-300">{product.nutritional_info.acidity_meq} (pH {product.nutritional_info.ph})</td>
                        <td className="py-2.5 px-4 text-stone-400">Frescor cítrico característico sem queimar a garganta.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-foreground">Índice HMF</td>
                        <td className="py-2.5 px-4 font-mono text-emerald-400">{product.nutritional_info.hmf}</td>
                        <td className="py-2.5 px-4 text-stone-400">Comprovação laboratorial de frescor absoluto (sem aquecimento).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ========================================================
          COMPARATIVO DA LINHA: Conforme Tiuba_Reserve_Linha_de_Produtos.md
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-sans tracking-monumental uppercase text-gold-400 font-bold">
            {t('Síntese Técnica Comparativa', 'Comparative Technical Synthesis')}
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Comparativo da Linha Tiúba Reserve
          </h2>
          <p className="text-xs text-stone-400 max-w-xl mx-auto">
            {t(
              'Parâmetros comparativos oficiais das 4 expressões de mel da abelha Tiúba.',
              'Official comparative parameters of all 4 expressions of Tiúba honey.'
            )}
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gold-400/20 bg-onyx-900 shadow-2xl">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-onyx-950 text-gold-300 uppercase tracking-wider text-[11px] border-b border-gold-400/20">
              <tr>
                <th className="py-4 px-5">Característica</th>
                <th className="py-4 px-5">Tradicional</th>
                <th className="py-4 px-5">Bifloral</th>
                <th className="py-4 px-5">Multifloral</th>
                <th className="py-4 px-5">Amazonas (Grand Cru)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-stone-300">
              <tr>
                <td className="py-3.5 px-5 font-semibold text-foreground">Espécie da Abelha</td>
                <td className="py-3.5 px-5">Tiúba (M. fasciculata)</td>
                <td className="py-3.5 px-5">Tiúba (M. fasciculata)</td>
                <td className="py-3.5 px-5">Tiúba (M. fasciculata)</td>
                <td className="py-3.5 px-5">Tiúba (M. fasciculata)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-semibold text-foreground">Origem Floral</td>
                <td className="py-3.5 px-5">Diversas, sem especificação</td>
                <td className="py-3.5 px-5 text-gold-300 font-semibold">2 fontes predominantes</td>
                <td className="py-3.5 px-5">Diversas espécies da mata</td>
                <td className="py-3.5 px-5">Conforme o lote e terroir</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-semibold text-foreground">Origem Geográfica</td>
                <td className="py-3.5 px-5">Conforme o lote</td>
                <td className="py-3.5 px-5">Conforme o lote</td>
                <td className="py-3.5 px-5">Conforme o lote</td>
                <td className="py-3.5 px-5 text-gold-300 font-bold">Estado do Amazonas</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-semibold text-foreground">Perfil Sensorial</td>
                <td className="py-3.5 px-5">Equilibrado e natural</td>
                <td className="py-3.5 px-5">Mais direcionado</td>
                <td className="py-3.5 px-5">Mais complexo e profundo</td>
                <td className="py-3.5 px-5">Territorial e etéreo</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-semibold text-foreground">Variação Entre Lotes</td>
                <td className="py-3.5 px-5">Média</td>
                <td className="py-3.5 px-5">Média / Alta</td>
                <td className="py-3.5 px-5">Média / Alta</td>
                <td className="py-3.5 px-5">Média / Alta</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-semibold text-foreground">Principal Diferencial</td>
                <td className="py-3.5 px-5">Autenticidade clássica</td>
                <td className="py-3.5 px-5">Combinação floral dupla</td>
                <td className="py-3.5 px-5">Biodiversidade vegetal</td>
                <td className="py-3.5 px-5 text-gold-400 font-semibold">Origem e terroir amazônico</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-semibold text-foreground">Potencial de Edição Limitada</td>
                <td className="py-3.5 px-5">Médio</td>
                <td className="py-3.5 px-5 text-amber-honey font-semibold">Alto</td>
                <td className="py-3.5 px-5 text-amber-honey font-semibold">Alto</td>
                <td className="py-3.5 px-5 text-gold-300 font-bold">Muito Alto (Grand Cru)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
