import React, { useEffect, useRef, useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { CircularProgress } from "@mui/material";
import {
  Box,
  Button,
  ButtonGroup,
  Stack,
  IconButton,
  Input,
} from "@mui/material";
import NearMeIcon from "@mui/icons-material/NearMe";
import { Row, Col } from "reactstrap";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import axios from "axios";

function MapComponent() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyC68H9SdF9KiJWStgwPugHIgY_IILwefRo",
    libraries: ["places"],
  });
  const center = { lat: 48.8584, lng: 2.2945 };

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  useEffect(() => {
    if (latitude && longitude) {
      axios
        .get(
          `https://us-central1-react-hook-dfacb.cloudfunctions.net/placesNearby?lat=${latitude}&lng=${longitude}&radius=1000`
        )
        .then((res) => {
          console.log("Restant res", res);
          return res.json();
        })
        .catch((err) => {
          console.log("Error", err);
        });
    }
  }, [latitude, longitude]);

  if (!isLoaded) {
    return <CircularProgress />;
  }

  // get my current location
  const getMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          const myLocation = {
            lat: latitude,
            lng: longitude,
          };
          setMap((map) => {
            if (map) {
              map.setCenter(myLocation);
            }
            return map;
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  // get my current location with Marker

  async function calculateRoute() {
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    console.log("results", results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  return (
    <>
      <Autocomplete>
        <div className="header__search">
          <div className="header__searchContainer">
            <input placeholder="Current Location" type="text" ref={originRef} />
            <IconButton>
              <SearchIcon />
            </IconButton>
          </div>
          <IconButton onClick={getMyLocation}>
            <MyLocationIcon color="info" />
          </IconButton>
          <IconButton
            onClick={() => {
              setLatitude(48.8584);
              setLongitude(2.2945);
              map.panTo({ lat: latitude, lng: longitude });
              map.setZoom(16);
            }}
          >
            <NearMeIcon color="info" />
          </IconButton>
        </div>
      </Autocomplete>
      <div className="map">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker
            position={{ lat: Number(latitude), lng: Number(longitude) }}
            map={map}
          />

          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      {/* <Row className="form-group p-3">
        <Col md={4}>
          <Autocomplete>
            <input
              type="text"
              placeholder="Origin"
              ref={originRef}
              className="map__input"
            />
          </Autocomplete>
        </Col>
        <Col md={4}>
          <Autocomplete>
            <input
              type="text"
              placeholder="Destination"
              ref={destiantionRef}
              className="map__input"
            />
          </Autocomplete>
        </Col>
        <Col md={4} className="mt-2">
          <ButtonGroup>
            <Button
              type="submit"
              variant="contained"
              color="success"
              onClick={calculateRoute}
            >
              Calculate Route
            </Button>
            <IconButton onClick={clearRoute}>
              <CancelIcon color="error" />
            </IconButton>
          </ButtonGroup>
        </Col>
      </Row>
      <Row className="form-group p-2">
        <Col md={4}>
          <div>Distance: {distance} </div>
        </Col>
        <Col md={4}>
          <div>Duration: {duration} </div>
        </Col>
        <Col md={4}>
          <IconButton
            onClick={() => {
              map.panTo(center);
              map.setZoom(15);
            }}
          >
            <NearMeIcon color="info" />
          </IconButton>
        </Col>
      </Row> */}
    </>
  );
}

export default MapComponent;
