/**
 * circular-menu directive
 * Creates a circular scrolling menu
 *
 * Authors: Alfredo Bonilla
 */
'use strict';

/**
 * Circular Menu Directive
 * 
 * Directive for circular menu plugin
 */
angular.module('application').
  directive('circularMenu', function($parse, $timeout) {
    return {
      restrict: 'A',
      replace: true,
      transclude: false,
      compile: function(element, attrs) {            
        return function (scope, slider, attrs, controller) {
          // Set circle menu attributes
          var menuAttributes = {
            angle_start : 0,//-Math.PI/2,
            delay: 50,
            distance: attrs.distance,
            angle_interval: Math.PI/attrs.interval,
            width: 100,
            height: 100,
            easingFuncShow:"easeOutBack",
            easingFuncHide:"easeInBack",
            step:35,
            itemRotation:60,
            openCallback:true,
            closeCallback:false,
          };
          // Initializes menu initial position.
          var position = 90;
          // Initializes touch starting point
          var touchstart, clickstart = 0;
          // Sets circle menu
          element.find('.circular-menu-wrapper').WCircleMenu(menuAttributes);
          // Opens the menu
          element.find('.circular-menu-wrapper').WCircleMenu('open');
          // Sets menu position
          element.find('.wcircle-menu').rotate(position);
          // Attach rotation events to the menu
          element.find('.wcircle-menu').rotate({
            bind: {
              mousewheel : function(event) {
                if(event.originalEvent.wheelDelta >= 0) {
                  position -= 1.01;      
                }
                else {
                  position += 1.01;
                }
                angular.element(this).rotate({animateTo:position});
                element.find('.wcircle-menu-item').each(function (i,v) {
                  var matrix = getTransformMatrix(angular.element(v));
                  // Set rotation value according to the menu rotation
                  matrix[2]  = -position;
                  // Set rotation for each menu item
                  // TODO: fix the rotation, for some reason menu items are not rotating.
                  angular.element(v).css('-webkit-transform', matrixToString(matrix));
                });
              },
              touchstart : function (e) {
                touchstart = e.originalEvent.touches[0].clientY;
              },
              touchend : function(e) {
                // Validates touchmove direction
                var touchend = e.originalEvent.changedTouches[0].clientY;
                if (touchend > touchstart) {
                  position -= 25; 
                }
                else {
                  position += 25;
                }
                angular.element(this).rotate({animateTo:position});
              },
              mousedown : function (e) {
                clickstart = e.originalEvent.clientY;
              },
              mouseup : function (e) {
                // Validates mouse drag direction
                var clickend = e.originalEvent.clientY;
                if (clickend > clickstart) {
                  position -= 25; 
                }
                else {
                  position += 25;
                }
                angular.element(this).rotate({animateTo:position});
              }
            }
          });
          /**
           * Get raw matrix from -webkit-transform property
           */
          function getTransformMatrix(el) {
            var string = angular.element(el).css('-webkit-transform');
            var modified = string.replace(/^\w+\(/,"[").replace(/\)$/,"]");
            var matrix = JSON.parse(modified);
            return matrix;
          }
          /**
           * Prepare a string value from a transform matrix
           */
          function matrixToString(matrix) {
            var string = 'matrix(';
            for(var i = 0; i < matrix.length; i++) {
              string += matrix[i] + ', ';
            }
            string += ')';
            return string;
          }
        };
      }
    };
  });