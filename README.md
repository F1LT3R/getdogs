#GETDOGS

It gets dogs from Google and puts them in your console.

![ASCII Art Picture of Dog](http://i.imgur.com/noXrPGv.png)

Getdogs uses Node.js to do a Google Image Search, and displays the results as ASCII Art in your console. This package was created as a live demonstration of how how to write and publish Node packages.

##Installation

Assuming you want to getdogs from anywhere on your system...

    npm install getdogs -g

##Execution

    getdogs

##Command Line Options

###Search (-s, --search [string])

Returns things that may not be dogs afterall, such as: "cats". [default is "dogs"].

    // Puts some cats in your console too!
    getdogs -s cats

###Number (-n, --number [number])

Changes number of items put in console. [default is 3].

    // Return 10 dogs into console
    getdogs -n 10

###Number (-w, --width [number])

The character-width that your dogs will display. [defaults to 80 for true punchcard compatibility]

    // Returns 100-character-wide dogs
    getdogs -w 100

###Monotone (-m, --monotone)

Turns off colors for monochrome displays.

    // Takes away colors from your dogs
    getdogs -m

##Example

Here is an example of the default output of the getdogs program from version 0.0.7.

![getdogs Screenshot](http://i.imgur.com/bcSrvz8.png)