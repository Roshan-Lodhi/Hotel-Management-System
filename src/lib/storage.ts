import { Room } from "@/types/hotel";

const STORAGE_KEY = "hotel_rooms";

export const loadRooms = (): Room[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading rooms:", error);
    return [];
  }
};

export const saveRooms = (rooms: Room[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  } catch (error) {
    console.error("Error saving rooms:", error);
  }
};

export const clearAllRooms = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing rooms:", error);
  }
};

