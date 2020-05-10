
// Curt Dunmire
// Spring 2020
// Web233 Javascript
// Date: 05/01/20
// Assignment #15



// ——————————————————————————————————————————————————————
// PUT DATE AFTER PAGE LOAD

window.onload =		WhenLoad;
function WhenLoad()	{
	tt = setTimeout("PutDate()", 1000);

	//	v4.0 save cookie
	//	v4.0 read cookie when page loads and displays

	About();
	PopulateShoppingListonload();
	DisplayShoppingLists();
	ttt = setTimeout("ClearFocus()", 1500);
}


// ——————————————————————————————————————————————————————
// CLICKING ABOUT BUTTON LAUNCHES ALERT ABOUT APP

function About() {
	AboutText =	"Thanks for using the \"e-Shopper: List Tracker\" App!\n\n" +
			"Created by: Curt Dunmire\n" +
			"Enrolled in: JavaScript Class (Web233), yr. 2020\n\n" +
			"Questions about the JavaScript class can be directed to\n" +
			"Professor Chuck Konkol at: c.konkol@rockvalleycollege.edu\n\n" +
			"Register for classes @ RockValleyCollege.edu\n\n";
	alert(AboutText);
}


var MyItems = {
	Name:"", Price:""
};

var ShoppingList = [];


// —————————	Week 15: v4.1 GET() FUNCTION NEEDED TO BE ADDED, WAS NOT IN ASSIGNMENT

function Get(Name) {
	var url = window.location.search;
	var Num = url.search(Name);
	var NameL = Name.length;
	var FrontLength = NameL + Num + 1; //length of everything before the value
	var Front = url.substring(0, FrontLength);
	url = url.replace(Front, "");
	Num = url.search("&");

	if (Num >= 0)	return url.substr(0, Num);
	if (Num < 0)	return url;
}


// —————————	Week 15: v4.1 ShareList via bitly api

function PassList() {
	//	replace YOURGITHUBURL with your Github repo URL example: Konkollist.github.io
	var url = "https://webman2020.github.io/week15/index.html?List=" + ShoppingList;

	//	replace with your NEW Bit.ly TOKEN
	var AccessToken = "9b581ed4b140975008856f05f396a50dba9689ae";

	var params = { "long_url" : url };

	$.ajax({
		url: "https://api-ssl.bitly.com/v4/shorten",
		cache: false,
		dataType: "json",
		method: "POST",
		contentType: "application/json",
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + AccessToken);
		},
		data: JSON.stringify(params)
	}).done(function(data) {
		getshorturl = 1;
		document.getElementById("ShareList").innerHTML = "The URL to share the list:<br /><span class=\"Red01\">" + data.link + "</span>";
		CopyToClipBoard(data.link);
	}).fail(function(data) {
		document.getElementById("ShareList").innerHTML = "The URL to share the list:<br /><span class=\"Red01\">" + url + "</span>";
		CopyToClipBoard(url);
	});
}


// —————————	Week 14: Final Share function

function Share() { PassList(); }


// —————————	Week 14: ADDED Copy URL FUNCTION

function CopyToClipBoard(Text) {
	var PassByURL = document.createElement("textarea");
	PassByURL.value = Text;
	document.body.appendChild(PassByURL);
	PassByURL.focus();
	PassByURL.select();
	document.execCommand("copy");
	document.body.removeChild(PassByURL);

	alert("URL has been copied. Share the URL:\n" + Text + "\n\n");

	//	window.prompt("Copy & share the list!", Text);
}


// —————————	v3.1 AddToCart empty array

var AddToCart = [];


// —————————	v4.0 save cookie

function SaveCookie() {
	DeleteCookie("DunmireShopList");
	var date = new Date();

	//	keeps for a year
	date.setTime(date.getTime() + Number(365) * 3600 * 1000);
	document.cookie = "DunmireShopList=" + escape(ShoppingList.join(",")) + "; path=/; expires=" + date.toGMTString();
}


// —————————	v4.0 read cookie and return

function ReadCookie(Name) {
	var NameEQ = Name + "=";
	var ca = document.cookie.split(";");
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==" ") { c = c.substring(1, c.length); }
		if (c.indexOf(NameEQ) == 0) { return c.substring(NameEQ.length, c.length); }
	}
	return null;
}


// —————————	v4.0 delete cookie

function DeleteCookie(Name) {
	document.cookie = Name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}


// —————————	v4.0 PopulateShoppingListonload

