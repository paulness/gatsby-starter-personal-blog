---
title: Autocomplete with static files [4/4] - Implementing autocomplete with generated static files
subTitle: At this stage, we should have already have generated our 'data source' of autocomplete JSON files. We can now finally implement a working text box with autocomplete functionality, which consumes these files.
cover: demo-in-action.jpg
category: autocomplete
---

This post finalizes the autocomplete series; you will be creating a textbox with autocomplete. The autocomplete will retrieve its data from pre-generated static files in a folder on a web server, as opposed to a server API with searching capabilities.

### Dynamic content vs static content

On a traditional web server when a user searches for JO, something similar to the following will occur:

1. The client sends a search request to the server, containing the partial word the user has typed. e.g., JO
2. The partial word is then extracted, by server-side website/API code
3. Database queries would be made to find records starting with JO
4. Any results would then be returned to the user

``` javascript
var userSearchedFor = "JO";
var normalUrl =
"http://www.javaserver.com/searchCustomer?name=" + encodeURIComponent(userSearchedFor.toUpperCase());
```

With static file autocomplete, the flow is as follows:

1. Request made to the server
1. We are looking for an exact file called JO or JO.json
1. If that file exists, we return the file contents, which have already been prepared for us
1. If it doesn't exist (404), we must assume there are no results for JO.

``` javascript
var userSearchedFor = "JO";
var searchUrl =
"http://your-server.com/static-autocomplete-files/customers/" + encodeURIComponent(userSearchedFor.toUpperCase()) + '.json';
```

### Demo in action

<iframe src="https://rawgit.com/paulness/AutocompleteUsageWithStaticFiles/master/index.htm" style="width:100%; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### Snippet source code

[Edit on GitHub](https://github.com/paulness/AutocompleteUsageWithStaticFiles)

``` javascript
    <link rel="stylesheet" href="autocomplete/auto-complete.css" />
    <div>
        <label for="txt-autocomplete">Start typing: </label>
        <input id="txt-autocomplete" />
    </div>
    <script src="autocomplete/auto-complete.min.js"></script>
    <script>
        var xhr;
        new autoComplete({
            selector: document.getElementById('txt-autocomplete'),
            minChars: 1,
            delay: 0,
            source: function (term, response) {
                try { xhr.abort(); } catch (e) { }
                xhr = new XMLHttpRequest();
                xhr.open("GET", "autocomplete/results/" + term.toUpperCase() + ".json", true);
                xhr.onload = function () {
                    if (xhr.status == 200) {
                        response(JSON.parse(xhr.responseText));
                    }
                }
                xhr.send();
            },
            renderItem: function (item, search) {
                return '<div class="autocomplete-suggestion" data-countryregion="' + item.additionalInfo.region + '">' + item.results + '</div>';
            },
            onSelect: function (e, term, item) {
                alert('You have selected ' + item.innerHTML + '. Which is in the region: ' + item.getAttribute('data-countryregion'));
            }
        });
    </script>
```

Dependencies:

* [AutoCompleteJs](https://goodies.pixabay.com/javascript/auto-complete/demo.html)