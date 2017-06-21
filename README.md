# Wadun

A Chrome extension that enhances the UX/UI of the built-in file explorer

## Project Goals

- Improved usability and visual appearance of the Chrome file explorer
- Faster or more convenient navigation between folders using the Chrome file explorer
- Refined sorting and filtering in the current folder
- Maximize achievement of these goals within the limitations of JavaScript and its security

## TODO

- Redesign using React and Redux
- Convert to single-page application to avoid page reload
- Make bookmarks more reliable

## Features

- Filtering using the search bar
  - By default it will filter by name
  - Use `size:` with `>` or `<`, an integer value, and either `b`, `kb` , `mb` , `gb` or `tb` to filter by size
    - Example: `size: >10MB` or `size: <100MB`
  - Use `type:` with a type corresponding to the type column as shown in the file browser
    - Example: `type: folder` or `type: document`
  - Name filter may be used in conjuction with one of either size or type, the size or type filter must follow the name search term
    - Example: `strangename size: >10b` or `awfulname type: folder`
- Bookmark menu
  - By clicking the flag button in the navigation bar at the top you may toggle open the bookmark menu
  - Drag and drop a file or folder from the browser here to setup a easily accessible bookmark
  - Drag and drop shortcuts onto each other to swap the positions and reorder the shortcuts
  - Press the pencil icon next to a shortcut to modify its name
  - Press the tick icon now present to confirm the name change
  - To delete a bookmark drag it to the bin icon at the bottom of the bookmark menu
- Icon View
  - Click the Grid icon in the navigation bar at the top of the page to switch to icon view
  - An alternate presentation of the files which also supports filtering
- Settings Menu
  - The settings menu may be used to clear the locally stored settings created by the extension, which includes the list of bookmarks 				
      persisted in the bookmark menu
  - There are several themes to choose from to recolour the design of the browser to the users preference
- File Preview
  - For Chrome supported files the user may click on them to open them in a preview in the browser
  - This includes all file types with "Video", "Audio" or "Image" labelled under the "Types" column in list view
  - The "Media" file type refers to any known media files (used for sorting, filtering and icon matching) but is *not* supported for file preview
- Breadcrumb
  - The breadcrumb at the top of the browser shows the path to get to the current directory
  - Each parent or ancestor directory is clickable and may be navigated to directly
- Type Column
  - In the list or details view the type column has been added for user convenience as an alternate method of sorting, beyond the already supported sort by "Name", "Date Modified" and "Size"
- Basic FTP Support
  - For URLs prefixed with `ftp://` the extension provides significantly improved usability via the previously described features


## Compilation of the Google Chrome Extension

1. The source files are provided in a folder named "Wadun"
2. Access the Extensions menu in Chrome via "More Tools" followed by "Extensions"
3. Enable developer mode on this page
4. Press the "Load unpacked extension" button and select the folder containing the extension files to load the extension
5. Ensure the Wadun extension is enabled


## Running of the Extension

Once the Google Chrome Extension is loaded into Chrome the user must simply navigate to a URL prefixed with `file:///`

The simplest way to do this is by dragging a folder from the file explorer in your OS (Explorer in Windows, Finder in macOS etc.) into the body of Chrome which will automatically open that folder

Alternatively append `file:///` as the prefix to any standard file path to open it similarly to any other URL in chrome
