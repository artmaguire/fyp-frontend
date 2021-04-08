const route = [
  {
    "distance": 1.8169695,
    "end_point": {
      "lat": 52.59910213291838,
      "lng": -9.771739106939874
    },
    "route": [
      {
        "type": "LineString",
        "coordinates": [[-9.7690467, 52.6169353], [-9.7693644, 52.6168743], [-9.7699464, 52.6167078], [-9.7702708, 52.6165961], [-9.7707156, 52.6164702], [-9.7711738, 52.6163707], [-9.7717558, 52.616259], [-9.7721705, 52.6161819], [-9.7725719, 52.6161291], [-9.7729732, 52.6160966], [-9.7734315, 52.6160743], [-9.7737793, 52.6160479], [-9.7740736, 52.6160052], [-9.7744884, 52.6159301], [-9.7749733, 52.61579], [-9.7753513, 52.6156965], [-9.7757326, 52.6156214], [-9.776248674, 52.615533888]]
      }, {
        "coordinates": [[[-9.7690467, 52.6169353], [-9.7690297, 52.6168969]]],
        "type": "MultiLineString"
      }, {
        "coordinates": [[[-9.7690297, 52.6168969], [-9.7688192, 52.6164215], [-9.7685483, 52.6156844], [-9.76815, 52.614458], [-9.7672141, 52.6110958]]],
        "type": "MultiLineString"
      }, {
        "coordinates": [[[-9.7672141, 52.6110958], [-9.7668507, 52.6094037], [-9.7665293, 52.6050506], [-9.7652308, 52.6018454], [-9.7647676, 52.6008561]]],
        "type": "MultiLineString"
      }, {
        "type": "LineString",
        "coordinates": [[-9.7647676, 52.6008561], [-9.7681233, 52.599645], [-9.768763, 52.5994692], [-9.7698378, 52.5992745], [-9.7708691, 52.5991621], [-9.771739106, 52.599102133]]
      }
    ],
    "source_point": {
      "lat": 52.614722,
      "lng": -9.776111
    },
    "start_point": {
      "lat": 52.61553388742424,
      "lng": -9.776248674593267
    },
    "target_point": {
      "lat": 52.598056,
      "lng": -9.771667
    },
    "time": 2.180364
  }
];

const search = [
  {
    "place_id": "320046360834",
    "osm_id": "54183121",
    "osm_type": "way",
    "licence": "https://locationiq.com/attribution",
    "lat": "53.4050821",
    "lon": "-6.3812146",
    "boundingbox": [
      "53.4024603",
      "53.4081752",
      "-6.3865457",
      "-6.3756556"
    ],
    "class": "amenity",
    "type": "university",
    "display_name": "TU Dublin Blanchardstown, Blanchardstown Road North, Corduff, Blanchardstown, D15 N5DX, Ireland",
    "display_place": "TU Dublin Blanchardstown",
    "display_address": "Blanchardstown Road North, Corduff, Blanchardstown, D15 N5DX, Ireland",
    "address": {
      "name": "TU Dublin Blanchardstown",
      "road": "Blanchardstown Road North",
      "suburb": "Corduff",
      "city": "Blanchardstown",
      "postcode": "D15 N5DX",
      "country": "Ireland",
      "country_code": "ie"
    }
  },
  {
    "place_id": "321978343388",
    "osm_id": "49753636",
    "osm_type": "way",
    "licence": "https://locationiq.com/attribution",
    "lat": "53.29101685",
    "lon": "-6.36305613",
    "boundingbox": [
      "53.2892406",
      "53.2927786",
      "-6.3681753",
      "-6.3572169"
    ],
    "class": "amenity",
    "type": "university",
    "display_name": "TU Dublin Tallaght, Old Blessington Road, Tallaght, DUBLIN 24, Ireland",
    "display_place": "TU Dublin Tallaght",
    "display_address": "Old Blessington Road, Tallaght, DUBLIN 24, Ireland",
    "address": {
      "name": "TU Dublin Tallaght",
      "road": "Old Blessington Road",
      "suburb": "Tallaght",
      "postcode": "DUBLIN 24",
      "country": "Ireland",
      "country_code": "ie",
      "town": "Tallaght"
    }
  },
  {
    "place_id": "322663161651",
    "osm_id": "22716506",
    "osm_type": "way",
    "licence": "https://locationiq.com/attribution",
    "lat": "53.40597165",
    "lon": "-6.37628535",
    "boundingbox": [
      "53.405847",
      "53.4060601",
      "-6.3767429",
      "-6.375999"
    ],
    "class": "highway",
    "type": "service",
    "display_name": "TU Dublin Blanchardstown Main Campus Avenue, Buzzardstown, D15 R925, Ireland",
    "display_place": "TU Dublin Blanchardstown Main Campus Avenue",
    "display_address": "Buzzardstown, D15 R925, Ireland",
    "address": {
      "name": "TU Dublin Blanchardstown Main Campus Avenue",
      "suburb": "Buzzardstown",
      "postcode": "D15 R925",
      "country": "Ireland",
      "country_code": "ie",
      "town": "Buzzardstown"
    }
  },
  {
    "place_id": "324277575659",
    "osm_id": "52248182",
    "osm_type": "node",
    "licence": "https://locationiq.com/attribution",
    "lat": "52.614722",
    "lon": "-9.776111",
    "boundingbox": [
      "52.604722",
      "52.624722",
      "-9.786111",
      "-9.766111"
    ],
    "class": "place",
    "type": "locality",
    "display_name": "Tullig, Tullig Electoral Division, West Clare Municipal District, Ireland",
    "display_place": "Tullig",
    "display_address": "Tullig Electoral Division, West Clare Municipal District, Ireland",
    "address": {
      "name": "Tullig",
      "suburb": "Tullig Electoral Division",
      "city": "West Clare Municipal District",
      "country": "Ireland",
      "country_code": "ie"
    }
  }
];

module.exports = { dummy_route: route, dummy_search: search };