function PopulateShoppingListonload() {
	ShoppingList = [];
	AddToCart = [];

	//	load cookie into array
	var y = ReadCookie("DunmireShopList");

	//	remove unwanted chars and format
	y = RemoveUnwanted(y); 

	//	v4.1 get URL
	var GetURLListValue = Get("List");

	if (GetURLListValue) {
		GetURLListValue = RemoveUnwanted(GetURLListValue);
		GetURLListValue = GetURLListValue.split(',');
		ShoppingList = GetURLListValue;
	} else if (y) {
		y = y.split('%2C');
		ShoppingList = y;
	}
}


// —————————	v4.0 remove and format cookie

function RemoveUnwanted(str) {
	if ((str === null) || (str === "")) {
		return false;
	} else {
		str = str.toString();

		/*	HAD TO COMMENT OUT THE LINE BELOW THAT REMOVES SPACES BECAUSE
			I HAVE SPACES REMOVED IN FUNCTION AddShoppingList()

			str = str.replace(/%20/g, "");		*/

		str = str.replace(/%21/g, "!");
		str = str.replace(/%24/g, "$"); 
		str = str.replace(/%7C/g, " | ");
		return str.replace(/[^\x20-\x7E]/g, "");
	}
}


// —————————	v3.1

function ChangeShoppingList(Position) {
	var Arrays = ShoppingList[Position];
	Arrays = Arrays.split(",");
	var e1 = Arrays[0];
	var e2 = Arrays[1];
	var ReplacedAmount = e2.replace(/\$/g,'');
	var eItem = prompt("Please enter new item", e1);
	var eCost = prompt("Please enter new item cost", ReplacedAmount);

	ShoppingList[Position] = eItem + "," + "$" + eCost;
	DisplayShoppingLists();
	DisplayShoppingCart();

	//	v4.0 save cookie
	SaveCookie();
}


// —————————	v3.1

function ChangeShoppingCart(Position) {
	document.getElementById("MyCart").innerHTML = ShoppingList[Position];
	var Arrays = AddToCart[Position];
	Arrays = Arrays.split(",");
	var e1 = Arrays[0];
	var e2 = Arrays[1];
	var ReplacedAmount = e2.replace(/\$/g,"");
	var eItem = prompt("Please enter new item", e1);
	var eCost = prompt("Please enter new item cost", ReplacedAmount);
	AddToCart[Position] = eItem + "," + "$" + eCost;
	DisplayShoppingLists();
	DisplayShoppingCart();

	//	v4.0 save cookie
	SaveCookie();
}


// —————————	v3.1 

function AddBackToShoppingList(Item, Num) {
	//	push to deleteShoppingCar
	DeleteShoppingCart(Num);
	ShoppingList.push(Item);

	//	display ShoppingList
	DisplayShoppingLists();

	//	display DisplayShoppingCart() 
	DisplayShoppingCart(); 
	ClearFocus();
	
	//	v4.0 save cookie
	SaveCookie();
}


// —————————	v3.1 Update function AddToShopCart by adding objects

function AddToShopCart(Item, Num) {
	DeleteShoppingLists(Num);
	AddToCart.push(Item);

	//	display shoppinglist
	DisplayShoppingLists();

	//	display DisplayShoppingCart() 
	DisplayShoppingCart(); 

	//	Clear
	ClearFocus();

	//	v4.0 save cookie
	SaveCookie();
}


// —————————	v3.1 Update function AddShoppingList by adding objects

function AddShoppingList(Item) {
	//	Checks for empty values or just whitespaces (no alphanumeric characters)
	//	If no alphanumeric characters are entered, item is not added and alert is shown.

	var CheckWhiteSpace = new RegExp(/^\s+$/);

	if (Item.length == 0 || CheckWhiteSpace.test(Item)) {
		alert("You did not add a valid item.\nItem not added to list.\nPlease try again.\n\n");
		ClearFocus();
		return false;
	} else {
		//	Replace functions remove extra unneeded whitespaces in added shopping list item
		Item = Item.replace(/^\s+|\s+$/g, "");
		Item = Item.replace(/\s{2,}/g, " ");
	}

/*	-----------------------BEGIN SECTION COMMENTED OUT

	if (Cost.length == 0 || CheckWhiteSpace.test(Cost)) {
		alert("You did not add a valid cost.\nCost not added to list.\nPlease try again.\n\n");
		return false;
	} else {
		//	Replace functions remove extra unneeded whitespaces in added shopping list item
		Cost = Cost.replace(/^\s+|\s+$/g, "");
		Cost = Cost.replace(/\s{2,}/g, " ");
	}

---------------------------END SECTION COMMENTED OUT	*/

	//	push to ShoppingList
	ShoppingList.push(Item);

	//	display ShoppingList
	DisplayShoppingLists();

	//	v3.1 display DisplayShoppingCart() 
	DisplayShoppingCart(); 
	ClearFocus();

	//	v4.0 save cookie
	SaveCookie();
}


