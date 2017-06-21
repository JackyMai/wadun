var source;
var nameDict = [];

// Drag a file element from table
function drag(event) {
    var elementDragged = event.target;
    var dragData = event.dataTransfer;

    // Check if the dragged element has an i tag with class 'fa'
    if(elementDragged.getElementsByTagName('i')[0].classList.contains('fa')) {
        // Make bookmarks auto-open on drag
        var bookmark = document.getElementById('bookmark');
        if (!bookmark.classList.contains('active')) {
            var bookmarksBtn = document.getElementById('bookmarksBtn');
            $(bookmarksBtn).dropdown('open');
        }

        // Check whether the element is dragged by fileName or by row
        if(elementDragged.tagName.toLowerCase() == 'a') {
            dragData.setData('name', elementDragged.textContent);
            dragData.setData('destination', elementDragged.href);
        } else if (elementDragged.tagName.toLowerCase() == 'tr') {
            var a = elementDragged.getElementsByTagName('a')[0];
            dragData.setData('name', a.textContent);
            dragData.setData('destination', a.href);
        }
    }
}

// Drop a file or folder onto the bookmarks dropdown
function drop(event) {
    event.preventDefault();

    var name = event.dataTransfer.getData('name');
    var destination = event.dataTransfer.getData('destination');

    // Coupled with dragging of bookmarks from table
    if (!name || !destination) {
        return;
    }

    createBookmark(name, destination);

    // Store new bookmark information for persistence
    var existingBookmarks = localStorage.getItem('bookmarks');
    if (!existingBookmarks) {
        localStorage.setItem('bookmarks', JSON.stringify([[name, destination]]));
    } else {
        var bookmarkArray = JSON.parse(existingBookmarks);
        bookmarkArray.push([name, destination]);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarkArray));
    }
}

function emptyDrop(event) {
    event.preventDefault();
    var bookmarksBtn = document.getElementById('bookmarksBtn');
    $(bookmarksBtn).dropdown('close');
}

// Swap two existing bookmarks
function swap(event) {
    var name = event.dataTransfer.getData('name');
    var destination = event.dataTransfer.getData('destination');

    if (name && destination) {
        return;
    }

    event.preventDefault();
    var sourceString = source.textContent;
    var target = event.target;
    var aTag;

    // If Dropped on A tag instead fetch Li parent
    if(target.nodeName == 'A') {
        aTag = target;
    } else if (target.nodeName == "LI") {
        aTag = target.children[0];
    } else {
        console.log("Invalid node swap");
    }

    var eventString = aTag.textContent;
    //if both elements are of the same type (file or folder) then execute the swap.
    if ((sourceString.charAt(sourceString.length - 1) == '/' && eventString.charAt(eventString.length - 1) == '/')
        || (sourceString.charAt(sourceString.length - 1) != '/' && eventString.charAt(eventString.length -1) != '/')) {
        var tempName = source.textContent;
        var tempDest = source.href;

        source.childNodes[0].nodeValue = eventString;
        source.href = aTag.href;

        aTag.childNodes[0].nodeValue = tempName;
          aTag.href = tempDest;

        var existingStorageJSON = localStorage.getItem('bookmarks');
        //update local storage with the swap
        if (existingStorageJSON) {
            var existingBookmarks = JSON.parse(existingStorageJSON);
            var sourceValueID = parseInt(source.id.charAt(source.id.length-1));
            var eventValueID = parseInt(aTag.id.charAt(aTag.id.length-1));

            var tempValue = existingBookmarks[sourceValueID];

            existingBookmarks[sourceValueID] = existingBookmarks[eventValueID];
            existingBookmarks[eventValueID] = tempValue;
        }

        localStorage.setItem('bookmarks', JSON.stringify(existingBookmarks));
    } else {
        return;
    }
}

// Pick up a bookmark - either for deletion or rearranging
function dragToBin(event) {
    source = event.target.children[0];
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('element', event.target.children[0].id);
}

