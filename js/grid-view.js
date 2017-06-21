const fadeInDuration = 225;
const fadeOutDuration = 195;

// Takes all the items inside the table in list view and creates a grid/icon view
function createGrid() {
    // The top level div that containers the entire grid
    var gridContainer = document.createElement('div');
    gridContainer.id = 'grid-container';
    gridContainer.classList.add('row');
    gridContainer.style.display = 'none';

    // Grab all table rows and iterate through them
    var tableRows = document.getElementById('tbody').getElementsByTagName('tr');

    for(var i=0; i<tableRows.length; i++) {
        // Fetching table data under current row
        var tableDatas = tableRows[i].getElementsByTagName('td');

        // The top level element for each grid item
        var a = document.createElement('a');
        a.classList.add('col', 's3');
        a.href = tableRows[i].getElementsByTagName('a')[0].href;
        a.setAttribute('size', tableDatas[1].getAttribute('data-value'));
        a.setAttribute('type', tableDatas[3].getAttribute('data-value'));
        a.setAttribute('draggable', 'true');
        a.ondragstart = function() {
			drag(event);
		}
        gridContainer.appendChild(a);

        // Card
        var cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'hoverable');
        a.appendChild(cardDiv);

        // Card Image
        var cardImageDiv = document.createElement('div');
        cardImageDiv.classList.add('card-image');
        cardDiv.appendChild(cardImageDiv);

        // Retrieve formatted data type from Type column
        var formattedType = tableDatas[tableDatas.length-1].textContent;
        
        // Icon
        var icon = document.createElement('i');
        icon.classList.add('fa', 'fa-grid');
        icon.setAttribute('aria-hidden', 'true');
        icon.classList.add(getFileIconClass(formattedType));
        cardImageDiv.appendChild(icon);

        // Card Content
        var fileName = document.createTextNode(tableDatas[0].getAttribute('data-value'));
        var cardContentDiv = document.createElement('div');
        cardContentDiv.classList.add('card-content', 'truncate', 'tooltipped');
        cardContentDiv.setAttribute('data-position', 'bottom');
        cardContentDiv.setAttribute('data-delay', '500');
        cardContentDiv.setAttribute('data-tooltip', fileName.textContent);
        cardContentDiv.appendChild(fileName);
        cardDiv.appendChild(cardContentDiv);
    }

    // Hide the first element because it's the parent directory item
    gridContainer.children[0].style.display = 'none';

    // Insert grid container directly after the table
    var table = document.getElementsByTagName('table')[0];
    table.insertAdjacentElement('afterend', gridContainer);
}

// Load the view that you were in on previous from Chrome's local storage
// This way the view wouldn't reset to back to list view constantly
function setView() {
    chrome.storage.local.get('view', function(data) {
        var viewBtnIcon = document.getElementById('viewBtnIcon');
        var table = document.getElementsByTagName('table')[0];
        var grid = document.getElementById('grid-container');

        if (data.view == 'list') {
            viewBtnIcon.textContent = 'view_module';
            grid.style.display = 'none';
            table.removeAttribute('style');
        } else if (data.view == 'grid') {
            viewBtnIcon.textContent = 'view_list';
            table.style.display = 'none';
            grid.removeAttribute('style');
        }
    });
}

// Handles view changes by fading a view out and the other back in
// Saves current view into local storage everytime the view icon is pressed
function toggleView() {
    var viewBtn = document.getElementById('viewBtn');
    var viewBtnIcon = document.getElementById('viewBtnIcon');

    viewBtn.onclick = function() {
        var table = document.getElementsByTagName('table')[0];
        var grid = document.getElementById('grid-container');

        // Using the current icon on view button to determine which view should be toggled
        if (viewBtnIcon.textContent == 'view_module') {
            viewBtnIcon.textContent = 'view_list';
            $(table).stop(true, false).fadeOut(fadeOutDuration, function() {
                $(grid).stop(true, false).fadeIn(fadeInDuration);
            })

            chrome.storage.local.set({view: 'grid'});
        } else {
            viewBtnIcon.textContent = 'view_module';
            $(grid).stop(true, false).fadeOut(fadeOutDuration, function() {
                $(table).stop(true, false).fadeIn(fadeInDuration);
            })

            chrome.storage.local.set({view: 'list'});
        }
    }
}

setView();
createGrid();
toggleView();