function get_title_tree(elem, resetId, idPrefix){
    resetId = typeof resetId !== 'undefined' ? resetId : false;
    idPrefix = typeof idPrefix !== 'undefined' ? idPrefix : "_toc_auto";
    var idCount = 0;
    function get_node_id(node){
        if(!resetId){
            return node.getAttribute('id')
        }
        else{
            idCount ++;
            var newId = idPrefix + idCount.toString()
            node.id = newId;
            return node.id
        }
    }
    var root = {info: ['H0', '', ''], children: []}
    var path = [root]
    for(var i=0; i<elem.childNodes.length;i++){
        node = elem.childNodes[i]
        if(node.tagName && /[hH][1-6]/.test(node.tagName.toUpperCase()) && node.getAttribute('id')){
            var currNode = path.pop()
            var newNode = {info: [node.tagName.toUpperCase(), node.textContent, get_node_id(node)],
                           children: []}
            while(currNode.info[0] >= newNode.info[0] && path.length > 0){
                currNode  = path.pop()
            }
            currNode.children.push(newNode)
            path.push(currNode)
            path.push(newNode)
        }
    }
    return root
}

function tree_to_dir(node){
    var html = ''
    if(node.children && node.children.length > 0){
        html += "\n<ul>"
        for(var i=0; i<node.children.length;++i){
            var child = node.children[i];
            html += "\n<li><a href='#" + child.info[2] + "'>"
            html += child.info[1] + "</a>"
            html += tree_to_dir(child)
            html += "</li>\n"
        }
        html += "</ul>\n"
    }
    return html
}

function buildTowerDiv(){
    var cssElem = document.createElement('style');
    cssElem.type = 'text/css';
    cssElem.innerHTML = " "
    + "#_doc_toc_panel {position:fixed;top:30px;padding: 1em;left:30px;display:block;background-color:#eeeeee;font-size:0.8em;border-radius:5px;}"
    + "#_doc_toc {max-width:300px; max-height:800px;overflow: auto}"
    + "#_doc_toc_button b {font-size: 2em}"
    + "#_doc_toc ul {padding-left: 10px}"
    + "#_doc_toc li {padding-left: 5px; list-style-type: disc;list-style-position: inside;}"
    + "#_doc_toc li a {text-decoration: none}"

    var toc_button = document.createElement("div")
    toc_button.id = "_doc_toc_button"
    toc_button.innerHTML = "<b>&#9776;</b>"
    toc_button.onclick = function(){
        var toc_div = document.getElementById("_doc_toc");
        if(toc_div.style.display !== "none"){
            toc_div.style.display = "none";
        }
        else{
            toc_div.style.display = "block";
        }
    }
    var tree = get_title_tree(document.getElementsByClassName("doc-content")[0], true)
    var toc_div = document.createElement("div")
    toc_div.id = "_doc_toc"
    toc_div.innerHTML = tree_to_dir(tree)

    var toc_tip = document.createElement("div")
    toc_tip.innerHTML = "点击&nbsp;☰&nbsp;展开或折叠"

    var toc_panel = document.getElementById("_doc_toc_panel")
    if(!toc_panel){
        var toc_panel = document.createElement("div")
        toc_panel.id = "_doc_toc_panel"
    }
    else{
        toc_panel.remove()
    }
    toc_panel.innerHTML = ""

    toc_panel.appendChild(cssElem)
    toc_panel.appendChild(toc_button)
    toc_panel.appendChild(toc_div)
    toc_panel.appendChild(toc_tip)

    document.body.appendChild(toc_panel)
}

function hideDocToc(){
    var toc_panel = document.getElementById("_doc_toc_panel")
    if(toc_panel){
        toc_panel.remove()
    }
}

function bindDocNode(node){
    var observer = new WebKitMutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var l = mutation.target.classList
            if(l.contains("page") && l.contains("page-1") && l.contains("simple-pjax") && !l.contains("pjax-loading")){
                buildTowerDiv()
                observer.disconnect()
            }
        })
    })
    observer.observe(node, { attributes: true });
}

function bindTower(){
    var observer = new WebKitMutationObserver(function(mutations) {
        if(/(.*?)tower\.im\/projects\/(.*?)\/docs\/(.*?)\/([^e]|$)/.test(document.location.toString())){
            mutations.forEach(function(mutation) {
    	        for (var i = 0; i < mutation.addedNodes.length; i++)
    	           var node = mutation.addedNodes[i]
                   if(node.classList.contains("page") && node.classList.contains("page-1") && node.classList.contains("simple-pjax")) {
                       bindDocNode(node)
                   }
                })
        }
        else{
            hideDocToc()
        }
    });
    observer.observe(document.getElementsByClassName("container workspace")[0], { childList: true });
}

bindTower()
if(/(.*?)tower\.im\/projects\/(.*?)\/docs\/(.*?)\/([^e]|$)/.test(document.location.toString())){
    buildTowerDiv()
}
