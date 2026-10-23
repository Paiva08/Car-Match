import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Car, Fuel, DollarSign, Leaf, Wrench, TrendingDown, Zap, Bookmark, Save, Check } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useCalculator } from '../components/calculator/CalculatorContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Comparison() {
  const { results } = useCalculator();
  const queryClient = useQueryClient();
  
  const [car1Id, setCar1Id] = useState(null);
  const [car2Id, setCar2Id] = useState(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveNotes, setSaveNotes] = useState('');

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ['cars'],
    queryFn: () => base44.entities.Car.list(),
  });

  // Verifica URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCar1 = urlParams.get('car1');
    const urlCar2 = urlParams.get('car2');
    
    if (urlCar1 && urlCar2 && cars.length > 0) {
      setCar1Id(urlCar1);
      setCar2Id(urlCar2);
    } else if (cars.length > 0 && results.bestEconomic && results.bestSustainable) {
      setCar1Id(results.bestEconomic.bestCar.id);
      setCar2Id(results.bestSustainable.bestCar.id);
    }
  }, [cars, results]);

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.SavedComparison.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedComparisons'] });
      setSaveDialogOpen(false);
      setSaveName('');
      setSaveNotes('');
      toast.success('Comparação salva com sucesso!');
    },
  });

  const car1 = cars.find(c => c.id === car1Id);
  const car2 = cars.find(c => c.id === car2Id);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleSaveComparison = () => {
    if (!saveName.trim() || !car1 || !car2) return;
    
    saveMutation.mutate({
      nome: saveName.trim(),
      car1_id: car1Id,
      car2_id: car2Id,
      car1_nome: `${car1.marca} ${car1.modelo}`,
      car2_nome: `${car2.marca} ${car2.modelo}`,
      notas: saveNotes.trim()
    });
  };

  const ComparisonCard = ({ car, position, label }) => {
    if (!car) {
      return (
        <div className="h-full flex items-center justify-center p-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="text-center">
            <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Selecione um carro {position}</p>
          </div>
        </div>
      );
    }

    return (
      <Card className="border-none shadow-xl bg-gradient-to-br from-white to-slate-50/50 h-full">
        <CardHeader className="pb-4 border-b border-slate-100">
          {/* Foto do carro */}
          {car.foto_url && (
            <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-slate-100">
              <img 
                src={car.foto_url} 
                alt={`${car.marca} ${car.modelo}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex items-start justify-between mb-3">
            <div>
              {label && (
                <Badge className={`mb-2 ${label === 'Melhor Custo-Benefício' ? 'bg-blue-600' : 'bg-green-600'} text-white`}>
                  {label}
                </Badge>
              )}
              <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                {car.marca}
              </CardTitle>
              <p className="text-lg text-slate-600">{car.modelo}</p>
            </div>
            {!car.foto_url && (
              <div className="p-3 bg-teal-50 rounded-xl">
                <Car className="w-6 h-6 text-teal-600" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              {car.ano}
            </Badge>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              {car.tipo_combustivel}
            </Badge>
            {car.tipo_veiculo && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                {car.tipo_veiculo}
              </Badge>
            )}
            {car.motorizacao && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                {car.motorizacao}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Valores */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">Valor FIPE</p>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(car.valor_carro)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">Aluguel Mensal</p>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(car.valor_aluguel)}</p>
              </div>
            </div>
          </div>

          {/* Autonomia */}
          {car.autonomia && (
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
              <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">Autonomia</p>
                <p className="text-2xl font-bold text-slate-800">{car.autonomia} km</p>
              </div>
            </div>
          )}

          {/* Consumo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <Fuel className="w-4 h-4" />
              <span>Consumo</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Cidade</p>
                <p className="text-lg font-bold text-slate-800">{car.consumo_cidade} {car.tipo_combustivel === 'Eletricidade' ? 'km/kWh' : 'km/l'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Estrada</p>
                <p className="text-lg font-bold text-slate-800">{car.consumo_estrada} {car.tipo_combustivel === 'Eletricidade' ? 'km/kWh' : 'km/l'}</p>
              </div>
            </div>
          </div>

          {/* Outros Dados */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-slate-600">Manutenção (10k km)</span>
              </div>
              <span className="font-bold text-slate-800">{formatCurrency(car.manutencao)}</span>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${
              car.co2 === 0 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <Leaf className={`w-5 h-5 ${car.co2 === 0 ? 'text-green-600' : 'text-orange-600'}`} />
                <span className="text-sm font-semibold text-slate-700">Emissão CO₂</span>
              </div>
              <div className="text-right">
                <span className={`font-bold text-lg ${car.co2 === 0 ? 'text-green-700' : 'text-slate-800'}`}>
                  {car.co2} g/km
                </span>
                {car.co2 === 0 && (
                  <p className="text-xs text-green-600 font-medium">Zero Emissões! 🌱</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ComparisonBadge = ({ label, value1, value2, isLower, formatter = (v) => v }) => {
    const isCar1Better = isLower ? value1 < value2 : value1 > value2;
    const isCar2Better = isLower ? value2 < value1 : value2 > value1;

    return (
      <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
        <p className="text-sm text-slate-600 mb-3 font-medium text-center">{label}</p>
        <div className="grid grid-cols-3 gap-2 items-center">
          <div className={`text-center p-2 rounded-lg ${isCar1Better ? 'bg-emerald-100' : 'bg-slate-50'}`}>
            <p className={`font-bold ${isCar1Better ? 'text-emerald-700' : 'text-slate-700'}`}>
              {formatter(value1)}
            </p>
          </div>
          <div className="flex justify-center">
            {isCar1Better && <TrendingDown className="w-4 h-4 text-emerald-600" />}
            {isCar2Better && <TrendingDown className="w-4 h-4 text-emerald-600 rotate-180" />}
          </div>
          <div className={`text-center p-2 rounded-lg ${isCar2Better ? 'bg-emerald-100' : 'bg-slate-50'}`}>
            <p className={`font-bold ${isCar2Better ? 'text-emerald-700' : 'text-slate-700'}`}>
              {formatter(value2)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Custos mensais estimados
  const calculateMonthlyCosts = (car) => {
    if (!car) return null;
    
    const kmMensal = 1250; // 15000 km/ano
    const percentCidade = 0.6;
    const percentEstrada = 0.4;
    
    const precos = {
      'Gasolina': 6.08,
      'Etanol': 3.95,
      'Diesel': 6.15,
      'Eletricidade': 1.8,
      'Híbrido': 5.50
    };
    
    const precoCombustivel = precos[car.tipo_combustivel] || 6.08;
    
    const consumoMedio = (car.consumo_cidade * percentCidade + car.consumo_estrada * percentEstrada);
    const custoCombustivel = (kmMensal / consumoMedio) * precoCombustivel;
    const custoManutencao = (kmMensal * car.manutencao) / 10000;
    const custoIPVA = car.valor_carro * 0.04 / 12;
    const custoSeguro = car.valor_carro * 0.04 / 12;
    const custoDepreciacao = car.valor_carro * 0.08 / 12;
    
    return {
      combustivel: custoCombustivel,
      manutencao: custoManutencao,
      ipva: custoIPVA,
      seguro: custoSeguro,
      depreciacao: custoDepreciacao,
      total: custoCombustivel + custoManutencao + custoIPVA + custoSeguro + custoDepreciacao
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <Car className="w-12 h-12 text-teal-600 animate-bounce mx-auto mb-4" />
          <p className="text-slate-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  const getCar1Label = () => {
    if (results.bestEconomic && car1Id === results.bestEconomic.bestCar.id) {
      return 'Melhor Custo-Benefício';
    }
    if (results.bestSustainable && car1Id === results.bestSustainable.bestCar.id) {
      return 'Mais Sustentável';
    }
    return null;
  };

  const getCar2Label = () => {
    if (results.bestSustainable && car2Id === results.bestSustainable.bestCar.id) {
      return 'Mais Sustentável';
    }
    if (results.bestEconomic && car2Id === results.bestEconomic.bestCar.id) {
      return 'Melhor Custo-Benefício';
    }
    return null;
  };

  const car1Costs = calculateMonthlyCosts(car1);
  const car2Costs = calculateMonthlyCosts(car2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-xl shadow-blue-500/20 mb-4">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
            Comparar Carros
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {results.bestEconomic && results.bestSustainable 
              ? 'Comparando os carros recomendados baseados no seu perfil'
              : 'Selecione dois carros e compare lado a lado todas as especificações'
            }
          </p>
        </div>

        {cars.length < 2 ? (
          <Alert className="max-w-2xl mx-auto border-orange-200 bg-orange-50">
            <AlertDescription className="text-orange-800">
              É necessário ter pelo menos 2 carros cadastrados para fazer comparações.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Seletores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <Label className="text-slate-700 mb-2 block">Primeiro Carro</Label>
                  <Select value={car1Id || ''} onValueChange={setCar1Id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cars.map(car => (
                        <SelectItem key={car.id} value={car.id} disabled={car.id === car2Id}>
                          {car.marca} {car.modelo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <div className="hidden md:flex items-center justify-center">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              </div>

              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <Label className="text-slate-700 mb-2 block">Segundo Carro</Label>
                  <Select value={car2Id || ''} onValueChange={setCar2Id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cars.map(car => (
                        <SelectItem key={car.id} value={car.id} disabled={car.id === car1Id}>
                          {car.marca} {car.modelo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            {/* Botão Salvar Comparação */}
            {car1 && car2 && (
              <div className="flex justify-center">
                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Salvar esta Comparação
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Salvar Comparação</DialogTitle>
                      <DialogDescription>
                        Dê um nome para esta comparação e adicione notas se desejar.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Nome da Comparação</Label>
                        <Input
                          placeholder="Ex: Comparação SUVs 2024"
                          value={saveName}
                          onChange={(e) => setSaveName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Notas (opcional)</Label>
                        <Textarea
                          placeholder="Adicione observações sobre esta comparação..."
                          value={saveNotes}
                          onChange={(e) => setSaveNotes(e.target.value)}
                        />
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                        <p><strong>Carro 1:</strong> {car1.marca} {car1.modelo}</p>
                        <p><strong>Carro 2:</strong> {car2.marca} {car2.modelo}</p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleSaveComparison}
                        disabled={!saveName.trim() || saveMutation.isPending}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
                        <Save className="w-4 h-4 ml-2" />
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Cards de Comparação */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ComparisonCard car={car1} position="1" label={getCar1Label()} />
              <ComparisonCard car={car2} position="2" label={getCar2Label()} />
            </div>

            {/* Comparação Direta */}
            {car1 && car2 && (
              <>
                {/* Custos Mensais Detalhados */}
                <Card className="border-none shadow-xl bg-gradient-to-br from-white to-slate-50">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                      Custos Mensais Detalhados
                    </CardTitle>
                    <p className="text-sm text-slate-600 mt-2">
                      Estimativa baseada em 15.000 km/ano (60% cidade, 40% estrada)
                    </p>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Carro 1 */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg text-slate-800 mb-4">{car1.marca} {car1.modelo}</h3>
                        {car1Costs && (
                          <>
                            <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                              <span className="text-slate-700">Combustível</span>
                              <span className="font-bold text-orange-700">{formatCurrency(car1Costs.combustivel)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                              <span className="text-slate-700">Manutenção</span>
                              <span className="font-bold text-blue-700">{formatCurrency(car1Costs.manutencao)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                              <span className="text-slate-700">IPVA</span>
                              <span className="font-bold text-purple-700">{formatCurrency(car1Costs.ipva)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-teal-50 rounded-lg">
                              <span className="text-slate-700">Seguro</span>
                              <span className="font-bold text-teal-700">{formatCurrency(car1Costs.seguro)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                              <span className="text-slate-700">Depreciação</span>
                              <span className="font-bold text-red-700">{formatCurrency(car1Costs.depreciacao)}</span>
                            </div>
                            <div className="flex justify-between p-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg text-white">
                              <span className="font-semibold">Total Mensal</span>
                              <span className="font-bold text-xl">{formatCurrency(car1Costs.total)}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Carro 2 */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg text-slate-800 mb-4">{car2.marca} {car2.modelo}</h3>
                        {car2Costs && (
                          <>
                            <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                              <span className="text-slate-700">Combustível</span>
                              <span className="font-bold text-orange-700">{formatCurrency(car2Costs.combustivel)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                              <span className="text-slate-700">Manutenção</span>
                              <span className="font-bold text-blue-700">{formatCurrency(car2Costs.manutencao)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                              <span className="text-slate-700">IPVA</span>
                              <span className="font-bold text-purple-700">{formatCurrency(car2Costs.ipva)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-teal-50 rounded-lg">
                              <span className="text-slate-700">Seguro</span>
                              <span className="font-bold text-teal-700">{formatCurrency(car2Costs.seguro)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                              <span className="text-slate-700">Depreciação</span>
                              <span className="font-bold text-red-700">{formatCurrency(car2Costs.depreciacao)}</span>
                            </div>
                            <div className="flex justify-between p-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg text-white">
                              <span className="font-semibold">Total Mensal</span>
                              <span className="font-bold text-xl">{formatCurrency(car2Costs.total)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Diferença */}
                    {car1Costs && car2Costs && (
                      <div className="mt-6 p-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white text-center">
                        <p className="text-sm opacity-90 mb-2">Economia Mensal Escolhendo o Mais Barato</p>
                        <p className="text-3xl font-bold">
                          {formatCurrency(Math.abs(car1Costs.total - car2Costs.total))}
                        </p>
                        <p className="text-sm opacity-90 mt-2">
                          {car1Costs.total < car2Costs.total 
                            ? `${car1.marca} ${car1.modelo} é mais econômico`
                            : `${car2.marca} ${car2.modelo} é mais econômico`
                          }
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Impacto Ambiental em Destaque */}
                <Card className="border-none shadow-xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
                  <CardHeader className="border-b border-green-100">
                    <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <Leaf className="w-6 h-6 text-green-600" />
                      Impacto Ambiental - CO₂
                    </CardTitle>
                    <p className="text-sm text-slate-600 mt-2">
                      A diferença de emissões entre os veículos ao longo de um ano
                    </p>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                        <p className="text-sm text-slate-600 mb-2">{car1.marca} {car1.modelo}</p>
                        <p className="text-4xl font-bold text-slate-800 mb-1">{car1.co2}</p>
                        <p className="text-xs text-slate-500">g/km de CO₂</p>
                        {car1.co2 === 0 && (
                          <Badge className="mt-3 bg-green-600">Zero Emissões 🌱</Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full inline-block mb-3">
                            <Leaf className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-sm font-semibold text-slate-700">Diferença Anual</p>
                          <p className="text-3xl font-bold text-green-600 mt-2">
                            {Math.abs(car1.co2 - car2.co2) === 0 
                              ? 'Iguais' 
                              : `${(Math.abs(car1.co2 - car2.co2) * 15000 / 1000).toFixed(1)} kg`
                            }
                          </p>
                          {Math.abs(car1.co2 - car2.co2) > 0 && (
                            <p className="text-xs text-slate-600 mt-2">
                              (considerando 15.000 km/ano)
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                        <p className="text-sm text-slate-600 mb-2">{car2.marca} {car2.modelo}</p>
                        <p className="text-4xl font-bold text-slate-800 mb-1">{car2.co2}</p>
                        <p className="text-xs text-slate-500">g/km de CO₂</p>
                        {car2.co2 === 0 && (
                          <Badge className="mt-3 bg-green-600">Zero Emissões 🌱</Badge>
                        )}
                      </div>
                    </div>

                    {(car1.co2 === 0 || car2.co2 === 0) && (
                      <div className="mt-6 p-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                        <div className="flex items-start gap-3 text-white">
                          <Leaf className="w-6 h-6 mt-0.5" />
                          <div>
                            <h4 className="font-semibold mb-2">🌍 Impacto Positivo no Planeta</h4>
                            <p className="text-sm text-white/90">
                              O veículo elétrico evita a emissão de aproximadamente{' '}
                              <strong>
                                {Math.max(car1.co2, car2.co2) === 0 
                                  ? '0' 
                                  : (Math.max(car1.co2, car2.co2) * 15000 / 1000 / 1000).toFixed(1)
                                } toneladas de CO₂ por ano
                              </strong>, equivalente a plantar {Math.round(Math.max(car1.co2, car2.co2) * 15000 / 1000 / 20)} árvores!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-gradient-to-br from-white to-slate-50">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className="text-xl font-bold text-slate-800">
                      Comparação de Especificações
                    </CardTitle>
                    <p className="text-sm text-slate-600">
                      Valores menores (em verde) são melhores, exceto para consumo e autonomia onde maior é melhor
                    </p>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ComparisonBadge
                        label="Valor do Carro"
                        value1={car1.valor_carro}
                        value2={car2.valor_carro}
                        isLower={true}
                        formatter={formatCurrency}
                      />
                      <ComparisonBadge
                        label="Aluguel Mensal"
                        value1={car1.valor_aluguel}
                        value2={car2.valor_aluguel}
                        isLower={true}
                        formatter={formatCurrency}
                      />
                      <ComparisonBadge
                        label="Autonomia"
                        value1={car1.autonomia || 0}
                        value2={car2.autonomia || 0}
                        isLower={false}
                        formatter={(v) => `${v} km`}
                      />
                      <ComparisonBadge
                        label="Consumo Cidade"
                        value1={car1.consumo_cidade}
                        value2={car2.consumo_cidade}
                        isLower={false}
                        formatter={(v) => `${v} km/l`}
                      />
                      <ComparisonBadge
                        label="Consumo Estrada"
                        value1={car1.consumo_estrada}
                        value2={car2.consumo_estrada}
                        isLower={false}
                        formatter={(v) => `${v} km/l`}
                      />
                      <ComparisonBadge
                        label="Manutenção (10k km)"
                        value1={car1.manutencao}
                        value2={car2.manutencao}
                        isLower={true}
                        formatter={formatCurrency}
                      />
                      <ComparisonBadge
                        label="Emissão CO₂"
                        value1={car1.co2}
                        value2={car2.co2}
                        isLower={true}
                        formatter={(v) => `${v} g/km`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}