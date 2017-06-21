// Adds a "Type" column to the table in list view
function addTypeColumn() {
    var headerRow = document.getElementById('theader');

    // Creating table header for "Type"
    var headerType = document.createElement('th');
    headerType.textContent = 'Type';
    headerType.classList.add('detailsColumn', 'hoverable');
    headerType.onclick = function() {
        // Sort the last column which is the type column
        sortType(headerRow.children.length-1);
    };
    headerRow.appendChild(headerType);

    var tableRows = document.getElementById('tbody').getElementsByTagName('tr');

    // Add file type data to each row
    for(var i=0; i<tableRows.length; i++) {
        // Creating file type text from file name
        var dataValue = tableRows[i].children[0].getAttribute('data-value');
        var formattedType = getFormattedType(getExtension(dataValue));

        // Creating the td element and adding it to tr
        var td = document.createElement('td');

        if(dataValue != '..') {  // Not adding file type text for parent directory
            td.textContent = formattedType;
        } else {
            formattedType = 0;  // All td in parent directory row should have data-value of 0
        }

        td.classList.add('detailsColumn');
        td.setAttribute('data-value', formattedType);
        tableRows[i].appendChild(td);
    }
}

// Modified based on the existing sortTable() function from Chrome to support sorting of types
function sortType(column) {
    var theader = document.getElementById("theader");
    var oldOrder = theader.cells[column].dataset.order || '1';
    oldOrder = parseInt(oldOrder, 10)
    var newOrder = 0 - oldOrder;
    theader.cells[column].dataset.order = newOrder;

    var tbody = document.getElementById("tbody");
    var rows = tbody.rows;
    var list = [], i;
    for (i = 0; i < rows.length; i++) {
        list.push(rows[i]);
    }

    list.sort(function (row1, row2) {
        var a = row1.cells[column].dataset.value;
        var b = row2.cells[column].dataset.value;
        if (column) {
            return a > b ? newOrder : a < b ? oldOrder : 0;
        }

        // Column 0 is text.
        // Also the parent directory should always be sorted at one of the ends.
        if (b == ".." | a > b) {
            return newOrder;
        } else if (a == ".." | a < b) {
            return oldOrder;
        } else {
            return 0;
        }
    });

    // Appending an existing child again just moves it.
    for (i = 0; i < list.length; i++) {
        tbody.appendChild(list[i]);
    }
}

// Replaces the default system file icon with dynamic assignment of icon that corresponds
// to file type. E.g. video files will have movie icon, audio files will have music icon, etc.
function addTableIcons() {
    var tableRows = document.getElementById('tbody').getElementsByTagName('tr');

    for(var i=0; i<tableRows.length; i++) {
        var tableDatas = tableRows[i].getElementsByTagName('td');
        var formattedType = tableDatas[tableDatas.length-1].textContent;

        // Creating an icon that correponds to the file type
        var icon = document.createElement('i');
        icon.classList.add('fa', 'fa-lg');
        icon.classList.add(getFileIconClass(formattedType));
        icon.setAttribute('aria-hidden', 'true');

        var a = tableDatas[0].getElementsByTagName('a')[0];
        a.removeAttribute('class');
        addTruncate(a);

        var tooltipDiv = a.getElementsByTagName('div')[0];
        tooltipDiv.insertAdjacentElement('afterbegin', icon);
    }
}

// Adds sort indicator next to table header text and changes depending on sort status
function addSortIndicator() {
    var tableHeaders = document.getElementById('theader').getElementsByTagName('th');

    for(var i=0; i<tableHeaders.length; i++) {
        var sortIndicator = document.createElement('i');
        sortIndicator.classList.add('fa');

        tableHeaders[i].appendChild(sortIndicator);
        tableHeaders[i].addEventListener('click', function (i, sortIndicator) {
            return function () {
                var order = tableHeaders[i].getAttribute('data-order');
                if(order != null) {
                    if(order == '-1') {
                        sortIndicator.className = 'fa fa-angle-down';
                    } else {
                        sortIndicator.className = 'fa fa-angle-up';
                    }
                } else {
                    sortIndicator.className = 'fa fa-angle-down';
                }

                clearSortIndicators(i);
            }
        }(i, sortIndicator));
    }
}

// Clear sort indicator for all other headers except for skipIndex
function clearSortIndicators(skipIndex) {
    var tableHeaders = document.getElementById('theader').getElementsByTagName('th');

    for(var i=0; i<tableHeaders.length; i++) {
        if(i != skipIndex) {
            var sortIndicator = tableHeaders[i].getElementsByTagName('i')[0];
            sortIndicator.className = 'fa';
        }
    }
}

// Setting a percentage based width distribution for each of the columns
// The percentages are tested such that it would maximise the width for the
// Name column while making sure the contents in the other three columns wouldn't overflow
function setColumnWidth() {
    var headers = document.getElementById('theader').getElementsByTagName('th');

    headers[0].style.width = '40%';
    headers[1].style.width = '10%';
    headers[2].style.width = '17%';
    headers[3].style.width = '13%';
}

addTypeColumn();
addTableIcons()
addSortIndicator();
setColumnWidth();