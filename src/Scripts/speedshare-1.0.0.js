function SpeedShare(options) {

    // Default Options
    var options = options || {};

    var params = {

        // Common options
        element: options.element,
        language: options.language || "en",
        theme: options.theme || "minimal",
        shares: options.shares || ['facebook', 'twitter', 'vkontakte', 'odnoklassniki', 'gplus'],
        link: options.link || window.location.href,
        title: options.title || document.title,
        gplus: options.gplus || 'http://appleman.com.ua/speedshare/googleplus?url={link}&callback=services.gplus.cb'
    };


    VK = {
        Share: {
            count: function (j, data) {
                services.vkontakte.cb(data)
            }
        }
    };

    ODKL = {
        updateCountOC: function () {
            services.odnoklassniki.cb(arguments[1])
        }
    };

    // Services Info
    services = {

        addCount: function (service, count) {
            var counters = document.getElementsByClassName('b-share-counter-' + service);

            for (var counterName in counters) {
                counters[counterName].innerHTML = numberSeparator(count);
            }

            // add spaces to numbers, like 1 000 000
            function numberSeparator(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            }
        },

        facebook: {
            url: 'https://api.facebook.com/method/fql.query?query=select%20%20like_count%2C%20total_count%2C%20share_count%2C%20click_count%20from%20link_stat%20where%20url=%22{link}%22&format=json&callback=services.facebook.cb',
            popupUrl: 'https://www.facebook.com/sharer/sharer.php?src=sp&u={link}&t={title}&description&picture',
            popupWidth: 600,
            popupHeight: 500,
            type: "jsonp",
            title: 'Share',
            cb: function (data) {
                data = data[0] || data;
                services.addCount('facebook', parseInt(data.total_count));
            }
        },

        vkontakte: {
            url: 'http://vk.com/share.php?act=count&index=0&url={link}',
            popupUrl: 'http://vk.com/share.php?url={link}&title={title}&description=&image=',
            popupWidth: 550,
            popupHeight: 330,
            type:"jsonp",
            title: 'Share',
            cb:function(data) {
                services.addCount('vkontakte', parseInt(data))
            }
        },

        twitter: {
            url: 'http://urls.api.twitter.com/1/urls/count.json?url={link}&callback=services.twitter.cb',
            popupUrl: 'http://twitter.com/intent/tweet?url={link}&text={title}',
            popupWidth: 600,
            popupHeight: 450,
            type: 'jsonp',
            title: 'Tweet',
            cb: function (data) {
                services.addCount('twitter', parseInt(data.count))
            }
        },

        odnoklassniki: {
            url: 'http://connect.odnoklassniki.ru/dk?st.cmd=extOneClickLike&uid=odklocs0&ref={link}',
            popupUrl: 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&amp;st._surl={link}&amp;title={title}',
            popupWidth: 550,
            popupHeight: 440,
            type: 'jsonp',
            title: 'Share',
            cb:function(i){
                services.addCount('odnoklassniki', parseInt(i))
            }
        },

        gplus: {
            url: params.gplus,
            popupUrl: 'https://plus.google.com/share?url={link}',
            popupWidth: 700,
            popupHeight: 500,
            type: 'jsonp',
            title: 'Share',
            cb: function (data) {
                var i = data.count;
                services.addCount('gplus', i > 9999 ? "9999+" : i)
            }
        },

        getCount: function (service) {

            var url = services[service].url.replace('{link}', encodeURIComponent(params.link));
                callJSONP(url);

            function callJSONP(url) {
                var head = document.getElementsByTagName('head')[0];
                var scriptTag = document.createElement('script');
                scriptTag.src = url;
                scriptTag.async = true;
                scriptTag.type = 'text/javascript';

                head.appendChild(scriptTag);
                head.removeChild(scriptTag);
            }
        }

    };

    this.Init = function () {
        if (params.element) {
            var htmlElement = document.getElementById(params.element);
            buildButtons(htmlElement);
        }

        if (params.theme != 'icon') {
            for (var i = 0; i < params.shares.length; i++) {
                services.getCount(params.shares[i]);
            }
        }
        
        
       

        function buildButtons(htmlElement) {
            var html = '<span class="b-share b-share-type-' + params.theme + '">';

            for (var i = 0; i < params.shares.length; i++) {
                var shareName = params.shares[i];
                html += buildButton(shareName);
            }

            html += '</span>';
            htmlElement.innerHTML = html;
        }

        function buildButton(shareName) {

            template = '<span class=\"b-share-btn-wrap\" onclick=\"window.open(\'{popupUrl}\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width={popupWidth}, height={popupHeight}, toolbar=0, status=0\');return false\">\n';
            switch (params.theme) {

                case 'icon':
                    template += '<a href=\"#\" target=\"_blank\" title=\"{share}\" class=\"b-share-link b-share-link-{share}\" data-service=\"{share}\">\n' +
                                    '<span class=\"b-share-icon b-share-icon-{share}\"></span>\n' +
                                '</a>\n';

                    break;
                case 'normal':
                    template += '<a href=\"#\" target=\"_blank\" title=\"{share}\" class=\"b-share-link b-share-link-{share}\" data-service=\"{share}\">\n' +
                                    '<span class=\"b-share-icon b-share-icon-{share}\"></span>\n' +
                                    '<span class=\"b-share-counter\">Share</span>\n' +
                                '</a>\n' +
                                '<span class=\"share-button-counter b-share-counter-{share}\">0</span>\n';
                    break;
                case 'vertical':
                    template += '<span class=\"share-button-counter b-share-counter-{share}\">0</span>\n' +
                                    '<a href=\"#\" target=\"_blank\" title=\"{share}\" class=\"b-share-link b-share-link-{share}\" data-service=\"{share}\">\n' +
                                        '<span class=\"b-share-icon b-share-icon-{share}\"></span>\n' +
                                        '<span class=\"b-share-counter\">Share</span>\n' +
                                    '</a>\n';
                    break;
                case 'icon-count':
                    template += '<a href=\"#\" target=\"_blank\" title=\"{share}\" class=\"b-share-link b-share-link-{share}\" data-service=\"{share}\">\n' +
                                    '<span class=\"b-share-icon b-share-icon-{share}\"></span>\n' +
                                '</a>\n' +
                                '<span class=\"share-button-counter b-share-counter-{share}\">0</span>\n';
                    break;
                case 'minimal':
                default:
                    template += '<a href=\"#\" target=\"_blank\" title=\"{share}\" class=\"b-share-link b-share-link-{share}\" data-service=\"{share}\">\n' +
                                    '<span class=\"b-share-icon b-share-icon-{share}\"></span>\n' +
                                    '<span class=\"b-share-counter b-share-counter-{share}\">0</span>\n' +
                               '</a>\n';
                    break;
            }

            template += '</span>\n';

            return template
                .replace(/{share}/g, shareName)
                .replace(/{popupUrl}/g, services[shareName].popupUrl)
                .replace(/{link}/g, encodeURIComponent(params.link))
                .replace(/{title}/g, encodeURIComponent(params.title))
                .replace(/{popupWidth}/g, services[shareName].popupWidth)
                .replace(/{popupHeight}/g, services[shareName].popupHeight);
        };

    };
}

