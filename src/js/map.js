import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
// eslint-disable-next-line sort-imports
import 'leaflet-easybutton';
import location_img from "../assets/markers/user_location.png";
import { Nodes } from "./constants";
import Swal from 'sweetalert2';


// Leaflet JS OpenStreetMapMapbox Map

// Mapbox tokens for different maps
const mapboxAccessToken = 'pk.eyJ1IjoiYXJ0bWFndWlyZSIsImEiOiJja2poYmxqMmUzZDdnMnRtdGUwbXVsMjgyIn0.fptDfptTcoror2IzzbBchg';
const mapBoxURL = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${ mapboxAccessToken }`;
const mapBoxAttribute = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

// Different MapBox maps including: Streets-V11, Dark-V10, Light-V10, Satellite-V11
const streets = L.tileLayer(mapBoxURL, {
    id: 'mapbox/streets-v11',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    attribution: mapBoxAttribute,
    accessToken: mapboxAccessToken
  }),
  dark = L.tileLayer(mapBoxURL, {
    id: 'mapbox/dark-v10',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    attribution: mapBoxAttribute,
    accessToken: mapboxAccessToken
  }),
  light = L.tileLayer(mapBoxURL, {
    id: 'mapbox/light-v10',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    attribution: mapBoxAttribute,
    accessToken: mapboxAccessToken
  }),
  satelliteStreets = L.tileLayer(mapBoxURL, {
    id: 'mapbox/satellite-streets-v11',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    attribution: mapBoxAttribute,
    accessToken: mapboxAccessToken
  });

const maps = new Map();
maps.set("Streets", streets);
maps.set("Dark", dark);
maps.set("Light", light);
maps.set("Satellite", satelliteStreets);

let baseMaps = {
  "Streets": streets,
  "Dark": dark,
  "Light": light,
  "Satellite": satelliteStreets,
};

// Default view is in Ireland
const irelandView = {
  "x": 53.417717,
  "y": -7.945862,
  "zoom": 7
};

// Custom markers
const markerIcons = {
  0: L.icon({
    iconUrl: '/images/markers/S.png',
    iconSize: [47, 50],
    iconAnchor: [22, 48],
    popupAnchor: [4, -45],
    shadowSize: [50, 64],
    shadowAnchor: [4, 62]
  }),
  '-1': L.icon({
    iconUrl: '/images/markers/E.png',
    iconSize: [47, 50],
    iconAnchor: [22, 48],
    popupAnchor: [4, -45],
    shadowSize: [50, 64],
    shadowAnchor: [4, 62]
  }),
  1: L.icon({
    iconUrl: '/images/markers/1.png',
    iconSize: [47, 50],
    iconAnchor: [22, 48],
    popupAnchor: [4, -45],
    shadowSize: [50, 64],
    shadowAnchor: [4, 62]
  }),
  2: L.icon({
    iconUrl: '/images/markers/2.png',
    iconSize: [47, 50],
    iconAnchor: [22, 48],
    popupAnchor: [4, -45],
    shadowSize: [50, 64],
    shadowAnchor: [4, 62]
  }),
  3: L.icon({
    iconUrl: '/images/markers/3.png',
    iconSize: [47, 50],
    iconAnchor: [22, 48],
    popupAnchor: [4, -45],
    shadowSize: [50, 64],
    shadowAnchor: [4, 62]
  }),
  4: L.icon({
    iconUrl: '/images/markers/4.png',
    iconSize: [47, 50],
    iconAnchor: [22, 48],
    popupAnchor: [4, -45],
    shadowSize: [50, 64],
    shadowAnchor: [4, 62]
  }),
  5: L.icon({
    iconUrl: '/images/markers/5.png',
    iconSize: [47, 50],
    iconAnchor: [22, 48],
    popupAnchor: [4, -45],
    shadowSize: [50, 64],
    shadowAnchor: [4, 62]
  })
};

let map = {};
let currentLatLng = {};

// Asks for user location
let userLocation = [];

export function createMap() {
  map = L.map('mapid', {
    worldCopyJump: true,
    zoomDelta: 0.5,
    zoomSnap: 0,
    minZoom: 3
  }).setView([irelandView.x, irelandView.y], irelandView.zoom);


  // Add all map layers
  L.control.layers(baseMaps).addTo(map);

  // Place zoom controls at bottom right of the screen
  map.zoomControl.remove();
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map);

  map.on('contextmenu', e => {
    currentLatLng = e.latlng;
  });

  const defaultMap = document.cookie.match(/^(.*;)?\s*baseMap\s*=\s*[^;]+(.*)?$/);
  if (defaultMap === null) {
    streets.addTo(map);
  } else {
    const baseMap = getPreviousMap();
    baseMaps[baseMap].addTo(map);
  }

  const lastSearch = document.cookie.match(/^(.*;)?\s*lastSearch\s*=\s*[^;]+(.*)?$/);
  if (lastSearch) {
    let lastMapBounds = getPreviousMapBounds();
    if (lastMapBounds) {
      let bounds = lastMapBounds.split(",");
      map.fitBounds([[parseFloat(bounds[1]), parseFloat(bounds[0])], [parseFloat(bounds[3]), parseFloat(bounds[2])]]);
    }
  }

  // Button for users location
  L.easyButton(`<img style="width: 14px; height: 16px" src="${ location_img }" />`, (btn, map) => {
    if (userLocation.length !== 0) {
      map.flyTo([userLocation[0], userLocation[1]], 14);
    } else {
      locateUser();
    }
  }, { position: 'bottomright' }).addTo(map);

  routeLayerGroup = L.layerGroup().addTo(map);
}

// Route variable
let routingControl = null;

// GeoJSON Layer
let geoJSONLayer = null;

function locateUser() {
  map.locate({ enableHighAccuracy: true })
    .on('locationfound', e => {
      userLocation = [e.latitude, e.longitude];
      map.setView([e.latitude, e.longitude], 12);
    })
    .on('locationerror', () => {
      Swal.fire({
        title: 'Location Denied',
        text: 'Location is disabled for this website.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    });
}

function getPreviousMap() {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('baseMap'))
    .split('=')[1];
}

function getPreviousMapBounds() {
  let lastSearchCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('lastSearch'))
    .split('=')[1];

  if (!lastSearchCookie) {
    locateUser();
  } else {
    return lastSearchCookie;
  }
}

export function getMapLatLng() {
  return currentLatLng;
}

export const markerMap = new Map();

export function addMarker(name, lat, lon, key, id) {
  if (markerMap.has(id)) {
    map.removeLayer(markerMap.get(id));
  }

  let icon = markerIcons[id];
  let marker = L.marker([lat, lon], { icon: icon }).addTo(map);

  marker.bindPopup("<b>" + name).openPopup();
  marker.name = name;

  markerMap.set(id, marker);
  if (markerMap.size > 1)
    panToMarkers();
  else
    panToNode(lat, lon);
}

export function removeMarker(markerId) {
  let marker = markerMap.get(markerId);
  if (!marker)
    return;

  if (!(markerId === -1 || markerId === 0)) {
    reOrderMarkerMap(markerId);
  } else {
    markerMap.delete(markerId);
    map.removeLayer(marker);
  }
}

function reOrderMarkerMap(markerId) {
  let orderedMarkers = new Map([...markerMap.entries()].sort());

  // Re-configures order of markers
  while (orderedMarkers.has(markerId)) {
    map.removeLayer(markerMap.get(markerId));
    markerMap.delete(markerId);

    if (!orderedMarkers.has(markerId + 1)) break;

    let nextMarkerId = markerId + 1;
    let nextMarker = markerMap.get(nextMarkerId);

    let icon = markerIcons[markerId];
    let marker = L.marker([nextMarker._latlng.lat, nextMarker._latlng.lng], { icon: icon }).addTo(map);
    marker.bindPopup("<b>" + nextMarker.name).openPopup();
    marker.name = nextMarker.name;
    markerMap.set(markerId, marker);

    markerId = nextMarkerId;
  }
}

export function reverseMarkers() {
  let startMarker = markerMap.get(0);
  let endMarker = markerMap.get(-1);

  if (startMarker)
    addMarker(startMarker.name, startMarker['_latlng']['lat'], startMarker['_latlng']['lng'], -1, -1);
  if (endMarker)
    addMarker(endMarker.name, endMarker['_latlng']['lat'], endMarker['_latlng']['lng'], 0, 0);
}

export function removeRoute() {
  if (!routingControl)
    return;

  map.removeControl(routingControl);
  routingControl = null;
}

function panToNode(lat, lon) {
  map.setView(L.latLng(lat, lon), 12, {
    "animate": true,
    "pan": {
      "duration": 1
    }
  });
}

function panToMarkers() {
  let group = new L.featureGroup(Array.from(markerMap.values()));
  map.fitBounds(group.getBounds(), { padding: [200, 200] });
}

// Get the lat, lon for a given marker
function getCoords(marker) {
  return L.latLng(marker['_latlng']['lat'], marker['_latlng']['lng']);
}

export function displayRoute(additionalNodes) {
  // Clears any existing routes
  removeRoute();

  let waypoints = [];
  waypoints.push(getCoords(markerMap.get(Nodes.START)));

  for (let id of additionalNodes) {
    let marker = markerMap.get(id);
    waypoints.push(getCoords(marker));
  }

  waypoints.push(getCoords(markerMap.get(Nodes.END)));

  routingControl = L.Routing.control({
    router: L.Routing.mapbox(mapboxAccessToken),
    waypoints: waypoints,
    createMarker: function () {
      return null;
    }
  }).addTo(map);
}

function setBaseMapCookie() {
  let mapId = Object.entries(map._layers)[0][0];
  let mapCookieString = "baseMap=";
  for (let m of maps) {
    if (m[1].options['id'] === map._layers[mapId].options['id']) {
      document.cookie = mapCookieString += m[0];
    }
  }
}

function setLastSearchCookie() {
  document.cookie = "lastSearch=" + getBoundsLngLat();
}

// Saves current map layer to cookie when the user leaves the page
window.onbeforeunload = () => {
  setBaseMapCookie();
  setLastSearchCookie();
};

export function getBoundsLngLat() {
  let bounds = map.getBounds();
  bounds._northEast = bounds.getNorthEast().wrap();
  bounds._southWest = bounds.getSouthWest().wrap();
  return bounds.toBBoxString();
}

let routeLayerGroup;

// const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
//   '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
//   '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
//   '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
//   '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
//   '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
//   '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
//   '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
//   '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
//   '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

const color_scale_bad = [
  '#FFC3B4',
  '#FCA988',
  '#F7975F',
  '#F08B37',
  '#DF6131',
  '#CE3B2A',
  '#BC252F',
  '#AA1F41',
  '#971A4F',
  '#841557'
];

const color_scale_good = ['#3C8502', '#2B9904', '#14AD06', '#09C119', '#0CD341',
  '#10E56E', '#14F69F', '#42FDA5', '#73FFB3', '#A6FFC8'];

const color_scale_negative = [
  '#1E7D7D',
  '#247D8F',
  '#2A78A1',
  '#316FB3',
  '#3862C4',
  '#3F52D5',
  '#4D46E5',
  '#BAC7FA'];

export function addGeoJSON(routeGeoJSON, cost = 0, totalCost = 0, distance = 0, distanceMinutes = 0, color = null, weight = 1, popup = false) {
  let delta = cost + distanceMinutes;
  if (!color)
    if (delta < 0)
      color = color_scale_negative[Math.floor(Math.abs(delta) < color_scale_negative.length ? Math.abs(delta) : color_scale_negative.length - 1)];
    else if (delta < 1)
      color = color_scale_good[Math.floor(delta * color_scale_good.length)];
    else
      color = color_scale_bad[Math.floor(delta < color_scale_bad.length ? delta : color_scale_bad.length - 1)];

  geoJSONLayer = L.geoJSON(routeGeoJSON, {
    onEachFeature: popup ? (feature, layer) => {
      layer.bindPopup(`Cost: ${ Math.round(cost * 100) / 100 }, TCost: ${ Math.round(totalCost * 100) / 100 }, #
            D: ${ Math.round(distance * 100) / 100 }km, DM: ${ Math.round(distanceMinutes * 100) / 100 }m`);
    } : null,
    style: () => {
      return { color: color, weight: weight };
    }
  });
  routeLayerGroup.addLayer(geoJSONLayer);
}

export function removeGeoJSON() {
  routeLayerGroup.clearLayers();

  /*  routeHistory = [];
    routeHistoryIndex = 0;*/
}

export function addDottedLine(LatLngArray) {
  let polyline = L.polyline(LatLngArray, { color: 'slategrey', dashArray: '5,10', weight: 2 });
  routeLayerGroup.addLayer(polyline);
}

export function removeAllMarkers() {
  for (let markerId of markerMap.keys())
    map.removeLayer(markerMap.get(markerId));

  markerMap.clear();
}
