// Hides the default header that shows the current directory
function hideHeader() {
    var h1 = document.getElementById('header');
    h1.style.display = 'none';
    h1.style.visibility = 'hidden';
}

// Adds additional CSS setups that must be done outside of manifest.json
function addCSS() {
    var title = document.getElementById('title');

    // Adding Material Icons from Google
    title.insertAdjacentHTML('beforebegin', '<link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');

    // Adding Font Awesome icons
    var fontAwesome = document.createElement('style');
    fontAwesome.type = 'text/css';
    fontAwesome.textContent = `@font-face { font-family: 'FontAwesome';
                                            src: url("` + chrome.extension.getURL('fonts/font-awesome/fontawesome-webfont.woff2?v=4.7.0')
                                            + `");
                                        }`;
    title.insertAdjacentElement('beforebegin', fontAwesome);
}

// Adds a fixed navigation bar at the top of the page
// Inserted as HTML code because the JS equivalent version would be too long and too hard to follow
function addNavbar() {
    var h1 = document.getElementById('header');
    h1.insertAdjacentHTML('afterend', `<div id="topbar" class="navbar-fixed hoverable">
                                            <nav class="navbar">
                                                <div class="nav-wrapper">
                                                    <a class="left logo">Wadun</a>
                                                    <ul id="nav-mobile" class="right">
                                                        <!-- View button -->
                                                        <li>
                                                            <a id="viewBtn" class="tooltipped waves-effect waves-light" data-tooltip="Change View">
                                                                <i id="viewBtnIcon" class="material-icons">view_module</i>
                                                            </a>
                                                        </li>
                                                        <!-- Bookmarks button -->
                                                        <li>
                                                            <a id="bookmarksBtn" class="dropdown-button tooltipped waves-effect waves-light" data-tooltip="Bookmarks">
                                                                <i class="material-icons">bookmark</i>
                                                            </a>
                                                        </li>
                                                        <!-- Settings button -->
                                                        <li>
                                                            <a id="settings-button" class="tooltipped waves-effect waves-light" href="#optionModal" data-tooltip="Settings">
                                                                <i class="material-icons">settings</i>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                    <form>
                                                        <div class="input-field">
                                                            <input id="search" type="search" required>
                                                            <label class="label-icon" for="search"><i class="material-icons">search</i></label>
                                                            <i id="clearSearchBtn" class="material-icons">close</i>
                                                        </div>
                                                    </form>
                                                </div>
                                            </nav>
                                        </div>`);
}

// Adds a breadcrumb (a multi-level directory bar) under the navbar
function addBreadcrumbs() {
    var table = document.body.getElementsByTagName('table')[0];

    var nav = document.createElement('nav');
    nav.id = 'directory-bar';
    table.insertAdjacentElement('beforebegin', nav);

    var navWrapper = document.createElement('div');
    navWrapper.classList.add('nav-wrapper');
    nav.appendChild(navWrapper);

    var breadcrumbs = document.createElement('div');
    breadcrumbs.id = 'breadcrumbs';
    navWrapper.appendChild(breadcrumbs);

    // Convert from UTF-8 byte sequence to readable strings
    // First and last element are empty after split due to URI structure and so removed
    var pathNames = decodeURIComponent(window.location.pathname).split('/');
    pathNames = pathNames.slice(1, pathNames.length-1);
    var href = window.location.protocol + "//" + window.location.host + "/";

    // Unlike the "file:" protocol, FTP has a root directory so an empty item is inserted at the front
    if(window.location.protocol == 'ftp:' || pathNames.length == 0) {
        pathNames.unshift('');
    }

    // Building the href reference iteratively and adding it to the end of "breadcrumbs" div
    for (var i=0; i<pathNames.length; i++) {
        // Do not append to href if item is root directory
        if(pathNames[i] == '') {
            pathNames[i] = '/'; // Root directory will have text '/' as name
        } else {
            href += pathNames[i] + "/";
        }

        var a = document.createElement('a');
        a.href = href;
        a.classList.add('breadcrumb');

        // Determines what colour to make the breadcrumb arrow and hover effect
        var current = localStorage.getItem("option");
        if (current == "theme4") {
            var arrowColour = "breadcrumb-arrow2";
			var breadcrumbTextColour = "breadcrumb-text2";
        } else {
            var arrowColour = "breadcrumb-arrow1";
			var breadcrumbTextColour = "breadcrumb-text1";
        }
        // Adds additional colour attribute to breadcrumb arrow
        a.classList.add(arrowColour);

        var span = document.createElement('span');
        span.classList.add(breadcrumbTextColour);
        span.textContent = pathNames[i];
        a.appendChild(span);
        
        breadcrumbs.appendChild(a);
    }

    truncateBreadcrumb();
}

