let 
    lat,
    longi
;

var
    attackDamage = [],
    temp = '',
    startFight = false,
    fightMenu = false,
    countSpecialAttack = 0,
    monsterHealth = 100,
    playerHealth = 100
;

var options = {

    enableHighAccuracy: true,
    timeout: 60000,
    maximumAge: Infinity
}

function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition, getLocError, options);
    } else {
        alert("Geolocation is not supported by this browser");
    }
}

function getPosition(pos) {

    var getPos = pos.coords;

    lat = getPos.latitude; 
    longi = getPos.longitude; 
}

function getLocError(e) {

    console.error(`Geolocation error(${e.code}): ${e.message}`);
}

function signUp() {

    var nick = document.getElementById('nickname').value;
    var birth = document.getElementById('birthdate').value;

    var today = new Date();
    var birthd = new Date(birth);
    var age = today.getFullYear()-birthd.getFullYear();

    if (nick == '') {
        document.getElementById('error').innerHTML = '<div class="alert alert-danger" role="alert">Input your nickname</div>';
        return false;
    } else if (nick.length < 3) {
        document.getElementById('error').innerHTML = '<div class="alert alert-danger" role="alert">Your nickname is too short</div>';
        return false;
    } else if (birth == '') {
        document.getElementById('error').innerHTML = '<div class="alert alert-danger" role="alert">Input your birthdate</div>';
        return false;
    } else if (age < 18) {
        document.getElementById('error').innerHTML = '<div class="alert alert-danger" role="alert">You are too young</div>';
        return false;
    } else {
        localStorage.setItem("nickname", nick);

        getOpenWeatherMapAPI();
        return false;
    }
}

function getOpenWeatherMapAPI() {

    const key = '861aad967943389f6633d6d80b599153';
    var url = 'https://uwpce-weather-proxy.herokuapp.com/data/2.5/weather?lat='
                + lat
                + '&lon='
                + longi
                + '&units=metric'
                + '&appid='
                + key;
    
    let request = new XMLHttpRequest();

    request.open("GET", url, true);
    request.onload = function() {
        let response = JSON.parse(request.response).body; 
        
        // check temp
        temp = response.main.temp;
        let footext = `You are located in ${response.name} with ${temp}&deg;C`;

        if (temp > 30) {

            Swal.fire({
                title: 'Attack Up',
                animation: false,
                customClass: 'animated jackInTheBox',
                imageUrl: 'https://discordapp.com/assets/f91ea6469f14105cd066e706c9862fa0.svg',
                imageHeight: '100',
                text: 'You are in your element',
                footer: footext
            }).then(function() {
                window.location.href = 'fight.html';
            });
            attackRange(5, 12);

        } else if (temp < 28) {

            Swal.fire({
                title: 'Attack Down',
                animation: false,
                customClass: 'animated jackInTheBox',
                imageUrl: 'https://discordapp.com/assets/afb82ce2cbadea31acc6f3374b7d338a.svg',
                imageHeight: '100',
                text: 'You are not in your element',
                footer: footext
            }).then(function() {
                window.location.href = 'fight.html';
            });
            attackRange(1, 8);

        } else if (temp >= 28 && temp <= 30) {
            
            Swal.fire({
                title: 'Fired Up',
                animation: false,
                customClass: 'animated jackInTheBox',
                imageUrl: 'https://discordapp.com/assets/0e2bb36113661c72bb9b3b4e5c834f97.svg',
                imageHeight: '100',
                text: 'Your element is in good shape',
                footer: footext
            }).then(function() {
                window.location.href = 'fight.html';
            });
            attackRange(3, 10);
        }
    }
    request.error = function(e) {
        alert(e);
    }
    request.send();
}

function attackRange(range1, range2) {

    for (var i = range1; i <= range2; i++)
        attackDamage.push(i);

    localStorage.setItem("damages", JSON.stringify(attackDamage));
}

