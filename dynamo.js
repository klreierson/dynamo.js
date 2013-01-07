(function($) {

    $.fn.dynamo = function(options) {

        return this.each(function(i, v) {
            var v = $(v);
            // we mark launched dynamos as "intialized" then check so we don't initialize them twice
            if (v.data('initialized') == 'true')
                return;
            
            var delay = options.delay || parseInt(v.data('delay')) || 3000;
            var speed = options.speed || parseInt(v.data('speed')) || 350;
            var pause = options.pause || v.data('pause') || false;
            var lines = options.lines || v.data('lines').split(v.data('delimiter') || ',');

            // wrap the original contents in a span
            v.html($('<span></span>').text(v.text())).data('initialized', 'true');

            // grab the width of the span
            var max = v.find('span:eq(0)').width();

            // for each item in data-lines, create a span with item as its content
            // compare the width of this span with the max
            for (k in lines) {
                var span = $('<span></span>').text(lines[k]);
                v.append(span);
                max = Math.max(max, span.width());
            }

            // replace all the spans with inline-div's
            v.find('span').each(function(i, ele) {
                s = $(ele).remove();
                d = $('<div></div>').text(s.text());
                d.width(max);
                v.append(d);
            });

            // set the height of the dynamo container
            var height = v.find('>:first-child').height();

            // style
            v.width(max)
             .height(height)
             .css({
                 'display' : 'inline-block',
                 'position' : 'relative',
                 'overflow' : 'hidden',
                 'vertical-align' : 'bottom',
                 'text-align' : 'left'
             });

            // manually center it if we need to
            if (v.data('center'))
                v.css('text-align', 'center');

            // now, animate it
            var transition = function() {
                v.dynamo_trigger({ speed: speed });
            };

            if (!pause) {
              setInterval(transition, delay);
            }
        });
    };
    
    $.fn.dynamo_trigger = function(options) {
        return this.each(function(i, v) {
            $(v).find('div:first').slideUp(options.speed, function() { 
                $(v).append($(this).show());
            });
        });
    };

    // automatically initiate cycles on elements of class 'dynamo'
    $('.dynamo').dynamo({});

})(jQuery);