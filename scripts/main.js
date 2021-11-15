const ui = require("ui-lib/library");

var dialog = null, button = null;
var playerPicked = "";
var reason = "";

// General report function
function report() {
	Call.sendChatMessage("/report "+Strings.stripColors(playerPicked.replace(/ /g,"/_"))+" "+reason);
	Vars.ui.showInfoToast("Report sent! If the chat shows an\nerror, you may have to try again.", 6.5);
	dialog.hide();
}

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

			list.row()

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
	}).width(256).get();

	table.row();

	/* button moment */
	function cnrDialog(){
		dialog.hide();
		Timer.schedule(updateDialog,0.05);
	}
	dialog.addCloseButton().width(300);
	dialog.buttons.button("Report", Icon.admin, report).width(300);
});

}

updateDialog();

ui.addButton("quick-report", Items.blastCompound, () => {
	if (!Vars.net.client()) {
		Vars.ui.showInfoToast("how are you going to report bro", 5);
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