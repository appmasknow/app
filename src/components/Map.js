import React from 'react';

//import GoogleMapReact from 'google-map-react';

export default class extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      markerOptions: {
        icon: {
          url: 'static/icons/mask-color.svg',
          scaledSize: { height: 50, width: 50 }
        }
      },
      markers: [],
    };
  }
  
  render() {
    return (
      <div id="map" style={{ height: 'calc(72vh - 56px)', width: '100%' }}></div>
    );
  }
  
  componentDidMount() {
    this.initializeMap();
  }
  
  initializeMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: { lat: -15, lng: -54 }, // Brasil
      zoom: 3.6
    });
    this.loadMyLocation(map);
    this.loadMarkers(map);
  }
  
  loadMyLocation(map) {
    app.methods.geolocation().getMyCurrentPosition(position => {
      map.setCenter(position);
    });
    map.setZoom(12);
  }
  
  loadMarkers(map) {
    let self = this, { markers, markerOptions } = self.state, { icon } = markerOptions;
    app.methods.geolocation().getMyCurrentPosition(position => {
      let minha_geolocalizacao = position;
      app.methods.request(self, 'get', '/mapa', { minha_geolocalizacao }, (res) => {
        let localSession = app.methods.localSessionAPI();
        localSession.updateUserAccountData(res.usuario);
        //------------------------- || -------------------------
        markers.forEach(m => m.setMap(null)); markers = []; // limpar marcadores no mapa
        res.geolocalizacoesDosVendedores.forEach(data => {
          let marker = new google.maps.Marker({ ...data });
          marker.setIcon(icon);
          marker.setMap(map);
          markers.push(marker);
        });
        self.setState({ markers });
        setTimeout(() => {
          self.loadMarkers(map);
        }, 300000); // 5 minutos
      }, null, null, null, {
        disconnectedAlert: false,
        requestErrorAlert: false
      });
    });
  }
  
}

//{
//  position: {
//    lat: -15.7980996,
//    lng: -47.9199232,
//  },
//  title: 'Daelton Dias',
//}
