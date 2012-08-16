/**
 *  "Выделенный текст"
 * плагин точно определяет границы выделенного текста и позицию курсора
 */
(function($){
    var listenEvents = ['focus', 'click', 'dblclick', 'select', 'keydown', 'keypress', 'keyup'];

    var methods = {
        init: function(options){
            return this.each(function(){
                var $this = $(this);
                var data = $this.data('selectableText');

                if (!data) {
                    $this.data('selectableText', {
                        target: this,
                        start: -1,
                        end: -1,
                        IESel: null
                    });

                    methods._bindEvents($this);
                }
            });
        },

        destroy: function(){
            return this.each(function(){
                var $this = $(this);
                var data = $this.data('selectableText');

                $this.removeData('selectableText');

                methods._unbindEvents($this);
            })
        },

        getSelectedText: function(){
            var $this = $(this);
            var data = $this.data('selectableText');
            var target = data.target;
            var start = data.start;
            var end = data.end;
            var IESel = data.IESel;

            $(target).focus();

            return IESel ? IESel.text : (
                (start >= 0 && end > start) ? target.value.substring(start, end) : ''
            );
        },

        getPos: function(){
            var $this = $(this);
            var data = $this.data('selectableText');
            var start = data.start;
            var end = data.end;
            return {start: start, end: end};
        },

        getStart: function(){
            var $this = $(this);
            var data = $this.data('selectableText');
            var start = data.start;
            return start;
        },

        getEnd: function(){
            var $this = $(this);
            var data = $this.data('selectableText');
            var end = data.end;
            return end;
        },

        _storeCaret: function($this){
            var data = $this.data('selectableText');
            var start = -1;
            var end = -1;
            var len = 0;

            // IE
            if (document.selection) {
                data.IESel = document.selection.createRange().duplicate();
                len = data.IESel.text.length;
                start = methods._getCaretPosIE(data.target);
                end = start + len;
            } else if (typeof(data.target.selectionStart) != "undefined") {
                start = data.target.selectionStart;
                end = data.target.selectionEnd;
            }

            data.start = start;
            data.end = end;
        },

        _bindEvents: function($this){
            for (var i = 0; i < listenEvents.length; i++) {
                $this.bind(listenEvents[i], function(){
                    methods._storeCaret($this);
                });
            }
        },

        _unbindEvents: function($this){
            for (var i = 0; i < listenEvents.length; i++) {
                $this.unbind(listenEvents[i]);
            }
        },

        /**
         *  позиция курсора внутри textarea в IE
         */
        _getCaretPosIE: function(obj){
            var objTextRange = document.selection.createRange();
            var clone = objTextRange.duplicate();
            objTextRange.collapse(true);
            try {
                clone.moveToElementText(obj);
            } catch (e) {}
            clone.setEndPoint('StartToEnd', objTextRange);
            return obj.value.length - clone.text.length;
        }
    };

    $.fn.selectableText = function(method){
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод '+method+' отсутствует в jQuery.selectableText');
        }
    };
})(jQuery);