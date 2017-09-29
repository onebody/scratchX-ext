(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.my_first_block = function() {
        // Code that gets executed when the block is run
        console.log('Code that gets executed when the block is run');
    };

    // Functions for block with type 'w' will get a callback function as the 
    // final argument. This should be called to indicate that the block can
    // stop waiting.
    ext.wait_random = function(callback) {
        wait = Math.random();
        console.log('Waiting for ' + wait + ' seconds');
        window.setTimeout(function() {
            callback();
        }, wait*1000);
    };

    ext.power = function(base, exponent) {
        return Math.pow(base, exponent);
    };

    ext.get_temp = function(location, callback) {
        // Make an AJAX call to the Open Weather Maps API
        $.ajax({
              url: 'http://api.openweathermap.org/data/2.5/weather?q='+location+'&units=imperial',
              dataType: 'jsonp',
              success: function( weather_data ) {
                  // Got the data - parse it and return the temperature
                  temperature = weather_data['main']['temp'];
                  callback(temperature);
              }
        });
    };

    ext.set_alarm = function(time) {
       window.setTimeout(function() {
           alarm_went_off = true;
       }, time*1000);
    };

    ext.when_alarm = function() {
       // Reset alarm_went_off if it is true, and return true
       // otherwise, return false.
       if (alarm_went_off === true) {
           alarm_went_off = false;
           return true;
       }

       return false;
    };


    ext.setMotorDirection = function(direction) {
       $.ajax({
              url: 'http://127.0.0.1:8989/robot_api?action='+direction,
              dataType: 'jsonp',
              success: function( weather_data ) {
                  // Got the data - parse it and return the temperature
                  temperature = weather_data['main']['temp'];
                  callback(temperature);
              }
        });
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name, param1 default value, param2 default value
            [' ', 'my first block',                     'my_first_block'            ],
            ['w', 'wait for random time',               'wait_random'               ],
            ['r', '%n ^ %n',                            'power',        2, 3        ],
            ['R', 'current temperature in city %s',     'get_temp',     'Boston, MA'],
            ['', 'run alarm after %n seconds',          'set_alarm',    '2'],
            ['h', 'when alarm goes off',                'when_alarm'],
            [' ', 'set motor direction %m.motorDirection', 'setMotorDirection', 'this way'],
        ],
        menus: {
            motorDirection: ['this way', 'that way', 'reverse'],
            lessMore: ['<', '>'],
            eNe: ['=','not =']
        },
        url: 'http://info.scratch.mit.edu/WeDo'
    };

    // Register the extension
    ScratchExtensions.register('Wanxiao extension', descriptor, ext);
})({});