var map;
var infoWindows = [];
//Information about the different locations
//Provides information for the markers
var monuments = [{
    title: 'Gateway of India',
    lat: 18.922003,
    lng: 72.834656,
    streetAddress: 'Apollo Bunder, Colaba, Mumbai',
    cityAddress: 'Mumbai, Maharashtra 400001, India',
    id: 'nav0',
    visible: ko.observable(true),
    boolTest: true
}, {
    title: 'India Gate',
    lat: 28.612912,
    lng: 77.22951,
    streetAddress: 'Rajpath, India Gate, New Delhi, Delhi',
    cityAddress: ' New Delhi, Delhi 110001, India',
    id: 'nav1',
    visible: ko.observable(true),
    boolTest: true
}, {
    title: 'Taj Mahal',
    lat: 27.175009,
    lng: 78.042091,
    streetAddress: 'Dharmapuri, Agra, UP',
    cityAddress: 'Agra, Uttar Pradesh 282001, India',
    id: 'nav2',
    visible: ko.observable(true),
    boolTest: true
}, {
    title: 'Qutub Minar',
    lat: 28.524428,
    lng: 77.185456,
    streetAddress: 'Mehrauli, New Delhi, Delhi',
    cityAddress: 'New Delhi, Delhi 110030, India',
    id: 'nav3',
    visible: ko.observable(true),
    boolTest: true //boolean test flag
}, {
    title: 'Udayagiri & Khandagiri Caves',
    lat: 20.2628312,
    lng: 85.7860297,
    streetAddress: 'Bhubaneshwar, Odisha',
    cityAddress: 'Odisha, Orissa, India',
    id: 'nav4',
    visible: ko.observable(true),
    boolTest: true
}, {
    title: 'Mysore Palace',
    lat: 12.305292,
    lng: 76.654803,
    streetAddress: 'Sayyaji Rao Rd, Mysuru, Karnataka',
    cityAddress: 'Mysuru, Karnataka 570001, India',
    id: 'nav5',
    visible: ko.observable(true),
    boolTest: true
}, {
    title: 'Vivekananda Rock Memorial',
    lat: 8.078137,
    lng: 77.555301,
    streetAddress: 'Kanyakumari, Tamil Nadu',
    cityAddress: ' Tamil Nadu 629702, India',
    id: 'nav6',
    visible: ko.observable(true),
    boolTest: true
}, {
    title: 'Lotus Temple',
    lat: 28.553492,
    lng: 77.258826,
    streetAddress: 'Lotus Temple Rd, Shambhu Dayal Bagh, Bahapur, Kalkaji, New Delhi, Delhi',
    cityAddress: ' New Delhi, Delhi 110019, India',
    id: 'nav7',
    visible: ko.observable(true),
    boolTest: true
}, {
    title: 'Meenakshi Amman Temple',
    lat: 9.919444444444444,
    lng: 78.11944444444444,
    streetAddress: 'Madurai, Tamil Nadu',
    cityAddress: 'Madurai, Tamil Nadu 625001, India',
    id: 'nav8',
    visible: ko.observable(true),
    boolTest: true
}, {
    title: 'Red Fort',
    lat: 28.656,
    lng: 77.241,
    streetAddress: 'Netaji Subhash Marg, Chandni Chowk, New Delhi, Delhi',
    cityAddress: ' New Delhi, Delhi 110006, India',
    id: 'nav9',
    visible: ko.observable(true),
    boolTest: true
}];
var Position = {
    lat: marker.lat,
    lng: marker.lng
};

function googleSuccess() {
    if (typeof google !== 'undefined') {
        ko.applyBindings(new ViewModel());
    } else {
        googleError();
    }

}

//google error function to show error when Map is not loaded properly
function googleError() {
    console.log('inside google error');
    alert('Sorry we seem to have lost our google maps connection');
};

//Initialize the map and its contents
function initMap() {
    var mapOptions = {
        zoom: 5,
        center: new google.maps.LatLng(22.836946, 80.244141),
        mapTypeControl: false, // Hides the Maps controls
        disableDefaultUI: true
    };

    if (window.innerWidth <= 1080) {
        mapOptions.zoom = 13;
    }

    if (window.innerWidth < 850 || window.innerHeight < 595) {
        //hide nav when screen width or height is resized
        hideNav();
    }

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


    setMarkers(monuments);

    // get wikipedia data
    monuments.forEach(function(monument) {
        monument.url = getWikiData(monument);
        monument.shortDescription = getWikiData(monument);
    });

    //setAllMap();
    //Reset map on click handler and
    //when window resize conditionals are met
    function resetMap() {
        var windowWidth = window.innerWidth;
        if (windowWidth <= 1080) {
            map.setZoom(5);
            map.setCenter(mapOptions.center);
        } else if (windowWidth > 1080) {
            map.setZoom(5);
            map.setCenter(mapOptions.center);
        }
    }

    $(window).resize(function() {
        resetMap();
    });

}

//Get Google Street View Image for each individual marker
//Passed lat and lng to get each image location
var streetViewImage;
var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=180x90&location=';

