<template>
    <section class="settings-container">
        <form>
            <section class="settings-form">
                <div class="settings-row">
                    <label for="font-size">Select Font Size: </label>
                    <input type="number" id="font-size" name="font-size" ref="font">
                </div>
                <div class="settings-row">
                    <label for="theme">Select Theme: </label>
                    <select name="theme" id="theme" ref="theme">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <!-- <div class="settings-row">
                    <label for="units">Select Measurement Units: </label>
                    <select name="units" id="units" ref="units">
                        <option value="km">Metric</option>
                        <option value="m">Imperial</option>
                    </select>
                </div> -->
            </section>
            <button type="button" @click="handleSubmit()">Apply</button>
        </form>
    </section>
</template>

<script>
export default {
    data() {
        return {
            size: 0,
            theme: "",
            units: ""
        }
    }, methods: {
        handleSubmit() {
            this.size =  this.$refs.font.value
            this.theme =  this.$refs.theme.value
            //this.units = this.$refs.units.value
            console.log( this.$refs.theme.value, this.$refs.font.value)
            this.$emit('settingsEvent', {s:this.size, t:this.theme, u:0})
            var d = document.getElementById("app")
            var s = document.getElementById("link-text")
            // var lt = document.getElementById("lt")
            d.style.fontSize = this.size+"px"
            s.style.fontSize = this.size+"px"
            //lt.style.fontSize = this.size+"px"
            var n = document.getElementsByClassName("nav-content-container")
            var navbar = document.getElementsByClassName("navbar")
            var navLinks = document.getElementById("link-text")
            var t = document.getElementsByClassName("links")
            var mapHeader = document.getElementById("distance-caption-container")
            if (this.theme === "dark") {
                n = document.getElementsByClassName("nav-content-container")
                navbar = document.getElementsByClassName("navbar")
                for (let i = 0; i < n.length; i++) {
                    n[i].style.backgroundColor = "#504F4F";
                    navbar[i].style.backgroundColor = "#504F4F";
                    navbar[i].style.borderBottom = "solid 1px white";
                }
                
                for (let i = 0; i < n.length; i++) {
                    t[i].style.color = "#78FF24";
                }
                navLinks.style.color = "#78FF24"

                mapHeader.style.backgroundColor = "#757373"
                mapHeader.style.color = "#FFFFFF"
                mapHeader.style.borderRight = "solid 1px white"
                //mapHeader.style.borderTop = "solid 1px white"
            }
            else if (this.theme === "light") {
                n = document.getElementsByClassName("nav-content-container")
                navbar = document.getElementsByClassName("navbar")
                for (let i = 0; i < n.length; i++) {
                    n[i].style.backgroundColor = "#78FF24";
                    navbar[i].style.backgroundColor = "#78FF24";
                    navbar[i].style.borderBottom = "solid 2px #504F4F";
                }
                
                for (let i = 0; i < n.length; i++) {
                    t[i].style.color = "#504F4F";
                   
                }
                navLinks.style.color = "#504F4F"

                mapHeader.style.backgroundColor = "#FFFFFF"
                mapHeader.style.color = "#000000"
                mapHeader.style.borderRight = "none"
                //mapHeader.style.borderTop = "none"
            }
        }
    }
}
</script>

<style>
    .settings-container {
        background-color: rgb(117, 115, 115);
        color: white;
        padding: 5px;
        border: solid rgb(184, 255, 36) 2px;
    }

    .settings-form {
        display: grid;
        grid-template-rows: 50% 50%cd;
    }

    .settings-row {
        padding: 5px;
    }

    .settings-row input {
        float: right;
    }

    .settings-row select {
        float: right;
    }

    select { width: 35%;}

    .settings-container button {
        margin-left: 40%;
        margin-right: 20%;
    }

</style>