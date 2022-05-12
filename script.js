const URL = "https://api.teleport.org/api/";

// ELEMENT REFERENCES
const $city = $('#city');
const $publictransport = $('#publictransit');
const $lunch = $('#lunch');
const $housing = $('#housing');
const $costofliving = $('#costofliving');
const $form = $('form');
const $img = $('<img>');
const $input = $('input[type="text"]');
const $main = $('main');

// const $cityInfo = $('<div>');
// $cityInfo.addClass('cityInfo');
// $main.append($cityInfo);



// EVENT LISTENERS

$form.on('submit', getCityId)

// FUNCTIONS

function getCityId(event) {
    event.preventDefault()
    const userInput = $input.val();

    $.ajax(URL + 'cities/?search=' + userInput).then(function (data) {
        console.log(data);
        $city.hide().fadeIn(1000);
        $city.text(data._embedded["city:search-results"][0].matching_full_name);
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

function getUrbanDetails(urbanSlug) {
    $.ajax(URL + `urban_areas/${urbanSlug}/details/`).then(function (data) {

        console.log(data.categories[3].data[7].currency_dollar_value);
        $publictransport.hide().fadeIn(1000);
        $publictransport.text(data.categories[3].data[7].currency_dollar_value);
        $lunch.hide().fadeIn(1000);
        $lunch.text(data.categories[3].data[8].currency_dollar_value);
    })
}

function getUrbanScores(urbanSlug) {
    $.ajax(URL + `urban_areas/${urbanSlug}/scores/`).then(function (data) {
        $housing.hide().fadeIn(1000);
        $costofliving.hide().fadeIn(1000);
        $housing.text(data.categories[0].score_out_of_10);
        $costofliving.text(data.categories[1].score_out_of_10);
    })
}

function getImage(urbanSlug) {
    $.ajax(URL + `urban_areas/${urbanSlug}/images/`).then(function (data) {
        $img.hide().fadeIn(1000);
        $img.attr('src', data.photos[0].image["web"]);
        $img.width('70%');
        $img.height('auto');
        $main.append($img);
    })
}