import { create } from 'zustand';
import type { Lead, Conversation, Message, Appointment, Consultant, QualityReview } from '@/types';
import { leads as initialLeads, conversations as initialConversations, messages as initialMessages, appointments as initialAppointments, consultants, qualityReviews as initialQualityReviews } from '@/data';

interface AppState {
  currentUser: Consultant | null;
  leads: Lead[];
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  appointments: Appointment[];
  qualityReviews: QualityReview[];
  selectedLead: Lead | null;
  selectedConversation: Conversation | null;
  selectedCustomer: null;

  setCurrentUser: (user: Consultant) => void;
  setSelectedLead: (lead: Lead | null) => void;
  setSelectedConversation: (conv: Conversation | null) => void;

  claimLead: (leadId: string, consultantId: string) => void;
  markLeadInvalid: (leadId: string, reason: string) => void;
  convertToAppointment: (leadId: string, appointmentData: Partial<Appointment>) => void;

  sendMessage: (conversationId: string, content: string, senderId: string) => void;
  addConversation: (conversation: Conversation) => void;

  getPendingLeads: () => Lead[];
  getActiveConversations: () => Conversation[];
  getTodayAppointments: () => Appointment[];
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: consultants[0],
  leads: initialLeads,
  conversations: initialConversations,
  messages: initialMessages,
  appointments: initialAppointments,
  qualityReviews: initialQualityReviews,
  selectedLead: null,
  selectedConversation: null,
  selectedCustomer: null,

  setCurrentUser: (user) => set({ currentUser: user }),
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  setSelectedConversation: (conv) => set({ selectedConversation: conv }),

  claimLead: (leadId, consultantId) => {
    const consultant = consultants.find(c => c.id === consultantId);
    if (!consultant) return;

    const lead = get().leads.find(l => l.id === leadId);
    if (!lead) return;

    const now = new Date().toISOString();
    
    set((state) => ({
      leads: state.leads.map(l =>
        l.id === leadId
          ? { ...l, status: 'in_conversation' as const, consultantId, consultant, assignedAt: now }
          : l
      ),
    }));

    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      leadId,
      customer: lead.customer,
      consultant,
      status: 'active',
      startTime: now,
      lastMessage: lead.firstMessage,
      lastMessageTime: now,
      unreadCount: 1,
    };

    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      messages: {
        ...state.messages,
        [newConversation.id]: [
          {
            id: `msg_${Date.now()}`,
            conversationId: newConversation.id,
            senderType: 'customer',
            senderId: lead.customerId,
            content: lead.firstMessage || '',
            timestamp: now,
            type: 'text',
          },
        ],
      },
    }));
  },

  markLeadInvalid: (leadId, reason) => {
    set((state) => ({
      leads: state.leads.map(l =>
        l.id === leadId
          ? { ...l, status: 'invalid' as const, invalidReason: reason }
          : l
      ),
    }));
  },

  convertToAppointment: (leadId, appointmentData) => {
    const lead = get().leads.find(l => l.id === leadId);
    if (!lead) return;

    const now = new Date().toISOString();
    const newAppointment: Appointment = {
      id: `appt_${Date.now()}`,
      customerId: lead.customerId,
      customer: lead.customer,
      consultantId: lead.consultantId || '',
      consultant: lead.consultant!,
      project: lead.project,
      appointmentTime: appointmentData.appointmentTime || now,
      status: 'pending',
      note: appointmentData.note,
      createdAt: now,
    };

    set((state) => ({
      leads: state.leads.map(l =>
        l.id === leadId ? { ...l, status: 'appointed' as const } : l
      ),
      appointments: [newAppointment, ...state.appointments],
    }));
  },

  sendMessage: (conversationId, content, senderId) => {
    const now = new Date().toISOString();
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderType: 'consultant',
      senderId,
      content,
      timestamp: now,
      type: 'text',
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), newMessage],
      },
      conversations: state.conversations.map(c =>
        c.id === conversationId
          ? { ...c, lastMessage: content, lastMessageTime: now, unreadCount: 0 }
          : c
      ),
    }));
  },

  addConversation: (conversation) => {
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    }));
  },

  getPendingLeads: () => {
    return get().leads
      .filter(l => l.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getActiveConversations: () => {
    return get().conversations
      .filter(c => c.status === 'active')
      .sort((a, b) =>
        new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime()
      );
  },

  getTodayAppointments: () => {
    const today = new Date().toDateString();
    return get().appointments.filter(
      a => new Date(a.appointmentTime).toDateString() === today
    );
  },
}));
