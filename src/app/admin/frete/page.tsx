'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { 
  Truck, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function AdminShippingPage() {
  const { settings, updateSettings, t } = useStore();

  const [fixedPrice, setFixedPrice] = useState(settings.fixed_shipping_price);
  const [freeThreshold, setFreeThreshold] = useState(settings.free_shipping_threshold);
  const [motoboyEnabled, setMotoboyEnabled] = useState(settings.motoboy_enabled);
  const [motoboyPrice, setMotoboyPrice] = useState(settings.motoboy_price);
  const [zipPrefixes, setZipPrefixes] = useState(settings.motoboy_zip_prefixes);

  // Live CEP tester
  const [testCep, setTestCep] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSaveShippingRules = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      fixed_shipping_price: Number(fixedPrice),
      free_shipping_threshold: Number(freeThreshold),
      motoboy_enabled: motoboyEnabled,
      motoboy_price: Number(motoboyPrice),
      motoboy_zip_prefixes: zipPrefixes,
    });
    alert('Regras de frete e cobertura de motoboy atualizadas com sucesso!');
  };

  const handleTestCep = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = testCep.replace(/\D/g, '');
    if (clean.length < 3) {
      setTestResult('Digite pelo menos os 3 primeiros dígitos do CEP.');
      return;
    }
    const prefix = clean.substring(0, 3);
    const prefixesArr = zipPrefixes.split(',').map((p) => p.trim());

    if (motoboyEnabled && prefixesArr.includes(prefix)) {
      setTestResult(`✓ CEP ${testCep} QUALIFICADO para Motoboy Express SP (Valor: R$ ${motoboyPrice.toFixed(2).replace('.', ',')})`);
    } else {
      setTestResult(`→ CEP ${testCep} direcionado para Frete Nacional Padrão PAC/SEDEX (Valor: R$ ${fixedPrice.toFixed(2).replace('.', ',')})`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-400/20 pb-6">
        <div>
          <span className="text-xs font-sans tracking-luxury uppercase text-gold-400 font-bold block mb-1">
            Logística & Entregas
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Gestor de Frete & Motoboy Express SP
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Configuration */}
        <form onSubmit={handleSaveShippingRules} className="lg:col-span-7 space-y-6">
          {/* Section 1: Standard National Shipping */}
          <div className="p-6 sm:p-8 rounded-3xl bg-onyx-900 border border-gold-400/20 shadow-xl space-y-5">
            <h3 className="font-serif text-base font-bold uppercase tracking-wider text-gold-300 border-b border-white/5 pb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold-400" />
              <span>Tabela de Frete Fixo Nacional</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                  Preço do Frete Fixo Padrão (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={fixedPrice}
                  onChange={(e) => setFixedPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                />
                <span className="text-[10px] text-stone-400 block mt-1">
                  Aplicado para envios via PAC/SEDEX nas demais regiões.
                </span>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                  Valor Mínimo para Frete Grátis (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(parseFloat(e.target.value) || 0)}
                  className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
                />
                <span className="text-[10px] text-stone-400 block mt-1">
                  Compras acima deste valor recebem frete cortesia.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Motoboy Express SP */}
          <div className="p-6 sm:p-8 rounded-3xl bg-onyx-900 border border-gold-400/20 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-gold-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400" />
                <span>Entrega Express por Motoboy (São Paulo e Grande SP)</span>
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableMoto"
                  checked={motoboyEnabled}
                  onChange={(e) => setMotoboyEnabled(e.target.checked)}
                  className="accent-gold-400 w-4 h-4"
                />
                <label htmlFor="enableMoto" className="text-xs text-stone-200 font-semibold cursor-pointer">
                  {motoboyEnabled ? 'Ativado' : 'Desativado'}
                </label>
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                Tarifa de Entrega por Motoboy (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                disabled={!motoboyEnabled}
                value={motoboyPrice}
                onChange={(e) => setMotoboyPrice(parseFloat(e.target.value) || 0)}
                className="w-full sm:w-1/2 bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-stone-300 font-bold block mb-1">
                Prefixos de CEP Habilitados para São Paulo e Grande SP (Separados por vírgula)
              </label>
              <textarea
                rows={3}
                disabled={!motoboyEnabled}
                value={zipPrefixes}
                onChange={(e) => setZipPrefixes(e.target.value)}
                placeholder="010,011,012,013,014,015..."
                className="w-full bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400 resize-none disabled:opacity-50"
              />
              <span className="text-[10px] text-stone-400 block mt-1">
                Os 3 primeiros dígitos do CEP são comparados. Exemplo: '014' cobre Jardins, '045' cobre Itaim Bibi/Vila Olímpia.
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-gold-400/20"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Regras de Frete</span>
          </button>
        </form>

        {/* Right Column: Live Simulator & Tips */}
        <div className="lg:col-span-5 space-y-6">
          {/* Simulator Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-onyx-900 border border-gold-400/30 shadow-2xl space-y-4">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Simulador de Regra de CEP em Tempo Real</span>
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Teste qualquer CEP para validar se as regras ativas de Motoboy Express SP ou Frete Nacional estão respondendo corretamente.
            </p>

            <form onSubmit={handleTestCep} className="flex gap-2">
              <input
                type="text"
                maxLength={9}
                value={testCep}
                onChange={(e) => setTestCep(e.target.value)}
                placeholder="Ex.: 01415-002"
                className="flex-1 bg-onyx-950 border border-gold-400/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-gold-400"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gold-400 hover:bg-gold-300 text-onyx-950 font-serif font-bold text-xs uppercase tracking-wider"
              >
                Testar
              </button>
            </form>

            {testResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-sans leading-relaxed ${
                  testResult.includes('QUALIFICADO')
                    ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                    : 'bg-onyx-950 border-gold-400/30 text-gold-300'
                }`}
              >
                {testResult}
              </div>
            )}
          </div>

          {/* Quick Info Box */}
          <div className="p-6 rounded-2xl bg-forest-dark border border-gold-400/20 space-y-2 text-xs text-stone-300 font-sans">
            <span className="font-serif font-bold text-gold-400 uppercase tracking-wider block">
              Logística Dedicada para Méis Vivos
            </span>
            <p className="leading-relaxed">
              O mel nobre da abelha Tiúba possui alta fluidez e enzimas ativas sensíveis ao calor excessivo. Nossos motoboys e parceiros de transporte utilizam caixas térmicas com isolamento acolchoado para garantir a integridade total do frasco.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
