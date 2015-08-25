(function(global){
    var mainArticleViewModel,
        app = global.app = global.app || {};
    
    mainArticleViewModel = kendo.data.ObservableObject.extend({
        articleDetail:'',
        commentDataSource:'',
        
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
            //this.set('commentDataSource',data['commentdata']);
            app.mainArticleService.viewModel.setcommenthtml(data['commentdata']);
            $('.homeFooter').css("display",'block');
            $('.comments').css('display','block');
            
            setTimeout(function(){
               app.mobileApp.hideLoading();
            },5000);
        },
        
        setcommenthtml : function(data)
        {
            console.log(data);
            
            var commentHtml ='';
            var commentInnerHtml = '';
            parentArray = [];
            if(data.length === 0)
            {
                commentHtml ='<h4>There is no comments</h4>';
            }
            else
            {
                commentHtml = '<ul style="list-style-type:none;margin-left:-40px">';
                var className = 'root';
                var i= 0;
                for(var x in data)
                {
                    
                    if($.isNumeric(x))
                    {
                        
                        
                        if(data[x]['pid']=== '0')
                        {   
                            i= 0;
                            var className = 'root';
                        }
                        else
                        {
                             i++;
                            var className = 'root-'+i;
                            
                        }
                        
                        var date = new Date(Number(data[x]['created'])*1000);
                            mid = "AM";
                            hours = date.getHours();
                            tempHours = hours;
                            if(tempHours >= 12)
                            {
                                tempHours = hours-12;
                                mid = 'PM';
                            }
                            
                            if(tempHours === 0)
                            {
                                tempHours = 12;
                            }
                        
                        if(data[x]['u_uid'] === 0 || data[x]['u_uid'] === '0')
                        {
                            username = 'Anonymous';
                        }
                        else
                        {
                                username = data[x]['name'];
                        }
                        
                        
                        commentHtml +='<li>';
                        commentHtml += '<div class="'+className+'" id="rootId'+data[x]['cid']+'" style="width:100%;display: inline-block;margin-bottom:15px;">';
                        commentHtml += '<div style="width:30%;float:left">';
                        commentHtml += '<ul style="list-style-type:none;margin-left:-35px"><li><img src="styles/images/user-face.png" style="width:80px;height:80px;border-radius:50%"/></li><li><span style="font-size:13px">'+username+'</span></li></ul>';
                        commentHtml += '</div>';
                        commentHtml += '<div style="width:70%;float:left">';
                        commentHtml += '<div style="width:100%;display: inline-block;margin: 20px 0px 0px 0px;">';
                        commentHtml += '<div style="width:98%;background-color:#E1E3E4;border-radius:15px;padding:10px;line-height:30px;">'+data[x]['subject']+'</div>';
                        commentHtml += '<div style="width:100%;margin-top:15px;display: inline-block;">';
                        commentHtml += '<span style="width:50%;float:left;font-size:13px">'+date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+tempHours+':'+date.getMinutes()+' '+mid+'</span>';
                        commentHtml += '<ul style="float:left;width:50%;list-style:none;"><li style="float:left;margin:0px 20px 0px 0px"><input type="button" style="border:none;background:none" data-role="button" value="Reply" data-rel="modalview" href="#comment-view"/></li><li style="display:none">like</li></ul>';
                        commentHtml += '</div>';
                        commentHtml += '</div>';
                        commentHtml += '</div>';
                        commentHtml += '</div>';
                        commentHtml +='</li>';
                    }
                }
                commentHtml += '</ul>';
            }
            
            $('.commentDataListView').html(commentHtml);
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