'use strict';

    var box  = $$('.box')[0];
    var box1 = $$('#box1')[0];
    var box2 = $$('#box2')[0];

    var k = -1;

    $$('.button')[0].onclick = function(event) {

        if($$.animate) return;

        var spend = 700;
        var run   = 260;

        switch(k = ++k % 7) {
            case 0: {
                box.moveTo(run, 0, spend);
                box1.opacityTo(0.3, spend);
                break;
            }
            case 1: {
                box
                    .moveTo(0, run, spend)
                    .opacityTo(0.2, spend)
                    .bgColorTo('rgba(235, 24, 40, 0.8)', 1000);

                box1
                    .bgColorTo('rgba(0, 235, 100, 1)', spend)
                    .opacityTo(0.4, spend);
                break;
            }
            case 2: {
                box.moveTo(-run, 0, spend);
                break;
            }
            case 3: {
                box.moveTo(0, -run, spend);
                box1.opacityTo(0, spend);
                break;
            }
            case 4: {
                box
                    .opacityTo(0.8, 1000, false, function() {
                        this.moveTo(run, run, spend);
                        box1.opacityTo(0.3, spend - 100);
                    })
                break;
            }
            case 5: {
                box
                    .moveTo(-run, 0, spend)
                    .opacityTo(0.6, spend, true)
                    .bgColorTo('rgba(30, 144, 255, 1)', 1000);
                break;
            }
            case 6: {
                box
                    .moveTo(0, -run, spend)
                    .opacityTo(1, spend, true);
                break;
            }
        }
    }

    box2.onmouseover = function(event) {
        this
            .animate({
                'width': '150px',
                'font-size': '32px',
                'line-height': '70px',
                'background-color': 'dodgerblue',
            }, 500);
    }

    box2.onmouseleave = function(event) {
        this.bgColorTo('rgba(0, 205, 40, 0.7)')
            .animate({
                'width': '70px',
                'font-size': '20px',
                'line-height': '20px',
                'transform': 'rotate(45deg)',
            });
    }
