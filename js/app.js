const locations = [
    {title: 'Vidhana Soudha', location: {lat: 12.9795, lng: 77.5909}, cat: 'sightseeing'},
    {title: 'Lal Bagh', location: {lat: 12.9507, lng: 77.5848}, cat: 'park'},
    {title: 'Bangalore Fort', location: {lat: 12.9629, lng: 77.5760}, cat: 'sightseeing'},
    {title: 'Bangalore Palace', location: {lat: 12.9987, lng: 77.5920}, cat: 'sightseeing'},
    {title: 'Cubbon Park', location: {lat: 12.9763, lng: 77.5929}, cat:'park'},
    ];
let map, largeInfoWindow ,bounds;


/**
* @description make a place object
* @param {String} title
* @param {dict} location
* @param {number} id
* @param {String} category
*/
var Place = function(id, title, location, category) {
    let self = this;
    this.id = ko.observable(id);
    this.title = ko.observable(title);
    this.location = ko.observable(location);
    this.category = ko.observable(category);
    this.marker = new google.maps.Marker({
        position: self.location(),
        title: self.title(),
        id: self.id()
    });
    this.marker.addListener('click', function() {
        populateInfoWindow(self, largeInfoWindow);
    });
};


/**
 * @description view model of the page
 */
var viewModel = function() {
    // TODO: make new places and add to a list
    let self = this;
    self.places = ko.observableArray();
    self.markers = ko.observableArray();
    self.selectedCategory = ko.observable();
    self.categories = ko.observable(['park', 'sightseeing']);
    // store id for list view
    self.currentPlace = ko.observable();
    self.setCurrentPlace = function (id) {
        if(self.currentPlace()) {
            self.currentPlace = id;
            
        }
    };
    for(let i = 0; i < locations.length; i++){
        let loc = locations[i];
        var place = new Place(0, loc.title, loc.location, loc.cat);
        self.places.push(place);
    }
    self.markers = ko.observableArray()

    // TODO: a function which filters place updates map
    self.updateMarkers = function() {
        let bounds = new google.maps.LatLngBounds();
        removeMarker();
        if(self.selectedCategory()) {
            let places = ko.observableArray(self.places().filter(filterPlaces));
            bounds =  makeMarker(places , bounds);
        }else {
            bounds = makeMarker(self.places, bounds);
        }
        map.fitBounds(bounds);
    }   
}

/**
 * @description filters places according to category
 * @param {place} place 
 */
function filterPlaces(place) {
    return place.category() == myViewModel.selectedCategory();
}
/**
 * @description returns places of a category
 */
function makeMarker(places, bounds) {
    
    places().forEach(function(place) {
        myViewModel.markers().push(place);
        place.marker.setMap(map);
        bounds.extend(place.marker.position);
    }, this);
    return bounds;
}

function removeMarker() {
    myViewModel.markers().forEach(function(place) {
        place.marker.setMap(null);
    }, this);
    myViewModel.markers.removeAll();
}

/**
 * @description function to populate to set infowindow to null
 * @param {*} place 
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
