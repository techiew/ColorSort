
var numColors = 10000;
let colors = [];
let size = 0;

// Heap sort state
let startSort = false;
let currentNode = 0;
let heapLength = 0;
let throttle = 30;
let arrayAccesses = 0;
let comparisons = 0;

// UI state
var genMenu;
var sortMenu;
var runMenu;

var redMin = 0;
var redMax = 255;
var greenMin = 0;
var greenMax = 255;
var blueMin = 0;
var blueMax = 255;

var sortByRed = true;
var sortByGreen = true;
var sortByBlue = false;
var sortByHue = false;
var sortBySaturation = false;
var sortByBrightness = false;
var sortBySimilarity = false;
var sortBySimilarityColor = "#007efd";

var speed = 1;

let infoText = "";
let progressPercent = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();

    genMenu = QuickSettings.create(windowWidth / 2 - 75, windowHeight / 2 - 250, "Generate the colors");
    genMenu.addNumber("Number of colors", 0, 99999999999, numColors, 1000, numColorsChanged);
    genMenu.addRange("Red min value", 0, 255, 0, 5, redMinChanged);
    genMenu.addRange("Red max value", 0, 255, 255, 5, redMaxChanged);
    genMenu.addRange("Green min value", 0, 255, 0, 5, greenMinChanged);
    genMenu.addRange("Green max value", 0, 255, 255, 5, greenMaxChanged);
    genMenu.addRange("Blue min value", 0, 255, 0, 5, blueMinChanged);
    genMenu.addRange("Blue max value", 0, 255, 255, 5, blueMaxChanged);
    genMenu.addButton("Generate colors", generateClicked);

    sortMenu = QuickSettings.create(windowWidth / 2 - 75, windowHeight / 2 - 250, "Sort the colors").hide();
    sortMenu.addBoolean("Sort by red", sortByRed, redChanged);
    sortMenu.addBoolean("Sort by green", sortByGreen, greenChanged);
    sortMenu.addBoolean("Sort by blue", sortByBlue, blueChanged);
    sortMenu.addBoolean("Sort by hue", sortByHue, hueChanged);
    sortMenu.addBoolean("Sort by saturation", sortBySaturation, saturationChanged);
    sortMenu.addBoolean("Sort by brightness", sortByBrightness, brightnessChanged);
    sortMenu.addBoolean("Sort by similarity", sortBySimilarity, similarityChanged)
    sortMenu.addColor("Colors similar to", sortBySimilarityColor, similarityColorChanged);
    sortMenu.hideControl("Colors similar to");
    sortMenu.addButton("Sort colors", sortClicked);

    runMenu = QuickSettings.create(100, 100, "ColorSort").hide();
    runMenu.addRange("Speed", 0.0, 5.0, speed, 1, speedChanged);
    runMenu.addTextArea("Info", infoText);
    runMenu.addProgressBar("Progress", 100, progressPercent);
    runMenu.addButton("Sort again", sortAgainClicked);
    runMenu.addButton("Generate new colors", generateNewClicked);
    runMenu.addHTML("Github link", "<b> <p style='margin-top:0;margin-bottom:5px;'>Github repo:</p> </b> <a href='https://github.com/techiew/ColorSort'>github.com/techiew/ColorSort</a>");
    runMenu.hideTitle("Github link");
}

function draw() {
    background(0);

    if(startSort) {
        let cycles = Math.ceil(numColors / throttle * speed);

        progressPercent = (numColors - heapLength) / numColors * 100;
        runMenu.setValue("Progress", progressPercent);
        runMenu.setValue("Info", "# array accesses: " + arrayAccesses + "\n"
                        + "# comparisons: " + comparisons);

        while(cycles != 0) {

            if(heapLength > 1) {
                heapSortStep();
            }

            cycles--;
        }

    }

    let posX = 0;
    let posY = 0;

    for(let i = 0; i < colors.length; i++) {
        fill(colors[i]);
        rect(posX, posY, size, size);
        posX += size;

        if(posX >= windowWidth) {
            posX = 0;
            posY += size;
        }

    }

}

function generateColors() {
    colors = [];

    for(let i = 0; i < numColors; i++) {
        colors.push(color(random(redMin, redMax), random(greenMin, greenMax), random(blueMin, blueMax)));
    }

    size = getMaxSizeOfSquaresInRect(numColors, windowWidth, windowHeight);
    resetState();
}

function resetState() {
    heapLength = colors.length;
    currentNode = Math.floor(colors.length / 2 - 1);
    throttle = 30;
    arrayAccesses = 0;
    comparisons = 0;
}

function heapSortStep() {
    heapify(currentNode);

    if(currentNode == 0) {
        heapLength--;
        [colors[0], colors[heapLength]] = [colors[heapLength], colors[0]];
        arrayAccesses += 4;
        throttle = 500;
    } else {
        currentNode--;
    }

}

function heapify(nodeIndex) {
    let parentNode = nodeIndex;
    let leftChildNode = parentNode * 2 + 1;
    let rightChildNode = leftChildNode + 1;

    if((leftChildNode < heapLength) && (getSortFactor(colors[leftChildNode]) > getSortFactor(colors[parentNode]))) {
        parentNode = leftChildNode;
    }

    if((rightChildNode < heapLength) && (getSortFactor(colors[rightChildNode]) > getSortFactor(colors[parentNode]))) {
        parentNode = rightChildNode;
    }

    comparisons += 2;

    if(parentNode != nodeIndex) {
        comparisons++;
        [colors[nodeIndex], colors[parentNode]] = [colors[parentNode], colors[nodeIndex]];
        arrayAccesses += 4;
        heapify(parentNode);
    }

}

function getSortFactor(_color) {
    arrayAccesses++;
    comparisons += 0.5;

    let r = 0;
    let g = 0;
    let b = 0;
    let h = 0;
    let s = 0;
    let br = 0;
    let si = 0;

    if(sortByRed) {
        r = red(_color);
    }

    if(sortByGreen) {
        g = green(_color);
    }

    if(sortByBlue) {
        b = blue(_color);
    }

    if(sortByHue) {
        h = hue(_color);
    }

    if(sortBySaturation) {
        s = saturation(_color);
    }

    if(sortByBrightness) {
        br = brightness(_color);
    }

    if(sortBySimilarity) {
        let dRed = Math.abs(red(color(sortBySimilarityColor)) - red(_color));
        let dGreen = Math.abs(green(color(sortBySimilarityColor)) - green(_color));
        let dBlue = Math.abs(blue(color(sortBySimilarityColor)) - blue(_color));
        si = dRed + dGreen + dBlue;
    }

    return r + g + b + h + s + br - si;
}

// Shamelessly stolen from Stackoverflow: https://stackoverflow.com/a/47337678/11562557
// I am not good at math.
function getMaxSizeOfSquaresInRect(n, w, h) {
    var sw, sh;
    var pw = Math.ceil(Math.sqrt(n * w / h));

    if (Math.floor(pw * h / w) * pw < n) {
         sw = h / Math.ceil(pw * h / w);
    } else {
        sw = w / pw;
    }

    var ph = Math.ceil(Math.sqrt(n * h / w));

    if (Math.floor(ph * w / h) * ph < n) {
        sh = w / Math.ceil(w * ph / h);
    } else {
        sh = h / ph;
    }

    return Math.max(sw, sh);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    size = getMaxSizeOfSquaresInRect(numColors, windowWidth, windowHeight);
}
