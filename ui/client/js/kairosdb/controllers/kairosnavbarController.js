define(function () {
  "use strict";

  return ['$scope', '$rootScope', 'mongooseService', 'loginService', '$q', '$modal','$routeParams','$location', kairosnavbarController];

  function kairosnavbarController($scope,$rootScope, mongooseService, loginService, $q, $modal, $routeParams, $location) {

    $scope.mongooseService = mongooseService;
    $scope.loginService = loginService;

    $scope.dashboards = [];
    $scope.panels = [];
    $scope.current_dashboard = '';
    $scope.saved_version_dashboard = '';
    $scope.modalId = '';

    $scope.message_type = "success";
    $scope.showAlert = false;
    $scope.showSave = false;
    $scope.showQuery = false;

    if (angular.isDefined($routeParams.title)) {

      var title = decodeURIComponent($routeParams.title);

      var query = {
        $or: [
          {
            username_created:$scope.username,
            status:"private",
            title:title
          },
          {
            status:"public",
            title:title
          }
        ]
      };

      $scope.mongooseService.searchDashboard(query).then(function(response){
        if (response.data.dashboards.length) {
          var parsed_dashboards = $scope.parserDashboards(response.data.dashboards);
          var dashboard = parsed_dashboards[0];

          $scope.searchDashboardsList = [];
          $scope.current_dashboard = angular.copy(dashboard);
          $scope.saved_version_dashboard = angular.copy($scope.current_dashboard);
          $scope.setTheme(dashboard.theme);
          return;
        }

        $scope.message_alert = "Access Denied";
        $scope.message_type  = "error";
        $scope.showAlert = true;

      });
    }

    $scope.setTheme = function(theme) {

      var body = angular.element(document.querySelector("body"));

      if (theme == 'light') {
        body.removeClass('dark');
        body.addClass('light');
      } else {
        body.removeClass('light');
        body.addClass('dark');
      }
      
    };

    $scope.changeTheme = function() {

      if ($scope.current_dashboard.theme == 'light') {
        $scope.current_dashboard.theme = 'dark';
        $scope.setTheme('dark');
      } else {
        $scope.current_dashboard.theme = 'light';
        $scope.setTheme('light');
      }

    };

    $scope.list_dashboards = function(){

      $scope.my_private_dashboards = [];

      //User private dashboards
      $scope.mongooseService.listDashboards({username_created: $scope.username}).then(function(response){
        $scope.my_private_dashboards = $scope.parserDashboards(response.data.dashboards);

        //public dashboards
        $scope.mongooseService.listDashboards({username_created: 'not_' + $scope.username, status: 'public'}).then(function(response){
          $scope.public_dashboards = $scope.parserDashboards(response.data.dashboards);
          $scope.dashboards = $scope.my_private_dashboards.concat($scope.public_dashboards);
        });

      });

    };

    $scope.newDashboardButton = function(){
      if ($scope.showModal()) {
        return $scope.openModal('new');
      } else {
        $scope.modalId = '';
        $scope.newDashboard();

        var deferred = $q.defer();
        deferred.reject('reject');
        return deferred.promise; 

      }
    };

    $scope.newDashboard = function(){
      $scope.modalVisible = false;

      $scope.current_dashboard = {};
      $scope.current_dashboard.panels = [];
      $scope.current_dashboard.username_created = $scope.username;
      $scope.current_dashboard.username_last_modified = $scope.username;
      $scope.current_dashboard.status = 'private';
      $scope.current_dashboard.duplicate = false;
      $scope.current_dashboard.theme = 'light';

      $scope.saved_version_dashboard = angular.copy($scope.current_dashboard);
      $scope.setTheme($scope.current_dashboard.theme);
    };

    $scope.list_dashboards();
    $scope.searchDashboards = '';
    $scope.searchDashboardsList = [];

    $scope.selectDashboardButton = function(dashboard) {
      if ($scope.showModal()) {
        $scope.openModal('select', dashboard);
      } else {
        $scope.modalId = '';
        $scope.selectDashboard(dashboard);
      }
    };

    $scope.selectDashboard = function(dashboard) {
      $location.path("/dashboards/"+encodeURIComponent(dashboard.title));
    };

    $scope.listDashboards = function() {

      $scope.searchDashboardsList = [];

      if (!angular.isDefined($scope.searchDashboards) || $scope.searchDashboards.length === 0 ) {
        return;
      }

      angular.forEach($scope.dashboards, function(value, key) {
        if (value.title.toLowerCase().indexOf($scope.searchDashboards.toLowerCase()) > -1) $scope.searchDashboardsList.push(value);
      });
    };

    $scope.listAll = function() {
      $scope.searchDashboards = '';
      if ($scope.searchDashboardsList.length === 0) $scope.searchDashboardsList = $scope.dashboards;
      else $scope.searchDashboardsList = [];
    };
        
    $scope.$watch('searchDashboards',function(){
      $scope.listDashboards();
    });

    $scope.parserDashboards = function(dashboards){
      var panels;
      angular.forEach(dashboards, function(dashboard) {
        panels = [];
        angular.forEach(dashboard.panels, function(panel) {
          if (typeof panel === 'string') {
            panel = JSON.parse(panel);
          }
          panels.push(panel);
        });
        dashboard.panels = panels;
      });
      return dashboards;
    };

    // Start Modal

    $scope.openModal = function(who, dashboard){


      var modalInstance = $modal.open({
        templateUrl: 'js/kairosdb/templates/modal.html',
        controller: modalController,
        resolve: {
          data: function () {
              return $scope;
          },
          title: function () {
              return "Warning";
          },
          message: function () {
              return "The dashboard has been changed. What would you like to do?";
          },
          who: function () {
              return who;
          },
          dashboard: function () {
              return dashboard;
          }
        }
      });

      return modalInstance.result;
    };


    var modalController = function($rootScope, $scope, $modalInstance, data, title, message, who, dashboard) {
      $scope.modalInstance = $modalInstance;
      $scope.data = data;
      $scope.title =  title;
      $scope.message = message;
      $scope.who = who;
      $scope.dashboard = dashboard;

      $scope.newDash = function(){
        $scope.data.newDashboard();
        $scope.modalInstance.dismiss('new');
      };

      $scope.selectDash = function(dash){
        $scope.data.selectDashboard(dash);
        $scope.modalInstance.dismiss('select');
      };
    };

    // End Modal

    $scope.canSave = function() {
      return  $scope.showQuery &&
              $scope.showSave &&
              $scope.current_dashboard.panels &&
              $scope.current_dashboard.panels.length > 0;
    };


    $scope.save = function(){

      //if (exist && ("it's mine" or "going to be public")) -> do update
      //else -> do save
      
      if (!$scope.current_dashboard.duplicate && angular.isDefined($scope.current_dashboard._id) && angular.equals($scope.current_dashboard.username_created, $scope.username)) {
        //Before 
        $scope.dashToSave = $scope.before(); //commons

        //Update
        $scope.mongooseService.updateDashboard($scope.dashToSave)
        .then(function(response){

          if (response.data.err) {
            if (response.data.code == 11000) {
              $scope.afterMessage('Try using a unique name', "error");
            } else {
              $scope.afterMessage('Error: Changes not updated!', "error");
            }
          } else {
            $scope.afterOK(response);//commons
            $scope.afterMessage('All changes updated!', "success");//commons  
          }
        });

      }else{

        //Before Save
        $scope.dashToSave = $scope.before(); //commons
        $scope.dashToSave.username_created = $scope.username;//current_user is the created
      
        //Save
        $scope.mongooseService.saveDashboard($scope.dashToSave)
        .then(function(response){          
          //After
          if (response.data.err) {
            if (response.data.code == 11000) {
              $scope.afterMessage('Try using a unique name', "error");
            } else {
              $scope.afterMessage('Error: Dashboard not created!', "error");
            }
          } else {
            $scope.afterOK(response);//commons
            $scope.afterMessage('Dashboard created!', "success");//commons
          }
        
        });

      }

    };

    $scope.before = function(){
        var dashToSave = angular.copy($scope.current_dashboard);        
        delete dashToSave.duplicate;
        dashToSave.username_last_modified = $scope.username;//current_user is the last modified
        return dashToSave;
    };

    $scope.afterOK = function(response){
      $scope.list_dashboards();
      $scope.saved_version_dashboard = angular.copy($scope.current_dashboard);  
      
      //add for pass the new id
      $scope.saved_version_dashboard._id = response.data._id;
      $scope.current_dashboard._id = angular.copy(response.data._id);
      //

      $scope.showSave = false;      

    };


    $scope.afterMessage = function(message, message_type){      
      $scope.message_alert = message;
      $scope.message_type = message_type;
      $scope.showAlert = true;

    };

    $scope.duplicate = function(){
      var aux = angular.copy($scope.current_dashboard);

      $scope.newDashboardButton().then(function (selectedItem) {}, function () {
          //dismiss
          aux.title = "Copy of " + angular.copy(aux.title);
          aux.duplicate = true;
          delete aux._id;
          $scope.current_dashboard = angular.copy(aux);
      });
    };

    $scope.isEditable = function(){
      if ($scope.current_dashboard.username_created === $scope.username) return true;
      if (!angular.isDefined($scope.current_dashboard.username_created)) return true;
      if ($scope.current_dashboard.username_created === '') return true;
      return false;
    };

    $scope.isDashboardChanged = function() {
      return !angular.equals($scope.saved_version_dashboard, $scope.current_dashboard);
    };

    $scope.showModal = function() {
      return $scope.isEditable() && $scope.isDashboardChanged();
    };

    $scope.$watch('current_dashboard', function(){
      if($scope.showModal()) $scope.showSave = true;
      else $scope.showSave = false;

      if (angular.isDefined($scope.current_dashboard.title)) {
        document.querySelector('title').innerHTML = $scope.current_dashboard.title + " - Moab - Turn";
      } else {
        document.querySelector('title').innerHTML = "Moab - Turn";
      }


    },true);


    $scope.$on("eventShowBreadcrumbs",function(event, show){
      $scope.showQuery = !show;
    });

    $scope.hideList = function(){
      angular.element('.MenuCombo').remove();
      $scope.searchDashboardsList = [];
    };

    $scope.logout = function(){
      $scope.loginService.logout().then(function(response){
        if(response.data.user !== 'false') {
          $location.path("/");
        }else{
          console.log("Invalid User or Pass");
        }
      });

      return false;
    };

  }

});
