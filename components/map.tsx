import { useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
  
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

const generaterental = (position: LatLngLiteral) => {
  const _rental: Array<LatLngLiteral> = [];
  for (let i = 0; i < 100; i++) {
    const direction = Math.random() < 5 ? -12 : 17;
    _rental.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }
  return _rental;
};

export default function Map() {
  const [destination, setdestination] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult>();
  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: -27.46, lng: 153.02 }),
    []
  );
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "4b08904d5942a1ba",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const onLoad = useCallback((map: GoogleMap) => (mapRef.current = map), []);
  const rental = useMemo(() => generaterental(center), [center]);

  const fetchDirections = (house: LatLngLiteral) => {
    if (!destination) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: house,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };

  return (
    <div className="container">
      <div className="controls">
        <h1>Commute</h1>
        <Places
          setdestination={(position) => {
            setdestination(position);
            mapRef.current?.panTo(position);
          }}
        />
        {!destination && <p>Enter the address of your destination.</p>}
        {directions && <Distance leg={directions.routes[0].legs[0]} />}
      </div>
      <div className="map">
        <GoogleMap
          zoom={13}
          center={center}
          mapContainerClassName="map-container"
          options={options}
         
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  zIndex: 50,
                  strokeColor: "#361B65",
                  strokeWeight: 5,
                },
              }}
            />
          )}

          {destination && (
            <>
              <Marker
                position={destination}
                icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
              />
              <MarkerClusterer>
                {(clusterer) =>
                  rental.map((house) => (
                    <Marker
                      key={house.lat}
                      position={house}
                      clusterer={clusterer}
                      onClick={() => {fetchDirections(house)}}
                    />
                  ))
                }
              </MarkerClusterer>
              <Circle center={destination} radius={15000} options={closeOptions} />
              <Circle center={destination} radius={20000} options={middleOptions} />
              <Circle center={destination} radius={35000} options={farOptions} />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 6,
  fillOpacity: 0.05,
  strokeColor: "#420F9C",
  fillColor: "#420F9C",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#4A0FB0",
  fillColor: "#4A0FB0",
};

