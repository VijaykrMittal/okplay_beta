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
            //app.mobileApp.showLoading();
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
                    console.log(data);
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
                        navigator.notification.alert("Server not responding properly.Please check your internet connection.",
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
        
        userLogout : function(data)
        {
            alert(data);
            if(data === 'logout')
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
            }
            else
            {
                app.mobileApp.showLoading();
                app.loginService.viewModel.facebookLogout();
            }
        },
        
        moveToAccount : function()
        {
            app.mobileApp.navigate("#myaccount-view");
        },
        
        emailExistAPI : function(myEmail)
        {
            var emailExistDataSource = new kendo.data.DataSource({
                    transport:{
                        read:{
                            url:localStorage.getItem('emailExistAPI'),
                            type:'GET',
                            dataType:'json',
                            data:{apiaction:'sociallogin',email:myEmail}
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
                emailExistDataSource.fetch(function(){
                	var data = this.data();
                    if(data[0]['code'] === "1" || data[0]['code'] === 1)
                    {
                        alert("CODE 1");
                        alert(JSON.stringify(data[0]['data']));
                        app.loginService.viewModel.setUserLogindata(data[0]['data']);
                    }
                    else if(data[0]['code'] === "5" || data[0]['code'] === 5)
                    {
                        dataParam = {};
                        dataParam['firstname'] = localStorage.getItem("fbUserFirstName");
                        dataParam['lastname'] = localStorage.getItem("fbUserLastName");
                        dataParam['email'] = localStorage.getItem("fbUserEmail");
                        dataParam['password'] = localStorage.getItem("fbUserPassword");
                        dataParam['gender'] = localStorage.getItem("fbUserGender");
                        dataParam['apiaction'] = 'usersignup';
                        alert("CODE 5");
                        alert(JSON.stringify(dataParam));
                        app.signupService.viewModel.signupAPI(dataParam);
                    }
                    else
                    {
                        navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                        function () { }, "Notification", 'OK');
                        app.mobileApp.hideLoading();
                    }
                });
        },
        
        fbLogin:function()
        {
            
            app.mobileApp.showLoading();
            FB.getLoginStatus(function(response){
                alert(response.status);
                if(response.status !== "connected")
                {
                    app.loginService.viewModel.loginfbAPI();
                }
            });
        },
        
        loginfbAPI:function()
        {
            FB.login(function(response){
                if(response.authResponse.accessToken && response.authResponse.userId)
                {
                    app.loginService.viewModel.fbDataFetch();
                }
                else
                {
                    alert("not logged in");
                }
            },{scope:'email'});
        },
        
        fbDataFetch:function()
        {
            FB.api('/me', {fields:'last_name,first_name,email,picture,gender'},function(response) {
                
                var str = response.email;
                var result = str.search("@");
                var fbpwd= str.slice(0, result );
                var alpha = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
                var i;
                for (i=0;i<6;i++)
                {
                    var a = alpha[Math.floor(Math.random() * alpha.length)];
                    var b = alpha[Math.floor(Math.random() * alpha.length)];
                    var c = alpha[Math.floor(Math.random() * alpha.length)];
                    var d = alpha[Math.floor(Math.random() * alpha.length)];
                }
                var captcha = a+''+b+''+c+''+d;
                var mainPwd = fbpwd+''+captcha;
                
                localStorage.setItem("fbLoginStatus",true);
                localStorage.setItem("fbUserFirstName",response.first_name);
                localStorage.setItem("fbUserLastName",response.last_name);
                localStorage.setItem('fbUserEmail',response.email);
                localStorage.setItem('fbUserGender',response.gender);
                localStorage.setItem('fbUserPassword',mainPwd);
                app.loginService.viewModel.emailExistAPI(response.email);
            });
        },
        
        facebookLogout:function()
        {
            FB.logout(function(response){
                localStorage.setItem("fbLoginStatus",false);
                localStorage.removeItem('fbUserFirstName');
                localStorage.removeItem('fbUserLastName');
                localStorage.removeItem('fbUserEmail');
                localStorage.removeItem('fbUserGender');
                localStorage.removeItem('fbUserPassword');
                
                localStorage.setItem("loginStatus",false);
                app.homeService.viewModel.loginStatus = false;
                app.homeService.viewModel.getUserLoginStatus();
                app.mobileApp.navigate("views/homepage.html");
                app.homeService.viewModel.show();
            });
        },
        
        googleLogin:function()
        {
            window.plugins.googleplus.isAvailable(
                function (available) {
                    if (available) {
                        alert(available);
                      app.loginService.viewModel.googleLoginAPI();
                    }
                }
            );
        },
        
        googleLoginAPI : function()
        {
            window.plugins.googleplus.login(
            {
                // 'scopes': '...', // optional space-separated list of scopes, the default is sufficient for login and basic profile info
                // 'offline': true, // optional and required for Android only - if set to true the plugin will also return the OAuth access token, that can be used to sign in to some third party services that don't accept a Cross-client identity token (ex. Firebase)
                // 'androidApiKey': '986576268792-u5lhdmne49pq1hh10kmp7m6gkhm4rgau.apps.googleusercontent.com', // optional API key of your Web application from Credentials settings of your project - if you set it the returned idToken will allow sign in to services like Azure Mobile Services
                // there is no API key for Android; you app is wired to the Google+ API by listing your package name in the google dev console and signing your apk (which you have done in chapter 4)
                },
                function (obj) {
                    alert(JSON.stringify(obj)); // do something useful instead of alerting
                },
                function (msg) {
                    alert('error: ' + msg);
                }
            );
        },
        
        googleLogout:function()
        {
            window.plugins.googleplus.logout(
                function (msg) {
                    alert(msg); // do something useful instead of alerting
                }
            );
        }
    });
    app.loginService = {
        viewModel : new loginViewModel()
    };
})(window);