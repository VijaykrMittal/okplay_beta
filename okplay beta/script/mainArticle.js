(function(global){
    var mainArticleViewModel,
        app = global.app = global.app || {};
    
    mainArticleViewModel = kendo.data.ObservableObject.extend({
        articleDetail:'',
        
        show :function(e)
        {   
            app.mobileApp.showLoading();
            $('.mainTempDv').html("");
            e.view.scroller.scrollTo(0, 0);
            if(e['sender']['params']['param'] === "articleList")
            {
                app.mainArticleService.viewModel.articleDetailAPI(sessionStorage.getItem("catNodeId"));
            }
            else
            {
                app.mainArticleService.viewModel.articleDetailAPI(sessionStorage.getItem("srchNodeId"));
            }
        },
        
        articleDetailAPI : function(data)
        {
            var articleContent = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: localStorage.getItem('articleDetailAPI'),
                        type:"GET",
                        dataType: "json", 
                        data: { apiaction:"articledetail",nodeId:data} 
                    }
                },
                schema: {
                    data: function(data)
                    {
                        if(data['data']['field_article_listing_image'] === null){data['data']['field_article_listing_image'] ="";}
                        if(data['data']['field_bold_title'] === null){data['data']['field_bold_title'] ="";}
                        if(data['data']['field_fifth_text_area'] === null){data['data']['field_fifth_text_area'] ="";}
                        if(data['data']['field_fifth_title'] === null){data['data']['field_fifth_title'] ="";}
                        if(data['data']['field_first_text_area'] === null){data['data']['field_first_text_area'] ="";}
                        if(data['data']['field_first_title'] === null){data['data']['field_first_title'] ="";}
                        if(data['data']['field_fourth_text_area'] === null){data['data']['field_fourth_text_area'] ="";}
                        if(data['data']['field_fourth_title'] === null){data['data']['field_fourth_title'] ="";}
                        if(data['data']['field_inner_bannr_image'] === null){data['data']['field_inner_bannr_image'] ="";}
                        if(data['data']['field_second_text_area'] === null){data['data']['field_second_text_area'] ="";}
                        if(data['data']['field_second_title'] === null){data['data']['field_second_title'] ="";}
                        if(data['data']['field_third_text_area'] === null){data['data']['field_third_text_area'] ="";}
                        if(data['data']['field_third_title'] === null){data['data']['field_third_title'] ="";}
                        return [data];
                        console.log(data)
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
                    app.mainArticleService.viewModel.setarticleDetail(data[0]['data']);
                }
                else
                {
                    navigator.notification.alert('Server not responding properly,Please try again',function(){},"Notification","OK");
                }
            });
        },
        
        setarticleDetail : function(data)
        {
            setTimeout(function(){
               app.mobileApp.hideLoading();
            },5000);
            this.set("articleDetail",data);
            //app.mobileApp.hideLoading();
            
        },
    });
    app.mainArticleService = {
        viewModel : new mainArticleViewModel()
    };
})(window);