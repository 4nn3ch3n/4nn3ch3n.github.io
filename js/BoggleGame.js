//Global Variables
const wordDict = {};
var lettersArray;
const lettersDict = {};
var randomCharWithFrequency = '';
var timer;
var enteredWords;

function getScore(wordLength)
{
    switch(wordLength)
    {
        case 3:
            return 1;
        case 4:
            return 1;
        case 5:
            return 2;
        case 6:
            return 3;
        case 7:
            return 5;
        default:
            if(wordLength > 7)
                return 11;
            else
                return 0;
    }
}


class LetterNode
{
    constructor(letter)
    {
        this.letter = letter;
        this.adjacentLetters = [];
        this.visited = false;
    }

    //Add adjacency to both nodes
    addAdjacentLetterNode(adjacentNode)
    {
        this.adjacentLetters.push(adjacentNode);
        adjacentNode.adjacentLetters.push(this);
    }
}

function initializeOnLoad()
{
    readDictFile();
    createLetterWithFrequencyArray();
}

function createLetterWithFrequencyArray()
{
    helperAddLetter('A', 12);
    helperAddLetter('B', 1);
    helperAddLetter('C', 5);
    helperAddLetter('D', 6);
    helperAddLetter('E', 19);
    helperAddLetter('F', 4);
    helperAddLetter('G', 3);
    helperAddLetter('H', 5);
    helperAddLetter('I', 11);
    helperAddLetter('J', 1);
    helperAddLetter('K', 1);
    helperAddLetter('L', 5);
    helperAddLetter('M', 4);
    helperAddLetter('N', 11);
    helperAddLetter('O', 11);
    helperAddLetter('P', 4);
    helperAddLetter('Q', 1);
    helperAddLetter('R', 12);
    helperAddLetter('S', 9);
    helperAddLetter('T', 13);
    helperAddLetter('U', 4);
    helperAddLetter('V', 1);
    helperAddLetter('W', 2);
    helperAddLetter('X', 1);
    helperAddLetter('Y', 3);
    helperAddLetter('Z', 1);
}

function helperAddLetter(letter, freq)
{
    for(let i = 0; i < freq; i ++)
    {
        randomCharWithFrequency += letter;
    }
}

function getRandomChar()
{
    //var randomChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = randomCharWithFrequency.charAt(Math.floor(Math.random() * randomCharWithFrequency.length));

    return result;
}

//slider is the element to retrieve the value from, outputName is the id of the element to update
function updateSliderOutput(slider, outputName)
{
    var output = document.getElementById(outputName);
    output.innerHTML = slider.value;
}

function createBoggleTable()
{
    //Clear timer
    stopTimer();

    //Clear letters array
    lettersArray = [];

    //Delete the place holder table
    var tableParent = document.getElementById("characterTable");
    tableParent.remove();

    //Retrieve the number of rows and cols to generate
    var numRows = document.getElementById("numRows").value;
    var numCols = document.getElementById("numCols").value;

    //Create a new Boggle Table
    var table = document.createElement("TABLE");
    table.setAttribute('id', 'characterTable');
    table.setAttribute('style', 'margin:auto');

    for(rowIndex = 0; rowIndex < numRows; rowIndex ++)
    {
        //Create a table row
        var row = document.createElement("TR");

        var tempArray = [];

        for(colIndex = 0; colIndex < numCols; colIndex ++)
        {
            var col = document.createElement("TD");

            randomChar = getRandomChar();
            if(randomChar == 'Q')
                col.innerText = 'Qu';
            else
                col.innerText = randomChar;

            //Create letter node and add to letters array
            var letterNode = new LetterNode(col.innerText);
            tempArray.push(letterNode);

            //Add letter node to dict
            if(lettersDict[letterNode.letter])
                lettersDict[letterNode.letter].push(letterNode);
            else
                lettersDict[letterNode.letter] = [letterNode];

            //Add adjacent nodes to the left and right of a node
            if(colIndex > 0)
                tempArray[colIndex - 1].addAdjacentLetterNode(letterNode);

            if(rowIndex > 0)
            {
                //Upper-Left /Lower-right
                if(colIndex > 0)
                    tempArray[colIndex].addAdjacentLetterNode(lettersArray[rowIndex - 1][colIndex - 1]);

                //Above / Below
                tempArray[colIndex].addAdjacentLetterNode(lettersArray[rowIndex - 1][colIndex]);

                //Upper-right / Lower-left
                if(colIndex < numCols -1)
                    tempArray[colIndex].addAdjacentLetterNode(lettersArray[rowIndex - 1][colIndex + 1]);
            }

            row.appendChild(col);
        }

        lettersArray.push(tempArray);

        table.appendChild(row);
    }

    var tableParent = document.getElementById("characterTableParent").appendChild(table);

    //Enable the timer button
    var timerButton = document.getElementById('timerButton');
    timerButton.removeAttribute('disabled');

    console.log(lettersArray);
    console.log(lettersDict);
}

function startTimer()
{
    var timerButton = document.getElementById('timerButton');
    timerButton.setAttribute('disabled', true);

    var wordInput = document.getElementById('wordInput');
    wordInput.removeAttribute('disabled');

    clearEnteredWordsTable();

    var minutes = 2;
    var seconds = 60;
    
    timer = setInterval(function()
    {
        seconds -= 1;
        document.getElementById('timer').innerHTML= minutes + "m " + seconds + "s";

        if(seconds == 0)
        {
            if(minutes == 0)
            {
                clearInterval(timer);
                //Disable the text input to add words
                wordInput.setAttribute('disabled', true);

                //Re-enable the timer button
                timerButton.removeAttribute('disabled');
            }
            else
            {
                seconds = 60;
                minutes -= 1;
            }
        }
    }, 1000);
}

