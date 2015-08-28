(function(global){
    var signupViewModel,
        app = global.app = global.app || {};
    var signupBindingValue;
    signupViewModel = kendo.data.ObservableObject.extend({
        
        show : function(e)
        {
            $('.popup').hide();
            e.view.scroller.scrollTo(0, 0);
            
            $('.menu').unbind();
            $('[data-role="view"]').unbind();
            $('[data-role="view"]#signupView').on("click",function(e){
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
            
            $('#gendermale').prop('checked', false);
            $('#genderfemale').prop('checked', false);
            $('#confirmPassword').val('');
            signupBindingValue = kendo.observable({
                signupfname: '',
                signuplname:'',
                signupEmail:'',
                signupPassword:'',
                signupmobilenumber:'',
                gendermale:false,
                genderfemale:false
            });
            
            kendo.bind($('#signupForm'), signupBindingValue);
            
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
            
            dataParam['firstname'] = signupBindingValue.signupfname; 
            dataParam['lastname'] = signupBindingValue.signuplname; 
            dataParam['email'] = signupBindingValue.signupEmail; 
            dataParam['password'] = signupBindingValue.signupPassword; 
            dataParam['mobilenumber'] = signupBindingValue.signupmobilenumber; 
            dataParam['gender'] = $(".radioChk[type='radio']:checked").val();
            
            console.log(dataParam);
            app.loginService.viewModel.setUserLogindata(dataParam);
            /*var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                        url: localStorage.getItem("userSignupAPI"),
                        type:"POST",
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        data: { apiaction:"usersignup",email:dataParam['email'],password:dataParam['password'],fname:dataParam['firstname'],lname:dataParam['lastname'],mobile:dataParam['mobilenumber'],gender:dataParam['gender']}
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
            },

            });
            dataSource.fetch(function(){
                
            	var data = this.data();
                app.mobileApp.showLoading();
                if(data[0]['code'] === "1" || data[0]['code'] === 1)
                {
                    console.log(data[0]);
                    //app.mobileApp.navigate("views/homepage.html");
                    app.loginService.viewModel.setUserLogindata(data[0]['data']);
                }
                else if(data[0]['code'] === "2" || data[0]['code'] === 2)
                {
                    navigator.notification.alert("Some field is missing.",
                    function () { }, "Notification", 'OK');
                }
                else
                {
                    navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    function () { }, "Notification", 'OK');
                    app.mobileApp.hideLoading();
                }
            });*/
        },
        
    });
    app.signupService = {
        viewModel : new signupViewModel()
    };
})(window);