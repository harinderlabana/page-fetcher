const fs = require('fs');
const request = require('request');
const readline = require('readline');

//target url and path to file for writing
const fetchThis = process.argv.slice(2)[0];
const saveTo = process.argv.slice(2)[1];

//readline setup
const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//request information
request(fetchThis, (error, response, body) => {
  //if URL invalid
  if (error) {
    console.error(
      `Error: Invalid URL.  Please check URL and try again. Must include <http:// or https://>`
    );
    process.exit();
  } else {
    //start of fetch process and if status code is 200
    if (response && response.statusCode === 200) {
      //check to see if file already exists
      fs.access(saveTo, (err) => {
        if (err) {
          console.error(
            `Error: No such file or directory. You are trying to access ${saveTo}`
          );
          process.exit();
        } else {
          //if the file exsists as for overwrite permission
          r1.question(
            `This file already exsist, would you like to overwrite? (y/n): `,
            //callback to write to file and confirm completion message
            (answer) => {
              if (answer === 'y') {
                fs.writeFile(saveTo, body, 'utf8', (err) => {
                  if (!err) console.log(`Downloaded and saved to ${saveTo}`);
                  process.exit();
                });
              } else {
                //if "no" selected
                process.exit();
              }
            }
          );
        }
      });
    } else if (response && response.statusCode !== 200) {
      //if the website is valid but produces a status code != to 200 throw an error with
      console.error(
        'Error:',
        response && response.statusCode,
        'page not found.'
      );
      process.exit();
    }
  }
});