function ClearFocus() {
	document.getElementById("Item").value = "";
	//	document.getElementById("Cost").value = "";
	document.getElementById("Item").focus();
}


// —————————	v3.1: update function DisplayShoppingLists() to add to cart 

function DisplayShoppingLists() {
	var TheList = "";
	var TheRow = "";
	var ArrayLength = ShoppingList.length;

	for (var i = 0; i < ShoppingList.length; i++) {
		//	v3.1 change button name to BtnDelete
		var BtnDelete =	' <input class="button" id="remove" name="delete" type="button" value="Remove Item" onclick="DeleteShoppingLists(' + i + ')" />';
		var BtnUpdate =	' <input class="button" name="edit" type="button" value="Edit Item" onclick="ChangeShoppingList(' + i + ')" />';

		//	Week 14: FOR ARRAY VARIABLE "ShoppingList," CHANGE ASCII SPACE CHARACTER TO PLAIN WHITE SPACE
		ShoppingList[i] = ShoppingList[i].replace(/\%20/g, " ");

		var Arrays = ShoppingList[i];
		Arrays = "'" + Arrays + "'";

		var BtnAddcart = '<input name="add" type="checkbox" id="adds" value="Add to Shopping Cart" onclick="AddToShopCart(' + Arrays + ',' + i + ')" />';

		//	Week 14: Add Share Button
		var BtnShareList = '<input class="button" id="shares" name="shares" type="submit" value="Share Shopping List" onclick="Share()" />' ;

		TheRow = "<li>" + ShoppingList[i] + BtnDelete + " " + BtnAddcart + "</li>";
		TheList += TheRow;
	}

	//	v3.1 add Title
	if (ArrayLength > 0) {
		MyList.style.paddingTop = "20px";
		document.getElementById("MyList").innerHTML = "Shopping List:<br><ul>" + TheList + "</ul>";

		//	Week 14: Add Share Button if arraylist contains values
		document.getElementById("ShareButton").innerHTML = BtnShareList;
	} else {
		MyList.style.paddingTop = "0";
		document.getElementById("MyList").innerHTML = "";

		//	Week 14: Remove Share Button and ShareList if arraylist contains values
		document.getElementById("ShareButton").innerHTML = "";
		document.getElementById("ShareList").innerHTML = "";
	}
}


// —————————	v3.1

function DisplayShoppingCart() {
	var TheList = "";
	var TheRow = "";
	var ArrayLength = AddToCart.length;

	for (var i = 0; i < ArrayLength; i++) {
		//	v 3.1 change button name to BtnDelete
		var BtnDelete =	' <input class="button" id="remove" name="delete" type="button" value="Remove Item" onclick="DeleteShoppingCart(' + i + ')" />';

		//	v3.1 add edit button using below i index & name it btnpdate
		var BtnUpdate =	' <input class="button" name="edit" type="button" value="Edit Item" onclick="ChangeShoppingCart(' + i + ')" />';
		var Arrays = AddToCart[i];
		Arrays = "'" + Arrays + "'";

		//	v3.1 add edit button using below i index & name it btnpdate
		var btnaddlist = '<input name="add" type="checkbox" id="adds" value="Add to Shopping List" onclick="AddBackToShoppingList(' + Arrays + ',' + i + ')" checked="checked"/>';
		TheRow = "<li>" + AddToCart[i] + BtnDelete + " " + btnaddlist + "</li>";
		TheList += TheRow;
	}

	if (ArrayLength > 0) {
		MyCart.style.paddingTop = "20px";
		document.getElementById("MyCart").innerHTML = "Items Purchased:<ul>" + TheList + "</ul>";
	} else {
		MyCart.style.paddingTop = "0";
		document.getElementById("MyCart").innerHTML = "";
	}
}


// —————————	v3.1

function DeleteShoppingLists(Position) {
	ShoppingList.splice(Position, 1);
	DisplayShoppingLists();
	DisplayShoppingCart();

	//	v4.0 save cookie
	SaveCookie();
}


// —————————	v3.1

function DeleteShoppingCart(Position) {
	AddToCart.splice(Position, 1);
	DisplayShoppingLists();
	DisplayShoppingCart();

	//	v4.0 save cookie
	SaveCookie();
}





// ——————————————————————————————————————————————————————
// v2.1: DISPLAY CURRENT DATE (using document ID 'Date'):

function PutDate() {
	var d = new Date();
	var n = d.toLocaleDateString();
	document.getElementById("Date").innerHTML = "Current date: <span class=\"Hilite\">" + n + "</span>";
}



