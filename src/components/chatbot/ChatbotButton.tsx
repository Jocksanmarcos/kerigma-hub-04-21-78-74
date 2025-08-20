import React, { useState } from 'react';
import { ChatbotSupport } from './ChatbotSupport';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';

export const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão flutuante */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
            size="lg"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
          
          {/* Pulse animation para chamar atenção */}
          <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping"></div>
        </div>
      )}

      {/* Chatbot modal */}
      {isOpen && (
        <ChatbotSupport 
          isMinimized={false}
          onToggleMinimize={() => setIsOpen(false)}
        />
      )}
    </>
  );
};