/**
 * TablesOfData.js
 * @author Rob Watson
 * @version 0.0.0
 * @license  GPL-3.0 License (see https://github.com/source-pot/tables-of-data/blob/main/LICENSE)
 */

function TablesOfData()
{
   return {
      initialise: function(element, options) {
         // implement 3 ways to play
      },
      instance: function(element) {
         return (
            element instanceof string
               ? document.getElementById(element).TablesOfData
               : element.TablesOfData
         )
      }
   }
}