JavaScript SpeedShare plugin
==========

SpeedShare is a JavaScript plugin, which allows you to create nice and extremly fast widgets fro Facebook, Twitter, Google Plus (with ASP.NET MVC, PHP or just using external link). More information on <a href="http://appleman.com.ua/speedshare">SpeedShare</a>

## Usage

You need add js file:

```html
<script src="speedshare-1.0.0.min.js"></script>
```

And then use one of two aproaches


```html
<div class="speedshare-auto-init" data-theme="minimal"></div>
```

or
```html
<div id="test"></div>
<script>
        var share = new SpeedShare({
            element: 'test',
            shares: ['facebook', 'twitter', 'odnoklassniki', 'gplus', 'vkontakte'],
            theme: 'minimal'
        });
        share.Init();
</script>
```
