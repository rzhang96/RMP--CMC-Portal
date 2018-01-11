function addTooltip(info, element, hasError) {
        // create/attach tooltip card
    var card = document.createElement("div");
    card.setAttribute("class", "cardContainer");

        // check for erroneous response
        if (hasError) {
            card.innerHTML = "<div class='card'> <div class='card-content'> <span class='card-title'></span> <p> <span class='cardError'><b>Error:</b> " + info.error + "</p></span> </div> </div>";
        } else {
            card.innerHTML = "<div class='card'> <div class='card-content'> <span class='card-title'>" + info.name + "</span> <table id='headRatingTable'> <tr id='headRatingLabel'> <td>Overall:</td> <td>Would Take Again:</td> </tr> <tr id='headRating'> <td>"+ info.overall +"</td> <td>"+ info.wouldTake +"</td> </tr> </table> <table id='subRatingTable'> <tr> <td>Difficulty:</td> <td><svg width='130px' height='13px' version='1.1'> <g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g sketch:type='MSLayerGroup' transform='translate(-106.000000, -144.000000)' stroke-linecap='square' stroke-width='2' fill='#009688'> <g id='sub-Ratings' transform='translate(18.000000, 141.000000)' sketch:type='MSShapeGroup'> <g id='slider' transform='translate(89.000000, 4.000000)'> <path d='M0.5,6 L137.003662,6' id='Line' stroke='#D8D8D8'></path> <circle id='Path' stroke='#009688' cx=" + info.scaled.difficulty + " cy='5.5' r='5.5'></circle> </g> </g> </g> </g> </svg></td> <td>" + info.helpfulness + "</td> </tr> <tr> <td>Clarity:</td> <td><svg width='130px' height='13px' version='1.1'> <g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g sketch:type='MSLayerGroup' transform='translate(-106.000000, -144.000000)' stroke-linecap='square' stroke-width='2' fill='#009688'> <g id='sub-Ratings' transform='translate(18.000000, 141.000000)' sketch:type='MSShapeGroup'> <g id='slider' transform='translate(89.000000, 4.000000)'> <path d='M0.5,6 L137.003662,6' id='Line' stroke='#D8D8D8'></path> <circle id='Path' stroke='#009688' cx=" + info.scaled.clarity + " cy='5.5' r='5.5'></circle> </g> </g> </g> </g> </svg></td> <td>" + info.clarity + "</td> </tr> <tr> <td>Easiness:</td> <td><svg width='130px' height='13px' version='1.1'> <g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g sketch:type='MSLayerGroup' transform='translate(-106.000000, -144.000000)' stroke-linecap='square' stroke-width='2' fill='#009688'> <g id='sub-Ratings' transform='translate(18.000000, 141.000000)' sketch:type='MSShapeGroup'> <g id='slider' transform='translate(89.000000, 4.000000)'> <path d='M0.5,6 L137.003662,6' id='Line' stroke='#D8D8D8'></path> <circle id='Path' stroke='#009688' cx=" + info.scaled.easiness + " cy='5.5' r='5.5'></circle> </g> </g> </g> </g> </svg></td> <td>" + info.easiness + "</td> </tr> </table> </div> <div class='card-action'> <a target='_blank' href='http://www.ratemyprofessors.com" + info.link + "'>View Rating</a> <a class='add-btn' target='_blank' href='http://www.ratemyprofessors.com/AddRating.jsp?tid=" + info.link.split('tid=')[1] + "'>Add Rating</a> </div> </div>";
        }
    element.appendChild(card);

    // add event listener to keep card displayed on hover
    var cardContainer = element.getElementsByClassName('cardContainer')[0];
    element.addEventListener("mouseover", function() {
            window.clearTimeout(this.timeoutID);
            cardContainer.style.display = 'block';
    });
    element.addEventListener("mouseout", function() {
            this.timeoutID = window.setTimeout(function() {
                cardContainer.style.display = 'none';
            }, 25);
    });
}

function addRatingTh(row) {
  var headRow = row.parentNode.firstChild;
  var rating = document.createElement("th");
  rating.innerHTML = "Rating";
  headRow.insertBefore(rating, headRow.childNodes[12]);
}

function addRatingColumn(info, element) {
  var cell = element.parentNode.insertCell(6);

  // set corresponding html
  if (info.hasOwnProperty("error")) {
    cell.innerHTML = "<span class='ratingCell errorCell'>N/A</span>";
    addTooltip(info,cell,true);
  } else {
    cell.innerHTML = "<span class='ratingCell'>" + info.overall + "</span>";
    addTooltip(info,cell,false);
  }
}

function getProfInfo (nameText, profElement){

    console.log("Getting prof and formatting...");

    //format json
    if (nameText){
                var request = { name: nameText };
    }
    else{
        return null;
    }

    console.log(request);

    //get possible nicknames
    var firstName = nameText.split([" "])[0].toLowerCase();
    console.log(firstName);
    var alternateNames = [];

    for (var i = 0; i < nickNames.length; i++){

        if (nickNames[i].name.toLowerCase() == firstName){
            console.log("Match on " + nickNames[i].name.toLowerCase());
            var tmpName = nickNames[i].nickName;
            console.log(tmpName);
            console.log(tmpName.substring(0,1));
            tmpName = tmpName.substring(0,1).toUpperCase() + tmpName.slice(1,tmpName.length).toLowerCase();
            alternateNames.push(tmpName);
        }
    }

    return requestProf(request, profElement, alternateNames);

}

