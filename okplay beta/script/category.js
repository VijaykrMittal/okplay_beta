(function(global){
    var categoryViewModel,
        app = global.app = global.app || {};
    
    categoryViewModel = kendo.data.ObservableObject.extend({
        articlelistData:'',
        dataListStatus:'',
        articleDetail:'',
        searchlistData:true,
        searchStatus:'',
        selectCategory:'',
        
        show:function()
        { 
            $('select').val('0');
            $('.popup').hide();
            $('.srchtxt').val('');
            
            $('#articlelist').html("");
            
            $('.menu').unbind();
            $('[data-role="view"]').unbind();
            $('[data-role="view"]#categoryArticleView').on("click",function(e){
                if($(e.target).hasClass('menu'))
                {
                    $('.popup').slideToggle();
                }
                else
                {
                    $('.popup').hide();
                }
            });
            
            $('#ageDropFld').click(function(){
               $('.popup').hide();
            });
            $(".km-native-scroller").scrollTop(0);

            app.categoryService.viewModel.categoryArticleData();
            app.categoryService.viewModel.fetchAgeListdata();
        },
        
        categoryArticleData : function()
        {
            app.mobileApp.showLoading();
            dataParam =[];
            cateID = sessionStorage.getItem('categorySelectItem');
            if(sessionStorage.getItem('ageSelectItem') === null || sessionStorage.getItem('ageSelectItem') === "")
            {
                 ageID = ''; 
            }
            else
            {
                 ageID = sessionStorage.getItem('ageSelectItem');
                 dataParam['ageId']=ageID;
            }
            dataParam['apiaction']='articlelist';
            dataParam['catId']=cateID;
            
            app.categoryService.viewModel.setSelectCategory(cateID);
            var categoryDataSource  = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url:localStorage.getItem('articleListAPI'),
                            type:"GET",
                            dataType: "json",
                            data: dataParam, 
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
                categoryDataSource .fetch(function(){
                    var that = this;
                    var data = that.data();
                    if(data[0]['code'] === 1 || data[0]['code'] === '1')
                    {
                        console.log(data[0]['data']);
                       app.categoryService.viewModel.setArticleListData(data[0]['data']);
                    }
                    else
                    {
                        navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    	function () { }, "Notification", 'OK');
                        app.mobileApp.hideLoading();
                    }
                });
        },
        
        setSelectCategory : function(id)
        {
            var that = this;
            if(id === "80")
            {
                that.set("selectCategory","Health");
            }
            else if(id === "72")
            {
                that.set("selectCategory","Mental development");
            }
            else if(id === "73")
            {
                that.set("selectCategory","Nutrition");
            }
            else if(id === "82")
            {
                that.set("selectCategory","Education");
            }
            else if(id=== "75")
            {
                that.set("selectCategory","Play time");
            }
            else if(id=== "77")
            {
                that.set("selectCategory","Family");
            }
        },
        
        setArticleListData:function(data)
        { 
            if(data.length ===0 || data.length === "0")
            {
                this.set("dataListStatus","There is no article.");
                this.set("searchlistData",false);
                app.mobileApp.hideLoading();
            }
            else
            {
                this.set("dataListStatus","");
                 this.set("searchlistData",true);
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
                    app.mobileApp.hideLoading();
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
        },
        
        drpdownFilter:function(ageID)
        {
            
             sessionStorage.setItem('ageSelectItem',ageID);
             app.categoryService.viewModel.categoryArticleData();
        },
        
        articleContentDataCall : function(e)
        {
            $('.popup').hide();
            sessionStorage.setItem("catNodeId",e['currentTarget']['attributes']['data-id']['value']);
            app.mobileApp.navigate("views/articleData.html?param=articleList");
        },
        
        shareMessageAndURL:function(id,sub,msg)
        {
            var url = "http://okplay.club/node/"+id;
            this.share(msg, sub, null, url);
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