function onFightMenu() {

    if (!startFight) {

        fightMenu = true;

        var 
            nickname = localStorage.getItem("nickname"),
            btnStartFight = document.getElementById('startFight'),
            btnAttack = document.getElementById('attack'),
            btnSpecialAttack = document.getElementById('specialAttack'),
            btnGiveUp = document.getElementById('giveUp')
        ;

        btnStartFight.style.visibility = 'visible';

        btnAttack.style.visibility = 'hidden';
        btnSpecialAttack.style.visibility = 'hidden';
        btnGiveUp.style.visibility = 'hidden';

        document.getElementById('nick').innerHTML = `<div class="card-header">${nickname}</div>`;

        $('#playerHP')
            .css("width", playerHealth + "%")
            .attr("aria-valuenow", playerHealth)
            .attr("aria-valuemax", playerHealth)
            .text(playerHealth + "%");

        $('#monsterHP')
            .css("width", monsterHealth + "%")
            .attr("aria-valuenow", monsterHealth)
            .attr("aria-valuemax", monsterHealth)
            .text(monsterHealth + "%");
    }
}

function onStartFight() {

    var 
        btnStartFight = document.getElementById('startFight'),
        btnAttack = document.getElementById('attack'),
        btnSpecialAttack = document.getElementById('specialAttack'),
        btnGiveUp = document.getElementById('giveUp')
    ;

    startFight = true;
        
    btnStartFight.style.visibility = 'hidden';
    btnAttack.style.visibility = 'visible';
    btnSpecialAttack.style.visibility = 'visible';
    btnGiveUp.style.visibility = 'visible';
}

function onHealthChange() {

    $('#playerHP')
        .css("width", playerHealth + "%")
        .attr("aria-valuenow", playerHealth)
        .attr("aria-valuemax", playerHealth)
        .text(playerHealth + "%");

    $('#monsterHP')
        .css("width", monsterHealth + "%")
        .attr("aria-valuenow", monsterHealth)
        .attr("aria-valuemax", monsterHealth)
        .text(monsterHealth + "%");
}

function getPlayerDamages(damages) {
    
    return damages[Math.floor(Math.random() * damages.length)];
}

function getRandomDamages(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function onBtnAttack() {

    if (startFight) {

        let 
            damage,
            damages = JSON.parse(localStorage.getItem("damages"))
        ;

        var nick = localStorage.getItem("nickname");

        const attackNotify = window.createNotification({
            closeOnClick: true,
            displayCloseButton: false,
            positionClass: 'nfc-bottom-right',
            showDuration: 3000,
            theme: 'error'
        });

        // Player
        damage = getPlayerDamages(damages);
        monsterHealth -= damage;
        onHealthChange();
        attackNotify({
            title: 'Attack',
            message: `${nick} hits Monster for ${damage}`
        });
        if (checkWinner()) {
            return;
        }

        // Monster
        damage = getRandomDamages(3, 10);
        playerHealth -= damage;
        onHealthChange();
        attackNotify({
            title: 'Attack',
            message: `Monster hits ${nick} for ${damage}`
        });
    }
}

function onBtnSpecialAttack() {

    if (startFight) {

        let damage;
        var nick = localStorage.getItem("nickname");

        const specialAttackNotify = window.createNotification({
            closeOnClick: true,
            displayCloseButton: false,
            positionClass: 'nfc-bottom-right',
            showDuration: 3000,
            theme: 'warning'
        });
    
        countSpecialAttack++;
        if (countSpecialAttack > 3) {
    
            // disable button
            document.getElementById('specialAttack').disabled = true;
        } else {
    
            // Player
            damage = getRandomDamages(10, 20);
            monsterHealth -= damage;
            onHealthChange();
            specialAttackNotify({
                title: 'Special Attack',
                message: `${nick} hits Monster for ${damage}`
            });
            if (checkWinner()) {
                return;
            }
    
            // Monster
            damage = getRandomDamages(3, 10);
            playerHealth -= damage;
            onHealthChange();
            specialAttackNotify({
                title: 'Special Attack',
                message: `Monster hits ${nick} for ${damage}`
            });
        }
    }
}

function onBtnGiveUp() {

    if (startFight) {

        Swal.fire({
            title: 'Are you sure?',
            animation: false,
            customClass: 'animated rotateInUpRight',
            imageUrl: 'https://cdn.discordapp.com/emojis/548831848650768388.png?v=1',
            imageHeight: 100,
            text: "You will lose and redirect to the fight menu",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                
                resetAll();
                onFightMenu();
            }
        });
    }
}

