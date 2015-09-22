(function(global){
    var mainArticleViewModel,
        app = global.app = global.app || {};
    var replyBindingValue,rootCommentBindingValue;
    
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
            $(".km-native-scroller").scrollTop(0);
            app.mainArticleService.viewModel.articleDetailAPI(sessionStorage.getItem("catNodeId"));
            
            rootCommentBindingValue = kendo.observable({
                rootCommentdata: '',
            });

            kendo.bind($('#rootForm'), rootCommentBindingValue);
            
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
            
            parentArray = [];
            if(data.length === 0)
            {
                commentHtml ='<h4>There are no comments</h4>';
            }
            else
            {
                commentHtml = '<ul>';
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
                            //var className = 'root-'+i;
                            var className = 'root-1';
                            
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
                        commentHtml += '<div class="'+className+'" id="rootId'+data[x]['cid']+'">';
                        commentHtml += '<div class="leftDv">';
                        commentHtml += '<ul><li><img src="styles/images/user-face.png" class="imgcls"/></li><li><span>'+username+'</span></li></ul>';
                        commentHtml += '</div>';
                        commentHtml += '<div class="rightDv">';
                        commentHtml += '<div class="innerDv">';
                        commentHtml += '<div class="commentTxt">'+data[x]['subject']+'</div>';
                        commentHtml += '<div class="creatDv">';
                        commentHtml += '<span>'+date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+tempHours+':'+date.getMinutes()+' '+mid+'</span>';
                        commentHtml += '<ul><li class="repli"><input type="button" class="replycls" data-cid="'+data[x]['cid']+'" data-role="button" value="Reply" data-rel="modalview" href="#comment-view"/></li><li style="display:none">like</li></ul>';
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
            app.categoryService.viewModel.shareMessageAndURL(sessionStorage.getItem('catNodeId'),sessionStorage.getItem('cattitle'),"The Message");
        },
        
        modalViewOpen:function(e)
        {
            e.preventDefault();
            sessionStorage.setItem('replyPID',e['target']['context']['attributes']['data-cid'].value);
            
            if(app.homeService.viewModel.loginStatus === false || app.homeService.viewModel.loginStatus === 'false' || app.homeService.viewModel.loginStatus === null || app.homeService.viewModel.loginStatus === 'null')
            {
                navigator.notification.confirm('For comment post you need to login first.', function (confirmed) {
                	if (confirmed === true || confirmed === 1) {
                		app.mobileApp.navigate("views/login.html");
                	}
                }, 'Notification', 'Ok,Cancel');
            }
            else
            {
                $("#comment-view").kendoMobileModalView("open");
                replyBindingValue = kendo.observable({
                replycommentdata: '',
                });

                kendo.bind($('#replyForm'), replyBindingValue);
            }
        },
        
        postReplyComment : function()
        {
            if(app.homeService.viewModel.loginStatus === false || app.homeService.viewModel.loginStatus === 'false' || app.homeService.viewModel.loginStatus === 'null' || app.homeService.viewModel.loginStatus === null)
            {
                navigator.notification.confirm('For comment post you need to login first.', function (confirmed) {
                	if (confirmed === true || confirmed === 1) {
                		app.mobileApp.navigate("views/login.html");
                	}
                }, 'Notification', 'Ok,Cancel');
            }
            else
            {
                if(replyBindingValue.replycommentdata === "")
                {
                    navigator.notification.alert("Please enter your comment.",function () { }, "Notification", 'OK');
                }
                else
                {
                    dataParam = [];
                    dataParam['commentdata'] = replyBindingValue.replycommentdata;
                    dataParam['nid'] = sessionStorage.getItem('catNodeId');
                    dataParam['pid'] = sessionStorage.getItem('replyPID');
                    dataParam['cid'] = 0;
                    dataParam['userid'] = localStorage.getItem('userid');
                    dataParam['apiaction'] = 'savecommentdata';
                    /*alert("subject : "+dataParam['commentData']);
                    alert("nodeId : "+dataParam['nodeId']);
                    alert("pid : "+dataParam['pid']);
                    alert("cid : "+dataParam['cid']);
                    alert("userid : "+dataParam['userid']);
                    app.mainArticleService.viewModel.show();*/
                    app.mainArticleService.viewModel.commentRootReply(dataParam);
                    console.log(dataParam);
                    $("#comment-view").kendoMobileModalView("close");
                }
            }
        },
        
        postRootComment :function()
        {
            if(app.homeService.viewModel.loginStatus === false || app.homeService.viewModel.loginStatus === 'false' || app.homeService.viewModel.loginStatus === 'null' || app.homeService.viewModel.loginStatus === null)
            {
                navigator.notification.confirm('For comment post you need to login first.', function (confirmed) {
                	if (confirmed === true || confirmed === 1) {
                		app.mobileApp.navigate("views/login.html");
                	}
                }, 'Notification', 'Ok,Cancel');
            }
            else
            {
                if(rootCommentBindingValue.rootCommentdata === "")
                {
                    navigator.notification.alert("Please enter your comment.",function () { }, "Notification", 'OK');
                }
                else
                {
                    dataParam = [];
                    dataParam['commentdata'] = rootCommentBindingValue.rootCommentdata;
                    dataParam['nid'] = sessionStorage.getItem('catNodeId');
                    dataParam['pid'] = 0;
                    dataParam['cid'] = 0;
                    dataParam['userid'] = localStorage.getItem('userid');
                    dataParam['apiaction'] = 'savecommentdata';
                    app.mainArticleService.viewModel.commentRootReply(dataParam);
                    /*alert("subject : "+dataParam['commentData']);
                    alert("nodeId : "+dataParam['nodeId']);
                    alert("pid : "+dataParam['pid']);
                    alert("cid : "+dataParam['cid']);
                    alert("userid : "+dataParam['userid']);
                    app.mainArticleService.viewModel.show();*/
                    console.log(dataParam);
                }
            }
        },
        
        commentRootReply : function(data)
        {
            console.log(data);
            app.mobileApp.showLoading();
            var commentPost = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: localStorage.getItem('commentAPI'),
                        type:"POST",
                        dataType: "json", 
                        data: data
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
            commentPost.fetch(function(){
                var data = this.data();
                console.log(data);
                if(data[0]['code'] === 1 || data[0]['code'] === '1')
                {
                    app.mainArticleService.viewModel.show();
                }
                else
                {
                    navigator.notification.alert('Server not responding properly,Please try again',function(){},"Notification","OK");
                }
            });
        }
    });
    app.mainArticleService = {
        viewModel : new mainArticleViewModel()
    };
})(window);