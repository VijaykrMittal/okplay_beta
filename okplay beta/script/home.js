(function(global){
    var homeViewModel,
        app = global.app = global.app || {};
    
    homeViewModel = kendo.data.ObservableObject.extend({
        
        categorydrawerData:'',
        categoryName:'',
        dataListStatus:'',
        categoryText:'',
        listData:'',
        articleDetail:'',
        
        scrollImgDataSource:'',
        categoryListData:'',
        
        show:function()
        {
          app.homeService.viewModel.scrollViewImage();
          app.homeService.viewModel.categoryDataShow();
            
            $('.menu').click(function(){
                $('#popup').slideToggle("slow","swing");
            });
        },
        
        categoryDataShow:function()
        {
            var category = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: 'http://okplay.club/mobileapi/allcategories',
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
                    console.log(data[0]);
                    app.homeService.viewModel.setCategoryData(data[0]);
                    //app.homeService.viewModel.getCategoryData(data[0]);
                    //app.homeService.viewModel.fetchCategoryData(data[0][0]['id']);
                });
        },
        
        setCategoryData :function(data)
        {
            this.set("categoryListData",data);
        },
        
        scrollViewImage : function()
        {
          var scrollData = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'http://okplay.club/mobileapi/slideshow-list',
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
                app.homeService.viewModel.setScrollViewData(data[0]['data']);
                console.log(data);
            });  
        },
        
        setScrollViewData:function(data)
        {
            var that = this;
            console.log(data);
           // that.set("scrollImgDataSource",data);
            var html = "";
            /*for(var x in data)
            {
               if($.isNumeric(x))
                {
                     html +='<li style="float: left; list-style: none; position: relative; width: 396px;"><img src="http://okplay.club/sites/default/files/slid1.jpg/"></li><li style="float: left; list-style: none; position: relative; width: 396px;"><img src="http://okplay.club/sites/default/files/slider2.png/"></li><li style="float: left; list-style: none; position: relative; width: 396px;"><img src="http://okplay.club/sites/default/files/Homepage-education%281%29.jpg/"></li>';
                }
            }*/
             html +='<li style="float: left; list-style: none; position: relative; width: 396px;"><img src="http://okplay.club/sites/default/files/slid1.jpg"></li><li style="float: left; list-style: none; position: relative; width: 396px;"><img src="http://okplay.club/sites/default/files/slider2.png"></li><li style="float: left; list-style: none; position: relative; width: 396px;"><img src="http://okplay.club/sites/default/files/Homepage-education%281%29.jpg"></li>';
            $('#bxs').html(html);
           setTimeout(function(){
               $('#bxs').bxSlider();
           },100); 
 
        },
        categoryShow:function(e)
        { 
            /*e.view.scroller.scrollTo(0, 0);
            app.mobileApp.showLoading();
            $('#backbtn').addClass("drawerBtn");*/
            
            if(sessionStorage.getItem('mainArticleStatus') === null || sessionStorage.getItem('mainArticleStatus') === "null")
            {
                var category = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: 'http://okplay.club/mobileapi/allcategories',
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
                    app.homeService.viewModel.getCategoryData(data[0]);
                    app.homeService.viewModel.fetchCategoryData(data[0][0]['id']);
                });
            }
            else
            {
                $('#ageDrawer').removeClass("drawerBtn");
                setTimeout(function(){
                    app.mobileApp.hideLoading();
                },500)
                
            }
        },
        
        getCategoryData : function(data)
        {
            var dataItem = {};
            var columns = [];
            
            if(typeof $("#grid").data("kendoGrid") !=='undefined')
            {
                var grid = $("#grid").data("kendoGrid");
                grid.removeRow("tr:eq(1)");
                $( "#grid .k-grid-content").remove();
            }
            
            for (x in data) 
            {
                if($.isNumeric(x))
                {
                    dataItem['col' + x] = data[x]['name'];
                    columns.push({
                        field: 'col' + x,
                        width: 192,
                        filterable: true,
                        attributes: {
                            "data-id": data[x]['id'],
                            "align":'center'
                        }
                    });
                }
            }
           
           $("#grid").kendoGrid({
                scrollable: true,
                change:app.homeService.viewModel.passCategoryId,
                columns: columns,
                filterable: true,
                type:'number',
                dataSource: [dataItem],
                selectable:'cell'
            });
            //app.mobileApp.hideLoading();
        },
        
        passCategoryId:function()
        {
            app.mobileApp.showLoading();   
            app.homeService.viewModel.fetchCategoryData($('.k-state-selected').attr('data-id'));
        },
        
        ageshow : function(e)
        {
            $('[data-role="drawer"]').children().css("background-color","#373F4A");
            e.view.scroller.scrollTo(0, 0);
            
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
                app.homeService.viewModel.setAgeDataSource(data[0]);
            });
        },
        
        setAgeDataSource :function(data)
        {
            this.set("agedrawerData",data);
        },
        
        setcategoryData :function(data)
        {
            if(data.length === 0)
            {
                this.set("dataListStatus","There is no article.");
                //this.set("categoryText","");
                this.set("listData","");
                app.mobileApp.hideLoading();
            }
            if(data.length>0)
            {
                if(sessionStorage.getItem('categorySelectItem') === 80 || sessionStorage.getItem('categorySelectItem') === '80')
                {
                    $('#grid tbody tr td:nth-child(1)').addClass("k-state-selected");
                }
                else
                {
                    $('#grid tbody tr td:nth-child(1)').removeClass("k-state-selected");
                }
                this.set("dataListStatus","");
              /*this.set("categoryName",data[0]['value']);
                this.set("categoryText",data[0]['text']);*/
                this.set("listData",data);
                app.mobileApp.hideLoading();
            }
        },
        
        drawerAgeFilter : function(e)
        {
            var data = e['target']['attributes']['data-id'].value;
            var categoryDataSource  = new kendo.data.DataSource({
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
            categoryDataSource .fetch(function(){
                var that = this;
                var data = that.data();
                app.homeService.viewModel.setcategoryData(data[0]['data']);
            });
            
            $("#age-drawer").data("kendoMobileDrawer").hide();
        },
        
        fetchCategoryData : function(data)
        {
            sessionStorage.setItem("categorySelectItem",data);
            var categoryDataSource  = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url:'http://okplay.club/mobileapi/article-list',
                            type:"GET",
                            dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
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
                    app.homeService.viewModel.setcategoryData(data[0]['data']);
                });
        },
        
        articleContentShow:function()
        {
            setTimeout(function(){
                app.mobileApp.hideLoading();
            },500);
            
        },
        
        articleDataCall:function(e)
        {
            app.mobileApp.showLoading();
            sessionStorage.setItem("mainArticleStatus","true");
            var category = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'http://okplay.club/mobileapi/article-detail',
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
            category.fetch(function(){
                var data = this.data();
                if(data[0]['code'] === 1 || data[0]['code'] === '1')
                {
                    app.homeService.viewModel.setArticleDataSource(data[0]['data']);
                }
                else
                {
                    navigator.notification.alert('Server not responding properly,Please try again',function(){},"Notification","OK");
                }
            });
            
        },
        
        setArticleDataSource:function(data)
        {
            this.set("articleDetail",data);
            $('#ageDrawer').addClass("drawerBtn");
            $('#backbtn').removeClass("drawerBtn");
            app.mobileApp.navigate("views/articleData.html");
            
        },
    });
    app.homeService = {
        viewModel : new homeViewModel()
    };
})(window);