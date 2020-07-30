
function numColorsChanged(value) {
    numColors = value;
}

function redMaxChanged(value) {
    redMax = value;
}

function redMinChanged(value) {
    redMin = value;
}

function greenMaxChanged(value) {
    greenMax = value;
}

function greenMinChanged(value) {
    greenMin = value;
}

function blueMaxChanged(value) {
    blueMax = value;
}

function blueMinChanged(value) {
    blueMin = value;
}

function generateClicked(button) {
    genMenu.hide();
    sortMenu.show();
    generateColors();
}

function redChanged(value) {
    sortByRed = value;
}

function greenChanged(value) {
    sortByGreen = value;
}

function blueChanged(value) {
    sortByBlue = value;
}

function hueChanged(value) {
    sortByHue = value;
}

function saturationChanged(value) {
    sortBySaturation = value;
}

function brightnessChanged(value) {
    sortByBrightness = value;
}

function similarityChanged(value) {
    sortBySimilarity = value;

    if(value) {
        sortMenu.showControl("Colors similar to");
    } else {
        sortMenu.hideControl("Colors similar to");
    }

}

function similarityColorChanged(value) {
    sortBySimilarityColor = value;
}

function sortClicked(button) {
    sortMenu.hide();
    runMenu.show();
    startSort = true;
}

function speedChanged(value) {
    speed = value;
}

function sortAgainClicked(button) {
    sortMenu.show();
    runMenu.hide();
    startSort = false;
    resetState();
}

function generateNewClicked(button) {
    genMenu.show();
    runMenu.hide();
    startSort = false;
}

function smoothClicked(button) {

    for(let i = 0; i < 5; i++) {
        smoothPass();
    }

}
