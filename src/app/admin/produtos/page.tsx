'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { 
  Package, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  Eye, 
  DollarSign, 
  Sparkles,
  FlaskConical
} from 'lucide-react';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, t } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleOpenEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsNew(false);
  };

  const handleOpenCreate = () => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: 'Novo Mel de Tiúba',
      name_en: 'New Tiúba Honey',
      slug: `novo-mel-tiuba-${Date.now().toString().slice(-4)}`,
      concept: 'Expressão de Origem e Floresta.',
      concept_en: 'Expression of Origin and Forest.',
      subtitle: 'Edição limitada colhida no Bioma Amazônia.',
      subtitle_en: 'Limited edition harvested in the Amazon Biome.',
      description: 'Descrição completa botânica e sensorial do mel.',
      description_en: 'Full botanical and sensory description.',
      characteristics: ['Abelha Tiúba (Melipona fasciculata)', 'Bioma Amazônia'],
      characteristics_en: ['Tiúba bee (Melipona fasciculata)', 'Amazon Biome'],
      price: 195.0,
      stock: 12,
      volume: '150 ml',
      images: [
        '/images/products/tradicional-1.jpg',
        '/images/products/tradicional-2.jpg',
        '/images/products/tradicional-3.jpg',
        '/images/products/tradicional-4.jpg',
      ],
      sensory_profile: {
        aroma: 'Floral com notas frutadas.',
        aroma_en: 'Floral with fruity hints.',
        flavor: 'Acidez refrescante e doçura média.',
        flavor_en: 'Crisp acidity and balanced sweetness.',
        texture: 'Fluida e aveludada.',
        texture_en: 'Silky and fluid.',
        acidity: 'Equilibrada (pH 3.7).',
        acidity_en: 'Balanced (pH 3.7).',
        color: 'Dourado translúcido.',
        color_en: 'Translucent gold.',
      },
      nutritional_info: {
        serving_size: '20g',
        carbs: '15g',
        glucose: '31g / 100g',
        fructose: '39g / 100g',
        sucrose: '< 1g',
        moisture: '25%',
        minerals: '0.25g',
        phenolic_compounds: '90 mg GAE / 100g',
        acidity_meq: '38 meq/kg',
        ph: '3.7',
        hmf: '2.5 mg/kg',
      },
      active: true,
      bee_species: 'Melipona compressipes fasciculata',
      biome: 'Amazônia',
      floral_type: 'Silvestre',
      lot_code_example: 'TR-NOVO-01',
    };

    setEditingProduct(newProd);
    setIsNew(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (isNew) {
      addProduct(editingProduct);
    } else {
      updateProduct(editingProduct);
    }

    setEditingProduct(null);
    alert('Produto salvo com sucesso no catálogo!');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja remover o produto "${name}" do catálogo?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-400/20 pb-6">
        <div>
          <span className="text-xs font-sans tracking-luxury uppercase text-gold-400 font-bold block mb-1">
            Catálogo & Estoque
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Gestor de Produtos (CRUD)
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-gold-400/20"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* Products Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-6 rounded-3xl bg-onyx-900 border border-gold-400/20 shadow-xl flex flex-col justify-between space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="relative w-24 h-28 rounded-2xl overflow-hidden border border-gold-400/30 bg-onyx-950 shrink-0">
                <Image
                  src={product.images[0] || '/images/hero-bottle.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-gold-400 font-bold">
                    {product.volume} · {product.biome}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                      product.active
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-950/80 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {product.active ? 'Ativo na Loja' : 'Inativo'}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-foreground">
                  {product.name}
                </h3>
                <p className="text-xs text-stone-400 italic">
                  "{product.concept}"
                </p>
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="font-serif text-xl font-bold text-gold-300">
                    R$ {(product.promo_price || product.price).toFixed(2).replace('.', ',')}
                  </span>
                  {product.promo_price && (
                    <span className="text-xs text-stone-400 line-through">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-onyx-950 border border-white/5 text-[11px] text-stone-300 font-sans">
              <div>
                <span className="text-stone-400 block text-[9px] uppercase">Estoque:</span>
                <span className="font-mono text-emerald-400 font-bold">{product.stock} un</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[9px] uppercase">Fotos HD:</span>
                <span className="font-mono text-gold-300 font-bold">{product.images.length} fotos</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[9px] uppercase">Slug:</span>
                <span className="font-mono text-stone-400 truncate block">{product.slug}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between border-t border-gold-400/10 pt-4">
              <a
                href={`/produto/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-stone-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver na Loja</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(product)}
                  className="px-3.5 py-1.5 rounded-lg border border-gold-400/30 bg-gold-400/10 hover:bg-gold-400/20 text-gold-300 text-xs font-serif uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>

                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="p-2 rounded-lg border border-red-500/20 text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Excluir produto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Edit / Create Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-onyx-900 border border-gold-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gold-400/20 pb-4">
              <div>
                <span className="text-[10px] uppercase font-sans tracking-luxury text-gold-400 font-bold block">
                  {isNew ? 'Novo Cadastro' : 'Edição de Catálogo'}
                </span>
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  {isNew ? 'Criar Novo Mel' : `Editar: ${editingProduct.name}`}
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                    Nome do Produto (PT) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                    Nome do Produto (EN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name_en}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_en: e.target.value })}
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                    Slug da URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.slug}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                    Conceito / Frase Marcante
                  </label>
                  <input
                    type="text"
                    value={editingProduct.concept}
                    onChange={(e) => setEditingProduct({ ...editingProduct, concept: e.target.value })}
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                    Preço Padrão (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                    Preço Promocional (Opcional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.promo_price || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        promo_price: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                    Estoque Disponível (Unidades) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                    Volume do Frasco
                  </label>
                  <input
                    type="text"
                    value={editingProduct.volume}
                    onChange={(e) => setEditingProduct({ ...editingProduct, volume: e.target.value })}
                    className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              {/* Photos URLs (Up to 4) */}
              <div className="space-y-3 border-t border-white/5 pt-4">
                <span className="text-xs uppercase tracking-wider text-gold-400 font-bold block">
                  Galeria de Fotos em Alta Resolução (Até 4 Fotos)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx}>
                      <label className="text-[10px] text-stone-400 font-mono block mb-1">
                        Foto {idx + 1} URL:
                      </label>
                      <input
                        type="text"
                        value={editingProduct.images[idx] || ''}
                        onChange={(e) => {
                          const newImages = [...editingProduct.images];
                          newImages[idx] = e.target.value;
                          setEditingProduct({ ...editingProduct, images: newImages });
                        }}
                        placeholder={`/images/products/...`}
                        className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block">
                  Descrição Completa da Florada e Origem (PT)
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold-400 resize-none"
                />
              </div>

              {/* Nutritional Info Values */}
              <div className="space-y-3 border-t border-white/5 pt-4">
                <span className="text-xs uppercase tracking-wider text-gold-400 font-bold block flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4" />
                  Valores da Tabela Físico-Química / Nutricional
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-1">Umidade Natural</label>
                    <input
                      type="text"
                      value={editingProduct.nutritional_info.moisture}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          nutritional_info: { ...editingProduct.nutritional_info, moisture: e.target.value },
                        })
                      }
                      className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-2 py-1 text-xs text-foreground font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-1">Compostos Fenólicos</label>
                    <input
                      type="text"
                      value={editingProduct.nutritional_info.phenolic_compounds}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          nutritional_info: { ...editingProduct.nutritional_info, phenolic_compounds: e.target.value },
                        })
                      }
                      className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-2 py-1 text-xs text-foreground font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-1">Acidez Livre</label>
                    <input
                      type="text"
                      value={editingProduct.nutritional_info.acidity_meq}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          nutritional_info: { ...editingProduct.nutritional_info, acidity_meq: e.target.value },
                        })
                      }
                      className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-2 py-1 text-xs text-foreground font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-1">Índice HMF</label>
                    <input
                      type="text"
                      value={editingProduct.nutritional_info.hmf}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          nutritional_info: { ...editingProduct.nutritional_info, hmf: e.target.value },
                        })
                      }
                      className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-2 py-1 text-xs text-foreground font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="activeProd"
                  checked={editingProduct.active}
                  onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.checked })}
                  className="accent-gold-400 w-4 h-4"
                />
                <label htmlFor="activeProd" className="text-xs text-stone-200 font-sans cursor-pointer">
                  Disponível e Ativo na Boutique Virtual
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-gold-400/20 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 text-xs uppercase font-serif"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-gold-400/20"
                >
                  {isNew ? 'Criar Produto' : 'Salvar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
