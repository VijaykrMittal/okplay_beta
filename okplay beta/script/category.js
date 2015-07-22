(function(global){
    var categoryViewModel,
        app = global.app = global.app || {};
    
    categoryViewModel = kendo.data.ObservableObject.extend({
        articlelistData:'',
        
        show:function()
        {
            $('.menu').unbind();
            $('.menu').on('click',function(){
                $('.popup').slideToggle("slow","swing");
            });
            app.categoryService.viewModel.fetchAgeListdata();
        },
        
        setArticleListData:function(data)
        {
            this.set("articlelistData",data);
        },
        
        fetchAgeListdata : function()
        {
            var ageData = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'http://okplay.club/mobileapi/all-ages-list',
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
            html = "<option>All Age Group</option>";
            for(var x in data)
            {
                if($.isNumeric(x))
                {
                    html +="<option data-id='"+data[x]['id']+"'>"+data[x]['name']+"</option>"
                }
            }
            $('#ageDropFld').html(html);
        },
        
        drpdownFilter:function(data)
        {
            var categoryAgeFilter  = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url:'http://okplay.club/mobileapi/article-list',
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
    });
    app.categoryService = {
        viewModel : new categoryViewModel()
    };
})(window);