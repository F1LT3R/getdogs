#GETDOGS

**GETDOGS** gets ASCII Art dogs to your console from the Google Image Search.

Maybe you code up all night and feeling down and in need of some dogs then we've just got the dogs for you...

> "This NPM package helps you get dogs from Google. It's awesome!"  
> &mdash; _Anonymous_

(This package was created as a live demonstration of how how to write and publish Node packages.)

##Installation

Assuming you want to getdogs from anywhere on system...

    npm install getdogs -g

##Execution

    getdogs

##Command Line Options

###Search (-s, --search [string])

Returns thing that may not be dogs after-all, such as: "cats". [default is "dogs"].

    // Puts some cats in your console too!
    getdogs -s cats

###Number (-n, --number [number])

Changes number of items put in console. [default is 3].

    // Return 10 dogs into console
    getdogs -n 10

###Number (-w, --width [number])

The character-width that your dogs must be fit into. [defaults to 80 for true punchcard compatibility]

    // Returns 100-character-wide dogs
    getdogs -w 100

###Monotone (-m, --monotone)

Turn off the colors for the monochrome displays.

    // Takes away colors from your dogs
    getdogs -m

##Example

Here is an example of the default output of the getdogs program:

![getdogs Screenshot](http://i.imgur.com/bcSrvz8.png)