import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Trash2, Car, ArrowRight, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import moment from 'moment';

export default function SavedComparisons() {
  const queryClient = useQueryClient();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: allComparisons = [], isLoading } = useQuery({
    queryKey: ['savedComparisons'],
    queryFn: () => base44.entities.SavedComparison.list('-created_date'),
  });

  // Filtrar apenas comparações do usuário logado
  const comparisons = allComparisons.filter(c => c.created_by === user?.email);

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SavedComparison.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedComparisons'] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <Bookmark className="w-12 h-12 text-purple-600 animate-bounce mx-auto mb-4" />
          <p className="text-slate-600">Carregando comparações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/20 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl shadow-xl shadow-purple-500/20 mb-4">
            <Bookmark className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
            Minhas Comparações Salvas
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Visualize e gerencie todas as comparações que você salvou
          </p>
        </div>

        {comparisons.length === 0 ? (
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur text-center py-12">
            <CardContent>
              <Bookmark className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Nenhuma comparação salva</h3>
              <p className="text-slate-500 mb-6">
                Vá para a página de comparação e salve suas análises favoritas
              </p>
              <Link to={createPageUrl('Comparison')}>
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                  Ir para Comparar Carros
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {comparisons.map((comparison) => (
              <Card key={comparison.id} className="border-none shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-800">{comparison.nome}</h3>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {moment(comparison.created_date).format('DD/MM/YYYY')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{comparison.car1_nome}</span>
                        </div>
                        <span className="text-slate-400">vs</span>
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{comparison.car2_nome}</span>
                        </div>
                      </div>

                      {comparison.notas && (
                        <p className="text-sm text-slate-500 mt-2 italic">"{comparison.notas}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`${createPageUrl('Comparison')}?car1=${comparison.car1_id}&car2=${comparison.car2_id}`}>
                        <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                          Ver Comparação
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir comparação?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. A comparação "{comparison.nome}" será removida permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteMutation.mutate(comparison.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}