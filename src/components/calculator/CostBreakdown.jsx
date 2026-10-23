import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, TrendingDown, FileText, Wrench, CreditCard, Shield, Leaf } from 'lucide-react';

export default function CostBreakdown({ calculations, carName }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const costs = [
    { 
      label: 'Combustível/Energia', 
      value: calculations.custos_mensais.combustivel, 
      icon: Fuel, 
      color: 'blue',
      description: 'Gasto mensal estimado com abastecimento'
    },
    { 
      label: 'Depreciação', 
      value: calculations.custos_mensais.depreciacao, 
      icon: TrendingDown, 
      color: 'orange',
      description: 'Perda de valor do veículo por mês'
    },
    { 
      label: 'IPVA', 
      value: calculations.custos_mensais.ipva, 
      icon: FileText, 
      color: 'purple',
      description: 'Imposto anual dividido por 12 meses'
    },
    { 
      label: 'Manutenção', 
      value: calculations.custos_mensais.manutencao, 
      icon: Wrench, 
      color: 'green',
      description: 'Revisões, troca de óleo, peças, etc.'
    },
    { 
      label: 'Parcela do Financiamento', 
      value: calculations.custos_mensais.parcela, 
      icon: CreditCard, 
      color: 'pink',
      description: 'Valor mensal do financiamento'
    },
    { 
      label: 'Seguro', 
      value: calculations.custos_mensais.seguro, 
      icon: Shield, 
      color: 'teal',
      description: 'Seguro anual dividido por 12 meses'
    },
    { 
      label: 'Custo CO₂', 
      value: calculations.custos_mensais.co2, 
      icon: Leaf, 
      color: 'emerald',
      description: 'Custo ambiental das emissões (R$50/ton)'
    }
  ];

  const colorMap = {
    blue: 'from-blue-50 to-blue-100/50 text-blue-700 bg-blue-100',
    orange: 'from-orange-50 to-orange-100/50 text-orange-700 bg-orange-100',
    purple: 'from-purple-50 to-purple-100/50 text-purple-700 bg-purple-100',
    green: 'from-green-50 to-green-100/50 text-green-700 bg-green-100',
    pink: 'from-pink-50 to-pink-100/50 text-pink-700 bg-pink-100',
    teal: 'from-teal-50 to-teal-100/50 text-teal-700 bg-teal-100',
    emerald: 'from-emerald-50 to-emerald-100/50 text-emerald-700 bg-emerald-100'
  };

  const total = costs.reduce((sum, cost) => sum + cost.value, 0);

  return (
    <Card className="border-none shadow-xl bg-white">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg font-bold text-slate-800">
          💰 Detalhamento de Custos Mensais - {carName}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {costs.map((cost, index) => {
            const Icon = cost.icon;
            const colors = colorMap[cost.color];
            const percentage = (cost.value / total * 100).toFixed(1);
            
            return (
              <div key={index} className={`p-4 rounded-xl bg-gradient-to-br ${colors.split(' ')[0]} ${colors.split(' ')[1]}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colors.split(' ')[2]}`}>
                      <Icon className={`w-4 h-4 ${colors.split(' ')[3]}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{cost.label}</p>
                      <p className="text-xs text-slate-500">{cost.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-800">{formatCurrency(cost.value)}</p>
                    <p className="text-xs text-slate-500">{percentage}% do total</p>
                  </div>
                </div>
                <div className="w-full bg-white/50 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${colors.split(' ')[2]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-5 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
          <div className="flex items-center justify-between text-white">
            <span className="font-semibold text-lg">Total Mensal (Comprando)</span>
            <span className="text-3xl font-bold">{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}