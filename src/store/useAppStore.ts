import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lead, Conversation, Message, Appointment, Consultant, QualityReview, Customer, ProjectCategory } from '@/types';
import { leads as initialLeads, conversations as initialConversations, messages as initialMessages, appointments as initialAppointments, consultants, qualityReviews as initialQualityReviews } from '@/data';
import { PROJECT_CATEGORY_LABELS } from '@/types';

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

  claimLead: (leadId: string, consultantId: string) => Conversation | null;
  autoAssignLead: (leadId: string) => { consultant: Consultant; conversation: Conversation } | null;
  markLeadInvalid: (leadId: string, reason: string) => void;
  convertToAppointment: (leadId: string, conversationId: string, appointmentData: Partial<Appointment>) => Appointment | null;
  hasPendingAppointment: (customerId: string) => boolean;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status'], operatorInfo?: { operatorId?: string; operatorName?: string; remark?: string }) => void;
  getAppointmentById: (appointmentId: string) => Appointment | undefined;

  sendMessage: (conversationId: string, content: string, senderId: string) => void;
  addConversation: (conversation: Conversation) => void;

  updateCustomerInfo: (customerId: string, updates: Partial<Customer>) => void;
  getCustomerById: (customerId: string) => Customer | null;

  addQualityReview: (review: Omit<QualityReview, 'id' | 'createdAt'>) => void;

  getPendingLeads: () => Lead[];
  getActiveConversations: () => Conversation[];
  getTodayAppointments: () => Appointment[];
  getConversationById: (id: string) => Conversation | undefined;
  getMessagesByConversationId: (id: string) => Message[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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
        if (!consultant) return null;

        const lead = get().leads.find(l => l.id === leadId);
        if (!lead) return null;

        const now = new Date().toISOString();

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
          leads: state.leads.map(l =>
            l.id === leadId
              ? { ...l, status: 'in_conversation' as const, consultantId, consultant, assignedAt: now }
              : l
          ),
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

        return newConversation;
      },

      autoAssignLead: (leadId) => {
        const lead = get().leads.find(l => l.id === leadId);
        if (!lead || lead.status !== 'pending') return null;

        const categoryLabel = PROJECT_CATEGORY_LABELS[lead.projectCategory];

        const onlineConsultants = consultants.filter(c => c.isOnline && c.role !== 'supervisor');
        if (onlineConsultants.length === 0) return null;

        const matchedConsultants = onlineConsultants.filter(c =>
          c.skills.some(skill => skill.includes(categoryLabel) || categoryLabel.includes(skill))
        );

        const candidates = matchedConsultants.length > 0 ? matchedConsultants : onlineConsultants;

        const selected = candidates.reduce((prev, curr) => {
          const prevCount = get().leads.filter(l => l.consultantId === prev.id && l.status !== 'pending').length;
          const currCount = get().leads.filter(l => l.consultantId === curr.id && l.status !== 'pending').length;
          return currCount < prevCount ? curr : prev;
        });

        const conversation = get().claimLead(leadId, selected.id);
        if (!conversation) return null;

        return { consultant: selected, conversation };
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

      hasPendingAppointment: (customerId) => {
        return get().appointments.some(
          a => a.customerId === customerId && (a.status === 'pending' || a.status === 'confirmed')
        );
      },

      convertToAppointment: (leadId, conversationId, appointmentData) => {
        const lead = get().leads.find(l => l.id === leadId);
        if (!lead) return null;

        const existingPending = get().appointments.find(
          a => a.customerId === lead.customerId && (a.status === 'pending' || a.status === 'confirmed')
        );
        if (existingPending) return existingPending;

        const conversation = get().conversations.find(c => c.id === conversationId);
        const now = new Date().toISOString();
        const newAppointment: Appointment = {
          id: `appt_${Date.now()}`,
          conversationId,
          conversationStartTime: conversation?.startTime,
          conversationProject: lead.project,
          conversationConsultantName: lead.consultant?.name,
          customerId: lead.customerId,
          customer: lead.customer,
          consultantId: lead.consultantId || '',
          consultant: lead.consultant!,
          project: lead.project,
          projectCategory: lead.projectCategory,
          appointmentTime: appointmentData.appointmentTime || now,
          status: 'pending',
          statusHistory: [
            {
              status: 'pending',
              timestamp: now,
              operatorId: lead.consultantId,
              operatorName: lead.consultant?.name,
              remark: '会话转出',
            },
          ],
          note: appointmentData.note,
          createdAt: now,
        };

        set((state) => ({
          leads: state.leads.map(l =>
            l.id === leadId ? { ...l, status: 'appointed' as const } : l
          ),
          appointments: [newAppointment, ...state.appointments],
          conversations: state.conversations.map(c =>
            c.id === conversationId ? { ...c, status: 'ended' as const, endTime: now } : c
          ),
        }));

        return newAppointment;
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

      getConversationById: (id) => {
        return get().conversations.find(c => c.id === id);
      },

      getMessagesByConversationId: (id) => {
        return get().messages[id] || [];
      },

      getCustomerById: (customerId) => {
        const lead = get().leads.find(l => l.customerId === customerId);
        if (lead) return lead.customer;
        const conv = get().conversations.find(c => c.customer.id === customerId);
        if (conv) return conv.customer;
        return null;
      },

      updateCustomerInfo: (customerId, updates) => {
        set((state) => ({
          leads: state.leads.map(l =>
            l.customerId === customerId
              ? { ...l, customer: { ...l.customer, ...updates } }
              : l
          ),
          conversations: state.conversations.map(c =>
            c.customer.id === customerId
              ? { ...c, customer: { ...c.customer, ...updates } }
              : c
          ),
          appointments: state.appointments.map(a =>
            a.customerId === customerId
              ? { ...a, customer: { ...a.customer, ...updates } }
              : a
          ),
        }));
      },

      addQualityReview: (review) => {
        const now = new Date().toISOString();
        const newReview: QualityReview = {
          ...review,
          id: `qr_${Date.now()}`,
          reviewedAt: now,
        };
        set((state) => ({
          qualityReviews: [newReview, ...state.qualityReviews],
        }));
      },

      updateAppointmentStatus: (appointmentId, status, operatorInfo) => {
        const now = new Date().toISOString();
        set((state) => ({
          appointments: state.appointments.map(a =>
            a.id === appointmentId
              ? {
                  ...a,
                  status,
                  statusHistory: [
                    ...a.statusHistory,
                    {
                      status,
                      timestamp: now,
                      operatorId: operatorInfo?.operatorId,
                      operatorName: operatorInfo?.operatorName,
                      remark: operatorInfo?.remark,
                    },
                  ],
                }
              : a
          ),
        }));
      },

      getAppointmentById: (appointmentId) => {
        return get().appointments.find(a => a.id === appointmentId);
      },
    }),
    {
      name: 'beauty-lead-desk-storage',
      partialize: (state) => ({
        leads: state.leads,
        conversations: state.conversations,
        messages: state.messages,
        appointments: state.appointments,
        qualityReviews: state.qualityReviews,
      }),
    }
  )
);
