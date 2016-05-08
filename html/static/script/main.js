define("main", ['$',"handlebars", 'kong/common'], function(require, exports) {
    var $ = require("$");
    var Handlebars=require("handlebars");
    $.getJSON("./data.json",function(data){
        var source   = $("#template").html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $("table").html(html);
    });
});