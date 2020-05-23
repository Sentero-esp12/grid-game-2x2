// ==UserScript==
// @name         _A grid game
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A grid game
// @author       You
// @match        https://lichess.org/inbox/*
// @grant        none
// ==/UserScript==

(function () {
   'use strict';


   function mute() {

   }

   let waitForGridSetup = true;
   let waitForThem = true;
   let waitForMe = true;
   let number_of_rounds = '?'// = 10
   let total = 0
   let [w, x, y, z] = ['?', '?', '?', '?']
   let choice = ""
   let theirChoice = ""
   let wEl, xEl, yEl, zEl, rounds
   let textArea
   let buttonToSendAMessage
   let waitForRound = true
   let score = 0

   $(document).ready(() => {

      let msgField = document.getElementsByClassName('msg-app__convo__post')[0];
      let wholeField = document.getElementsByClassName('msg-app__convo__reply')[0];
      let gameField = document.createElement('div');
      wholeField.insertBefore(gameField, msgField);
      gameField.id = 'gameGrid';
      gameField.setAttribute('style', 'border: solid 1px black; margin: 2px; width:91px; height: 51px;')
      gameField.innerHTML = `
  <div id='rounds' style='margin-top:-20px'>${number_of_rounds}</div>
  <div class='row' style='display:flex;'>
  <div class='tile' id='w' style='width: 73%;'>${w}</div>
  <div class='tile' id='x' style='width: 73%;'>${x}</div>
  
  </div>
  <div class='row' style='display:flex;'>
  <div class='tile' id='y' style='width: 73%;'>${y}</div>
  <div class='tile' id='z' style='width: 73%;'>${z}</div>
 
  </div>

  <div class='row' style='display:flex;'>
  <button class='button' style='width: 33%;padding: 7px;margin-right: 5px;'>c1</button>
  <button class='button' style='width: 33%;padding: 7px;margin-right: 5px;'>c2</button>
  <button class='button' style='width: 33%;padding: 7px;margin-right: 5px;'>r1</button>
  <button class='button' style='width: 33%;padding: 7px;margin-right: 5px;'>r2</button>
  </div>

  `
      setTimeout(() => {

         let arrOfElms = Array.prototype.slice.call(gameField.getElementsByClassName('tile'));
         //let arrOfElms = gameField.getElementsByClassName('tile')
         // rounds = document.getElementById('rounds')
         [wEl, xEl, yEl, zEl] = [
            arrOfElms[0], arrOfElms[1], arrOfElms[2], arrOfElms[3]
         ]
         rounds = document.getElementById('rounds')
         let buttons = Array.prototype.slice.call(gameField.getElementsByClassName('button'))
         buttons.map(x => { x.addEventListener('click', workWithChoice) })

         textArea = document.getElementsByClassName('msg-app__convo__post__text')[0],
            buttonToSendAMessage = document.getElementsByClassName('msg-app__convo__post__submit button connected')[0]

      }, 0);


   })


   function findScore(num) {


      score += num
      writeToChat(choice + "The current score is " + score)
      setTimeout(() => {
         writeToChat(choice + "The current score is " + score)
         setTimeout(() => {
            writeToChat(choice + "The current score is " + score)
         }, 500);
      }, 500);
      waitForThem = true
      waitForMe = true
      waitForRound = true
      --number_of_rounds
      rounds.innerText = number_of_rounds


      if (number_of_rounds < 1) {
         waitForGridSetup = true;
         waitForThem = true;
         waitForMe = true;
         number_of_rounds = 0// = 10
         total = 0
         w = '?', x = '?', y = '?', z = '?'
         choice = ""
         waitForRound = true
         score = 0
         wEl.innerText = w, xEl.innerText = x, yEl.innerText = y, zEl.innerText = z, rounds.innerText = number_of_rounds
      }



   }
   function calculateResult(text) {
      /* 
       c1 c2    
    r1 w  x
    r2 y  z 
    */
      return new Promise((res, rej) => {
         waitForRound = false;
         if (text == 'C1' && choice == 'R1') { res(w); return }
         if (text == 'C2' && choice == 'R2') { res(z); return }
         if (text == 'C1' && choice == 'R2') { res(y); return }
         if (text == 'C2' && choice == 'R1') { res(x); return }
         if (text == 'R1' && choice == 'C1') { res(w); return }
         if (text == 'R2' && choice == 'C2') { res(z); return }
         if (text == 'R1' && choice == 'c2') { res(x); return }
         if (text == 'R2' && choice == 'C1') { res(y); return }

         waitForRound = true;
         rej()
      })
   }


   function writeToChat(message) {
      textArea = document.getElementsByClassName('msg-app__convo__post__text')[0],
         buttonToSendAMessage = document.getElementsByClassName('msg-app__convo__post__submit button connected')[0]
      textArea.value = message,
         buttonToSendAMessage.click();
   }
   function tellThatYouAreReady() {
      textArea = document.getElementsByClassName('msg-app__convo__post__text')[0],
         buttonToSendAMessage = document.getElementsByClassName('msg-app__convo__post__submit button connected')[0]
      textArea.value = '`ready',
         buttonToSendAMessage.click();
   }
   function proceedWithRevealing() {



      textArea = document.getElementsByClassName('msg-app__convo__post__text')[0],
         buttonToSendAMessage = document.getElementsByClassName('msg-app__convo__post__submit button connected')[0]

      tellThatYouAreReady()

      setTimeout(() => {


         textArea.value = choice,

            buttonToSendAMessage.click();
         buttonToSendAMessage.click();
         buttonToSendAMessage.click();
         buttonToSendAMessage.click();
         setTimeout(() => {


            buttonToSendAMessage.click();
            buttonToSendAMessage.click();
            setTimeout(() => {
               buttonToSendAMessage.click();
            }, 500);
         }, 100);
      }, 450);




      if (!waitForRound)
         calculateResult(theirChoice).then(x => findScore(x)).catch(e => { mute(e) })




      /*  */
   }
   function workWithChoice() {
      mute(this.innerText)
      waitForMe = false
      choice = this.innerText
      if (!waitForThem)
         proceedWithRevealing()
      else tellThatYouAreReady()

   }


   function setUpTheGrid(array) {
      [w, x, y, z, number_of_rounds] = array;
      [wEl.innerText, xEl.innerText, yEl.innerText, zEl.innerText, rounds.innerText] = [w, x, y, z, number_of_rounds]
   }


   window.lichess.pubsub.on("socket.in.msgNew", (...args) => {
      mute(...args);
      let data = [...args][0]
      if (waitForGridSetup) {
         try {
            let text = data.text;
            let array = JSON.parse(text.slice(1))
            if (text && text.slice(0, 1).toLowerCase() === 'g' &&
               Array.isArray(array) && array.length === 5) {
               waitForGridSetup = false;
               setUpTheGrid(array)
            }
         } catch (err) { mute(err) }

      }
      else
         if (waitForThem) {
            try {
               let text = data.text;
               if (text && text.toLowerCase() === '`ready') {
                  waitForThem = false;
                  console.log('waitForThem = false;')
                  if (!waitForMe)
                     proceedWithRevealing()
               }
            } catch (err) { mute(err) }

         } else
            if (waitForMe) {


            }
      if (waitForRound) {
         try {
            let text = data.text;
            if (text === 'C1' || text === 'C2' || text === 'R1' || text === 'R2') {

               if (!waitForMe) calculateResult(text).then(x => findScore(x)).catch(e => { mute(e) })
               else {
                  waitForRound = false;
                  theirChoice = text
               }
            }
         } catch (err) { mute(err) }
      }
   })

   window.lichess.pubsub.on("socket.send", (...args) => {
      mute(...args);
      let data = [...args]
      if (waitForGridSetup) {
         try {
            let type = data[0]
            let dataMessage = data[1]
            let text = dataMessage.text;
            let array = JSON.parse(text.slice(1))
            if (type === 'msgSend' && text && text.slice(0, 1).toLowerCase() === 'g' &&
               Array.isArray(array) && array.length === 5) {
               waitForGridSetup = false;
               setUpTheGrid(array)
            }
         } catch (err) { mute(err) }

      }
   })

/* 
   function print(...args) {

   }

   function printgrid(w, x, y, z) {
      print("-----")
      print("|", w, "|", x, "|")
      print("-----")
      print("|", y, "|", z, "|")
      print("-----")
   }

   function printscore(score) {
      print("Total score is ", score)
   }

   function playround(w, x, y, z) {
      print("player A")
      print('press 1 for row 1 or 2 for row 2')
      // A = input("> ")
      print("player B")
      print('press 1 for col 1 or 2 for col 2')
      // B = input("> ")
      if (A == '1' && B == '1') return w
      if (A == '1' && B == '2') return x
      if (A == '2' && B == '1') return y
      if (A == '2' && B == '2') return z
      print("error, inputs must be 2 or 1")
   }

 */






})();