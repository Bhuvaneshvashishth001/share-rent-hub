import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bookingAPI } from "@/lib/api";
import { toast } from "sonner";

interface SharedLocation {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  sharedAt?: string;
  sharing?: boolean;
}

interface TrackingBooking {
  _id?: string;
  id?: string;
  status?: string;
  purpose?: string;
  requirements?: string;
  liveLocation?: SharedLocation;
  rental?: { title?: string };
  user?: { name?: string };
}

const getId = (booking: TrackingBooking) => booking._id || booking.id || "";

function LocationMap({ location }: { location?: SharedLocation }) {
  if (!location?.sharing || location.latitude == null || location.longitude == null) {
    return <p className="text-sm text-muted-foreground">The renter is not sharing a live location.</p>;
  }

  const { latitude, longitude } = location;
  const delta = 0.01;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - delta}%2C${latitude - delta}%2C${longitude + delta}%2C${latitude + delta}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  return (
    <div className="space-y-2">
      <iframe title="Shared renter location" src={src} className="w-full h-64 rounded-md border border-border" />
      <p className="text-xs text-muted-foreground">
        Last update: {location.sharedAt ? new Date(location.sharedAt).toLocaleString() : "just now"}
        {location.accuracy ? `, accuracy about ${Math.round(location.accuracy)} m` : ""}
      </p>
    </div>
  );
}

export default function BookingLocationPanel({ renterBookings, ownerBookings }: { renterBookings: TrackingBooking[]; ownerBookings: TrackingBooking[] }) {
  const [locations, setLocations] = useState<Record<string, SharedLocation>>({});
  const watchIds = useRef<Record<string, number>>({});

  const loadLocation = async (booking: TrackingBooking) => {
    const id = getId(booking);
    try {
      const response = await bookingAPI.getLocation(id);
      setLocations((current) => ({ ...current, [id]: response.data }));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Could not load location");
    }
  };

  useEffect(() => {
    ownerBookings.forEach(loadLocation);
  }, [ownerBookings]);

  useEffect(() => () => {
    Object.values(watchIds.current).forEach((id) => navigator.geolocation.clearWatch(id));
  }, []);

  const startSharing = (booking: TrackingBooking) => {
    const id = getId(booking);
    if (!navigator.geolocation) return toast.error("Geolocation is not supported by this browser");
    watchIds.current[id] = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        const response = await bookingAPI.updateLocation(id, {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          sharing: true,
        });
        setLocations((current) => ({ ...current, [id]: response.data }));
      },
      (error) => toast.error(error.message || "Location permission is required"),
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 20000 },
    );
    toast.success("Location sharing started");
  };

  const stopSharing = async (booking: TrackingBooking) => {
    const id = getId(booking);
    if (watchIds.current[id] != null) {
      navigator.geolocation.clearWatch(watchIds.current[id]);
      delete watchIds.current[id];
    }
    const response = await bookingAPI.updateLocation(id, { sharing: false });
    setLocations((current) => ({ ...current, [id]: response.data }));
    toast.success("Location sharing stopped");
  };

  const cards = [
    ...renterBookings.map((booking) => ({ booking, mode: "renter" })),
    ...ownerBookings.map((booking) => ({ booking, mode: "owner" })),
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-heading font-bold">Location Sharing</h2>
        <p className="text-sm text-muted-foreground">Sharing is opt-in. Only the renter and item owner can access it.</p>
      </div>
      {cards.length === 0 && <p className="text-muted-foreground">No bookings are available for location sharing.</p>}
      {cards.map(({ booking, mode }) => {
        const id = getId(booking);
        return (
          <div key={`${mode}-${id}`} className="bg-card border border-border rounded-lg p-5 space-y-3">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h3 className="font-semibold">{booking.rental?.title || "Rental booking"}</h3>
                <p className="text-sm text-muted-foreground">
                  {mode === "renter" ? "You are the renter" : `Renter: ${booking.user?.name || "User"}`}
                </p>
                {booking.purpose && <p className="text-sm mt-1"><strong>Declared use:</strong> {booking.purpose}</p>}
                {booking.requirements && <p className="text-sm"><strong>Requirements:</strong> {booking.requirements}</p>}
              </div>
              <div className="flex gap-2">
                {mode === "renter" ? (
                  <>
                    <Button size="sm" onClick={() => startSharing(booking)}><Navigation className="h-4 w-4 mr-2" />Share</Button>
                    <Button size="sm" variant="outline" onClick={() => stopSharing(booking)}><Square className="h-4 w-4 mr-2" />Stop</Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => loadLocation(booking)}><MapPin className="h-4 w-4 mr-2" />Refresh</Button>
                )}
              </div>
            </div>
            <LocationMap location={locations[id] || booking.liveLocation} />
          </div>
        );
      })}
    </div>
  );
}
