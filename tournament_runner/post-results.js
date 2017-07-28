const fs = require('fs');
const http = require('http');

function run(){
	fs.readFile("./output.txt", function(err, data){
		if(err) throw err;

		console.log("got data");
		
		data = data.toString();
		var lines = data.split('\n');
		var line = 0;
		while(lines[line].substr(0, 8) != "#results" && line < lines.length){
			line++
		}
		line++;

		var sides = new Array();

		var pattern = new RegExp(/(\d{1,3}(?:\.\d*)?)%\s+(\d{1,3}(?:\.\d*)?)%\s+(\d{1,3}(?:\.\d*)?)%\s+(\d{1,3}(?:\.\d*)?)%\s+(\d{1,3}(?:\.\d*)?)%\s+(\d{1,3}(?:\.\d*)?)%\s+(\d{1,3}(?:\.\d*)?)%\s+(\d{1,3}(?:\.\d*)?)%\s+(\d+)\s+(.*)/);


		while(lines[line].substr(0, 6) != "#total" && line < lines.length){
			var match = lines[line].match(pattern);
			if(match.length != 11){
				console.log(lines[line]);
				console.log(JSON.stringify(match));
				throw "Fuck not enough stuff"
			}
			sides.push({
				score: match[1],
				error: match[2],
				survival: match[3],
				earlyDeath: match[4],
				lateDeath: match[5],
				earlyScore: match[6],
				fraction: match[7],
				kills: match[8],
				rounds: match[9],
				name: match[10]
			});
			//msg += lines[line] + "\n";
			line++;


		}

		sides.sort(function(side1, side2){
			return side2.score - side1.score;
		});

		var msg = "";
		for(var i = 0; i < sides.length; i++){
			msg +=  sides[i].score + "% : " + sides[i].name + "\n";
		}

		var data = {
			color:"green",
			message: msg,
			notify:false,
			message_format:"text"
		}



		console.log(JSON.stringify(sides));

		POST(
			"centare.hipchat.com",
			"/v2/room/4053353/notification?auth_token=8qECtzUzQSjbueeMZiXPIVOntWnVlg446zymD5M6",
			data
			);



	});
}


function POST(host, path, data){
	var postData = JSON.stringify(data);

	var options = {
	  hostname: host,
	  port: 80,
	  path: path,
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	    'Content-Length': Buffer.byteLength(postData)
	  }
	};

	var req = http.request(options, (res) => {
	  console.log(`STATUS: ${res.statusCode}`);
	  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	  res.setEncoding('utf8');
	  res.on('data', (chunk) => {
	    console.log(`BODY: ${chunk}`);
	  });
	  res.on('end', () => {
	    console.log('No more data in response.');
	  });
	});

	req.on('error', (e) => {
	  console.log(`problem with request: ${e.message}`);
	});

	// write data to request body
	req.write(postData);
	req.end();
}

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
if (!String.prototype.padEnd) {
    String.prototype.padEnd = function padEnd(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return String(this) + padString.slice(0,targetLength);
        }
    };
}

run();