define(function () {
  "use strict";

  return ['$scope', '$rootScope','kairosuiService','$sce', kairosuiController];

  function kairosuiController($scope,$rootScope,kairosuiService,$sce) {

    $scope.kairosuiService = kairosuiService;

    $scope.searchSeries	= '';

    $scope.seriesList = [];
    $scope.tagsList = {};
    $scope.aggregatorsList = ["avg","dev","max","min","rate","sort","sum","least_squares","percentile","scale"];
    $scope.unitsList = ["milliseconds","seconds","minutes","hours","days","weeks","months","years"];

    $scope.tabs		= ['Group by','Aggregators','Tags','Json'];

    $scope.getTemplateTab = function(tab) {
      if (tab == 'Group by') {
        return require.toUrl('./kairosdb/templates/group-by.html');
      }
      if (tab == 'Aggregators') {
        return require.toUrl('./kairosdb/templates/aggregators.html');
      }
      if (tab == 'Tags') {
        return require.toUrl('./kairosdb/templates/tags.html');
      }
    };

    $scope.selectSerie = function(serie) {
      $scope.seriesList = [];
      $scope.metric.serie = serie;
    };

    $scope.listSeries = function() {

      $scope.seriesList = [];
      //$scope.metric.serie = '';

      if (!angular.isDefined($scope.searchSeries) || $scope.searchSeries.length === 0 ) {
        return;
      }

      kairosuiService.searchSeries($scope.endpoint.url,$scope.searchSeries)
      .then(function(data){
        angular.forEach(data.results, function(value, key) {
          if (value.indexOf($scope.searchSeries) !== -1) {
            this.push(value);
          }
        }, $scope.seriesList);
      });
    };

    $scope.listTags = function() {

      if (!angular.isDefined($scope.metric.serie) || 
        $scope.metric.serie.length === 0 ) {
        return ;
      }


      kairosuiService.searchTags($scope.endpoint.url,$scope.metric.serie)
      .then(function(tags){
        $scope.tagsList = tags;
        angular.forEach($scope.tagsList, function(value, key) {
          if (!angular.isDefined(this[key])) {
            this[key] = [];
          }
        }, $scope.metric.tags);
      });

    };

    $scope.manageTag = function(tag,value) {

      var index = $scope.metric.tags[tag].indexOf(value);

      if ( index == -1) {
        $scope.metric.tags[tag].push(value);
      } else {
        $scope.metric.tags[tag].splice(index, 1);
      }

    };

    $scope.$watch('searchSeries',function(){
      $scope.listSeries();
    });

    $scope.$watch('metric.serie',function(){
      $scope.listTags();
    });

    $scope.$watch('metric.tags',function(){
      $scope.metric.queryJson = JSON.stringify(kairosuiService.getPayload($scope.metric), null, " ");
    },true);

    $scope.$watch('metric.groups',function(){
      $scope.metric.queryJson = JSON.stringify(kairosuiService.getPayload($scope.metric), null, " ");
    },true);

    $scope.$watch('metric.aggregators',function(){
      $scope.metric.queryJson = JSON.stringify(kairosuiService.getPayload($scope.metric), null, " ");
    },true);  

    $scope.changeMetric = function(){
      $scope.metric.aggregators = [];
      $scope.metric.groups = [];
      $scope.metric.tags = {};
      $scope.metric.serie = "";
      $scope.metric.queryJson = ""; 
      $scope.searchSeries = '';
    };

    $scope.getJsonToCopy = function() {
      return $scope.metric.queryJson;
    };

    $scope.getTabHeading = function(tab) {

      var html = tab;

      if (tab == 'Aggregators') {
        if ($scope.metric.aggregators.length) {
          html+='<span class="badge pull-right">'+$scope.metric.aggregators.length+'</span>';
        }
      }

      if (tab == 'Group by') {
        if ($scope.metric.groups.length) {
          html+='<span class="badge pull-right">'+$scope.metric.groups.length+'</span>';
        }
      }

      if (tab == 'Tags') {
        var count = 0;
        angular.forEach($scope.metric.tags, function(value, key) {
          if (Array.isArray(value)) {
            count = count + value.length;
          }
        });
        if (count) {
          html+='<span class="badge pull-right">'+count+'</span>';
        }
      }

      return $sce.trustAsHtml(html);

    };
  }

});