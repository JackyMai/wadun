var hiddenNodes = [];

// Read and interpret user input filter
function parseFilter(input) {
    //Reset previous filters
    disableFilters();

    //Filter term by Size
    if (input.includes("size:") && !input.includes("type:")) {
        // Find greater or lesser | Size Value | Byte Multiplier
        var splitStrings = input.split('size:');
        var sizeFilter = splitStrings[1].trim();

        if (sizeFilter.charAt(0) == "<") {
            var greater = false;
        } else if (sizeFilter.charAt(0) == ">") {
            var greater = true;
        }
        //Cut Greater or Less than Symbol
        sizeFilter = sizeFilter.substring(1).trim();

        //Determine whether suffix is TB/GB/MB/KB/B
        var byteMultiplier;
        if (sizeFilter.includes('K') || sizeFilter.includes('k')) {
            byteMultiplier = 1024;
        } else if (sizeFilter.includes('M') || sizeFilter.includes('m')) {
            byteMultiplier = Math.pow(1024,2);
        } else if (sizeFilter.includes('G') || sizeFilter.includes('g')) {
            byteMultiplier = Math.pow(1024,3);
        } else if (sizeFilter.includes('T') || sizeFilter.includes('t')){
            byteMultiplier = Math.pow(1024,4);
        } else if (sizeFilter.includes('b') || sizeFilter.includes('B')) {
            byteMultiplier = 1;
        }

        sizeValue = parseInt(sizeFilter);
        filterBySize(sizeValue, greater, byteMultiplier);
        var nameFilter = splitStrings[0].trim();
        nameFilter = nameFilter.trim();
        if (nameFilter.length > 0) {
            filterByName(nameFilter);
        }
    //Filter term by Type
    } else if (input.includes("type:") && !input.includes("size:")){

        var splitStrings = input.split('type:');
        var typeFilter = splitStrings[1].trim();

        filterByType(typeFilter);
        var nameFilter = splitStrings[0].trim();
        nameFilter = nameFilter.trim();
        if (nameFilter.length > 0) {
            filterByName(nameFilter);
        }

    } else if (input.includes("size:") && input.includes("type:")) {
        console.log("Size + Type filter not supported.")
    }
    //Filter by name
    else {
        filterByName(input.trim());
    }
}

//Search for term inside the name of the file or folder
function filterByName(inputName) {
    inputName = inputName.toLowerCase();

    //Files and Folders in List View
    var tableBody = document.getElementById('tbody');
    var tableRows = tableBody.getElementsByTagName('tr');

    //Files and Folders in Icon view
    var iconContainer = document.getElementById('grid-container');
    var aTags = iconContainer.getElementsByTagName('a');

    for (var i = 0; i < tableRows.length; i++) {
        var rowNode = tableRows[i];
        var iconNode = aTags[i];

        var aElement = rowNode.querySelectorAll('a')[0];
        var name = aElement.innerText.toLowerCase();
        var iconName = iconNode.querySelectorAll('.card-content')[0].innerText.toLowerCase();;

        //Hide items which do not match search term
        if (name.includes(inputName) == false) {
          if (rowNode.style.display != "none") {
              rowNode.style.display = "none";
              hiddenNodes.push(rowNode);
          }
        }

        if (iconName.includes(inputName) == false) {
          if (iconNode.style.display != "none") {
              iconNode.style.display = "none";
              hiddenNodes.push(iconNode);
          }

      }
    }
}


// byteMultiplier multiplys sizeValue by Kilo/Mega/Giga 1/1024/1024*1024 etc
function filterBySize(sizeValue, greater, byteMultiplier) {
    var tableBody = document.getElementById('tbody');
    var tableRows = tableBody.getElementsByTagName('tr');

    var iconContainer = document.getElementById('grid-container');
    var aTags = iconContainer.getElementsByTagName('a');

    for (var i = 0; i < tableRows.length; i++) {
        var rowNode = tableRows[i];
        var iconNode = aTags[i];

        var sizeTD = rowNode.querySelectorAll('.detailsColumn')[0];
        var size = parseInt(sizeTD.getAttribute('data-value'));
        var iconSize = parseInt(iconNode.getAttribute('size'));

        //Check if size of file is greater
        if (greater) {
            if (size > (sizeValue * byteMultiplier) == false) {
                if (rowNode.style.display != "none") {
                    rowNode.style.display = "none";
                    hiddenNodes.push(rowNode);
                }
            }
            if (iconSize > (sizeValue * byteMultiplier) == false) {
                if (iconNode.style.display != "none") {
                    iconNode.style.display = "none";
                    hiddenNodes.push(iconNode);
                }
            }

        //Check if size of file is lesser
        } else {
            if (size < (sizeValue * byteMultiplier) == false || size == 0) {
                if (rowNode.style.display != "none") {
                    rowNode.style.display = "none";
                    hiddenNodes.push(rowNode);
                }
            }

            if (iconSize < (sizeValue * byteMultiplier) == false || size == 0) {
                if (iconNode.style.display != "none") {
                    iconNode.style.display = "none";
                    hiddenNodes.push(iconNode);
                }
            }
        }
    }
}

//Filter by Type - Refer to type column in the List view
function filterByType(type){
    var tableBody = document.getElementById('tbody');
    var tableRows = tableBody.getElementsByTagName('tr');

    var iconContainer = document.getElementById('grid-container');
    var aTags = iconContainer.getElementsByTagName('a');
    var inputType = type.toLowerCase();

    for (var i = 0; i < tableRows.length; i++) {
        var rowNode = tableRows[i];
        var iconNode = aTags[i];
        var typeTD = rowNode.querySelectorAll('.detailsColumn')[2];

        var rowType = typeTD.getAttribute('data-value').toLowerCase();
        var iconType = iconNode.getAttribute('type').toLowerCase();


        //Match whether specified type is included in found type
        if(!rowType.includes(inputType)){
            if (rowNode.style.display != "none") {
                rowNode.style.display = "none";
                hiddenNodes.push(rowNode);
            }
        }
        if(!iconType.includes(inputType)){
            if (iconNode.style.display != "none") {
                iconNode.style.display = "none";
                hiddenNodes.push(iconNode);
            }
        }
    }
}

// Reset all filters
function disableFilters() {
    for (var i = 0; i < hiddenNodes.length; i++) {
        hiddenNodes[i].removeAttribute('style');
    }
    hiddenNodes = [];
}

//Attach filter to search box element
function addFilter() {
    var search = document.getElementById('search');
	search.onkeyup = function(event) {
		parseFilter(search.value);
	}
    search.addEventListener('keydown', function(event) {
        if(event.keyCode == '13') {
            event.preventDefault();
        }
    })

    var clearSearchBtn = document.getElementById('clearSearchBtn');
    clearSearchBtn.onclick = function() {
        disableFilters();
        search.value = '';
    }
}

addFilter();
