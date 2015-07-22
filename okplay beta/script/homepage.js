var app = app || {};

app.homepage = (function(){
    'use strict';
    
    var categoryViewModel = (function(){
        
        var categoryDataSource = new kendo.data.DataSource({
            transport:{
                read:{
                    url:'script/category.json',
                    dataType:'json'
                }
            }
        });
        return{
            categorydrawerData:categoryDataSource
        };
    }());
    
    var homePageViewModel = (function(){
        
        var showDrawerText = kendo.observable({
            categoryName:'',
            listData:'',
            setDrawerTaskName : function(val)
            {
                var that = this;
                that.set("categoryName",val);
            },
            
            callAPi :function()
            {
                alert("callapi");
                console.log(categoryViewModel.categorydrawerData);
                this.set("listData",(categoryViewModel.categorydrawerData));
                console.log(this.get('listData'));
            }
        });
        
        var show = function(e)
        {
            $('#category-dropdown select').val(0);
            $('#age-dropdown select').val(0);
            $('[data-role="drawer"]').children().css("background-color","#373F4A");
            e.view.scroller.scrollTo(0, 0)
        };
        
        var drawerChildClick = function(e)
        {
            console.log(e);
            alert(e['target']['attributes']['data-id'].value);
            alert(e['target']['attributes']['data-value'].value);
            
            if(e['target']['attributes']['data-value'].value === "category")
            {
                $('#age-dropdown').css("display","block");
                $('#category-dropdown').css("display","none");
                
                showDrawerText.setDrawerTaskName(e['target']['attributes']['data-id'].value);
                showDrawerText.callAPi();
                app.mobileApp.navigate("#healthView");
            }
            
            if(e['target']['attributes']['data-value'].value === "age")
            {
                $('#category-dropdown').css("display","block");
                $('#age-dropdown').css("display","none");
                
                showDrawerText.setDrawerTaskName(e['target']['attributes']['data-id'].value);
                
                app.mobileApp.navigate("#healthView");
            }
        };
       
        return {
            showDrawerText:showDrawerText,
            categorydrawerData:categoryViewModel.categorydrawerData,
            drawerChildClick:drawerChildClick,
            show:show,
            listData:showDrawerText.listData
        };
    }());
    return homePageViewModel;
}());