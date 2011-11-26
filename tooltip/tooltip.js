/* tooltip plugin (Eric Hynds) */
(function($){
  $.fn.tooltip = function(opts) {
    $.fn.tooltip.defaults = {
      offsetX: 0, // X offset relative to cursor
      offsetY: 0, // Y offset relative to cursor
      delay: 150, // delay of showing/hiding a tip on mouseenter
      speed: "fast", // speed of which to fade tips in/out
      position: "bottom right" // relative to cursor
    };

    opts = $.extend($.fn.tooltip.defaults, opts || {});

    var instances = [];

    function Tooltip(elem, opts) {
      elem = this.elem = $(elem);

      this.content = elem.attr("title");
      elem.removeAttr("title");

      elem.bind({
        "mouseenter": $.proxy(this.show, this),
        "mouseleave": $.proxy(this.hide, this),
        "mousemove":  $.proxy(this.mousemove, this)
      });

      this.render();

      instances[ instances.length ] = this;
    }

    // force-cose all tooltips except for the one passed in.
    // if you move your mouse around like crazy, opening
    // a ton of them, this ensures only 1 is actually open
    // at a time.
    Tooltip.closeAllExcept = function(instance) {
      for(var i = 0, len = instances.length; i < len; i++) {
        if(instances[i] !== instance) {
          instances[i].tooltip.hide();
        }
      }
    };

    Tooltip.prototype = {
      render: function() {
        var tmpl = '';
        tmpl += '<div class="tooltip-box">';
        tmpl += this.content;
        tmpl += '</div>';

        this.tooltip = $(tmpl).appendTo(document.body);
        this.elem.removeAttr("title");
      },

      show: function(event) {
        Tooltip.closeAllExcept(this);

        // element must be visible to correctly
        // calculate its positioning.
        this.tooltip.show();
        this.position(event.pageX, event.pageY);
        this.tooltip.hide();

        clearTimeout(this.timer);
        this.timer = setTimeout($.proxy(function(){
          this.tooltip.stop(true, true).fadeIn(opts.speed);
        }, this), opts.delay);
      },
      
      hide: function(event) {
        clearTimeout(this.timer);
        this.tooltip.stop(true, true).fadeOut(opts.speed);
      },

      mousemove: function(event) {
        this.position(event.pageX, event.pageY);
      },

      position: function(x, y) {
        var pos = {
          top: y + opts.offsetY,
          left: x + opts.offsetX
        };
        
        if(opts.position === "bottom left") {
          pos.left = x - this.tooltip.outerWidth();
        }

        // TODO: collision detection
        // TODO: support other positions

        this.tooltip && this.tooltip.css(pos);
      }
    };

    return this.each(function(){
      var tooltip = $.data(this, "tooltip");
      !tooltip && $.data(this, "tooltip", new Tooltip(this));
    });
  };

})(jQuery);

