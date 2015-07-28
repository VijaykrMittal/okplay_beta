(function(global){
    var signupViewModel,
        app = global.app = global.app || {};
    
    signupViewModel = kendo.data.ObservableObject.extend({
        
        show : function(e)
        {
            $('.popup').hide();
            e.view.scroller.scrollTo(0, 0);
        },
    });
    app.signupService = {
        viewModel : new signupViewModel()
    };
})(window);