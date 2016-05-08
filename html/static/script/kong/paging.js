define("kong/paging", ['$','kong/common'], function(require, exports,module) {
    var $ = require('$');
    module.exports = function(current, total) {
        var sb = new Array();
        sb.push('<div class="ui-paging ui-paging-black">');
        sb.push('<a href="#" class="ui-paging-prev">上一页</a>');
        for (var i = 1; i <= total; i++) {
            sb.push('<a href="#/page/{0}" page="{0}" class="ui-paging-item {1}">{0}</a>'.format(i, i == current ? "ui-paging-current" : ""));
        }
        sb.push('<a href="#" class="ui-paging-next">下一页</a>');
        sb.push('</div>');

        var html = sb.join("");
        return $(html);
    }
});