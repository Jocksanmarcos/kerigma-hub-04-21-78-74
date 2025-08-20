import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, conversationHistory = [] } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiKey = Deno.env.get('GEMINI_API_KEY')!;
    
    if (!geminiKey) {
      throw new Error('Gemini API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Context about the platform
    const platformContext = `
    Você é um assistente inteligente da plataforma de gestão religiosa. Você ajuda usuários com:
    
    FUNCIONALIDADES PRINCIPAIS:
    - Gestão de Pessoas: cadastro, edição, grupos, famílias
    - Células: criação, relatórios, membros, líderes
    - Financeiro: receitas, despesas, dízimos, ofertas
    - Patrimônio: controle de bens, reservas, manutenção
    - Biblioteca: livros, empréstimos, leituras digitais
    - Ensino: cursos, matrículas, certificados, IA educacional
    - Voluntários: escalas, funções, disponibilidade
    - Eventos: agenda, reservas, notificações
    - Relatórios: estatísticas, dashboards, exportações
    
    DICAS DE NAVEGAÇÃO:
    - Menu lateral esquerdo para navegar entre módulos
    - Botões de ação no canto superior direito das telas
    - Filtros avançados clicando no ícone de funil
    - Exportação disponível na maioria das listagens
    - Atalhos de teclado: Ctrl+N (novo), Ctrl+S (salvar)
    
    RECURSOS DE IA:
    - IA Pastoral: análises espirituais e recomendações
    - IA de Ensino: sugestões personalizadas de cursos
    - Relatórios inteligentes com insights automáticos
    
    Seja sempre útil, direto e forneça exemplos práticos. Use uma linguagem amigável e profissional.
    `;

    // Build conversation history for context
    const conversationMessages = [
      {
        role: "user",
        parts: [{ text: platformContext }]
      }
    ];

    // Add conversation history
    conversationHistory.forEach((msg: any) => {
      conversationMessages.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });

    // Add current message
    conversationMessages.push({
      role: "user",
      parts: [{ text: message }]
    });

    console.log('Sending request to Gemini API...');
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + geminiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: conversationMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    const aiResponse = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', aiResponse);
      throw new Error(`Gemini API error: ${aiResponse.error?.message || 'Unknown error'}`);
    }

    const botResponse = aiResponse.candidates[0].content.parts[0].text;

    // Save conversation to database for learning
    if (userId) {
      await supabase
        .from('chatbot_conversations')
        .insert({
          user_id: userId,
          user_message: message,
          bot_response: botResponse,
          context_data: {
            conversation_length: conversationHistory.length,
            timestamp: new Date().toISOString()
          }
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: botResponse,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chatbot-suporte:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});