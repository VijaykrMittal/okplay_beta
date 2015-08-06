(function(global){
    var searchViewModel,
        app = global.app = global.app || {};
    
    searchViewModel = kendo.data.ObservableObject.extend({
        searchlistData:'',
        
        show : function(e)
        {
            app.mobileApp.showLoading();
            $('p.txtclass').html("");
            $("#alldatasrch").html("");
            e.view.scroller.scrollTo(0, 0);
            if(e['sender']['params']['keyword'] === "")
            {
                e['sender']['params']['keyword'] ="all";
            }
            sessionStorage.setItem("searchKeyword",e['sender']['params']['keyword']);
            app.searchService.viewModel.srchDataCall(e['sender']['params']['keyword']);
        },
        
        srchDataCall:function(searchTxt)
        {
            $('.popup').hide();
            var searchContent = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: localStorage.getItem('searchDataAPI'),
                        type:"GET",
                        dataType: "json", 
                        data: { apiaction:"searchdata",keyword:searchTxt} 
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
                this.set('searchlistData','');
                app.mobileApp.hideLoading();
            }
            else
            {
                this.set('searchlistData',data);
                this.set('searchStatus',"");
            }
            setTimeout(function(){
                app.mobileApp.hideLoading();
            },100000)
        },
        
        readMoreArticle : function(e)
        {
            $('.popup').hide();
            sessionStorage.setItem("srchNodeId",e['target']['context']['attributes']['data-id']['value']);
            app.mobileApp.navigate("views/articleData.html?param=searchList");
        }
    });
    app.searchService = {
        viewModel : new searchViewModel()
    };
})(window);