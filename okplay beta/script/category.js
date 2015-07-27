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
           
            $('.menu').unbind();
            $('.menu').on('click',function(e){
                $('.popup').slideToggle("slow","swing");
            });
            
            $('#ageDropFld').click(function(){
               $('.popup').hide();
            });
            app.categoryService.viewModel.fetchAgeListdata();
             
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
                    console.log(data);
                    
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
                    console.log(data);
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
        
        /* main article content data show functions*/
        
        articleContentShow : function()
        {
            app.mobileApp.showLoading();
            
            setTimeout(function(){
               app.mobileApp.hideLoading();
            },6000);
        },
        
        articleContentDataCall : function(e)
        {
            $('.popup').hide();
            app.mobileApp.showLoading();
            sessionStorage.setItem("mainArticleStatus",true);
            
            var articleContent = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: localStorage.getItem('articleDetailAPI'),
                        type:"GET",
                        dataType: "json", 
                        data: { apiaction:"articledetail",nodeId:e['target']['attributes']['data-id'].value} 
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
            articleContent.fetch(function(){
                var data = this.data();
                console.log(data);
                if(data[0]['code'] === 1 || data[0]['code'] === '1')
                {
                    app.categoryService.viewModel.setArticleDataSource(data[0]['data']);
                }
                else
                {
                    navigator.notification.alert('Server not responding properly,Please try again',function(){},"Notification","OK");
                }
            });
        },
        
        setArticleDataSource : function(data)
        {
            this.set("articleDetail",data);
            app.mobileApp.navigate("views/articleData.html");
        }
    });
    app.categoryService = {
        viewModel : new categoryViewModel()
    };
})(window);