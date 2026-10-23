import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator, Car, Fuel, Gauge, Trash2, Settings } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useCalculator } from './CalculatorContext';

export default function UserInputForm({ onCalculate, isCalculating, filteredCarsCount }) {
  const { formData, setFormData, clearForm } = useCalculator();

  const tiposVeiculo = [
    { id: 'Hatch', label: 'Hatch' },
    { id: 'Sedan', label: 'Sedan' },
    { id: 'SUV', label: 'SUV' },
    { id: 'Pickup', label: 'Pickup' },
    { id: 'Compacto', label: 'Compacto' }
  ];

  const tiposMotor = [
    { id: 'Gasolina', label: 'Gasolina' },
    { id: 'Etanol', label: 'Etanol' },
    { id: 'Flex', label: 'Flex' },
    { id: 'Diesel', label: 'Diesel' },
    { id: 'Eletricidade', label: 'Elétrico' },
    { id: 'Híbrido', label: 'Híbrido' }
  ];

  const transmissoes = [
    { id: 'Manual', label: 'Manual' },
    { id: 'Automático', label: 'Automático' },
    { id: 'CVT', label: 'CVT' },
    { id: 'Automatizado', label: 'Automatizado' }
  ];

  const motorizacoes = [
    { id: '1.0', label: '1.0' },
    { id: '1.3', label: '1.3' },
    { id: '1.4', label: '1.4' },
    { id: '1.5', label: '1.5' },
    { id: '1.6', label: '1.6' },
    { id: '1.8', label: '1.8' },
    { id: '2.0', label: '2.0' },
    { id: '2.5', label: '2.5' },
    { id: '3.0', label: '3.0' },
    { id: 'Turbo', label: 'Turbo' },
    { id: 'Elétrico', label: 'Elétrico' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      minha_estrada,
      minha_cidade
    };
    onCalculate(dataToSubmit);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  // Calcula estrada/cidade baseado no slider
  const perfilUso = formData.perfil_uso ?? 50;
  const minha_estrada = perfilUso;
  const minha_cidade = 100 - perfilUso;

  // Verifica se o formulário está preenchido para mostrar carros disponíveis
  const isFormFilled = formData.idade && formData.meus_km_ano && formData.n_parcelas;

  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="border-b border-slate-100 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-teal-50 rounded-lg">
              <Calculator className="w-6 h-6 text-teal-600" />
            </div>
            Seus Dados
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            onClick={clearForm}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="idade" className="text-slate-700 font-medium">Sua Idade</Label>
              <Input
                id="idade"
                type="number"
                placeholder="Ex: 30"
                value={formData.idade}
                onChange={(e) => handleChange('idade', e.target.value)}
                required
                className="border-slate-200 focus:border-teal-400 focus:ring-teal-400/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado_civil" className="text-slate-700 font-medium">Estado Civil</Label>
              <Select value={formData.estado_civil} onValueChange={(value) => handleChange('estado_civil', value)}>
                <SelectTrigger className="border-slate-200 focus:border-teal-400 focus:ring-teal-400/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                  <SelectItem value="casado">Casado(a)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meus_km_ano" className="text-slate-700 font-medium">Km por Ano</Label>
              <Input
                id="meus_km_ano"
                type="number"
                placeholder="Ex: 15000"
                value={formData.meus_km_ano}
                onChange={(e) => handleChange('meus_km_ano', e.target.value)}
                required
                className="border-slate-200 focus:border-teal-400 focus:ring-teal-400/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="n_parcelas" className="text-slate-700 font-medium">Número de Parcelas</Label>
              <Input
                id="n_parcelas"
                type="number"
                placeholder="Ex: 48"
                value={formData.n_parcelas}
                onChange={(e) => handleChange('n_parcelas', e.target.value)}
                required
                className="border-slate-200 focus:border-teal-400 focus:ring-teal-400/20"
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label className="text-slate-700 font-medium">Perfil de Uso</Label>
              <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-blue-600">🏙️ Cidade {minha_cidade}%</span>
                  <span className="text-green-600">🛣️ Estrada {minha_estrada}%</span>
                </div>
                <Slider
                  value={[perfilUso]}
                  onValueChange={(value) => handleChange('perfil_uso', value[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>100% Cidade</span>
                  <span>50% / 50%</span>
                  <span>100% Estrada</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="entrada" className="text-slate-700 font-medium">
                Valor da Entrada <span className="text-slate-400 font-normal">(deixe vazio para 30%)</span>
              </Label>
              <Input
                id="entrada"
                type="number"
                placeholder="Ex: 15000"
                value={formData.entrada}
                onChange={(e) => handleChange('entrada', e.target.value)}
                className="border-slate-200 focus:border-teal-400 focus:ring-teal-400/20"
              />
            </div>
          </div>

          {/* Preferências de Veículo */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-slate-800">Preferências de Veículo</h3>
              <span className="text-xs text-slate-500">(opcional - deixe vazio para ver todos)</span>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-slate-700 font-medium mb-3 block">Tipo de Carroceria</Label>
                <div className="flex flex-wrap gap-4">
                  {tiposVeiculo.map((tipo) => (
                    <div key={tipo.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`veiculo-${tipo.id}`}
                        checked={formData.tipo_veiculo.includes(tipo.id)}
                        onCheckedChange={(checked) => handleCheckboxChange('tipo_veiculo', tipo.id, checked)}
                      />
                      <label
                        htmlFor={`veiculo-${tipo.id}`}
                        className="text-sm font-medium leading-none text-slate-700 cursor-pointer"
                      >
                        {tipo.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Fuel className="w-4 h-4 text-green-600" />
                  <Label className="text-slate-700 font-medium">Tipo de Combustível</Label>
                </div>
                <div className="flex flex-wrap gap-4">
                  {tiposMotor.map((tipo) => (
                    <div key={tipo.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`motor-${tipo.id}`}
                        checked={formData.tipo_motor.includes(tipo.id)}
                        onCheckedChange={(checked) => handleCheckboxChange('tipo_motor', tipo.id, checked)}
                      />
                      <label
                        htmlFor={`motor-${tipo.id}`}
                        className={`text-sm font-medium leading-none cursor-pointer ${
                          tipo.id === 'Eletricidade' || tipo.id === 'Híbrido' 
                            ? 'text-green-700' 
                            : 'text-slate-700'
                        }`}
                      >
                        {tipo.label} {(tipo.id === 'Eletricidade' || tipo.id === 'Híbrido') && '🌱'}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Gauge className="w-4 h-4 text-blue-600" />
                  <Label className="text-slate-700 font-medium">Motorização</Label>
                </div>
                <div className="flex flex-wrap gap-4">
                  {motorizacoes.map((motor) => (
                    <div key={motor.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`motorizacao-${motor.id}`}
                        checked={formData.motorizacao.includes(motor.id)}
                        onCheckedChange={(checked) => handleCheckboxChange('motorizacao', motor.id, checked)}
                      />
                      <label
                        htmlFor={`motorizacao-${motor.id}`}
                        className="text-sm font-medium leading-none text-slate-700 cursor-pointer"
                      >
                        {motor.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4 text-orange-600" />
                  <Label className="text-slate-700 font-medium">Transmissão</Label>
                </div>
                <div className="flex flex-wrap gap-4">
                  {transmissoes.map((trans) => (
                    <div key={trans.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`transmissao-${trans.id}`}
                        checked={formData.transmissao?.includes(trans.id)}
                        onCheckedChange={(checked) => handleCheckboxChange('transmissao', trans.id, checked)}
                      />
                      <label
                        htmlFor={`transmissao-${trans.id}`}
                        className="text-sm font-medium leading-none text-slate-700 cursor-pointer"
                      >
                        {trans.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Indicador de Carros Disponíveis */}
          {isFormFilled && (
            <div className={`p-4 rounded-xl border-2 ${
              filteredCarsCount > 0 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                <Car className={`w-5 h-5 ${filteredCarsCount > 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                <p className={`font-medium ${filteredCarsCount > 0 ? 'text-emerald-800' : 'text-red-800'}`}>
                  {filteredCarsCount > 0 
                    ? `✓ ${filteredCarsCount} ${filteredCarsCount === 1 ? 'carro disponível' : 'carros disponíveis'} com seus critérios`
                    : '✗ Nenhum carro disponível com esses critérios. Ajuste os filtros.'
                  }
                </p>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium py-6 rounded-xl shadow-lg shadow-teal-500/20 transition-all"
            disabled={isCalculating || filteredCarsCount === 0}
          >
            {isCalculating ? 'Calculando...' : 'Calcular Melhor Opção'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}