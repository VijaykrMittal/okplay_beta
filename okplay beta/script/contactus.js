(function(global){
    var contactViewModel,
        app = global.app || global.app || {};
    
    contactViewModel = kendo.data.ObservableObject.extend({
        
        title:'',
        bodyContent:'',
        
        show : function()
        {
            $.validator.addMethod("phoneNumber", function(phone_number, element) {
                phone_number = phone_number.replace(/\s+/g, "");
                return this.optional(element) || phone_number.length > 9 &&
                phone_number.match(/[0-9]{10}/);
            });
            
            $('#contactusForm').validate({
                rules:{
                    contect_email:{
                        email:true,
                        required:true
                    },
                    contect_name:{
                        required:true
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
        
        submitContact : function()
        {
            var status = $('#contactusForm').valid();

            if(status === false)
            return status;
        }
    });
    app.contact = {
        viewModel : new contactViewModel()
    };
})(window);