
    /**
     * 定位锚
     */
    window.location.hash = '#signIn';

    $(function() {

        /**
         * 点击切换动画
         */
        $('.tool > div').click(function(event) {

            var $this = $(this),
                klass = $this.attr('class');

            if(klass.split(' ').indexOf('active') !== -1) {
                return;
            }

            $this
                .addClass('active')
                .siblings().removeClass('active');

//          var move = klass.split(' ').indexOf('sign-up') !== -1 ? '55px' : '3px';
//
//          $this
//              .parent().find(":last-child")
//              .animate({
//                  left: move,
//              }, 200);

        });


        $("#zhuce").click(function() {
            $(".error").show(400);
            return false;
        });

    });