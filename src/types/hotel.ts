export interface Guest {
  name: string;
  contact: string;
  gender: string;
}


export interface FoodItem {
  itemno: number;
  name: string;
  quantity: number;
  price: number;
}


export interface Room {
  roomNumber: number;
  type: "luxury-double" | "deluxe-double" | "luxury-single" | "deluxe-single";
  guest1?: Guest;
  guest2?: Guest;
  foodOrders: FoodItem[];
  bookedDate?: Date;
}

export interface RoomType {
  id: string;
  name: string;
  category: "luxury" | "deluxe";
  roomType: "double" | "single";
  beds: string;
  ac: boolean;
  breakfast: boolean;
  price: number;
  description: string;
  image: string;
  totalRooms: number;
}

export const FOOD_MENU = [
  { itemno: 1, name: "Sandwich", price: 50 },
  { itemno: 2, name: "Pasta", price: 60 },
  { itemno: 3, name: "Noodles", price: 70 },
  { itemno: 4, name: "Coke", price: 30 },
];

export const ROOM_TYPES: RoomType[] = [
  {
    id: "luxury-double",
    name: "Luxury Double Room",
    category: "luxury",
    roomType: "double",
    beds: "1 King Size Bed",
    ac: true,
    breakfast: true,
    price: 4000,
    description: "Experience ultimate luxury with our premium double room featuring AC, complimentary breakfast, and exquisite amenities.",
    image: "luxury-double.jpg",
    totalRooms: 10,
  },
  {
    id: "deluxe-double",
    name: "Deluxe Double Room",
    category: "deluxe",
    roomType: "double",
    beds: "1 Queen Size Bed",
    ac: false,
    breakfast: true,
    price: 3000,
    description: "Comfortable and spacious deluxe room with complimentary breakfast and modern amenities.",
    image: "deluxe-double.jpg",
    totalRooms: 20,
  },
  {
    id: "luxury-single",
    name: "Luxury Single Room",
    category: "luxury",
    roomType: "single",
    beds: "1 Single Bed",
    ac: true,
    breakfast: true,
    price: 2200,
    description: "Perfect for solo travelers seeking luxury and comfort with AC and complimentary breakfast.",
    image: "luxury-single.jpg",
    totalRooms: 10,
  },
  {
    id: "deluxe-single",
    name: "Deluxe Single Room",
    category: "deluxe",
    roomType: "single",
    beds: "1 Single Bed",
    ac: false,
    breakfast: true,
    price: 1200,
    description: "Cozy single room with all essential amenities and complimentary breakfast.",
    image: "deluxe-single.jpg",
    totalRooms: 20,
  },
];
