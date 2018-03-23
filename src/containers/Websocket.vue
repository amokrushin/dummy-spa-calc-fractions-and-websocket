<template>
    <div>
        <h1>Websocket</h1>

        <div>
            <ul class="comments">
                <li v-for="comment in comments" :key="comment.id" class="comment">
                    <div v-text="comment.message" class="message"></div>
                    <button @click="removeCommentRequest(comment.id)" class="action">Удалить</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="babel" type="text/babel">
    const WS_URI = 'ws://echo.websocket.org/';

    export default {
        data: () => ({
            ws: {
                connected: false,
                error: false,
            },
            comments: [
                { id: 1, message: 'Тестовый коммент' },
                { id: 2, message: 'Это шедевр' },
                { id: 3, message: 'Это прекрасно' },
                { id: 4, message: 'Лучшее, что я видел' },
                { id: 5, message: 'Два чая этому автору' },
                { id: 6, message: 'Тестовый коммент' },
                { id: 7, message: 'Это шедевр' },
                { id: 8, message: 'Это прекрасно' },
                { id: 9, message: 'Лучшее, что я видел' },
                { id: 10, message: 'Два чая этому автору' },
            ],
        }),
        mounted() {
            this.$ws = new WebSocket(WS_URI);
            this.$ws.onopen = () => {
                this.ws.connected = true;
                console.log('[WebSocket]', 'connected to', WS_URI);
            };
            this.$ws.onclose = () => {
                this.ws.connected = false;
                console.log('[WebSocket]', 'disconnected', event.code);
            };
            this.$ws.onmessage = (event) => {
                this.handleWsResponse(event.data);
            };
            this.$ws.onerror = () => {
                console.error('[WebSocket]', 'error');
                this.ws.error = true;
            };
        },
        methods: {
            handleWsResponse(message) {
                const commentId = Number(message);
                this.removeCommentCommit(commentId);
            },
            sendWsRequest(message) {
                if (!this.ws.connected) {
                    console.error('WebSocket not connected');
                }
                this.$ws.send(message);
            },
            removeCommentRequest(commentId) {
                this.sendWsRequest(commentId);
            },
            removeCommentCommit(commentId) {
                const comment = this.comments.find(c => c.id === commentId);
                if (comment) {
                    const commentIndex = this.comments.indexOf(comment);
                    this.comments.splice(commentIndex, 1);
                } else {
                    console.error(`Comment with id=${id} not found`);
                }
            },
        },
        beforeDestroy() {
            if (this.ws.connected) {
                this.$ws.close();
            }
        },
    };
</script>

<style scoped>
    .comments {
        max-width : 400px;
    }

    .comment {
        display         : flex;
    }

    .message {
        justify-self : flex-start;
        flex-grow    : 1;
        text-align   : left;
    }

    .action {
        justify-self : flex-end;
    }
</style>
