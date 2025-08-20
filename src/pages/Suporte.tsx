import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, MessageSquare, Book, Video, Phone, Mail } from 'lucide-react';
import { ChatbotSupporte } from '@/components/suporte/ChatbotSupporte';

export default function Suporte() {
  const recursosSupporte = [
    {
      icon: <Book className="h-6 w-6" />,
      title: 'Documentação',
      description: 'Guias completos e tutoriais detalhados',
      link: '#'
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: 'Vídeo Tutoriais',
      description: 'Aprenda visualmente como usar a plataforma',
      link: '#'
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Suporte por Telefone',
      description: 'Ligue para nossa equipe de suporte',
      link: 'tel:+5511999999999'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email de Suporte',
      description: 'Envie sua dúvida por email',
      link: 'mailto:suporte@kerigmahub.com'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Suporte - Kerigma Hub</title>
        <meta name="description" content="Central de ajuda e suporte da plataforma Kerigma Hub. Chat inteligente, tutoriais e recursos de apoio." />
        <meta property="og:title" content="Suporte - Kerigma Hub" />
        <meta property="og:description" content="Central de ajuda e suporte da plataforma Kerigma Hub. Chat inteligente, tutoriais e recursos de apoio." />
      </Helmet>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Central de Suporte</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre respostas para suas dúvidas sobre a plataforma Kerigma Hub. 
            Use nosso assistente inteligente ou explore nossos recursos de ajuda.
          </p>
        </div>

        {/* Assistente Inteligente */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Assistente Inteligente</h2>
            </div>
            <p className="text-muted-foreground">
              Converse com nosso assistente especializado em dúvidas sobre a plataforma
            </p>
          </div>
          
          <ChatbotSupporte />
        </div>

        {/* Outros Recursos de Suporte */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Outros Recursos de Apoio</h2>
            <p className="text-muted-foreground">
              Explore outras formas de obter ajuda e suporte
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recursosSupporte.map((recurso, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2 text-primary">
                    {recurso.icon}
                  </div>
                  <CardTitle className="text-lg">{recurso.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {recurso.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Rápido */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Perguntas Frequentes</h2>
            <p className="text-muted-foreground">
              Respostas rápidas para as dúvidas mais comuns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como começar a usar a plataforma?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Acesse o dashboard, configure sua igreja no menu "Configurações" e comece 
                  cadastrando pessoas e organizando seus ministérios.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como gerenciar permissões de usuários?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No menu "Pessoas", você pode definir papéis e permissões específicas 
                  para cada membro da sua equipe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como gerar relatórios?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Acesse a seção "Relatórios" no menu principal para visualizar 
                  estatísticas detalhadas de todos os módulos da plataforma.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como usar a IA Pastoral?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A IA Pastoral está disponível no menu lateral e oferece orientações 
                  bíblicas, sugestões de aconselhamento e apoio ministerial.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}