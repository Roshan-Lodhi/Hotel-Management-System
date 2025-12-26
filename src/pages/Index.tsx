import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROOM_TYPES } from "@/types/hotel";
import { loadRooms } from "@/lib/storage";
import { Hotel, Users, UtensilsCrossed, Receipt, ArrowRight, Star, Shield, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hotel-hero.jpg";


const Index = () => {
  const navigate = useNavigate();
  const [rooms] = useState(loadRooms());

  const getTotalAvailableRooms = () => {
    const totalRooms = ROOM_TYPES.reduce((sum, rt) => sum + rt.totalRooms, 0);
    return totalRooms - rooms.length;
  };

  const stats = [
    { label: "Total Rooms", value: ROOM_TYPES.reduce((sum, rt) => sum + rt.totalRooms, 0), icon: Hotel },
    { label: "Available", value: getTotalAvailableRooms(), icon: Users },
    { label: "Currently Booked", value: rooms.length, icon: Receipt },
  ];

  const features = [
    {
      title: "Luxury Accommodations",
      description: "Experience world-class comfort in our premium rooms",
      icon: Star,
    },
    {
      title: "24/7 Service",
      description: "Round-the-clock assistance for all your needs",
      icon: Shield,
    },
    {
      title: "Award Winning",
      description: "Recognized for excellence in hospitality",
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Luxury Hotel Lobby"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
        </div>
        
        <div className="relative z-10 text-center text-primary-foreground px-4 animate-fade-in">
          <Badge className="mb-4 gradient-gold shadow-gold text-base px-4 py-2">
            Welcome to Excellence
          </Badge>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            Grand Luxury Hotel
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-95">
            Experience unparalleled hospitality and comfort in the heart of luxury
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate("/rooms")}
              className="gradient-gold shadow-gold text-lg px-8"
            >
              Explore Rooms
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/bookings")}
              className="bg-white/10 backdrop-blur text-white border-white/30 hover:bg-white/20"
            >
              Book Now
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 -mt-16 relative z-20 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.label}
                className="shadow-elegant hover:shadow-gold transition-smooth border-2 hover:border-primary/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                      <p className="text-4xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <div className="p-4 rounded-full gradient-primary shadow-elegant">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover what makes Grand Luxury Hotel the perfect choice for your stay
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title}
                className="text-center hover:shadow-elegant transition-smooth border-2 hover:border-primary/20 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 rounded-full gradient-gold shadow-gold w-fit group-hover:scale-110 transition-smooth">
                    <Icon className="h-8 w-8 text-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Manage Your Stay</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for a seamless hotel experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-elegant transition-smooth cursor-pointer group border-2 hover:border-primary/20" onClick={() => navigate("/rooms")}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                <Hotel className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>View Rooms</CardTitle>
              <CardDescription>Browse our luxurious accommodations</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-elegant transition-smooth cursor-pointer group border-2 hover:border-primary/20" onClick={() => navigate("/bookings")}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Book a Room</CardTitle>
              <CardDescription>Reserve your perfect stay with us</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-elegant transition-smooth cursor-pointer group border-2 hover:border-primary/20" onClick={() => navigate("/food")}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                <UtensilsCrossed className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Order Food</CardTitle>
              <CardDescription>Enjoy delicious room service</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-elegant transition-smooth cursor-pointer group border-2 hover:border-primary/20" onClick={() => navigate("/billing")}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                <Receipt className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>View Bill</CardTitle>
              <CardDescription>Review charges and checkout</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 Grand Luxury Hotel. All rights reserved.</p>
          <p className="text-sm mt-2">Excellence in Hospitality Since 1990</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
