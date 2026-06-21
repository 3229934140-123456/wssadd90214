import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { CustomerSidebar } from './CustomerSidebar';
import { AppointmentModal } from '@/components/common/AppointmentModal';
import type { Conversation, Message } from '@/types';

export function ConversationPage() {
  const currentUser = useAppStore((state) => state.currentUser);
  const allConversations = useAppStore((state) => state.conversations);
  const allMessages = useAppStore((state) => state.messages);
  const sendMessage = useAppStore((state) => state.sendMessage);
  const convertToAppointment = useAppStore((state) => state.convertToAppointment);
  const updateCustomerInfo = useAppStore((state) => state.updateCustomerInfo);

  const activeConversations = useMemo(() => {
    return allConversations
      .filter((c) => c.status === 'active')
      .sort((a, b) =>
        new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime()
      );
  }, [allConversations]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showCustomerSidebar, setShowCustomerSidebar] = useState(true);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const messages = selectedConversation
    ? allMessages[selectedConversation.id] || []
    : [];

  useEffect(() => {
    if (activeConversations.length > 0 && !selectedConversation) {
      setSelectedConversation(activeConversations[0]);
    }
  }, [activeConversations, selectedConversation]);

  const handleSendMessage = (content: string) => {
    if (!selectedConversation || !currentUser) return;
    sendMessage(selectedConversation.id, content, currentUser.id);
  };

  const handleConvertToAppointment = () => {
    setShowAppointmentModal(true);
  };

  const handleAppointmentConfirm = (appointmentTime: string, note: string) => {
    if (!selectedConversation) return;
    convertToAppointment(selectedConversation.leadId, { appointmentTime, note });
    setSelectedConversation(null);
    setTimeout(() => {
      if (activeConversations.length > 0) {
        setSelectedConversation(activeConversations[0]);
      }
    }, 100);
  };

  const handleUpdateCustomerInfo = (updates: { budget?: string; concerns?: string[] }) => {
    if (!selectedConversation) return;
    updateCustomerInfo(selectedConversation.customer.id, updates);
  };

  const currentLead = selectedConversation
    ? {
        id: selectedConversation.leadId,
        customerId: selectedConversation.customer.id,
        customer: selectedConversation.customer,
        source: 'meituan' as const,
        project: '咨询项目',
        projectCategory: 'other' as const,
        status: 'in_conversation' as const,
        consultantId: selectedConversation.consultant.id,
        consultant: selectedConversation.consultant,
        createdAt: selectedConversation.startTime,
      }
    : null;

  return (
    <div className="h-full flex">
      <ConversationList
        conversations={activeConversations}
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
          lead={currentLead}
          onConvertToAppointment={handleConvertToAppointment}
          onUpdateCustomerInfo={handleUpdateCustomerInfo}
        />
      )}

      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        onConfirm={handleAppointmentConfirm}
        customer={selectedConversation?.customer || null}
        project={currentLead?.project}
        projectCategory={currentLead?.projectCategory}
      />
    </div>
  );
}
