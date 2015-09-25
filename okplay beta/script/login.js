(function(global){
    var loginViewModel,
        app = global.app = global.app || {};
    
    loginViewModel = kendo.data.ObservableObject.extend({
        email:'',
        loginemail:'',
        loginpwd:'',
        forgotEmail:'',
        
        show : function()
        {
            app.loginService.viewModel.setblankLoginfld();
            $('.popup').hide();
            $('.searchTxtbox').val('');
            $('label.error').hide();
            
            $('.menu').unbind();
            $('[data-role="view"]').unbind();
            $('[data-role="view"]#loginView').on("click",function(e){
                if($(e.target).hasClass('menu'))
                {
                    $('.popup').slideToggle();
                }
                else
                {
                   // $(e.target).preventDefault();
                    $('.popup').hide();
                }
            });
            
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
        
        forgotPasswordShow:function()
        {
            app.loginService.viewModel.resetfld();
            $('.popup').hide();
            $('.searchTxtbox').val('');
            $('label.error').hide();
            
            $('.menu').unbind();
            $('[data-role="view"]').unbind();
            $('[data-role="view"]#forgotpwd').on("click",function(e){
                if($(e.target).hasClass('menu'))
                {
                    $('.popup').slideToggle();
                }
                else
                {
                   // $(e.target).preventDefault();
                    $('.popup').hide();
                }
            });
            
            $('#forgotpwdForm').validate({
                rules:{
                    email:{
                        email:true,
                        required:true
                    }
                },
                messages:{
                    email:{
                        email: "Please enter valid email.",
                        required: "E-mail field is required."
                    }
                },
                submitHandler: function(form) {
                	return false;
                }
            });
        },
        
        resetfld:function()
        {
          this.set('forgotEmail','');  
        },
        
        myAcccountshow:function()
        {
            $('.menu').unbind();
            $('[data-role="view"]').unbind();
            $('[data-role="view"]#myaccountView').on("click",function(e){
                if($(e.target).hasClass('menu'))
                {
                    $('.popup').slideToggle();
                }
                else
                {
                   // $(e.target).preventDefault();
                    $('.popup').hide();
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
            
            if (!window.connectionInfo.checkConnection()) {
                navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        app.loginService.viewModel.loginSubmit();
                    }

                }, 'Connection Error?', 'Retry,Cancel');
            }
            else
            {
                var username = this.get('loginemail'),
                    password = this.get('loginpwd');
                
                app.mobileApp.showLoading();
                var loginDataSource = new kendo.data.DataSource({
                    transport:{
                        read:{
                            url:localStorage.getItem('userLoginAPI'),
                            type:'GET',
                            dataType:'json',
                            data:{apiaction:'userlogin',username:username,password:password}
                        }
                    },
                    schema: {
                        data: function(data)
                        {
                            return [data];
                        }
                    },
                    error: function (e) {
                        app.mobileApp.hideLoading();
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
            }
        },
        
        checkEnterLogin:function(e)
        {
            if (e.keyCode === 13) {
                $(e.target).blur();
                app.loginService.viewModel.loginSubmit();
            }
        },
        
        forgotPasswordSubmit:function()
        {
            var status = $('#forgotpwdForm').valid();

            if(status === false)
            return status;
            
            if (!window.connectionInfo.checkConnection()) {
                navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        app.loginService.viewModel.loginSubmit();
                    }

                }, 'Connection Error?', 'Retry,Cancel');
            }
            else
            {
                var emailAdd = this.get('forgotEmail');
                
                app.mobileApp.showLoading();
                var forgotDataSource = new kendo.data.DataSource({
                    transport:{
                        read:{
                            url:localStorage.getItem('forgotpasswordAPI'),
                            type:'POST',
                            dataType:'json',
                            data:{apiaction:'userforgotpass',email:emailAdd}
                        }
                    },
                    schema: {
                        data: function(data)
                        {
                            return [data];
                        }
                    },
                    error: function (e) {
                        app.mobileApp.hideLoading();
                        navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                        function () { }, "Notification", 'OK');
                    }
                });
                forgotDataSource.fetch(function(){
                	var data = this.data();
                    console.log(data);
                    if(data[0]['code'] === "1" || data[0]['code'] === 1)
                    {
                        navigator.notification.alert("Further instruction have been sent to your e-mail address.",function () { }, "Notification", 'OK');
                        app.mobileApp.hideLoading();
                        app.mobileApp.navigate("views/login.html");
                    }
                    else if(data[0]['code'] === "5" || data[0]['code'] === 5)
                    {
                        navigator.notification.alert("Email Id does not exist.",function () { }, "Notification", 'OK');
                        app.mobileApp.hideLoading();
                    }
                    else
                    {
                        navigator.notification.alert("ok",
                        function () { }, "Notification", 'OK');
                        app.mobileApp.hideLoading();
                    }
                });
            }
        },
        
        checkEnterforgot:function(e)
        {
            if (e.keyCode === 13) {
                $(e.target).blur();
                app.loginService.viewModel.forgotPasswordSubmit();
            }
        },
        
        setUserLogindata : function(data)
        {
            localStorage.setItem('userEmail',data['mail']);
            localStorage.setItem('userName',data['name']);
            localStorage.setItem('userid',data['userid']);
            localStorage.setItem('status',data['status']);
            localStorage.setItem("loginStatus",true);
            app.homeService.viewModel.loginStatus=true;
            app.mobileApp.hideLoading();
            app.homeService.viewModel.getUserLoginStatus();
            app.mobileApp.navigate("views/homepage.html");
        },
        
        setblankLoginfld:function()
        {
            this.set('loginemail','');
            this.set('loginpwd','');  
        },
        
        userLogout : function()
        {
            this.set('loginemail','');
            this.set('loginpwd','');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            localStorage.removeItem('userid');
            localStorage.setItem("loginStatus",false);
            app.homeService.viewModel.loginStatus = false;
            app.signupService.viewModel.resetSignupFld();
            app.homeService.viewModel.getUserLoginStatus();
            app.mobileApp.navigate("views/homepage.html");
            app.homeService.viewModel.show();
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