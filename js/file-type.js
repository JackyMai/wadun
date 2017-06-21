// File types supported natively by HTML5 for file preview using material box
// See js/material-box.js for how file preview works
const VIDEO = ['.m4v', '.mp4', '.ogv', '.webm'];
const AUDIO = ['.aac', '.flac', '.mp3', '.m4a', '.oga', '.ogg', '.opus', '.wav', '.weba'];
const IMAGE = ['.bmp', '.gif', '.jpg', '.jpeg', '.png', '.webp'];

// File type that are supported for dynamic icon assignment
// Only common file extensions in each category has been included
// All other files types not listed here will be assigned a generic file icon
const MEDIA = ['.3gp', '.avi', '.mov', '.mkv', '.ogm'];
const ARCHIVE = ['.7z', '.bz2', '.deb', '.gz', '.iso', '.jar','.rar', '.tar', '.zip'];
const TEXT = ['.c','.cpp', '.css','.html', '.java', '.js', '.json', '.md', '.py', '.txt']
const DOCUMENT = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
const FILE_TYPES = {
    'Video': VIDEO,
    'Audio': AUDIO,
    'Image': IMAGE,
    'Media': MEDIA,
    'Archive': ARCHIVE,
    'Text': TEXT,
    'Document': DOCUMENT,
}
const FILE_ICONS = {
    'Folder': 'fa-folder',
    'Video': 'fa-film',
    'Audio': 'fa-music',
    'Image': 'fa-file-image-o',
    'Media': 'fa-file-video-o',
    'Archive': 'fa-file-archive-o',
    'Text': 'fa-file-text',
    'Document': 'fa-file-text',
    'File': 'fa-file'
}

// Returns the extension for a given filename
function getExtension(fileName) {
    // If file name ends with '/' then it's a directory
    if(fileName[fileName.length-1] == '/') {
        return '/';
    } else if (fileName.indexOf('.') > -1) {
        var start = fileName.lastIndexOf('.');
        return fileName.substr(start, fileName.length);
    } else {
        return null;
    }
}

// Returns the formatted file type for a given extension
// Has the form: "{Category} ({extension})", e.g. "Video (.mp4)"
function getFormattedType(extension) {
    if(extension == '/') {
        return 'Folder';
    } else if (extension == null) {     // File with no extensions
        return 'Unknown';
    } else {
        for(var type in FILE_TYPES) {
            if(FILE_TYPES.hasOwnProperty(type)) {
                if(FILE_TYPES[type].indexOf(extension) > -1) {
                    return type + ' (' + extension + ')';
                }
            }
        }

        // Unknown file category but has an extension, use generic 'File' category
        return 'File (' + extension + ')';
    }
}

// Returns the class name for Font Awesome inside FILE_ICONS for a given formatted file type string
function getFileIconClass(formattedType) {
    if (formattedType.indexOf('Folder') > -1) {
        return FILE_ICONS['Folder']
    } else if (formattedType.indexOf('File') > -1 || formattedType == 'Unknown') {
        return FILE_ICONS['File'];
    } else {
        // Formatted File Type is neither a folder nor a file (also not an unknown)
        // So file type must be one of the supported ones
        for (var key in FILE_TYPES) {
            if (FILE_TYPES.hasOwnProperty(key)) {
                if (formattedType.indexOf(key) > -1) {
                    return FILE_ICONS[key];
                }
            }
        }
    }
}