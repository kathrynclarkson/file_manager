var fs = require('fs');
var colors = require('colors');

var useStdin = function() {
	var input = process.stdin.read();
	if (input !== null) {
		var inputSplit = input.toString().trim().split(" ");
		switch(inputSplit[0]) {
			case "cat":
				//cat <filename>
				catFile(inputSplit[1]);
				break;
			case "touch":
				//touch <filename>
				createNewFile(inputSplit[1]);
				break;
			case "rm":
				// rm <filename>
				removeFile(inputSplit[1]);
				break;
			case "replace":
				// replace <fileName> <oldWord> <newWord>
				replace(inputSplit[1], inputSplit[2], inputSplit[3]);
				break;
			case "grep":
				// grep <filename> <word>
				grep(inputSplit[1], inputSplit[2]);
				break;
			default:
				console.log("Command not recognized");
			
		}
	}
};

function grep(fileName, word) {
	fs.readFile(fileName, function(err, data) {
		if (err) throw err;
		var splitData = data.toString().split("\n");
		for (var i = 0; i < splitData.length; i++) {
			if (splitData[i].indexOf(word) !== -1) {
				console.log(splitData[i]);
			}
		}
	});
}

//create a file (touch)
function createNewFile(fileName) {
	fs.writeFile(fileName, "", function(err){
		if (err) {
			console.log("Could not write to file".red);
		} else {
			console.log("File created and saved".green);
		}
	});
}

//read from a file (cat)
function catFile(fileName) {
	fs.readFile(fileName, function(err, data) {
		if (err) {
			console.log("Unable to read from file".red);
		} else {
			console.log(data.toString().rainbow);
		}
	});
}

function removeFile(file) {
	fs.unlink(file, function(err) {
		if (err) throw err;
		console.log(colors.green.underline('successfully deleted ' + file));
	});
}

function handleWriteFile(err) {
    if (err) { return console.log(err); }

    console.log("Done!");
}

function handleReplaceFile(data, oldWord, newWord) {
    data = data.toString();

    data = data.split(oldWord).join(newWord);

    fs.writeFile(fileName, data, handleWriteFile);
}

function replace(fileName, oldWord, newWord) {
    fs.readFile(fileName, function(err, data) {
        if (err) { return console.log(err); }

        data = data.toString();

        data = data.split(oldWord).join(newWord);

        fs.writeFile(fileName, data, function(err) {
            if (err) { return console.log(err); }

            console.log("Replaced " + colors.red(oldWord) + " with " + colors.green(newWord));
        });
    });
}

process.stdin.on('readable', useStdin);

/*
Your assignment is to implement the following functionality:
	* remove a file
		"rm" <file name>
		> rm hello.txt
			entirely delete the file hello.txt

	* find and replace a word in the file
		"replace" <file to search> <word to replace> <replacement word>
		> replace hello.txt hello goodbye
			replace all instances of hello in hello.txt with goodbye
		> replace what.txt there their
			replace all instances of there in what.txt with their

	* find a line in a file
		"grep" <file name> <word to find>
		> grep hello.txt hello
			print out all of the lines in hello.txt that contain "hello"
		> grep what.txt there
			print out all of the lines in what.txt that contain "there"

	Bonus work:
		* Ask for confirmation before deleting a file
		* Don't let people delete files that are above the current working directory (i.e. disallow "../")
		* Have grep take a regular expression as the word to find
		* Create mkdir and rmdir
		*/

