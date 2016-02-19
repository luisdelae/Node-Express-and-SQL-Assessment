$(document).ready(function() {
    $('body').on('load', appendLoadAnimals());
    $('#animal_submit').on('click', submitAnimal);
})

var submitAnimal = function() {
    event.preventDefault();

    var values = {};
    $.each($('#animalForm').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    console.log(values);

    $('#animalForm').find('input[type=text]').val('');

    $.ajax({
        type: 'POST',
        url: '/animals',
        data: values,
        success: function (data) {
            console.log('From Server: ', data);
            appendAnimalToDom(data);
        }
    })
}

var appendAnimalToDom = function(animal) {

    $.ajax({
        type: 'GET',
        url: '/animals',
        success: function(data) {

            var animal_type = animal.animal_type;
            var animal_qty = animal.animal_qty;

            console.log("animal type:: " + animal_type);
            console.log("animal qty:: " + animal_qty)

            $('#animalContainer').append('<div><ul><li>Animal Type: ' + animal_type + '</li><li>Animal Quantity: ' +
                animal_qty + '</li></ul></div>');
        }
    })
}

var appendLoadAnimals = function() {
    $.ajax({
        type: 'GET',
        url: '/animals',
        success: function(data) {

            data.forEach(function(animal, i) {
                var animal_type = animal.animal_type;
                var animal_qty = animal.animal_qty;

                $('#animalContainer').append('<div><ul><li>Animal Type: ' + animal_type + '</li><li>Animal Quantity: ' +
                    animal_qty + '</li></ul></div>');
            })

        }
    })
}