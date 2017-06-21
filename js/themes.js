// GLOBAL VARIABLES FOR THEMES
// Theme 1's dictionary of customisable values
// Theme 1 == RED THEME
var theme1dict = {};
theme1dict["navbar"] = '#e74c3c';
theme1dict["directorybar"] = '#e57373';
theme1dict["breadcrumb"] = '#FFFFFF';
theme1dict["breadcrumbhover"] = '#E4F1FE';
theme1dict["bodybackground"] = '#fafbfc';
theme1dict["title"] = '#FFFFFF';
theme1dict["materialicons"] = 'white';

// Theme 2's dictionary of customisable values
// Theme 2 == BLUE THEME
var theme2dict = {};
theme2dict["navbar"] = '#446CB3';
theme2dict["directorybar"] = '#59ABE3';
theme2dict["breadcrumb"] = '#FFFFFF';
theme2dict["breadcrumbhover"] = '#E4F1FE';
theme2dict["bodybackground"] = '#fafbfc';
theme2dict["title"] = '#FFFFFF';
theme2dict["materialicons"] = 'white';

// Theme 3's dictionary of customisable values
// Theme 3 == DARK THEME
var theme3dict = {};
theme3dict["navbar"] = '#22313F';
theme3dict["directorybar"] = '#6C7A89';
theme3dict["breadcrumb"] = '#FFFFFF';
theme3dict["breadcrumbhover"] = '#E4F1FE';
theme3dict["bodybackground"] = '#fafbfc';
theme3dict["title"] = '#FFFFFF';
theme3dict["materialicons"] = 'white';

// Theme 4's dictionary of customisable values
// Theme 4 == SILVER THEME
var theme4dict = {};
theme4dict["navbar"] = '#bdc3c7';
theme4dict["directorybar"] = '#ecf0f1';
theme4dict["breadcrumb"] = '#22313F';
theme4dict["breadcrumbhover"] = 'black';
theme4dict["bodybackground"] = '#fafbfc';
theme4dict["title"] = '#22313F';
theme4dict["materialicons"] = '#22313F';

// Updates the theme when a different theme is selected inside the modal Options page
function themeSelector() {
    // Restores last used theme for user
    var currentTheme = localStorage.getItem("option");

    // Sets default theme to be used in case something goes wrong with theme restoration
    if (!currentTheme) {
        currentTheme = "theme1";
    }
    document.getElementById(currentTheme).checked = true;
    
    if(document.getElementById("theme1").checked) {
        // Checked radio button 1.
        // Restore theme 1 css here
        applyTheme(theme1dict);
    } else if(document.getElementById("theme2").checked) {
        // Checked radio button 2. 
        // Restore theme 2 css here
        applyTheme(theme2dict);
    } else if(document.getElementById("theme3").checked) {
        // Checked radio button 3.
        // Restore theme 3 css here
        applyTheme(theme3dict);
    } else if(document.getElementById("theme4").checked) {
        // Checked radio button 3.
        // Restore theme 3 css here
        applyTheme(theme4dict);
    }
    
    // Updates and stores the newly selected theme to be used.
    var theme1button = document.getElementById("theme1");
    var theme2button = document.getElementById("theme2");
    var theme3button = document.getElementById("theme3");
    var theme4button = document.getElementById("theme4");
    
    // Applies theme 1 to explorer
    theme1button.onclick = function() {
        applyTheme(theme1dict);

        var value = "theme1";
        localStorage.setItem("option", value);
    }

    // Applies theme 2 to explorer
    theme2button.onclick = function() {
        applyTheme(theme2dict);
        
        var value = "theme2";
        localStorage.setItem("option", value);
    }

    // Applies theme 3 to explorer
    theme3button.onclick = function() {
        applyTheme(theme3dict);
        
        var value = "theme3";
        localStorage.setItem("option", value);
    }

    // Applies theme 4 to explorer
    theme4button.onclick = function() {
        applyTheme(theme4dict);

        var value = "theme4";
        localStorage.setItem("option", value);
    }
}

