(function(global){
    var signupViewModel,
        app = global.app = global.app || {};
    
    signupViewModel = kendo.data.ObservableObject.extend({
        
        show : function(e)
        {
            $('.popup').hide();
            e.view.scroller.scrollTo(0, 0);
            
            $('#signupForm').validate({
                rules:{
                    signupEmail:{
                        email:true,
                        required:true
                    },
                    signupPassword:{
                        required:true
                    },
                    gender:{
                        required:true
                    }
                },
                messages:{
                    signupEmail:{
                        signupEmail: "Please enter valid email.",
                        required: "E-mail field is required."
                    },
                    signupPassword:{
                        required:"Password field is required."
                    },
                    gender:{
                        required: "Gender field is required."
                    }
                },
                submitHandler: function(form) {
                	return false;
                }
            });
        },
        
        signupSubmit : function()
        {
            alert("under maintenance");
           /* var status = $('#signupForm').valid();
            
            if(status === false)
            return status;*/
        }
    });
    app.signupService = {
        viewModel : new signupViewModel()
    };
})(window);