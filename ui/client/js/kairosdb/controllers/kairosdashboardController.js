define(function () {
  "use strict";

  return ['$scope', '$rootScope', 'mongooseService','$filter','$modal', kairosdashboardController];

  function kairosdashboardController($scope,$rootScope, mongooseService, $filter, $modal) {

    $scope.showBreadcrumbs = false;

    $scope.mongooseService = mongooseService;

    $scope.addPanel = function(panel) {              

        if (typeof panel == 'string') {
          panel = JSON.parse(panel);
        }
        $scope.dashboard.panels.push(panel);
    };

    $scope.panelActive = -1;
    $scope.$on("panelActive",function(event,panelActive){
      $scope.panelActive = panelActive;
    });

    $scope.panelclasses = [];
    for (var x = 1; x < 5; x++ ) {
      $scope.panelclasses.push("panel-"+x);
    }

    $scope.currentPanelLabel = function(index) {

      var size = $scope.currentPanelClassLabel(index);

      var label = '';

      if (size == 1 ) {label = 'S';}
      if (size == 2 ) {label = 'M';}
      if (size == 3 ) {label = 'L';}
      if (size == 4 ) {label = 'X';}

      return label;
    };

    $scope.currentPanelClassLabel = function(index) {
      
      if (!angular.isDefined($scope.dashboard.panels[index])) {
        return '';
      }

      var panel = String(angular.copy($scope.dashboard.panels[index].panelclass));
      return parseInt(panel.replace("panel-",""));
    };

    $scope.movePanelClass = function(direction,index) {

      var current = $scope.currentPanelClassLabel(index);

      if (direction > 0) {
        current++;
      } else {
        current--; 
      }

      if (current > 4) {
        current = 1;
      }
      if (current < 1) {   
        current = 4;
      }

      $scope.dashboard.panels[index].panelclass = "panel-"+current;
      
    };

    $scope.setPanelClass = function(index,size) {
      $scope.dashboard.panels[index].panelclass = "panel-"+size;
    };

    $scope.$on("setPanelClass",function(e,index,size){

      var original_index = -1;
      for (var x in $scope.dashboard.panels) {
        if ($scope.dashboard.panels[x].panelorder == index) {
          original_index = x;
          break;
        }
      }


      if (size > 4) {
        size = 1;
      }
      if (size < 1) {
        size = 4;
      }
      $scope.setPanelClass(original_index,size);
    });


    $scope.$on("orderPanel",function(e,index,direction){

      var original_index = -1;
      for (var x in $scope.dashboard.panels) {
        if ($scope.dashboard.panels[x].panelorder == index) {
          original_index = x;
          break;
        }
      }

      var next_order = index;

      if (direction > 0) {
        next_order++;
      } else {
        next_order--;
      }

      if (next_order == $scope.dashboard.panels.length) {
        next_order = 0;
      }
      if (next_order < 0) {   
        next_order = $scope.dashboard.panels.length -1;
      }

      var next_index = -1;
      for (x in $scope.dashboard.panels) {
        if ($scope.dashboard.panels[x].panelorder == next_order) {
          next_index = x;
          break;
        }
      }

      var aux = $scope.dashboard.panels[next_index].panelorder;
      $scope.dashboard.panels[next_index].panelorder = $scope.dashboard.panels[original_index].panelorder;
      $scope.dashboard.panels[original_index].panelorder = aux;

    });

    $scope.shuffleColors = function() {

      /*
      if (theme == 'light') {
        var array = ["#ff1e7d", "#199bf6", "#00d1a6", "#545454", "#7b3dc0", "#8dc100", "#899826", "#3979e5", "#fe7316", "#ff3333"];
      } else {
        var array = ["#0db8ff", "#fd3489", "#33dab8", "#b557fe", "#a9a9a9", "#eeff2b", "#647300", "#3581ff", "#ff802c", "#fc4040"];
      }
      */

      var array = ["#0db8ff", "#fd3489", "#33dab8", "#b557fe", "#a9a9a9", "#eeff2b", "#647300", "#3581ff", "#ff802c", "#fc4040"];

      var m = array.length, t, i;

      // While there remain elements to shuffle
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }

      return array;
    } ;

    $scope.newPanel = function(){

      $scope.dashboard.panels.push({
        absolute: {
          start_absolute:'',
          end_absolute:''
        },
        relative: {
          start_relative:{value:'',unit:'hours'},
          end_relative:{value:'',unit:'hours'},
        },
        metrics: [],
        panelname:'',
        panelclass: 'panel-4',
        panelorder:$scope.dashboard.panels.length ? $scope.dashboard.panels.length : 0,
        colors: $scope.shuffleColors()
      });
    };

    $scope.getPanelClass = function(index) {
      if ($scope.panelActive == index ) {
        return 'PanelActive';
      }

      return $scope.panelActive != -1 ? 'PanelHide':'';
    };

    $scope.isEditable = function(){
      if ($scope.dashboard.username_created == $scope.username) return true;
      if (!angular.isDefined($scope.dashboard.username_created)) return true;
      if ($scope.dashboard.username_created === '') return true;
      return false;
    };

    $scope.goDashboard = function(){
      $scope.$broadcast("eventGoDashboard");
    };

    $scope.$on("eventShowBreadcrumbs",function(event, show){
      $scope.showBreadcrumbs = show;
    });

    $scope.$on("eventDeletePanel",function(event, index){     
      var original_index = -1;
      for (var x in $scope.dashboard.panels) {
        if ($scope.dashboard.panels[x].panelorder == index) {
          original_index = x;
          break;
        }
      }

      $scope.dashboard.panels.splice(original_index, 1);
      //$scope.openModal();
    });


    // Start Modal

      $scope.openModal = function(){
        var modalInstance = $modal.open({
          templateUrl: 'js/kairosdb/templates/validateModal.html',
          controller: validateModalController,
          resolve: {
            title: function () {
                return "Warning - Panels";
            },
            message: function () {
                return "The dashboard doesn't have any panels.";
            }
          }
        });
      };


      var validateModalController = function($rootScope, $scope, $modalInstance, title, message) {
        $scope.modalInstance = $modalInstance;
        $scope.title =  title;
        $scope.message = message;


        $scope.close = function(){
          $scope.modalInstance.dismiss('close');
        };

      };

    // End Modal


  }
});
