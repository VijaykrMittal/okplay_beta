var app = (function(global){
    
    /*var onBackKeyDown = function()
    {
        alert(mobileApp.view()['element']['0']['id']);
    };*/
    
    var onDeviceReady = function()
    {
       // console.log(window.device.model);
        sessionStorage.setItem("iosDeviceType",window.device.model);
      // alert(window.screen.width);
        window.connectionInfo = new ConnectionApp();
        //window.camera = new cameraFunction(); 
        //document.addEventListener('backbutton', onBackKeyDown, false);
        window.connectionInfo.checkConnection()
        //sessionStorage.setItem('internetStatus',window.connectionInfo.checkConnection());
       // networkStatus();
        facebookFunctionCall();
    };
    
    var facebookFunctionCall = function()
    {
      try
        {
           FB.init({
            appId:"828834967202957",
            status:"false",
            nativeInterface: CDV.FB,
            useCachedDialogs: false
           }); 
        }
        catch(ex)
        {
            console.log(ex.messgae);
        }  
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
    
    function ConnectionApp(){}
 
    ConnectionApp.prototype = {
        checkConnection:function()
        {
            if (typeof navigator.connection.type !== "undefined") {
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
                if (states[networkState] === 'No network connection')
                {
                    return false;
                }
            }
            return true;
        }
    }
    
    function cameraFunction(){}
    
    cameraFunction.prototype = {
        
        captureCamera:function()
        {
            var that = this;
            try
            {
                navigator.camera.getPicture(that.cameraSuccess,that.cameraError,{
                    quality:50,
                    destinationType:Camera.DestinationType.DATA_URL,
                    sourceType:Camera.PictureSourceType.CAMERA,
                    encodingType:Camera.EncodingType.JPEG
                });
            }
            catch(e)
            {
                alert(e.message);
            }
        },
        
        cameraSuccess:function(imageData)
        {
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageData;
            localStorage.setItem("userImage",imageData);
        },
        
        cameraError:function(message)
        {
            navigator.notification.alert("Camera Capture "+message,function(){},"Image/Upload Failed","OK");
        },
        
        gallery:function()
        {
            var that = this;
            try
            {
                navigator.camera.getPicture(that.gallerySuccess,that.galleryError,{
                quality:50,
                destinationType:Camera.DestinationType.DATA_URL,
                sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType:Camera.EncodingType.JPEG
                });
            }
            catch(e)
            {
                alert(e.message);
            }
        },
        
        gallerySuccess:function(imageData)
        {
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageData;
            localStorage.setItem("userImage",imageData);
        },
        
        galleryError:function(messsage)
        {
            navigator.notification.alert("Gallery "+messsage,function(){},"Image/Upload Failed","OK");
        }
    }
    
    document.addEventListener('deviceready', onDeviceReady, false);
   
    var mobileApp = new kendo.mobile.Application(document.body,
                                                            {
                                                                skin:'flat',
                                                                initial:'views/homepage.html',
                                                                layout:'main-layout'
                                                            }
    );
    
    localStorage.setItem("articleDetailAPI","http://okplay.club/mobileapi/article-detail");
    localStorage.setItem("articleListAPI","http://okplay.club/mobileapi/article-list");
    localStorage.setItem("allCategoryListAPI","http://okplay.club/mobileapi/allcategories");
    localStorage.setItem("slideshowListAPI","http://okplay.club/mobileapi/slideshow-list");
    localStorage.setItem("allAgesListAPI","http://okplay.club/mobileapi/all-ages-list");
    localStorage.setItem("userLoginAPI","http://okplay.club/mobileapi/userlogin");
    localStorage.setItem("searchDataAPI","http://okplay.club/mobileapi/searchdata");
    localStorage.setItem("userSignupAPI","http://okplay.club/mobileapi/usersignup/");
    localStorage.setItem("homePageBlockAPI","http://okplay.club/mobileapi/homepageblocks");
    localStorage.setItem("footerContentAPI","http://okplay.club/mobileapi/basicpagedata");
    localStorage.setItem("contactusAPI","http://okplay.club/mobileapi/savecontactus");
    localStorage.setItem("commentAPI","http://okplay.club/mobileapi/savecommentdata");
    localStorage.setItem("forgotpasswordAPI","http://okplay.club/mobileapi/forgotpass");
    return{
      mobileApp : mobileApp
    };
}(window));