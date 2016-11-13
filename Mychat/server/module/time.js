
    module.exports = express = {

        get: function() {
            var t    = new Date(),
                time = null;

            var setTime = function(t) {
                    return t < 10 ? '0' + t : t;
                };

            time =
                   setTime(t.getFullYear()) + '-' +
                   setTime(t.getMonth())    + '-' +
                   setTime(t.getDay())      + ' ' +
                   setTime(t.getHours())    + ':' +
                   setTime(t.getMinutes())  + ':' +
                   setTime(t.getSeconds())  + '.' +
                   setTime(t.getMilliseconds());

            return time;
        },

        minget: function() {
            var t    = new Date(),
                time = null;

            var setTime = function(t) {
                    return t < 10 ? '0' + t : t;
                };

            time =
                   setTime(t.getHours())    + ':' +
                   setTime(t.getMinutes())  + ':' +
                   setTime(t.getSeconds());

            return time;
        }
    };
