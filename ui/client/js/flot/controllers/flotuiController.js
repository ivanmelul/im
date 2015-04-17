define(function () {
  "use strict";

  return ['$scope', '$rootScope','kairosuiService', flotuiController];

  function flotuiController($scope,$rootScope,kairosuiService,$filter) {

    $scope.dontReload = false; 

    $scope.showLegend = false;
    $scope.viewLegend = function(){
      $scope.showLegend = !($scope.showLegend);
    };

    $scope.showFlotChart = function (yaxis, data) {

      $scope.flotOptions = {
        series: {
          lines: {show: true, fill: 0.2},
          points: { show: false }
        },
        grid: {
          hoverable: true,
          borderColor: "rgba(126,126,126,0.16)",
          borderWidth:1
        },
        selection: {
          mode: "xy"
        },
        xaxis: {
          mode: "time",
          timezone: "browser",
          color: "rgba(126,126,126,0.16)",
          borderColor: "rgba(126,126,126,0.16)",
        },
        yaxis:{
          color: "rgba(126,126,126,0.16)",
          borderColor: "rgba(126,126,126,0.16)",
        },
        shadowSize:0,
        hoverable: true,
        clickable: true,
        legend: {
          container: $(document.querySelector("#chart_"+$scope.panelindex+" .graphLegend")),
          show: true
        },
        colors: $scope.colors
      };

      $scope.flotOptions.yaxes = yaxis;

      angular.element(document.querySelector('#graph_'+$scope.panelindex))
      .addClass('flotChartSize');

      setTimeout(function (){
        $scope.drawSingleSeriesChart(data, $scope.flotOptions);
      }, 0);

    };

    $scope.resetZoom = function() {
      $scope.dontReload = false;
      $scope.graph();
    };

    $scope.getTimezone = function (date) {
      // Just rips off the timezone string from date's toString method. Probably not the best way to get the timezone.
      var dateString = date.toString();
      var index = dateString.lastIndexOf(" ");
      if (index >= 0) {
        return dateString.substring(index);
      }

      return "";
    };

    $scope.drawSingleSeriesChart = function (data, flotOptions) {

      var chartElm = angular.element(document.querySelector("#graph_"+$scope.panelindex));

      $scope.graphic = $.plot(chartElm, data, $scope.flotOptions);

      var previousPoint = -1;

      chartElm.bind("plothover", function (event, pos, item) {
        
        if (item) {
          if (previousPoint != item.dataIndex) {
            previousPoint = item.dataIndex;

            $("#tooltip").remove();
            var x = item.datapoint[0];
            var y = item.datapoint[1].toFixed(2);

            var timestamp = new Date(x);
            var formattedDate = $.plot.formatDate(timestamp, "%b %e, %Y %H:%M:%S.millis %p");
            formattedDate = formattedDate.replace("millis", timestamp.getMilliseconds());
            formattedDate += " " + $scope.getTimezone(timestamp);
            var numberFormat = (y % 1 !== 0) ? '0,0[.00]' : '0,0';
            $scope.showTooltip(item.pageX, item.pageY,
            item.series.label + "<br>" + numeral(y).format(numberFormat) + "<br>" + formattedDate);
          }
        } else {
          $("#tooltip").remove();
          previousPoint = null;
        }
      });

      chartElm.bind("plotselected", function (event, ranges) {

        $scope.dontReload = true;

        if ($scope.flotOptions.yaxes.length != (Object.keys(ranges).length - 1))
          return;

        var axes = {};
        axes.yaxes = [];

        $.each(ranges, function (key, value) {
          if (key == "xaxis")
          {
            axes.xaxis = {};
            axes.xaxis.min = value.from;
            axes.xaxis.max = value.to;
          }
          else {
            var axis = {};
            axis.min = value.from;
            axis.max = value.to;
            axes.yaxes.push(axis);
          }
        });

        $.plot(chartElm, data, $.extend(true, {}, $scope.flotOptions, axes));
        $scope.showZoom = true;
        
      });
    };

    $scope.showTooltip = function (x, y, contents) {
      var tooltip = $('<div id="tooltip" class="graphTooltip">' + contents + '</div>');
      tooltip.appendTo("body");

      var $body = $('body');
      var left = x + 5;
      var top = y + 5;

      // If off screen move back on screen
      if ((left) < 0)
        left = 0;
      if (left + tooltip.outerWidth() > $body.width())
        left = $body.width() - tooltip.outerWidth();
      if (top + tooltip.height() > $body.height())
        top = $body.height() - tooltip.outerHeight();

      // If now over the cursor move out of the way - causes flashing of the tooltip otherwise
      if ((x > left && x < (left + tooltip.outerWidth())) || (y < top && y > top + tooltip.outerHeight())) {
        top = y - 5 - tooltip.outerHeight(); // move up
      }

      tooltip.css("left", left);
      tooltip.css("top", top);

      tooltip.fadeIn(200);

    };   

    $scope.showChart = function (queries) {

      var yaxis = [];
      $scope.dataPointCount = 0;
      $scope.data = [];
      var axisCount = 0;
      var metricCount = 0;
      $scope.sampleSize = 0;
      queries.forEach(function (resultSet) {
        var axis = {};
        if (metricCount === 0) {
          yaxis.push(axis);
          axisCount++;
        }
        // else if ((metricData != null) && (metricData[metricCount].scale)) {
        //   axis.position = 'right'; // Flot
        //   yaxis.push(axis);
        //   axisCount++;
        // }

        $scope.sampleSize += resultSet.sample_size;
        resultSet.results.forEach(function (queryResult) {

          var groupByMessage = "";
          var groupBy = queryResult.group_by;
          var groupType;

          //debugger;
          if (groupBy) {
            $.each(groupBy, function (index, group) {
              if (group.name == 'type') {
                groupType = group.type;
                return;
              }
              groupByMessage += '<br>(' + group.name + ': ';

              var first = true;
              $.each(group.group, function (key, value) {
                if (!first)
                  groupByMessage += ", ";
                groupByMessage += key + '=' + value;
                first = false;
              });

              groupByMessage += ')';

            });
          }

          if (groupType != 'number')
            return;

          var result = {};
          result.name = queryResult.name + groupByMessage;
          result.label = queryResult.name + groupByMessage;
          result.data = queryResult.values;
          result.yaxis = axisCount; // Flot
          result.yAxis = axisCount - 1; // Highcharts

          $scope.dataPointCount += queryResult.values.length;
          $scope.data.push(result);
        });
        metricCount++;
      });

      $scope.sampleSize = $scope.sampleSize;
      $scope.dataPointCount = $scope.dataPointCount;

      $scope.status = '';
      if ($scope.dataPointCount > 20000) {
        $scope.status = "You are attempting to plot more than 20,000 data points.\nThis may take a long time.";
      }

      $scope.showFlotChart(yaxis, $scope.data);
      $scope.status = '';
    };

    $scope.graph = function () {

      if ($scope.dontReload) {
        return true;
      }

      if (angular.isDefined($scope.results.queries)) {
        $scope.showChart($scope.results.queries);
      } else {
        $scope.showChart([]);
      }
    };

    $scope.$watch('results',function (){
      $scope.graph();
      $scope.$emit("eventShowIcons", angular.isDefined($scope.results.queries) && $scope.results.queries.length > 0);
    });

    $scope.$on("eventViewLegend",function(event){
      $scope.viewLegend();
    });

    $scope.$on("eventResetZoom",function(event){
      $scope.resetZoom();
    });

  }
});
