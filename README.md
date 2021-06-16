## ColorSort

This is a sorter made in [p5.js](https://p5js.org/) that randomly generates a set of colors according to your settings and then sorts them based on your choices. You can test it out here: https://techiew.github.io/ColorSort/

[quicksettings.js](https://github.com/bit101/quicksettings) was used for the UI. The sorting algorithm I used is heapsort. Please note that this sorts based on RGB values, so that a color which is white (255, 255, 255) can be sorted next to something that is fully red (255, 0, 0) in the event that you sort by red.

![Preview](https://github.com/techiew/ColorSort/blob/master/preview.png)
