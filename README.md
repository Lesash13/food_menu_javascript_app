[![Dependencies][dependency-shield]][dependency-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

# Food menu javascript app

Small native javascript project for food delivery menu.

![food.png](food.png)

### Built With

* [![Javascript][Javascript.io]][Javascript-url]
* [![NodeJs][NodeJs.io]][NodeJs-url]
* [![WebPack][WebPack.io]][WebPack-url]

## Pre-installations

#### Npm install:

  ```sh
  npm install npm@latest -g
  ```

#### Clone the repo:

```sh
git clone https://github.com/Lesash13/food_menu_javascript_app.git
```

#### Start Chrome without CORS policy:
```
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
```

## Usage

#### Backend local server for fetch requests:
```sh
 python .\server\app\server.py
```

#### Start json server:
allow scripts before:
```sh
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
```
then run:
```sh
json-server .\db.json 
``````

#### Open index.html:
```
"Alt+F2"
or 
http://localhost:63342/food_menu/index.html
```

<!-- MARKDOWN LINKS & IMAGES -->

[dependency-shield]: https://img.shields.io/badge/Dependency_Graph-darkgreen?style=for-the-badge

[dependency-url]: https://github.com/Lesash13/food_menu_javascript_app/network/dependencies

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=darkblue

[linkedin-url]: https://www.linkedin.com/in/victoriya-mitrofanova-96839278/

[Javascript.io]: https://img.shields.io/badge/-JavaScript-lightyellow?style=for-the-badge&logo=javascript

[Javascript-url]: https://www.javascript.com/

[NodeJs.io]: https://img.shields.io/badge/-Node.js-green?style=for-the-badge&logo=Node.js

[NodeJs-url]: https://nodejs.org/en/

[WebPack.io]: https://img.shields.io/badge/-WebPack-blue?style=for-the-badge&logo=webpack

[WebPack-url]: https://webpack.js.org/
