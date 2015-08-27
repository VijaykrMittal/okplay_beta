(function(global){
    var searchViewModel,
        app = global.app = global.app || {};
    
    searchViewModel = kendo.data.ObservableObject.extend({
        searchlistData:'',
        searchlistStatus:true,
        
        show : function(e)
        {
            app.mobileApp.showLoading();
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
            
            if(e['sender']['params']['keyword'] === "")
            {
                e['sender']['params']['keyword'] ="all";
            }
            sessionStorage.setItem("searchKeyword",e['sender']['params']['keyword']);
            app.searchService.viewModel.srchDataCall(e['sender']['params']['keyword']);
            e.view.scroller.scrollTo(0, 0);
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
                    function () { }, "Notification", 'OK');
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
                    navigator.notification.alert('Server not responding properly,Please try again',function(){},"Notification","OK");
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
                this.set('searchStatus',"");
                this.set('searchlistData',data);
                this.set('searchlistStatus',true);
                setTimeout(function(){
                    app.mobileApp.hideLoading();
                },3000);
            }
            temp.sender.reload=false;
            temp.view.reload=false;
        },
        
        readMoreArticle : function(e)
        {
            $('.popup').hide();
            sessionStorage.setItem("catNodeId",e['target']['context']['attributes']['data-id']['value']);
            sessionStorage.setItem("cattitle",e['target']['context']['attributes']['data-title']['value']);
            app.mobileApp.navigate("views/articleData.html");
        }
    });
    app.searchService = {
        viewModel : new searchViewModel()
    };
})(window);