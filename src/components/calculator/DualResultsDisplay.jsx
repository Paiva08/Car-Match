import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Car, DollarSign, Leaf, AlertCircle, Sparkles } from "lucide-react";

export default function DualResultsDisplay({ bestEconomic, bestSustainable }) {
  if (!bestEconomic && !bestSustainable) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const CarCard = ({ result, type, icon: Icon, gradient, badgeColor }) => {
    const { bestCar, calculations, comparison } = result;

    return (
      <Card className={`border-none shadow-2xl bg-gradient-to-br ${gradient} overflow-hidden relative`}>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full -translate-y-32 translate-x-32 bg-white" />
        <CardHeader className="relative pb-4 border-b border-white/20">
          <div className="flex items-start justify-between">
            <div>
              <Badge className={`${badgeColor} text-white mb-3 px-3 py-1 shadow-lg`}>
                {type === 'economic' ? 'Melhor Custo-Benefício' : 'Mais Sustentável'}
              </Badge>
              <CardTitle className="text-3xl font-bold text-white mb-2">
                {bestCar.marca} {bestCar.modelo}
              </CardTitle>
              <p className="text-white/90">Ano {bestCar.ano} • {bestCar.tipo_combustivel} • {bestCar.tipo_veiculo || 'N/A'}</p>
            </div>
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-6 pt-6">
          {/* Destaques */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Custo Mensal Médio</p>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(calculations.custo_mensal_comprado)}</p>
            </div>
            <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Emissão CO₂/mês</p>
              <p className="text-xl font-bold text-slate-800">
                {bestCar.co2 === 0 ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <Leaf className="w-4 h-4" /> 0 kg
                  </span>
                ) : (
                  `${calculations.custos_mensais.co2.toFixed(2)} kg`
                )}
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Valor FIPE</p>
              <p className="text-lg font-bold text-slate-800">{formatCurrency(bestCar.valor_carro)}</p>
            </div>
            <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Consumo Médio</p>
              <p className="text-lg font-bold text-slate-800">
                {((bestCar.consumo_cidade + bestCar.consumo_estrada) / 2).toFixed(1)} {bestCar.tipo_combustivel === 'Eletricidade' ? 'km/kWh' : 'km/l'}
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-sm col-span-2">
              <p className="text-xs text-slate-500 mb-1">Autonomia</p>
              <p className="text-lg font-bold text-slate-800">
                {bestCar.autonomia ? `${bestCar.autonomia} km` : 'N/A'}
              </p>
            </div>
          </div>

          {/* Análise Financeira */}
          <div className="bg-white/90 backdrop-blur rounded-xl p-5">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-teal-600" />
              Análise - Horizonte de {comparison.n_parcelas} Meses
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Total Comprando</span>
                <span className="font-semibold text-slate-800">{formatCurrency(comparison.total_comprado)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Total Alugando</span>
                <span className="font-semibold text-slate-800">{formatCurrency(comparison.total_alugado)}</span>
              </div>
              <div className={`flex justify-between items-center p-4 rounded-xl border-2 ${
                comparison.recomendacao === 'comprar' 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <span className="font-semibold text-slate-800">Recomendação</span>
                <span className={`text-lg font-bold ${
                  comparison.recomendacao === 'comprar' ? 'text-emerald-700' : 'text-blue-700'
                }`}>
                  {comparison.recomendacao === 'comprar' ? '✓ Comprar' : 'Alugar'}
                </span>
              </div>
            </div>
          </div>

          {/* Impacto Ambiental */}
          {bestCar.tipo_combustivel === 'Eletricidade' && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-5 text-white">
              <div className="flex items-start gap-3">
                <Leaf className="w-6 h-6 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2">🌍 Impacto Ambiental Positivo</h4>
                  <p className="text-sm text-white/90">
                    Este veículo elétrico evita a emissão de aproximadamente <strong>1.6 toneladas de CO₂ por ano</strong>, 
                    equivalente a plantar 80 árvores anualmente!
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Comparação Rápida */}
      {bestEconomic && bestSustainable && bestEconomic.bestCar.id !== bestSustainable.bestCar.id && (
        <Card className="border-none shadow-xl bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50">
          <CardHeader className="border-b border-orange-100">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-600" />
              Comparação Rápida: Economia vs Sustentabilidade
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-sm text-slate-600 mb-3 font-medium">Diferença de Custo Mensal</p>
                <p className="text-3xl font-bold text-orange-600">
                  {formatCurrency(Math.abs(bestSustainable.calculations.custo_mensal_comprado - bestEconomic.calculations.custo_mensal_comprado))}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  O veículo sustentável custa {bestSustainable.calculations.custo_mensal_comprado > bestEconomic.calculations.custo_mensal_comprado ? 'mais' : 'menos'} por mês
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-sm text-slate-600 mb-3 font-medium">Redução de CO₂</p>
                <p className="text-3xl font-bold text-green-600">
                  {bestSustainable.bestCar.co2 === 0 
                    ? '100%' 
                    : `${Math.round((1 - bestSustainable.bestCar.co2 / bestEconomic.bestCar.co2) * 100)}%`
                  }
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Menos emissões com o veículo sustentável
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-sm text-slate-600 mb-3 font-medium">Economia Anual de CO₂</p>
                <p className="text-3xl font-bold text-teal-600">
                  {((bestEconomic.calculations.custos_mensais.co2 - bestSustainable.calculations.custos_mensais.co2) * 12).toFixed(0)} kg
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Equivalente a {Math.round((bestEconomic.calculations.custos_mensais.co2 - bestSustainable.calculations.custos_mensais.co2) * 12 / 20)} árvores
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <div className="flex items-start gap-3 text-white">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <p className="text-sm">
                  <strong>Vale a pena investir no sustentável?</strong> Mesmo custando um pouco mais por mês, 
                  você contribui significativamente para reduzir as emissões de gases de efeito estufa e ainda economiza 
                  em manutenção a longo prazo. Pense no planeta! 🌍
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards dos Carros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {bestEconomic && (
          <CarCard 
            result={bestEconomic} 
            type="economic" 
            icon={DollarSign}
            gradient="from-blue-500 via-blue-600 to-indigo-600"
            badgeColor="bg-blue-600"
          />
        )}
        {bestSustainable && (
          <CarCard 
            result={bestSustainable} 
            type="sustainable" 
            icon={Leaf}
            gradient="from-green-500 via-emerald-600 to-teal-600"
            badgeColor="bg-green-600"
          />
        )}
      </div>
    </div>
  );
}