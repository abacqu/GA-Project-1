const URL = "https://api.teleport.org/api/";

// ELEMENT REFERENCES
const $city = $('#city');
const $publictransport = $('#publictransport');
const $lunch = $('#lunch');
const $form = $('form');
const $input = $('input[type="text"]');


// EVENT LISTENERS

$form.on('submit',handleGetData)

// FUNCTIONS

function handleGetData(event){

    event.preventDefault()
    const userInput = $input.val();

    $.ajax(URL + userInput).then(function(data) {
        console.log('city data is ready')
        console.log(data)
        //returning data from city name
        $city.text(data.City)
        $publictransport.text(data.Publictransport)
        $lunch.text(data.Lunch)
        $('main').append(`<img src="${data.Poster}"/>`)
    }, function(error) {
        console.log('something is wrong')
        console.log(error)
    })

}