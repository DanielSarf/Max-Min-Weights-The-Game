const debugStage = 0; //0 = Disable Debug Mode, 1 = Skip to Selecting Number Of Cubes, 2 = Skip to Main Game Area, 3 = Skip to Early Choose Screen, 4 = Skip to Last Screen

function exitGame()
{
    window.close();
}

function restartGame()
{
    location.reload();
}

function chooseInputValidation(inputID)
{
    var inputElement = document.getElementById(inputID);
    
    //Validation bug fixed using parseInt()
    var inputCubeNumber = parseInt(inputElement.value);

    if(inputCubeNumber < 1 || inputCubeNumber > numberOfCubes)
    {
        inputElement.style.borderBottomColor = "rgb(255, 0, 0)";

        return 0;
    }
    else
    {
        inputElement.style.borderBottomColor = "rgb(0, 0, 0)";

        return inputCubeNumber;
    }
}

function lastScreen()
{
    var chosenCubeLightestNumber = chooseInputValidation("lightestCubeNumberInput");
    var chosenCubeHeaviestNumber = chooseInputValidation("heaviestCubeNumberInput");
    
    //chooseInputValidation returns 0 if value is invalid
    if (!chosenCubeLightestNumber || !chosenCubeHeaviestNumber)
    {
        // Function will exit if values are invalid
        return;
    } 

    document.getElementById("game").setAttribute("style", "display: none;");
    
    document.getElementById("chooseScreen").setAttribute("style", "display: none;");

    document.getElementById("lastScreen").removeAttribute("style");

    var winStatusMessage = document.getElementById("winStatusMessage");

    if (secretWeights[chosenCubeLightestNumber - 1] == lightestWeight && secretWeights[chosenCubeHeaviestNumber - 1] == heaviestWeight)
    {
        winStatusMessage.innerText = "You Win!!!";
        winStatusMessage.style.color = "rgb(133, 255, 51)";
    }
    else
    {
        winStatusMessage.innerHTML = "You Lose...";
        winStatusMessage.style.color = "rgb(255, 32, 32)";
    }
    
    //Generate cubesRevealedMessage
    //First we find all cube numbers that correspond to lightestWeight and heaviestWeight
    var lightestCubeNumbers = [];
    var heaviestCubeNumbers = [];

    for(var i = 0; i < numberOfCubes; i++)
    {
        if(secretWeights[i] == lightestWeight)
        {
            lightestCubeNumbers.push([i + 1]);
        }

        if(secretWeights[i] == heaviestWeight)
        {
            heaviestCubeNumbers.push([i + 1]);
        }
    }

    var cubesRevealedMessageString = "The lightest cube" + (lightestCubeNumbers.length > 1 ? "s are " : " is ");

    for (var i = 0; i < lightestCubeNumbers.length; i++)
    {
        cubesRevealedMessageString += lightestCubeNumbers[i];

        if(lightestCubeNumbers.length > 1 && i + 1 != lightestCubeNumbers.length)
        {
            if(i + 2 == lightestCubeNumbers.length)
            {
                cubesRevealedMessageString += " and ";                
            }
            else
            {
                cubesRevealedMessageString += ", ";
            }
        }
    }

    cubesRevealedMessageString += "<br>You chose cube " + chosenCubeLightestNumber + "<br><br>The heaviest cube" + (heaviestCubeNumbers.length > 1 ? "s are " : " is ");

    for (var i = 0; i < heaviestCubeNumbers.length; i++)
    {
        cubesRevealedMessageString += heaviestCubeNumbers[i];

        if(heaviestCubeNumbers.length > 1 && i + 1 != heaviestCubeNumbers.length)
        {
            if(i + 2 == heaviestCubeNumbers.length)
            {
                cubesRevealedMessageString += " and ";                
            }
            else
            {
                cubesRevealedMessageString += ", ";
            }
        }
    }

    cubesRevealedMessageString += "<br>You chose cube " + chosenCubeHeaviestNumber;

    document.getElementById("cubesRevealedMessage").innerHTML = cubesRevealedMessageString;
}

function closeChooseScreen()
{
    document.getElementById("close").setAttribute("style", "display: none;");

    document.getElementById("chooseScreen").setAttribute("style", "display: none;");
}

