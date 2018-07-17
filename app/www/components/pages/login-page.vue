<!-- The login page -->
<template>
    <div id="login" class="centered-container">
        <md-content class="md-elevation-3">
            <div class="title">
                <img src="img/logo.png">
                <div class="md-title">EVNotify</div>
                <div class="md-body-1">{{ translated.SLOGAN }}</div>
                <div class="md-body-1 error-message" v-if="invalidCredentials">{{ translated.INVALID_CREDENTIALS }}</div>
            </div>
            <form class="form">
                <md-field>
                    <label>AKey</label>
                    <md-input v-model="akey" autofocus v-on:input="invalidCredentials=false" required></md-input>
                </md-field>
                <md-field md-has-password>
                    <label>{{ translated.PASSWORD }}</label>
                    <md-input v-model="password" type="password" v-on:input="invalidCredentials=false" required></md-input>
                </md-field>
            </form>
            <div class="actions md-layout md-alignment-center-space-between">
                <router-link to="/register">{{ translated.CREATE_ACCOUNT }}</router-link>
            </div>
            <div class="actions md-layout md-alignment-center-space-between">
                <router-link to="/passwordForgot">{{ translated.PASSWORD_FORGOT }}</router-link>
                <md-button class="md-raised md-primary" @click="login" id="loginBtn">{{ translated.LOGIN }}</md-button>
            </div>
            <div class="loading-overlay" v-if="loading">
                <md-progress-spinner md-mode="indeterminate" :md-stroke="2"></md-progress-spinner>
            </div>
        </md-content>
        <div class="background"></div>
        <transition name="fade">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import translation from './../modules/translation.vue';
    import storage from './../modules/storage.vue';

    export default {
        data() {
            return {
                loading: false,
                akey: '',
                invalidCredentials: false,
                password: '',
                translated: {}
            };
        },
        components: {
            translation,
            storage
        },
        methods: {
            login() {
                // TODO
            }
        },
        created() {
            // determine if we are already logged in - if so, skip login page
            if (storage.getValue('token') && storage.getValue('akey')) return this.$router.push('/register'); // TODO route to dashboard later

            // translate all labels in correct language
            this.translated = translation.translatePage();
        }
    };
</script>