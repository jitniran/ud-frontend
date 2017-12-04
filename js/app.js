const locations = [
    {title: 'Vidhana Soudha', location: {lat: 12.9795, lng: 77.5909}},
    {title: 'Lal Bagh', location: {lat: 12.9507, lng: 77.5848}},
    {title: 'Bangalore Fort', location: {lat: 12.9629, lng: 77.5760}},
    {title: 'Bangalore Palace', location: {lat: 12.9987, lng: 77.5920}},
    ];
let map, largeInfoWindow ,bounds;


/**
* @description make a place object
* @param {String} title
* @param {dict} location
* @param {number} id
*/
var Place = function(id, title, location) {
    let self = this;
    this.id = ko.observable();
    this.title = ko.observable(title);
    this.location = ko.observable(location);
    this.marker = new google.maps.Marker({
        position: self.location(),
        title: self.title(),
        id: self.id()
    });
    this.marker.addListener('click', function() {
        populateInfoWindow(this, largeInfoWindow)
        toggleBounce(this);
    });
    this.toggle = function() {
        toggleBounce(self.marker);
    };

};


/**
 * @description view model of the page
 */
var viewModel = function() {
    // TODO: make new places and add to a list
    let self = this;
    self.places = ko.observableArray();
    self.markers = ko.observableArray();
    self.selectedPlace = ko.observable();
    for(let i = 0; i < locations.length; i++){
        let loc = locations[i];
        var place = new Place(0, loc.title, loc.location);
        self.places.push(place);
    }
    self.markers = ko.observableArray()

    // TODO: a function which filters place updates map
    self.updateMarkers = function() {
        let bounds = new google.maps.LatLngBounds();
        if(self.selectedPlace()) {
            self.markers.removeAll();
            self.markers().push(self.selectedPlace());
            let marker = self.selectedPlace().marker;
            marker.setMap(map);
            bounds.extend(marker.position);
        }else {
            self.markers.removeAll();
            self.places().forEach(function(place) {
                self.markers().push(place);
                place.marker.setMap(map)
                bounds.extend(place.marker.position);
            }, this);
        }
        map.fitBounds(bounds);
    }
}
/**
 * @description function to populate to set infowindow to null
 * @param {*} marker 
 * @param {*} infowindow 
 */
function populateInfoWindow(place, infowindow) {
    
    let marker = place.marker;
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map,marker);

        infowindow.addListener('closeclick',function(){
            infowindow.marker = null;
        });
    }
}

/**
 * @description function to toggle google marker
 * @param {*} marker 
 */
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }



/**
 * @description call back function when maps is loaded
 */
window.initMap = function () {

    // remove spinner
    // $('#spinner').remove();
    // initialize a map object 
    map = new google.maps.Map(document.getElementById('map'), {
        center : {lat: 12.9716,lng: 77.5946 },
        zoom: 13
    });
    // initialize infowindow
    largeInfoWindow = new google.maps.InfoWindow();

    //initialize bounds
    bounds = new google.maps.LatLngBounds();

    // TODO: make a new view 
    myViewModel = new viewModel();   
    ko.applyBindings(myViewModel);
    myViewModel.markers.extend({ rateLimit: 50 });
}
