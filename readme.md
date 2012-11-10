# extended-local-storage
extended-local-storage enables use different origin local storage.

## Getting started
* load extended-local-storage.x.x.x.js in your main HTML file.
* after loading extended-local-storage-x.x.x.js, make "ExtendedLocalStorage" instance with iframe HTML file path in different origin.
* in different origin HTML file, load extended-local-storage-permissions.js and extended-local-storage-iframe.x.x.x.js
* in extended-local-storage-permissions.js, set urls you want to permit to access your domain's localstorage.
* And then, you can use "extendedLocalStorage.setItem()" and "ExtendedLocalStorage.getItem()".

## Release History
* 2012/11/09 - v0.1.0 - Initial release.

## License
Copyright (c) 2012 "thujikun" Ryosuke Tsuji  
Licensed under the MIT license.  
<https://github.com/thujikun/extended-local-storage/blob/master/LICENSE-MIT>
