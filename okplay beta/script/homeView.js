(function(global){
    var homeViewModel,
        app = global.app = global.app || {};
    
    homeViewModel = kendo.data.ObservableObject.extend({
        
        loginStatus:(localStorage.getItem("loginStatus") !== false) ?  localStorage.getItem("loginStatus") : false,
        networkStatus : true,
        homePageData:'',
        
        show:function(e)
        {
            app.mobileApp.showLoading();
           // e.view.scroller.scrollTo(0, 0);
            $('.popup').hide();
            $('.srchtxt').val('');
            
            /*$('.menu').unbind();
            $('body').on("click",function(e){
                if($(e.target).hasClass('menu'))
                {
                    $('.popup').slideToggle();
                }
                else
                {
                    $(e.target).preventDefault();
                    $('.popup').hide();
                }
            });*/
            
            $('.menu').unbind();
            $('.menu').on('click',function(e){
                $('.popup').slideToggle("slow","swing");
                $('.srchtxt').blur();
            });
           
            app.homeService.viewModel.getUserLoginStatus();
            app.homeService.viewModel.scrollViewImage();
           // app.homeService.viewModel.categoryDataShow();
            
            
            if(sessionStorage.getItem('SliderCategoryAPIStatus') === "null" || sessionStorage.getItem('SliderCategoryAPIStatus') === null)
            {
                app.homeService.viewModel.categoryDataShow();
                app.homeService.viewModel.homePageBlock();
                sessionStorage.setItem('SliderCategoryAPIStatus',true);
            }
            else
            {
                setTimeout(function(){
                    app.mobileApp.hideLoading();
                },500);
            }
        },
        
        getUserLoginStatus :function()
        {
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
        },
        
        categoryDataShow:function()
        {
            try
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
                        app.mobileApp.hideLoading();
                        navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                        function () { }, "Notification", 'Ok');
                    },
                });
                category.fetch(function(){
                    var data = this.data();
                    app.homeService.viewModel.setCategoryListData(data[0]);
                    app.homeService.viewModel.setHomeContentdata(data[0]);
                });
            }
            catch(e)
            {
                console.log(e);
            }
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
            $('#categoryList').html(html);
            kendo.bind('.popup',app.homeService.viewModel);
        },
        
        setHomeContentdata : function(data)
        {
            this.set("homePageData",data);
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
                    app.mobileApp.hideLoading();
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
                    html +='<li><img src="'+data[x]['path']+'"></li>';
                }
            }
            html += '</ul>';
            
            $('#bxs').html(html);
            $('.bxslider').bxSlider({
                mode:'fade'
            });
            
            setTimeout(function(){
                app.mobileApp.hideLoading();
            },2000);
        },
        
        categoryArticle : function(e)
        {
            sessionStorage.setItem("categorySelectItem",e['target']['attributes']['data-id']['value']);
            app.mobileApp.navigate("views/categoryList.html?id="+e['target']['attributes']['data-id']['value']);
        },
        
        browseArticle :function(e)
        {
            sessionStorage.setItem("categorySelectItem",e['target']['context']['attributes']['data-id']['value']);
            app.mobileApp.navigate("views/categoryList.html?id="+e['target']['context']['attributes']['data-id']['value']);
        },
        
        homePageBlock : function()
        {
            var homePageBLK = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: localStorage.getItem('homePageBlockAPI'),
                        type:"GET",
                        dataType: "json",
                        data: { apiaction:"blocksdata"} 
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
            homePageBLK.fetch(function(){
                var data = this.data();
                if(data[0]['code'] === 1 || data[0]['code'] === '1')
                {
                    app.homeService.viewModel.setHomeLayout(data[0]['data']);
                }
                else
                {
                    navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    function () { }, "Notification", 'OK');
                }
                
            });  
        },
        
        setHomeLayout : function(data)
        {
            var html = "";
            
            html +=data[0];
            html +=data[1];
            html +=data[2];
            $('#blockContent').html(html);
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