define(function () {
  "use strict";

  return [skip];

  function skip() {
    return function(scope, element) {
        $(element).click(function(event) {
            event.preventDefault();
        });
    };
  }
});