function choose(early)
{
    var lightestCubeNumberInputElement = document.getElementById("lightestCubeNumberInput");
    var heaviestCubeNumberInputElement = document.getElementById("heaviestCubeNumberInput");

    document.getElementById("chooseScreen").removeAttribute("style");

    lightestCubeNumberInputElement.defaultValue = 1;
    lightestCubeNumberInputElement.min = 1;
    lightestCubeNumberInputElement.max = numberOfCubes;

    heaviestCubeNumberInputElement.defaultValue = 1;
    heaviestCubeNumberInputElement.min = 1;
    heaviestCubeNumberInputElement.max = numberOfCubes;

    if(early)
    {
        document.getElementById("close").removeAttribute("style");
    }
}

var haltWeighing = false;

function weigh()
{
    //This is here to prevent double weighing
    if (haltWeighing == false)
    {
        haltWeighing = true;

        currentWeighings = currentWeighings - 1;
    
        if (currentWeighings <= 0)
        {
            currentWeighings = 0;
    
            choose(false);
        }
    
        weighingsCounter.innerText = "Weighings left: " + (currentWeighings <= 9 ? "0": "") + currentWeighings;
    
        var leftPanTotalWeight = 0;
        var rightPanTotalWeight = 0;
    
        for (var i = 0; i < numberOfCubes; i++)
        {
            if(cubeLocations[i][0] == 1)
            {
                leftPanTotalWeight += secretWeights[i];
            }
            else if (cubeLocations[i][0] == 2)
            {
                rightPanTotalWeight += secretWeights[i];
            }
        }
    
        if (leftPanTotalWeight > rightPanTotalWeight)
        {
            leftPanTextElement.innerText = "Left Pan: Heavier";
            rightPanTextElement.innerText = "Right Pan: Lighter";
        }
        else if (leftPanTotalWeight < rightPanTotalWeight)
        {
            leftPanTextElement.innerText = "Left Pan: Lighter";
            rightPanTextElement.innerText = "Right Pan: Heavier";
        }
        else
        {
            leftPanTextElement.innerText = "Left Pan: Equal Weight";
            rightPanTextElement.innerText = "Right Pan: Equal Weight";
        }
    }
}

function placeCube(cubeIndex, gridIndex, rowIndex, columnIndex)
{
    cubes[cubeIndex].style.bottom = rowIndex * cubeLength + gridsBottomOffset[gridIndex] + "px";

    cubes[cubeIndex].style.left = columnIndex * cubeLength + gridsLeftOffset[gridIndex] + "px";

    cubeLocations[cubeIndex] = [gridIndex, rowIndex, columnIndex];
}

function closestCell(cubeIndex)
{
    var grabbedCubeMiddleCoordsX = cubes[cubeIndex].getBoundingClientRect().left + cubeLength / 2;
    var grabbedCubeMiddleCoordsY = window.innerHeight - cubes[cubeIndex].getBoundingClientRect().top - cubeLength / 2;

    //To stop wasting compute, lets see if the grabbed cube is even inside a grid and record which grid it is in
    gridIndex = -1;

    for (var i = 0; i < grids.length; i++)
    {
        if(grabbedCubeMiddleCoordsX >= gridsLeftOffset[i] && grabbedCubeMiddleCoordsX <= gridsLeftOffset[i] + gridsWidth[i] &&
            grabbedCubeMiddleCoordsY >= gridsBottomOffset[i] && grabbedCubeMiddleCoordsY <= gridsBottomOffset[i] + gridsHeight[i])
        {
            gridIndex = i;

            break;
        }
    }

    if (gridIndex != -1)
    {
        var columnIndex = Math.floor(((grabbedCubeMiddleCoordsX - gridsLeftOffset[gridIndex]) / gridsWidth[gridIndex]) * gridsNumberOfColumns[gridIndex]);

        //Find highest row in the this column that has a cube
        var highestRow = 0;

        for(var i = 0; i < numberOfCubes; i++)
        {
            if(cubeLocations[i][0] == gridIndex && cubeLocations[i][2] == columnIndex && cubeLocations[i][1] >= highestRow && i != cubeIndex)
            {
                highestRow = cubeLocations[i][1] + 1;
            }
        }

        return [gridIndex, highestRow, columnIndex];
    }
    else
    {
        return null;
    }
}

