define(function () {
  "use strict";

  return ['$http', '$q', '$cookies', apiService];

  function apiService($http, $q, $cookies) {
    return {
      getPathWithCredentials: function (path) {
        if ($cookies.accessToken) {
          path = path + "?access_token=" + $cookies.accessToken;
        }

        return path;
      },

      getApiPathWithCredentials: function (path) {
        return "/api" + this.getPathWithCredentials(path);
      },

      getRequest: function (path) {
        path = this.getApiPathWithCredentials(path);

        var deferred = $q.defer();

        $http.get(path)
          .then(function (result) {
            deferred.resolve(result.data);
          }, deferred.reject);

        return deferred.promise;
      },

      postRequest: function (path, data) {
        var httpOptions = {
          method: 'POST',
          data: data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        };

        httpOptions.url = this.getApiPathWithCredentials(path);

        var deferred = $q.defer();

        $http(httpOptions, data)
          .then(function (result) {
            deferred.resolve(result.data);
          }, deferred.reject);

        return deferred.promise;
      }
    };
  }
});
