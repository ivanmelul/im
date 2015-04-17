define(function () {
  "use strict";

  return ['$http', '$q', '$cookies','endpoints', kairosuiService];

  function kairosuiService($http, $q, $cookies, endpoints) {
    

    return {

      endPoints: function() {
        return endpoints;
      },

      searchSeries: function (path,serie) {

        var payload = {
          metrics:[{'tags':{},'name':serie}],
          cache_time:0,
          start_absolute:0
        };

        var deferred= $q.defer();
        $http({
          method: 'GET',
          url: path + '/api/v1/metricnames',
          data:payload
        }).
        success(function(data, status, headers, config) {
          deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
          deferred.resolve(data);
        });

        return deferred.promise;

      },

      searchTags: function (path,serie) {

        var payload = {
          metrics:[{'tags':{},'name':serie}],
          cache_time:0,
          start_absolute:0
        };

        var deferred= $q.defer();
        $http({
          method: 'POST',
          url: path + '/api/v1/datapoints/query/tags',
          data:payload,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).
        success(function(data, status, headers, config) {
          deferred.resolve(
            angular.isDefined(data.queries) ? data.queries[0].results[0].tags : {}
          );
        }).
        error(function(data, status, headers, config) {
          deferred.resolve(data);
        });

        return deferred.promise;

      },      


      query: function (path,data) {

        var deferred= $q.defer();
        $http({
          method: 'POST',
          url: path + '/api/v1/datapoints/query',
          data:data,
        }).
        success(function(data, status, headers, config) {
          deferred.resolve(data);
        }).
        error(function(data, status, headers, config) {
          deferred.resolve(data);
        });

        return deferred.promise;

      },      

      getPayload: function(target) {
        // Clean groups
        var groups = [];
        for (var x in target.groups) {
          var group = angular.copy(target.groups[x]);
          delete group.$$hashKey;
          groups.push(group);
        }

        // Clean aggregators
        var aggregators = [];
        for (x in target.aggregators) {
          var aggregator = angular.copy(target.aggregators[x]);
          delete aggregator.$$hashKey;
          aggregators.push(aggregator);
        }

        // Clean tags
        var tags = {};
        angular.forEach(target.tags, function(value, key) {
          if (value.length>0) {
            tags[key] = value;
          }
        }, tags);

        var obj   = {};
        obj.name  = target.serie;
        obj.tags  = tags;
        if (aggregators.length>0) {
          obj.aggregators = aggregators;
        }
        if (groups.length>0) {
          obj.group_by = groups;
        }

        if (JSON.stringify(obj) == "{\"tags\":{}}") {
          return {};
        }

        return obj;
      }
    };
  }
});
