define(function () {
  "use strict";

  return ['$http', '$q', '$cookies', '$interval', loginService];

  function loginService($http, $q, $cookies, $interval) {    

    //PRIVATE
    var loggedinPrivate = function(){
        return $http({
          method: 'GET',
          url: '/loggedin',
          params:'',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      };


    //PUBLIC
    return {      
      login: function(data){
        return $http({
          method: 'POST',
          url: '/login',
          params:data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      },

      logout: function(){
        return $http({
          method: 'POST',
          url: '/logout',
          params:'',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      },

      loggedin: function() {return loggedinPrivate();}

    };
  }
});
