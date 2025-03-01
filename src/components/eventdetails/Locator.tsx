import React, { useEffect } from "react";
import "./Locator.css";

const Locator = () => {
  // useEffect(() => {
  //     const CONFIGURATION = {
  //         locations: [],
  //         mapOptions: {
  //             center: { lat: 38.0, lng: -100.0 },
  //             fullscreenControl: true,
  //             mapTypeControl: false,
  //             streetViewControl: false,
  //             zoom: 4,
  //             zoomControl: true,
  //             maxZoom: 17,
  //             mapId: "",
  //         },
  //         mapsApiKey: "", // Replace with your actual API key
  //         capabilities: {
  //             input: false,
  //             autocomplete: false,
  //             directions: false,
  //             distanceMatrix: false,
  //             details: false,
  //             actions: false,
  //         },
  //     };

  //     const loadLocator = async () => {
  //         await customElements.whenDefined("gmpx-store-locator");
  //         const locator = document.querySelector("gmpx-store-locator") as any;
  //         locator.configureFromQuickBuilder(CONFIGURATION);
  //     };

  //     loadLocator();
  // }, []);

  return (
    <div className="h-[213px] w-[100%] rounded-xl">
      {/* <script
                type="module"
                src="https://unpkg.com/@googlemaps/extended-component-library@0.6"
            ></script>
            <gmpx-api-loader
                key="AIzaSyDifT1pVUE6ugICtrGX9bzJD1MCTzVJqNg"
                solution-channel="GMP_QB_locatorplus_v10_c"
            ></gmpx-api-loader>
            <gmpx-store-locator map-id="DEMO_MAP_ID"></gmpx-store-locator> */}
    </div>
  );
};

export default Locator;