function checkWinner() {

    if (monsterHealth <= 0) {
        
        Swal.fire({
            title: 'You won!',
            animation: false,
            customClass: 'animated tada',
            imageUrl: 'https://cdn.discordapp.com/emojis/391143787100897280.png?v=1',
            imageHeight: 100,
            text: "New fight?",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                
                resetAll(2);
                onStartFight();
            } else {

                resetAll(3)
                onFightMenu();
            }
        });
        return true;
    }
    else if (playerHealth <= 0) {
        
        Swal.fire({
            title: 'You lost!',
            animation: false,
            customClass: 'animated tada',
            imageUrl: 'https://cdn.discordapp.com/emojis/391143787151360001.png?v=1',
            imageHeight: 100,
            text: "New fight?",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                
                resetAll(4);
                onStartFight();
            } else {

                resetAll(5);
                onFightMenu();
            }
        });
        return true;
    }
    return false;
}

function resetAll(defVal = 1) {

    if (defVal == 1) {
        
        // give up
        startFight = false;
        countSpecialAttack = 0;
        playerHealth = 100;
        monsterHealth = 100;
        document.getElementById('specialAttack').disabled = false;
    }
    else if (defVal == 2) {

        // winner 'OK'
        countSpecialAttack = 0;
        playerHealth = 100;
        monsterHealth = 100;
        onHealthChange();
        document.getElementById('specialAttack').disabled = false;
    }
    else if (defVal == 3) {

        // winner 'Cancel'
        startFight = false;
        countSpecialAttack = 0;
        playerHealth = 100;
        monsterHealth = 100;
        document.getElementById('specialAttack').disabled = false;
    }
    else if (defVal == 4) {

        // lost 'OK'
        countSpecialAttack = 0;
        playerHealth = 100;
        monsterHealth = 100;
        onHealthChange();
        document.getElementById('specialAttack').disabled = false;
    }
    else if (defVal == 5) {

        // lost 'Cancel'
        startFight = false;
        countSpecialAttack = 0;
        playerHealth = 100;
        monsterHealth = 100;
        document.getElementById('specialAttack').disabled = false;
    }
}

function saveHP() {

    if (fightMenu || startFight) {

        Swal.fire({
            position: 'center',
            imageUrl: 'https://discordapp.com/assets/d049def26c077694f4f184be88cea9bb.svg',
            imageHeight: 100,
            title: 'Save',
            text: 'Your and Monster health has been saved',
            showConfirmButton: false,
            timer: 3000
        }).then(function() {
            localStorage.setItem("playerHP", playerHealth);
            localStorage.setItem("monsterHP", monsterHealth);
        });
    }
}

function loadHP() {

    if (fightMenu || startFight) {

        Swal.fire({
            position: 'center',
            imageUrl: 'https://discordapp.com/assets/d049def26c077694f4f184be88cea9bb.svg',
            imageHeight: 100,
            title: 'Load',
            text: 'Your and Monster health has been loaded',
            showConfirmButton: false,
            timer: 3000
        }).then(function() {
            playerHealth = localStorage.getItem("playerHP");
            monsterHealth = localStorage.getItem("monsterHP");
            onHealthChange();
        });
    }
}