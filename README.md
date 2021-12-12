# tables-of-data
###### Author: Rob Watson
###### Current version: *unreleased*
###### Since: 12-dec-2021

(working title) `{{tables-of-data}}` is a cut-down, vanilla JS library that enables sorting pagination, searching, and fetching of data into HTML tables


# Background
At my place of work, we use the jQuery plugin DataTables to display and interact with data.  Something we're keen to do is remove the jQuery library from our codebase because modern browsers include the majority of features that jQuery provides in a native way. In addition, the current version of jQuery (3.6.0 as of December 2021) is 87kb in its minified form, DataTables is a further 86kb.  That's *173kb* of JavaScript that we don't really need.


# Goals
`{{tables-of-data}}` must:
1. **Be a drop-in replacement for DataTables**.  Mirror as closely as I can the initialisation and usage of `{{tables-of-data}}` and DataTables, except where a change makes sense.
2. **Be user friendly**.  Loading spinners and helpful hints will be sprinkled wherever necessary for the end-user, and exceptions will be thrown with useful messages during usage to aid developers.
3. **Be basic**.  No dependencies of any kind are allowed, code must be easy to read obvious to follow.  Additionally, `{{tables-of-data}}` will only have the features that my workplace uses with DataTables.  Community requests and additions can come later.
4. **Be fast**.  It is imperative that there is no noticable slowdown in usage compared to DataTables, and with the reduced feature set there's no reason why `{{tables-of-data}}` can't be faster.


# Usage
## Initialisation
`{{tables-of-data}}` can be initialised in 3 ways:
1. By specifying a target container (that is not a table) and providing options to allow a table element and ancillary elements to be created as child nodes to the container.
2. By specifying an existing empty table element and providing options to allow that table to be populated and have ancillary elements around it created.
3. By specifying a populated table and having ancillary elements created around it.

```
const table = document.getElementByID('tables-of-data')
const options = {
   dataSource: {
      url: '/api/source.json',
      method: 'GET'
   },
   sorting: true,
   pagination: true,
   searching: true
}
TablesOfData.initialise(table, options)
```

In this example above, we pass in a HTML table element which `{{tables-of-data}}` will identify as being a table ready to use.  If we had passed in a different element (e.g. a `<div>`) then `{{tables-of-data}}` would know to create all required elements.  The options object passed in specifies a data source so we also know that we need to fetch that resource as well.  If we omitted the data source property, `{{tables-of-data}}` would know to use any data currently in the table.


## Rendering callbacks
The first priority will be a system of callbacks for rendering columns.  A user can specify which columns use a rendering callback function that could look like this:

```
function renderPriceInPounds(initialValue) {
   return '&pound;' + parseFloat(initialValue/100).toFixed(2)
}
```

Deliberately left simple - the render function accepts the value that would be displayed if the render function wasn't in use, and expects a string to be returned with a transformed value.

> Note: The string returned can be HTML, which allows you to add links, fancy formatting, and other code to your tables


## Event system
The next priority is a simple event system so developers can hook into certain parts of the `{{tables-of-data}}` internals.  Some examples of useful events are:

1. `fetchStart`, `fetchEnd`, `fetchError`.  These can be used to trigger loading overlays or disable buttons for the duration of a load.  These events may be triggered during pagination changes, sorting, or general initialisation.  The `fetchError` event is only triggered if exceptions occur during the fetch, *not* if a non-200 error response is received.
2. `destroy`.  If you manually tear down a `{{tables-of-data}}` instance, this event can be used to tidy up any dependencies in your code that may remain.

Events are always triggered _after_ the internal handler has completed.  For example, fetchStart will display a loading spinner in the `{{tables-of-data}}` table, any user specified fetchStart handler will be called after that loading spinner is displayed.

Events can be added in 2 ways:  Provided as part of the options object during initialisation, or added through the addEventListener property on the TablesOfData object.

```
const options = {
   events: {
      fetchStart: myFetchStartHandler
   }
}
TablesOfData.initialise(..., options)

// or...
TablesOfData.instance(element).addEventListener('fetchStart', myFetchStartHandler)

// or...
const table = document.getElementById('tables-of-data')
table.TablesOfData.addEventListener('fetchStart', myFetchStartHandler)
```
