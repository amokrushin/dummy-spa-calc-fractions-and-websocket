<template>
    <div>
        <h1>Websocket</h1>

        <div class="comments-wrapper">
            <ul class="comments-list">
                <li v-for="comment in comments" :key="comment.id" class="comment">
                    <div v-text="comment.message" class="message"></div>

                    <button
                        class="action"
                        @click="removeCommentRequest(comment.id)"
                        :disabled="!comment.synced"
                    >
                        Удалить
                    </button>
                </li>
                <li v-if="error" class="error-overlay">
                    <div class="error-message" v-text="error.message"></div>
                    <div>
                        <a href="#" @click.prevent="reloadPage">Reload page</a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="babel" type="text/babel">
    const WS_URI = 'ws://echo.websocket.org/';

    function withEmulatedDelay(handler, min, max) {
        return function (message) {
            const delay = Math.ceil(Math.random() * (max - min) + min);
            setTimeout(() => handler(message), delay);
        };
    }

    function withEmulatedFailure(handler) {
        return function (data) {
            const message = JSON.parse(data);
            if (message.commentId === 9) {
                handler();
                return;
            }
            if (message.commentId === 10) {
                handler(JSON.stringify({ error: { code: 500, message: 'foo' } }));
                return;
            }
            handler(data);
        };
    }

    function mapAssignState(collection, state) {
        return collection.map(item => ({ ...item, ...state }));
    }

    export default {
        data: () => ({
            ws: {
                connected: false,
                error: false,
            },
            comments: mapAssignState([
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
            ], { synced: true }),
            error: null,
        }),
        mounted() {
            this.$ws = Object.freeze(new WebSocket(WS_URI));
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

            this.handleWsResponse = this.handleWsResponse.bind(this);
            this.handleWsResponse = withEmulatedDelay(this.handleWsResponse, 0, 5000);
            this.handleWsResponse = withEmulatedFailure(this.handleWsResponse);
        },
        methods: {
            handleWsResponse(data) {
                let message;
                try {
                    message = JSON.parse(data);
                } catch (err) {
                    this.error = new Error('Server return invalid message');
                    return;
                }
                if (typeof message !== 'object') {
                    this.error = new Error('Server return invalid response');
                    return;
                }
                if (message.error) {
                    this.error = new Error(`Server return error: ${message.error.message}`);
                    return;
                }
                switch (message.action) {
                    case 'removeComment':
                        this.removeCommentCommit(message.commentId);
                        break;
                    default:
                        this.error = new Error('Server return invalid action');
                }
            },
            sendWsRequest(message) {
                if (!this.ws.connected) {
                    console.error('WebSocket not connected');
                }
                const data = JSON.stringify(message);
                this.$ws.send(data);
            },

            removeCommentRequest(commentId) {
                const comment = this.comments.find(comment => comment.id === commentId);
                if (comment) {
                    comment.synced = false;
                    this.sendWsRequest({
                        action: 'removeComment',
                        commentId,
                    });
                }
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
            reloadPage() {
                window.location.reload();
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
    .comments-wrapper {
        display         : flex;
        justify-content : center;
    }

    .comments-list {
        display        : flex;
        width          : 400px;
        position       : relative;
        flex-direction : column;
    }

    .comment {
        display : flex;
    }

    .message {
        justify-self : flex-start;
        flex-grow    : 1;
        text-align   : left;
    }

    .action {
        justify-self : flex-end;
    }

    .error-overlay {
        position         : absolute;
        top              : 0;
        left             : 0;
        bottom           : 0;
        right            : 0;
        background-color : rgba(255, 255, 255, 0.95);
        display          : flex;
        justify-content  : center;
        align-items      : center;
        flex-direction   : column;
    }

    .error-message {
        color : red;
    }
</style>
