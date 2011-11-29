(function($) {

  function Carousel(container, opts) {
    container = this.container = $(container);
    this.opts = opts;
    this.ul = container.find("ul");
    this.items = this.ul.children();
    this.nextLink = container.find(opts.next);
    this.prevLink = container.find(opts.prev);
    this.itemIndex = 0;
    this.offset = 0;
    this.timer = null;
    this._init();
  }

  Carousel.prototype = {
    _init: function() {
      this.nextLink.bind("click", $.proxy(this.next, this));
      this.prevLink.bind("click", $.proxy(this.prev, this));

      if (this.opts.autoTransition) {
        this._setTimer();
      }
    },

    next: function(event) {
      event && event.preventDefault();
      this._move("next");
    },

    prev: function(event) {
      event && event.preventDefault();
      this._move("prev");
    },

    _move: function(direction) {
      var numItems = this.opts.itemsPerTransition;
      numItems = (direction === "next" ? numItems : (numItems * -1));

      this.itemIndex += numItems;

      // if no loop should take place, reset the itemIndex and bail.
      if(this._checkLoop() === false){
        this.itemIndex -= numItems;
        return;
      }

      this._animate(direction);
    },

    _animate: function(direction) {
      clearTimeout(this.timer);
      var nextItem = this.items.eq(this.itemIndex);
      var offset = nextItem.position().left * -1;

      var callback = $.proxy(function() {
        $(this).trigger("onScrollEnd");

        this.opts.onScrollEnd.call(this, {
          currPage: Math.round(this.itemIndex / this.opts.itemsPerTransition) + 1,
          totalSlides: this.items.length,
          totalPages: Math.round(this.items.length / this.opts.itemsPerTransition)
        });

        this.opts.autoTransition === true && this._setTimer();
      }, this);


      this.ul.stop().animate({
        left: offset
      }, this.opts.speed, this.opts.easing, callback);
    },

    _setTimer: function() {
      this.timer = setTimeout($.proxy(function() {
        this.next();
      }, this), this.opts.autoTransitionSpeed);
    },

    // determine whether or not a loop is needed. If one is,
    // set it up correctly.
    _checkLoop: function() {
      var type = this.opts.loop;
      var left = this.itemIndex < 0;
      var right = this.itemIndex > this.items.length - 1;

      if(!right && !left) {
        return;
      } else if(type === "circular") {
        this._createCircularLoop(right);
      } else if(!type) {
        return false;   
      } else {
        this.itemIndex = right ? 0 : this.items.length - this.opts.itemsPerTransition;  
      }
    },

    // logic for circular loops
    _createCircularLoop: function(isNext) {
      var numItems = this.opts.itemsPerTransition;
      var clone = this.items.slice.apply(this.items, (isNext ? [0, numItems] : [-numItems])); 

      clone = clone.clone()[isNext ? "appendTo" : "prependTo"](this.ul);
      this.items = this.ul.children();

      if (!isNext) {
        this.ul.css("left", -this.items.eq(numItems).offset().left);
        this.itemIndex = 0;
      }

      $(this).one("onScrollEnd", $.proxy(function() {
        clone.remove();
        this.items = this.ul.children();
        var left = 0;

        if (isNext) {
          this.itemIndex = 0;
        } else {
          this.itemIndex = this.items.length - numItems;
          left = -this.items.slice(-numItems).first().offset().left;
        }

        this.ul.css("left", left);
      }, this));
    }
  };

  $.fn.carousel = function(opts) {
    return this.each(function() {
      opts = $.extend({}, $.fn.carousel.defaults, opts);
      $.data(this, "carousel", new Carousel(this, opts));
    });
  };

  $.fn.carousel.defaults = {
    next: ".next",
    prev: ".prev",
    speed: 200,
    easing: "swing",
    loop: "circular", // false, circular, or reset
    itemsPerTransition: 4,
    onScrollEnd: $.noop,
    autoTransition: false,
    autoTransitionSpeed: 1000
  };

})(jQuery);

