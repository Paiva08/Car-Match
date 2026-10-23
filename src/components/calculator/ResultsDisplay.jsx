import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Car, DollarSign, Calendar, Leaf, AlertCircle } from "lucide-react";

export default function ResultsDisplay({ result }) {
  if (!result) return null;

  const { bestCar, calculations, comparison } = result;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Melhor Carro */}
      <Card className="border-none shadow-2xl bg-gradient-to-br from-teal-50 to-emerald-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full -translate-y-32 translate-x-32" />
        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between">
            <div>
              <Badge className="bg-emerald-600 text-white mb-3 px-3 py-1">
                Melhor Opção
              </Badge>
              <CardTitle className="text-3xl font-bold text-slate-800 mb-2">
                {bestCar.marca} {bestCar.modelo}
              </CardTitle>
              <p className="text-slate-600">Ano {bestCar.ano} • {bestCar.tipo_combustivel}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-lg">
              <Car className="w-8 h-8 text-teal-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Valor FIPE</p>
              <p className="text-lg font-bold text-slate-800">{formatCurrency(bestCar.valor_carro)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Consumo Cidade</p>
              <p className="text-lg font-bold text-slate-800">{bestCar.consumo_cidade} km/l</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Consumo Estrada</p>
              <p className="text-lg font-bold text-slate-800">{bestCar.consumo_estrada} km/l</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Emissão CO₂</p>
              <p className="text-lg font-bold text-slate-800">{bestCar.co2} g/km</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparação Comprar vs Alugar */}
      <Card className="border-none shadow-xl">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-teal-600" />
            Análise Financeira - Horizonte de {comparison.n_parcelas} Meses
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Comprar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">💰 Comprando</h3>
                <Badge variant="outline" className="text-slate-600">
                  Total do Horizonte
                </Badge>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Custo Mensal Médio</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(calculations.custo_mensal_comprado)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Entrada</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(comparison.entrada)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Valor de Venda</span>
                  <span className="font-semibold text-emerald-600">- {formatCurrency(comparison.valor_venda)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border-2 border-teal-200">
                  <span className="font-semibold text-slate-800">Total Final</span>
                  <span className="text-xl font-bold text-teal-700">{formatCurrency(comparison.total_comprado)}</span>
                </div>
              </div>
            </div>

            {/* Alugar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">🔑 Alugando</h3>
                <Badge variant="outline" className="text-slate-600">
                  Total do Horizonte
                </Badge>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Custo Mensal Médio</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(calculations.custo_mensal_alugado)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Entrada</span>
                  <span className="font-semibold text-slate-400">R$ 0,00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Valor de Venda</span>
                  <span className="font-semibold text-slate-400">R$ 0,00</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200">
                  <span className="font-semibold text-slate-800">Total Final</span>
                  <span className="text-xl font-bold text-slate-700">{formatCurrency(comparison.total_alugado)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recomendação */}
          <div className={`mt-6 p-5 rounded-xl border-2 ${
            comparison.recomendacao === 'comprar' 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start gap-3">
              <AlertCircle className={`w-5 h-5 mt-0.5 ${
                comparison.recomendacao === 'comprar' ? 'text-emerald-600' : 'text-blue-600'
              }`} />
              <div>
                <h4 className={`font-semibold mb-1 ${
                  comparison.recomendacao === 'comprar' ? 'text-emerald-800' : 'text-blue-800'
                }`}>
                  {comparison.recomendacao === 'comprar' ? '✓ Recomendamos Comprar' : 'ℹ Alugar é Mais Vantajoso'}
                </h4>
                <p className="text-sm text-slate-700">
                  {comparison.recomendacao === 'comprar' 
                    ? `Você economizará ${formatCurrency(comparison.economia)} no horizonte de ${comparison.n_parcelas} meses.`
                    : `Alugar economiza ${formatCurrency(comparison.economia)} no primeiro horizonte.`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Segundo Horizonte */}
          {comparison.segundo_horizonte && (
            <div className="mt-6 p-5 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border-2 border-violet-200">
              <h4 className="font-semibold text-violet-800 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Análise de Segundo Horizonte
              </h4>
              <p className="text-sm text-slate-700 mb-3">
                Mesmo com o aluguel sendo mais vantajoso inicialmente, após <strong>{comparison.segundo_horizonte.meses_ate_empate} meses</strong> adicionais sem parcelas, comprar se torna mais econômico.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="text-slate-600 mb-1">Total Comprado (2 horizontes)</p>
                  <p className="font-semibold text-violet-700">{formatCurrency(comparison.segundo_horizonte.total_comprado)}</p>
                </div>
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="text-slate-600 mb-1">Total Alugado (2 horizontes)</p>
                  <p className="font-semibold text-violet-700">{formatCurrency(comparison.segundo_horizonte.total_alugado)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detalhamento dos Custos */}
      <Card className="border-none shadow-xl">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-teal-600" />
            Detalhamento de Custos Mensais
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
              <p className="text-xs text-blue-700 font-medium mb-1">Combustível</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(calculations.custos_mensais.combustivel)}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl">
              <p className="text-xs text-orange-700 font-medium mb-1">Depreciação</p>
              <p className="text-2xl font-bold text-orange-900">{formatCurrency(calculations.custos_mensais.depreciacao)}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl">
              <p className="text-xs text-purple-700 font-medium mb-1">IPVA</p>
              <p className="text-2xl font-bold text-purple-900">{formatCurrency(calculations.custos_mensais.ipva)}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl">
              <p className="text-xs text-green-700 font-medium mb-1">Manutenção</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(calculations.custos_mensais.manutencao)}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-xl">
              <p className="text-xs text-pink-700 font-medium mb-1">Parcela</p>
              <p className="text-2xl font-bold text-pink-900">{formatCurrency(calculations.custos_mensais.parcela)}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl">
              <p className="text-xs text-teal-700 font-medium mb-1">Seguro</p>
              <p className="text-2xl font-bold text-teal-900">{formatCurrency(calculations.custos_mensais.seguro)}</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <span className="font-medium text-slate-700">CO₂ Gerado por Mês</span>
            </div>
            <span className="text-xl font-bold text-slate-800">{calculations.custos_mensais.co2.toFixed(2)} kg</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}