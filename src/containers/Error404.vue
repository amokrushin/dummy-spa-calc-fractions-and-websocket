<template>
    <div class="error-page">
        <div class="error-code">
            404
        </div>
        <div>
            <div class="error-card">
                <p>Oops. Nothing here...</p>
                <p class="">
                    <a
                        class="link"
                        href="#"
                        v-if="canGoBack"
                        @click="goBack"
                    >
                        Go back
                    </a>
                    <span></span>
                    <a
                        class="link"
                        href="#"
                        @click="$router.replace('/')"
                    >
                        Go home
                    </a>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: () => ({
            canGoBack: window.history.length > 1,
        }),
        methods: {
            goBack() {
                window.history.go(-1);
            },
        },
    };
</script>

<style scoped>
    .error-page {
        height         : 100vh;
        width          : 100%;
        overflow       : hidden;
        display        : flex;
        flex-direction : column;
        padding-top    : 10%;
    }

    .error-code {
        font-size : 3rem;
    }

    .link {
        padding-right : 1rem;
    }
</style>
