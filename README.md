#!GETDOGS

This NPM package helps you get dogs from Google. It's awesome!

##Installation

Assuming you want to be able to get dogs from anywhere on your system...

    npm install getdogs -g

##Execution

    getdogs

##Command Line Options

###Search (-s, --search [string])

Returns something that is not dogs, like "cats". [default is "dogs"].

    // Puts some cats in your console
    getdogs -s cats

###Number (-n, --number [number])

Changes the number of items returened. [default is 3].

    // Returns 10 dogs into your console
    getdogs -n 10

###Number (-w, --width [number])

The character-width that your dogs fit into. [defaults to 80 for punchcard compatability]

    // Returns 100-character-wide dogs
    getdogs -w 100

###Monotone (-m, --monotone)

Turns off colors for monochrome displays.

    // Takes away colors from your dogs
    getdogs -m

##Example

Here is an example of the gefault output of the getdogs program:

![getdogs Screenshot](http://i.imgur.com/bcSrvz8.png)