function reverseDisplacements(cubeIndex)
{
    var gridIndex = cubeLocations[cubeIndex][0];
    var rowIndex = cubeLocations[cubeIndex][1];
    var columnIndex = cubeLocations[cubeIndex][2];

    //Collect indexes of all cubes currently at or above grabbed cube's original cell:
    var atOrAboveCubesIndexes = [];
    
    for(var i = 0; i < numberOfCubes; i++)
    {
        if(cubeLocations[i][0] == gridIndex && cubeLocations[i][2] == columnIndex && cubeLocations[i][1] >= rowIndex && i != cubeIndex)
        {
            atOrAboveCubesIndexes.push(i);
        }
    }

    for(var i = 0; i < atOrAboveCubesIndexes.length; i++)
    {
        placeCube(atOrAboveCubesIndexes[i], gridIndex, cubeLocations[atOrAboveCubesIndexes[i]][1] + 1, columnIndex);
    }

    placeCube(cubeIndex, gridIndex, rowIndex, columnIndex);
}

function displaceCubes(cubeIndex)
{
    var gridIndex = cubeLocations[cubeIndex][0];
    var rowIndex = cubeLocations[cubeIndex][1];
    var columnIndex = cubeLocations[cubeIndex][2];

    //Collect indexes of all cubes above grabbed cube:
    var aboveCubesIndexes = [];
    
    for(var i = 0; i < numberOfCubes; i++)
    {
        if(cubeLocations[i][0] == gridIndex && cubeLocations[i][2] == columnIndex && cubeLocations[i][1] > rowIndex)
        {
            aboveCubesIndexes.push(i);
        }
    }

    for(var i = 0; i < aboveCubesIndexes.length; i++)
    {
        placeCube(aboveCubesIndexes[i], gridIndex, cubeLocations[aboveCubesIndexes[i]][1] - 1, columnIndex);
    }
}

function showGrids(show)
{
    for(var i = 0; i < grids.length; i++)
    {
        if (show)
        {
            grids[i].style.filter  = "opacity(0.4)";
        }
        else
        {
            grids[i].style.filter  = "opacity(0)";
        }
    }
}

var isCubeCurrentlyGrabbed = false;

function cubeGrab(cubeIndex)
{
    if (isCubeCurrentlyGrabbed == false) //Prevents bugs if somehow more than 1 cube was selected
    {
        isCubeCurrentlyGrabbed = true;

        haltWeighing = false;

        leftPanTextElement.innerText = "Left pan: _______";
        rightPanTextElement.innerText = "Right pan: _______";

        const cubeMoveListener = new AbortController();
        const cubeUnGrabListener = new AbortController();

        showGrids(true);

        cubes[cubeIndex].style.zIndex = 1;

        //Cube move functionality
        document.addEventListener("mousemove", (e) =>
        {
            //Set the middle of the grabbed cube to mouse coords
            cubes[cubeIndex].style.bottom = window.innerHeight - e.clientY - (cubeLength / 2) + "px";
            cubes[cubeIndex].style.left = e.clientX - (cubeLength / 2) + "px";
        }, { signal: cubeMoveListener.signal });

        displaceCubes(cubeIndex);
        
        //Cube un-grab functionality
        cubes[cubeIndex].addEventListener("mouseup", () =>
        {
            cubes[cubeIndex].style.removeProperty("z-index");

            var closestCellVar = null;

            closestCellVar = closestCell(cubeIndex);

            cubeMoveListener.abort();

            if (closestCellVar != null)
            {
                placeCube(cubeIndex, closestCellVar[0], closestCellVar[1], closestCellVar[2]);
            }
            else
            {
                reverseDisplacements(cubeIndex);
            }

            showGrids(false);

            isCubeCurrentlyGrabbed = false;

            cubeUnGrabListener.abort();
        }, { signal: cubeUnGrabListener.signal });
    }
}