function stopTimer()
{
    if(timer != null)
    {
        clearInterval(timer);

        //Reset timer text
        document.getElementById('timer').innerHTML = '3m 00s';

        //Clear any entered text values
        clearEnteredWordsTable();
    }
}

function addWord(event)
{
    if(event.key === "Enter")
    {
        var wordInput = document.getElementById('wordInput');
        var table = document.getElementById("enteredWords");
        
        //Create a table row
        var row = document.createElement("TR");

        //Create table row data for entered word
        var col = document.createElement("TD");
        col.innerHTML = wordInput.value.toLocaleUpperCase();
        row.appendChild(col);

        //Create table data for points
        col = document.createElement("TD");
        col.innerHTML = getScore(wordInput.value.length);
        row.appendChild(col);

        //Create table data for if the word is valid
        col = document.createElement("TD");

        var capWord = wordInput.value.toLocaleUpperCase();

        if(enteredWords.has(capWord))
        {
            window.alert("Word has been entered before.");
        }
        else
        {
            //Check if word is valid
            if(validateWord(capWord))
            {
                icon = document.createElement("i");
                icon.setAttribute("class", "material-icons");
                icon.setAttribute("style", "font-size:48px;color:green");
                icon.innerHTML = "check_circle";
                col.appendChild(icon);
            }
            else
            {
                col.innerHTML = "Invalid Word";
            }

            //Add inputted word to entered words
            enteredWords.add(capWord);

            row.appendChild(col);
            table.appendChild(row);

            //Clear the input
            wordInput.value = "";

            resetVisitationForLetterNodes();
        }
    }
}

function clearEnteredWordsTable()
{
    //Create new Set
    enteredWords =new Set();
    
    var table = document.getElementById("enteredWords");
    table.innerHTML = '';

    //Create a table row
    var row = document.createElement("TR");

    //Create table row data
    var col = document.createElement("TH");
    col.innerHTML = "Entered Words";
    row.appendChild(col);

    col = document.createElement("TH");
    col.innerHTML = "Points";
    row.appendChild(col);

    col = document.createElement("TH");
    col.innerHTML = "Valid";
    row.appendChild(col);

    table.appendChild(row);
}

function validateWord(word)
{
    //console.log(word[0]);

    var tempInitialLetterArray = lettersDict[word[0]];
    //console.log(tempInitialLetterArray);

    //If first letter is Q then search on Qu
    if(word[0] == 'Q')
    {
        tempInitialLetterArray = lettersDict['Qu'];
    }
    
    if(tempInitialLetterArray != null)
    {
        for(let i = 0; i < tempInitialLetterArray.length; i ++)
        {
            if(word[0] == 'Q')
                canMakeWord = traverseBoggle(word.substring(2), tempInitialLetterArray[i]);
            else
                canMakeWord = traverseBoggle(word.substring(1), tempInitialLetterArray[i]);

            //console.log(wordDict[word[0]].includes[word]);

            if(canMakeWord && wordDict[word[0]].includes(word))
            {
                return true;
            }
        }
    }

    return false;
}

function traverseBoggle(letters, nextLetterNode)
{
    console.log("Letters: " + letters);
    for(let i = 0; i < nextLetterNode.adjacentLetters.length; i ++)
    {
        //console.log("Letter: " + nextLetterNode.adjacentLetters[i].letter);

        var nextLetter = letters[0];

        if(letters[0] == 'Q')
        {
            nextLetter = 'QU';
        }
        
        if(nextLetter == nextLetterNode.adjacentLetters[i].letter && !nextLetterNode.adjacentLetters[i].visited)
        {
            if(letters.length == 1)
            {
                //Reset visited flag
                nextLetterNode.adjacentLetters[i].visited = false;
                console.log("Can make word.");

                return true;
            }
            else
            {
                nextLetterNode.visited = true;

                var hasNextLetter = false;
                if(letters[0] == 'Q')
                    hasNextLetter = traverseBoggle(letters.substring(2), nextLetterNode.adjacentLetters[i]);
                else
                    hasNextLetter = traverseBoggle(letters.substring(1), nextLetterNode.adjacentLetters[i]);
                
                //Reset visited flag
                nextLetterNode.adjacentLetters[i].visited = false;

                if(hasNextLetter)
                {
                    return true;
                }
            }
        }
    }

    return false;
}

function resetVisitationForLetterNodes()
{
    for(let i = 0; i < lettersArray.length; i ++)
    {
        for(let j = 0; j < lettersArray[i].length; j ++)
        {
            lettersArray[i][j].visited = false;
        }
    }
}

function readDictFile()
{
    fetch('https://4nn3ch3n.github.io/dict.txt')
        .then(response => response.text())
        .then(text => {
            var words = text.split("\r\n");

            for(let i = 0; i < words.length; i ++)
            {
                if(wordDict[words[i][0]])
                {
                    wordDict[words[i][0]].push(words[i]);
                }
                else
                {
                    wordDict[words[i][0]] = [words[i]];
                }
            }
        });

}

//dictionary from https://www.luke-g.com/boggle/#theprog