function determineImage() {
    streetViewImage = streetViewUrl +
        monuments[i].lat + ',' + monuments[i].lng + '&fov=75&pitch=10';
}


//Sets the infoWindows to each individual marker

function setMarkers(location) {
    //The markers are inidividually set using a for loop
    for (i = 0; i < location.length; i++) {
        location[i].holdMarker = new google.maps.Marker({
            //Sets the markers on the map within the initialize function
            position: new google.maps.LatLng(location[i].lat, location[i].lng),
            map: map,
            title: location[i].title,
            icon: {
                url: 'img/marker.png',
                size: new google.maps.Size(25, 40),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(12.5, 40)
            }
        });

        //function to place google street view images within info windows
        determineImage();

        var infowindow = new google.maps.InfoWindow({
            content: monuments[i].contentString
        });

        //Click marker to view infoWindow
        //zoom in and center location on click
        new google.maps.event.addListener(location[i].holdMarker, 'click', (function(marker, i) {
            return function() {
                //Binds infoWindow content to each marker
                if (location[i].url != undefined) {
                    location[i].contentString = '<div> <img src="' + streetViewImage +
                        '" alt="Street View Image of ' + location[i].title + '"><br><hr style="margin-bottom: 6px"><strong>' +
                        location[i].title + '</strong><br><p>' +
                        location[i].streetAddress + '<br>' +
                        location[i].cityAddress + '<br></p><a class="web-links" href="' + location[i].url +
                        '" target="_blank">' + location[i].url + '</a>' +
                        '<p>' + location[i].shortDescription +
                        '</p></div>';
                    infowindow.setContent(location[i].contentString);
                } else {
                    location[i].contentString = '<div> <img src="' + streetViewImage +
                        '" alt="Street View Image of ' + location[i].title + '"><br><hr style="margin-bottom: 6px"><strong>' +
                        location[i].title + '</strong><br><p>' +
                        location[i].streetAddress + '<br>' +
                        location[i].cityAddress + '<br></p>' + "Failed to load wiki Resources" +
                        '<p>' + "Failed to load wiki Resources" +
                        '</p></div>';
                    infowindow.setContent(location[i].contentString);
                }
                infowindow.open(map, this);
                var windowWidth = window.innerWidth;
                if (windowWidth <= 1080) {
                    map.setZoom(14); // change Map zoom with change in window width
                } else if (windowWidth > 1080) {
                    map.setZoom(16);
                }
                map.setCenter(marker.getPosition());
                location[i].picBoolTest = true;
            };
        })(location[i].holdMarker, i));
    }
}



var viewModel = {
    //Query through the different locations from nav bar with knockout.js
    //only display  nav elements that match query result
    query: ko.observable(''),
};


viewModel.markers = ko.computed(function() {
    var self = this;
    var search = self.query().toLowerCase();

    // if no user input
    if (search.length === 0) {
        // All the markers are visible
        monuments.forEach(function(monument) {
            // HolderMarker property does not exist on initial page load
            if (monument.hasOwnProperty('holdMarker')) {
                monument.holdMarker.setVisible(true);
            }
        });
        // return all the location objects when no user input
        return monuments; // list items
        // if there is user input, filter the list items
    } else {
        return ko.utils.arrayFilter(monuments, function(monument) {
            // match either true or false
            var match = monument.title.toLowerCase().indexOf(search) !== -1;
            // Then show or hide the marker
            monument.holdMarker.setVisible(match);
            return match;
        });
    }
}, viewModel);


viewModel.activateMarker = function(location) {
    var marker = location.holdMarker;
    google.maps.event.trigger(marker, 'click');
    marker.setAnimation(google.maps.Animation.BOUNCE);
    //Set timeout for Animation
    setTimeout(function() {
        marker.setAnimation(null);
    }, 1400);
};

var flag = 0;

//This function is used to display the restaurants near the monuments.
viewModel.showRestaurants = function() {
    if (flag != 1) {
        flag = 1;
        monuments.forEach(function(marker) {
            getFourSquareData(marker);
        });
    }
};

viewModel.mapReset = function() {
    var windowWidth = window.innerWidth;
    if (windowWidth <= 1080) {
        map.setZoom(5);
        map.setCenter(new google.maps.LatLng(22.836946, 80.244141));
    } else if (windowWidth > 1080) {
        map.setZoom(5);
        map.setCenter(new google.maps.LatLng(22.836946, 80.244141));
    }
};


ko.applyBindings(viewModel);

//Hide and Show entire Nav/Search Bar on clicking arrow button

var isNavVisible = true;

function noNav() {
    $('#search-nav').animate({
        height: 0,
    }, 500);
    setTimeout(function() {
        //hide search nav
        $('#search-nav').hide();
    }, 500);
    //Down Arrow button visible when Nav is hidden
    $('#arrow').attr('src', 'img/down.gif');
    isNavVisible = false;
}