function settleAllCubes()
{
    //Check if half of the cubes can fit in each grid
    if (areaHalfOfTheCubesTake > areaOfGrids[0] || areaHalfOfTheCubesTake > areaOfGrids[1])
    {
        alert("Error: Screen dimensions are incompatible with game. Resize window, decrease number of cubes or try a different montior.");
    
        restartGame();
    
        return;
    }

    var currentGrid;
    var rowsIndex = [0, 0, 0, 0];
    var columnsIndex = [0, 0, 0, 0];

    for (var i = 0; i < numberOfCubes; i++)
    {
        currentGrid = cubeLocations[i][0];

        placeCube(i, currentGrid, rowsIndex[currentGrid], columnsIndex[currentGrid]);

        columnsIndex[currentGrid] = (columnsIndex[currentGrid] + 1) % gridsNumberOfColumns[currentGrid];

        if (columnsIndex[currentGrid] % gridsNumberOfColumns[currentGrid] == 0)
        {
            rowsIndex[currentGrid]++;
        }
    }
}

function setGrids()
{
    for (var i = 0; i < grids.length; i++)
    {
        grids[i].style.width = gridsWidth[i] + "px";
        grids[i].style.left = gridsLeftOffset[i] + "px";
        grids[i].style.bottom = gridsBottomOffset[i] + "px";
        grids[i].style.height = gridsHeight[i] + "px";    
    }
}

var cubeLength;
var gridsHeight = [];
var gridsWidth = [];
var gridsBottomOffset = [];
var gridsLeftOffset = [];
var gridsNumberOfRows = [];
var gridsNumberOfColumns = [];
var areaHalfOfTheCubesTake;
var areaOfGrids = [];

function setDimensionVariables()
{
    var digitalScaleLeftCoord = digitalScaleImage.getBoundingClientRect().left;
    var digitalScaleRightCoord = digitalScaleImage.getBoundingClientRect().right;

    var digitalScaleWidth = digitalScaleRightCoord - digitalScaleLeftCoord;

    var digitalScaleHeight = window.innerHeight - digitalScaleImage.getBoundingClientRect().top;

    cubeLength = cubesContainer.lastChild.getBoundingClientRect().right - cubesContainer.lastChild.getBoundingClientRect().left;

    var maxSpaceOnEachSide = (window.innerWidth - digitalScaleWidth) / 2;

    //Keep in mind that grid3 is the mirror of grid0, and grid2 is the mirror of grid1

    gridsNumberOfColumns[0] = gridsNumberOfColumns[3] = Math.floor(maxSpaceOnEachSide/cubeLength);

    gridsWidth[0] = gridsWidth[3] = gridsNumberOfColumns[0] * cubeLength;

    gridsLeftOffset[0] = (maxSpaceOnEachSide - gridsWidth[0]) / 2;

    gridsLeftOffset[3] = window.innerWidth - (gridsWidth[3] + gridsLeftOffset[0]);

    var maxSpaceOnEachPan = (445 / 1080) * digitalScaleWidth; // 445px/1080px is derrived from ratios of actual digital scale image from a photo editor

    gridsNumberOfColumns[1] = gridsNumberOfColumns[2] = Math.floor(maxSpaceOnEachPan/cubeLength);

    gridsWidth[1] = gridsWidth[2] = gridsNumberOfColumns[1] * cubeLength;

    gridsLeftOffset[1] = (digitalScaleLeftCoord + (305 / 1080) * digitalScaleWidth) - gridsWidth[1] / 2; // 305px is the length from the left of the image to the middle of the left pan

    gridsLeftOffset[2] = window.innerWidth - (gridsWidth[2] + gridsLeftOffset[1]);

    gridsNumberOfRows[0] = gridsNumberOfRows[3] = Math.floor(window.innerHeight/cubeLength);

    gridsHeight[0] = gridsHeight[3] = gridsNumberOfRows[0] * cubeLength;

    gridsBottomOffset[0] = gridsBottomOffset[3] = 0;

    gridsBottomOffset[1] = gridsBottomOffset[2] = (138 / 169) * digitalScaleHeight; // 138px the bottom edge of the pans in the image and 169px is total height of pan in the image

    gridsNumberOfRows[1] = gridsNumberOfRows[2] = Math.floor((window.innerHeight - gridsBottomOffset[1]) / cubeLength);

    gridsHeight[1] = gridsHeight[2] = gridsNumberOfRows[1] * cubeLength;

    areaHalfOfTheCubesTake = Math.ceil(numberOfCubes / 2) * Math.pow(cubeLength, 2);
    areaOfGrids[0] = areaOfGrids[3] = gridsHeight[0] * gridsWidth[0];
    areaOfGrids[1] = areaOfGrids[2] = gridsHeight[1] * gridsWidth[1];
}

