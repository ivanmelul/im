define(function () {
  "use strict";

  return ['$http', '$q', '$cookies', mongooseService];

  function mongooseService($http, $q, $cookies) {    

    return {

      searchDashboard: function(data){
        return $http.get('/searchDashboard',{ 
          params: {
            query:JSON.stringify(data)
          }
        });
      },
      listDashboards: function(data){
        return $http.get('/listDashboards',{ 
          params: data
        });
      },
      saveDashboard: function(data){
        return $http.get('/saveDashboard',{ 
          params: data
        });
      },
      updateDashboard: function(data){
        return $http.get('/updateDashboard',{ 
          params: data
        });
      },
      loadDashboard: function(data){
        return $http.get('/loadDashboard',{ 
          params: data
        });
      }

    };

  }
});
