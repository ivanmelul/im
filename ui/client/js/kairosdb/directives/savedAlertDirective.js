define(function () {
  "use strict";

  return ['$timeout', savedAlert];

  function savedAlert($timeout) {
    return {
      restrict : 'E',
      templateUrl: require.toUrl('./kairosdb/templates/savedAlert.html'),
      scope: {
        visible:'=',
        message:'=',
        time:'=',
        type:'='
      },
      link: function(scope, element, attrs){

        scope.$watch('visible', function(value) {
          if(value){
            scope.show = true;
            $timeout(function(){ 
              scope.show = false;
              scope.visible = false;
            }, scope.time);
          }
        });
      }
    };
  }
});
