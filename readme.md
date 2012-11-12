# extended-local-storage
extended-local-storage enables to use different origin local storage.

## Getting started
* load extended-local-storage.x.x.x.js in your main HTML file.
* after loading extended-local-storage-x.x.x.js, make "ExtendedLocalStorage" instance with iframe HTML file path in different origin.
* in different origin HTML file, load extended-local-storage-permissions.js and extended-local-storage-iframe.x.x.x.js
* in extended-local-storage-permissions.js, set urls you want to permit to access your domain's localstorage.
* And then, you can use "extendedLocalStorage.setItem()" and "ExtendedLocalStorage.getItem()".

## Demo
* http page to https page access sample is [here](http://kabocha.orz.hm/test/extended-local-storage.html)
* https page to http page access sample is [here](https://kabocha.orz.hm/extended-local-storage.html)

## sample code

### your main html
```shell
<script src="extended-local-storage-0.1.0.min.js"></script>
<script>
    var exLocalStorage = new ExtendedLocalStorage("http://otherdomain.com/iframe.html");

    /** set http://otherdomain.com`s local storage */
    exLocalStorage.setItem('foo', 'bar', function(){
        // do something after setItem
    });

    /** get http://otherdomain.com`s local storage */
    exLocalStorage.getItem('hoge', function(value){
        // do something after getItem and 1st argument is local storage`s value
    });
</script>
```
### extend-local-storage-permissions.js
```shell
;var extendedLocalStoragePermissions = [
    'http://yourdomain.com'
];
```
### your other domain file for local storage
```shell
<script src="extended-local-storage-permissions.js"></script>
<script src="extended-local-storage-iframe-0.1.0.min.js"></script>
```

## Support Browsers
Internet Explorer8+  
Chrome  
Firefox  
Safari  
Opera  
Mobile Safari  
iphone Chrome  
Android browser  
Android Chrome  

## License
Copyright (c) 2012 "thujikun" Ryosuke Tsuji  
Licensed under the MIT license.  
<https://github.com/thujikun/extended-local-storage/blob/master/LICENSE-MIT>
