import React, { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map: React.FC = () => {
    const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(
        null
    );
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(
        null
    );
    const [targetLocationIndex, setTargetLocationIndex] = useState<number>(0);
    const [targetLocation, setTargetLocation] = useState<google.maps.LatLng | null>(null);

    useEffect(() => {
        // Load Google Maps API
        const loader = new Loader({
            apiKey: 'AIzaSyCj40mhtjq3HrMUM2zOdlSQm_PjKY_dG5U', // Replace with your Google Maps API Key
        });

        loader.load().then(() => {
            setIsMapLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (isMapLoaded) {
            // Create the map
            const mapOptions: google.maps.MapOptions = {
                zoom: 20,
                center: { lat: 5.560014, lng: -0.205744 }, // Initial center (Accra)
            };

            const newMap = new google.maps.Map(document.getElementById('map')!, mapOptions);
            setMap(newMap);

            // Create DirectionsService and DirectionsRenderer
            const newDirectionsService = new google.maps.DirectionsService();
            const newDirectionsRenderer = new google.maps.DirectionsRenderer({ map: newMap });
            setDirectionsService(newDirectionsService);
            setDirectionsRenderer(newDirectionsRenderer);

            // Specify source and destination coordinates
            const sourceCoordinates = new google.maps.LatLng(5.560014, -0.205744); // Accra
            const destinationCoordinates = new google.maps.LatLng(6.6885, -1.6244); // Kumasi

            // Request directions from source to destination
            newDirectionsService.route(
                {
                    origin: sourceCoordinates,
                    destination: destinationCoordinates,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (response, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        newDirectionsRenderer.setDirections(response);

                        // Extract route waypoints
                        const route = response.routes[0].overview_path;
                        console.log(route);
                        // Function to update target location and marker
                        const updateTargetPosition = () => {
                            if (targetLocationIndex < route.length) {
                                setTargetLocation(route[targetLocationIndex]);
                                setTargetLocationIndex(targetLocationIndex + 10);
                            } else {
                                return (() => clearInterval(interval));
                            }
                        };

                        // Update target location every second (adjust timing as needed)
                        const interval = setInterval(updateTargetPosition, 10000); // 1 second

                        // Clear the interval when the component unmounts
                        return () => clearInterval(interval);
                    } else {
                        console.error('Directions request failed:', status);
                    }
                }
            );
        }
    }, [isMapLoaded, targetLocationIndex]);

    useEffect(() => {
        if (targetLocation && map) {
            // Create a marker for the moving target
            const targetMarker = new google.maps.Marker({
                map,
                position: targetLocation,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 5,
                    fillColor: 'blue',
                    fillOpacity: 1,
                    strokeWeight: 0,
                },
            });
        }
    }, [targetLocation, map]);

    return (
        <div id="map" style={{ width: '100%', height: '400px' }}>
            {!isMapLoaded && <p>Loading...</p>}
        </div>
    );
};

export default Map;
