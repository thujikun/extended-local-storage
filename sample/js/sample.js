;!function(){
    var exStorage = new ExtendedLocalStorage('http://example2.com/');
    exStorage.setItem('test', 'yeah!', function() {
        exStorage.getItem('test', function(value) {
            console.log(value);
        });
    });
}.call(window);