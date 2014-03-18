SpeedShare social media buttons
==========

SpeedShare is a JavaScript plugin, which allows you to create nice and extremly fast widgets fro Facebook, Twitter, Google Plus (with ASP.NET MVC, PHP or just using external link). See live <a href="http://yablokov-alex.github.io/SpeedShare/">example</a>

<img src="https://raw.github.com/yablokov-alex/speedshare/master/images/social.jpg" />

## Why SpeedShare is better then other plugins?

1. **Fast**. It loads just one js file and make async JSON calls to each social network. There is no need to load additional images, css or js.
2. **Lightwight**. Just 12 kb
3. **Written on JavaScript**. So there is no dependency on other JS frameworks like jQuery.
4. **Looks good**
5. **Easy to setup**

## How to use

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
## Options

Parameter | Type | HTML | Description
--- | --- | ---
element | String | id | ID of the element, which needs to be initialized.
theme | String | data-theme | Theme of the block. Possible values: 'icon', 'icon-count', 'minimal', 'normal', 'vertical'. By default it's 'minimal'. See example.
shares | Array | data-shares | List of services. The default values: ['facebook', 'twitter', 'vkontakte', 'odnoklassniki', 'gplus']
link | String | data-link | Share link. By default window.location.href
title | Srting | data-title | Share title. By default document.title
gplus | String | data-gplus | Url to get google+ shares count. The resul is JSON like: `services.gplus.cb({"count":5283})`

**Warning!** Please note, that by default google+ uses `http://appleman.com.ua/speedshare/googleplus?url={link}&callback=services.gplus.cb` url to get JSON count info. This link is just for testing and need to be replaced with your own. The example of how to create your own functionality on ASP.NET MVC you can find in 'src' folder.

##Examples

###JavaScript

```html
<div id="test"></div>

@Scripts.Render("~/bundles/speedshare")
<script>
    var share = new SpeedShare({
        element: 'test',
        shares: ['facebook', 'twitter', 'odnoklassniki', 'gplus', 'vkontakte'],
        theme: 'minimal',
        link: 'https://github.com',
        title: 'GitHub',
        gplus: 'http://appleman.com.ua/speedshare/googleplus?url={link}&callback=services.gplus.cb'
    });
    share.Init();
</script>
```

###HTML

```html
<div class="speedshare-auto-init"
     data-theme="icon-count"
     data-gplus="http://appleman.com.ua/speedshare/googleplus?url={link}&callback=services.gplus.cb"
     data-link="https://github.com"
     data-title="GitHub",
     data-shares="facebook,twitter,odnoklassniki,gplus,vkontakte"></div>
```