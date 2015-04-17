define(function () {
  "use strict";

  return ['$scope', '$rootScope','kairosuiService', '$modal', kairospanelController];

  function kairospanelController($scope,$rootScope,kairosuiService, $modal) {

    $scope.kairosuiService = kairosuiService;

    $scope.endpoint = kairosuiService.endPoints()[0];

    $scope.showGraphAction = false;
    $scope.showQuery = false;
    $scope.showGraph = true;
    $scope.showTime = true;
    $scope.showLegend = false;
    $scope.showDropdown = false;

    $scope.lastTop  = 0;
    $scope.lastTitle = '';

    $scope.metrics_query = {metrics:[]};
    $scope.metrics_query_json = '';
    $scope.query_result = {};
    $scope.metrics_query.metrics = [];
    
    if ($scope.panel.relative.start_relative.value !== '' && $scope.panel.relative.end_relative.value !== '') $scope.timeRA = "relative";
    else $scope.timeRA = "absolute";

    $scope.showModal = true;

    $scope.loading = false;

    $scope.canShowGraph = function() {
      return $scope.showGraph && !angular.equals($scope.query_result,{});
    };

    $scope.newMetric = function() {
      var metrics = $scope.panel.metrics.push({
        aggregators:[],
        groups:[],
        tags:{},
        serie:"",
        queryJson	:"",
        active:true
      });

      setTimeout(function(){
        $(document.querySelectorAll(".Metrics .tab-content input.metricName")).last()[0].focus();
      },1500);

    };

    $scope.deleteMetric = function(index) {
      $scope.panel.metrics.splice(index,1);
    };

    $scope.time = function(date_string) {
      var date = new Date(date_string);
      return date.getTime();
    };

    $scope.getData = function() {

      $scope.query_result = {};
      $scope.metrics_query.metrics = [];

      angular.forEach($scope.panel.metrics, function(metric, key) {

        if (metric.serie.length &&
          (!$scope.isRelativeEmpty() || !$scope.isAbsoluteEmpty())
          ) {
          this.push(kairosuiService.getPayload(metric));
        }        
      }, $scope.metrics_query.metrics);

      $scope.metrics_query_json = JSON.stringify($scope.metrics_query, null, " ");

      var payload = {
        metrics:$scope.metrics_query.metrics,
        cache_time:0
      };

      if (!$scope.isRelativeEmpty()) {

        if ($scope.panel.relative.start_relative.value.length>0 &&
            $scope.panel.relative.start_relative.unit.length>0) {
            payload.start_relative = $scope.panel.relative.start_relative;
        }

        if ($scope.panel.relative.end_relative.value.length>0 &&
            $scope.panel.relative.end_relative.unit.length>0) {
            payload.end_relative = $scope.panel.relative.end_relative;
        }

      } else {

        var start = String($scope.panel.absolute.start_absolute);
        var end   = String($scope.panel.absolute.end_absolute);

        if (start.length>0) {
          payload.start_absolute = $scope.time($scope.panel.absolute.start_absolute);
        }
        if (end.length>0) {
          payload.end_absolute = $scope.time($scope.panel.absolute.end_absolute);
        }
      }

      if (payload.metrics.length === 0 ||
          ($scope.isRelativeEmpty() && $scope.isAbsoluteEmpty())
          ) {
        return;
      }

      $scope.loading = true;
      kairosuiService.query($scope.endpoint.url,payload)
      .then(
        function(data){
          $scope.query_result = data;
          $scope.loading = false;
        });
    };

    $scope.$watch("panel.metrics",function(){

      // if (!$scope.panel.metrics.length) {
      //   return false;
      // }

      // if (!$scope.panel.metrics[$scope.panel.metrics.length-1].serie.length) {
      //   return false;
      // }

      $scope.getData();

    },true);

    $scope.isRelativeEmpty = function() {

      if ($scope.panel.relative.start_relative.value === '' &&
          $scope.panel.relative.end_relative.value === '') {
          return true;
      }
      return false;
    };

    $scope.$watch('panel.relative', function() {
      if ($scope.isRelativeEmpty()) {
        return false;
      }
      $scope.panel.absolute  = {
        start_absolute:'',
        end_absolute:''
      };

      $scope.getData();

    }, true);

    $scope.isAbsoluteEmpty = function() {
      if ($scope.panel.absolute.start_absolute === '' &&
          $scope.panel.absolute.end_absolute === '') {
          return true;
      }
      return false;
    }; 

    $scope.$watch('panel.absolute', function() {
      if ($scope.isAbsoluteEmpty()) {
        return false;
      }
      $scope.panel.relative = {
        start_relative:{value:'',unit:'hours'},
        end_relative:{value:'',unit:'hours'},
      };
      $scope.getData();
    }, true);

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
     return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.open = function($event,opened) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope[opened] = true;
    };

    $scope.dateOptions = {
     formatYear: 'yyyy/MM/dd',
     startingDay: 1
    };

    $scope.initDate = new Date();
    $scope.formats = ['yyyy/MM/dd'];
    $scope.format = $scope.formats[0];


    $scope.manageQuery = function() {

      if (!$scope.showQuery) {
        angular.element(document.querySelector("body")).addClass("PanelEditor");
        var element = angular.element(document.querySelector("#panel_"+$scope.panelindex));
        $scope.lastTop = element[0].offsetTop;
        $('html, body').animate({scrollTop: 0}, 500);
        $scope.lastTitle = document.querySelector('title').innerHTML;
        document.querySelector('title').innerHTML = "Edit " + $scope.panel.panelname + " - Moab - Turn";
      } else {
        angular.element(document.querySelector("body")).removeClass("PanelEditor");
        $('html, body').animate({scrollTop: $scope.lastTop}, 500);
        document.querySelector('title').innerHTML = $scope.lastTitle;
      }

      $scope.showQuery = !$scope.showQuery;
      $scope.$emit("panelActive",$scope.showQuery ? $scope.panelindex : -1);
      $scope.getData();

    };

    $scope.compareTimes = function(start, end){
      return $scope.time(start) <= $scope.time(end);
    };


    $scope.calculateRelative = function(value, which){
      var num = parseInt(value);
      var unit = (which == 'start') ? $scope.panel.relative.start_relative.unit : $scope.panel.relative.end_relative.unit;

      var date = new Date();

      switch(unit){
        case 'years':
          date.setFullYear((new Date()).getFullYear()-num);
          break;
        case 'months':
          date.setFullYear((new Date()).getFullYear(), date.getMonth()-num);
          break;
        case 'weeks':
          date.setDate((new Date()).getDate()-(7*num));
          break;
        case 'days':
          date.setDate((new Date()).getDate()-num);
          break;
        case 'hours':
          date.setTime((new Date()).getTime()-(60 * 60 * 1000 * num));
          break;
        case 'minutes':
          date.setTime((new Date()).getTime()-(60 * 1000 * num));
          break;
        case 'seconds':
          date.setTime((new Date()).getTime()-(1000 * num));
          break;
      }

        return date.toString();

    };



    $scope.$watch("panel.absolute.start_absolute",function(){
      $scope.validateIntervalAbsolute();
    },true);
   
    $scope.$watch("panel.absolute.end_absolute",function(){
      $scope.validateIntervalAbsolute();

    },true);

    $scope.$watch("panel.relative.start_relative.value",function(){
      $scope.validateIntervalRelative();
    },true);
   
    $scope.$watch("panel.relative.end_relative.value",function(){
      $scope.validateIntervalRelative();
    },true);

    $scope.$watch("panel.relative.start_relative.unit",function(){
      $scope.validateIntervalRelative();
    },true);

    $scope.$watch("panel.relative.end_relative.unit",function(){
      $scope.validateIntervalRelative();
    },true);


    $scope.validateIntervalAbsolute = function(){
      if ($scope.panel.absolute.start_absolute !== '' && $scope.panel.absolute.end_absolute !== ''){
        if (!$scope.compareTimes(String($scope.panel.absolute.start_absolute), String($scope.panel.absolute.end_absolute))){
          $scope.openModal();
          $scope.panel.absolute.start_absolute = '';
          $scope.panel.absolute.end_absolute = '';
        }
      }
    };


    $scope.validateIntervalRelative = function(){
      if ($scope.panel.relative.start_relative.value !== '' && $scope.panel.relative.end_relative.value !== ''){
        if (!$scope.compareTimes(
                                  $scope.calculateRelative($scope.panel.relative.start_relative.value, 'start'),
                                  $scope.calculateRelative($scope.panel.relative.end_relative.value, 'end')
            )
        ){
          $scope.openModal();
          $scope.panel.relative.start_relative.value = '';
          $scope.panel.relative.end_relative.value = '';
        }
      }
    };




    // Start Modal

      $scope.openModal = function(){

      if ($scope.showModal){

        $scope.showModal = false;

        var modalInstance = $modal.open({
          templateUrl: 'js/kairosdb/templates/validateModal.html',
          controller: validateModalController,
          resolve: {
            data: function () {
                return $scope;
            },
            title: function () {
                return "Warning - Time";
            },
            message: function () {
                return "'From' must be smaller than 'To'.";
            }
          }
        });
      }

      };


      var validateModalController = function($rootScope, $scope, $modalInstance, data, title, message) {
        $scope.modalInstance = $modalInstance;
        $scope.data = data;
        $scope.title =  title;
        $scope.message = message;


        $scope.close = function(){
          $scope.modalInstance.dismiss('close');
          $scope.data.showModal = true;
        };

      };

    // End Modal


    $scope.viewLegend = function(){
      $scope.$broadcast("eventViewLegend");
    };

    $scope.resetZoom = function(){
      $scope.getData();
      $scope.$broadcast("eventResetZoom");
    };


    $scope.$on("eventShowIcons",function(event, show){
      $scope.showGraphAction = show;
    });

    $scope.$on("eventGoDashboard",function(event){
      $scope.manageQuery();
    });


    $scope.$watch("showQuery",function(){
      $scope.$emit("eventShowBreadcrumbs", $scope.showQuery);
    },true);

    $scope.$watch("panelindex",function(){
      var panel_elm = angular.element(document.querySelector("#panel_"+$scope.panelindex));
      if (panel_elm.hasClass("panel-1")) {
        $scope.currentSizeIndex = 1;
      }
      if (panel_elm.hasClass("panel-2")) {
        $scope.currentSizeIndex = 2;
      }
      if (panel_elm.hasClass("panel-3")) {
        $scope.currentSizeIndex = 3;
      }
      if (panel_elm.hasClass("panel-4")) {
        $scope.currentSizeIndex = 4;
      }
    },true);

    $scope.setPanelClass = function(size) {
      $scope.$emit('setPanelClass',$scope.panelindex,size);
      $scope.currentSizeIndex = size;
    };

    $scope.order = function(direction) {
      $scope.$emit('orderPanel',$scope.panelindex,direction);
    };

    $scope.deletePanel = function(){
      $scope.$emit('eventDeletePanel',$scope.panelindex);
    };

    setInterval(function(){
      $scope.getData();
    },60000);

  }

});
