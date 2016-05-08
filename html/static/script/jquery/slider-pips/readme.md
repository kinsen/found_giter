
##控件使用说明
https://github.com/simeydotme/jQuery-ui-Slider-Pips
http://simeydotme.github.io/jQuery-ui-Slider-Pips/	#英文
http://www.htmleaf.com/jQuery/Form/201502131372.html #中文

##使用说明
```
//之所以使用两层嵌套，是因为加载js时，slider-pips总比jquery-ui先加载，导致报错。
require.async(["jquery-ui", "jquery-ui-css"], function() {
    require.async(["slider-pips", "slider-pips-css"], function() {
        // $(".slider").slider().slider("float");
        $(".slider").slider({
            max: 12
        }).slider("pips", {
            rest: "label"
        }).slider("float");
    });
});
```