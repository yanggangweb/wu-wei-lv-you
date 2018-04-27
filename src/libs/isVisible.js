!(function(){
    var visibleOnStage = function(dom){
        var rect = dom.getBoundingClientRect();
        var rectd = document.getBoundingClientRect();

        return
            true
                && $(dom).is(":visible")
                && rect.top + rect.height>0
                && rect.top + rect.height<rectd.height
                && rect.left + rect.width>0
                && rect.left + rect.width<rectd.width
            ;
    }
})();
