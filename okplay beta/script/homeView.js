(function(global){
    var homeViewModel,
        app = global.app = global.app || {};
    
    homeViewModel = kendo.data.ObservableObject.extend({
        
        loginStatus:(localStorage.getItem("loginStatus") !== false) ?  localStorage.getItem("loginStatus") : false,
        
        show:function(e)
        {
            app.mobileApp.showLoading();
            $('.popup').hide();
            $('.srchtxt').val('');
            
            $('.srchtxt').focus(function(){
                $('.popup').hide();
            });
            
            if(sessionStorage.getItem('SliderCategoryAPIStatus') === "null" || sessionStorage.getItem('SliderCategoryAPIStatus') === null)
            {
                app.homeService.viewModel.scrollViewImage();
                app.homeService.viewModel.categoryDataShow();
                sessionStorage.setItem('SliderCategoryAPIStatus',true);
            }
            else
            {
                setTimeout(function(){
                    app.mobileApp.hideLoading();
                },1000);
            }
            
            $('.menu').unbind();
            $('.menu').on('click',function(){
                $('.popup').slideToggle("slow","swing");
                $('.srchtxt').blur();
            });
        },
        
        categoryDataShow:function()
        {
            var category = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: localStorage.getItem("allCategoryListAPI"),
                            type:"GET",
                            dataType: "json",
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
                    },

                });
                category.fetch(function(){
                    var data = this.data();
                    app.homeService.viewModel.setCategoryListData(data[0]);
                });
        },
        
        setCategoryListData :function(data)
        {
            var html = "";
            for(var x in data)
            {
               if($.isNumeric(x))
                {
                    html +='<li class="select'+data[x]['id']+'" data-id="'+data[x]['id']+'" data-bind="click:categoryArticle">'+data[x]["name"]+'</li>';
                }
            }
            var hhtml ="";
            if( app.homeService.viewModel.loginStatus === true || app.homeService.viewModel.loginStatus === 'true')
            {
                 hhtml ='<a data-role="button" data-click="movetoaccountView"  class="removebtn logPos" data-align="right"><span>MY ACCOUNT &nbsp;&nbsp;&nbsp;</span></a>';
                 hhtml +='<a data-role="button" data-click="movetoLogout"  class="removebtn signPos" data-align="right">LOGOUT</a>';
            }
            else
            {
                hhtml = '<a data-role="button" data-click="movetoLogin" class="removebtn mainLogPos" data-align="right"><span>LOGIN &nbsp;&nbsp;&nbsp;</span></a>';
                hhtml += '<a data-role="button" data-click="movetoSignup" class="removebtn mainSignPos" data-align="right">REGISTER</a>';
            }
            
            
            $('#mainLayoutID').html(hhtml);
            kendo.bind('.mainLayoutID',app.homeService.viewModel);
             $('#categoryList').html(html);
            kendo.bind('.popup',app.homeService.viewModel);
            
            setTimeout(function(){
                app.mobileApp.hideLoading();
            },2000);
        },
        
        scrollViewImage : function()
        {
          var scrollData = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: localStorage.getItem('slideshowListAPI'),
                        type:"GET",
                        dataType: "json",
                        data: { apiaction:"slideshowList"} 
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
                },

            });
            scrollData.fetch(function(){
                var data = this.data();
                if(data[0]['code'] === 1 || data[0]['code'] === '1')
                {
                    app.homeService.viewModel.setScrollViewData(data[0]['data']);
                }
                else
                {
                    navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    function () { }, "Notification", 'OK');
                }
                
            });  
        },
        
        setScrollViewData:function(data)
        {
            var html = '<ul class="bxslider">';
            for(var x in data)
            {
               if($.isNumeric(x))
                {
                    html +='<li style="float: left; list-style: none; position: relative; width: 396px;"><img src="'+data[x]['path']+'"></li>';
                }
            }
            html += '</ul>';
            
            $('#bxs').html(html);
            $('.bxslider').bxSlider();
            
             
        },
        
        categoryArticle : function(e)
        {
            sessionStorage.setItem("categorySelectItem",e['target']['attributes']['data-id']['value']);
            app.mobileApp.navigate("views/categoryList.html?id="+e['target']['attributes']['data-id']['value']);
        },
        
        movetoLogin:function()
        {
            alert("movetoLogin");
        },
        
        movetoSignup :function()
        {
            alert("movetoSignup");
        }
    });
    app.homeService = {
        viewModel : new homeViewModel()
    };
})(window);