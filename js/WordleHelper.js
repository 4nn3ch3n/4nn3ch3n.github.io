const alphabetArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const wordsArr = [];
var selectedRow = null;
var rowPointers = {};
var cellPointers = {};
var colors = {"rgb(83, 141, 78)": "darkendGreen", "rgb(201, 180, 88)": "yellow", "rgb(147, 149, 152)": "darkGray", "": "None"};
var colorList = Object.keys(colors);
var availableLetters = [];


class Word
{
    constructor(word)
    {
		this.word = word;
        this.wordSet = new Set(Array.from(word));
    }
}

//Ready is called as soon as DOM is ready for manipulation but before images have finished loading.
$(document).ready(function()
{	
	$("#navbar").load("nav.html");

	readFile();

	let table = document.getElementById("wordleTable");

	for(let rowIndex = 0; rowIndex < 6; rowIndex ++)
	{
		//Create a table row
		let row = document.createElement("TR");
		row.setAttribute("id", rowIndex);

		row.addEventListener("click", event =>
		{
			if(selectedRow != null)
				selectedRow.style.backgroundColor = "";
			
			event.target.parentElement.style.backgroundColor = "aquamarine";
			selectedRow = event.target.parentElement;
		});

		for(let colIndex = 0; colIndex < 5; colIndex ++)
		{
			let col = document.createElement("TD");
			col.setAttribute("id", colIndex + rowIndex * 5);

			//https://www.utf8-chartable.de/unicode-utf8-table.pl?start=128&number=128&utf8=string-literal&unicodeinhtml=hex
			//\xa0 is a no break space unicode found in the above resource 
			col.innerText = "\xa0\xa0\xa0";

			col.addEventListener("dblclick", event => 
			{
				let pointer = cellPointers[event.target.id];

				if(pointer < Object.keys(colors).length)
				{
					event.target.style.backgroundColor = colorList[pointer];
					cellPointers[event.target.id] += 1;
				}
				else
				{
					cellPointers[event.target.id] = 0;
				}
			});

			row.appendChild(col);

			cellPointers[colIndex + rowIndex * 5] = 0;
		}
		
		table.appendChild(row);

		rowPointers[rowIndex] = 0;
	}
});

document.addEventListener('keydown', event =>
{
	let key = event.code.substring(3);

	if(selectedRow != null && key.length == 1 && key.match(/[A-Z]{1}/g))
	{
		if(rowPointers[selectedRow.id] < 5)
		{
			selectedRow.children[rowPointers[selectedRow.id]].textContent = key;
			rowPointers[selectedRow.id] += 1;
		}
	}
	else if(selectedRow != null && event.code == "Backspace" && rowPointers[selectedRow.id] > 0)
	{
		rowPointers[selectedRow.id] -= 1;
		selectedRow.children[rowPointers[selectedRow.id]].textContent = "\xa0\xa0\xa0";
	}
	else if(event.code == "Enter")
	{
		availableLetters = alphabetArr.map((x) => x);

		checkWordleTable();
	}
});

function checkWordleTable()
{
	var tableRowsArr = document.getElementById("wordleTable").childNodes;

	var correctPosLetter = {};
	var incorrectPosLetter = {};
	var removedChars = [];

	for(let row in tableRowsArr)
	{
		if(rowPointers[row] == 5)
		{
			let rowCellsArr = tableRowsArr[row].childNodes;
			let i = 0;

			for(let cell of rowCellsArr)
			{
				if(cell.textContent != "\xa0\xa0\xa0")
				{
					if(colors[String(cell.style.backgroundColor)] == "darkGray")
					{
						let index = availableLetters.indexOf(cell.textContent);
						let char = availableLetters.splice(index, 1);
						removedChars.push(char[0]);
					}
					else if(colors[String(cell.style.backgroundColor)] == "darkendGreen")
					{
						correctPosLetter[cell.textContent] = i;
					}
					else if(colors[String(cell.style.backgroundColor)] == "yellow")
					{
						incorrectPosLetter[cell.textContent] = i;
					}
				}

				i ++;
			}
		}
		else
			break;
	}

	document.getElementById("availableLetters").textContent = availableLetters;

	let remainderWords = wordsArr.map((x) => x);
	for(let letter of removedChars)
	{
		remainderWords = remainderWords.filter(word => new Set(Array.from(word)).has(letter) == false);
	}

	for(let letter in correctPosLetter)
	{
		remainderWords = remainderWords.filter(word => word.charAt(correctPosLetter[letter]) == letter);
	}

	for(let letter in incorrectPosLetter)
	{
		remainderWords = remainderWords.filter(word => (word.charAt(incorrectPosLetter[letter]) != letter && new Set(Array.from(word)).has(letter) == true));
	}

	document.getElementById("possibleWords").textContent = remainderWords.join('\r\n');
}

function readFile()
{
	fetch('https://4nn3ch3n.github.io/WordsOfLength5.txt', {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization"
          
        }
    })
        .then(response => response.text())
        .then(text => {
            var words = text.split("\n");
            for(let i = 0; i < words.length; i ++)
            {
				wordsArr.push(words[i]);
            }
        });
}