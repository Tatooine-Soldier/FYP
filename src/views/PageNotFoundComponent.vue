<template>
    <section class="error-page">
        <section class="message-container">
            <section class="message">
                <h1>404 PAGE NOT FOUND</h1>
            </section>
        </section>
    </section>
</template>

<style>
    .error-page {
        background-image:  url("../assets/output-onlinepngtools.png"); 
        background-repeat: repeat;
        display: flex;
       
        height: 70vh;
    }

    .message-container {
        display: flex;
        margin-left: 38%;
        align-items: center;
    }

    .message {
        color: rgb(57, 56, 56);
        background-color: white;
        border: solid rgb(184, 255, 36) 2px;
        padding: 30px;
        text-align: center;
        align-self: center;
        font-size: 22px;
        margin-left: 16%;
        width: 100%;
    }
</style>