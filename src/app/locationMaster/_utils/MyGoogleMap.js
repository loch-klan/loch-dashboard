import React, { useState, useRef, useCallback } from "react";
import { LoadScript, GoogleMap, DrawingManager, Polygon } from "@react-google-maps/api";
import { GOOGLE_API_KEY } from "../../../utils/Constant";

function MyGoogleMap(props) {

  // Store Polygon path in state
  const [pathNew, setNewPath] = useState([]);

  const onLoad = drawingManager => {
    // console.log("drawingManager",drawingManager)
  }

  const onPolygonComplete = polygon => {
    let polygonBounds = polygon.getPath();
    let bounds = [];
    for (let i = 0; i < polygonBounds.length; i++) {
      let point = {
        lat: polygonBounds.getAt(i).lat(),
        lng: polygonBounds.getAt(i).lng()
      };
      bounds.push(point);
    }
    setNewPath(bounds);
    props.setPath(bounds);
  }

  // const onClick = (poly) =>{
  //   // console.log('Poly',poly);
  // }
  let coordinates = props.polygon && props.polygon.geo_fencing.coordinates[0].map((item)=>{
    return(
      {
        lat: item[0],
        lng: item[1],
      }
    )
  })

  // Store Polygon path in state
  const [pathOld, setOldPath] = useState(coordinates ? coordinates : pathNew);
  // Define refs for Polygon instance and listeners
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);
  // Call setOldPath with new edited path
  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map(latLng => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      setOldPath(nextPath);
      // coordinates = nextPath;
      props.setPath(nextPath)
    }
  }, [setOldPath]);

  // Bind refs to current Polygon and listeners
  const onLoadPolygon = useCallback(
    polygon => {
      polygonRef.current = polygon;
      const path = polygon.getPath();
      listenersRef.current.push(
        path.addListener("set_at", onEdit),
        path.addListener("insert_at", onEdit),
        path.addListener("remove_at", onEdit)
      );
    },
    [onEdit]
  );
  return (
    <div className="map-wrapper">
      <LoadScript
        libraries={["drawing"]}
        id="script-loader"
        googleMapsApiKey={GOOGLE_API_KEY}
        language="en"
        region="us"
      >
        <GoogleMap
          mapContainerClassName="area-map"
          center={{ lat: 19.216847, lng: 72.864683 }}
          zoom={8}
          version="weekly"
          on
        >
          {
            // props.polygon && props.polygon.geo_fencing.coordinates[0].length > 0
            (pathOld.length>0 || pathNew.length>0)
            ?
            <Polygon
              path={pathOld.length>0 ? pathOld : pathNew.length>0 ? pathNew : null}
              editable
              draggable
              options={{
                  fillColor: "yellow",
                  fillOpacity: 0.4,
                  strokeColor: "#d35400",
                  strokeOpacity: 0.8,
                  strokeWeight: 3
              }}
              // Event used when manipulating and adding points
              onMouseUp={onEdit}
              // Event used when dragging the whole Polygon
              onDragEnd={onEdit}
              onLoad={onLoadPolygon}
              // onUnmount={onUnmount}
            />
            :
            <DrawingManager
              drawingMode="polygon"
              onLoad={onLoad}
              onPolygonComplete={onPolygonComplete}
              // options={}
              />
          }
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default MyGoogleMap;


