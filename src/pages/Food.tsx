import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FOOD_MENU, FoodItem, Room } from "@/types/hotel";
import { loadRooms, saveRooms } from "@/lib/storage";
import { toast } from "sonner";
import { UtensilsCrossed, ShoppingCart, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";


const Food = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState("");
  const [selectedFoodItem, setSelectedFoodItem] = useState("");
  const [quantity, setQuantity] = useState("1");

  useEffect(() => {
    setRooms(loadRooms());
  }, []);

  const selectedRoom = rooms.find(r => r.roomNumber.toString() === selectedRoomNumber);

  const handleAddFood = () => {
    if (!selectedRoomNumber || !selectedFoodItem || !quantity) {
      toast.error("Please fill all fields");
      return;
    }

    const menuItem = FOOD_MENU.find(item => item.itemno.toString() === selectedFoodItem);
    if (!menuItem) return;

    const updatedRooms = rooms.map(room => {
      if (room.roomNumber.toString() === selectedRoomNumber) {
        const foodItem: FoodItem = {
          itemno: menuItem.itemno,
          name: menuItem.name,
          quantity: parseInt(quantity),
          price: menuItem.price * parseInt(quantity),
        };
        return {
          ...room,
          foodOrders: [...room.foodOrders, foodItem],
        };
      }
      return room;
    });

    setRooms(updatedRooms);
    saveRooms(updatedRooms);
    toast.success(`${menuItem.name} added to Room ${selectedRoomNumber}`);
    
    setSelectedFoodItem("");
    setQuantity("1");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Food Menu
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Order delicious meals directly to your room
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
                Our Menu
              </CardTitle>
              <CardDescription>Freshly prepared dishes for your comfort</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {FOOD_MENU.map((item) => (
                  <div 
                    key={item.itemno}
                    className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-smooth hover:shadow-soft"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Item #{item.itemno}</p>
                    </div>
                    <Badge className="gradient-gold shadow-gold text-lg px-4 py-2 text-foreground">
                      ₹{item.price}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-primary" />
                Place Order
              </CardTitle>
              <CardDescription>Select room and add items to order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="roomSelect">Select Room *</Label>
                <Select value={selectedRoomNumber} onValueChange={setSelectedRoomNumber}>
                  <SelectTrigger id="roomSelect">
                    <SelectValue placeholder="Choose a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.length === 0 ? (
                      <SelectItem value="none" disabled>No rooms booked</SelectItem>
                    ) : (
                      rooms.map((room) => (
                        <SelectItem key={room.roomNumber} value={room.roomNumber.toString()}>
                          Room {room.roomNumber} - {room.guest1.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="foodItem">Food Item *</Label>
                  <Select value={selectedFoodItem} onValueChange={setSelectedFoodItem}>
                    <SelectTrigger id="foodItem">
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {FOOD_MENU.map((item) => (
                        <SelectItem key={item.itemno} value={item.itemno.toString()}>
                          {item.name} - ₹{item.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={handleAddFood}
                disabled={!selectedRoomNumber}
                className="w-full gradient-primary shadow-elegant"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Order
              </Button>

              {selectedRoom && selectedRoom.foodOrders.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">Current Orders</h3>
                  <div className="space-y-2">
                    {selectedRoom.foodOrders.map((order, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{order.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
                        </div>
                        <Badge variant="outline">₹{order.price}</Badge>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t font-bold">
                      <span>Total Food Bill:</span>
                      <span className="text-foreground text-xl">
                        ₹{selectedRoom.foodOrders.reduce((sum, order) => sum + order.price, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Food;
