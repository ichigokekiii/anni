import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 14.1,
  lng: 121.2,
};

function Map({ farmers = [], restaurant = null }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [directions, setDirections] = React.useState(null);

  React.useEffect(() => {
    if (!isLoaded || !restaurant || farmers.length === 0) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: farmers[0],
        destination: restaurant,
        waypoints: farmers.slice(1).map((f) => ({
          location: f,
          stopover: true,
        })),
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        }
      }
    );
  }, [isLoaded, farmers, restaurant]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
      {farmers.map((farmer, index) => (
        <Marker key={index} position={farmer} />
      ))}

      {restaurant && <Marker position={restaurant} />}

      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
}

export default Map;