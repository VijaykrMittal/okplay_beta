var app = (function(global){
    
    var onDeviceReady = function()
    {
        window.connectionInfo = new ConnectionApp();
        networkStatus();
    };
    
    var networkStatus = function()
    {
      if(!window.connectionInfo.checkConnection()){
                navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
            	if (confirmed === true || confirmed === 1) {
            		networkStatus();
            	}

            }, 'Connection Error?', 'Retry,Cancel');
        }  
    };
    
    function ConnectionApp() {
	}
 
    ConnectionApp.prototype = { 	
    	checkConnection: function() {
    			if(typeof navigator.connection.type !== "undefined")
                {
                    var networkState = navigator.connection.type;
                    var states = {};
                    states[Connection.UNKNOWN] = 'Unknown connection';
                    states[Connection.ETHERNET] = 'Ethernet connection';
                    states[Connection.WIFI] = 'WiFi connection';
                    states[Connection.CELL_2G] = 'Cell 2G connection';
                    states[Connection.CELL_3G] = 'Cell 3G connection';
                    states[Connection.CELL_4G] = 'Cell 4G connection';
                    states[Connection.CELL] = 'Cell generic connection';
                    states[Connection.NONE] = 'No network connection';
                    if (states[networkState] === 'No network connection') {
                        return false;
                    }
                }
                
                return true;
    	},
        
    }
    document.addEventListener('deviceready', onDeviceReady, false);
    
    if(localStorage.getItem('loginStatus') === "true" || localStorage.getItem('loginStatus') === true)
    {
       // alert("true");
        var mobileApp = new kendo.mobile.Application(document.body,
                                                                {
                                                                    skin:'flat',
                                                                    initial:'views/homepage.html',
                                                                    layout:'login-layout'
                                                                }
        );
    }
    else
    {
        
       // alert("false");
        
        var mobileApp = new kendo.mobile.Application(document.body,
                                                                {
                                                                    skin:'flat',
                                                                    initial:'views/homepage.html',
                                                                    layout:'main-layout'
                                                                }
        );
    }
    
    localStorage.setItem("articleDetailAPI","http://okplay.club/mobileapi/article-detail");
    localStorage.setItem("articleListAPI","http://okplay.club/mobileapi/article-list");
    localStorage.setItem("allCategoryListAPI","http://okplay.club/mobileapi/allcategories");
    localStorage.setItem("slideshowListAPI","http://okplay.club/mobileapi/slideshow-list");
    localStorage.setItem("allAgesListAPI","http://okplay.club/mobileapi/all-ages-list");
    localStorage.setItem("userLoginAPI","http://okplay.club/mobileapi/userlogin");
    localStorage.setItem("searchDataAPI","http://okplay.club/mobileapi/searchdata");
    
    return{
      mobileApp : mobileApp
    };
}(window));