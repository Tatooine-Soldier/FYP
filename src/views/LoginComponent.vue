<template>
    <section class="login-page" id="login-page">
        <section class="back-link"><router-link to="/">BACK</router-link></section>
        <section class="login-input-container">
            <p>Login to UFP</p>
            <section class="form-container">
                <form method="post">
                    <section class="form-elements">
                        <label>Username:</label>
                        <input type="text"  maxlength="30" v-model="user.name" name="username"/>
                    </section>    
                    <section class="form-elements">
                        <label>Password:</label>
                        <input type="password"  maxlength="30" v-model="user.password" name="password"/>
                    </section>
                    <section class="submit-container">
                        <input id="button" name="submit" type="reset" value="Submit" @click="handleSubmit()"/>
                    </section>
                    <div id="login-message">{{ message }}</div>
                </form>
                
            </section>
        </section>
    </section>
</template>
<style scoped>
    .login-input-container {
        margin: 10%;
        margin-left: 21%;
        margin-right: 21%;
        width: 70%;
        border: solid rgb(184, 255, 36) 2px;
        background-color: white;
        padding: 10px;
        text-align: center;
    }
    .login-input-container p {font-size: 22px;}
    .login-page {padding: 10px; display: flex; justify-content: center; color: rgb(57, 56, 56); background-image: url("../assets/output-onlinepngtools.png"); background-repeat: repeat;}
    .form-container {display: grid; grid-template-rows: 40% 40% 10% 10%;}
    .form-elements{padding: 10px; display: grid; grid-template-columns: 50% 50%; margin: 0% 20%;}
    .back-link a {color: white; font-size: 20px; font-weight: 600;}

    input {
        border: solid 1px rgb(131, 129, 129);
        border-radius: 10px;
        padding: 8px;
    }

    .submit-container {
        padding: 2% 20%; 
    }

    .submit-container input {
        font-size: 16px;
        padding: 10px;
        margin-right: 8%;
        width: 100%;
    }

    #login-message {
        color: red;
        font-weight: 400;
    }

</style>

<script>
import axios from 'axios';
//import { useRoute } from 'vue-router';

export default {
    data() {
      return {
        user: {
          name: '',
          password: ''
        },
        message: ""
      }
    },
  
    methods: {
      handleSubmit() {
        // Send data to the server or update your stores and such.
        // location.href = 'http://localhost:3333/#/loginrequest'
        axios
        .post("/login", this.user)
        .then((response) => {
          const data = response.data;
          this.$globalUser = data.id
          console.log("this.$globalUser", this.$globalUser)
          console.log("Login outcome: ",data); //NEED TO REDIRECT
          if (data.result) {
            //   this.$emit('entryEvent', {n: this.data.name} )
              document.cookie = `session_id=${response.data.session_id}`;
              var np = document.getElementById("nav-planner")
              np.style.visibility = "visible"
              var loginIcon = document.getElementById("login-icon")
              loginIcon.style.display = "inline"
              this.$router.push('planner')
          } else {
            this.message = "Incorrect Username or Password"
          }
        //   useRoute.push('/planner'); 
        })
        .catch (function (error) {
            console.log("ERROR:", error);    
        })
        //console.log("href-->", location.href)
        // location.href = "https://localhost:3333/planner"
      }
    }
}
</script>