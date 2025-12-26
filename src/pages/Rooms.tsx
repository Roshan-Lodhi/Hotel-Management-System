import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROOM_TYPES } from "@/types/hotel";
import { loadRooms } from "@/lib/storage";
import { AirVent, Coffee, Bed, Users, Crown, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import luxuryDouble from "@/assets/luxury-double.jpg";
import deluxeDouble from "@/assets/deluxe-double.jpg";
import luxurySingle from "@/assets/luxury-single.jpg";
import deluxeSingle from "@/assets/deluxe-single.jpg";


const imageMap: Record<string, string> = {
  "luxury-double.jpg": luxuryDouble,
  "deluxe-double.jpg": deluxeDouble,
  "luxury-single.jpg": luxurySingle,
  "deluxe-single.jpg": deluxeSingle,
};

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms] = useState(loadRooms());

  const getAvailableRooms = (roomTypeId: string) => {
    const roomType = ROOM_TYPES.find(rt => rt.id === roomTypeId);
    if (!roomType) return 0;
    
    const bookedCount = rooms.filter(r => r.type === roomTypeId).length;
    return roomType.totalRooms - bookedCount;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Our Rooms
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our selection of luxury and deluxe accommodations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ROOM_TYPES.map((roomType, index) => {
            const available = getAvailableRooms(roomType.id);
            const isLuxury = roomType.category === "luxury";

            return (
              <Card 
                key={roomType.id} 
                className="overflow-hidden hover:shadow-elegant transition-smooth border-2 hover:border-primary/20 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={imageMap[roomType.image]}
                    alt={roomType.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {isLuxury && (
                      <Badge className="gradient-gold shadow-gold">
                        <Crown className="h-3 w-3 mr-1" />
                        Luxury
                      </Badge>
                    )}
                    <Badge variant={available > 0 ? "default" : "destructive"} className="shadow-soft">
                      {available} Available
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {roomType.name}
                    {isLuxury && <Star className="h-5 w-5 text-accent fill-accent" />}
                  </CardTitle>
                  <CardDescription>{roomType.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Bed className="h-4 w-4 text-primary" />
                      <span>{roomType.beds}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{roomType.roomType === "double" ? "2 Guests" : "1 Guest"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AirVent className="h-4 w-4 text-primary" />
                      <span>{roomType.ac ? "AC Available" : "Non-AC"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Coffee className="h-4 w-4 text-primary" />
                      <span>Free Breakfast</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-3xl font-bold text-foreground">
                        ₹{roomType.price}
                      </span>
                      <span className="text-muted-foreground"> per night</span>
                    </div>
                    <Button
                      onClick={() => navigate("/bookings", { state: { roomType: roomType.id } })}
                      disabled={available === 0}
                      className={isLuxury ? "gradient-gold shadow-gold" : "gradient-primary shadow-elegant"}
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Rooms;
