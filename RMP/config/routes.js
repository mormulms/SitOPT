exports.default = {
    routes: function(api){
        return {

            /* ---------------------
             routes.js

             For web clients (http and https) you can define an optional RESTful mapping to help route requests to actions.
             If the client doesn't specify and action in a param, and the base route isn't a named action, the action will attempt to be discerned from this routes.js file.

             Learn more here: http://www.actionherojs.com/docs/servers/web.html

             examples:

             get: [
             { path: '/users', action: 'usersList' }, // (GET) /api/users
             { path: '/search/:term/limit/:limit/offset/:offset', action: 'search' }, // (GET) /api/search/car/limit/10/offset/100
             ],

             post: [
             { path: '/login/:userID(^\\d{3}$)', action: 'login' } // (POST) /api/login/123
             ],

             all: [
             { path: '/user/:userID', action: 'user' } // (*) / /api/user/123
             ]

             ---------------------- */

            get : [
                { path: '/rmp/sensordata/:objectID/:sensorType', action: 'getSensordata' },
                { path: '/sensor/:objectID/:sensorID', action: 'getSensor' },
                { path: '/sensor', action: 'getAllSensors' },
                { path: '/rmp/objectdata/:objectID', action: 'getObjectdata' }
            ],

            post : [
                { path: '/value', action: 'setSensordata'},
                { path: '/sensor', action: 'addSensor' }
            ],

            put: [
                { path: '/sensor/:objectID/:sensorID', action: 'updateSensor' }
            ],

            delete: [
                { path: '/sensor/:objectID/:sensorID', action: 'deleteSensor'}
            ]

        }
    }
    }