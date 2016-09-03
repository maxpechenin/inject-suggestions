
(function($){
    'use strict';
    var $searchField = $('#header-search_input'),
        $suggest = $('.auto-suggestion'),
        $form = $('.quick-search-component'),
        $loadMore = $('.auto-suggestion_more'),
        searchThreshold = 3,
        showMoreThreshold = 2,
        urls = {
            all: {
                url: 'http://40.127.88.96/search',
                param: 'q'
            },
            web: {
                url: 'http://40.127.88.96/search',
                param: 'k'
            },
            item: {
                url: 'http://40.127.88.96/search',
                param: 'k'
            },
            cash: {
                url: 'http://40.127.88.96/search',
                param: 'k'
            }
        };

    var handleKeydown = function(e) {
        if (e.keyCode === 27) {
            clearLists();
            $searchField.val('');
            $suggest.removeClass('open');
        }
    }

    $searchField.on('keyup blur', function() {
        var value = $searchField.val();
        if (value.length >= searchThreshold) {
            searchData(value, 'all');
            $suggest.addClass('open');
        } else {
            $suggest.removeClass('open');
        }
        for (var type in urls) {
            if (type !== 'all') {
                $('.auto-suggestion_more[data-type="' + type + '"]').attr('href', urls[type].url + '?' + urls[type].param + '=' + value);
            }
        }
    });

    $form.on('submit', function(e) {
        e.preventDefault();
        var value = $searchField.val();
        searchData(value, 'all');
        $suggest.addClass('open');
    });

    document.addEventListener('keyup', handleKeydown);

    var lists = {
        web: {
            tpl: $('#keyword_template').html(),
            $container: $('.auto-suggestion_keyword'),
            $list: $('.auto-suggestion_keyword ul')
        },
        item: {
            tpl: $('#people_template').html(),
            $container: $('.auto-suggestion_people'),
            $list: $('.auto-suggestion_people ul')
        },
        cash: {
            tpl: $('#document_template').html(),
            $container: $('.auto-suggestion_documents'),
            $list: $('.auto-suggestion_documents ul')
        }
    }


    function clearLists() {
        for (var i in lists) {
            lists[i].$list.html('');
            lists[i].$container.removeClass('auto-suggestion-more-active');
        }
    }

    function fillLists(data) {
        for (var j = 0; j < data.view.hits.hits.length; j++) {
            lists[data.key].$list.append(Mustache.render(lists[data.key].tpl, data.view.hits.hits[j].highlight));
        }
        if (data.view.hits.hits.length >= showMoreThreshold) {
            lists[data.key].$container.addClass('auto-suggestion-more-active')
        }
    }

    function searchData(query, type){
        var data = {};
        data[urls[type].param] = query;
        $.ajax({
            url: urls[type].url,
            contentType: 'application/json',
            dataType: 'jsonp',
            data: data,
            success: function(data)
            {
                if (query === $searchField.val()) {
                    clearLists();
                    for (var i = 0; i < data.aggregations.suggestions.buckets.length; i++) {
                        fillLists(data.aggregations.suggestions.buckets[i]);
                    }
                }
            }

        });

    }
})(jQuery);