// Applies the theme to the explorer, with the input as the dictionary for the specified theme.
function applyTheme(theme) {
    // Changes the colour of the navigation bar
    var navBar = document.querySelector('.navbar');
    navBar.style.backgroundColor = theme["navbar"];

    // Changes the colour of the directory bar
    var directoryBar = document.getElementById('directory-bar');
    directoryBar.style.backgroundColor = theme["directorybar"];

    // Changes the colour of the text and arrows of the breadcrumbs in the directory bar
    var breadCrumbs = document.querySelectorAll('.breadcrumb');
    // Checks which theme it is applying, in order for pseudo element manipulation to occur at run time
    if (theme == theme4dict) {
        var currentArrowClass = "breadcrumb-arrow1";
        var newArrowClass = "breadcrumb-arrow2";
    } else {
        var currentArrowClass = "breadcrumb-arrow2";
        var newArrowClass = "breadcrumb-arrow1";
    }
    for (var i = 0; i < breadCrumbs.length; i++) {
        // Changes colour of text
        breadCrumbs[i].style.color = theme["breadcrumb"];

        // Switches colour of arrow colour to required colour
        breadCrumbs[i].classList.remove(currentArrowClass)
        breadCrumbs[i].classList.add(newArrowClass);
    }
	
	// Changes the colour of the breadcrumb hover background
	var currentT = localStorage.getItem("option");
	// A switch is needed from T1/2/3 -> T4
	if ((currentT == "theme1" || currentT == "theme2" || currentT == "theme3") && theme == theme4dict) {
		var currentSpan = "span.breadcrumb-text1";
		var currentSpanClass = "breadcrumb-text1";
		var newSpan = "span.breadcrumb-text2";
		var newSpanClass = "breadcrumb-text2";
	} else if ((currentT == "theme4") && (theme == theme1dict || theme == theme2dict || theme == theme3dict)) {
		// A switch is needed from T4 -> T1/2/3
		var currentSpan = "span.breadcrumb-text2";
		var currentSpanClass = "breadcrumb-text2";
		var newSpan = "span.breadcrumb-text1";
		var newSpanClass = "breadcrumb-text1";
	} else {
		// No switch in theme, so keep current settings
		if (currentT == "theme4") {
			var currentSpan = "span.breadcrumb-text2";
			var currentSpanClass = "breadcrumb-text2";
			var newSpan = "span.breadcrumb-text2";
			var newSpanClass = "breadcrumb-text2";
		} else {
			var currentSpan = "span.breadcrumb-text1";
			var currentSpanClass = "breadcrumb-text1";
			var newSpan = "span.breadcrumb-text1";
			var newSpanClass = "breadcrumb-text1";
		}
	}
	// Obtains all span elements used in the breadcrumb
	var currentBreadCrumbsHover = document.querySelectorAll(currentSpan);
	
	// Changes the colour of the bradcrumb hover
	for (var i = 0; i < currentBreadCrumbsHover.length; i++) {
        // Replaces old settings with new one
        currentBreadCrumbsHover[i].classList.remove(currentSpanClass);
		currentBreadCrumbsHover[i].classList.add(newSpanClass);
	}

    // Changes the colour of the title
    var title = document.querySelector('.logo');
    title.style.color = theme["title"];

    // Changes the colour of the material icons
    var mat1 = document.getElementById('settings-button');
    mat1.style.color = theme["materialicons"];
    var mat2 = document.getElementById('bookmarksBtn');
    mat2.style.color = theme["materialicons"];
    var mat3 = document.getElementById('viewBtn');
    mat3.style.color = theme["materialicons"];
    var mat4 = document.querySelector('nav .input-field label i');
    mat4.style.setProperty("color", theme["materialicons"], "important");
    
    // Changes the colour of the search icon
    var searchBar = document.getElementById("search");
    searchBar.onfocusin = function() {
        var mat5 = document.querySelector('.input-field input[type="search"]:focus + label i');
        if (mat5 != null) {
            mat5.style.setProperty("color", "#22313F", "important");
        }
    }
    searchBar.onfocusout = function() {
        var mat5 = document.querySelector('nav .input-field label i');
        mat5.style.setProperty("color", theme["materialicons"], "important");
    }

    // Changes the background colour of the body
    var backgroundColour = document.getElementsByTagName("BODY")[0];
    backgroundColour.style.backgroundColor = theme["bodybackground"];

    // Changes the background colour of the icons in the Tiled view
    // var cards = document.querySelectorAll('.card');
    // for (var i = 0; i < cards.length; i++) {
    //     cards[i].style.backgroundColor = theme["cardcolour"];
    // }
}

themeSelector();