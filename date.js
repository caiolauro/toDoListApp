// jshint esversion:6
console.log(module);

var get_current_date = function () {
    var today = new Date();
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };
    let currentDay = today.toLocaleDateString('en-US', options);
    return currentDay
}

exports.get_current_date = get_current_date;