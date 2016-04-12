# Educity

Educity is Etix Kru's project for Game of Code Hackathon 2016.

# Usage

You can try our app at [http://etix-kru.azurewebsites.net](http://etix-kru.azurewebsites.net/). Currently, only the Maths and Geography exercises are available and the app doesn't have its final look-and-feel. We will upload a final version with a better design in the coming days.

## Maths exercise

The Maths exercise is a preview of how we can create an interactive exercise using Open Data. It is not 100% finished yet but you can still test our basic features: pick a bus line and get some information on a given commute. For example, pick the "Line-125", then choose "Gare Centrale" as the first stop and "Salzhaff" as the second one (this is the commute we used to go from the trainstation to the Hackathon ;) ). You can see on the map the path of your bus.

Then if you scroll down, you can click on the "Select Stops" button. After some data is gathered by our API, a summary will be displayed at the bottom of the page. Using this data, we will then be able to generate the actual exercise.

## Geography exercise

The Geography exercise is quite easy to use. Just click the "Random quarter !" button, and a Luxembourg District will be highlight on the map. Then select the name of the district using the multiple-choice selector next to the button. A message will then tell you if you picked the good or a wrong answer.

## Bugs

Please note that this app was built in a very short amount of time, so certain features may not work as expected. We will improve it in the next coming days but if you still find some bugs, please feel free to create a GitHub issue.

# Run the project

To run the project on your computer, first install its dependencies using npm:

```
cd game-of-code-2016
npm install
```

Then build the webapp using

```
npm run build
```

Finally, launch the web application (on port 3000) using:

```
npm start
```

# License

GNU GPL v3