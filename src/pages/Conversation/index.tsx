import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { CustomerSidebar } from './CustomerSidebar';
import type { Conversation, Message } from '@/types';
import { messages as initialMessages } from '@/data/messages';

export function ConversationPage() {
  const currentUser = useAppStore((state) => state.currentUser);
  const allConversations = useAppStore((state) => state.conversations);
  const sendMessage = useAppStore((state) => state.sendMessage);

  const activeConversations = useMemo(() => {
    return allConversations
      .filter((c) => c.status === 'active')
      .sort((a, b) =>
        new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime()
      );
  }, [allConversations]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCustomerSidebar, setShowCustomerSidebar] = useState(true);

  useEffect(() => {
    if (activeConversations.length > 0 && !selectedConversation) {
      setSelectedConversation(activeConversations[0]);
    }
  }, [activeConversations, selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      const convMessages = initialMessages[selectedConversation.id] || [];
      setMessages(convMessages);
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  const handleSendMessage = (content: string) => {
    if (!selectedConversation || !currentUser) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: selectedConversation.id,
      senderType: 'consultant',
      senderId: currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    setMessages((prev) => [...prev, newMessage]);
    sendMessage(selectedConversation.id, content, currentUser.id);
  };

  const handleConvertToAppointment = () => {
    alert('转预约功能 - 实际项目中会打开预约弹窗');
  };

  const sortedConversations = [...allConversations].sort((a, b) =>
    new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime()
  );

  return (
    <div className="h-full flex">
      <ConversationList
        conversations={sortedConversations}
        selectedId={selectedConversation?.id || null}
        onSelect={setSelectedConversation}
      />

      <ChatWindow
        conversation={selectedConversation}
        messages={messages}
        onSendMessage={handleSendMessage}
      />

      {showCustomerSidebar && (
        <CustomerSidebar
          customer={selectedConversation?.customer || null}
          lead={null}
          onConvertToAppointment={handleConvertToAppointment}
        />
      )}
    </div>
  );
}
