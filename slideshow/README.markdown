A basic jQuery image slideshow with captions, controls, and linked images/caption support.  Uses rgba for the caption bar if the browser supports it,
otherwise it'll fall back to opacity.  IE cannot animate the RGBA gradient filter hack smoothly, so we're stuck with opacity for now.

If you want internal controls built into the slideshow (see controls.png and the originals file, controls.psd) you can with the `controls` option.  otherwise, this 
slideshow plugin does not depend on any images.  control images are from the fantastic famfamfam silk icon set.

## usage

Create HTML:

	<div style="height:425px">
		<a href="somepage1.htm"><img src="http://placehold.it/960x425/d18888/000" alt="" title="Test Caption 1" /></a>
		<a href="somepage2.htm"><img src="http://placehold.it/960x425/9fd188/000" alt="" title="Test Caption 2" /></a>
		<a href="somepage3.htm"><img src="http://placehold.it/960x425/8892d1/000" alt="" title="Test Caption 3" /></a>
	</div>
	
init JS:

	$("#slideshow").slideshow();
	
six methods are available: `start`, `stop`, `next`, `prev`, `move`, and `isRunning`.  Call by passing in the method name:

	var elem = $("#slideshow").slideshow();
	
	// stop slideshow if it's running
	if( elem.slideshow("isRunning") ){
		elem.slideshow("stop");
	};
	
## options

	delay
length of time in ms between each image.  default: 6000

	speed
fade speed in ms.  default: 1000

	controls
whether or not to internally include prev/next/pause/resume controls in the slideshow.  default: true

	onChange
a callback function to fire after a slide is changed.  `this` in the callback refers to the element the slideshow plugin was called in.  this function
takes 1 argument `index`, which denotes the index of the current slide.
