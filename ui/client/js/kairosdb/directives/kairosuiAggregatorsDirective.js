define(function () {
  "use strict";

  return [kairosuiAggregators];

  function kairosuiAggregators() {
    return {
      restrict : 'E',
      templateUrl: require.toUrl('./kairosdb/templates/aggregators-by.html'),
      link: function(scope, elem) {

        scope.newElem = function(type) {

          var group_1 = ['avg','dev','min','max','sum','count','least_squares'];

          if (group_1.indexOf(type) != -1) {
            return {name:type, align_sampling:true, sampling:{value:'1',unit:'milliseconds'}};
          }

          if (type == 'div') {
            return {name:'div',divisor:'1'};
          }

          if (type == 'rate') {
            return {name:'rate', unit:'milliseconds'};
          }

          if (type == 'sampler') {
            return {name:'sampler', unit:'milliseconds'};
          }          

          if (type == 'scale') {
            return {name:'scale', factor:'1'};
          }

          if (type == 'percentile') {
            return {name:'percentile', percentile:"0.75" ,sampling:{value:'1',unit:'milliseconds'}};
          }            

        };

        scope.add = function(type) {
          scope.metric.aggregators.push(scope.newElem(type));
        };

        scope.remove = function(index){
          scope.metric.aggregators.splice(index,1);
        };

        scope.unslug = function(name) {
          return name.toLowerCase().replace(/-+/g,' ').replace(/\s+/g, ' ').replace(/[^a-z0-9-]/g, ' ');
        };
      }
    };
  }
});
