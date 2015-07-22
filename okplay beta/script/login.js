(function(global){
    var loginViewModel,
        app = global.app = global.app || {};
    var loginBindingValue;
    
    loginViewModel = kendo.data.ObservableObject.extend({
        
        show : function()
        {
            loginBindingValue = kendo.observable({
                email: '',
                pwd:''
            });

            kendo.bind($('#loginForm'), loginBindingValue);
            
            $('#loginForm').validate({
                rules:{
                    email:{
                        email:true,
                        required:true
                    },
                    pwd:{
                        required:true
                    }
                },
                messages:{
                    email:{
                        email: "Please enter valid email.",
                        required: "E-mail field is required."
                    },
                    pwd:{
                        required:"Password field is required."
                    }
                },
                submitHandler: function(form) {
                	return false;
                }
            });
        },
        
        loginSubmit:function()
        {
           // var status = $('#loginForm').valid();
            
           // if(status === false)
           // return status;
          console.log(loginBindingValue.email);
        }
    });
    app.loginService = {
        viewModel : new loginViewModel()
    };
})(window);