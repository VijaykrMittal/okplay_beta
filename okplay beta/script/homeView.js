(function(global){
    var homeViewModel,
        app = global.app = global.app || {};
    
    homeViewModel = kendo.data.ObservableObject.extend({
        show:function()
        {
            app.mobileApp.showLoading();
            $('.nvbar .afterLogin').show();
            $('.nvbar .beforeLogin').hide();
            $('.popup').hide();
            $('.srchtxt').val('');
            if(sessionStorage.getItem('SliderCategoryAPIStatus') === "null" || sessionStorage.getItem('SliderCategoryAPIStatus') === null)
            {
                app.homeService.viewModel.scrollViewImage();
                app.homeService.viewModel.categoryDataShow();
            }
            else
            {
                setTimeout(function(){
                    app.mobileApp.hideLoading();
                },2000);
            }
            
            $('.menu').unbind();
            $('.menu').on('click',function(){
                $('.popup').slideToggle("slow","swing");
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
                    html +='<li data-id="'+data[x]['id']+'" data-bind="click:categoryArticle">'+data[x]["name"]+'</li>';
                }
            }
            
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
                console.log(data[0]['code']);
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
            app.mobileApp.showLoading();
            $('select').val('0');
            $('.popup').hide();
            sessionStorage.setItem("SliderCategoryAPIStatus",true);
            sessionStorage.setItem("categorySelectItem",e['target']['attributes']['data-id']['value']);
            
            var categoryDataSource  = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url:localStorage.getItem('articleListAPI'),
                            type:"GET",
                            dataType: "json",
                            data: { apiaction:"articlelist",catId:e['target']['attributes']['data-id']['value']} 
                        }
                        
                    },
                    filter: { field: "value", operator: "eq", value: e['target']['attributes']['data-id']['value'] },
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
                categoryDataSource .fetch(function(){
                    var that = this;
                    var data = that.data();
                    
                    if(data[0]['code'] === 1 || data[0]['code'] === '1')
                    {
                        app.categoryService.viewModel.setArticleListData(data[0]['data']);
                        app.mobileApp.navigate("views/categoryList.html");
                    }
                    else
                    {
                        navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    	function () { }, "Notification", 'OK');
                    }
                });
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