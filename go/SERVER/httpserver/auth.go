package main

import (
	"net/http"

	"github.com/gorilla/sessions"
)

// func Register(ctx context.Context) error {
// 	var data User

// 	_, err := bcrypt.GenerateFromPassword([]byte(data.Password), 14)
// 	if err != nil {
// 		return http.ErrNotSupported
// 	}

// 	user := &User{
// 		Username: data.Username,
// 		Email:    data.Email,
// 		Password: data.Password,
// 	}

// 	err = CreateUser(user)
// 	return err
// }

// func Login(ctx context.Context) error {
// 	var data User

// 	user := &User{
// 		Username: data.Username,
// 		Password: data.Password,
// 	}

// 	// userExists := UserExists(user)

// }

func verifyCookie(w http.ResponseWriter, r *http.Request) bool {
	// session, _ := store.Get(r, "session")
	// // Check if user is authenticated
	// _, auth := session.Values["authenticated"]
	// if auth {
	// 	return true

	session, _ := store.Get(r, "session")
	_, ok := session.Values["username"]
	if !ok {

		return false
	}

	return true
}

func setCookie(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session")
	session.Values["authenticated"] = true
	session.Save(r, w)
}

func logout(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session")

	// Revoke users authentication
	session.Values["authenticated"] = false
	session.Save(r, w)
}

func cookieStore() *sessions.CookieStore {
	SecretKey := []byte("super-secret-SecretKey")
	cookieStore := sessions.NewCookieStore(SecretKey)

	// function returns the cookie store so other functions can access it
	return cookieStore
}
