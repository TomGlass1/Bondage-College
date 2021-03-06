"use strict";
var PrivateBackground = "Private";
var PrivateVendor = null;
var PrivateCharacter = [];
var PrivateCharacterTypeList = ["NPC_Private_VisitorShy", "NPC_Private_VisitorHorny", "NPC_Private_VisitorTough"];

// Returns TRUE if a 
function PrivateIsCaged() { return (CurrentCharacter.Cage == null) ? false : true }

// Loads the private room vendor NPC
function PrivateLoad() {
	PrivateVendor = CharacterLoadNPC("NPC_Private_Vendor");
	PrivateVendor.AllowItem = false;
	if (PrivateCharacter.length == 0) {
		PrivateCharacter.push(Player);
		PrivateLoadCharacter(1);
		PrivateLoadCharacter(2);
		PrivateLoadCharacter(3);
	}
}

// Draw all the characters in the private room
function PrivateDrawCharacter() {

	// Defines the character position in the private screen
	var X = 1000 - PrivateCharacter.length * 250;
	var S = (PrivateCharacter.length == 4) ? 475 : 500;

	// For each character to draw
	for(var C = 0; C < PrivateCharacter.length; C++) {
		if (PrivateCharacter[C].Cage != null) DrawImage("Screens/Room/Private/CageBack.png", X + C * S, 0);
		DrawCharacter(PrivateCharacter[C], X + C * S, 0, 1);
		if (PrivateCharacter[C].Cage != null) DrawImage("Screens/Room/Private/CageFront.png", X + C * S, 0);
		if (LogQuery("Cage", "PrivateRoom")) DrawButton(X + 390 + C * S, 900, 90, 90, "", "White", "Icons/Cage.png");
	}
	
}

// Run the private room
function PrivateRun() {
	
	// The vendor is only shown if the room isn't rent
	if (LogQuery("RentRoom", "PrivateRoom")) {
		PrivateDrawCharacter();
		if (Player.Cage == null) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Shop.png");
		DrawButton(1885, 385, 90, 90, "", "White", "Icons/Dress.png");
		if (LogQuery("Wardrobe", "PrivateRoom")) DrawButton(1885, 505, 90, 90, "", "White", "Icons/Wardrobe.png");
	} else {
		DrawCharacter(Player, 500, 0, 1);
		DrawCharacter(PrivateVendor, 1000, 0, 1);
	}
	
	// Standard buttons
	if (Player.CanWalk() && (Player.Cage == null)) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");

}

// Checks if the user clicked on a cage button
function PrivateClickCage() {
	
	// Defines the character position in the private screen
	var X = 1000 - PrivateCharacter.length * 250;
	var S = (PrivateCharacter.length == 4) ? 475 : 500;

	// For each character, we find the one to cage
	for(var C = 0; C < PrivateCharacter.length; C++)
		if ((MouseX >= X + 390 + C * S) && (MouseX <= X + 480 + C * S))
			PrivateCharacter[C].Cage = (PrivateCharacter[C].Cage == null) ? true : null;


}

// Checks if the user clicked on a character
function PrivateClickCharacter() {

	// Defines the character position in the private screen
	var X = 1000 - PrivateCharacter.length * 250;
	var S = (PrivateCharacter.length == 4) ? 475 : 500;

	// For each character, we find the one that was clicked and open it's dialog
	for(var C = 0; C < PrivateCharacter.length; C++)
		if ((MouseX >= X + C * S) && (MouseX <= X + S + C * S))
			CharacterSetCurrent(PrivateCharacter[C]);

}

// When the user clicks in the private room
function PrivateClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000) && !LogQuery("RentRoom", "PrivateRoom")) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000) && !LogQuery("RentRoom", "PrivateRoom")) CharacterSetCurrent(PrivateVendor);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk() && (Player.Cage == null)) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && LogQuery("RentRoom", "PrivateRoom") && (Player.Cage == null)) CharacterSetCurrent(PrivateVendor);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475) && LogQuery("RentRoom", "PrivateRoom")) { CharacterAppearanceReturnRoom = "Private"; CommonSetScreen("Character", "Appearance"); }
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 505) && (MouseY < 595) && LogQuery("RentRoom", "PrivateRoom") && LogQuery("Wardrobe", "PrivateRoom")) CommonSetScreen("Character", "Wardrobe");
	if ((MouseX <= 1885) && (MouseY < 900) && LogQuery("RentRoom", "PrivateRoom")) PrivateClickCharacter();
	if ((MouseX <= 1885) && (MouseY >= 900) && LogQuery("RentRoom", "PrivateRoom") && LogQuery("Cage", "PrivateRoom")) PrivateClickCage();
}

// When the player rents the room
function PrivateRentRoom() {
	CharacterChangeMoney(Player, -250);
	LogAdd("RentRoom", "PrivateRoom");
}

// When the player gets the wardrobe
function PrivateGetWardrobe() {
	CharacterChangeMoney(Player, -100);
	LogAdd("Wardrobe", "PrivateRoom");
}

// When the player gets the cage
function PrivateGetCage() {
	CharacterChangeMoney(Player, -150);
	LogAdd("Cage", "PrivateRoom");
}

// Loads the private room character
function PrivateLoadCharacter(ID) {
	var Char = JSON.parse(localStorage.getItem("BondageClubPrivateRoomCharacter" + Player.AccountName + ID.toString()));
	if (Char != null) {
		var C = CharacterLoadNPC(Char.AccountName);
		C.Name = Char.Name;
		C.Appearance = Char.Appearance.slice();
		CharacterRefresh(C);
		PrivateCharacter.push(C);
	}
}

// Saves the private room character info
function PrivateSaveCharacter(ID) {
	if (PrivateCharacter[ID] != null) {
		var C = {
			Name: PrivateCharacter[ID].Name,
			AccountName: PrivateCharacter[ID].AccountName,
			Appearance: PrivateCharacter[ID].Appearance.slice()
		};
		localStorage.setItem("BondageClubPrivateRoomCharacter" + Player.AccountName + ID.toString(), JSON.stringify(C));
	} else localStorage.removeItem("BondageClubPrivateRoomCharacter" + Player.AccountName + ID.toString());
};

// Returns a random personality from the character types
function PrivateGetCharacterType() {
	while (true) {
		var CT = CommonRandomItemFromList("", PrivateCharacterTypeList);
		if (((PrivateCharacter[1] == null) || (PrivateCharacter[1].AccountName != CT)) &&
		   ((PrivateCharacter[2] == null) || (PrivateCharacter[2].AccountName != CT)) &&
		   ((PrivateCharacter[3] == null) || (PrivateCharacter[3].AccountName != CT)))
		   return CT;
	}	
}

// When a new character is added to the room
function PrivateAddCharacter(Template) {
	var C = CharacterLoadNPC(PrivateGetCharacterType());
	C.Name = Template.Name;
	C.Appearance = Template.Appearance.slice();
	CharacterRefresh(C);
	PrivateCharacter.push(C);
	PrivateSaveCharacter(PrivateCharacter.length - 1);
}

// When the player kicks out a character
function PrivateKickOut() {
	var ID = 1;
	if ((PrivateCharacter[2] != null) && (CurrentCharacter.Name == PrivateCharacter[2].Name)) ID = 2;
	if ((PrivateCharacter[3] != null) && (CurrentCharacter.Name == PrivateCharacter[3].Name)) ID = 3;
	PrivateCharacter[ID] = null;
	PrivateCharacter.splice(ID, 1);
	PrivateSaveCharacter(1);
	PrivateSaveCharacter(2);
	PrivateSaveCharacter(3);
	DialogLeave();
}