// Place a bookmark on the bin to delete it
function dropOnBin(event) {
    event.preventDefault();

    var elementID = event.dataTransfer.getData('element');

    // Return if no bookmark ID present
    if (!elementID) {
        return;
    }

    // Update Local Storage with nullified value
    var bookmarkArray = JSON.parse(localStorage.getItem('bookmarks'));
    var id = parseInt(elementID.substring(8),10);
    bookmarkArray[id] = ['', '']; // Set the existing bookmark to null
    localStorage.setItem('bookmarks', JSON.stringify(bookmarkArray));

    // Delete node from HTML
    var element = document.getElementById(elementID);

    var parent = element.parentNode;
    parent.removeChild(element);

    var liParent = parent.parentNode;
    liParent.removeChild(parent);
}

// Enables Dragging and Dropping
function allowDrop(event) {
    event.preventDefault();
}

// Main setup of bookmark
function setup() {
    // Make bookmark dropwdowns autoclose if user drops inside content container
    var contentContainer = document.getElementById('content-container');
    contentContainer.ondragover = function() {
        allowDrop(event);
    }
    contentContainer.ondrop = function () {
        emptyDrop(event);
    }

    // Create and inject bookmark container
    var bookmark = document.createElement('div');
    bookmark.id = 'bookmark';
    bookmark.classList.add('dropdown-content');
    bookmark.setAttribute('number-bookmarks', 0);
    bookmark.ondrop = function() {
        drop(event);
    };
    bookmark.ondragover = function() {
        allowDrop(event);
    }

    // Setting attributes
    var bookmarksBtn = document.getElementById('bookmarksBtn');
    bookmarksBtn.onclick = function(event) {
        if (event.target.className == "dropdown-button waves-effect waves-light" || event.target.className == "material-icons") {
            reloadBookmarks();
        }
    }
    bookmarksBtn.setAttribute('data-activates', bookmark.id);
    bookmarksBtn.parentElement.appendChild(bookmark);

    // Folder Collapsible
    var folderCollapsible = document.createElement('ul');
    folderCollapsible.id  = 'folder-collapsible';
    folderCollapsible.classList.add('collapsible');
    folderCollapsible.setAttribute('data-collapsible', 'expandable');
    $(folderCollapsible).on('click', function (e) {
        e.stopPropagation();
    });
    bookmark.appendChild(folderCollapsible);

    var folderCollapsibleList = document.createElement('li');
    folderCollapsible.appendChild(folderCollapsibleList);

    var folderCollapsibleHeader = document.createElement('a');
    folderCollapsibleHeader.classList.add('collapsible-header', 'active');
    folderCollapsibleHeader.textContent = 'Folder';
    folderCollapsibleList.appendChild(folderCollapsibleHeader);

    var folderIcon = document.createElement('i');
    folderIcon.classList.add('fa', 'fa-folder', 'fa-lg');
    folderCollapsibleHeader.insertAdjacentElement('afterbegin', folderIcon);

    var folderCollapsibleBody = document.createElement('div');
    folderCollapsibleBody.classList.add('collapsible-body');
    folderCollapsibleList.appendChild(folderCollapsibleBody);

    var folderBookmarkList = document.createElement('ul');
    folderBookmarkList.id = 'folder-list';
    folderCollapsibleBody.appendChild(folderBookmarkList);

    // File Collapsible
    var fileCollapsible = document.createElement('ul');
    fileCollapsible.id  = 'file-collapsible';
    fileCollapsible.classList.add('collapsible');
    fileCollapsible.setAttribute('data-collapsible', 'expandable');
    $(fileCollapsible).on('click', function (e) {
        e.stopPropagation();
    });
    bookmark.appendChild(fileCollapsible);

    var fileCollapsibleList = document.createElement('li');
    fileCollapsible.appendChild(fileCollapsibleList);

    var fileCollapsibleHeader = document.createElement('a');
    fileCollapsibleHeader.classList.add('collapsible-header', 'active');
    fileCollapsibleHeader.textContent = 'File';
    fileCollapsibleList.appendChild(fileCollapsibleHeader);

    var fileIcon = document.createElement('i');
    fileIcon.classList.add('fa', 'fa-file', 'fa-lg');
    fileCollapsibleHeader.insertAdjacentElement('afterbegin', fileIcon);

    var fileCollapsibleBody = document.createElement('div');
    fileCollapsibleBody.classList.add('collapsible-body');
    fileCollapsibleList.appendChild(fileCollapsibleBody);

    var fileBookmarkList = document.createElement('ul');
    fileBookmarkList.id = 'file-list';
    fileCollapsibleBody.appendChild(fileBookmarkList);

    // Divider
    var divider = document.createElement('li');
    divider.classList.add('divider');
    bookmark.appendChild(divider);

    // Bin
    var bin = document.createElement('li');
    bin.id = 'bin';
    bin.classList.add('tooltipped');
    bin.setAttribute('data-position', 'bottom');
    bin.setAttribute('data-tooltip', 'Drag bookmarks here to delete them');
    bin.ondrop = function() {
        dropOnBin(event);
    };
    bin.ondragover = function() {
        allowDrop(event);
    };
    bookmark.appendChild(bin);

    var binButton = document.createElement('a');
    binButton.href = '#!';
    bin.appendChild(binButton);

    var binIcon = document.createElement('i');
    binIcon.classList.add('fa', 'fa-trash', 'fa-lg');
    binButton.appendChild(binIcon);
    binButton.insertAdjacentText('beforeend', 'Bin');
}