function truncateBreadcrumb() {
    var breadcrumbs = document.getElementById('breadcrumbs');
    var a = breadcrumbs.getElementsByTagName('a');
    var overflowElement = a[1];

    while(breadcrumbs.scrollWidth > breadcrumbs.offsetWidth && a.length > 4) {
        if(a[1].hasAttribute('href')) {
            a[1].removeAttribute('href');
            a[1].getElementsByTagName('span')[0].textContent = '...';
        } else {
            breadcrumbs.removeChild(a[2]);
        }
    }
}

// Adds a highlight effect to the current row the mouse is hovering
function addHighlight() {
    var table = document.getElementsByTagName('table')[0];
    table.classList.add('highlight');
}

// Adds a hover/float effect to the current row the mouse is hovering
function addHover() {
    var tableRows = document.getElementsByTagName('tr');

    // Iterate through every tbale row to apply the "hoverable" effect
    for(var i=0; i<tableRows.length; i++) {
        // Add hoverable effect to each column header rather than the entire header row
        if(tableRows[i].className == 'header') {    // Header row
            var columnHeaders = tableRows[i].children;
            for(var j=0; j<columnHeaders.length; j++) {
                columnHeaders[j].classList.add('hoverable');
            }
        } else {
            tableRows[i].classList.add('hoverable');    // Normal row
        }
    }
}

// Adds the ability for the element to automatically truncate text content if it overflows
function addTruncate(element) {
    var fileName = element.parentElement.getAttribute('data-value');
    element.textContent = '';

    var tooltipDiv = document.createElement('div');
    tooltipDiv.textContent = fileName;
    tooltipDiv.classList.add('truncate', 'tooltipped');
    tooltipDiv.setAttribute('data-position', 'bottom');
    tooltipDiv.setAttribute('data-delay', '500');
    tooltipDiv.setAttribute('data-tooltip', decodeURIComponent(fileName));
    element.appendChild(tooltipDiv);
}

// Hides the parent directory row from table since breadcrumb provides more functionality
function hideParentDirFromTable() {
    // Retrieving row for parent directory
    var parentDirRow = document.getElementById('tbody').getElementsByTagName('tr')[0];
    var td = parentDirRow.getElementsByTagName('td')[0];

    // Hiding row for parent directory
    if(td.getAttribute('data-value') == '..') {
        parentDirRow.style.display = 'none';
    }
}

// Adds a div that contains all contents under the breadcrumb
function addContentContainer() {
    // Creating container
    var contentContainer = document.createElement('div');
    contentContainer.id = 'content-container';

    // Adding list view table to container
    var listView = document.getElementsByTagName('table')[0];
    contentContainer.appendChild(listView);

    // Inserting container after breadcrumb
    var breadcrumb = document.getElementById('directory-bar');
    breadcrumb.insertAdjacentElement('afterend', contentContainer);
}

hideHeader();
hideParentDirFromTable();
addCSS();
addNavbar();
addBreadcrumbs();
addHighlight();
addHover();
addContentContainer();