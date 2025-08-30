import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const mapboxToken = 'pk.eyJ1Ijoid2JpdGMtZG9uaSIsImEiOiJjbWM1OWk1ZGwwbjM2Mm1vZnY1eTdndzlwIn0.JJ7RwtgOgNce-mP9fI7_Gg';
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

export function getCoordinates(query) {
  return geocodingClient
    .forwardGeocode({
      query,
      limit: 1,
    })
    .send()
    .then(response => {
      const match = response.body.features[0];
      return {
        placeName: match.place_name,
        lat: match.geometry.coordinates[1],
        lon: match.geometry.coordinates[0],
      };
    });
}
