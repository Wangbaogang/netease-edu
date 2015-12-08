//解决ff不兼容innerText属性的问题
(function(){
	if (window.navigator.userAgent.indexOf("Firefox")>0) {
		HTMLElement.prototype.__defineGetter__("innerText",function(){
			return this.textContent;
		});
		HTMLElement.prototype.__defineSetter__("innerText",function(s){
			this.textContent=s;
		});
	};
})();
var $=function(id){
	return document.getElementById(id);
};
var getByClass=function(element,names){
    if(element.getElementsByClassName){
        return element.getElementsByClassName(names);
    }else{
        var all_nodes=element.getElementsByTagName('*');
        var new_arr=[];
        names=names.split(" ");
        var para;
        var nodei;
        for(var i=0;i<all_nodes.length;i++){
            nodei=all_nodes[i];
            var nodeStr=' '+all_nodes[i].className+' ';
            para=true;
            for(var j=0;j<names.length;j++){
                var name=' '+names[j]+' ';
                if(nodeStr.indexOf(name)==-1){
                    para=false;
                    break;
                }
            }
            if(para){
                new_arr.push(nodei);
            }
        }
        return new_arr;
    }
 }
//将事件相关方法存放到对象字面量中
var eventUtil={
	getTarget:function(event){
		return event.target||event.srcElement;
	},
	addEvent:function(elem,type,listener){
		if (elem.addEventListener) {
			return elem.addEventListener(type,listener,false);
		}else{
			return elem.attachEvent("on"+type,listener);
		}
	},
	removeEvent:function(elem,type,listener){
		if (elem.removeEventListener) {
			return elem.removeEventListener(type,listener,false);
		}else{
			return elem.detachEvent("on"+type,listener);
		}
	}
};
//将数据相关方法存放到对象字面量中
var dataUtil={
	getCookie:function(){
		var thisCookie={};
		var str=document.cookie;
		if (str=="") {return thisCookie};
		var arr=str.split("; ");
		var n,v,a;
		for (var i = 0; i <arr.length; i++) {
			a=arr[i].split("=");
			n=decodeURIComponent(a[0]);
			v=decodeURIComponent(a[1]);
			thisCookie[n]=v;
		};
		return thisCookie;
	},
	setCookie:function(name,value,expires,path,domain,secure){
		var cookie=encodeURIComponent(name)+"="+encodeURIComponent(value);
		if (expires) {//将日期对象转换为字符串
			cookie+="; expires="+expires;
			}
		if (path) {cookie+="; path="+path};
		if (domain) {cookie+="; domain="+domain};
		if (secure) {cookie+="; secure="+secure};
		document.cookie=cookie;

	},
	getAjax:function(url,options,callback){
		var xhr;
		if (window.XMLHttpRequest) {
			xhr=new XMLHttpRequest();
		}else{
			xhr=new ActiveXObject("Microsoft.XMLHTTP")
		};
		xhr.onreadystatechange=function(){
			if (xhr.readyState==4) {
				if (xhr.status==200) {
					callback(xhr.responseText);
				}
			}
		}
		xhr.open("get",url+"?"+dataUtil.serialize(options),true);
		xhr.send(null);
	},
	getDataset:function(elem){
	    if(elem.dataset){
	      	return elem.dataset;
	    }
	    var datas = {};
	    var attrs = elem.attributes;
	    var nodeName,nodeNames;
	    for(var i = 0,attr;attr = attrs[i];i++){
	      	nodeName = attr.nodeName;
	      	if(nodeName.indexOf('data-')!==-1){
	        nodeNames = nodeName.slice(5).split("-");
	        nodeName = nodeNames[0];
	    } else{
	        continue;
	    }
	    for(var j=1;j<nodeNames.length;j++){
	        nodeName += nodeNames[j].slice(0,1).toUpperCase + nodeNames[j].slice(1);
	    }
	      	datas[nodeName] = attr.nodeValue;
	      	return datas;
	    }
	},
	serialize:function(data){
        if(!data) return '';
        var pairs = [];
        for(var name in data){
            if(!data.hasOwnProperty(name)) continue;
            if(typeof data[name]==='function') continue;
            var value = data[name].toString();
            name = encodeURIComponent(name);
            value = encodeURIComponent(value);
            pairs.push(name+'='+value);
        }
        return pairs.join('&');
    },
    //读取课程(添加至tab区)
    readCourse:function(str,bdElem,btnElem){
    	var obj=JSON.parse(str);
    	bdElem.innerHTML="";
    	var index=obj.pagination.pageIndex,
    	size=obj.pagination.pageSize,
    	total=obj.pagination.totlePageCount;
		for(var i=0;i<20;i++){
    		if (obj.list[i]) {
    			var oDiv=document.createElement("div");
    			oDiv.className="c-course-cn";
    			oDiv.innerHTML="<div class='c-course-img'><img src='' width='223' height='124'/></div><p class='c-course-name'></p><p class='c-course-host'></p><div class='c-course-co'><span class='c-course-count'></span></div><p class='c-course-mo'>￥<span class='c-course-money'></span></p><div class='c-course-hvr'><img src='' width='223' height='124'/><h2 class='c-course-h2'></h2><p class='c-course-cnt'></p><p class='c-course-psn'></p><p class='c-course-cate'></p></div><div class='c-course-des'><p></p></div>";
				bdElem.appendChild(oDiv);
				getByClass(oDiv,"c-course-img")[0].children[0].src=obj.list[i].middlePhotoUrl;
    			getByClass(oDiv,"c-course-name")[0].innerText=obj.list[i].name;
    			getByClass(oDiv,"c-course-host")[0].innerText=obj.list[i].provider;
    			getByClass(oDiv,"c-course-count")[0].innerText=obj.list[i].learnerCount;
    			getByClass(oDiv,"c-course-money")[0].innerText=obj.list[i].price;
    			getByClass(oDiv,"c-course-hvr")[0].children[0].src=obj.list[i].middlePhotoUrl;
    			getByClass(oDiv,"c-course-h2")[0].innerText=obj.list[i].name;
    			getByClass(oDiv,"c-course-cnt")[0].innerText=obj.list[i].learnerCount;
    			getByClass(oDiv,"c-course-psn")[0].innerText="发布者 : "+obj.list[i].provider;
    			getByClass(oDiv,"c-course-cate")[0].innerText=obj.list[i].categoryName;
    			getByClass(oDiv,"c-course-des")[0].children[0].innerText=obj.list[i].description;
    			
			};
    	}
    },
    //读取课程(添加至流动列表)
    readRank:function(str,bdElem){
    	var obj=JSON.parse(str);
    	bdElem.innerHTML="";
    	for(var i=0;i<20;i++){
    		if (obj[i]) {
    			var oDiv=document.createElement("div");
    			oDiv.className="c-rank-cn";
    			oDiv.innerHTML="<img src='' width='50' height='50'><div class='c-rank-des'><p></p><span></span></div>";
				bdElem.appendChild(oDiv);
				oDiv.children[0].src=obj[i].middlePhotoUrl;
    			oDiv.getElementsByTagName("p")[0].innerText=obj[i].name;
    			oDiv.getElementsByTagName("span")[0].innerText=obj[i].learnerCount;
    		};
    	}
    },
    opt:function(pa,ps,ty){
		return{	
		pageNo:pa,
		psize:ps,
		type:ty
		}
	}
};
//操作节点属性的一些方法
var changeUtil={
	toNone:function(elem1,elem2){
		elem1.style.display="none";
   		elem2.style.display="none";		
	},
	toBlock:function(elem1,elem2){
		elem1.style.display="block";
		elem2.style.display="block";
		elem2.style.left=(document.documentElement.clientWidth-elem2.clientWidth)/2+"px";
		elem2.style.top=(document.documentElement.clientHeight-elem2.clientHeight)/2+"px";
	},
	//关注api
	toAtten:function(elem){
			elem.className="n-atten n-at-after";
			elem.children[0].style.display="inline";
			elem.children[1].textContent="已关注";
			elem.children[1].innerText="已关注";
	}
}
var index=0,timer;
var animaUtil={
	animaImage:function(elem1,elem2){//图片轮播&圆点变化
		var offs1=elem1.children;//图片
		var offs2=elem2.children;//按钮
		var step=function(){
			offs1[index].style.zIndex=0;
			offs2[index].style.backgroundColor="#fff"
			offs1[index].children[0].style.opacity=0;
			index<offs1.length-1?index+=1:index=0;
			offs1[index].style.zIndex=1;
			offs2[index].style.backgroundColor="#000"
			offs1[index].children[0].style.opacity=1.0;
		}
		timer=setInterval(step,5000);
	},
	animaMove:function(elem,attr,singleHi){
		elem.style.transitionProperty="top";
		elem.style.transitionTimingFunction="linear";
		elem.style.transitionDuration="1s"
		var moving=function(){
			elem.style[attr]=elem.style[attr]||0;
			elem.style.transitionProperty="top";
			elem.style[attr]=parseInt(elem.style[attr])-singleHi+"px";
			if(elem.style[attr]=="-1400px"){
				elem.style.transitionProperty="none";
				elem.style[attr]="0";
			}
		}
		setInterval(moving,5000);
	}
};
//检查cookie是否存在
	function checkCookie(){
		var mycookie=dataUtil.getCookie();
		if(mycookie.closed=="alreadyColsed"){
			$("g-notice").style.display="none";
		};
		if(mycookie.followSuc=="follow" && mycookie.loginSuc=="login") {
			changeUtil.toAtten($("n-atten"));
		};
	}
	checkCookie();
