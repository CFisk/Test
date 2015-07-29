/**
 * Created by Cameron on 7/20/2015.
 */


(function ($) {

    $(document).ready(function () {
        var a = $('.game-container__money');
        $(a).on('DOMSubtreeModified', function () {
            window.setTimeout(function() {
                $('.background').addClass('animate');
            }, 100);
            window.setTimeout(function () {
                $('.background.animate').removeClass('animate');
            }, 200);


        });
    });

})(jQuery);