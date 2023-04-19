# fyp3 - Final Year Project - Web based system for planning UAV flight paths  
The Go server is located in *go/SERVER/httpserver/main.go*
## Contents  
  
### Frontend  
-VueJS  
  -vue (version 3.2.13): Used to access Vue lifecycle hooks and methods  
  -googlemaps/js-api-loader (version 1.15.1): Used to load Google Maps API  
  -axios (version 1.2.2): Used to issue Axios API requests  
### Backend  
-Golang  
  -go (version 1.18)  
  -github.com/gorilla/sessions (version 1.2.1): Used for creating and storing user sessions  
  -github.com/google/uuid (version 1.3.0): Used for creating unique user IDs  
  -go.mongodb.org/mongo-driver (version 1.10.3): Used to perform CRUD operations  
  -github.com/pkg/errors (version 0.9.1): Used for error handling  
### Database  
-MongoDB (version 5.0.9)  



## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
