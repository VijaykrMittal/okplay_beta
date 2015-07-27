(function(global){
    var loginViewModel,
        app = global.app = global.app || {};
    var loginBindingValue;
    
    loginViewModel = kendo.data.ObservableObject.extend({
        email:'',
        show : function()
        {
            $('.popup').hide();
            $('label.error').hide();
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
            
            /*myaccount view*/
            $('#username').text(localStorage.getItem('userName'));
            $('#useremail').text(localStorage.getItem('userEmail'));
        },
        
        loginSubmit:function()
        {
            var status = $('#loginForm').valid();
            
            if(status === false)
            return status;
            
            app.mobileApp.showLoading();
            var loginDataSource = new kendo.data.DataSource({
                transport:{
                    read:{
                        url:localStorage.getItem('userLoginAPI'),
                        type:'POST',
                        dataType:'json',
                        data:{apiaction:'userlogin',username:loginBindingValue.email,password:loginBindingValue.pwd}
                    }
                },
                schema: {
                    data: function(data)
                    {
                        return [data];
                    }
                },
                error: function (e) {
                    navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    function () { }, "Notification", 'OK');
                }
            });
            loginDataSource.fetch(function(){
            	var data = this.data();
                if(data[0]['code'] === "1" || data[0]['code'] === 1)
                {
                    app.loginService.viewModel.setUserLogindata(data[0]['data']);
                }
                else if(data[0]['code'] === "4" || data[0]['code'] === 4)
                {
                    navigator.notification.alert("Incorrect username or password.",function () { }, "Notification", 'OK');
                    app.mobileApp.hideLoading();
                }
                else
                {
                    navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    function () { }, "Notification", 'OK');
                    app.mobileApp.hideLoading();
                }
            });
        },
        
        setUserLogindata : function(data)
        {
            localStorage.setItem('userEmail',data['mail']);
            localStorage.setItem('userName',data['name']);
            localStorage.setItem("loginStatus","true");
            app.mobileApp.hideLoading();
            app.mobileApp.navigate("views/homepage.html");
        },
        
        userLogout : function()
        {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            localStorage.setItem("loginStatus","false");
            app.mobileApp.navigate("views/homepage.html");
        },
        
        moveToAccount : function()
        {
            app.mobileApp.navigate("#myaccount-view");
        }
    });
    app.loginService = {
        viewModel : new loginViewModel()
    };
})(window);