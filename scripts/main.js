const ui = require("ui-lib/library");

var dialog = null, button = null;
var playerPicked = "";
var reason = "";
const defHeight = 70;

// Close dialog function
function hideDialog(){
	dialog.hide();
}

// Resize UI function
function resize(UiObj,sx,sy){
	UiObj.width(sx);
	UiObj.height(sy);
}

// General command function
function sendCommand(co) {
	Call.sendChatMessage("/"+co+" "+Strings.stripColors(playerPicked.replace(/ /g,"/_"))+" "+reason);
	Vars.ui.showInfoToast("Done! If the chat shows an\nerror, you may have to try again.", 6.5);
	dialog.hide();
}

// Child functions
function report(){sendCommand("report")}
function warn(){sendCommand("warn")}
function kick(){sendCommand("kick")}
function ban(){sendCommand("ban")}

// Update the dialog with a new one.
function updateDialog(){

ui.onLoad(() => {
	dialog = new BaseDialog("Quick Report Menu");
	var table = dialog.cont;

	table.label(() => playerPicked);
	table.row();

	table.pane(list => {
		const plrs = Groups.player;
		var i = 0;
		plrs.each(plr => {

			if (i++ % 2 == 0) {
				list.row();
			}

			list.button(plr.name, () => {
				playerPicked = plr.name;
			}).width(350);
		});
	}).top().center();
	table.row();

	const r = table.table().center().bottom().get();
	var rField;
	r.add("Reason: ");
	rField = r.field("", text => {
		reason = text;
	}).width(325).get();

	table.row();

	/* button moment */
	function cnrDialog(){
		dialog.hide();
		Timer.schedule(updateDialog,0.05);
	}
	resize(dialog.buttons.button("Close", Icon.left, hideDialog), 125, defHeight);
	resize(dialog.buttons.button("Report", Icon.export, report), 150, defHeight);
	if(Vars.player.admin){ // Buttons for admins exclusively.
		resize(dialog.buttons.button("[yellow]Warn", Icon.add, warn), 120, defHeight);
		resize(dialog.buttons.button("[scarlet]Kick", Icon.cancel, kick), 100, defHeight);
		resize(dialog.buttons.button("[brick]Ban", Icon.hammer, ban), 100, defHeight);
	}
});

}

ui.addButton("quick-report", Items.blastCompound, () => {
	if (!Vars.net.client()) if(!Vars.player.admin){
		Vars.ui.showInfoToast("I don't think you need the menu when\n you're by yourself.", 5);
		return;
	}
	
	updateDialog();

	dialog.show();
}, b => {button = b.get()});

var inServer = false;

/* May prove useful in the future.
function autoUpdate(){
	if(Vars.net.client()) if(!inServer){inServer=true; updateDialog()};
	if(!Vars.net.client()) if(inServer) inServer=false;
	
	Timer.schedule(autoUpdate,0.1);
}

autoUpdate();
*/