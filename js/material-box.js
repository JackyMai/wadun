// Injects a material box (expands the file for preview) to every element that can be
// viewed or played natively by the HTML5 standard. This includes video, audio and images.
// Supported file types are listed inside file js/file-type.js
function addMaterialBox() {
    var a = document.getElementsByTagName('a');

    // Iterative through every a-tag element to inject material box
    for (var i = 0; i < a.length; i++) {
        applyMaterialBox(a[i]);
    }
}

function applyMaterialBox(element) {
    var extension = getExtension(element.href);
    var tagName = null;     // Reset tagName after every iteration

    // File preview only supports image, video and audio.
    if (FILE_TYPES['Image'].indexOf(extension) > -1) {
        tagName = 'img';
    } else if (FILE_TYPES['Video'].indexOf(extension) > -1) {
        tagName = 'video';
    } else if (FILE_TYPES['Audio'].indexOf(extension) > -1) {
        tagName = 'audio';
    }

    if (tagName != null) {
        var media = document.createElement(tagName);
        media.classList.add('materialboxed');
        media.width = 0;

        // Setting the link for file preview based on file type
        if (tagName == 'img') {
            media.src = element.href;
        } else if (tagName == 'video' || tagName == 'audio') {
            var source = document.createElement('source');
            source.src = element.href;
            // First char ignored because it's a dot '.' charcter
            source.type = tagName + '/' + extension.substr(1, extension.length);
            media.appendChild(source);
        }

        // The width of the media is normally 0, when clicked it will change to 1 so that the browser renders it
        // Video and audio has a control bar so it should also be hidden when the file is minimised
        media.onclick = (function (tagName, media) {
            return function () {
                if (media.width == 0) {
                    media.width = 1;

                    if (tagName == 'video' || tagName == 'audio') {
                        media.setAttribute('controls', '');
                    }
                } else {
                    media.width = 0;

                    if (tagName == 'video' || tagName == 'audio') {
                        media.pause();
                        media.removeAttribute('controls');
                    }
                }
            }
        }(tagName, media));

        // When the row item is clicked, instead of going to the URI of the file, 
        // the click is intercepted and a click on the media is simulated instead.
        element.appendChild(media);
        element.onclick = (function (tagName) {
            return function () {
                element.getElementsByTagName(tagName)[0].click();
                return false;   // To prevent browser from following href link
            }
        }(tagName));
    }
}

addMaterialBox();