function yesNav() {
    $('#search-nav').show();
    //Set scroller Height
    var scrollerHeight = $('#scroller').height() + 55;
    // reduce scroller height when window height is < 600
    if (window.innerHeight < 600) {
        $('#search-nav').animate({
            height: scrollerHeight - 100,
        }, 500, function() {
            $(this).css('height', 'auto').css('max-height', 439);
        });
    } else {
        $('#search-nav').animate({
            height: scrollerHeight,
        }, 500, function() {
            $(this).css('height', 'auto').css('max-height', 549);
        });
    }
    $('#arrow').attr('src', 'img/up.gif');
    isNavVisible = true;
}


//Function to hide search Nav
function hideNav() {
    if (isNavVisible === true) {
        noNav();

    } else {
        yesNav();
    }
}

$('#arrow').click(hideNav);

//Hide Nav when screen width is < 850 or height < 595
//Show Nav if screen width is >= 850 or height >= 595
//Function runs when window is resized
$(window).resize(function() {
    //To Hide Nav
    if (window.innerWidth < 850 && isNavVisible === true) {
        //call noNav function
        noNav();
    } else if (window.innerHeight < 595 && isNavVisible === true) {
        //call noNav function
        noNav();
    }
    //To Show Nav
    if (window.innerWidth >= 850 && isNavVisible === false) {

        if (window.innerHeight > 595) {
            // call yesNav function
            yesNav();
        }
    } else if (window.innerHeight >= 595 && isNavVisible === false) {

        if (window.innerWidth > 850) {
            // call yesNav function
            yesNav();
        }
    }
});

//close info windows
closeInfoWindows = function() {

    for (var i = 0; i < infoWindows.length; i++) {
        infoWindows[i].close();
    }
};


function getWikiData(marker) {
    var query = marker.title;
    dt = 'jsonp',
        wikiBase = 'https://en.wikipedia.org/w/api.php',
        wikiUrl = wikiBase + '?action=opensearch&search=' + query + '&format=json&callback=wikiCallback';

    var x = $.ajax({
        url: wikiUrl,
        dataType: dt,
    }).done(function(response) {
        var wikiUrl = response[3][0];
        var shortDescription = response[2][0];
        marker.url = wikiUrl;
        marker.shortDescription = shortDescription;
    })
}
var client_id = 'B4RU4Q20KCQML0IC2B15SLBU2I0ICAIJ4VAET52B01KGUE1P';
var client_secret = 'BTD1ZB3BDJXYBBMSBNJOAXDI2T5MMGDV13WMQG4DWYYGKYTQ';
var reqUrl = 'https://api.foursquare.com/v2/venues/';

function getFourSquareData(marker) {
    var nearby_timeout = setTimeout(function() {
        //Timeout function to Show error Message.
        alert('sorry there is an error Try again');
    }, 5000); // ajax doesnt have an error method hence we use time out
    var nearbyUrl = reqUrl + 'search?limit=1&ll=' + marker.lat + ',' + marker.lng + '&query=restaurant&client_id=' + client_id + '&client_secret=' + client_secret + '&v=20140806';
    //AJAX for Foursquare
    var z = $.ajax({
        method: 'GET',
        dataType: 'jsonp',
        url: nearbyUrl,
        async: true,
        type: 'POST',
    }).done(function(data) {
        clearTimeout(nearby_timeout);
        for (var i = 0; i < data.response.venues.length; i++) {
            nearBymarkers(data.response.venues[i]);
        }
    });
}

//set markers at positions returned by foursquare Api
nearBymarkers = function(data) {
    var position = {
        lat: data.location.lat,
        lng: data.location.lng
    };

    if (position == Position) {
        //do nothing
    } else {
        var marker = new google.maps.Marker({
            // Animation to make marker bounce when selected
            animation: google.maps.Animation.DROP,
            position: position,
            map: map,
            icon: {
                url: 'img/restaurant.png',
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(12.5, 40)
            },
        });
        position.marker = marker;
        monuments.push(marker);
        zoomChangeBoundsListener = google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
            if (this.getZoom() < 10) {
                this.setZoom(13); // if zoom out happens when bounds change zoom in again
                this.setCenter(marker.position); // so that even when map redirects when we reset zoom , center doesnt change

            }
        });

        if (typeof data.categories[0] !== 'undefined') {

            if (data.url) {
                var url = data.url;
            } else {
                var url = 'No Information';
            }
            if (data.contact.phone) {
                var phone = data.contact.phone;
            } else {
                var phone = 'No Information';
            }
            var name = data.categories[0].name;

            var content_string = '<div><strong>Name:</strong>:' + data.name + '<br>' +
                '<strong>type:</strong>:' + name + '<br>' +
                '<strong>Url:</strong>:' + url + '<br>' +
                '<strong>Phone:</strong>:' + phone + '</div>';

            var infowindower = new google.maps.InfoWindow({
                // Taking content from content_String
                content: content_string
            });
            marker.addListener('click', function() {
                closeInfoWindows();
                marker.setAnimation(google.maps.Animation.BOUNCE);
                //Set timeout for Animation
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 2000);
                infowindower.open(map, marker);
            });
            infoWindows.push(infowindower);
            self.ko.observableArray().push({
                name: data.name,
                position: position
            });
        }
    }

};
