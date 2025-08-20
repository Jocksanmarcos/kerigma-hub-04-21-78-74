import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  category?: string;
}

export const useChatbotSupport = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou seu assistente de suporte inteligente. Como posso ajudá-lo(a) hoje? Posso auxiliar com navegação na plataforma, dicas de uso, tutoriais e muito mais!',
      role: 'assistant',
      timestamp: new Date(),
      category: 'help'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Sugestões rápidas baseadas no contexto da plataforma
  const quickSuggestions = [
    'Como cadastrar uma nova pessoa?',
    'Como criar uma célula?',
    'Como fazer lançamentos financeiros?',
    'Como reservar patrimônio?',
    'Como emprestar livros da biblioteca?',
    'Como criar um curso?',
    'Como escalar voluntários?',
    'Como agendar eventos?',
    'Como gerar relatórios?',
    'Como usar a IA Pastoral?',
    'Quais são os atalhos de teclado?',
    'Como exportar dados?'
  ];

  const sendMessage = useCallback(async (messageContent: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Get user ID if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('chatbot-suporte', {
        body: {
          message: messageContent,
          userId: user?.id,
          conversationHistory
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        category: categorizarResposta(data.response)
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes.',
        role: 'assistant',
        timestamp: new Date(),
        category: 'help'
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Erro no chatbot",
        description: "Não foi possível processar sua mensagem.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [messages, toast]);

  const categorizarResposta = (resposta: string): string => {
    const respostaLower = resposta.toLowerCase();
    
    if (respostaLower.includes('tutorial') || respostaLower.includes('passo a passo') || respostaLower.includes('como fazer')) {
      return 'tutorial';
    }
    if (respostaLower.includes('dica') || respostaLower.includes('sugestão') || respostaLower.includes('recomendação')) {
      return 'tip';
    }
    if (respostaLower.includes('ajuda') || respostaLower.includes('suporte') || respostaLower.includes('problema')) {
      return 'help';
    }
    
    return 'help';
  };

  // Aprender com interações do usuário
  useEffect(() => {
    const saveInteractionPattern = async () => {
      if (messages.length > 2) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const recentMessages = messages.slice(-2);
          const userMsg = recentMessages.find(m => m.role === 'user');
          const assistantMsg = recentMessages.find(m => m.role === 'assistant');
          
          if (userMsg && assistantMsg) {
            // Salvar padrão de interação para aprendizado futuro
            await supabase
              .from('chatbot_learning_patterns')
              .upsert({
                user_id: user.id,
                question_pattern: userMsg.content.toLowerCase(),
                response_category: assistantMsg.category,
                interaction_timestamp: new Date().toISOString(),
                feedback_score: null // Para implementar feedback futuro
              })
              .onConflict('user_id,question_pattern');
          }
        }
      }
    };

    saveInteractionPattern();
  }, [messages]);

  return {
    messages,
    loading,
    sendMessage,
    quickSuggestions
  };
};