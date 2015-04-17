define(function () {
  "use strict";

  return [kairosuiGroupby];

  function kairosuiGroupby() {
    return {
      restrict : 'E',
      templateUrl: require.toUrl('./kairosdb/templates/groups.html'),
      link: function(scope, elem) {

          scope.newTag = function() {
            var tags = [];
            var first = false;
            angular.forEach(scope.tagsList, function(value, key) {
              if (!first) {
                this.push(key);
                first = true;
              }
            }, tags);
            return {name:'tag',tags:tags};
          };

          scope.newTime = function() {
            return {name:'time',group_count:'1',range_size:{value:'1',unit:'milliseconds'}};
          };

          scope.newValue = function() {
            return {name:'value',range_size:'1'};
          };

          scope.add = function(type) {
            if (type == 'tag') {
              scope.metric.groups.push(scope.newTag());
            }
            if (type == 'time') {
              scope.metric.groups.push(scope.newTime());
            }
            if (type == 'value') {
              scope.metric.groups.push(scope.newValue());
            }
          };

          scope.manageTagInGroup = function(group,tagName) {

            var indexTag = group.tags.indexOf(tagName);

            if ( indexTag == -1) {
              group.tags.push(tagName);
            } else {
              group.tags.splice(indexTag, 1);
            }

          };

          scope.remove = function(index){
            scope.metric.groups.splice(index,1);
          };

      }
    };
  }
});
