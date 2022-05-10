const URL = "https://api.teleport.org/api/";

// ELEMENT REFERENCES
const $city = $('#city');
const $publictransport = $('#publictransit');
const $lunch = $('#lunch');
const $housing = $('#housing');
const $costofliving = $('#costofliving');
const $form = $('form');
const $input = $('input[type="text"]');


// EVENT LISTENERS

$form.on('submit', getCityId)

// FUNCTIONS

function getCityId(event) {
    event.preventDefault()
    const userInput = $input.val();

    $.ajax(URL + 'cities/?search=' + userInput).then(function (data) {
        console.log('city data is ready ' + data);
        let hrefGeoId = data._embedded["city:search-results"][0]._links["city:item"].href
        let locateCity = hrefGeoId.split('/');
        let getGeoCityId = locateCity[locateCity.length - 2];
        getUrbanSlug(getGeoCityId);
    })

}

function getUrbanSlug(getGeoCityId) {
    $.ajax(URL + 'cities/' + getGeoCityId).then(function (data) {
        console.log(data._links["city:urban_area"].href);
        let locateUrbanHref = data._links["city:urban_area"].href;
        let SplitUA = locateUrbanHref.split('/')
        let urbanSlug = SplitUA[SplitUA.length - 2];
        getUrbanDetails(urbanSlug);
        getUrbanScores(urbanSlug);
        getImage(urbanSlug);
    });
}

function getUrbanDetails(getUrbanSlug) {
    $.ajax(URL + `urban_areas/${getUrbanSlug}/details/`).then(function (data) {
        $publictransport.text(data.categories[3].data[7].currency_dollar_value);
        $lunch.text(data.categories[3].data[8].currency_dollar_value);
    })
}

function getUrbanScores(getUrbanSlug) {
    $.ajax(URL + `urban_areas/${getUrbanSlug}/scores/`).then(function (data) {
        $housing.text(data.categories[0].score_out_of_10);
        $costofliving.text(data.categories[1].score_out_of_10);
    })
}

function getImage(getUrbanSlug) {
    $.ajax(URL + `urban_areas/${getUrbanSlug}/images/`).then(function (data) {
        // console.log(data.photos[0].image["web"]);
        $('main').append(`<img src="${data.photos[0].image["web"]}"/>`)
    })
}