// Setup Listener for bookmark name edits
function attachContentListener(aLink) {
    aLink.addEventListener('input', function() {
        var id = aLink.id.substring(8);
        var newName = aLink.innerText.trim();
        //cut name if it is longer than 24 characters.
        newName = newName.substring(0, 25);
        //disable typing if 24 characters is reached
        if (newName.length >= 24) {
            aLink.onkeypress = function() {
                return false;
            };
        } else {
            //enable typing again if less than 24 characters
            aLink.onkeypress = function() {
                return true;
            }
        }
        var newName = newName.substring(0, 25);
        if(aLink.parentNode.parentNode.id == 'folder-list') {
            if(newName.charAt(newName.length-1) != '/') {
                newName += '/';
            }
        }
        //add name to dictionary as storage. Do not set to local storage yet as it may not be confirmed.
        nameDict.id = newName;
    });
}

//function to reload bookmarks to update temporary names back to proper names on opening bookmarks
function reloadBookmarks() {
    var existingBookmarksJSON = localStorage.getItem('bookmarks');

    if(existingBookmarksJSON) {
        var existingBookmarks = JSON.parse(existingBookmarksJSON);
        var folderElements = document.getElementById('folder-list').children;
        var fileElements = document.getElementById('file-list').children;
        //retrieve folder elements from local storage and compare to bookmark state right now.
        for (var i = 0; i < folderElements.length; i++) {
            folderElements[i].children[0].setAttribute('contenteditable', 'false');
            var id = folderElements[i].children[0].id.substring(8);
            var name = folderElements[i].children[0].childNodes[0].nodeValue;
            var storageArray = existingBookmarks[id];
            var storageName = storageArray[0];
            if (storageArray[0].length > 24) {
                storageName = storageArray[0].substring(0, 24) + "/";
            }
            //if current bookmark name is different from name stored in local storage. Rename element back to proper name from local storage
            if (name != storageName) {
                //remove then recreate elements to ensure proper order.
                if (name) {
                    folderElements[i].children[0].removeChild(folderElements[i].children[0].childNodes[2]);
                    folderElements[i].children[0].removeChild(folderElements[i].children[0].childNodes[1]);
                    folderElements[i].children[0].removeChild(folderElements[i].children[0].childNodes[0]);
                } else {
                    folderElements[i].children[0].removeChild(folderElements[i].children[0].childNodes[1]);
                    folderElements[i].children[0].removeChild(folderElements[i].children[0].childNodes[0]);
                }
                name = storageName;

                var editButton = document.createElement('i');
                editButton.classList.add('edit-button', 'fa', 'fa-pencil', 'fa-lg');
                editButton.style.cursor = 'pointer';
                editButton.style.visibility = 'hidden';
                editButton.onclick = function() {
                    editBookmark(event);
                };
                //event handlers for hover effect on list element
                var enterHandler = function() {
                    editButton.removeAttribute('style');
                }
                var leaveHandler = function() {
                    editButton.style.visibility = 'hidden';
                }

                $(folderElements[i]).hover(enterHandler, leaveHandler);
                //recreate children and append back to list element with proper names.
                folderElements[i].children[0].appendChild(document.createTextNode(name));
                folderElements[i].children[0].appendChild(document.createElement('span'));
                folderElements[i].children[0].appendChild(editButton);
            }
        }
        //retrieve file elements from local storage and compare with current bookmarks state.
        for (var j = 0; j < fileElements.length; j++) {
            fileElements[j].children[0].setAttribute('contenteditable', 'false');
            var id = fileElements[j].children[0].id.substring(8);
            var name = fileElements[j].children[0].childNodes[0].nodeValue;
            var storageArray = existingBookmarks[id];
            var storageName = storageArray[0].substring(0, 25);
            //if current name differs from that stored in local storage then use the name in local storage.
            if (name != storageName) {
                if (name) {
                    //remove child and recreate later to ensure order
                    fileElements[j].children[0].removeChild(fileElements[j].children[0].childNodes[2]);
                    fileElements[j].children[0].removeChild(fileElements[j].children[0].childNodes[1]);
                    fileElements[j].children[0].removeChild(fileElements[j].children[0].childNodes[0]);
                } else {
                    fileElements[j].children[0].removeChild(fileElements[j].children[0].childNodes[1]);
                    fileElements[j].children[0].removeChild(fileElements[j].children[0].childNodes[0]);
                }
                name = storageName;

                var editButton = document.createElement('i');
                editButton.classList.add('edit-button', 'fa', 'fa-pencil', 'fa-lg');
                editButton.style.cursor = 'pointer';
                editButton.style.visibility = 'hidden';
                editButton.onclick = function() {
                    editBookmark(event);
                };
                //event handlers for hover effect over list elements
                var enterHandler = function() {
                    editButton.removeAttribute('style');
                }
                var leaveHandler = function() {
                    editButton.style.visibility = 'hidden';
                }

                $(fileElements[j]).hover(enterHandler, leaveHandler);
                //recreate and append child to ensure proper order
                fileElements[j].children[0].appendChild(document.createTextNode(name));
                fileElements[j].children[0].appendChild(document.createElement('span'));
                fileElements[j].children[0].appendChild(editButton);

            }
        }
    }
}

