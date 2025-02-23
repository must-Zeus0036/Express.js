How to set up an Express Server.
* Build a simple Express Server.
* Create routes and handlers ( routes are URLs user, Handlers are functions that repoonds to these requests).
* Create logging middleware ( middleware is code that runs before a request reaches it's final handlers).
* Code JSON is working for any Application and used it to show the contain of any Application in Frontend.
* Express is API Framework to JavaScript (like Backend Framwork)


  - To install Express Server you should to install Node.js.
  - Open VS then open Terminal and install npm by writting this commando [npm init -y] node package manager.
  - Create a file package.json with code, by this code I can install an Express.
  - From the expressjs.com I take this commando [npm install express --save] and run it in VS terminal and then we install Express.
  - Create a new file in VS app.js this file refer to my Application in Express.
  - We shall write code in app.js check this file in my project.
  - To run app.js we write in terminal this commando [node app.js].
  - app.listen(3000,() => {
        console.log('Started on port 3000');
    });
    - host 3000 in my device to check it we write in our browser [localhost3000/hello].
    - To run the Express Server we use this commando in VS terminal [node app.js]
    - next step install a new package to avoide stop the Express Server each time we need to change something, to sloving this problem we can install package [npm i nodemon].
    - To GET, POST, Remove data to our arraylist in app.js we can use postman, install postman from https://www.postman.com/downloads/
    - Using MariaDB join it and testing POST, GET and Remove requests.
