/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { CircularProgress } from "@mui/material";
import { IconButton } from "@mui/material";
import { Card } from "reactstrap";
import SearchIcon from "@mui/icons-material/Search";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import FormControlLabel from "@mui/material/FormControlLabel";
import SwitchInput from "./SwitchInput";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { removeBankData, setBank } from "../redux/nearByBanks";

function MapComponent(props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyC68H9SdF9KiJWStgwPugHIgY_IILwefRo",
    libraries: ["places"],
  });

  const dispatch = useDispatch();

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();

  useEffect(() => {
    getMyLocation();
    if (window.location.reload) {
      dispatch(removeBankData());
    }
  }, []);

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
              map.panTo(myLocation);
              map.setZoom(14);
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

  const getAddressDetails = (latitude, longitude) => {
    let query = "https://maps.googleapis.com/maps/api/geocode/json?";
    query += "latlng=" + latitude + "," + longitude;
    query += "&sensor=true";
    query += "&key=" + process.env.REACT_APP_API_KEY;

    fetch(query)
      .then((response) => response.json())
      .then((contents) => {
        console.log("contents", contents);
        setAddress(contents?.results[0]?.formatted_address);
      })
      .catch(() => {
        console.log("Can’t access " + query + " response. Blocked by browser?");
      });
  };

  const withCurrentLocation = (callback) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // check if callback is a function
          if (typeof callback === "function") {
            const { latitude, longitude } = position.coords;
            callback(latitude, longitude);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  const getNearbyBanks = async () => {
    setLoading(true);

    withCurrentLocation((lat, lng) => {
      setLatitude(lat);
      setLongitude(lng);
      getAddressDetails(lat, lng);
      let query =
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
      query += "location=" + lat + "," + lng;
      query += "&radius=5000";
      query += "&types=bank";
      query += "&sensor=true";
      query += "&name=hdfc";
      query += "&key=" + process.env.REACT_APP_API_KEY;

      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      fetch(proxyurl + query)
        .then((response) => response.json())
        .then((contents) => {
          const result = contents.results.map((bank) => {
            return { ...bank, checked: false };
          });

          dispatch(setBank(result));
          setLoading(false);
        })
        .catch(() => {
          console.log(
            "Can’t access " + query + " response. Blocked by browser?"
          );
          setLoading(false);
        });
    });
  };

  if (!isLoaded) {
    return <CircularProgress />;
  }
  return (
    <>
      <Autocomplete>
        <div className="header__search">
          <div className="header__searchContainer">
            <input
              placeholder="Current Location"
              value={address}
              type="text"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
            <IconButton>
              <SearchIcon />
            </IconButton>
          </div>
          <IconButton
            onClick={() => {
              getNearbyBanks();
            }}
          >
            <MyLocationIcon color="info" />
          </IconButton>
        </div>
      </Autocomplete>
      <div className="map">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <CircularProgress />
          </div>
        ) : (
          <GoogleMap
            center={{ lat: Number(latitude), lng: Number(longitude) }}
            zoom={14}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: false,
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
            onLoad={(map) => setMap(map)}
          >
            <Marker
              position={{ lat: Number(latitude), lng: Number(longitude) }}
              map={map}
            />
            {props.bank.length > 0 &&
              props.bank.map((bank, index) => {
                return (
                  <Marker
                    key={index}
                    position={{
                      lat: bank.geometry.location.lat,
                      lng: bank.geometry.location.lng,
                    }}
                    map={map}
                  />
                );
              })}
          </GoogleMap>
        )}
      </div>
      <label className="pt-2 pb-2">Branch Name Address</label>
      <div className="bank-details">
        {props.bank?.length > 0
          ? props.bank.map((bank, index) => {
              return (
                <Card className="m-2  p-2 rounded" key={index}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6>{bank.name}</h6>
                    <FormControlLabel
                      control={
                        <SwitchInput
                          index={index}
                          key={index}
                          bank={bank}
                          name={`nearByBanks.${index}.checked`}
                        />
                      }
                      label=""
                    />
                  </div>
                  <p>{bank.vicinity}</p>
                </Card>
              );
            })
          : "No Banks Found"}
      </div>
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    bank: state.bank,
  };
};
export default connect(mapStateToProps)(MapComponent);
