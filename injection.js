var GENESIS=[];
var issending=1;
var t1=Date.now();
var t2=Date.now();
var sul=0;
var dalokili=0;
var RelExp=0;
var Timer;
var previd;
var QDquestion=[];
var QDdalokili=0;
var REquestion=[];
var cincxdalokili=0;
var my_classname="sc-feUZmu enEeii";
var my_button;

function lock_question(id,i){
	var url="https://professional-secure.justanswer.com/api/qaapi/lockquestion/"+String(id)+"?pro-lang=en";
	let data={"QuestionId":String(id),"LockDuration":1,"Purpose":1};
	let res=fetch(url,{method:"POST",headers:{"Content-Type":"application/json",},body:JSON.stringify(data),})
		.then(x=>{
			console.log(x);
			console.log("YLE-"+String(i)+"---"+String(id));
			if(i=="Meore"){clearTimeout(Timer);
			issending=1}}
		);
	console.log("WUWU-"+String(i)+"---"+String(id))
};

function lock_if(id,l,o){
	if(!(GENESIS.includes(id))&&(l=="QuestionDataCalculated"||l=="LockReleased"||l=="LockExpired")&&issending==1&&o[0].IsHiddenForYou==false){
		if(l=="QuestionDataCalculated"){
			sul=sul+1;
			QDquestion.push(id)
		};
		if(l=="LockReleased"||l=="LockExpired"){
			RelExp=RelExp+1;
			REquestion.push(id)
		};
		t1=Date.now();
		lock_question(id,"Pirveli");
		issending=0;
		Timer=setTimeout(()=>{
			issending=1;
			console.log("timeout occured")},3000
		);
		previd=id
	}

	else if(l=="LockAcquired"){
			if(o[0].IsLockedByYou){
				if(QDquestion.includes(id)&&!REquestion.includes(id)){cincxdalokili=cincxdalokili+1};
				t2=Date.now();
				console.log("Delta Time:",t2-t1);
				lock_question(id,"Meore")}
			else{if(o[0].ExternalQuestionID==previd){
				clearTimeout(Timer);
				issending=1;
			}
		}
	}
	else if(((l=="LockReleased")||(l=="LockExpired"))&&(o[0].IsHiddenForYou==false)&&(!(GENESIS.includes(id))))
	{RelExp=RelExp+1}
};
	
function is_locked(type,id){
	if(type=="QUESTION_LOCKED"){
		if(!(GENESIS.includes(id))){
			dalokili=dalokili+1;
			if(QDquestion.includes(id)){
				QDdalokili=QDdalokili+1
			};
			console.log("1. beep is running!!!!-----------------");
			beep(400,240,100);

			console.log("locked questions id : ", id);

			GENESIS.push(id);
			my_click(my_classname);
		}
	}
};

function my_click(classname){
	my_button=document.getElementsByClassName(classname)[0];
	if(my_button.textContent=="My questions"){my_button.click()}
};

const myAudioContext=new AudioContext();

function beep(duration,frequency,volume){
	return new Promise((resolve,reject)=>{
			let oscillatorNode=myAudioContext.createOscillator();
			let gainNode=myAudioContext.createGain();

			oscillatorNode.connect(gainNode);
			oscillatorNode.frequency.value=frequency;
			oscillatorNode.type="square";gainNode.connect(myAudioContext.destination);

			gainNode.gain.value=volume*0.01;

			oscillatorNode.start(myAudioContext.currentTime);
			oscillatorNode.stop(myAudioContext.currentTime+duration*0.001);
			oscillatorNode.onended=()=>{resolve();};
		}
	);
};

function windows_notification(content){
	if (!("Notification" in window)) {
		console.log("This browser does not support desktop notification");
	  }
	  
	  // Let's check whether notification permissions have already been granted
	  else if (Notification.permission === "granted") {
		// If it's okay let's create a notification
		var notification = new Notification(content);
	  }
	  
	  // Otherwise, we need to ask the user for permission
	  else if (Notification.permission !== 'denied' || Notification.permission === "default") {
		Notification.requestPermission(function (permission) {
		  // If the user accepts, let's create a notification
		  if (permission === "granted") {
			var notification = new Notification(content);
		  }
		});
	  }
}

function log_statistics(){
	console.log("Sul:"+String(sul)+
	",dalokili:"+String(dalokili)+
	",RelExp:"+String(RelExp)+
	",QDdalokili:"+String(QDdalokili)+
	",cincxdalokili:"+String(cincxdalokili))
};