// Check Local Storage for bookmarks - run once on startup
function loadBookmarks() {
    var existingBookmarksJSON = localStorage.getItem('bookmarks');

    if(existingBookmarksJSON) {
        var existingBookmarks = JSON.parse(existingBookmarksJSON);
        var deletedBookmarks = 0;
        var deleteBookmarksArray = [];

        for (var i=0; i < existingBookmarks.length; i++) {
            var bookmark = existingBookmarks[i];
            var name = bookmark[0];
            var nameSub = name;
            if (name.length >= 24) {
                if (name[name.length-1] == "/") {
                    nameSub = name.substring(0, 24) + "/";
                } else {
                    nameSub = name.substring(0, 25);
                }
            }
            var destination = bookmark[1];

            if (!name || !destination) {
                deleteBookmarksArray.push(i);
                deletedBookmarks++;
                continue;
            } else {
                createBookmark(nameSub,destination);
            }
        }

        for (var i=(deleteBookmarksArray.length-1); i>=0; i--) {
            existingBookmarks.splice(deleteBookmarksArray[i], 1);
        }

        localStorage.setItem('bookmarks', JSON.stringify(existingBookmarks));
    }
}

// Assign Drag function to the files in the file list
function findDraggables() {
    var list = document.querySelectorAll('#tbody > tr');

    for (var i = 0; i < list.length; i++) {
        list[i].ondragstart = function() {
            drag(event);
        }
        list[i].setAttribute('draggable', 'true');
    }
}

