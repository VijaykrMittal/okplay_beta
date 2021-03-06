(function(global){
    var signupViewModel,
        app = global.app = global.app || {};
    
        signupViewModel = kendo.data.ObservableObject.extend({
            
        signupfname:'',
        signuplname:'',
        signupEmail:'',
        signupPassword:'',
        confirmPassword:'',
        signupmobilenumber:'',
        gendermale:false,
        genderfemale:false,
        
        show : function(e)
        {
            app.signupService.viewModel.resetSignupFld();
            $('#gendermale').prop('checked', false);
            $('#genderfemale').prop('checked', false);
            $('.popup').hide();
            $('.searchTxtbox').val('');
            e.view.scroller.scrollTo(0, 0);
            $('label.error').hide();
            
            $('.menu').unbind();
            $('[data-role="view"]').unbind();
            $('[data-role="view"]#signupView').on("click",function(e){
                if($(e.target).hasClass('menu'))
                {
                    $('.popup').slideToggle();
                    $('.searchTxtbox').blur();
                }
                else
                {
                   // $(e.target).preventDefault();
                    $('.popup').hide();
                }
            });
            
            $('#signupmobilenumber').keypress(function(e){
                var valid = (e.which>=48 && e.which<=57)
                if(!valid)
                {
                    e.preventDefault();
                }
            });
            
            $('#signupForm').validate({
                rules:{
                    signupEmail:{
                        email:true,
                        required:true
                    },
                    signupPassword:{
                        required:true,
                        minlength: 6
                    },
                    confirmPassword:{
                        required:true,
                        equalTo: "#signupPassword"
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
                    confirmPassword:{
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
            dataParam = {};
            var status = $('#signupForm').valid();
            
            if(status === false)
            return status;
            
            if (!window.connectionInfo.checkConnection()) {
                navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        app.signupService.viewModel.signupSubmit();
                    }

                }, 'Connection Error?', 'Retry,Cancel');
            }
            else
            {
                dataParam['firstname'] = this.get('signupfname'); 
                dataParam['lastname'] = this.get('signuplname'); 
                dataParam['email'] = this.get('signupEmail'); 
                dataParam['mobilenumber'] = this.get('signupmobilenumber'); 
                dataParam['password'] = this.get('signupPassword');
                dataParam['gender'] = $(".radioChk[type='radio']:checked").val();
                dataParam['apiaction'] = 'usersignup';
                app.signupService.viewModel.signupAPI(dataParam);
            }
        },
            
        signupAPI : function(dataParam)
        {
            app.mobileApp.showLoading();
            var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                            url: localStorage.getItem("userSignupAPI"),
                            type:"POST",
                            dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            data: dataParam
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
                        function () { }, "Message", 'OK');
                },

                });
                dataSource.fetch(function(){
                    
                	var data = this.data();
                    
                    console.log(data);
                    if(data[0]['code'] === "1" || data[0]['code'] === 1)
                    {
                        app.loginService.viewModel.setUserLogindata(data[0]['data']);
                    }
                    else if(data[0]['code'] === "2" || data[0]['code'] === 2)
                    {
                        navigator.notification.alert("Some field is missing.",
                        function () { }, "Notification", 'OK');
                        app.mobileApp.hideLoading();
                    }
                    else if(data[0]['code'] === "5" || data[0]['code'] === 5)
                    {
                        navigator.notification.alert("Email ID already exist.",
                        function () { }, "Notification", 'OK');
                        app.mobileApp.hideLoading();
                    }
                    else
                    {
                        navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                        function () { }, "Message", 'OK');
                        
                    }
                });
        },
            
        checkEnterSubmit:function(e)
        {
            if (e.keyCode === 13) {
                $(e.target).blur();
                app.signupService.viewModel.signupSubmit();
            }
        },
        
        resetSignupFld:function()
        {
            this.set('signupfname','');
            this.set('signuplname','');
            this.set('signupEmail','');
            this.set('signupPassword','');
            this.set('confirmPassword','');
            this.set('signupmobilenumber','');
            $('#gendermale').prop('checked', false);
            $('#genderfemale').prop('checked', false);
        },
        
    });
    app.signupService = {
        viewModel : new signupViewModel()
    };
})(window);