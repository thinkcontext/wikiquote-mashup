var Mashup = (function() {
  var m = {};

  /**
   * Remove leading/trailing whitespace from each string in the array
   * and remove empty elements
   */
  function cleanupStrings(arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if(arr[i].trim().length > 0) {
        newArr.push(arr[i].trim());
      }
    }

    return newArr;
  }

  m.mashup = function(quote1, quote2) {
    // Split strings into sentences and clean up
    var arr1 = cleanupStrings(quote1.split('.'));
    var arr2 = cleanupStrings(quote2.split('.'));

    // Take the first half of quote 1
    var len1 = Math.ceil(arr1.length / 2.0);
    arr1 = arr1.slice(0, len1);

    // Take the second half of quote 2
    var len2 = Math.ceil(arr2.length / 2.0);
    arr2 = arr2.slice( -1 * len2);

    // Join strings
    return [arr1.join('. '), arr2.join('. ')].join('. ') + '.';
  }

  return m;
}());

$(document).ready(function(){

  quotes = {};

  /*
  function quoteReady(newQuote, quoteDiv, index) {
    quoteDiv.html($('<p style="display:none;">' + newQuote + '</p>'));
    quoteDiv.find("p:hidden").fadeIn(400);
  }
  */

  function quoteReady(newQuote, quoteDiv, index) {
    if(newQuote.quote.length > 0) {
      quotes['quote' + index] = newQuote.quote;
      quoteDiv.html($('<p style="display:none;">Quote loaded</p>'));
      quoteDiv.find("p:hidden").fadeIn(400);
      $('#search-box' + index).val(newQuote.titles);
    }

    if('quote1' in quotes && 'quote2' in quotes) {
      var mash = Mashup.mashup(quotes.quote1, quotes.quote2);
      $('#mashup').html($('<p>' + mash + '</p>'));
      $('#mashup').append($('<div class="pull-right">-' + 
          $('#search-box1').val() + ' (and ' + $('#search-box2').val() + ')</div>'))
      // $('#mashup').find("p:hidden").fadeIn(400);
    }
  }

    function wq(query,cb){
	WikiquoteApi.openSearch(query,
				function(results){
				    console.log('wq callback',results,cb);
				    var arr = [];
				    for(var i in results){
					arr.push({value: results[i]});
				    }
				    cb(arr);
				});	
    }

    $(".typeahead").typeahead(
	{
	    hint: true,
	    highlight: true,
	    minLength: 3
	},  
	{
	    name: 'wq',
	    displayKey: 'value',
	    source: wq	    
	});

  // $(".search-form").submit(function() {
  //   // Fade out previous quote and mashup
  //   var $quoteDiv = $(this).parent().find(".quotes");
  //   $quoteDiv.find("p").fadeOut(400);
  //   // $('#mashup').find("p:hidden").fadeIn(400);

  //   // Get input field and capitalize the input
  //   var $input = $(this).find("input:text");

  //   // Find index of this input (1 or 2)
  //   var idString = $input.attr('id');
  //   var index = idString.charAt(idString.length - 1);

  //   // Get first search result and use as titles
  //   WikiquoteApi.openSearch($input.val(),
  //     function(results) {
  //       $input.val(results[0]);
  //       // Get quote
  //       WikiquoteApi.getRandomQuote($input.val(), 
  //         function(newQuote) { quoteReady(newQuote, $quoteDiv, index); }, 
  //         function(msg){
  //           alert(msg);
  //         }
  //       );
  //     },
  //     function(msg) {
  //       alert(msg);
  //     }
  //   );
    
  //   return false;
  // });

    $("a.btn").click(function(){
	WikiquoteApi.queryTitles(
	    $('#search-box1').val(),
	    function(page){
		console.log('page',page);
		WikiquoteApi.getSectionsForPage(
		    page,
		    function(sections){
			console.log('sections',sections)
			WikiquoteApi.getQuotesForSection(
			    page,'1',
			    function(quotes){
				console.log('quotes',quotes)
				var qs = quotes['quotes'].join('<br>'); //naughty
				$("#mashup")[0].innerHTML = qs;
				
			    },
			    function(x){console.log('fail',x)});
		    },
		    function(x){console.log('fail',x)})				
	    }, 
	    function(x){console.log('fail',x)})
    });    
});
