(function(global){
    var homeViewModel,
        app = global.app = global.app || {};
    
    homeViewModel = kendo.data.ObservableObject.extend({
        
        loginStatus:(localStorage.getItem("loginStatus") !== false) ?  localStorage.getItem("loginStatus") : false,
        networkStatus : true,
        homePageData:[],
        faqsData : '',
        faqsDataArray:[],
        scrollImage:[],
        show:function(e)
        {
            app.mobileApp.showLoading();
            
            $('.homeFooter').css("display",'none');
            $('#blockrightContent').css('background','none');
            $('.listCategory').removeClass("highlightColor");
            
            app.homeService.viewModel.getUserLoginStatus();
            
            if(sessionStorage.getItem('SliderCategoryAPIStatus') === "null" || sessionStorage.getItem('SliderCategoryAPIStatus') === null)
            {
                app.homeService.viewModel.categoryDataShow();
                app.homeService.viewModel.homePageBlock();
                app.homeService.viewModel.scrollViewImage();
                app.homeService.viewModel.footerApiCall();
                sessionStorage.setItem('SliderCategoryAPIStatus',true);
            }
            else
            {
                app.homeService.viewModel.setScrollViewDatabyArray(app.homeService.viewModel.scrollImage);
                $('#blockrightContent').css('background','#E7E7E7');
                $('.homeFooter').css("display",'block');
            }
            
            $('.popup').hide();
            $('.searchTxtbox').val('');
            
            $('.menu').unbind();
            $('[data-role="view"]').unbind();
            $('[data-role="view"]#homepageView').on("click",function(e){
                if($(e.target).hasClass('menu'))
                {
                    $('.popup').slideToggle();
                }
                else
                {
                    $('.popup').hide();
                }
            });
            $(".km-native-scroller").scrollTop(0);
            
            //e.view.scroller.scrollTo(0, 0);
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
            
            $('.mainLayoutID').html(hhtml);
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
                    app.homeService.viewModel.setHomePageData(data[0]);
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
                    html +='<li class="listCategory select'+data[x]['id']+'" data-id="'+data[x]['id']+'" data-bind="click:categoryArticle">'+data[x]["name"]+'</li>';
                }
            }
            $('#categoryList').html(html);
            kendo.bind('.popup',app.homeService.viewModel);
        },
        
        setHomePageData : function(data)
        {
            var that = this;
            dataParam = [];
            dataParamInner = [];
            var i =0;
            for(var x in data)
            {
                if(data[x]['img'] !== ""){

                    dataParamInner = [];
                    dataParamInner['id'] = data[x]['id'];
                    dataParamInner['name'] = data[x]['name'];
                    dataParamInner['img'] = data[x]['img'];
                    dataParam[i]=dataParamInner; 
                    i++;
                }
            }
            that.set("homePageData",dataParam);
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
                    
                    for(var x in data[0]['data'])
                    {
                        if($.isNumeric(x))
                        {
                            app.homeService.viewModel.scrollImage.push({path:data[0]['data'][x]['path']});
                        }
                    }
                    
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
                    html +='<li><img src="'+data[x]['path']+'" class="bannerheight"></li>';
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
        
        setScrollViewDatabyArray:function(data)
        {
            var html = '<ul class="bxslider">';
            for(var x in data)
            {
               if($.isNumeric(x))
                {
                    html +='<li><img src="'+data[x]['path']+'" class="bannerheight"></li>';
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
            sessionStorage.setItem("ageSelectItem",'');
            $('.listCategory').removeClass("highlightColor");
            $('.select'+e['target']['attributes']['data-id']['value']).addClass("highlightColor");
            
            if(app.mobileApp.view()['element']['0']['id']==='categoryArticleView')
            {
                app.categoryService.viewModel.redirectBack();
                app.categoryService.viewModel.show();
            }
            else
            {
                app.mobileApp.navigate("#categoryArticleView");
            }
            
        },
        
        browseArticle :function(e)
        {
            sessionStorage.setItem("categorySelectItem",e['target']['context']['attributes']['data-id']['value']);
            sessionStorage.setItem("ageSelectItem",'');
            
            if(app.mobileApp.view()['element']['0']['id']==='categoryArticleView')
            {
                app.categoryService.viewModel.redirectBack();
                app.categoryService.viewModel.show();
            }
            else
            {
                app.mobileApp.navigate("#categoryArticleView");
            }
           //app.mobileApp.navigate("views/categoryList.html");
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
            $('#blockrightContent').css('background','#E7E7E7');
            $('.homeFooter').css("display",'block');
            var html = "";
            
            html +=data[0];
            html +=data[1];
            html +=data[2];
            $('#blockContent').html(html);
        },
        
        footerApiCall : function()
        {
            var footerAPI = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: localStorage.getItem('footerContentAPI'),
                        type:"GET",
                        dataType: "json",
                        data: { apiaction:"basicpagedata"} 
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
            footerAPI.fetch(function(){
                var data = this.data();
                if(data[0]['code'] === 1 || data[0]['code'] === '1')
                {
                    app.homeService.viewModel.setFooterdata(data[0]['data']);
                }
                else
                {
                    navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    function () { }, "Notification", 'OK');
                }
            });  
        },
        
        setFooterdata : function(data)
        {
           // dataFaqParam = [];
            for(var x in data)
            {
                if(data[x]['title'] === ' About Us')
                {
                    sessionStorage.setItem('Abouttitle',data[x]['title']);
                    sessionStorage.setItem('Aboutnid',data[x]['nid']);
                    sessionStorage.setItem('Aboutbody',data[x]['body']);
                }
                
                if(data[x]['title'] === 'Privacy Policy')
                {
                    sessionStorage.setItem('Privacytitle',data[x]['title']);
                    sessionStorage.setItem('privacynid',data[x]['nid']);
                    sessionStorage.setItem('privacybody',data[x]['body']);
                }
                
                if(data[x]['title'] === 'Our Team')
                {
                    sessionStorage.setItem('Ourteamtitle',data[x]['title']);
                    sessionStorage.setItem('Ourteamnid',data[x]['nid']);
                    sessionStorage.setItem('Ourteambody',data[x]['body']);
                }
                
                if(data[x]['title'] === 'Terms and Conditions')
                {
                    sessionStorage.setItem('Termstitle',data[x]['title']);
                    sessionStorage.setItem('Termsnid',data[x]['nid']);
                    sessionStorage.setItem('Termsbody',data[x]['body']);
                }
                
                if(data[x]['type'] === 'faq')
                {
                    app.homeService.viewModel.faqsDataArray.push({nid:data[x]['nid'],body:data[x]['body'],title:data[x]['title']});
                }
                
            }
            this.set('faqsData',app.homeService.viewModel.faqsDataArray);
        },
        
        movetoLogin:function()
        {
            alert("movetoLogin");
        },
        
        movetoSignup :function()
        {
            alert("movetoSignup");
        },
        
        moveToContactus : function()
        {
            app.mobileApp.navigate("#contactus");
        },
        
        moveToAboutus : function()
        {
            app.mobileApp.navigate("#aboutus");
        },
        
        moveToOurteam : function()
        {
            app.mobileApp.navigate("#ourteam");
        },
        
        moveToPrivacyPolicy : function()
        {
            app.mobileApp.navigate("#privacyPolicy");
        },
        
        moveToTermsCondition : function()
        {
            app.mobileApp.navigate("#termsConditionView");
        },
        
        moveToFaqs :function()
        {
            app.mobileApp.navigate("#faqsView");
        }
    });
    app.homeService = {
        viewModel : new homeViewModel()
    };
})(window);