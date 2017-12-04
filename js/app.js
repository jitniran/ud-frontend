const CLIENT_ID='ZNK3ACT3GRFA3XLI4DU5DXUO4KZQD1FIG3C3VYCCYYKAEU3D';
const CLIENT_SECRET='4JSVCSCAX20HISJERKX4FJGIZS1WFDMXA1VTHF5LQPZK30BP';
const version=20170101;
const locations = [
    {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
    {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
    {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
    {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
    {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
    {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
    ];
let data = {};


/**
* @description make a place object
* @param {String} title
* @param {dict} location
* @param {number} id
*/
var Place = function(id, title, location) {
    this.id = ko.observable();
    this.title = ko.observable(title);
    this.location = ko.observable(location);
};


/**
 * @description view model of the page
 */
var viewModel = function() {
    // TODO: make new places and add to a list
    let self = this;
    self.places = ko.observableArray();
    self.markers = ko.observableArray();
    self.selectedCountry = ko.observable();
    for(let i = 0; i < locations.length; i++){
        let loc = locations[i];
        var place = new Place(0, loc.title, loc.location);
        self.places.push(place);
    }
    self.markers = ko.observableArray()
    // TODO: make a function which filters place
    self.updateMarkers = function() {
        if(typeof self.selectedCountry() === "undefined"  ){
            self.markers.removeAll();
            self.places().forEach(function(place) {
                self.markers().push(place);
            }, this);
        }else {
            self.markers.removeAll();
            self.markers().push(self.selectedCountry());
        }
    }
}
myViewModel = new viewModel();   
ko.applyBindings(myViewModel);
myViewModel.markers.extend({ rateLimit: 50 });
// data['client_id'] = CLIENT_ID;
// data['client_secret'] = CLIENT_SECRET;
// data['v'] = version;
// data['limit'] = 10;
// data['section'] = 'topPicks'
// data['ll'] = '12.9716,77.5946'
// $.ajax({
//     url: 'https://api.foursquare.com/v2/venues/explore',
//     data: data,
//     success: function(response) {
//         $('#post').html(response.responseText);
//     }
// });