function createBookmark(name, destination) {
    var nameSub = name.substring(0, 25);
    // Update bookmark count
    var bookmark = document.getElementById('bookmark');
    var bookmarkNum = bookmark.getAttribute('number-bookmarks');
    var id = parseInt(bookmarkNum);
    if (name[name.length-1] == "/") {
        if (nameSub.length > 24) {
            nameSub = name.substring(0, 24) + "/";
        }
    }
    bookmark.setAttribute('number-bookmarks', id+1);

    var enterHandler = function() {
        editButton.removeAttribute('style');
    }
    var leaveHandler = function() {
        editButton.style.visibility = 'hidden';
    }

    // List Item
    var listItem = document.createElement('li');
    $(listItem).hover(enterHandler, leaveHandler);
    listItem.ondragstart = function() {
        dragToBin(event);
    }
    listItem.ondrop = function() {
        swap(event);
    }
    listItem.draggable = true;

    var aLink = document.createElement('a');
    aLink.href = destination;
    aLink.id = 'bookmark' + id;
    aLink.classList.add('single-line', 'truncate');
    aLink.draggable = false;
    attachContentListener(aLink);
    listItem.appendChild(aLink);

    // Attach edit button to bookmark
    var editButton = document.createElement('i');
    editButton.classList.add('edit-button', 'fa', 'fa-pencil', 'fa-lg');
    editButton.style.cursor = 'pointer';
    editButton.style.visibility = 'hidden';
    editButton.onclick = function() {
        editBookmark(event);
    };
    aLink.appendChild(document.createTextNode(nameSub));
    aLink.appendChild(document.createElement('span'));
    aLink.appendChild(editButton);


    // Check if file or folder
    if (name[name.length-1] == '/') {
        var folderList = document.getElementById('folder-list');
        folderList.appendChild(listItem);
    } else {
        // Check if material box has been initialized, if not, initialize it
        var media = aLink.getElementsByClassName('materialboxed initialized')[0];
        if (media == null) {
            applyMaterialBox(aLink);

            media = aLink.getElementsByClassName('materialboxed')[0];
            $(media).materialbox();
        }

        var fileList = document.getElementById('file-list');
        fileList.appendChild(listItem);
    }
}
//function to select editable text upon button press. Allows to edit right away without clicking on field.
function selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

//function to edit names of files stored in bookmarks
function editBookmark(ev) {
    var liElement = ev.target.parentNode.parentNode;
    var aLink = liElement.children[0];
    var disableFirstClick = true;

    //disable enter button due to exceptions
    $(aLink).keypress(function(e) {
        if (e.keypress == 13 || e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    });
    //change icons when editting
    var editable = aLink.getAttribute('contenteditable');
    ev.target.classList.remove('fa-check');
    ev.target.classList.add('fa-pencil');

    //differentiate between and disable clicking when editting
    aLink.onclick = function(event) {
        if (disableFirstClick) {
            disableFirstClick = false;
            return false;
        }
        return true;
    };

    //update text field of bookmark. store new name in local storage.
    if(editable == 'true') {
        aLink.setAttribute('contenteditable', 'false');
        aLink.children[0].setAttribute('contenteditable', 'false');
        aLink.children[1].setAttribute('contenteditable', 'false');

        var id = aLink.id.substring(8);
        var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        var bookmark = bookmarks[id];

        if (nameDict.id) {
            bookmark[0] = nameDict.id;
            if (bookmark[0]) {
                localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            }
            if(aLink.parentNode.parentNode.id == 'folder-list') {
                if(aLink.textContent.length == 0 || aLink.textContent[aLink.textContent.length-1] != '/') {
                    aLink.childNodes[0].nodeValue += '/';
                }
            }
        }

    } else {
        //change icons and select editable text automatically.
        aLink.onclick = function(event) {
            return false;
        };
        aLink.setAttribute('contenteditable', 'true');
        aLink.children[0].setAttribute('contenteditable', 'false');
        aLink.children[1].setAttribute('contenteditable', 'false');
        ev.target.classList.remove('fa-pencil');

        ev.target.classList.add('fa-check');
        aLink.spellcheck = false;
        selectElementContents(aLink.childNodes[0]);
        aLink.focus();
    }
}

// Functions run initially to setup the bookmark and drag-drop functionality
setup();
findDraggables();
loadBookmarks();