var digitalScaleImage;
var leftPanTextElement;
var rightPanTextElement;
var weighingsCounter;
var cubesContainer;
var heaviestWeight = 0;
var lightestWeight = Infinity;
var secretWeights = [];
var cubes;
var grids;
var cubeLocations = [];

function initGame()
{
    document.getElementById("selectNumber").setAttribute("style", "display: none;");

    document.getElementById("game").removeAttribute("style");

    weighingsCounter = document.getElementById("weighingsCounter");

    digitalScaleImage = document.getElementById("digitalScaleImage");

    leftPanTextElement = document.getElementById("left");
    rightPanTextElement = document.getElementById("right");
    
    if (debugStage >= 2)
    {
        numberOfCubes = 20;

        currentWeighings = Math.ceil(3 * numberOfCubes / 2 - 2);
    }

    weighingsCounter.innerText = "Weighings left: " + (currentWeighings <= 9 ? "0": "") + currentWeighings;

    cubesContainer = document.getElementById("cubesContainer");    

    var cube = document.createElement("div");
    cube.classList.add("cube");

    var cubeText = document.createElement("h1");
    cubeText.classList.add("cubeText");

    var currentSecretWeight;

    for(var i = 0; i < numberOfCubes; i++)
    {
        currentSecretWeight = Math.floor(Math.random() * 100) + 1;
        
        secretWeights[i] = currentSecretWeight;

        if(currentSecretWeight < lightestWeight)
        {
            lightestWeight = currentSecretWeight;
        }

        if(currentSecretWeight > heaviestWeight)
        {
            heaviestWeight = currentSecretWeight;
        }

        cube.setAttribute("onmousedown", "cubeGrab(" + i + ")");

        if (debugStage > 0)
        {
            cube.setAttribute("data-secretWeight", secretWeights[i]);
        }
        
        //Add 1 to value since humans normally count from 1
        cubeText.innerText = (i + 1 <= 9 ? "0": "") + (i + 1);

        cubesContainer.appendChild(cube.cloneNode(true));

        cubesContainer.lastChild.appendChild(cubeText.cloneNode(true));
    }

    cubes = cubesContainer.getElementsByClassName("cube");

    grids = document.getElementsByClassName("grid");

    setDimensionVariables();
    setGrids();

    //Fancy thing I did: Just place cubes initially in grid0 and grid3, then use settleCubes() (which was intially used only when resizing screen) to just place them neatly in the start aswell
    var halfCubesIndex = Math.ceil(numberOfCubes / 2);
    
    for (var i = 0; i < halfCubesIndex; i++)
    {
        cubeLocations.push([0, 0, 0]);
    }
    
    for (var i = halfCubesIndex; i < numberOfCubes; i++)
    {
        cubeLocations.push([3, 0, 0]);
    }

    settleAllCubes();
}

var numberOfCubes;
var currentWeighings;

function updateSliderValue()
{
    sliderValue.innerText = (sliderElement.value <= 9 ? "0": "") + sliderElement.value + " ➤";
    numberOfCubes = sliderElement.value;

    currentWeighings = Math.ceil(3 * numberOfCubes / 2 - 2);

    document.getElementById("challengeText").innerText = "Challenge: Guess the correct cubes in " + currentWeighings + " or less weighings";
}

var sliderElement;
var sliderValue;

function clickToStart()
{
    document.getElementById("titleScreen").setAttribute("style", "display: none;");

    document.getElementById("selectNumber").removeAttribute("style");
   
    window.removeEventListener("click", clickToStart);

    sliderElement = document.getElementById("slider");
    sliderValue = document.getElementById("sliderValue");

    if (debugStage < 2)
    {
        updateSliderValue();
    }
}

window.onload = () => {
    if (debugStage < 1)
    {
        window.addEventListener("click", clickToStart);
    }
}

window.onresize = () => {
    if (window.getComputedStyle(document.getElementById("game")).display != "none")
    {
        setDimensionVariables();
        setGrids();
        settleAllCubes();
    }
}

if (debugStage >= 1)
{
    clickToStart();
}

if (debugStage >= 2)
{
    initGame();
}

if (debugStage >= 3)
{
    choose();
}

if (debugStage >= 4)
{
    lastScreen();
}