//onload执行
window.onload=function(){
	//关闭通知条
	eventUtil.addEvent($("g-close"),"click",function(){
		$("g-notice").style.display="none";
		var myDate=new Date().setDate(60);
		var	expires=new Date(myDate);
		dataUtil.setCookie("closed","alreadyColsed",expires);
	});
	// 点击关注按钮
	$("n-atten").onclick=function(){
		var mycookie=dataUtil.getCookie();
		if (mycookie.loginSuc=="login") {
			dataUtil.getAjax("http://study.163.com/webDev/attention.htm","",function(str){
				if (parseInt(str)==1) {
					changeUtil.toAtten($("n-atten"));
					$("n-atten").onclick=null;
					var myDate=new Date().setDate(60);
					var	expires=new Date(myDate);
					dataUtil.setCookie("followSuc","follow",expires);
				}
			});
		}else{
			changeUtil.toBlock($("h-hidden"),$("h-login"));
		};
	};
	//关闭登录框
	eventUtil.addEvent($("h-close"),"click",function(){
		changeUtil.toNone($("h-hidden"),$("h-login"));
	});
	//input
	eventUtil.addEvent($("h-aco"),"input",function(){
		if ($("h-aco").value!=="") {
			$("h-aco-la").innerText="";
		};
	});
	eventUtil.addEvent($("h-pas"),"input",function(){
		if ($("h-pas").value!=="") {
			$("h-pas-la").innerText="";
		};
	});
	//onblur
	eventUtil.addEvent($("h-aco"),"blur",function(){
		if ($("h-aco").value==="") {
			$("h-aco-la").innerText="帐号";
		};
		if ($("h-aco").value!=="") {
			$("h-aco").style.borderColor="";
		};

	});
	eventUtil.addEvent($("h-pas"),"blur",function(){
		if ($("h-pas").value==="") {
			$("h-pas-la").textContent="密码";
		};
		if ($("h-pas").value!=="") {
			$("h-pas").style.borderColor="";
		};

	});
	//提交表单
	eventUtil.addEvent($("h-btn"),"click",function(){
		if ($("h-aco").value==="") {
			$("h-aco").style.borderColor="red";
		}else if ($("h-pas").value==="") {
			$("h-pas").style.borderColor="red";
		}else{
			var options={
				userName:hex_md5($("h-aco").value),
				password:hex_md5($("h-pas").value)
			}
		var callback=function(str){
				if (str=="0") {
					alert("帐号或密码错误！")
				}else if(parseInt(str)==1){
					var myDate=new Date().setDate(60)
					var expires=new Date(myDate);
					dataUtil.setCookie("loginSuc","login",expires);
					changeUtil.toNone($("h-hidden"),$("h-login"));	
					dataUtil.getAjax("http://study.163.com/webDev/attention.htm","",function(str){
						if (parseInt(str)==1) {
							changeUtil.toAtten($("n-atten"));
							$("n-atten").onclick=null;
							var myDate=new Date().setDate(60);
							var	expires=new Date(myDate);
							dataUtil.setCookie("followSuc","follow",expires);
						}
					});
   				}
   			}
			dataUtil.getAjax("http://study.163.com/webDev/login.htm",options,callback);
		}
	});
	//轮播图
	animaUtil.animaImage($("p-images"),$("p-btn"));
	eventUtil.addEvent($("p-parent"),"mouseover",function(){
		clearInterval(timer);
	});
	eventUtil.addEvent($("p-parent"),"mouseout",function(){
		animaUtil.animaImage($("p-images"),$("p-btn"));
	});
	eventUtil.addEvent($("p-btn"),"click",function(e){
		e=e||event||window.event;
		if (eventUtil.getTarget(e)==e.currentTarget||eventUtil.getTarget(e).style.backgroundColor=="#000") {return;};
		$("p-images").children[index].style.zIndex=0;
		eventUtil.getTarget(e).parentNode.children[index].style.backgroundColor="#fff";
		$("p-images").children[index].children[0].style.opacity=0;
		index=parseInt(dataUtil.getDataset(eventUtil.getTarget(e)).index);
		$("p-images").children[index].style.zIndex=1;
		eventUtil.getTarget(e).style.backgroundColor="#000";
		$("p-images").children[index].children[0].style.opacity=1;
	});
	//video播放
	eventUtil.addEvent($("c-video"),"click",function(){
		changeUtil.toBlock($("h-hidden"),$("h-vdcner"));
		$("vdpl").play();
	});
	eventUtil.addEvent($("h-close2"),"click",function(){
		changeUtil.toNone($("h-hidden"),$("h-vdcner"));
		$("vdpl").pause();
	});
	//获取课程列表
	function edge(){
		if (getByClass(document,"c-pages")[0].children[1].dataset.page=="1")
			{$("c-to-left").style.backgroundColor="#ddd";}
		else{$("c-to-left").style.backgroundColor="#9dd8b1";}
	}
	dataUtil.getAjax("http://study.163.com/webDev/couresByCategory.htm",dataUtil.opt(1,20,10),function(str){
		dataUtil.readCourse(str,$("c-course-bd"),getByClass(document,"c-pages")[0]);
		getByClass(document,"c-pages")[0].dataset.index=10;
		getByClass(document,"c-pages")[0].children[1].style.color="#39a030";
		getByClass(document,"c-pages")[0].children[1].dataset.page="1";
		edge();
	});
	dataUtil.getAjax("http://study.163.com/webDev/hotcouresByCategory.htm","",function(str){
		dataUtil.readRank(str,$("c-ranklist"));
		$("c-ranklist").innerHTML+=$("c-ranklist").innerHTML;
	});
	animaUtil.animaMove($("c-ranklist"),"top",70);
	//点击tab切换课程
	eventUtil.addEvent(getByClass(document,"c-tab")[0].children[0],"click",function(e){
		e=e||event||window.event;
		if(e.target.className=="c-tab-chk"){
			return;
		}else{
			e.target.parentNode.children[1].className="";
			e.target.className="c-tab-chk";
			var options=dataUtil.opt(1,20,10);
			dataUtil.getAjax("http://study.163.com/webDev/couresByCategory.htm",dataUtil.opt(1,20,10),function(str){
				dataUtil.readCourse(str,$("c-course-bd"));
			});
		getByClass(document,"c-pages")[0].dataset.index=10;
		}
		edge();
	});
	eventUtil.addEvent(getByClass(document,"c-tab")[0].children[1],"click",function(e){
		e=e||event||window.event;
		if(e.target.className=="c-tab-chk"){
			return;
		}else{
			e.target.parentNode.children[0].className="";
			e.target.className="c-tab-chk";
			var options=dataUtil.opt(1,20,20);
			dataUtil.getAjax("http://study.163.com/webDev/couresByCategory.htm",options,function(str){
				dataUtil.readCourse(str,$("c-course-bd"));
			});
		getByClass(document,"c-pages")[0].dataset.index=20;
		edge();
		}
	});
	//hover呈现课程详情
	eventUtil.addEvent($("c-course-bd"),"mouseover",function(e){
		e=e||event||window.event;
		if (e.target==e.currentTarget) {return;}
		else if(e.target.parentNode.parentNode==e.currentTarget){
			e.target.parentNode.children[5].style.display="block";
			e.target.parentNode.children[6].style.display="block";
		}else if (e.target.parentNode.parentNode.parentNode==e.currentTarget) {
			e.target.parentNode.parentNode.children[5].style.display="block";
			e.target.parentNode.parentNode.children[6].style.display="block";
		};
	});
	eventUtil.addEvent($("c-course-bd"),"mouseout",function(e){
		e=e||event||window.event;
		if (e.target==e.currentTarget) {return}
		else if (e.target.parentNode.parentNode==e.currentTarget) {
			e.target.parentNode.children[5].style.display="none";
			e.target.parentNode.children[6].style.display="none";
		}else if (e.target.parentNode.parentNode.parentNode==e.currentTarget) {
			e.target.parentNode.parentNode.children[5].style.display="none";
			e.target.parentNode.parentNode.children[6].style.display="none";
		};
	});
	//分页器
	eventUtil.addEvent(getByClass(document,"c-pages")[0],"click",function(e){
		e=e||event||window.event;
		if (e.target==e.currentTarget||!!e.target.dataset.page) {return};
		e.preventDefault();
		for(var i=1;i<e.currentTarget.children.length-1;i++){
			if (e.currentTarget.children[i].dataset.page) {
				e.currentTarget.children[i].style.color="#000";
				delete e.currentTarget.children[i].dataset.page;
				break;
			};
		}
		var index=parseInt(getByClass(document,"c-pages")[0].dataset.index);
		var options=dataUtil.opt(parseInt(e.target.innerText),20,index);
		dataUtil.getAjax("http://study.163.com/webDev/couresByCategory.htm",options,function(str){
				dataUtil.readCourse(str,$("c-course-bd"));
			});
		e.target.style.color="#39a030";
		e.target.dataset.page=parseInt(e.target.innerText);
		edge();
	});
	eventUtil.addEvent($("c-to-left"),"click",function(e){
		e=e||event||window.event;
		e.preventDefault();
		e.stopPropagation();
		var pageIndex;
		for(var i=1;i<e.target.parentNode.children.length-1;i++){
			if (e.target.parentNode.children[i].dataset.page) {
				pageIndex=parseInt(e.currentTarget.children[i].dataset.page);
				break;
			};
		}
		var index=parseInt(getByClass(document,"c-pages")[0].dataset.index);
		var options=dataUtil.opt(pageIndex,20,index);
		dataUtil.getAjax("http://study.163.com/webDev/couresByCategory.htm",options,function(str){
				dataUtil.readCourse(str,$("c-course-bd"));
			});
		edge();
	});
}