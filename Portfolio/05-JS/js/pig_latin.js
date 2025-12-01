/*
Pig Latin
*/

function igpayAtinlay(str) {

  var text = document.getElementById("txtVal").value;
  var output = document.getElementById("pigLatLbl");

  if (!text) {
    output.textContent = "Please enter a word";
    return;
  }
  
  var returnArray = [],
    wordArray = [];
    wordArray= text.split(" ");
  for (var i = 0; i < wordArray.length; i++) {
    var word = wordArray[i];
    var beginning = word.charAt(0);

    if (/[aeiouAEIOU]/.test(beginning)) {
      returnArray.push(word+ "way");
      continue;
    }
   else {
      var Cons_Clouser = "";
      var word2 = "";
      for (var ii = 0; ii < word.length; ii++) {
        var letter = word.charAt(ii);

        if (/[aeiouAEIOU]/.test(letter)) {
          word2 = word.slice(ii); //funcion slice sirve para separar stringd
          break;
        } else {
          Cons_Clouser += letter; 
        }
      }
      returnArray.push(word2 + Cons_Clouser + "ay");
    }
  }
  output.textContent = returnArray.join(" ");
}
