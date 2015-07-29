(function ($) {
    $(document).ready(function () {
        var button, money_div, left_div, upgrade_div, upgrades;

        var Money = {
            currentMoney: 0,
            updateMoney: function (amt) {
                this.currentMoney += amt;
                money_div.html('<div class="background"></div>' + '$' + this.currentMoney.toFixed(2));
                money_div.attr('data-amt', Math.round(this.currentMoney));
            }

        };

        var work_interval;

        function clear_interval() {
            clearInterval(work_interval);
        }

        var Workforce = {
            currentWorkers: 0,
            currentPower: 0,
            currentPrice: 200,
            currentMPS: 0,
            startWork: function () {
                work_interval = setInterval(function () {
                    Workforce.doWork(Workforce.currentPower * Workforce.currentWorkers)
                }, 1000);
                Workforce.currentMPS += Workforce.currentPower * Workforce.currentWorkers;
            },
            doWork: function (amt) {
                Money.updateMoney(amt);
            },
            addWorker: function (amt, inc) {
                this.currentWorkers += amt;
                this.currentPower++;
                this.currentPrice += inc;
            }

        };

        var Upgrade = {
            currentStep: 0,
            addUpgrade: function (inc) {
                this.currentStep += inc;
                this.upgradePower(this.currentStep * .1);
            },
            upgradePower: function (amt) {
                Power.increaseAmt(amt);
            }
        };

        var Power = {
            amt: 1,
            increaseAmt: function (amt) {
                this.amt = this.amt + amt;
            }
        };

        button = $('.money-button');
        money_div = $('.game-container__money');
        left_div = $('.game-container__left');


        function click() {
            Money.updateMoney(Power.amt);
        }

        function reveal_upgrade() {
            $(left_div).addClass('step-1');
            $.ajax({
                url: '/upgrades'
            }).done(function (html) {
                $(left_div).append(html);
                window.setTimeout(function () {
                    $('.upgrade-panel').addClass('revealed');
                }, 1000);
                $('.upgrades').on('click', function (e) {
                    upgradeHandler(e.target, $(e.target).attr('data-cost'));
                    $(e.target).css('display', 'none');
                });


            });

        }

        $(button).on('click', function () {
            click();
            if (Money.currentMoney == 10) {
                reveal_upgrade();
            }
        });

        var a = 0;

        $('.worker-button').on('click', function () {
            if (Money.currentMoney >= Workforce.currentPrice) {
                var cost = Workforce.currentPrice;
                Money.updateMoney(-cost);
                buy_worker(a);
                $('.worker-price').html('$' + Workforce.currentPrice);

            }
        });

        function buy_worker() {
            clear_interval();
            Workforce.addWorker(1, Workforce.currentPrice * 0.2);
            $('.worker-counter').html(Workforce.currentWorkers);
            Workforce.startWork();
            console.log(Workforce.currentMPS);
            $('.worker-mps').html(Workforce.currentMPS);
        }


        function upgradeHandler(btn, cost) {
            var btn_num = $(btn).prop('id');
            Money.updateMoney(-cost);
            Upgrade.addUpgrade(btn_num);
        }

    })
    ;


})
(jQuery);