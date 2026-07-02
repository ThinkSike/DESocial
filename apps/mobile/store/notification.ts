import { create } from "zustand";

export type AppNotification = {
  id: string;
  title: string;
  message?: string;
  icon?: string;
};

type NotificationState = {
  current: AppNotification | null;
};

type NotificationActions = {
  showNotification: (notification: Omit<AppNotification, "id">) => void;
  dismissNotification: () => void;
};

let notificationCounter = 0;

export const useNotificationStore = create<NotificationState & NotificationActions>((set) => ({
  current: null,
  showNotification: (notification) => {
    notificationCounter += 1;
    set({
      current: {
        id: `${Date.now()}-${notificationCounter}`,
        ...notification,
      },
    });
  },
  dismissNotification: () => set({ current: null }),
}));