function requestProf( request, passedElement, nickNameArray){

    console.log(nickNameArray);

    return chrome.runtime.sendMessage( request, function(response) {

        console.log("response: " + response);

        if (response.hasOwnProperty("error") && nickNameArray.length > 0){

            var newFirstName = nickNameArray[0];
            var lastName = request.name.split([" "])[1];
            var newRequest = { name: newFirstName + " " + lastName};
            nickNameArray.splice(0,1);

            requestProf(newRequest, passedElement, nickNameArray);

        }
        else {
            addRatingColumn(response, passedElement);
        }
    });

}

function formatName (name) {
    var nameArray = name.split(",");
    if (nameArray[0] && nameArray[1]){

        nameArray[0] = nameArray[0].toLowerCase().trim().replace( /\b\w/g, function (m) {
                return m.toUpperCase();
            });
        nameArray[1] = nameArray[1].toLowerCase().trim().replace( /\b\w/g, function (m) {
                return m.toUpperCase();
            });

                return nameArray[1] + " " + nameArray[0];
    }

    return null;
}

function fillProfs (profRows){

    console.log("getProfs...");

    //check to see if null or undefined
    if (!profRows) {return;}

    // add rating cell to remaining if rating header added
    var addCell = false;
    var profNames = [];
    for (i = 0; i < profRows.length; i++){
      //if (!profRows.item(i).includes("campus")) {
        if (!profRows.item(i).innerHTML.includes("Campus") || !profRows.item(i).innerHT){
          //console.log(profRows.item(i).innerHTML);
          var currProfText = profRows.item(i).innerHTML;
          profNames.push(currProfText);
          console.log(profNames);
        }
        
      
        // var rowCells = profRows[i].getElementsByTagName("li");

        // var currProf = rowCells[5];
        // var currProfText = currProf.textContent;

        // if (currProfText.length > 0){
        //     var profName = formatName(currProfText);
        //     console.log("prof name: " + profName);

        //     if (profName){
        //       if (i == 0) {
        //         addRatingTh(profRows[0]);
        //         addCell = true;
        //       }
        //         getProfInfo(profName, currProf);
        //     } else if (addCell) {
        //         profRows[i].insertCell(6);
        //     } 
        // }
    //}
  }
}

// specify tableRows element to parse for prof name
var insertDivContent = function(event, isCoursePage){
  console.log("test1");


    // get the table rows
    var divAdded;
    if (isCoursePage) {
      divAdded = document.querySelectorAll("tbody.gbody")[0];
      console.log("got body");
    } else {
      divAdded = event.target.getElementsByTagName("tbody")[0];
      console.log("bleh");
    }

    if (divAdded !== undefined) {
      console.log(divAdded);
      var tableRows = divAdded.querySelectorAll("li");
      // for (var i = 0; i < tableRows.length; i++) {
      //   console.log(tableRows.item(i));
      // }
      console.log(tableRows);
      fillProfs(tableRows);
    }
};

// on node insertion
document.addEventListener("animationstart", insertDivContent, false);
console.log("test");

// insert styles into head
function insertStylesToHead() {
  // roboto webfont to html head
  var roboto = document.createElement("link");
  roboto.rel = "stylesheet";
  roboto.type = "text/css";
  roboto.href = "https://fonts.googleapis.com/css?family=Roboto:400,300,700";
  document.head.appendChild(roboto);

  // master style element to html head
  var style = document.createElement("style");
  var ratingCellStyle = ".ratingCell { font-family: Roboto; font-weight: 300; font-size: 0.8rem; color: #fff; background-color: #26a69a; border-radius: 2px; padding: 2px 6px; text-align: center !important; margin: 0 6px; } .errorCell { background-color: #DFDFDF !important; color: #9F9F9F !important; margin: 3px; } ";
  var toolTipStyle = ".cardContainer { display: none; margin: 0; position: absolute; right: 14.5%; } .cardContainer tr { border-style: hidden !important; } .card { line-height: 1.5; font-family: 'Roboto', sans-serif; font-weight: normal; width: 300px; overflow: hidden; margin: 0.5rem 0 1rem 0; background-color: #fff; border-radius: 2px; box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); transition: box-shadow .25s; } .card .card-content { padding: 20px; border-radius: 0 0 2px 2px; color: rgba(0,0,0,0.54); } .card .card-content p { font-size: 14px; } .card .card-content .card-title { line-height: 28px; color: black; font-size: 24px; font-weight: 400; } .card .card-action { border-top: 1px solid rgba(160, 160, 160, 0.2); padding: 20px; } .card .card-action a { text-decoration: none; font-size: 14.5px; color: #ffab40 !important; margin-right: 20px; transition: color .3s ease; transition-property: color; transition-duration: 0.3s; transition-timing-function: ease; transition-delay: initial; text-transform: uppercase; } .card .card-action a:hover { color: #ffd8a6 !important; text-decoration: none; } a { text-decoration: none; background-color: transparent; } .profRating { font-size: 18px; font-weight: 700; } .card-content table { color: rgba(0,0,0,0.54); width: 100%; } .card-content table td { background-color: white !important; } #headRatingTable { margin-top: 20px; margin-bottom: 15px; text-align: center; height: 48px; } #headRatingTable td { width: 130px; } #headRatingLabel { font-size: 13px; line-height: 13px; } #headRating { font-size: 34px; line-height: 34px; } #subRatingTable { font-size: 14px; line-height: 26.67px; } #subRatingTable tr td:nth-child(1) { } #subRatingTable tr td:nth-child(3) { font-size: 18px; font-weight: 700; text-align: right; } td span.ratingCell, td div.cardContainer { font-style: normal; } .add-btn { float: right; margin-right: 0 !important; }";
  style.innerHTML = ratingCellStyle + toolTipStyle;
  document.head.appendChild(style); 
}

if (document.readyState === "complete") {
  insertStylesToHead();

  // handle course pages
    console.log("attempting to insert");
    insertDivContent(null, true);
};