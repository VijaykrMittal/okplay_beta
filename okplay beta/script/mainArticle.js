(function(global){
    var mainArticleViewModel,
        app = global.app = global.app || {};
    
    mainArticleViewModel = kendo.data.ObservableObject.extend({
        articleDetail:'',
        
        show :function(e)
        {   
            app.mobileApp.showLoading();
            $('.homeFooter').css("display",'none');
            $('.bannerDv img').attr("src",sessionStorage.getItem('mainArticleImgPath'));
            $('.menu').unbind();
            $('[data-role="view"]').unbind();
            $('[data-role="view"]#mainArticleView').on("click",function(e){
                if($(e.target).hasClass('menu'))
                {
                    $('.popup').slideToggle();
                }
                else
                {
                   // $(e.target).preventDefault();
                    $('.popup').hide();
                }
            });
            
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
            
            /*$('#shareArticleContent').click(function(){
                alert(sessionStorage.getItem('readArticleTitle'));
                alert(sessionStorage.getItem('catNodeId'));
                app.mainArticleService.viewModel.shareThisArticle(sessionStorage.getItem('catNodeId'),sessionStorage.getItem('catNodeId'));
            });*/
            
            $('.comments').css('display','none');
        },
        
        articleDetailAPI : function(data)
        {
            //app.mobileApp.showLoading();
            //sessionStorage.setItem('readArticle',data);
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
                    }
                },
                error: function (e) {
                    app.mobileApp.hideLoading();
                    navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    function () { }, "Notification", 'OK');
                },

            });
            articleContent.fetch(function(){
                var data = this.data();
                console.log(data);
                if(data[0]['code'] === 1 || data[0]['code'] === '1')
                {
                    sessionStorage.setItem('readArticleTitle',data[0]['data']['field_first_title']);
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
            this.set("articleDetail",data);
            $('.homeFooter').css("display",'block');
            $('.comments').css('display','block');
            
            setTimeout(function(){
               app.mobileApp.hideLoading();
            },5000);
            //app.mobileApp.hideLoading();
        },
        
        shareThisArticle : function(e)
        {
            app.categoryService.viewModel.shareMessageAndURL(sessionStorage.getItem('catNodeId'),e['target']['context']['attributes']['data-title']['value'],"The Message");
        }
    });
    app.mainArticleService = {
        viewModel : new mainArticleViewModel()
    };
})(window);