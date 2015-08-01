(function(global){
    var categoryViewModel,
        app = global.app = global.app || {};
    
    categoryViewModel = kendo.data.ObservableObject.extend({
        articlelistData:'',
        dataListStatus:'',
        articleDetail:'',
        searchlistData:'',
        searchStatus:'',
        
        show:function(e)
        {
            app.mobileApp.showLoading();
            $('select').val('0');
            $('.popup').hide();
            $('.srchtxt').val('');
            
            $('.menu').unbind();
            $('.menu').on('click',function(e){
                $('.popup').slideToggle("slow","swing");
                $('.srchtxt').blur();
            });
            
            $('#ageDropFld').click(function(){
               $('.popup').hide();
            });
            e.view.scroller.scrollTo(0, 0);
            
            app.categoryService.viewModel.categoryArticleData(e['sender']['params']['id']);
            app.categoryService.viewModel.fetchAgeListdata();
             
        },
        
        categoryArticleData : function(data)
        {
            var categoryDataSource  = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url:localStorage.getItem('articleListAPI'),
                            type:"GET",
                            dataType: "json",
                            data: { apiaction:"articlelist",catId:data} 
                        }
                        
                    },
                    filter: { field: "value", operator: "eq", value: data },
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
                    console.log(data);
                    if(data[0]['code'] === 1 || data[0]['code'] === '1')
                    {
                        app.categoryService.viewModel.setArticleListData(data[0]['data']);
                    }
                    else
                    {
                        navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    	function () { }, "Notification", 'OK');
                    }
                });
        },
        setArticleListData:function(data)
        { 
            if(data.length ===0 || data.length === "0")
            {
                this.set("dataListStatus","There is no article.");
                this.set("articlelistData","");
                app.mobileApp.hideLoading();
            }
            else
            {
                this.set("dataListStatus","");
                this.set("articlelistData",data);
                app.mobileApp.hideLoading();
            }
            
        },
        
        fetchAgeListdata : function()
        {
            var ageData = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: localStorage.getItem('allAgesListAPI'),
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
            ageData.fetch(function(){
                var data = this.data();
                app.categoryService.viewModel.showAgeDropDown(data[0]);
            });
        },
        
        showAgeDropDown:function(data)
        {
            var html = "";
            html = "<option value='0' data-id='0'>All Age Group</option>";
            for(var x in data)
            {
                if($.isNumeric(x))
                {
                    html +="<option value='"+data[x]['id']+"' data-id='"+data[x]['id']+"'>"+data[x]['name']+"</option>"
                }
            }
            
            $('#ageDropFld').html(html);
            setTimeout(function(){
                app.mobileApp.hideLoading();
            },2000);
        },
        
        drpdownFilter:function(data)
        {
            app.mobileApp.showLoading();
            if(data === 0 || data === '0')
            {
                var categoryAllFilter  = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url:localStorage.getItem('articleListAPI'),
                            type:"GET",
                            dataType: "json",
                            data: { apiaction:"articlelist",catId:sessionStorage.getItem("categorySelectItem")} 
                        }
                        
                    },
                    filter: { field: "value", operator: "eq", value: data },
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
                categoryAllFilter.fetch(function(){
                    var that = this;
                    var data = that.data();
                    if(data[0]['code'] === 1 || data[0]['code'] === "1")
                    {
                        app.categoryService.viewModel.setArticleListData(data[0]['data']);
                    }
                    else
                    {
                       navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                        	function () { }, "Notification", 'OK'); 
                    }
                });
            }
            else
            {
                var categoryAgeFilter  = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url:localStorage.getItem('articleListAPI'),
                            type:"GET",
                            dataType: "json",
                            data: { apiaction:"articlelist",catId:sessionStorage.getItem("categorySelectItem"),ageId:data} 
                        }
                        
                    },
                    filter: { field: "value", operator: "eq", value: data },
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
                categoryAgeFilter.fetch(function(){
                    var that = this;
                    var data = that.data();
                    if(data[0]['code'] === 1 || data[0]['code'] === "1")
                    {
                        app.categoryService.viewModel.setArticleListData(data[0]['data']);
                    }
                    else
                    {
                       navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                        	function () { }, "Notification", 'OK'); 
                    }
                    
                });
            }
        },
        
        articleContentDataCall : function(e)
        {
            $('.popup').hide();
           // app.mobileApp.showLoading();
            
            sessionStorage.setItem("catNodeId",e['currentTarget']['attributes']['data-id']['value']);
            app.mobileApp.navigate("views/articleData.html?param=articleList");
        },
        
        shareMessageAndURL:function(id)
        {
            this.share('The message', 'The subject', null, 'http://okplay.club/node/'+id);
        },
        
        share : function(message, subject, image, link)
        {
           window.plugins.socialsharing.share(message, subject, image, link, this.onSuccess, this.onError);
        },
        
        onSuccess: function(msg) {
            console.log('SocialSharing success: ' + msg);
        },

        onError: function(msg) {
            alert('SocialSharing error: ' + msg);
        }
    });
    app.categoryService = {
        viewModel : new categoryViewModel()
    };
})(window);