<template>
    <div>
        <h1>Home</h1>
        <div class="nav">
            <router-link class="popup-link" to="calculator">
                Калькулятор
            </router-link>
        </div>
        <div class="nav">
            <router-link class="popup-link" to="websocket">
                Websocket echo
            </router-link>
        </div>
    </div>
</template>

<script lang="babel" type="text/babel">
    export default {};
</script>

<style>
    .nav {
        margin : 0.5rem 1rem;
    }
</style>
