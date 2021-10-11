const moment = require('moment');

let generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
}

let generateLocationMessage = (from, lat, lng, acc) => {
    return {
        from,
        url: `https://www.google.com/maps?z=12&t=m&q=${lat},${lng}`,
        acc,
        createdAt: moment().valueOf()
    }
}

module.exports = {generateMessage, generateLocationMessage};