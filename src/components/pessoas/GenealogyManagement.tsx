import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, UserMinus, Users, AlertTriangle, Calendar, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface PessoaImportada {
  id: string;
  nome_completo: string;
  email: string;
  familia_id: string | null;
  created_at: string;
  tem_vinculos: boolean;
}

interface LimpezaResult {
  pessoas_processadas: number;
  familias_removidas: number;
  vinculos_removidos: number;
}

export function GenealogyManagement() {
  const [diasBusca, setDiasBusca] = useState(30);
  const [pessoasSelecionadas, setPessoasSelecionadas] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar pessoas importadas recentemente com vínculos
  const { data: pessoasImportadas, isLoading, refetch } = useQuery({
    queryKey: ['pessoas-importadas', diasBusca],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('buscar_pessoas_importadas_recentemente', {
        p_dias: diasBusca
      });
      
      if (error) {
        console.error('Erro ao buscar pessoas importadas:', error);
        throw error;
      }
      
      return data as PessoaImportada[];
    }
  });

  // Limpeza de genealogia
  const limpezaMutation = useMutation({
    mutationFn: async ({ pessoasIds, resetarTodas }: { pessoasIds?: string[], resetarTodas?: boolean }) => {
      const { data, error } = await supabase.rpc('limpar_genealogia_pessoas', {
        p_pessoa_ids: pessoasIds || null,
        p_resetar_todas: resetarTodas || false
      });
      
      if (error) {
        console.error('Erro na limpeza:', error);
        throw error;
      }
      
      return data[0] as LimpezaResult;
    },
    onSuccess: (result) => {
      toast({
        title: "Limpeza concluída",
        description: `${result.pessoas_processadas} pessoas processadas, ${result.familias_removidas} famílias removidas, ${result.vinculos_removidos} vínculos removidos.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['pessoas-importadas'] });
      setPessoasSelecionadas(new Set());
      refetch();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro na limpeza",
        description: error.message || "Erro desconhecido ao limpar genealogia",
      });
    }
  });

  const toggleSelecaoPessoa = (id: string) => {
    const novaSelecao = new Set(pessoasSelecionadas);
    if (novaSelecao.has(id)) {
      novaSelecao.delete(id);
    } else {
      novaSelecao.add(id);
    }
    setPessoasSelecionadas(novaSelecao);
  };

  const selecionarTodas = () => {
    if (pessoasImportadas) {
      setPessoasSelecionadas(new Set(pessoasImportadas.map(p => p.id)));
    }
  };

  const desselecionarTodas = () => {
    setPessoasSelecionadas(new Set());
  };

  const executarLimpezaSelecionadas = () => {
    if (pessoasSelecionadas.size === 0) {
      toast({
        variant: "destructive",
        title: "Nenhuma pessoa selecionada",
        description: "Selecione pelo menos uma pessoa para limpar.",
      });
      return;
    }

    limpezaMutation.mutate({ pessoasIds: Array.from(pessoasSelecionadas) });
  };

  const executarLimpezaTotal = () => {
    limpezaMutation.mutate({ resetarTodas: true });
  };

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestão de Genealogia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Card de Configuração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestão de Genealogia
          </CardTitle>
          <CardDescription>
            Gerencie e limpe dados genealógicos incorretos gerados durante importações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="dias-busca">Buscar pessoas importadas nos últimos (dias)</Label>
              <Input
                id="dias-busca"
                type="number"
                min="1"
                max="365"
                value={diasBusca}
                onChange={(e) => setDiasBusca(Number(e.target.value))}
                className="w-full sm:w-auto"
              />
            </div>
            <Button onClick={() => refetch()} variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Atualizar Lista
            </Button>
          </div>

          {pessoasImportadas && pessoasImportadas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={selecionarTodas}>
                Selecionar Todas
              </Button>
              <Button size="sm" variant="outline" onClick={desselecionarTodas}>
                Desselecionar Todas
              </Button>
              <span className="text-sm text-muted-foreground flex items-center">
                {pessoasSelecionadas.size} de {pessoasImportadas.length} selecionadas
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Pessoas */}
      {pessoasImportadas && pessoasImportadas.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Pessoas Importadas com Vínculos Familiares
            </CardTitle>
            <CardDescription>
              {pessoasImportadas.length} pessoas encontradas com vínculos familiares nos últimos {diasBusca} dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {pessoasImportadas.map((pessoa) => (
                <div
                  key={pessoa.id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    pessoasSelecionadas.has(pessoa.id) 
                      ? 'bg-primary/10 border-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleSelecaoPessoa(pessoa.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={pessoasSelecionadas.has(pessoa.id)}
                        onChange={() => toggleSelecaoPessoa(pessoa.id)}
                        className="h-4 w-4"
                      />
                      <div>
                        <p className="font-medium truncate">{pessoa.nome_completo}</p>
                        <p className="text-sm text-muted-foreground truncate">{pessoa.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground shrink-0">
                    <p>{formatarData(pessoa.created_at)}</p>
                    <div className="flex items-center gap-1">
                      {pessoa.familia_id && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                          Família
                        </span>
                      )}
                      {pessoa.tem_vinculos && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                          Vínculos
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhuma pessoa encontrada</h3>
            <p className="text-muted-foreground">
              Não há pessoas com vínculos familiares importadas nos últimos {diasBusca} dias.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Ações de Limpeza */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Ações de Limpeza
          </CardTitle>
          <CardDescription>
            Execute limpezas seletivas ou completas dos dados genealógicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Limpeza Seletiva */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline"
                  disabled={pessoasSelecionadas.size === 0 || limpezaMutation.isPending}
                  className="w-full"
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Limpar Selecionadas ({pessoasSelecionadas.size})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Limpeza Seletiva</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação irá remover todos os vínculos familiares das {pessoasSelecionadas.size} pessoas selecionadas.
                    Os dados das pessoas não serão deletados, apenas os vínculos familiares.
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={executarLimpezaSelecionadas}>
                    Confirmar Limpeza
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Limpeza Total */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  disabled={limpezaMutation.isPending}
                  className="w-full"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Limpar Toda Genealogia
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>⚠️ Confirmar Limpeza Total</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p className="font-semibold text-destructive">
                      ATENÇÃO: Esta ação é irreversível!
                    </p>
                    <p>
                      Esta ação irá remover TODOS os vínculos familiares e famílias do sistema.
                      Todas as pessoas terão seus campos de família resetados.
                      Esta ação afeta todo o banco de dados genealógico.
                    </p>
                    <p className="text-sm">
                      Use apenas se tem certeza de que toda a genealogia atual está incorreta.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={executarLimpezaTotal}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Confirmar Limpeza Total
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {limpezaMutation.isPending && (
            <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
              <span>Executando limpeza...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}