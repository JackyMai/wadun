// Creates modal component which contains the options
function addModal() {
    // Initialisation of required elements in modal component
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');
    var div3 = document.createElement('div');
    var div4 = document.createElement('div');
    var div5 = document.createElement('div');
    var h10 = document.createElement('h3');
    var h11 = document.createElement('h5');
    var h12 = document.createElement('h5');
    var input1 = document.createElement('input');
    var form1 = document.createElement('form');
    var radioInput1 = document.createElement('input');
    var radioInput2 = document.createElement('input');
    var radioInput3 = document.createElement('input');
    var radioInput4 = document.createElement('input');
    var label1 = document.createElement('label');
    var label2 = document.createElement('label');
    var label3 = document.createElement('label');
    var label4 = document.createElement('label');
    var br1 = document.createElement('br');
    var br2 = document.createElement('br');
    var br3 = document.createElement('br');
    var br4 = document.createElement('br');

    // Assignment of text for labels and radio labels
    var t1 = document.createTextNode('Wadun Options');
    var t2 = document.createTextNode('Local Settings');
    var t3 = document.createTextNode('Theme Selection');
    var t4 = document.createTextNode('Theme 1');
    var t5 = document.createTextNode('Theme 2');
    var t6 = document.createTextNode('Theme 3');
    var t7 = document.createTextNode('Theme 4');

    var div6 = document.createElement('div');
    var div7 = document.createElement('div');
    var div8 = document.createElement('div');
    var div12 = document.createElement('div');

    var div9 = document.createElement('div');
    var div10 = document.createElement('div');
    var div11 = document.createElement('div');
    var div13 = document.createElement('div');

    div1.id="optionModal";
    div1.classList.add('modal');
    //div1.classList.add('bottom-sheet');
    div2.classList.add('modal-content');
    
    // Assignment of text to headers
    h10.appendChild(t1);
    h11.appendChild(t2);
    h12.appendChild(t3);

    // Assignment of fields to Reset button
    input1.type="submit";
    input1.id="resetLocal";
    input1.value="Reset";
    input1.classList.add('btn')
    input1.classList.add('waves-effect')
    input1.classList.add('waves-light')

    // Assignment of fields to Radio buttons
    radioInput1.type="radio";
    radioInput1.name="Theme";
    radioInput1.id="theme1";
    radioInput1.value="Theme1"
    label1.appendChild(t4);

    radioInput2.type="radio";
    radioInput2.name="Theme";
    radioInput2.id="theme2";
    radioInput2.value="Theme2"
    label2.appendChild(t5);

    radioInput3.type="radio";
    radioInput3.name="Theme";
    radioInput3.id="theme3";
    radioInput3.value="Theme3"
    label3.appendChild(t6);

    radioInput4.type="radio";
    radioInput4.name="Theme";
    radioInput4.id="theme4";
    radioInput4.value="Theme4";
    label4.appendChild(t7);

    label1.htmlFor="theme1";
    label2.htmlFor="theme2";
    label3.htmlFor="theme3";
    label4.htmlFor="theme4";

    // Div organisation
    div1.appendChild(div2);
    div2.appendChild(div3);
    div2.appendChild(div4);
    div3.appendChild(h10);
    div4.appendChild(h11);
    div4.appendChild(input1);
    div4.appendChild(div5);
    div5.appendChild(h12);
    div5.appendChild(form1);

    // Block image generation
    div9.style.height="14px";
    div9.style.width="100px";
    div9.style.backgroundColor="#e74c3c";
    div9.style.backgroundImage="-webkit-linear-gradient(-60deg, #e74c3c 50%, #e57373 50%)";
    div9.style.display="inline-block";
    div9.style.borderRadius="15px";
    div9.style.marginLeft="30px";

    div10.style.height="14px";
    div10.style.width="100px";
    div10.style.backgroundColor="#446CB3";
    div10.style.backgroundImage="-webkit-linear-gradient(-60deg, #446CB3 50%, #59ABE3 50%)";
    div10.style.display="inline-block";
    div10.style.borderRadius="15px";
    div10.style.marginLeft="30px";

    div11.style.height="14px";
    div11.style.width="100px";
    div11.style.backgroundColor="#22313F";
    div11.style.backgroundImage="-webkit-linear-gradient(-60deg, #22313F 50%, #6C7A89 50%)";
    div11.style.display="inline-block";
    div11.style.borderRadius="15px";
    div11.style.marginLeft="30px";

    div13.style.height="14px";
    div13.style.width="100px";
    div13.style.backgroundColor="#EEEEEE";
    div13.style.backgroundImage="-webkit-linear-gradient(-60deg, #EEEEEE 50%, #000000 50%)";
    div13.style.display="inline-block";
    div13.style.borderRadius="15px";
    div13.style.border="thin solid #DADFE1";
    div13.style.marginLeft="30px";

    // Radio button generation
    div6.appendChild(radioInput1);
    div6.appendChild(label1);
    div6.appendChild(div9);
    div6.appendChild(br1);

    div7.appendChild(radioInput2);
    div7.appendChild(label2);
    div7.appendChild(div10);
    div7.appendChild(br2);

    div8.appendChild(radioInput3);
    div8.appendChild(label3);
    div8.appendChild(div11);
    div8.appendChild(br3);

    div12.appendChild(radioInput4);
    div12.appendChild(label4);
    div12.appendChild(div13);
    div12.appendChild(br4);

    form1.appendChild(div6);
    form1.appendChild(div7);
    form1.appendChild(div8);
    form1.appendChild(div12);

    document.body.appendChild(div1);

    // Settings button functionality
    var settingsButton = document.getElementById('settings-button');
    settingsButton.onclick = function() {
        // Opens the modal component for the Options page
        $('#optionModal').modal();

    }

}

// Clears the sidebar shortcuts
function clearShortcuts() {
	var fileList = document.getElementById('file-list');
	var folderList = document.getElementById('folder-list');
	
	var shortcuts1 = fileList.getElementsByTagName('li');
	var shortcuts2 = folderList.getElementsByTagName('li');

	for (var i = shortcuts1.length-1; i >= 0; i--) {
		fileList.removeChild(shortcuts1[i]);
	}

	for(var i = shortcuts2.length-1; i >= 0; i--) {
		folderList.removeChild(shortcuts2[i]);
	}
}

// Functionality of reset button
// On click of button, local storage is cleared, resulting in wipe of shortcuts, and reset of theme to default.
function resetOption() {
    var resetButton = document.getElementById('resetLocal');
    resetButton.onclick = function() {
        localStorage.clear();

        // Empties sidebar shortcuts
        clearShortcuts();

        // Apply and set default theme (theme 1)
        applyTheme(theme1dict);
        document.getElementById("theme1").checked = true;
        var value = "theme1";
        localStorage.setItem("option", value);
    }
}

addModal();
resetOption();