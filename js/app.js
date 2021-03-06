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
    // this.wikiInfo = wikiApi(this.title());
    this.marker.addListener('click', function() {
        wikiApi(self.title(), self.marker, largeInfoWindow);
        toggleDrop(this);
    });
};


/**
 * @description view model of the page
 */
var ViewModel = function() {
    // TODO: make new places and add to a list
    let self = this;
    self.places = ko.observableArray();
    self.markers = ko.observableArray();
    self.selectedCategory = ko.observable();
    self.categories = ko.observable(['park', 'sightseeing']);
    // animation
    self.toggle = function(title, marker) {
        toggleDrop(marker);
        wikiApi(title, marker, largeInfoWindow);
    };
    for(let i = 0; i < locations.length; i++){
        let loc = locations[i];
        var place = new Place(0, loc.title, loc.location, loc.cat);
        self.places.push(place);
    }
    self.markers = ko.observableArray()

    // TODO: a function which filters place updates map
    self.updateMarkers = function() {
        // let bounds = new google.maps.LatLngBounds();
        removeMarker();
        if(self.selectedCategory()) {
            let places = ko.observableArray(self.places().filter(filterPlaces));
            makeMarker(places , bounds);
        }else {
            makeMarker(self.places, bounds);
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
 * @param {place} places
 * @param {bound} bounds
 */
function makeMarker(places, bounds) {
    
    places().forEach(function(place) {
        myViewModel.markers().push(place);
        place.marker.setMap(map);
        bounds.extend(place.marker.position);
    }, this);
    // return bounds;
}

function removeMarker() {
    myViewModel.markers().forEach(function(place) {
        place.marker.setMap(null);
    }, this);
    myViewModel.markers.removeAll();
}

/**
 * @description function to populate to set infowindow to null
 * @param {dict} info 
 * @param {String} title
 * @param {google marker} marker
 * @param {google infowindow} infowindow 
 */
function populateInfoWindow(info, title, marker, infowindow) {
    
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        content = '<div>' + marker.title + '</div>' +
                  '<div>' + info.summary + '</div>' +
                  '<a href="' + info.link + '">Read More</a>' 
        infowindow.setContent(content);
        infowindow.open(map,marker);

        infowindow.addListener('closeclick',function(){
            infowindow.marker = null;
        });
    }
}

/**
 * @description takes place string returns summary and link
 * @param {String} title 
 * @param {google marker} marker
 * @param {google infoWindow} infoWindow
 */
function wikiApi(title,marker,infoWindow) {

    let info = {}
    $.getJSON('https://en.wikipedia.org/w/api.php?action=opensearch&origin=*'+
              '&format=json&namespace=0&search=' + title, function(data) {
                info['summary'] = data[2][0];
                info['link'] = data[3][0];
              })
    .done(function() {
        populateInfoWindow(info,title, marker, infoWindow);
    })
    .fail(function() {
        info['summary'] = "Unable to fecth wikipedia info, please try again";
        info['link'] = "";
        populateInfoWindow(info,title, marker, infoWindow);
    });
}

/**
 * @description function to toggle google marker
 * @param {google marker} marker 
 */
function toggleDrop(marker) {
      marker.setAnimation(google.maps.Animation.DROP);
}

/**
 * @description handle map not loaded error
 */
function mapNotLoaded() {
    alert("Map not loaded.Please try again ");
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

    google.maps.event.addDomListener(window, 'resize', function() {
        map.fitBounds(bounds);
    });

    // TODO: make a new view 
    myViewModel = new ViewModel();   
    ko.applyBindings(myViewModel);
    myViewModel.markers.extend({ rateLimit: 50 });
}
