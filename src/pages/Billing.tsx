import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ROOM_TYPES, Room } from "@/types/hotel";
import { loadRooms, saveRooms } from "@/lib/storage";
import { toast } from "sonner";
import { Receipt, LogOut, Download, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Razorpay: any;
  }
}


const Billing = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setRooms(loadRooms());
    
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const selectedRoom = rooms.find(r => r.roomNumber.toString() === selectedRoomNumber);
  const roomType = selectedRoom ? ROOM_TYPES.find(rt => rt.id === selectedRoom.type) : null;

  const calculateTotal = () => {
    if (!selectedRoom || !roomType) return 0;
    
    const roomCharge = roomType.price;
    const foodTotal = selectedRoom.foodOrders.reduce((sum, order) => sum + order.price, 0);
    
    return roomCharge + foodTotal;
  };

  const generateInvoice = (room: Room, type: any, totalAmount: number) => {
    const invoiceContent = `
      GRAND LUXURY HOTEL - INVOICE
      ================================
      
      Room Details:
      Room Number: ${room.roomNumber}
      Room Type: ${type.name}
      Guest Name: ${room.guest1.name}
      Contact: ${room.guest1.contact}
      
      ================================
      CHARGES BREAKDOWN
      ================================
      
      Room Charge - ${type.name}: ₹${type.price}
      ${room.foodOrders.length > 0 ? '\nFood Orders:\n' + room.foodOrders.map(order => 
        `  ${order.name} (Qty: ${order.quantity}): ₹${order.price}`
      ).join('\n') : ''}
      
      ================================
      TOTAL AMOUNT: ₹${totalAmount}
      ================================
      
      Thank you for staying with Grand Luxury Hotel
      We hope to serve you again soon!
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-room-${room.roomNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generateReceipt = (room: Room, paymentDetails: any, totalAmount: number) => {
    const receiptContent = `
      GRAND LUXURY HOTEL - PAYMENT RECEIPT
      ================================
      
      Transaction Details:
      Payment ID: ${paymentDetails.razorpay_payment_id}
      Order ID: ${paymentDetails.razorpay_order_id}
      Date: ${new Date().toLocaleString()}
      
      Room Details:
      Room Number: ${room.roomNumber}
      Guest Name: ${room.guest1.name}
      Contact: ${room.guest1.contact}
      
      ================================
      PAYMENT INFORMATION
      ================================
      
      Amount Paid: ₹${totalAmount}
      Payment Status: SUCCESS
      Payment Method: Razorpay
      
      ================================
      
      Thank you for your payment!
      This receipt confirms your successful transaction.
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${paymentDetails.razorpay_payment_id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadInvoice = () => {
    if (!selectedRoom || !roomType) return;
    generateInvoice(selectedRoom, roomType, calculateTotal());
    toast.success('Invoice downloaded successfully');
  };

  const handlePayment = async () => {
    if (!selectedRoomNumber || !selectedRoom || !roomType) {
      toast.error("Please select a room");
      return;
    }

    setIsProcessing(true);

    try {
      const totalAmount = calculateTotal();
      
      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: {
            amount: totalAmount,
            roomNumber: selectedRoom.roomNumber,
            guestName: selectedRoom.guest1.name,
          },
        }
      );

      if (orderError) throw orderError;

      // Initialize Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Grand Luxury Hotel',
        description: `Room ${selectedRoom.roomNumber} - Checkout`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              'verify-razorpay-payment',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              }
            );

            if (verifyError) throw verifyError;

            // Generate and download invoice and receipt
            generateInvoice(selectedRoom, roomType, totalAmount);
            generateReceipt(selectedRoom, response, totalAmount);

            // Payment successful, checkout the room
            const updatedRooms = rooms.filter(r => r.roomNumber.toString() !== selectedRoomNumber);
            setRooms(updatedRooms);
            saveRooms(updatedRooms);
            
            toast.success(`Payment successful! Invoice and receipt downloaded. Room ${selectedRoomNumber} checked out.`);
            setSelectedRoomNumber("");
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: selectedRoom.guest1.name,
          contact: selectedRoom.guest1.contact,
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Billing & Checkout
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Review charges and complete checkout
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Receipt className="h-6 w-6 text-primary" />
                Select Room
              </CardTitle>
              <CardDescription>Choose a room to view bill and checkout</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="roomBilling">Room Number</Label>
                <Select value={selectedRoomNumber} onValueChange={setSelectedRoomNumber}>
                  <SelectTrigger id="roomBilling">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.length === 0 ? (
                      <SelectItem value="none" disabled>No rooms currently booked</SelectItem>
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
            </CardContent>
          </Card>

          {selectedRoom && roomType && (
            <Card className="shadow-elegant border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-3xl">Invoice</CardTitle>
                <CardDescription>Grand Luxury Hotel - Bill Summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Room Number</p>
                    <p className="font-semibold">#{selectedRoom.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Room Type</p>
                    <p className="font-semibold">{roomType.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guest Name</p>
                    <p className="font-semibold">{selectedRoom.guest1.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-semibold">{selectedRoom.guest1.contact}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Charges Breakdown</h3>
                  
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Room Charge</p>
                      <p className="text-sm text-muted-foreground">{roomType.name}</p>
                    </div>
                    <Badge className="gradient-primary text-lg px-4 py-1">
                      ₹{roomType.price}
                    </Badge>
                  </div>

                  {selectedRoom.foodOrders.length > 0 && (
                    <>
                      <h4 className="font-semibold mt-4">Food Orders</h4>
                      {selectedRoom.foodOrders.map((order, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{order.name}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {order.quantity}</p>
                          </div>
                          <Badge variant="outline">₹{order.price}</Badge>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center p-6 gradient-subtle rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-4xl font-bold text-foreground">
                      ₹{calculateTotal()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="gap-2" onClick={handleDownloadInvoice}>
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="gradient-primary shadow-elegant gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      {isProcessing ? 'Processing...' : 'Pay & Checkout'}
                    </Button>
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                  <p>Thank you for staying with Grand Luxury Hotel</p>
                  <p>We hope to serve you again soon!</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Billing;


