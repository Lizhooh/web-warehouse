'use strict';

/**
 * 自定义查询引擎
 * $$(select, content)
 */
(function(){

    /**
     * 选择器
     */
    var $$ = function(select, content) {
            content = content || document;

            return Array.prototype.slice.call(
                content.querySelectorAll(select)
            );
        },

        setKey = function(key) {
            var keyarr = key.split('-');

            key = keyarr[0];
            for(var j = 1; j < keyarr.length; j++) {
               key += keyarr[j][0].toUpperCase() + keyarr[j].substr(1);
            }

            return key;
        };

    /**
     * 辅助函数
     */
    Array.prototype.get = function(index) {
        return this[index];
    };

    Array.prototype.all = function() {
        return this;
    };

    /**
     * 设置css
     */
    Element.prototype.css = function(attr) {
        var self = this;

        if(typeof attr !== 'object') throw new Error(attr + ' is not object.');

        for(var key in attr) {
            var keys = setKey(key);

            if(keys in self.style) {
                self.style[keys] = attr[key];
            }
        }

        return this;
    };

    /**
     * 增加类
     */
    Element.prototype.addClass = function(name) {
        var klass = [];

        klass = (this.getAttribute('class') || '').split(' ');

        if(klass.indexOf(name) === -1) {
            klass.push(name);
        }

        this.setAttribute('class', klass.join(' '));

        return this;
    };

    /**
     * 移除类
     */
    Element.prototype.removeClass = function(name) {
        var klass = [],
            index = -1;

        klass = (this.getAttribute('class') || '').split(' ');

        index = klass.indexOf(name);
        if(index != -1) {
            klass.splice(index, 1);
        }

        this.setAttribute('class', klass.join(' '));

        return this;
    };

    /**
     * 偏移量
     */
    Element.prototype.offset = function() {
        var off = {};

        var itea = function(node, set) {
            set = set || {top:0, left: 0};

            set.top  += node.offsetTop;
            set.left += node.offsetLeft;

            return node == document.body ? set: itea(node.parentNode, set);
        };

        return itea(this);
    };

    window.$$ = $$;
})(document, undefined);

