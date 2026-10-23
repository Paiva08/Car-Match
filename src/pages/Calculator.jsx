import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import UserInputForm from '../components/calculator/UserInputForm';
import DualResultsDisplay from '../components/calculator/DualResultsDisplay';
import SustainabilityInfo from '../components/calculator/SustainabilityInfo';
import CostBreakdown from '../components/calculator/CostBreakdown';
import { useCalculator } from '../components/calculator/CalculatorContext';
import { Car, AlertCircle, Sliders, ArrowRight, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Calculator() {
  const { formData, budgetRange, setBudgetRange, results, setResults } = useCalculator();
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [minBudget, setMinBudget] = useState(budgetRange.min);
  const [maxBudget, setMaxBudget] = useState(budgetRange.max);
  const [lastUserData, setLastUserData] = useState(null);

  useEffect(() => {
    setBudgetRange({ min: minBudget, max: maxBudget });
  }, [minBudget, maxBudget]);

  const bestEconomic = results.bestEconomic;
  const bestSustainable = results.bestSustainable;

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ['cars'],
    queryFn: () => base44.entities.Car.list(),
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Calcula carros filtrados baseado nos critérios atuais
  const filteredCarsCount = useMemo(() => {
    let filtered = cars.filter(car => 
      car.valor_carro >= minBudget && car.valor_carro <= maxBudget
    );

    if (formData.tipo_veiculo?.length > 0) {
      filtered = filtered.filter(car => formData.tipo_veiculo.includes(car.tipo_veiculo));
    }

    if (formData.tipo_motor?.length > 0) {
      filtered = filtered.filter(car => formData.tipo_motor.includes(car.tipo_combustivel));
    }

    if (formData.motorizacao?.length > 0) {
      filtered = filtered.filter(car => formData.motorizacao.includes(car.motorizacao));
    }

    if (formData.transmissao?.length > 0) {
      filtered = filtered.filter(car => formData.transmissao.includes(car.transmissao));
    }

    return filtered.length;
  }, [cars, minBudget, maxBudget, formData.tipo_veiculo, formData.tipo_motor, formData.motorizacao, formData.transmissao]);

  const calculateBestCar = async (userData, excludeIds = []) => {
    setIsCalculating(true);
    setLastUserData(userData);
    
    try {
      const idade = parseInt(userData.idade);
      const meus_km_ano = parseFloat(userData.meus_km_ano);
      const minha_estrada = parseFloat(userData.minha_estrada) / 100;
      const minha_cidade = parseFloat(userData.minha_cidade) / 100;
      const n_parcelas = parseInt(userData.n_parcelas);
      const estado_civil = userData.estado_civil;
      const entrada_input = userData.entrada ? parseFloat(userData.entrada) : null;
      const tipoVeiculoFilter = userData.tipo_veiculo || [];
      const tipoMotorFilter = userData.tipo_motor || [];
      const motorizacaoFilter = userData.motorizacao || [];
      const transmissaoFilter = userData.transmissao || [];

      let filteredCars = cars.filter(car => 
        car.valor_carro >= minBudget && car.valor_carro <= maxBudget
      );

      // Excluir carros já sugeridos
      if (excludeIds.length > 0) {
        filteredCars = filteredCars.filter(car => !excludeIds.includes(car.id));
      }

      if (tipoVeiculoFilter.length > 0) {
        filteredCars = filteredCars.filter(car => tipoVeiculoFilter.includes(car.tipo_veiculo));
      }

      if (tipoMotorFilter.length > 0) {
        filteredCars = filteredCars.filter(car => tipoMotorFilter.includes(car.tipo_combustivel));
      }

      if (motorizacaoFilter.length > 0) {
        filteredCars = filteredCars.filter(car => motorizacaoFilter.includes(car.motorizacao));
      }

      if (transmissaoFilter.length > 0) {
        filteredCars = filteredCars.filter(car => transmissaoFilter.includes(car.transmissao));
      }

      if (filteredCars.length === 0) {
        setResults(prev => ({
          ...prev,
          bestEconomic: null,
          bestSustainable: null,
          allFilteredCars: []
        }));
        setIsCalculating(false);
        return;
      }

      const currentYear = new Date().getFullYear();
      
      const precos_combustivel = {
        'Gasolina': 6.08,
        'Etanol': 3.95,
        'Diesel': 6.15,
        'Eletricidade': 1.8,
        'Híbrido': 5.50
      };

      let bestEconomicCar = null;
      let lowestCost = Infinity;
      let bestEconomicCalculations = null;
      let bestEconomicComparison = null;

      let bestSustainableCar = null;
      let lowestCO2 = Infinity;
      let bestSustainableCalculations = null;
      let bestSustainableComparison = null;

      for (const car of filteredCars) {
        let custos_totais = 0;
        let valor_carro_atual = car.valor_carro;
        let entrada = entrada_input !== null ? entrada_input : car.valor_carro * 0.3;
        let preco_combustivel = precos_combustivel[car.tipo_combustivel];
        let km_total = 0;

        let custos_mensais_comprado = [];
        let custos_mensais_alugado = [];
        let fator_seguro = 0.04;
        if (estado_civil === 'solteiro') fator_seguro += 0.01;
        if (idade >= 18 && idade <= 28) fator_seguro += 0.01;
        if (idade >= 36 && idade <= 46 && estado_civil === 'casado') fator_seguro += 0.01;

        for (let mes = 1; mes <= n_parcelas; mes++) {
          const ano_atual = Math.floor((mes - 1) / 12);
          
          const preco_combustivel_ano = preco_combustivel * Math.pow(1.05, ano_atual);
          
          const custo_combustivel = (meus_km_ano / 12) * (minha_estrada / car.consumo_estrada) * preco_combustivel_ano +
                                   (meus_km_ano / 12) * (minha_cidade / car.consumo_cidade) * preco_combustivel_ano;
          
          let desvalorizacao = 0.085;
          if (car.ano === currentYear && ano_atual === 0) {
            desvalorizacao = 0.17;
          } else {
            desvalorizacao = 0.085 * Math.pow(0.85, ano_atual);
          }
          const custo_depreciacao = valor_carro_atual * desvalorizacao / 12;
          
          const custo_ipva = valor_carro_atual * 0.04 / 12;
          
          km_total += meus_km_ano / 12;
          let fator_manutencao = km_total >= 60000 ? 2 : 1;
          const custo_manutencao = (meus_km_ano / 12) * car.manutencao / 10000 * fator_manutencao;
          
          const taxa = 0.018;
          const parcela = (car.valor_carro - entrada) * (taxa * Math.pow(1 + taxa, n_parcelas)) / 
                         (Math.pow(1 + taxa, n_parcelas) - 1);
          
          const custo_seguro = valor_carro_atual * fator_seguro / 12;
          
          const co2_gerado = (meus_km_ano / 12) * car.co2 * 50 / 1000000 * Math.pow(1.06, ano_atual);
          
          const custo_mensal_comprado = custo_combustivel + custo_depreciacao + custo_ipva + 
                                       custo_manutencao + parcela + custo_seguro + co2_gerado;
          custos_mensais_comprado.push(custo_mensal_comprado);
          
          const custo_mensal_alugado = car.valor_aluguel + custo_combustivel + custo_seguro + co2_gerado;
          custos_mensais_alugado.push(custo_mensal_alugado);
          
          custos_totais += custo_mensal_comprado;
          
          if (mes % 12 === 0) {
            valor_carro_atual *= (1 - desvalorizacao * 12);
          }
        }

        let valor_venda = car.valor_carro;
        for (let ano = 0; ano < Math.ceil(n_parcelas / 12); ano++) {
          let desval_ano = (car.ano === currentYear && ano === 0) ? 0.17 : 0.085 * Math.pow(0.85, ano);
          valor_venda *= (1 - desval_ano);
        }

        const total_comprado = custos_mensais_comprado.reduce((a, b) => a + b, 0) + entrada - valor_venda;
        const total_alugado = custos_mensais_alugado.reduce((a, b) => a + b, 0);

        let recomendacao = total_comprado < total_alugado ? 'comprar' : 'alugar';
        let economia = Math.abs(total_comprado - total_alugado);

        let segundo_horizonte = null;
        if (recomendacao === 'alugar') {
          const custo_mensal_sem_parcela = custos_mensais_comprado[custos_mensais_comprado.length - 1] - 
                                          (car.valor_carro - entrada) * (0.018 * Math.pow(1.018, n_parcelas)) / 
                                          (Math.pow(1.018, n_parcelas) - 1);
          
          let total_comprado_h2 = total_comprado;
          let total_alugado_h2 = total_alugado;
          let meses_adicionais = 0;
          let valor_venda_h2 = valor_venda;

          while (total_comprado_h2 > total_alugado_h2 && meses_adicionais < 240) {
            meses_adicionais++;
            total_comprado_h2 += custo_mensal_sem_parcela;
            total_alugado_h2 += custos_mensais_alugado[custos_mensais_alugado.length - 1];
            
            if (meses_adicionais % 12 === 0) {
              const ano_adicional = Math.floor((n_parcelas + meses_adicionais - 1) / 12);
              const desval = 0.085 * Math.pow(0.85, ano_adicional);
              valor_venda_h2 *= (1 - desval);
              total_comprado_h2 = total_comprado + custo_mensal_sem_parcela * meses_adicionais - valor_venda_h2 + entrada;
            }
          }

          segundo_horizonte = {
            meses_ate_empate: meses_adicionais,
            total_comprado: total_comprado_h2,
            total_alugado: total_alugado_h2
          };
        }

        const custo_comparacao = custos_totais;
        const co2_total = car.co2 * (meus_km_ano * Math.ceil(n_parcelas / 12));

        const custos_calc = {
          combustivel: (meus_km_ano / 12) * (minha_estrada / car.consumo_estrada) * precos_combustivel[car.tipo_combustivel] +
                      (meus_km_ano / 12) * (minha_cidade / car.consumo_cidade) * precos_combustivel[car.tipo_combustivel],
          depreciacao: valor_carro_atual * 0.085 / 12,
          ipva: car.valor_carro * 0.04 / 12,
          manutencao: (meus_km_ano / 12) * car.manutencao / 10000,
          parcela: (car.valor_carro - entrada) * (0.018 * Math.pow(1.018, n_parcelas)) / 
                  (Math.pow(1.018, n_parcelas) - 1),
          seguro: car.valor_carro * fator_seguro / 12,
          co2: (meus_km_ano / 12) * car.co2 * 50 / 1000000
        };

        if (custo_comparacao < lowestCost) {
          lowestCost = custo_comparacao;
          bestEconomicCar = car;
          
          const media_comprado = custos_mensais_comprado.reduce((a, b) => a + b, 0) / n_parcelas;
          const media_alugado = custos_mensais_alugado.reduce((a, b) => a + b, 0) / n_parcelas;
          
          bestEconomicCalculations = {
            custo_mensal_comprado: media_comprado,
            custo_mensal_alugado: media_alugado,
            custos_mensais: custos_calc
          };

          bestEconomicComparison = {
            total_comprado,
            total_alugado,
            valor_venda,
            entrada,
            n_parcelas,
            recomendacao,
            economia,
            segundo_horizonte
          };
        }

        if (co2_total < lowestCO2) {
          lowestCO2 = co2_total;
          bestSustainableCar = car;
          
          const media_comprado = custos_mensais_comprado.reduce((a, b) => a + b, 0) / n_parcelas;
          const media_alugado = custos_mensais_alugado.reduce((a, b) => a + b, 0) / n_parcelas;
          
          bestSustainableCalculations = {
            custo_mensal_comprado: media_comprado,
            custo_mensal_alugado: media_alugado,
            custos_mensais: custos_calc
          };

          bestSustainableComparison = {
            total_comprado,
            total_alugado,
            valor_venda,
            entrada,
            n_parcelas,
            recomendacao,
            economia,
            segundo_horizonte
          };
        }
      }

      const newExcludedIds = [...excludeIds];
      if (bestEconomicCar) newExcludedIds.push(bestEconomicCar.id);
      if (bestSustainableCar && bestSustainableCar.id !== bestEconomicCar?.id) {
        newExcludedIds.push(bestSustainableCar.id);
      }

      setResults({
        bestEconomic: bestEconomicCar ? {
          bestCar: bestEconomicCar,
          calculations: bestEconomicCalculations,
          comparison: bestEconomicComparison
        } : null,
        bestSustainable: bestSustainableCar ? {
          bestCar: bestSustainableCar,
          calculations: bestSustainableCalculations,
          comparison: bestSustainableComparison
        } : null,
        allFilteredCars: filteredCars,
        excludedCarIds: newExcludedIds
      });
    } catch (error) {
      console.error('Erro ao calcular:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSuggestAnother = () => {
    if (lastUserData) {
      calculateBestCar(lastUserData, results.excludedCarIds || []);
    }
  };

  const remainingCarsCount = useMemo(() => {
    if (!results.allFilteredCars) return 0;
    const excluded = results.excludedCarIds || [];
    return results.allFilteredCars.filter(car => !excluded.includes(car.id)).length;
  }, [results.allFilteredCars, results.excludedCarIds]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/20 flex items-center justify-center">
        <div className="text-center">
          <Car className="w-12 h-12 text-teal-600 animate-bounce mx-auto mb-4" />
          <p className="text-slate-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/20 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl shadow-xl shadow-teal-500/20 mb-4">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
            Calculadora de Carros
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Defina seu orçamento e descubra qual carro é o mais econômico e sustentável para você
          </p>
        </div>

        {cars.length === 0 ? (
          <Alert className="max-w-2xl mx-auto border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Nenhum carro cadastrado na base de dados.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur max-w-3xl mx-auto">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-teal-600" />
                  Qual sua faixa de orçamento?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-slate-700">Valor mínimo do carro</Label>
                      <span className="text-xl font-bold text-slate-600">
                        {formatCurrency(minBudget)}
                      </span>
                    </div>
                    <Slider
                      value={[minBudget]}
                      onValueChange={(value) => setMinBudget(Math.min(value[0], maxBudget - 10000))}
                      min={30000}
                      max={350000}
                      step={5000}
                      className="py-2"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-slate-700">Valor máximo do carro</Label>
                      <span className="text-2xl font-bold text-teal-600">
                        {formatCurrency(maxBudget)}
                      </span>
                    </div>
                    <Slider
                      value={[maxBudget]}
                      onValueChange={(value) => setMaxBudget(Math.max(value[0], minBudget + 10000))}
                      min={30000}
                      max={350000}
                      step={5000}
                      className="py-2"
                    />
                  </div>

                  <div className="p-4 bg-teal-50 rounded-xl">
                    <p className="text-sm text-teal-800 font-medium">
                      {cars.filter(car => car.valor_carro >= minBudget && car.valor_carro <= maxBudget).length} carros disponíveis na faixa de {formatCurrency(minBudget)} a {formatCurrency(maxBudget)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <SustainabilityInfo />
            <UserInputForm 
              onCalculate={calculateBestCar} 
              isCalculating={isCalculating} 
              filteredCarsCount={filteredCarsCount}
            />
            
            {(bestEconomic || bestSustainable) && (
              <>
                <DualResultsDisplay bestEconomic={bestEconomic} bestSustainable={bestSustainable} />
                
                {/* Botão Sugerir Outro */}
                {remainingCarsCount > 0 && (
                  <div className="flex justify-center">
                    <Button
                      onClick={handleSuggestAnother}
                      variant="outline"
                      className="border-2 border-teal-300 text-teal-700 hover:bg-teal-50 py-5 px-6 rounded-xl"
                      disabled={isCalculating}
                    >
                      <RefreshCw className={`w-5 h-5 mr-2 ${isCalculating ? 'animate-spin' : ''}`} />
                      Me sugerir outro carro ({remainingCarsCount} restantes)
                    </Button>
                  </div>
                )}
                
                {/* Detalhamento de Custos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {bestEconomic && (
                    <CostBreakdown 
                      calculations={bestEconomic.calculations} 
                      carName={`${bestEconomic.bestCar.marca} ${bestEconomic.bestCar.modelo}`}
                    />
                  )}
                  {bestSustainable && bestSustainable.bestCar.id !== bestEconomic?.bestCar?.id && (
                    <CostBreakdown 
                      calculations={bestSustainable.calculations} 
                      carName={`${bestSustainable.bestCar.marca} ${bestSustainable.bestCar.modelo}`}
                    />
                  )}
                </div>

                {/* Botão Ver Comparação */}
                <div className="flex justify-center pt-6">
                  <Link to={createPageUrl('Comparison')}>
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-6 px-8 rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-lg">
                      Ver Comparação Detalhada
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}