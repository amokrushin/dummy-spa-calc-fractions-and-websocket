<template>
    <div>
        <h1>Calculator</h1>
        <div class="container">
            <div class="expression" v-for="item in expression" :key="item.id">
                <div v-if="item.type === 'operand'" class="operand fraction">
                    <input
                        type="number"
                        class="number"
                        :name="`number-n-${item.id}`"
                        v-model="item.value[0]"
                        v-validate="'required|integer'"
                    />
                    <input
                        type="number"
                        class="number"
                        :name="`number-d-${item.id}`"
                        v-model="item.value[1]"
                        v-validate="'required|integer|not_zero'"
                    />
                </div>
                <div v-if="item.type === 'operator'" class="operator">
                    <div class="operation">
                        <select v-model="item.value">
                            <option value="+">+</option>
                            <option value="-">-</option>
                            <option value="*">*</option>
                            <option value="/">/</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="result">
                <div class="operation">
                    =
                </div>
                <div class="fraction">
                    <input type="number" class="number" readonly :value="result[0]">
                    <input type="number" class="number" readonly :value="result[1]">
                </div>
            </div>
        </div>
        <a href="#" @click.prevent="addFraction">Add fraction</a>
    </div>
</template>

<style scoped>
    .container {
        display         : flex;
        justify-content : center;
        align-items     : center;
        flex-wrap       : wrap;
        margin-bottom   : 1rem;
    }

    .fraction > .number {
        width   : 4rem;
        display : block;
        border  : 2px solid gray;
    }

    .fraction > .number.invalid.touched {
        border-color : red;
    }

    .fraction {
        margin : 0 0.5rem;
    }

    .operand, .operator, .result {
        margin-bottom : 1rem;
    }

    .result {
        display         : flex;
        flex-wrap       : nowrap;
        justify-content : center;
        align-items     : center;
    }
</style>

<script>
    import { yard, rpn, calcFractions } from '../libs/math';

    export default {
        data: () => ({
            expression: [
                {
                    type: 'operand',
                    value: [-1, 2],
                    id: 3,
                },
                {
                    type: 'operator',
                    value: '+',
                    id: 2,
                },
                {
                    type: 'operand',
                    value: [1, 2],
                    id: 1,
                },
            ],
        }),
        computed: {
            result() {
                if (this.errors && this.errors.items && this.errors.items.length) {
                    return ['', ''];
                }
                try {
                    const result = rpn(yard(this.expression), calcFractions);
                    return [result.s > 0 ? `${result.n}` : `-${result.n}`, `${result.d}`];
                } catch (err) {
                    return ['', ''];
                }

            },
        },
        methods: {
            addFraction() {
                this.expression.unshift(...[
                    {
                        type: 'operand',
                        value: [1, 2],
                        id: this.expression.length + 2,
                    },
                    {
                        type: 'operator',
                        value: '+',
                        id: this.expression.length + 1,
                    },
                ]);
            },
        },
    };
</script>
