import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Car, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Cars() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const queryClient = useQueryClient();

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ['cars'],
    queryFn: () => base44.entities.Car.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Car.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['cars']);
      setIsDialogOpen(false);
      setEditingCar(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Car.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['cars']);
      setIsDialogOpen(false);
      setEditingCar(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Car.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['cars']);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      marca: formData.get('marca'),
      modelo: formData.get('modelo'),
      tipo_combustivel: formData.get('tipo_combustivel'),
      ano: parseInt(formData.get('ano')),
      consumo_cidade: parseFloat(formData.get('consumo_cidade')),
      consumo_estrada: parseFloat(formData.get('consumo_estrada')),
      manutencao: parseFloat(formData.get('manutencao')),
      co2: parseFloat(formData.get('co2')),
      valor_carro: parseFloat(formData.get('valor_carro')),
      valor_aluguel: parseFloat(formData.get('valor_aluguel'))
    };

    if (editingCar) {
      updateMutation.mutate({ id: editingCar.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openDialog = (car = null) => {
    setEditingCar(car);
    setIsDialogOpen(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Gerenciar Carros</h1>
            <p className="text-slate-600">Cadastre e gerencie sua base de dados de veículos</p>
          </div>
          <Button 
            onClick={() => openDialog()}
            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Carro
          </Button>
        </div>

        {/* Lista de Carros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800">{car.marca}</CardTitle>
                    <p className="text-slate-600 mt-1">{car.modelo}</p>
                  </div>
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <Car className="w-5 h-5 text-teal-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {car.ano}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {car.tipo_combustivel}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Consumo Cidade</p>
                    <p className="font-semibold text-slate-800">{car.consumo_cidade} km/l</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Consumo Estrada</p>
                    <p className="font-semibold text-slate-800">{car.consumo_estrada} km/l</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Valor FIPE</p>
                    <p className="font-semibold text-slate-800">{formatCurrency(car.valor_carro)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Aluguel/Mês</p>
                    <p className="font-semibold text-slate-800">{formatCurrency(car.valor_aluguel)}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => openDialog(car)}
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteMutation.mutate(car.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog de Formulário */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-800">
                {editingCar ? 'Editar Carro' : 'Novo Carro'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marca">Marca</Label>
                  <Input 
                    id="marca" 
                    name="marca" 
                    defaultValue={editingCar?.marca}
                    required 
                    placeholder="Ex: Toyota"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input 
                    id="modelo" 
                    name="modelo" 
                    defaultValue={editingCar?.modelo}
                    required 
                    placeholder="Ex: Corolla"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo_combustivel">Tipo de Combustível</Label>
                  <Select name="tipo_combustivel" defaultValue={editingCar?.tipo_combustivel || 'Gasolina'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasolina">Gasolina</SelectItem>
                      <SelectItem value="Etanol">Etanol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Eletricidade">Eletricidade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ano">Ano</Label>
                  <Input 
                    id="ano" 
                    name="ano" 
                    type="number" 
                    defaultValue={editingCar?.ano}
                    required 
                    placeholder="Ex: 2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consumo_cidade">Consumo Cidade (km/l)</Label>
                  <Input 
                    id="consumo_cidade" 
                    name="consumo_cidade" 
                    type="number" 
                    step="0.1"
                    defaultValue={editingCar?.consumo_cidade}
                    required 
                    placeholder="Ex: 12.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consumo_estrada">Consumo Estrada (km/l)</Label>
                  <Input 
                    id="consumo_estrada" 
                    name="consumo_estrada" 
                    type="number" 
                    step="0.1"
                    defaultValue={editingCar?.consumo_estrada}
                    required 
                    placeholder="Ex: 15.8"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manutencao">Manutenção (a cada 10.000km)</Label>
                  <Input 
                    id="manutencao" 
                    name="manutencao" 
                    type="number" 
                    step="0.01"
                    defaultValue={editingCar?.manutencao}
                    required 
                    placeholder="Ex: 800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="co2">Emissão CO₂ (g/km)</Label>
                  <Input 
                    id="co2" 
                    name="co2" 
                    type="number" 
                    step="0.01"
                    defaultValue={editingCar?.co2}
                    required 
                    placeholder="Ex: 120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor_carro">Valor FIPE (R$)</Label>
                  <Input 
                    id="valor_carro" 
                    name="valor_carro" 
                    type="number" 
                    step="0.01"
                    defaultValue={editingCar?.valor_carro}
                    required 
                    placeholder="Ex: 85000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor_aluguel">Valor Aluguel Mensal (R$)</Label>
                  <Input 
                    id="valor_aluguel" 
                    name="valor_aluguel" 
                    type="number" 
                    step="0.01"
                    defaultValue={editingCar?.valor_aluguel}
                    required 
                    placeholder="Ex: 2500"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                >
                  {editingCar ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}