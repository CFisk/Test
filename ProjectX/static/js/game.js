/*This is the main control for a clicker game. It is written using jQuery, and is inside a jQuery wrapper in order to avoid conflicts.
Currently, it is extremely basic, but it has the ability to be expanded upon very easily--to add more upgrades and different types of workers.
*/
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
        //work_interval controls the speed at which workers earn "Money"
        var work_interval;

        function clear_interval() {
            clearInterval(work_interval);
        }
        //right now, the workforce opperates on a very simple level.
        //every time you buy a worker, you increase the amount of "Power," which represents how much work the workers do.
        //you also increase the cost of the workers with each successive purchase.
        var Workforce = {
            currentWorkers: 0,
            currentPower: 0,
            currentPrice: 200,
            currentMPS: 0, //currentMPS is "Money Per Second" a helpful statistic to have
            startWork: function () {
                work_interval = setInterval(function () { //here is where it is determined how quickly the workers work
                    Workforce.doWork(Workforce.currentPower * Workforce.currentWorkers)
                }, 1000);
                Workforce.currentMPS += Workforce.currentPower * Workforce.currentWorkers;
            },
            doWork: function (amt) { //every time a worker works, the Money variable grows
                Money.updateMoney(amt);
            },
            addWorker: function (amt, inc) {
                this.currentWorkers += amt;
                this.currentPower++;
                this.currentPrice += inc;
            }

        };

        var Upgrade = { //This increases the amount of money you get from each click.
            currentStep: 0,
            addUpgrade: function (inc) {
                this.currentStep += inc;
                this.upgradePower(this.currentStep * .1);
            },
            upgradePower: function (amt) {
                Power.increaseAmt(amt);
            }
        };

        var Power = { //this defines Power, and is used to determine the amount of money from each click.
            amt: 1,
            increaseAmt: function (amt) {
                this.amt = this.amt + amt;
            }
        };

        button = $('.money-button');
        money_div = $('.game-container__money');
        left_div = $('.game-container__left');


        function click() { //every click of the button, you get a certain amount of Money.
            Money.updateMoney(Power.amt);
        }

        function reveal_upgrade() { //In order not to overload the user, each successive upgrade is hidden until a certain threshold of Money is reached.
            $(left_div).addClass('step-1');
            $.ajax({
                url: '/upgrades'
            }).done(function (html) {
                $(left_div).append(html);
                window.setTimeout(function () {
                    $('.upgrade-panel').addClass('revealed');
                }, 1000);
                $('.upgrades').on('click', function (e) {
                    upgrade_handler(e.target, $(e.target).attr('data-cost'));
                    $(e.target).css('display', 'none');
                });


            });

        }

        $(button).on('click', function () { //Once a threshold is reached, the upgrade is revealed. more can be added in the future
            click();
            if (Money.currentMoney == 10) {
                reveal_upgrade();
            }
        });


        function buy_worker() { //this function handles the actions that occur after the buy worker button is clicked.
            if (Money.currentMoney >= Workforce.currentPrice) {
                var cost = Workforce.currentPrice;
                Money.updateMoney(-cost);
            }
            clear_interval(); //first, all workers are stopped.
            Workforce.addWorker(1, Workforce.currentPrice * 0.2); //then, a worker is added, with the parameter 1 to indicate 1 worker,
            //and the 2nd parameter controls how much the price increases by with each successive purchase, in this case, 20%
            $('.worker-counter').html(Workforce.currentWorkers);
            Workforce.startWork(); //workers can begin to work again
            console.log(Workforce.currentMPS);
            $('.worker-mps').html(Workforce.currentMPS); //this updates the current Money Per Second with the new worker factored in.
        }


        function upgrade_handler(btn, cost) { //this function handles the actions that occur after the buy upgrade button is clicked.
            var btn_num = $(btn).prop('id'); //each button has an ID with a number in order to keep track of what upgrade was clicked.
            Money.updateMoney(-cost);
            Upgrade.addUpgrade(btn_num);
        }
        
        $('.worker-button').on('click', function () { //this is a listener to activate the buy_worker function if the corresponding button is clicked.
                buy_worker();
                $('.worker-price').html('$' + Workforce.currentPrice);
            }
        });

    })
    ;


})
(jQuery);
