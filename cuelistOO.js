autowatch = 1;

inlets = 1;
outlets = 2;

var cueNumber = -1; //cue number
var h = 0;
var metro = 60;
var advanceTask = new Task(mytask); // our main task
var tempo = 60/metro;
var del = 0;

setinletassist(0, "bang for counter");

function mytask(){
	bang();
}
mytask.local = 1; // prevent triggering the task directly from Max

/* Updates BPMs */
function bpm(x){
	c = x;
	T = 60/c;
}

/* Scaled delay by the BPMs multiplied by 1/4 coefficient */
function autoNext(del){
	var delT = del * tempo * 4000;
	advanceTask.schedule(delT);
}

function fade(x){
	var fadeT = x * tempo * 4000;
	return fadeT;
}

function bang(){
	cueNumber = cueNumber + 1;
	cuelist();
}

function inc(){
	cueNumber = cueNumber + 1;
}

function dec(){
	cueNumber = cueNumber - 1;
	cueRecall(cueNumber);
}

function cueRecall(x){		
	var cueCallList = cueCall[x];
	cueCallList = String(cueCallList);
	cueCallList = cueCallList.substring(9, cueCallList.indexOf('('));
	cueNumber = x - 1;
	outlet(1,cueCallList);
}

function cueName(x){
	cueRecall(cueNumber + 1);
	outlet(0 , x);
	
}

/* the class constructor */
function sendClass(){

	this.standby; /* if you implement your object in a poly~ this is useful in order to switch on and of the instance */
	this.gainIn; /* any of your max modules in general may need of a gain stage in input */
	this.gainOut; /* any of your max modules in general may need of a gain stage in output */

	this.send = function(x){
		 
		var receiver = this.receiver
		var obj = JSON.stringify(x);
		obj = obj.replace(/"/g,'');
		obj = obj.replace(/receiver/g,'');
		obj = obj.replace(/:/g,' ');
		obj = obj.replace(/{/g,'');
		obj = obj.replace(/}/g,'');
		messnamed(receiver, obj);
		 
	}
}
/////////////////////////////

/* Create your class here and add all the functionalities you need to extend with your object*/

var delay = new sendClass();
delay.receiver = "delay";
delay.feedback = 0;
delay.time = 0;

var cucu = new sendClass();
cucu.receiver = "cucu";

 function Init(){
	delay.gainIn = "1 1000";
	delay.gainOut = "1 1000 0 2000";
	delay.feedback = ".9 250";
	delay.standby = 1;
	delay.send(delay);
	cueName(arguments.callee.name);
}

/////////////////////////////////////////////////////////////////////////////////////////////////

 function Cue_1(){
	delay.gainIn = "1 1000";
	delay.gainOut = "1 1000 0 2000";
	delay.time = 1000;
	delay.feedback = ".9 250";
	delay.standby = 1;
	delay.send(delay);

	cueName(arguments.callee.name);
}

 function Cue_2(){
	cucu.gainIn = "1 100";
	cucu.send(cucu);

	delay.id = "delay";
	delay.gainIn = "10 100";
	delay.gainOut = "100 100";
	delay.time = 500;
	delay.feedback = ".25 1000";
	delay.standby = 1;
	delay.send(delay);
	
	autoNext(4/4); /* is a mtehod implemented in order to make the cuelist advance autonatically while you schedule successions */
	cueName(arguments.callee.name);
}

 function Cue_2_1(){
	cucu.gainIn = "0 1000";
	cucu.send(cucu);

	delay.id = "delay";
	delay.gainIn = "0 1000";
	delay.gainOut = "0 1000";
	delay.time = 150;
	delay.feedback = ".9 500";
	delay.standby = 1;
	delay.send(delay);

	cueName(arguments.callee.name);
}

 function Cue_3(){
	cucu.gainIn = "5 100";
	cucu.send(cucu);

	delay.id = "delay";
	delay.gainIn = "50 100";
	delay.gainOut = "150 100";
	delay.time = 50;
	delay.feedback = ".5 2000";
	delay.standby = 1;
	delay.send(delay);

	cueName(arguments.callee.name);
}

/* your actual cuelist in form of an array */

var cueCall = [Init,Cue_1,Cue_2,Cue_2_1,Cue_3];

function cuelist(){
	cueCall[cueNumber]();
}