SpeedShare.addStyle = function (str) {
    var style = document.createElement("style");
    style.type = "text/css";
    style.id = "speedshare_style";
    if (style.styleSheet) {
        style.styleSheet.cssText = str
    } else {
        style.appendChild(document.createTextNode(str))
    }
    str = "";
    document.getElementsByTagName('head')[0].appendChild(style);
};

SpeedShare.css = ".share-button-counter{font-family:'Open Sans',arial,sans-serif !important;background:#e6e7e9;color:#666 !important;position:relative;cursor:pointer}.b-share-type-icon .share-button-counter,.b-share-type-icon-count .share-button-counter,.b-share-type-minimal .share-button-counter,.b-share-type-normal .share-button-counter{display:inline-block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;font-size:11px !important;vertical-align:top;line-height:20px !important;margin-left:3px;height:20px;padding:0 10px;-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px}.b-share-type-vertical .share-button-counter{display:block;font-size:15px !important;line-height:35px !important;text-align:center;width:57px;height:35px;padding:0;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;margin-bottom:9px}.b-share .share-button-counter:after{content:'';position:absolute;border-style:solid;border-color:transparent #e6e7e9;display:block;width:0;z-index:1}.b-share-type-icon .share-button-counter:after,.b-share-type-icon-count .share-button-counter:after,.b-share-type-minimal .share-button-counter:after,.b-share-type-normal .share-button-counter:after{border-width:5px 5px 5px 0;left:-5px;top:5px}.b-share-type-vertical .share-button-counter:after{border-width:5px 5px 0;bottom:-5px;left:22px;border-color:#e6e7e9 transparent}.b-share-type-vertical .b-share-btn-wrap{display:block;width:57px;padding:0}.b-share-type-vertical .b-share-btn-wrap:first-child{margin-top:0}.b-share-type-vertical .b-share-btn-wrap:not(:first-child){margin-top:8px}.b-share .b-share-link{padding:2px 5px 0 0;border-radius:3px;color:#fff;text-decoration:none;font:11px Arial,sans-serif;height:18px;display:inline-block}.b-share-icon{width:17px;height:18px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAADGCAYAAADfYdBuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzAwRjRDQjNBNTM0MTFFMkJBQzA4QUNBM0ZCMjkxQkYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzAwRjRDQjRBNTM0MTFFMkJBQzA4QUNBM0ZCMjkxQkYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFNDNGNDU4QUE1MzIxMUUyQkFDMDhBQ0EzRkIyOTFCRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3MDBGNENCMkE1MzQxMUUyQkFDMDhBQ0EzRkIyOTFCRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi4TyhQAAAUBSURBVHja7Jt/aJVVGMffu5X9mL+rZbOMqbNVYn9Yiv0Ay4kYejNxqVlxoyhQkP5oGgSRVkywqH8KBkW3RpEFum5JuQmZWuacSAgG6VYuK8ul2Exzc759n73fF07v3h/n3HsxGueBz3vvPe97vzvnOWfv85xz3ptyXdcphpU4RbKiCV2UcP4q8Aq4SSmbB44OuFJ8FEOzO9DGhV0bV6NScA/fSw3WgTPgeOjVMbUpVWrxRkLNY53dp7w/meTsVMQ4ihtc14POCz6OUsS3dUpZ5/9jZA9ioaR/2pT1kRWyQlboP78fZdMzcFwK7mCc2w4+cDK5Vr0AmU2X4dgI7gffUOAScC+oAhtABoJ/Rwtl0xfjuAXcDOaCv8Ct4Bj4Esyi0DZwH8TORzUtA+4GN4CZ4HVwGAwHXaAdPAXeBGnQFOXsFeB9MBQ09Dcnk5uI17FgF5Osr8En4NG4XpMmbQXL+r+QybV49cz14rgWnKXjxeF3xQmdY9m5iMTLjyqXB9KeAUJtYD54G8yA8+exE4bhuB4MoZg4/Ys4oVf7e8Nxyvn6LkR+wKtwDXtPBKexI2LH0Ts4Pkxn7mFidQIcBMvBk+A1+O3l5Iwtm67HsQ7IoNsPLgOTwBQIHDJJ/URsPI6zwWRwnt2+CUI9ZkL2fmSFrJAVstlIuMlttjakXILnXpMFhBo32mpNFxB8ewY8wJAk9kS+PpKmfAQ6+Lkj36a1EbF2MCrfpjls1gl2QkO+NaphWa1SNjXfGomNinhv5KMW5XN72HdMx9GHYHzYd2zst0JWyApZoQsudDUneUGbAHJAJn31nGHfHhdFngd7wHClrAQcDAkEL8ZFkaW86GewAlwJqkJEfgcT44Qmg1+UL5wFnSFCXyVF2mpOy32Tef51IT7r0Im0sivT68bbAp1IOzdBZL9JyH48wjc94Bad3awb6adKMDJwTjZWloBvdbJa+VwD5oAeLkJ9Bz6VJQWucDl2AcEKWSErZIWKJSRrtLKm/xtpYpljMqctZ9h2GeN6lVBebjLLfghUgGbH2wup4vsKntNu2gS+SnN+JE2Bc1qLLLsdbzV9JfiVZSuVc9o+Ko14ZqSZ57Qnx1eAEY637TOTZdvAZ473xMYfugFSdh0uBW+BAyyTx2Iec7x9gErdpjXGZCONJtmIMB0cUQSOsMz4SZbFjrf55NtYlhmN7HrWohvMJt0sqzepkez6/QQWghaykGVlNq2xQlbICg02ITdKSHbKW3mBymmwGTytJ+/Z95yr3qas759RVtdV3KhwJDZFKRypLCJ0KF+Osn8JBf/CGuXCoTo1KolIVdoCEUW711YHyv3HX3cx7dN2ttgqUAaqwWkGxOqkh05VH9Upqw5+ND0aXNbRERKGcXehlULLTURUZ3dzKaeLnx9hfmT8LyKv14Kd/Dwd7AhkI4nO3szmdIF94E+lA2RgVuj6SOwFLosNAZVcjPJto67QrIiTL4FjYCtIJQnZtMYKWaFBKDSVN7mNYDRp0J1mqTQo96YMf1Th5rMp/jk45Xg/rJBbsTzz15fPNMt/jFHExoE1nDAv0W2azO8/DiQMsivxHhhtMjl+kNnINPAcOJzvzzzkKdYsk7CeQrpffq0yRnccxT3n38j0pi905cFwHD3LzGR3IT4Su5M121SIjyTZkuch1xf6v1bH9PhQIc6WX0At4vqR34On4oRsyLZCxbB/BBgAEdQZthiuPJ0AAAAASUVORK5CYII=);display:inline-block}.b-share-btn-wrap{padding-right:5px}.b-share-counter{padding-left:2px;display:inline-block;height:18px;vertical-align:5px}.b-share .b-share-link-vkontakte{background-color:#48729e}.b-share .b-share-link-vkontakte:hover{background-color:#3a5b7e}.b-share-icon.b-share-icon-vkontakte{background-position:0 -58px}.b-share .b-share-link-facebook{background-color:#3c5a98}.b-share .b-share-link-facebook:hover{background-color:#30487a}.b-share-icon.b-share-icon-facebook{background-position:0 0}.b-share .b-share-link-twitter{background-color:#00aced}.b-share .b-share-link-twitter:hover{background-color:#008abe}.b-share-icon.b-share-icon-twitter{background-position:0 -87px}.b-share .b-share-link-odnoklassniki{background-color:#ff9f4d}.b-share .b-share-link-odnoklassniki:hover{background-color:#cc7f3e}.b-share-icon.b-share-icon-odnoklassniki{background-position:0 -116px}.b-share .b-share-link-gplus{background-color:#c25234}.b-share .b-share-link-gplus:hover{background-color:#9b422a}.b-share-icon.b-share-icon-gplus{background-position:0 -145px}";

// Extend element functionality
// ******************************
Element.prototype.data = function () {
    var attr = this.attributes;

    var data = {
        shares: attr['data-shares'] && attr['data-shares'].nodeValue.split(','),
        theme: attr['data-theme'] && attr['data-theme'].nodeValue,
        link: attr['data-link'] && attr['data-link'].nodeValue,
        title: attr['data-title'] && attr['data-title'].nodeValue,
        gplus: attr['data-gplus'] && attr['data-gplus'].nodeValue
    };
    return data;
};


// On load
// ******************************
var DOMReady = function (a, b, c) { b = document, c = 'addEventListener'; b[c] ? b[c]('DOMContentLoaded', a) : window.attachEvent('onload', a) };

DOMReady(function () {
    SpeedShare.addStyle(SpeedShare.css);

    var autoInits = document.getElementsByClassName('speedshare-auto-init');

    for (var i = 0; i < autoInits.length; i++) {
        var item = autoInits[i];
        
        var id = 'speedshare-' + i;
        item.setAttribute('id', id);

        var options = item.data();
        options.element = id;



        var share = new SpeedShare(options);
        share.Init();
    }

    
});