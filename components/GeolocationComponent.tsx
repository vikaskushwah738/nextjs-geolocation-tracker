"use client"
import { useRef, useState } from "react"

const GeolocationComponent = () => {
    const [location, setLocation] = useState("");
    const [error, setError] = useState("");
    const [tracking, setTracking] = useState(false);
    const watchIdRef = useRef<number | null>(null);

    const showPosition = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
        setError("");
    }

    const startTracking = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.');
            return;
        }

        if (watchIdRef.current === null) {
            const id = navigator.geolocation.watchPosition(
                showPosition,
                handleError,
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 1000,
                }
            );

            watchIdRef.current = id;
            setTracking(true);
            setError('');
        }
    };

    const stopTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setTracking(false);
        setLocation("Tracking stopped.");
    };

    const handleError = (error: GeolocationPositionError) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                setError("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                setError("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                setError("The request to get user location timed out.");
                break;
            default:
                setError("An unknown error occurred.");
        }
        setLocation(""); // Clear location on error
    }


    return (
        <section className="flex justify-center items-center flex-col h-screen">
            <h2 className="text-xl font-bold">Geolocation </h2>
            <p className="pb-5">Tracking my location</p>


            {!tracking ? (
                <button
                    onClick={startTracking}
                    className="bg-blue-500 hover:bg-blue-400 text-white px-5 py-2 rounded mb-4"
                >
                    Start Tracking
                </button>
            ) : (
                <button
                    onClick={stopTracking}
                    className="bg-red-500 hover:bg-red-400 text-white px-5 py-2 rounded mb-4"
                >
                    Stop Tracking
                </button>
            )}
            <p className="pt-4" style={{ color: error ? "red" : "black" }}>
                {error || location || "Waiting for location..."}
            </p>



        </section>
    )
}

export default GeolocationComponent
