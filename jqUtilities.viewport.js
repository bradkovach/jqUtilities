/*
	jqUtilities
	Viewport Sizing Utilities

	These functions are used for sizing and positioning elements in ways that are not possible with CSS.

	@requires: jQuery 1.9 or higher

	---- ---- ---- ---- ---- ---- ---- ----
	USAGE
	---- ---- ---- ---- ---- ---- ---- ---- 

	jqu_log: centralizes error reporting
		parameters:
			$message: a message to be logged
		variables:
			(boolean) $debug: can be toggled to enable or disable logging
			(string) $method: determines how debugging messages are displayed
				console:  outputs $message to console.log
				element: appends $message to an element specified by $selector
				alert: outputs $message to an alert window
			(string) $selector: a valid CSS selector for an element.  Used when $method is "element"

	.js-vh: Viewport Height positioning
		required classes:
			js-vh
		required attributes:
			data-vh: a numeric value greater than 0 (zero).  1vw is 1% of the viewport's height.
		example:
			<div class="js-vh" data-vh="50"
				<!-- this will be half the height of the viewport -->
			</div>
		output:
			via jqu_log: reports new height in vh
			via jqu_log: reports when requested vh is invalid

	.js-vw: Viewport Width positioning
		note:
			this should only be needed if the element has a parent and vw sizing is impossible with CSS.
			if the element has BODY as its parent, then using CSS's width is preferred.
		required classes:
			js-vw
		required attributes:
			data-vw: a numeric value greater than 0 (zero).
		example:
			<div class="js-vw" data-vw="50">
				<!-- this will be half the width of the viewport -->
			</div>
		output:
			via jqu_log: reports new width in vw
			via jqu_log: reports when requested vw is invalid

	.jq-letterbox: enforces strict 16:9 letterbox sizing
		note:
			this will fill the element to 100% of its parent's width
		required classes:
			js-letterbox
		required attributes:
			(none)
		example:
			<div class="jq-letterbox">
				<!-- this box will be in a 16:9 ratio -->
			</div>
		output:
			(none)

	.jq-margin-vcenter: adjusts the elements margins to center the element vertically inside of its parent
		note:
			absolute or relative positioning may be required.  floating may also be necessary.
		required classes:
			js-margin-vcenter
		required attributes:
			(none)
		example:
			<div class="jq-margin-vcenter">
				<!-- this will be vertically centered in its parent. -->
			</div>
		output:
			via jqu_log: reports if vertical centering is impossible.
*/

function jqu_log($message = null) {
	var $debug = true,
		$method = "console"
		$selector = null;

	if (!$debug) {
		return true;
	}

	if( $method == "console" ) {
		console.log($message);
	} else if ( $method == "element" ) {
		if ($selector != null) {
			$($selector).append($message);
		}
	} else if ( $method == "alert" ) {
		alert($message);
	}
}

function jqu_vhvw($window){

	$('.js-vh').each(function(){
		var $this = $(this);
		var $height = $this.attr('data-vh');

		if( $height >= 0 ) {
			jqu_log("resizing element to " + $height + "vh")
			$this.height( $window.height() * ($height/100) );
		} else {
			jqu_log("element not resized.  data-vh not set, not numeric, or is less than 0");
		}

	});

	$('.js-vw').each(function(){
		var $this = $(this);
		var $width = $this.attr('data-vw');

		if ( $width >= 0 ) {
			jqu_log("resizing element to " + $width + "vw");
			$this.width( $window.width() * ($width/100) );
		} else {
			jqu_log("element not resized.  data-vw not set, not numeric, or is less than 0");
		}
	});

	$('.js-letterbox').each(function(){
		var $this = $(this);

		$this.css("width", "100%");
		$this.height( $this.width()*(9/16) )

		jqu_log("calculated ratio: " + $this.width()/$this.height() )
	});

	$('.js-margin-vcenter').each(function(){
		var $this = $(this);
		var $parent = $this.parent();

		if( $this.siblings().length > 0 ) {
			jqu_log("element has siblings; vertical centering may not work correctly.");
		}

		jqu_log("parent height: " + $parent.height() );
		jqu_log("element height: " + $this.height() );

		if( $parent.height() > $this.height() ) {
			$this.css("marginTop", ( $parent.height() - $this.height() ) /2 );
		} else {
			jqu_log("vertical center not possible.  element is taller than its parent.");
		}
	});

}

$(document).ready(function(){

	var $window = $(window);

	jqu_vhvw( $window );

	$window.resize(function(){
		jqu_vhvw($window);
	});

});