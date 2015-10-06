(function(global){
    var searchViewModel,
        app = global.app = global.app || {};
    
    searchViewModel = kendo.data.ObservableObject.extend({
        searchlistData:'',
        searchlistStatus:true,
        
        show : function(e)
        {
            app.mobileApp.showLoading();
            $("#searchContent").find(".km-scroll-container").css("-webkit-transform", "");
            
            if(e['sender']['params']['keyword'] === "")
            {
                e['sender']['params']['keyword'] ="all";
            }
            sessionStorage.setItem("searchKeyword",e['sender']['params']['keyword']);
            app.searchService.viewModel.srchDataCall(e['sender']['params']['keyword']);
            
            e.sender.reload=true;
            e.view.reload=true; 
            temp = e;
            $('p.txtclass').html("");
            //$("#alldatasrch").html("");
            
            $('.menu').unbind();
            $('[data-role="view"]').unbind();
            $('[data-role="view"]#searchContent').on("click",function(e){
                if($(e.target).hasClass('menu'))
                {
                    $('.popup').slideToggle();
                }
                else
                {
                    $('.popup').hide();
                }
            });
           // e.view.scroller.scrollTo(0, 0);
            
        },
        
        checkme:function()
        {
          alert("fine");  
        },
        
        srchDataCall:function(searchtxt)
        {
            $('.popup').hide();
            var searchContent = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: localStorage.getItem('searchDataAPI'),
                        type:"GET",
                        dataType: "json", 
                        data: { apiaction:"searchdata",keyword:searchtxt} 
                    },
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
                    function () { }, "Message", 'OK');
                },

            });
            searchContent.fetch(function(){
                var data = this.data();
                console.log(data);
                if(data[0]['code'] === 1 || data[0]['code'] === '1')
                {
                    app.searchService.viewModel.setSearchData(data[0]['data']);
                }
                else
                {
                    navigator.notification.alert('Server not responding properly,Please try again',function(){},"Message","OK");
                }
            });
        },
        
        setSearchData  :function(data)
        {
            if(data.length === 0 || data.length === '0')
            {
                this.set('searchStatus',sessionStorage.getItem("searchKeyword")+" related search not found.");
                this.set('searchlistStatus',false);
                app.mobileApp.hideLoading();
            }
            else
            {
                /*htmlnew = "";
                console.log(data);
                for(var x in data)
                {
                    //console.log(x);
                   
                    if($.isNumeric(x))
                    {
                        htmlnew += "<li>";
                        if(data[x]['path'] !== "http://okplay.club/"){
                            htmlnew +='<div class="articleDv">';
                            htmlnew+= '<span class="shadow"><img src="styles/images/shadow.png" width="100%" height="100%"></span>';
                            htmlnew+='<img src="'+data[x]['path']+'" width="100%" height="100%"/>';        
                            htmlnew+='<p data-value="'+data['id']+'" class="textTitle blankarticleTit">'+ data[x]['title']+'</p>';
                            htmlnew+=' </div>';
                        }else
                        {
                            htmlnew+='<div data-id="'+ data[x]['id']+ '" class="articleDvDft">';
                            htmlnew+='<span class="shadow"><img src="styles/images/shadow.png" width="100%" height="100%"></span>';
                            htmlnew+='<img src="styles/images/no-image.jpg" width="100%" height="100%"/>';
                            htmlnew+='<p data-value="'+data[x]['id']+'" class="textTitle articleTit">'+data[x]['title']+'</p>';
                            htmlnew+='</div>';
                        }
                        
                        if(data['path'] !== "http://okplay.club/"){
                        htmlnew +='<a data-role="button" onclick="app.searchService.viewModel.readMoreArticle" data-id="'+data[x]['id']+'" data-title="'+data[x]['title']+'" class="searchBtn">Read More</a>';
                        }else{
                        htmlnew +='<input type="button" data-role="button" onclick="app.searchService.viewModel.readMoreArticle" data-id="'+data[x]['id']+'" data-title="'+data['title']+'" value="Read More" class="searchBtnDFT"/>';
                        }
                        htmlnew += "</li>";
                    }
                }
                $('#alldatasrchnew').html(htmlnew);
                app.mobileApp.hideLoading();*/
                this.set('searchStatus',"");
                this.set('searchlistData',data);
                this.set('searchlistStatus',true);
                setTimeout(function(){
                    app.mobileApp.hideLoading();
                },3000);
            }
            /*if(window.device.platform === 'Android')
            {
                temp.sender.reload=false;
                temp.view.reload=false;
            }*/
            temp.sender.reload=false;
            temp.view.reload=false;
        },
        
        readMoreArticle : function(e)
        {
            console.log(e);
            $('.popup').hide();
            sessionStorage.setItem("catNodeId",e['target']['context']['attributes']['data-id']['value']);
            sessionStorage.setItem("cattitle",e['target']['context']['attributes']['data-title']['value']);
            app.mobileApp.navigate("views/articleData.html");
        },
        readMoreArticlebyDv : function(e)
        {
            console.log(e);
            $('.popup').hide();
            sessionStorage.setItem("catNodeId",e['currentTarget']['attributes']['data-id']['value']);
            sessionStorage.setItem("cattitle",e['currentTarget']['attributes']['data-title']['value']);
            app.mobileApp.navigate("views/articleData.html");
        }
    });
    app.searchService = {
        viewModel : new searchViewModel()
    };
})(window);