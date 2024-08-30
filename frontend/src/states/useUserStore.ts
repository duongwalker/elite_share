import { create } from 'zustand';

type User = {
    userId: number | null
    setUserId: (id: number) => void
    clearUserId: () => void
}

// Define the user store
const useUserStore = create<User>((set) => ({
  userId: null, // Initial state
  setUserId: (id: number) => {
    set({ userId: id })
  }, // Action to update the state
  clearUserId: () => set({ userId: null }), // Action to clear the state
}));

export default useUserStore;
