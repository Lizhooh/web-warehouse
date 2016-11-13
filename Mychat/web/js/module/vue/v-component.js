'use strtic';

(function(Vue) {

    /**
     * 头像框组件
     */
    Vue.component('head-box', {
        props: ['user'],
        template:
            '<header class="head-box">' +
                '<div class="pro">' +
                    '<span class="first-name" v-cloak>{{ user.name[0] }}</span>' +
                '</div>' +
                '<p class="name" v-cloak>{{ user.name }}</p>' +
            '</header>',
    });

    /**
     * 用户列表组件
     */
    Vue.component('user-list-item', {
        props: ['user'],
        template:
            '<li class="user-list-item">' +
                '<div class="pro">' +
                    '<span class="first-name">{{ user.name[0] }}</span>' +
                '</div>' +
                '<p class="name" v-cloak>{{ user.name }}</p>' +
                '<p class="time" v-cloak>{{ user.time }}<span>进入</span></p>' +
            '</li>',
    });

    /**
     * 消息列表, 他们的消息
     */
    Vue.component('news-they', {
        props: ['news'],
        template:
            '<li class="news-list-item" :class="news.who">' +
                '<div class="lefts">' +
                    '<div class="pro">' +
                        '<span class="first-name">{{ news.name[0] }}</span>' +
                    '</div>' +
                '</div>' +
                '<div class="rights">' +
                    '<p class="name">{{ news.name }}</p>' +
                    '<div class="info">{{ news.info }}</div>' +
                '</div>' +
                '<div class="time">{{ news.time }}</div>' +
            '</li>',
    });

})(Vue);
