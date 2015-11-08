(function(){
   function loadJs(jsPath){
      var head= document.getElementsByTagName('head')[0];
      var script= document.createElement('script');
      script.type= 'text/javascript';
      script.src= jsPath;
      head.appendChild(script);
   }

   function addLoadEvent(func) {
       var oldonload = window.onload;
       if (typeof window.onload != 'function') {
           window.onload = func;
       } else {
           window.onload = function() {
           if (oldonload) {
               oldonload();
           }
           func();
           }
       }
   }

	addLoadEvent(function(){
        if(/(.*)?tower\.im(.*)?/.test(document.location.toString())){
            loadJs(chrome.runtime.getURL("doc_toc/doc_toc.js"));
        }
	});
})();
