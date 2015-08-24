(function(global){
    var contactViewModel,
        app = global.app || global.app || {};
    var contactBindingValue;
    contactViewModel = kendo.data.ObservableObject.extend({
        
        title:'',
        bodyContent:'',
        
        showbefore : function()
        {
          contactBindingValue = kendo.observable({
                contect_name:'',
                contect_email:'',
                contect_number:'',
                contect_message:'',
            });
            kendo.bind($('#contactusForm'), contactBindingValue);  
        },
        show : function()
        {
            $('.popup').hide();
            
            $('.menu').unbind();
            $('[data-role="view"]').unbind();
            $('[data-role="view"]#contactus').on("click",function(e){
                if($(e.target).hasClass('menu'))
                {
                    $('.popup').slideToggle();
                }
                else
                {
                    $('.popup').hide();
                }
            });
            
            $.validator.addMethod("phoneNumber", function(phone_number, element) {
                phone_number = phone_number.replace(/\s+/g, "");
                return this.optional(element) || phone_number.length > 9 &&
                phone_number.match(/[0-9]{10}/);
            });
            
            jQuery.validator.addMethod("lettersonly", function(value, element) {
                return this.optional(element) || /^[a-z,\s]+$/i.test(value);
            }, "Please enter your name in characters"); 
            
            
            $('#contactusForm').validate({
                rules:{
                    contect_email:{
                        email:true,
                        required:true
                    },
                    contect_name:{
                        required:true,
                        lettersonly:true
                    },
                    contect_number:{
                        required:true,
                        phoneNumber:true
                    },
                    contect_message : {
                        required:true
                    }
                },
                messages:{
                    contect_email:{
                        contect_email: "Please enter valid email.",
                        required: "E-mail field is required."
                    },
                    contect_name:{
                        required:"Name field is required."
                    },
                    contect_number:{
                        required:"Mobile number field is required.",
                        phoneNumber:'Please enter 10 digit mobile number'
                    },
                    contect_message:{
                        required:"Message field is required."
                    },
                },
                submitHandler: function(form) {
                	return false;
                }
            });
        },
        
        aboutshow:function()
        {
            $(".km-native-scroller").scrollTop(0);
            $('.popup').hide();
            
            $('.menu').unbind();
            $('[data-role="view"]').unbind();
            $('[data-role="view"]#aboutus').on("click",function(e){
                if($(e.target).hasClass('menu'))
                {
                    $('.popup').slideToggle();
                }
                else
                {
                    $('.popup').hide();
                }
            });
            
            $('#aboutTitle').html(sessionStorage.getItem('Abouttitle'));
            $('#aboutBody').html(sessionStorage.getItem('Aboutbody'));
        },
        
        ourteamshow:function()
        {
            $(".km-native-scroller").scrollTop(0);
            $('.popup').hide();
            
            $('.menu').unbind();
            $('[data-role="view"]').unbind();
            $('[data-role="view"]#ourteam').on("click",function(e){
                if($(e.target).hasClass('menu'))
                {
                    $('.popup').slideToggle();
                }
                else
                {
                    $('.popup').hide();
                }
            });
            
            $('#ourteamTitle').html(sessionStorage.getItem('Ourteamtitle'));
            $('#ourteamBody').html(sessionStorage.getItem('Ourteambody'));
        },
        
        privacypolicyshow:function()
        {
            $(".km-native-scroller").scrollTop(0);
            $('.popup').hide();
            
            $('.menu').unbind();
            $('[data-role="view"]').unbind();
            $('[data-role="view"]#privacyPolicy').on("click",function(e){
                if($(e.target).hasClass('menu'))
                {
                    $('.popup').slideToggle();
                }
                else
                {
                    $('.popup').hide();
                }
            });
            
            $('#privacyTitle').html(sessionStorage.getItem('Privacytitle'));
            $('#privacyBody').html(sessionStorage.getItem('privacybody'));
        },
        
        termsshow:function()
        {
            $(".km-native-scroller").scrollTop(0);
            $('.popup').hide();
            
            $('.menu').unbind();
            $('[data-role="view"]').unbind();
            $('[data-role="view"]#termsConditionView').on("click",function(e){
                if($(e.target).hasClass('menu'))
                {
                    $('.popup').slideToggle();
                }
                else
                {
                    $('.popup').hide();
                }
            });
            
            $('#termsTitle').html(sessionStorage.getItem('Termstitle'));
            $('#termsBody').html(sessionStorage.getItem('Termsbody'));
        },
        
        faqshow : function()
        {
            console.log();
            var data = app.homeService.viewModel.faqsData;
            console.log(data);
            var faqListhtml = '';
            faqListhtml = '<div class="faqList">';
            faqListhtml += '<ul>';
            for(var i=0;i<data.length;i++)
            {
                if($.isNumeric(i))
                {
                   // console.log(data[x]);
                    faqListhtml +='<li><a data-id="'+data[i]['nid']+'" href="#'+data[i]['nid']+'">"'+data[i]['title']+'"</a></li>';
                }
                //
            }
            faqListhtml +='</ul>';
            faqListhtml += '</div>';
            //$('.faqList').html(faqListhtml);
            
            var faqdataHtml = "";
            
            
            for(i=0;i<data.length;i++)
            {
                if($.isNumeric(i))
                {
                    faqdataHtml += '<div class="faqQuest">';
                    faqListhtml +='<li><a id="'+data[i]['nid']+'" name="'+data[i]['nid']+'">"'+data[i]['title']+'"</a></li>';
                    faqdataHtml += '<span>';
                    faqdataHtml += '<a href="#">"'+data[i]['title']+'"</a>';
                    faqdataHtml += '</span>';
                    faqdataHtml += '</div>';
                    faqdataHtml += '<div class="faqAnswer">';
                    faqdataHtml += '<p>"'+data[i]['body']+'"</p>';
                    faqdataHtml += '</div>';
                }
                
            }
            $('.faqdata').html(faqdataHtml);
          
        },
        
        submitContact : function()
        {
            var status = $('#contactusForm').valid();

            if(status === false)
            return status;
            console.log(localStorage.getItem('uid'));
            if (!window.connectionInfo.checkConnection()) {
                navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        app.contact.viewModel.submitContact();
                    }

                }, 'Connection Error?', 'Retry,Cancel');
            }
            else
            {
                dataParam = {};
                dataParam['apiaction'] = 'savecontactus';
                dataParam['name'] = contactBindingValue.contect_name;
                dataParam['email'] = contactBindingValue.contect_email;
                dataParam['phone'] = contactBindingValue.contect_number;
                dataParam['message'] = contactBindingValue.contect_message;
                
                if(localStorage.getItem('userid') === "" || localStorage.getItem('userid') === null)
                {
                    dataParam['userid'] = 0;
                }
                else
                {
                    dataParam['userid'] = localStorage.getItem('userid');
                }
                console.log(dataParam);
                var contactDataSource = new kendo.data.DataSource({
                    transport:{
                        read:{
                            url:localStorage.getItem('contactusAPI'),
                            type:'POST',
                            dataType:'json',
                            data:dataParam
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
                contactDataSource.fetch(function(){
                	var data = this.data();
                    console.log(data);
                    
                    if(data[0]['code'] === "1" || data[0]['code'] === 1)
                    {
                        navigator.notification.alert("Thank you, your submission has been received.",
                        function () { }, "Notification", 'OK');
                        app.contact.viewModel.setblankContactForm();
                    }
                });
            }
        },
        
        setblankContactForm : function()
        {
            app.contact.viewModel.showbefore();
        }
    });
    app.contact = {
        viewModel : new contactViewModel()
    };
})(window);