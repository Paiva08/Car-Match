import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, TreePine, Droplets, Zap } from 'lucide-react';

export default function SustainabilityInfo() {
  return (
    <Card className="border-none shadow-xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full -translate-y-32 translate-x-32" />
      <CardHeader className="relative border-b border-green-100 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500 rounded-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            Por que escolher um carro elétrico?
          </CardTitle>
        </div>
        <p className="text-slate-600">
          A transição para veículos elétricos é essencial para um futuro sustentável
        </p>
      </CardHeader>
      <CardContent className="pt-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="p-3 bg-green-100 rounded-xl h-fit">
              <TreePine className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Zero Emissões Locais</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Carros elétricos não emitem CO₂ durante o uso, contribuindo diretamente para a qualidade do ar nas cidades e redução do efeito estufa.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-blue-100 rounded-xl h-fit">
              <Droplets className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Economia de Combustível</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Eletricidade custa até 70% menos que gasolina por quilômetro rodado, gerando economia significativa ao longo dos anos.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-purple-100 rounded-xl h-fit">
              <Zap className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Manutenção Reduzida</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Motores elétricos têm menos peças móveis, resultando em até 40% menos gastos com manutenção comparado a veículos a combustão.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-amber-100 rounded-xl h-fit">
              <Leaf className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Futuro Sustentável</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A meta global é reduzir 55% das emissões até 2030. Carros elétricos são fundamentais para alcançar esse objetivo.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-5 bg-white/80 backdrop-blur rounded-xl border-2 border-green-200">
          <div className="flex items-start gap-3">
            <Leaf className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-800 mb-1">Impacto Real</h4>
              <p className="text-sm text-slate-700">
                Um carro elétrico pode evitar a emissão de <strong>até 2 toneladas de CO₂ por ano</strong> comparado a um veículo a gasolina, equivalente a plantar 100 árvores anualmente.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}