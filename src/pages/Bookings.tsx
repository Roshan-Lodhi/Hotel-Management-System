import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROOM_TYPES, Room } from "@/types/hotel";
import { loadRooms, saveRooms } from "@/lib/storage";
import { toast } from "sonner";
import { ArrowLeft, UserPlus } from "lucide-react";


const Bookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState(location.state?.roomType || "");
  const [roomNumber, setRoomNumber] = useState("");
  
  const [guest1Name, setGuest1Name] = useState("");
  const [guest1Contact, setGuest1Contact] = useState("");
  const [guest1Gender, setGuest1Gender] = useState("");
  
  const [guest2Name, setGuest2Name] = useState("");
  const [guest2Contact, setGuest2Contact] = useState("");
  const [guest2Gender, setGuest2Gender] = useState("");

  useEffect(() => {
    setRooms(loadRooms());
  }, []);

  const getAvailableRooms = () => {
    if (!selectedRoomType) return [];
    
    const roomType = ROOM_TYPES.find(rt => rt.id === selectedRoomType);
    if (!roomType) return [];
    
    const bookedRooms = rooms.filter(r => r.type === selectedRoomType).map(r => r.roomNumber);
    const available = [];
    
    for (let i = 1; i <= roomType.totalRooms; i++) {
      if (!bookedRooms.includes(i)) {
        available.push(i);
      }
    }
    
    return available;
  };

  const isDoubleRoom = selectedRoomType?.includes("double");
  const selectedRoom = ROOM_TYPES.find(rt => rt.id === selectedRoomType);

  const handleBooking = () => {
    if (!selectedRoomType || !roomNumber || !guest1Name || !guest1Contact || !guest1Gender) {
      toast.error("Please fill all required fields");
      return;
    }

    if (isDoubleRoom && (!guest2Name || !guest2Contact || !guest2Gender)) {
      toast.error("Please fill details for both guests");
      return;
    }

    const newRoom: Room = {
      roomNumber: parseInt(roomNumber),
      type: selectedRoomType as any,
      guest1: {
        name: guest1Name,
        contact: guest1Contact,
        gender: guest1Gender,
      },
      guest2: isDoubleRoom ? {
        name: guest2Name,
        contact: guest2Contact,
        gender: guest2Gender,
      } : undefined,
      foodOrders: [],
      bookedDate: new Date(),
    };

    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    saveRooms(updatedRooms);

    toast.success(`Room ${roomNumber} booked successfully!`);
    
    // Reset form
    setSelectedRoomType("");
    setRoomNumber("");
    setGuest1Name("");
    setGuest1Contact("");
    setGuest1Gender("");
    setGuest2Name("");
    setGuest2Contact("");
    setGuest2Gender("");
  };

  const availableRooms = getAvailableRooms();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/rooms")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Rooms
        </Button>

        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Book Your Room
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fill in the details to reserve your perfect stay
          </p>
        </div>

        <Card className="max-w-3xl mx-auto shadow-elegant">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-primary" />
              Booking Details
            </CardTitle>
            <CardDescription>
              Please provide accurate information for your reservation
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type *</Label>
                <Select value={selectedRoomType} onValueChange={(value) => {
                  setSelectedRoomType(value);
                  setRoomNumber("");
                }}>
                  <SelectTrigger id="roomType">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name} - ₹{type.price}/night
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number *</Label>
                <Select 
                  value={roomNumber} 
                  onValueChange={setRoomNumber}
                  disabled={!selectedRoomType || availableRooms.length === 0}
                >
                  <SelectTrigger id="roomNumber">
                    <SelectValue placeholder={
                      !selectedRoomType ? "Select room type first" : 
                      availableRooms.length === 0 ? "No rooms available" :
                      "Select room number"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Room {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedRoom && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Room Features:</span> {selectedRoom.beds} • 
                  {selectedRoom.ac ? " AC" : " Non-AC"} • Free Breakfast • 
                  ₹{selectedRoom.price}/night
                </p>
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Guest 1 Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guest1Name">Name *</Label>
                  <Input
                    id="guest1Name"
                    value={guest1Name}
                    onChange={(e) => setGuest1Name(e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest1Contact">Contact *</Label>
                  <Input
                    id="guest1Contact"
                    value={guest1Contact}
                    onChange={(e) => setGuest1Contact(e.target.value)}
                    placeholder="Enter contact number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest1Gender">Gender *</Label>
                  <Select value={guest1Gender} onValueChange={setGuest1Gender}>
                    <SelectTrigger id="guest1Gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {isDoubleRoom && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Guest 2 Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guest2Name">Name *</Label>
                    <Input
                      id="guest2Name"
                      value={guest2Name}
                      onChange={(e) => setGuest2Name(e.target.value)}
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest2Contact">Contact *</Label>
                    <Input
                      id="guest2Contact"
                      value={guest2Contact}
                      onChange={(e) => setGuest2Contact(e.target.value)}
                      placeholder="Enter contact number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest2Gender">Gender *</Label>
                    <Select value={guest2Gender} onValueChange={setGuest2Gender}>
                      <SelectTrigger id="guest2Gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6">
              <Button variant="outline" onClick={() => navigate("/rooms")}>
                Cancel
              </Button>
              <Button 
                onClick={handleBooking}
                className="gradient-primary shadow-elegant"
                disabled={availableRooms.length === 0}
              >
                Confirm Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Bookings;


