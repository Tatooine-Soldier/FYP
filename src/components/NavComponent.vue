<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <section class="navbar" id="sticky">
        <section class="nav-content-container">
            <section class="nav-sections">
                <section class="logo-container">
                    <img src="../assets/drone-logo.png" id="logo"/>
                </section>
            </section>
            <section class="nav-sections" id="links-section">
                <section class="nav-lists">
                    <section class="links"><router-link to="/"><b id="link-text"><i class="fa fa-fw fa-home"></i></b></router-link></section>
                    <section class="links"><router-link to="/"><b id="link-text">About</b></router-link></section>
                    <section class="links"><router-link to="/weatherDisplay"><b id="link-text">Forecast</b></router-link></section>
                    <section class="links" id="nav-planner"><router-link to="/planner"><b id="link-text">Planner</b></router-link></section>
                </section>
            </section>
            <section class="nav-sections">
                <section class="nav-buttons">
                    <ul>
                        <router-link to="/profile"><li><img src="../assets/login-icon.jpg" id="login-icon" /><img src="../assets/logininv-icon.png" id="logininv-icon"/></li></router-link>
                    </ul>
                    <!-- <section class="dropdown" id="dropdown">
                        <section class="dropdown-container">
                            <router-link to="/login"><b id="menu-links">Log In</b></router-link>
                            <router-link to="/signup"><p id="menu-links">Sign Up</p></router-link>
                        </section>
                    </section> -->
                </section>
            </section>
        </section>
    </section>
</template>

<style scoped>
    .navbar {
        display: flex;
        flex-direction: row;
        /*background-color: rgb(184, 255, 36);*/
        background-color: rgb(120, 255, 36);
        color: rgb(80, 79, 79);
        font-size: 32px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        max-height: 65px;
        border-bottom: solid rgb(80, 79, 79) 2px;
        box-shadow: 0px 7px 12px rgb(68, 67, 67);
        padding: 5px;
        padding-bottom: 10px;
    }

    .nav-content-container {
        display: grid;
        grid-template-columns: 10% 80% 10%;
        /*background-color: rgb(184, 255, 36);*/
        background-color:  rgb(120, 255, 36);
        width: 100%;
    }

    #links-section {
        display: flex;
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: left;
    }

    #nav-planner {
        visibility: hidden;
        padding-left: 24%;
    }

    .nav-sections:first-child, .nav-sections:last-of-type {
        text-align: center;
        display: flex;
        justify-content: center;
        padding: 1%;
    }

    .nav-lists {
        display: grid;
        grid-template-columns: 19% 27% 27% 27%;
        margin-left: 2%;
        margin-right: 9%;
    }

    #login-icon {
        height: 40px;
        width: 40px;
        margin-top: 30%;
        display: none;
    }

    .links {
        margin-left: 10px;
        margin-right: 20px;
    }

    .links b:hover {
        color: white;
        cursor:pointer;
    }

    #logo {
        width: 55px;
        height: 50px;
        margin: 0px;
        margin-top: 5.5%;
    }

    .logo-container {
        padding-right: 10px;
        padding-left: 10px;
        justify-content: center;
        height: 45px;
        padding-top: 5px;
    }

    .sticky {
        position: fixed;
        top: 0;
        width: 100%;
    }

    .nav-buttons ul {
        margin: 0px;
        display: flex;
        justify-content: center;
    }

    .nav-buttons li {
        list-style: none;
        align-items: center;
    }

    .nav-buttons button {
        margin-left: 10px;
        margin-top: 20%;
        padding: 3px;
        width: 60px;
        border: rgb(80, 79, 79) 2px solid;
        background-image: linear-gradient(120deg, rgb(255, 255, 255), rgb(184, 255, 36));
        color: rgb(61, 61, 61);
        display: flex;
        justify-content: center;
    }

    

    .links:first-of-type {
        margin-right: 0px;
    }

    a {text-decoration: none;}

    #link-text{
        color: rgb(61, 61, 61);
        text-decoration: none;
        font-size: 30px;
    }

    #link-text:hover {
        color: white;
        text-decoration: underline;
        text-shadow: none;
    }

    #homeinv-icon {
        display: none;
    }

    #logininv-icon {
        height: 40px;
        width: 40px;
        margin-top: 20%;
        display: none;
    }

    #menu-links {
        color: white;
    }

    .dropdown {
        position: relative;
        background-color: rgb(68, 67, 67);
        color: white;
        display: none;
    }

    .dropdown-container {
        font-size: 14px;
        padding: 5px;
    }

    @media screen and (max-width: 600px){
        .nav-content-container {
            grid-template-rows: 33% 33% 33%;
        }
    }


</style>

<script>

// export default {
//     data() {
//         return {
//             user: this.$globalUser
//         }
//     }
// }

//import { watch } from 'vue';

//import axios from 'axios';


//   document.addEventListener('DOMContentLoaded', function() {
//     var loginicon = document.getElementById('login-icon');
//     var logininv = document.getElementById('logininv-icon');
//     loginicon.onmouseover = function() { 
//         loginicon.style.display = 'none';
//         logininv.style.display = 'block';
//         logininv.style.cursor = 'pointer';
//     }
//     loginicon.onmouseout = function() {
//         loginicon.style.display = 'block';
//         logininv.style.display = 'none';
//     }


//     var dropdown = document.getElementById("dropdown");
//     var counter = 1;

//     function showMenu() {
//         if (counter % 2 == 0) {
//             dropdown.style.display = "none";
//         } else {
//             dropdown.style.display = "block";
//         }
//         counter = counter + 1;
//     }

//     logininv.addEventListener("click", showMenu)
    

    // if (this.$globalUser !== "0") {
    //     axios
    //     .post("/getUsername", this.$globalUser)
    //     .then((response) => {
    //       const data = response.data;
    //       console.log("Login outcome: ",data); //NEED TO REDIRECT
    //     })
    //     .catch (function (error) {
    //         console.log("ERROR:", error);    
    //     })
    // }

    // var x = document.getElementById("sticky");
    // var topVal= x.offsetTop;
    // function stickNav(x, topval) {
    //         console.log("stick  nav called")
    //         if (window.pageYOffset >= topval) {
    //         x.classList.add("sticky");
    //         console.log("making sticky")
    //         } else {
    //         x.classList.remove("sticky");
    //         console.log("NOT making sticky")
    //         }
    //     }
    // window.onscroll = function() {stickNav(x, topVal)};


    // });

</script>