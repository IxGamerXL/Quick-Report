const ui = require("ui-lib/library");

var dialog = null, plist = null, button = null;
var wasAdmin = null, plrCount = NaN;
var playerPicked = "";
var reason = "";

// Close dialog function
function hideDialog(){
	dialog.hide();
}

// Resize UI function
function resize(UiObj,sx,sy){
	UiObj.width(sx);
	UiObj.height(sy);
}

// Translate Player function
function translatePlr(){
	return Strings.stripColors(playerPicked.replace(/ /g,"/_"))
}

// General command with reason param
function sendCommand(co,params){
	var sp = "";
	var pc = "";
	var cc = ("/"+co).length;
	params.forEach((p,i) => {
		sp += " "+p;
		pc += "\nParam #"+(i+1)+" Length: "+p.length+"\n"+p+"\n";
		cc += (" "+p).length;
	});
	pc += "\nTotal characters used: "+cc+"/150";
	if(cc>150) pc += "\n[scarlet]Character limit exceeded!";
	
	try{
		Call.sendChatMessage("/"+co+sp);
		Vars.ui.showInfoToast("Done! If the chat shows an error,\nyou may have to try again.", 6.5);
		dialog.hide();
	}catch(err){
		Log.warn("[Quick Report] Couldn't send message: [cyan]/"+co+sp+"[]. The [yellow]"+co+"[] command may have exceeded the 150 character limit.\n"+pc);
		Vars.ui.showText("Could not submit command.","While attempting to send the [yellow]"+co+"[] command, it caused an error, likely because of the 150 char limit.\n"+pc);
	}
}

// Child functions
function report(){sendCommand("report", [translatePlr(), reason])}
function warn(){sendCommand("warn", [translatePlr(), reason])}
function kick(){sendCommand("kick", [translatePlr(), reason])}
function ban(){sendCommand("ban", [translatePlr(), reason])}
function info(){sendCommand("info", [translatePlr()])}

// Update the dialog with a new one.
function updateDialog(){

ui.onLoad(() => {
	dialog = new BaseDialog("Quick Report Menu");
	var table = dialog.cont;
	
	table.label(() => playerPicked+"\n");
	table.row();
	
	// I will no longer suffer trying to keep it updated.
	table.pane(list => {plist=list}).top().center();
	table.row();
	
	const r = table.table().center().bottom().get();
	var rField;
	r.add("Reason: ");
	rField = r.field(reason, text => {
		reason = text;
	}).width(350).get();
	if(Vars.mobile) r.button("Input", () => {
		Vars.ui.showTextInput("Enter reason:","",100,reason, input => {
			reason = input;
			rField.text = reason;
		});
	}).width(75);
});

}

const upButtons = () => {
	dialog.buttons.clear();
	
	dialog.addCloseButton();
	dialog.buttons.button("Report", Icon.export, report);
	if(Vars.player.admin){ // Buttons for admins exclusively.
		dialog.buttons.button("[yellow]Warn", Icon.add, warn);
		dialog.buttons.row();
		dialog.buttons.button("[scarlet]Kick", Icon.cancel, kick);
		dialog.buttons.button("[brick]Ban", Icon.hammer, ban);
		dialog.buttons.button("[orange]Info", Icon.paste, info);
	}
}

updateDialog();

ui.addButton("quick-report", Items.blastCompound, () => {
	if (!Vars.net.client() & !Vars.player.admin){
		Vars.ui.showInfoToast("I don't think you need the menu\nwhen you're by yourself.", 5);
		return;
	}
	
	dialog.show();
}, b => {button = b.get()});

const getPlrCount = () => {
	var c = 0;
	Groups.player.each(() => {c++});
	return c;
}

const upPlayers = () => {
	plist.clear();
	
	const plrs = Groups.player;
	var i = 0;
	plrs.each(plr => {
		
		if (i++ % 2 == 0) {
			plist.row();
		}
		
		plist.button(plr.name, () => {
			playerPicked = plr.name;
		}).width(350);
	});
}

// More efficient and constant than refreshing per open.
const update = () => {
	if(Vars.state.isMenu()){
		plrCount = NaN;
		return;
	}
	
	if(plrCount !== getPlrCount()){
		plrCount = getPlrCount();
		upPlayers();
	}
	
	if(wasAdmin !== Vars.player.admin){
		wasAdmin = Vars.player.admin;
		upButtons();
	}
};

Events.on(Trigger, update);