$('#jsmind_container').height(document.documentElement.clientHeight-18);
var WARN = "#f0ad4e"
var INFO = "#5dc0de"
var NORMAL = "#000000"
function setMsg(content, flag){
	$('#msg').html(content);
	$('#msg').css({"color":flag});
}
var options = {
    container:'jsmind_container', 
    editable:true,               
    theme:'mytheme',
    support_html : true,
    layout:{
       hspace:10,          
       vspace:10,          
       pspace:13          
    },
    view:{hmargin:0, vmargin:200, line_width:1, line_color:'#555' },
};
var jm = new jsMind(options);

function init(){
	var mind = {
	    "meta":{"name":"my idea","author":"freeol.cn","version":"0.1"},
	    "format":"node_tree",
	    "data":{"id":"root","topic":"root node"}
	};
	jm.show(mind);
}

function add_node(){
    var selected_node = jm.get_selected_node(); // as parent of new node
    if(!selected_node){setMsg('Please select one node.', WARN);return false;}
    var nodeid = jsMind.util.uuid.newid();
    var topic = '* Node_'+nodeid.substr(0,5)+' *';
    jm.add_node(selected_node, nodeid, topic);
}

function remove_node(){
	var selected_node = jm.get_selected_node();
	if(!selected_node){setMsg('Please select one node.', WARN);return false;}
	if(selected_node.id == 'root'){setMsg("Can't delete root node.", WARN);return false;}
    var selected_id = selected_node.id;
    jm.remove_node(selected_id);
}

function save_file(){
    var mind_data = jm.get_data();
    var mind_name = mind_data.meta.name;
    var mind_str = jsMind.util.json.json2string(mind_data);
    jsMind.util.file.save(mind_str,'text/jsmind',mind_name+'.jm');
}

function open_file(){
    var file_input = document.getElementById('file_input');
    var files = file_input.files;
    if(files.length > 0){
        var file_data = files[0];
        jsMind.util.file.read(file_data,function(jsmind_data, jsmind_name){
            var mind = jsMind.util.json.string2json(jsmind_data);
            if(!!mind){
                jm.show(mind);
                setMsg(file_data.name, NORMAL)
            }else{
                setMsg("file is error.", WARN);
            }
        });
    }else{
		setMsg("please select a file", WARN);
    }
}

$(document).ready(function(){
  init();
  $(document).keydown(function(e){ 
	if (e.keyCode == 116) {
		e.preventDefault();
		return false;
	}
	if (e.keyCode == 83 && e.ctrlKey) {
		e.preventDefault();
		save_file();
	}
  }); 
  
  $('#file_input').on('change',function(){
  	var m = 'Are you sure?\n open the new file without save this file.';
    if(confirm(m)){
  		open_file();
  	}
  })
  
  $("#addNode").click(function(){
    add_node();
  });
  $("#delNode").click(function(){
  	var m = 'Are you sure?\ndel the node.';
    if(confirm(m)){
    	remove_node();
    }
  });
  $("#zoomOut").click(function(){
    jm.view.zoomOut();
  });
  $("#zoomIn").click(function(){
    jm.view.zoomIn();
  });
  $("#openMind").click(function(){
    open_file();
  });
  $("#saveMind").click(function(){
    save_file();
  });
  
  $("#newMind").click(function(){
  	var m = 'Are you sure?\n make new mind without save the file.';
  	if(confirm(m)){
    	window.location.reload();
   	}
  });
  
});

window.onbeforeunload=function(){
	var warning="are you sure?";
    return warning; 
}
window.onunload=function(){
	var warning="are you sure?";
	return warning; 
}

  
