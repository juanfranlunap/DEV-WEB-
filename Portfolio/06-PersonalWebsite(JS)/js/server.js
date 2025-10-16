function addToSchedule() {
    
  var date = document.getElementById("date").value;
  var start = document.getElementById("start").value;
  var end = document.getElementById("end").value;
  var activity = document.getElementById("activity").value;
  var place = document.getElementById("place").value;
  var type = document.getElementById("type").value;
  var notes = document.getElementById("notes").value;
  var busy = document.getElementById("busy").checked;

  var table = document.querySelector("table tbody");

  var row = table.insertRow();

  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
  var cell8 = row.insertCell(7);

  cell1.innerHTML = date;
  cell2.innerHTML = start;
  cell3.innerHTML = end;
  cell4.innerHTML = activity;
  cell5.innerHTML = place;
  cell6.innerHTML = type;
  cell7.innerHTML = notes;

  if (busy) {
    cell8.innerHTML = '<img src="images/busy.png" alt="Busy" style="height:20px">';
  } else {
    cell8.innerHTML = '<img src="images/free.png" alt="Free" style="height:20px">';
  }

  document.getElementById("date").value = "";
  document.getElementById("start").value = "";
  document.getElementById("end").value = "";
  document.getElementById("activity").value = "";
  document.getElementById("place").value = "";
  document.getElementById("type").value = "school";
  document.getElementById("notes").value = "";
  document.getElementById("busy").checked = false;
}
