<template>
    <section class="homepage">
        <section class="homepageOne">
            <div class="text-over-drone">
                <h1 translate="no"><b class="highlight-letter">U</b>AV <b class="highlight-letter">F</b>LIGHT <b class="highlight-letter">P</b>LANNER</h1>
                <section class="planner-button-container">
                    <!-- <router-link to="/planner"><button class="but">Plan Your Flight Now</button></router-link> -->
                    <router-link to="/login"><button class="but">Login</button></router-link>
                    <router-link to="/signup"><button class="but">Signup</button></router-link>
                </section>
            </div>
        </section>
        <!-- <section class="homepageTwo">
            <section class="homepageTwo-sub">
                <b> <b class="highlight-letter">R</b>oute </b><br>
                <p>Seeking to plan the best route for your next flight? This system uses a series of nodes to calulate the fastest flight path from a given source to the target destination</p>
            </section>
            <section class="homepageTwo-sub">
                <b> <b class="highlight-letter">T</b>ime </b><br>
                <p>Choose your own in-flight speed and recieve accurate arrival time estimates to your chosen destination</p> 
            </section>
        </section>
        <section class="homepageTwo">
            <section class="homepageTwo-sub">
                <b> <b class="highlight-letter">D</b>istance </b><br>
                <p>Seeking to plan the best route for your next flight? This system uses a series of nodes to calulate the fastest flight path from a given source to the target destination</p>
            </section>
            <section class="homepageTwo-sub">
                <b> <b class="highlight-letter">O</b>ptimised</b><br>
                <p>Choose your own in-flight speed and recieve accurate arrival time estimates to your chosen destination</p> 
            </section>
        </section> -->
    </section>
</template>

<style scoped>
    .homepage {
        display: grid;
        grid-template-rows: 60% 20% 20%;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        background-color: rgb(57, 56, 56);
        
    }

    .homepageOne {
        background-image: url("../assets/greyDroneSmall.png");
        background-position: bottom;
        background-size: cover;
        height: 580px;
        color: white;
        padding: 10px;
    }


    .text-over-drone {
        padding-top: 2%;
        text-align: center;
        font-weight: 400;
    }

    .text-over-drone h1{
        font-size: 56px;
        margin-top: 7.5%;
    }

    .highlight-letter {
        
        color: rgb(120, 255, 36);
    }

    .homepageTwo {
        display: grid;
        grid-template-columns: 50% 50%;
        align-items: center;
        justify-items: center;
        font-size: 16px;
        font-weight: 300;
        padding: 20px 25px;
        color: white;
        text-align: center;
        background-color: rgb(101, 100, 100);
        background-color: rgb(196, 196, 196);
    }

    .homepageTwo-sub {
        width: 75%;
        height: 80%;
        background-color: grey;
        padding: 16px;
        border: solid white .5px;
        border-radius: 10px;
        font-weight: 400;
    }

    .homepageTwo-sub:hover {
        background-color: rgb(157, 157, 157);
        cursor: pointer;
    }

    .planner-button-container {
        display: grid;
        grid-template-rows: 50% 50%;
    }

    .but {
        margin: 1%;
        font-size: 15pt;
        padding: 10px 15px;
        color: white;
        font-weight: bolder;
        background-color: rgb(101, 100, 100);
        border: rgb(120, 255, 36) 2px solid;
        border-radius: 7px;
        width: 10%;
    }

    .but:hover {
        background-color: rgb(130, 127, 127);
        cursor:pointer;
    }


</style>

<script>
  
</script>