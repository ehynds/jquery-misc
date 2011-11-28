(function($) {

    function Carousel(container, opts) {
        container = this.container = $(container);
        this.opts = opts;
        this.ul = container.find("ul");
        this.items = container.find("li");
        this.nextLink = container.find(opts.next);
        this.prevLink = container.find(opts.prev);
        this.itemIndex = 0;
        this.offset = 0;
        this.timer = null;
        this.init();
    }

    Carousel.prototype = {
        init: function() {
            this.nextLink.bind("click", $.proxy(this.next, this));
            this.prevLink.bind("click", $.proxy(this.prev, this));

            if (this.opts.autoTransition) {
                this.setTimer();
            }
        },

        next: function(event) {
            event && event.preventDefault();
            this.itemIndex = this.itemIndex + this.opts.itemsPerTransition;
            this.animate();
        },

        prev: function(event) {
            event && event.preventDefault();
            this.itemIndex = (this.itemIndex || this.items.length) - this.opts.itemsPerTransition;
            this.animate();
        },

        animate: function() {
            if (this.itemIndex < 0) {
                this.itemIndex = this.items.length - 1;
            } else if (this.itemIndex > this.items.length - 1) {
                this.itemIndex = 0;
            }

            clearTimeout(this.timer);
            var nextItem = this.items.eq(this.itemIndex);
            var offset = nextItem.position().left * -1;

            var callback = $.proxy(function() {
                this.opts.onScrollEnd.call(this, {
                    currPage: Math.round(this.itemIndex / this.opts.itemsPerTransition) + 1,
                    totalSlides: this.items.length,
                    totalPages: Math.round(this.items.length / this.opts.itemsPerTransition)
                });

                this.opts.autoTransition === true && this.setTimer();
            }, this);


            this.ul.animate({
                left: offset
            }, this.opts.speed, this.opts.easing, callback);
        },

        setTimer: function() {
            this.timer = setTimeout($.proxy(function() {
                this.next();
            }, this), this.opts.autoTransitionSpeed);
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
        itemsPerTransition: 4,
        onScrollEnd: $.noop,
        autoTransition: false,
        autoTransitionSpeed: 5000
    };

})(jQuery);

$(".carousel").carousel({
    autoTransition: true,
    onScrollEnd: function(data) {
        $(this.container).find(".count").text(function() {
            return "Page # of #".replace("#", data.currPage).replace("#", data.totalPages);
        });
    }
});
