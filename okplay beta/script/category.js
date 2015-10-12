(function(global){
    var categoryViewModel,
        app = global.app = global.app || {};
    dataAgeParam=[];
    categoryViewModel = kendo.data.ObservableObject.extend({
        articlelistData:'',
        dataListStatus:'',
        articleDetail:'',
        searchlistData:true,
        searchStatus:'',
        selectCategory:'',
        
        redirectBack:function()
        {
            $(".km-native-scroller").scrollTop(0);
            //$("#categoryArticleView").find(".km-scroll-container").css("-webkit-transform", "");
            app.mobileApp.showLoading();
            app.categoryService.viewModel.categoryArticleData();
            if(sessionStorage.getItem('ageListAPIStatus') === "null" || sessionStorage.getItem('ageListAPIStatus') === null)
            {
                $('select').val('0');
                app.categoryService.viewModel.fetchAgeListdata();
                sessionStorage.setItem('ageListAPIStatus',true);
            }
            else
            {
                var ageArray =sessionStorage.getItem('myArray');
                app.categoryService.viewModel.showAgeDropDownbyArray(JSON.parse(ageArray));
            }
            
        },
        show:function(e)
        { 
            e.sender.reload=true;
            e.view.reload=true;
            temp = e;
            
            $('#articlelist').html('');
            $('.popup').hide();
            $('.searchTxtbox').val('');
            $('#articlelist').html("");
            
            $('.menu').unbind();
            $('[data-role="view"]').unbind();
            $('[data-role="view"]#categoryArticleView').on("click",function(e){
                if($(e.target).hasClass('menu'))
                {
                    $('.popup').slideToggle();
                    $('.searchTxtbox').blur();
                }
                else
                {
                    $('.popup').hide();
                }
            });
            
            $('#ageDropFld').click(function(){
               $('.popup').hide();
            });
        },
        
        categoryArticleData : function()
        {
            app.mobileApp.showLoading();
            dataParam =[];
            cateID = sessionStorage.getItem('categorySelectItem');
            ageID = sessionStorage.getItem('ageSelectItem');
            
            /*if(sessionStorage.getItem('ageSelectItem') === null || sessionStorage.getItem('ageSelectItem') === "" || sessionStorage.getItem('ageSelectItem') === "0" || sessionStorage.getItem('ageSelectItem') === 0)
            {
                 ageID = ''; 
            }
            else
            {
                 ageID = sessionStorage.getItem('ageSelectItem');
                 dataParam['ageId']=ageID;
            }*/
            
            if(sessionStorage.getItem('ageSelectItem') === null || sessionStorage.getItem('ageSelectItem') === "" || sessionStorage.getItem('ageSelectItem') === "0" || sessionStorage.getItem('ageSelectItem') === 0)
            {
                 dataParam['ageId'] = '';
                 dataParam['catId']=cateID;
            }
            else
            {
                dataParam['ageId'] = sessionStorage.getItem('ageSelectItem');
                dataParam['catId']='';
            }
            
            dataParam['apiaction']='articlelist';
            console.log(dataParam);
            if(ageID === "")
            {
                app.categoryService.viewModel.setSelectCategory(cateID);
            }
            else
            {
               app.categoryService.viewModel.setSelectCategory(ageID); 
            }
            
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
                    	function () { }, "Message", 'OK');
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
                    	function () { }, "Message", 'OK');
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
                $('#categoryDiscrip').html(localStorage.getItem('Health_description'));
            }
            else if(id === "72")
            {
                that.set("selectCategory","Mental development");
                $('#categoryDiscrip').html(localStorage.getItem('Mental Development_description'));
            }
            else if(id === "73")
            {
                that.set("selectCategory","Nutrition");
                $('#categoryDiscrip').html(localStorage.getItem('Nutrition_description'));
            }
            else if(id === "82")
            {
                that.set("selectCategory","Education");
                $('#categoryDiscrip').html(localStorage.getItem('Education_description'));
            }
            else if(id=== "75")
            {
                that.set("selectCategory","Play time");
                $('#categoryDiscrip').html(localStorage.getItem('Play Time_description'));
            }
            else if(id=== "77")
            {
                that.set("selectCategory","Family");
                $('#categoryDiscrip').html(localStorage.getItem('Family_description'));
            }
            else if(id=== "23")
            {
                that.set("selectCategory","Pre-natal");
                $('#categoryDiscrip').html(localStorage.getItem('Pre-natal_description'));
            }
            else if(id === "25")
            {
                that.set("selectCategory","0 to 3 months");
                $('#categoryDiscrip').html(localStorage.getItem('0 to 3 months_description'));
            }
            else if(id === "26")
            {
                that.set("selectCategory","3 to 12 months");
                $('#categoryDiscrip').html(localStorage.getItem('3 to 12 months_description'));
            }
            else if(id === "27")
            {
                that.set("selectCategory","1 to 3 years");
                $('#categoryDiscrip').html(localStorage.getItem('1 to 3 years_description'));
            }
            else if(id === "28")
            {
                that.set("selectCategory","3 to 5 years");
                $('#categoryDiscrip').html(localStorage.getItem('3 to 5 years_description'));
            }
            else if(id === "29")
            {
                that.set("selectCategory","5 to 7 years");
                $('#categoryDiscrip').html(localStorage.getItem('5 to 7 years_description'));
            }
            else if(id === "230")
            {
                that.set("selectCategory","7 to 10 years");
                $('#categoryDiscrip').html(localStorage.getItem('7 to 10 years_description'));
            }
            else if(id === "231")
            {
                that.set("selectCategory","10 to 12 years");
                $('#categoryDiscrip').html(localStorage.getItem('10 to 12 years_description'));
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
                this.set("articlelistData",data);
                this.set("searchlistData",true);
                app.mobileApp.hideLoading();
            }
            temp.sender.reload=false;
            temp.view.reload=false;
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
                    function () { }, "Message", 'OK');
                },

            });
            ageData.fetch(function(){
                var data = this.data();
                sessionStorage.setItem('myArray',JSON.stringify(data));
                app.categoryService.viewModel.showAgeDropDownbyAPI(data[0]);
            });
        },
        
        showAgeDropDownbyAPI:function(data)
        {
            var html = "";
            html = "<option value='0' data-id='0'>All Age Groups</option>";
            for(var x in data)
            {
                if($.isNumeric(x))
                {
                    html +="<option value='"+data[x]['id']+"' data-id='"+data[x]['id']+"'>"+data[x]['name']+"</option>"
                }
            }
            $('#ageDropFld').html(html);
        },
        
        showAgeDropDownbyArray:function(data)
        {
            var html = "";
            html = "<option value='0' data-id='0'>All Age Group</option>";
            for(var x in data[0])
            {
                if($.isNumeric(x))
                {
                    html +="<option value='"+data[0][x]['id']+"' data-id='"+data[0][x]['id']+"'>"+data[0][x]['name']+"</option>"
                }
            }
            $('#ageDropFld').html(html);
            $('#ageDropFld option[value="' + sessionStorage.getItem('ageSelectItem') + '"]').prop('selected', true);
        },
        
        drpdownFilter:function(ageID)
        {
            if(ageID === 0 || ageID === '0')
            {
                tmp = sessionStorage.getItem('lastSelectAge');
                sessionStorage.setItem('ageSelectItem',tmp);
            }
            else
            {
                sessionStorage.setItem('ageSelectItem',ageID);
            }
            
             app.categoryService.viewModel.categoryArticleData();
        },
        
        articleContentDataCall : function(e)
        {
            $('.popup').hide();
            sessionStorage.setItem("catNodeId",e['currentTarget']['attributes']['data-id']['value']);
            sessionStorage.setItem("cattitle",e['currentTarget']['attributes']['data-title']['value']);
            app.mobileApp.navigate("views/articleData.html");
        },
        
        shareMessageAndURL:function(id,sub,msg)
        {
           var url = "http://okplay.club/node/"+id;
           app.categoryService.viewModel.share(msg, sub, null, url);
        },
        
        share : function(message, subject, image, link)
        {
          // window.plugins.socialsharing.share(message, subject, image, link, this.onSuccess, this.onError);
            /* window.plugins.socialsharing.shareViaFacebook(message,image,  // img
                link,      //link 
                this.onSuccess, 
                this.onError);*/
            /* window.plugins.socialsharing.shareViaEmail (
                   message,
                   subject,
                   null, // TO: must be null or an array  ['to@person1.com', 'to@person2.com']
                   null, // CC: must be null or an array  ['cc@person1.com']
                   null, // BCC: must be null or an array
                   [shareImg],
                   app.shareSuccess,
                   app.shareMessageError
               );*/
            
            if(sessionStorage.getItem('iosDeviceType') === 'iPad2,1')
            {
                window.plugins.socialsharing.shareViaFacebook(message,image,  // img
                link,      //link 
                this.onSuccess, 
                this.onError);
            }
            else
            {
                window.plugins.socialsharing.share(message, subject, image, link, this.onSuccess, this.onError);
            }
        },
        
        onSuccess: function(msg) {
            console.log('SocialSharing success: ' + msg);
        },

        onError: function(msg) {
            console.log('SocialSharing error: ' + msg);
        }
    });
    app.categoryService = {
        viewModel : new categoryViewModel()
    };
})(window);